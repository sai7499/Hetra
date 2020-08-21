import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilityService } from '@services/utility.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { NumberFormatStyle } from '@angular/common';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { environment } from 'src/environments/environment';

// for sales
export enum DisplayTabs {
  Leads,
  PD,
  Viability,
  NewLeads,
  SanctionedWithMe,
  SanctionedWithBranch,
  DeclinedWithMe,
  DeclinedWithBranch,
  MyPD,
  BranchPd,
  ViabilityWithMe,
  ViabilityWithBranch,
  FI,
  MyFI,
  BranchFI,
  LoanBooking,
  LoanBookingWithMe,
  LoanBookingWithBranch,
  LoanDisbursement,
  LoanDisbursementWithMe,
  LoanDisbursementWithBranch,
  Negotiation,
  NegotiatinWithMe,
  NegotiatinWithBranch,
  Disbursement,
  DisbursementWithMe,
  DisbursementWithBranch,
  PDD,
  ChequeTracking,
}

// for credit
export enum DisplayCreditTabs {
  DDE,
  PD,
  Deviation,
  Decision,
  DDEWithMe,
  DDEWithBranch,
  MyPD,
  BranchPd,
  DeviationWithMe,
  DeviationWithBranch,
  CreditDecisionWithMe,
  CreditDecisionWithBranch,
  FI,
  MyFI,
  BranchFI,
  TermSheet,
  TermSheetWithMe,
  TermSheetWithBranch
}

// for CPC
export enum DisplayCPCTabs {
  CPCMaker,
  CPCMakerWithMe,
  CPCMakerWithBranch,
  CPCChecker,
  CPCCheckerWithMe,
  CPCCheckerWithBranch,

}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  filterForm: FormGroup;
  showFilter;
  roleType;
  labels: any = {};
  validationData;
  isDirty: boolean;
  filterFormDetails: any;
  businessDivision: any;
  productCategoryList = [];
  productCategoryData: any;
  stageList = [];
  stageData: any;
  OldFromDate: Date;
  // new leads
  newArray;
  pddDetails;
  chequeTrackingDetails;
  processLogs;
  salesLeads;
  creditLeads;
  itemsPerPage = '25';
  totalItems;
  // labels: any = {};
  lovData: any;
  count: any;
  currentPage: any;
  limit;
  pageNumber;
  from;
  isCreditShow;
  branchId;
  roleId;
  activeTab;
  subActiveTab;
  isFilterApplied: boolean;
  toDayDate: Date = new Date();



  // roleType;
  isLoadLead = true;
  leadSection = true;
  salesLead = true;
  // PD: boolean;
  // vehicle: boolean;
  onAssignTab: boolean;
  onReleaseTab: boolean;

  // for CPC Maker and Checker
  onMaker = true;
  onChecker = true;
  makerWithMe: boolean;
  makerWithCPC: boolean;
  checkerWithMe: boolean;
  checkerWithCPC: boolean;

  displayTabs = DisplayTabs;
  displayCreditTabs = DisplayCreditTabs;
  displayCPCTabs = DisplayCPCTabs;
  // slectedDateNew: Date = this.filterFormDetails ? this.filterFormDetails.fromDate : '';

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService,
    private utilityService: UtilityService,
    private labelsData: LabelsService,
    private vehicleDataStoreService: VehicleDataStoreService,
    private router: Router,
    // public displayTabs: DisplayTabs,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private applicantStoreService: ApplicantDataStoreService
  ) {
    if (environment.isMobile === true) {
       this.itemsPerPage = '5';
     } else {
       this.itemsPerPage = '25';
     }
    // if (window.screen.width > 768) {
    //   this.itemsPerPage = '25';
    // } else if (window.screen.width <= 768) {
    //   this.itemsPerPage = '5';
    // }
  }

  onTabsLoading(data) {
    if (this.activeTab === this.displayTabs.PDD) {
      this.getPDDLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.ChequeTracking) {
      this.getChequeTrackingLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.LoanBooking) {
      this.getProcessLogsLeads(this.itemsPerPage);
    }
    if (this.roleType === 1) {
      switch (data) {
        case 3:
          this.getSalesFilterLeads(this.itemsPerPage);
          break;
        case 4:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getSanctionedLeads(this.itemsPerPage);
          break;
        case 5:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getSanctionedBranchLeads(this.itemsPerPage);
          break;
        case 6:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getDeclinedLeads(this.itemsPerPage);
          break;
        case 7:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getDeclinedBranchLeads(this.itemsPerPage);
          break;
        case 8:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getPdMyTask(this.itemsPerPage);
          break;
        case 9:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getPdBranchTask(this.itemsPerPage);
          break;
        case 10:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getViabilityLeads(this.itemsPerPage);
          break;
        case 11:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getViabilityBranchLeads(this.itemsPerPage);
          break;
        case 13:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyFITask(this.itemsPerPage);
          break;
        case 14:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchFITask(this.itemsPerPage);
          break;
        default:
          break;
      }
    } else if (this.roleType === 2) {
      switch (data) {
        case 4:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyDDELeads(this.itemsPerPage);
          break;
        case 5:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchDDELeads(this.itemsPerPage);
          break;
        case 6:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getPdMyTask(this.itemsPerPage);
          break;
        case 7:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getPdBranchTask(this.itemsPerPage);
          break;
        case 8:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyDeviationLeads(this.itemsPerPage);
          break;
        case 9:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchDeviationLeads(this.itemsPerPage);
          break;
        case 10:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyDecisionLeads(this.itemsPerPage);
          break;
        case 11:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchDecisionLeads(this.itemsPerPage);
          break;
        case 13:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyFITask(this.itemsPerPage);
          break;
        case 14:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchFITask(this.itemsPerPage);
          break;
        case 16:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMyTermsheetLeads(this.itemsPerPage);
          break;
        case 17:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getBranchTermsheetLeads(this.itemsPerPage);
          break;
        default:
          break;
      }
    } else if (this.roleType === 4) {
      switch (data) {
        case 1:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getMakerLeads(this.itemsPerPage);
          break;
        case 2:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getMakerCPCLeads(this.itemsPerPage);
          break;
        default:
          break;
      }
    } else if (this.roleType === 5) {
      switch (data) {
        case 4:
          this.onAssignTab = false;
          this.onReleaseTab = true;
          this.getCheckerLeads(this.itemsPerPage);
          break;
        case 5:
          this.onAssignTab = true;
          this.onReleaseTab = false;
          this.getCheckerCPCLeads(this.itemsPerPage);
          break;
        default:
          break;
      }
    }
  }

  ngOnInit() {

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.businessDivision = value.businessDivision[0].bizDivId;
      this.roleType = value.roleType;
    });

    if (this.dashboardService.routingData) {
      this.activeTab = this.dashboardService.routingData.activeTab;
      this.subActiveTab = this.dashboardService.routingData.subActiveTab;
      this.onTabsLoading(this.subActiveTab);
    } else {
      if (this.roleType === 1 || this.roleType === 2 || this.roleType === 4) {
        this.activeTab = 0;
        if (this.roleType === 1 || this.roleType === 2) {
          this.subActiveTab = this.roleType === 1 ? 3 : 4;
        } else if (this.roleType === 4) {
          this.subActiveTab = 1;
        }
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType === 5) {
        this.activeTab = 3;
        this.subActiveTab = 4;
        this.onTabsLoading(this.subActiveTab);
      }

    }

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });

    this.filterForm = this.fb.group({
      leadId: [''],
      product: [''],
      leadStage: [''],
      fromDate: [''],
      toDate: [''],
      loanMinAmt: [''],
      loanMaxAmt: ['']
    });

    this.dashboardFilter();
  }


  // changing main tabs
  onLeads(data, subTab) {

    this.activeTab = data;
    this.subActiveTab = subTab;
    if (this.activeTab === this.displayTabs.Leads && this.subActiveTab === this.displayTabs.NewLeads) {
      this.onReleaseTab = false;
      this.onAssignTab = false;
    } else {
      this.onReleaseTab = true;
      this.onAssignTab = false;
    }
    if (this.roleType === 1) {
      if (this.activeTab === this.displayTabs.Leads && this.subActiveTab === this.displayTabs.NewLeads) {
        this.getSalesFilterLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.PD && this.subActiveTab === this.displayTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.Viability && this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.getViabilityLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.FI && this.subActiveTab === this.displayTabs.MyFI) {
        this.getMyFITask(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.PDD) {
        this.getPDDLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.ChequeTracking) {
        this.getChequeTrackingLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayTabs.LoanBooking) {
        this.getProcessLogsLeads(this.itemsPerPage);
      }
    } else if (this.roleType === 2) {
      if (this.activeTab === this.displayCreditTabs.DDE && this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.getMyDDELeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayCreditTabs.PD && this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.activeTab === this.displayCreditTabs.Deviation && this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.getMyDeviationLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayCreditTabs.Decision && this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.getMyDecisionLeads(this.itemsPerPage);
      } else if (this.activeTab === this.displayCreditTabs.FI && this.subActiveTab === this.displayCreditTabs.MyFI) {
        this.getMyFITask(this.itemsPerPage);
      } else if (this.activeTab === this.displayCreditTabs.TermSheet && this.subActiveTab === this.displayCreditTabs.TermSheetWithMe) {
        this.getMyTermsheetLeads(this.itemsPerPage);
      }
    } else if (this.roleType === 4) {
      this.getMakerLeads(this.itemsPerPage);
    } else if (this.roleType === 5) {
      this.getCheckerLeads(this.itemsPerPage);
    }

  }

  // changing sub tabs
  leads(data) {
    this.subActiveTab = data;
    if (this.subActiveTab === this.displayTabs.NewLeads) {
      this.onReleaseTab = false;
      this.onAssignTab = false;
    } else {
      this.onReleaseTab = true;
      this.onAssignTab = false;
    }
    this.onTabsLoading(this.subActiveTab);
  }

  dateToFormate(date) {
    return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
  }


  // for getting productCatagory and leadStage
  dashboardFilter() {
    const data = {
      bizDiv: this.businessDivision
    };
    this.dashboardService.dashboardFilter(data).subscribe((res: any) => {
      this.productCategoryList = res.ProcessVariables.productCategory;
      this.productCategoryData = this.utilityService.getValueFromJSON(
        this.productCategoryList,
        'categoryCode',
        'categoryName'
      );

      this.stageList = res.ProcessVariables.stageList;
      this.stageData = this.utilityService.getValueFromJSON(
        this.stageList,
        'stageCode',
        'stageValue'
      );

    });
  }

  // getting response Data for all tabs
  setPageData(res) {
    const response = res.ProcessVariables.loanLead;
    this.newArray = response;
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
    this.from = res.ProcessVariables.from;
  }

  setPDDPageData(res) {
    if (this.activeTab === this.displayTabs.PDD) {
      const response = res.ProcessVariables.pddDetails;
      this.pddDetails = response;
    } else if (this.activeTab === this.displayTabs.ChequeTracking) {
      const response = res.ProcessVariables.chequeTrackingDetails;
      this.pddDetails = response;
    } else if (this.activeTab === this.displayTabs.LoanBooking) {
      const response = res.ProcessVariables.processLogs;
      this.pddDetails = response;
    }
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
    this.from = res.ProcessVariables.from;
  }

  // setChequeTrackingPageData(res) {
  //   const response = res.ProcessVariables.chequeTrackingDetails;
  //   this.chequeTrackingDetails = response;
  //   this.limit = res.ProcessVariables.perPage;
  //   this.pageNumber = res.ProcessVariables.from;
  //   this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
  //   this.currentPage = res.ProcessVariables.currentPage;
  //   this.totalItems = res.ProcessVariables.totalPages;
  //   this.from = res.ProcessVariables.from;
  // }

  // setProcessLogsPageData(res) {
  //   const response = res.ProcessVariables.processLogs;
  //   this.processLogs = response;
  //   this.limit = res.ProcessVariables.perPage;
  //   this.pageNumber = res.ProcessVariables.from;
  //   this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
  //   this.currentPage = res.ProcessVariables.currentPage;
  //   this.totalItems = res.ProcessVariables.totalPages;
  //   this.from = res.ProcessVariables.from;
  // }

  // for MyLeads Api
  responseForSales(data) {
    this.dashboardService.myLeads(data).subscribe((res: any) => {
      this.setPageData(res);
      if (res.ProcessVariables.loanLead != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
        this.newArray = [];
      }
    });
  }

  // for PDD Leads
  responseForPDD(data) {
    this.dashboardService.myLeads(data).subscribe((res: any) => {
      this.setPDDPageData(res);
      if (res.ProcessVariables.pddDetails != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
        this.pddDetails = [];
      }
    });
  }

  // for Cheque tracking
  responseForChequeTracking(data) {
    this.dashboardService.myLeads(data).subscribe((res: any) => {
      // this.setChequeTrackingPageData(res);
      this.setPDDPageData(res);
      if (res.ProcessVariables.chequeTrackingDetails != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
        this.chequeTrackingDetails = [];
      }
    });
  }

  // for process logs
  responseForProcessLogs(data) {
    this.dashboardService.myLeads(data).subscribe((res: any) => {
      // this.setProcessLogsPageData(res);
      this.setPDDPageData(res);
      if (res.ProcessVariables.processLogs != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
        this.processLogs = [];
      }
    });
  }

  // new leads
  getSalesFilterLeads(perPageCount, pageNumber?) {

    // this.filterFormDetails['userId'] = localStorage.getItem('userId');
    // this.filterFormDetails['perPage'] = parseInt(perPageCount);
    // this.filterFormDetails['currentPage'] = parseInt(pageNumber);
    // const data = this.filterFormDetails;
    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      isPDD: false,
      isChequeTracking: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };

    this.responseForSales(data);
  }

  getPDDLeads(perPageCount, pageNumber?) {

    // this.filterFormDetails['userId'] = localStorage.getItem('userId');
    // this.filterFormDetails['perPage'] = parseInt(perPageCount);
    // this.filterFormDetails['currentPage'] = parseInt(pageNumber);
    // const data = this.filterFormDetails;
    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      isPDD: true,
      isChequeTracking: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };

    this.responseForPDD(data);
  }

  getChequeTrackingLeads(perPageCount, pageNumber?) {

    // this.filterFormDetails['userId'] = localStorage.getItem('userId');
    // this.filterFormDetails['perPage'] = parseInt(perPageCount);
    // this.filterFormDetails['currentPage'] = parseInt(pageNumber);
    // const data = this.filterFormDetails;
    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      isPDD: false,
      isChequeTracking: true,
      isLog: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };

    this.responseForChequeTracking(data);
  }

  getProcessLogsLeads(perPageCount, pageNumber?) {

    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      isPDD: false,
      isChequeTracking: false,
      isLog: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };

    this.responseForProcessLogs(data);
  }

  // For TaskDashboard Api
  responseForCredit(data) {
    this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
      this.setPageData(res);
      if (res.ProcessVariables.loanLead != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
        this.newArray = [];
      }
    });
  }

  // for Sanctioned Leads with Me
  getSanctionedLeads(perPageCount, pageNumber?) {
    // this.filterFormDetails.userId = localStorage.getItem('userId');
    // this.filterFormDetails.perPage = parseInt(perPageCount);
    // this.filterFormDetails.currentPage = parseInt(pageNumber);
    // const data = this.filterFormDetails;
    const data = {
      taskName: 'Sanctioned Leads',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };

    this.responseForCredit(data);
  }

  // for Sanctioned Leads with Branch
  getSanctionedBranchLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Sanctioned Leads',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Declined Leads with Me
  getDeclinedLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Declined Leads',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Declined Leads with Branch
  getDeclinedBranchLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Declined Leads',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for PD with Me
  getPdMyTask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Personal Discussion',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for PD with Branch
  getPdBranchTask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Personal Discussion',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for FI with Me
  getMyFITask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Field Investigation',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for FI with Branch
  getBranchFITask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Field Investigation',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Viability with Me
  getViabilityLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Vehicle Viability',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Viability with Branch
  getViabilityBranchLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Vehicle Viability',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for credit flow dashboard

  // for DDE leads with me
  getMyDDELeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'DDE',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE leads with Branch
  getBranchDDELeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'DDE',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Deviation leads with Me
  getMyDeviationLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Deviation',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Deviation leads with Branch
  getBranchDeviationLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Deviation',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Decision leads with Me
  getMyDecisionLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Credit Decision',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Decision leads with Branch
  getBranchDecisionLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Credit Decision',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Termsheet leads with Me
  getMyTermsheetLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'TermSheet',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for Termsheet leads with Branch
  getBranchTermsheetLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'TermSheet',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Maker with Me
  getMakerLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'CPC Maker',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);

  }

  // for DDE Maker with CPC
  getMakerCPCLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'CPC Maker',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);

  }

  // for DDE Checker with Me
  getCheckerLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'CPC Checker',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  // for DDE Checker with CPC
  getCheckerCPCLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'CPC Checker',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }




  setPage(event) {

    if (this.roleType === 1) {
      if (this.displayTabs.PDD === this.activeTab) {
          this.getPDDLeads(this.itemsPerPage, event);
      } else if (this.displayTabs.ChequeTracking === this.activeTab) {
          this.getChequeTrackingLeads(this.itemsPerPage, event);
      } else if (this.displayTabs.LoanBooking === this.activeTab) {
        this.getProcessLogsLeads(this.itemsPerPage, event);
    }
      switch (this.subActiveTab) {
        case 3:
          this.getSalesFilterLeads(this.itemsPerPage, event);
          break;
        case 4:
          this.getSanctionedLeads(this.itemsPerPage, event);
          break;
        case 5:
          this.getSanctionedBranchLeads(this.itemsPerPage, event);
          break;
        case 6:
          this.getDeclinedLeads(this.itemsPerPage, event);
          break;
        case 7:
          this.getDeclinedBranchLeads(this.itemsPerPage, event);
          break;
        case 8:
          this.getPdMyTask(this.itemsPerPage, event);
          break;
        case 9:
          this.getPdBranchTask(this.itemsPerPage, event);
          break;
        case 10:
          this.getViabilityLeads(this.itemsPerPage, event);
          break;
        case 11:
          this.getViabilityBranchLeads(this.itemsPerPage, event);
          break;
        case 13:
          this.getMyFITask(this.itemsPerPage, event);
          break;
        case 14:
          this.getBranchFITask(this.itemsPerPage, event);
          break;
        default:
          break;
      }
    } else if (this.roleType === 2) {
      switch (this.subActiveTab) {
        case 4:
          this.getMyDDELeads(this.itemsPerPage, event);
          break;
        case 5:
          this.getBranchDDELeads(this.itemsPerPage, event);
          break;
        case 6:
          this.getPdMyTask(this.itemsPerPage, event);
          break;
        case 7:
          this.getPdBranchTask(this.itemsPerPage, event);
          break;
        case 8:
          this.getMyDeviationLeads(this.itemsPerPage, event);
          break;
        case 9:
          this.getBranchDeviationLeads(this.itemsPerPage, event);
          break;
        case 10:
          this.getMyDecisionLeads(this.itemsPerPage, event);
          break;
        case 11:
          this.getBranchDecisionLeads(this.itemsPerPage, event);
          break;
        case 13:
          this.getMyFITask(this.itemsPerPage, event);
          break;
        case 14:
          this.getBranchFITask(this.itemsPerPage, event);
          break;
        case 14:
          this.getMyTermsheetLeads(this.itemsPerPage, event);
          break;
        case 14:
          this.getBranchTermsheetLeads(this.itemsPerPage, event);
          break;
        default:
          break;
      }
    } else if (this.roleType === 4) {
      switch (this.subActiveTab) {
        case 1:
          this.getMakerLeads(this.itemsPerPage, event);
          break;
        case 2:
          this.getMakerCPCLeads(this.itemsPerPage, event);
          break;
        default:
          break;
      }
    } else if (this.roleType === 5) {
      switch (this.subActiveTab) {
        case 4:
          this.getCheckerLeads(this.itemsPerPage, event);
          break;
        case 5:
          this.getCheckerCPCLeads(this.itemsPerPage, event);
          break;
        default:
          break;
      }
    }
  }


  onClick() {
    this.onTabsLoading(this.subActiveTab);
  }

  onRoute(leadId, stageCode?, taskId?) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab
    };
    if (this.roleType === 1) {
      if (!this.onAssignTab && !this.onReleaseTab) {
        if (stageCode == '10') {
          this.router.navigateByUrl(`/pages/lead-section/${leadId}`);
        } else if (stageCode == '20') {
          this.router.navigateByUrl(`/pages/sales/${leadId}/lead-details`);
        }
      }
      switch (this.subActiveTab) {
        case 4:
          localStorage.setItem('istermSheet', 'false');
          this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
          break;
        case 6:

          break;
        case 8:
          this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${leadId}/pd-list`);
          break;
        case 10:
          this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
          break;
        case 13:
          this.router.navigateByUrl(`/pages/fi-dashboard/${leadId}/fi-list`);
          break;

        default:
          break;
      }
    } else if (this.roleType === 2) {
      switch (this.subActiveTab) {
        case 4:
          this.router.navigateByUrl(`/pages/dde/${leadId}/lead-details`);
          break;
        case 6:
          this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${leadId}/pd-list`);
          break;
        case 8:
          this.router.navigateByUrl(`/pages/deviation-dashboard/${leadId}/dashboard-deviation-details`);
          break;
        case 10:
          localStorage.setItem('istermSheet', 'false');
          this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
          break;
        case 13:
          this.router.navigateByUrl(`/pages/fi-dashboard/${leadId}/fi-list`);
          break;
        case 16:
          localStorage.setItem('istermSheet', 'true');
          this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/new-term-sheet`);
          break;
        default:
          break;
      }
    } else if (this.roleType === 4) {
      if (this.subActiveTab === this.displayCPCTabs.CPCMakerWithMe) {
        this.router.navigateByUrl(`/pages/cpc-maker/${leadId}/check-list`);
      }
    } else if (this.roleType === 5) {
      if (this.subActiveTab === this.displayCPCTabs.CPCCheckerWithMe) {
        this.router.navigateByUrl(`/pages/cpc-checker/${leadId}/check-list`);
      }
    }

  }

  onClear() {
    this.isFilterApplied = false;
    this.filterForm.reset();
    this.filterFormDetails = {};
    this.onTabsLoading(this.subActiveTab);
  }

  onApply() {
    this.isFilterApplied = true;
    this.filterFormDetails = this.filterForm.value;
    // this.filterFormDetails.fromDate = this.dateToFormate(this.filterFormDetails.fromDate);
    this.filterFormDetails.fromDate = this.utilityService.getDateFormat(this.filterFormDetails.fromDate);
    // this.filterFormDetails.toDate = this.dateToFormate(this.filterFormDetails.toDate);
    this.filterFormDetails.toDate = this.utilityService.getDateFormat(this.filterFormDetails.toDate);
    this.onTabsLoading(this.subActiveTab);
    // this.dashboardService.filterData(this.filterFormDetails);
  }

  // onChangeDate() {
  //   const fromDate = new Date(this.filterFormDetails.controls['fromDate'].value);
  //   const toDate = new Date(this.filterFormDetails.controls['toDate'].value);
  //   if (fromDate > toDate) {
  //     this.toasterService.showWarning('Invalid Date Selection', '');
  //     if (this.OldFromDate) {
  //       // this.listArray.controls = [];
  //       const date = new Date(this.OldFromDate);
  //       this.filterFormDetails.patchValue({
  //         fromDate: this.OldFromDate,
  //         toDate: this.OldFromDate,
  //       });
  //     }
  //     return;
  //   }
  //   const fromDateNew = this.filterFormDetails.fromDate;
  //   this.OldFromDate = fromDateNew;
  // }

  onRelase(taskId) {
    this.taskDashboard.releaseTask(taskId).subscribe((res: any) => {
      const response = res;
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Lead Released Successfully', 'Released');
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

  onAssign(taskId, leadId) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab
    };
    this.taskDashboard.assignTask(taskId).subscribe((res: any) => {
      const response = JSON.parse(res);
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        // this.router.navigate(['/pages/dde/' + leadId + '/lead-details']);
        if (this.roleType === 1) {
          switch (this.subActiveTab) {
            case 5:
              localStorage.setItem('istermSheet', 'false');
              this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
              break;
            case 7:

              break;
            case 9:
              this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${leadId}/pd-list`);
              break;
            case 11:
              this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
              break;
            case 14:
              this.router.navigateByUrl(`/pages/fi-dashboard/${leadId}/fi-list`);
              break;
            default:
              break;
          }
        } else if (this.roleType === 2) {
          switch (this.subActiveTab) {
            case 5:
              this.router.navigateByUrl(`/pages/dde/${leadId}/lead-details`);
              break;
            case 7:
              this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${leadId}/pd-list`);
              break;
            case 9:
              this.router.navigateByUrl(`/pages/deviation-dashboard/${leadId}/dashboard-deviation-details`);
              break;
            case 11:
              localStorage.setItem('istermSheet', 'false');
              this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
              break;
            case 14:
              this.router.navigateByUrl(`/pages/fi-dashboard/${leadId}/fi-list`);
              break;
            case 17:
              localStorage.setItem('istermSheet', 'true');
              this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/new-term-sheet`);
              break;
            default:
              break;
          }
        } else if (this.roleType === 4) {
          if (this.subActiveTab === this.displayCPCTabs.CPCMakerWithBranch) {
            this.router.navigateByUrl(`/pages/cpc-maker/${leadId}/check-list`);
          } else if (this.roleType === 5) {
            if (this.subActiveTab === this.displayCPCTabs.CPCCheckerWithBranch) {
              this.router.navigateByUrl(`/pages/cpc-checker/${leadId}/check-list`);
            }
          }
        }
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

  // external methods
  assignTaskId(taskId) {
    this.sharedService.getTaskID(taskId);
  }
  getLoanNumber(loanNumber) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab
    };
    this.sharedService.getLoanNumber(loanNumber);
  }
  getLeadId(item) {
    localStorage.setItem('salesResponse', item.is_sales_response_completed);
    console.log('isficumPd', item.isFiCumPD);
    localStorage.setItem('isFiCumPd', item.isFiCumPD);
    this.vehicleDataStoreService.setCreditTaskId(item.taskId);
    this.sharedService.getTaskID(item.taskId);
  }

}
