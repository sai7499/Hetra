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
import { NumberFormatStyle, Location } from '@angular/common';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { ToggleDdeService } from '@services/toggle-dde.service';

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
  PDD,
  ChequeTracking,
  DDE,
  Deviation,
  Decision,
  DDEWithMe,
  DDEWithBranch,
  DeviationWithMe,
  DeviationWithBranch,
  CreditDecisionWithMe,
  CreditDecisionWithBranch,
  TermSheet,
  TermSheetWithMe,
  TermSheetWithBranch,
  CPCMaker,
  CPCMakerWithMe,
  CPCMakerWithBranch,
  CPCChecker,
  CPCCheckerWithMe,
  CPCCheckerWithBranch
}

export enum sortingTables {
  ByLeadId,
  ByProduct,
  ByLoanAmt,
  ByDate,
  ByStage
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
  newArray;
  pddDetails;
  chequeTrackingDetails;
  processLogs;
  salesLeads;
  creditLeads;
  itemsPerPage = '25';
  totalItems;
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
  leadId;
  sortTab;
  sortByDate = false;
  sortByLead = false;
  sortByLoanAmt = false;
  sortByProduct = false;
  sortByStage = false;


  // roleType;
  isLoadLead = true;
  leadSection = true;
  salesLead = true;
  onAssignTab: boolean;
  onReleaseTab: boolean;

  displayTabs = DisplayTabs;
  sortTables = sortingTables;
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
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private applicantStoreService: ApplicantDataStoreService,
    private toggleDdeService: ToggleDdeService,
    private location: Location
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
      if (this.roleType === 1) {
        this.activeTab = 0;
        this.subActiveTab = 3;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType === 2) {
        this.activeTab = 18;
        this.subActiveTab = 21;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType === 4) {
        this.activeTab = 30;
        this.subActiveTab = 31;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType === 5) {
        this.activeTab = 33;
        this.subActiveTab = 34;
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
      loanMinAmt: [null],
      loanMaxAmt: [null]
    });

    this.dashboardFilter();
    this.loanMaxAmtChange();
    const currentUrl = this.location.path();
    const value = localStorage.getItem('ddePath');
    const currentLabel = JSON.parse(value);
    if (currentLabel && currentLabel.labelName && currentLabel.labelName === 'Back To Deviation') {
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('1', 'Deviation', currentUrl);
    }
  }

  onSort(data) {
    this.sortTab = data;
    switch (data) {
      case 0:
        this.sortByLead = this.sortByLead === false ? true : false;
        this.sortByDate = false;
        this.sortByProduct = false;
        this.sortByLoanAmt = false;
        this.sortByStage = false;
        this.onTabsLoading(this.subActiveTab);
        break;
      case 1:
        this.sortByLead = false;
        this.sortByDate = false;
        this.sortByProduct = this.sortByProduct === false ? true : false;
        this.sortByLoanAmt = false;
        this.sortByStage = false;
        this.onTabsLoading(this.subActiveTab);
        break;
      case 2:
        this.sortByLead = false;
        this.sortByDate = false;
        this.sortByProduct = false;
        this.sortByLoanAmt = this.sortByLoanAmt === false ? true : false;
        this.sortByStage = false;
        this.onTabsLoading(this.subActiveTab);
        break;
      case 3:
        this.sortByLead = false;
        this.sortByDate = this.sortByDate === false ? true : false;
        this.sortByProduct = false;
        this.sortByLoanAmt = false;
        this.sortByStage = false;
        this.onTabsLoading(this.subActiveTab);
        break;
      case 4:
        this.sortByLead = false;
        this.sortByDate = false;
        this.sortByProduct = false;
        this.sortByLoanAmt = false;
        this.sortByStage = this.sortByStage === false ? true : false;
        this.onTabsLoading(this.subActiveTab);
        break;

      default:
        break;
    }
  }


  loanMaxAmtChange() {
    this.filterForm.get('loanMaxAmt').valueChanges.pipe(debounceTime(600)).subscribe((data) => {

      const minAmt = this.filterForm.get('loanMinAmt').value;
      const minLoanAmt = Number(minAmt || 0);
      if (minAmt != null && !minAmt || (data && minLoanAmt >= data)) {
        this.filterForm.get('loanMaxAmt').setValue(null);
        this.toasterService.showWarning('Invalid Amount', '');
      }
    });
  }

  // Loading dashboard pages
  onTabsLoading(data) {
    if (this.activeTab === this.displayTabs.PDD) {
      this.getPDDLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.ChequeTracking) {
      this.getChequeTrackingLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.LoanBooking) {
      this.getProcessLogsLeads(this.itemsPerPage);
    }
    switch (data) {
      case 4: case 6: case 8: case 10: case 13: case 21: case 23: case 25: case 28: case 31: case 34:
        this.onAssignTab = false;
        this.onReleaseTab = true;
        break;
      case 5: case 7: case 9: case 11: case 14: case 22: case 24: case 26: case 29: case 32: case 35:
        this.onAssignTab = true;
        this.onReleaseTab = false;
        break;
      default:
        break;
    }
    switch (data) {
      case 3:
        this.getSalesFilterLeads(this.itemsPerPage);
        break;
      case 4:
        this.getSanctionedLeads(this.itemsPerPage);
        break;
      case 5:
        this.getSanctionedBranchLeads(this.itemsPerPage);
        break;
      case 6:
        this.getDeclinedLeads(this.itemsPerPage);
        break;
      case 7:
        this.getDeclinedBranchLeads(this.itemsPerPage);
        break;
      case 8:
        this.getPdMyTask(this.itemsPerPage);
        break;
      case 9:
        this.getPdBranchTask(this.itemsPerPage);
        break;
      case 10:
        this.getViabilityLeads(this.itemsPerPage);
        break;
      case 11:
        this.getViabilityBranchLeads(this.itemsPerPage);
        break;
      case 13:
        this.getMyFITask(this.itemsPerPage);
        break;
      case 14:
        this.getBranchFITask(this.itemsPerPage);
        break;
      case 21:
        this.getMyDDELeads(this.itemsPerPage);
        break;
      case 22:
        this.getBranchDDELeads(this.itemsPerPage);
        break;
      case 23:
        this.getMyDeviationLeads(this.itemsPerPage);
        break;
      case 24:
        this.getBranchDeviationLeads(this.itemsPerPage);
        break;
      case 25:
        this.getMyDecisionLeads(this.itemsPerPage);
        break;
      case 26:
        this.getBranchDecisionLeads(this.itemsPerPage);
        break;
      case 28:
        this.getMyTermsheetLeads(this.itemsPerPage);
        break;
      case 29:
        this.getBranchTermsheetLeads(this.itemsPerPage);
        break;
      case 31:
        this.getMakerLeads(this.itemsPerPage);
        break;
      case 32:
        this.getMakerCPCLeads(this.itemsPerPage);
        break;
      case 34:
        this.getCheckerLeads(this.itemsPerPage);
        break;
      case 35:
        this.getCheckerCPCLeads(this.itemsPerPage);
        break;
      default:
        break;
    }
  }
  // changing main tabs
  onLeads(data?, subTab?, tabName?: string) {

    this.sortTab = '';
    this.activeTab = data;
    this.subActiveTab = subTab;
    if (this.sortTab === '') {
      this.sortByLead = false;
      this.sortByDate = false;
      this.sortByProduct = false;
      this.sortByLoanAmt = false;
      this.sortByStage = false;
      // this.getSalesFilterLeads(this.itemsPerPage);
      this.onTabsLoading(this.subActiveTab);
    }

    const currentUrl = this.location.path();
    if (tabName === 'deviation') {
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('1', 'Deviation', currentUrl);
    } else if (tabName === 'creditDecision') {
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('2', 'Credit Decision', currentUrl);
    } else if (tabName === 'dde') {
      this.toggleDdeService.setIsDDEClicked('1');
      this.toggleDdeService.setOperationType('0');
    } else if(tabName === 'CPC'){
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('1', 'CPC', currentUrl);
    }else{
      this.toggleDdeService.clearToggleData();
    }

    this.activeTab = data;
    this.subActiveTab = subTab;

    if (this.activeTab === this.displayTabs.Leads && this.subActiveTab === this.displayTabs.NewLeads) {
      this.onReleaseTab = false;
      this.onAssignTab = false;
    } else {
      this.onReleaseTab = true;
      this.onAssignTab = false;
    }
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
    } else if (this.activeTab === this.displayTabs.DDE && this.subActiveTab === this.displayTabs.DDEWithMe) {
      this.getMyDDELeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.Deviation && this.subActiveTab === this.displayTabs.DeviationWithMe) {
      this.getMyDeviationLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.Decision && this.subActiveTab === this.displayTabs.CreditDecisionWithMe) {
      this.getMyDecisionLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.TermSheet && this.subActiveTab === this.displayTabs.TermSheetWithMe) {
      this.getMyTermsheetLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.CPCMaker && this.subActiveTab === this.displayTabs.CPCMakerWithMe) {
      this.getMakerLeads(this.itemsPerPage);
    } else if (this.activeTab === this.displayTabs.CPCChecker && this.subActiveTab === this.displayTabs.CPCCheckerWithMe) {
      this.getCheckerLeads(this.itemsPerPage);
    }
  }

  // changing sub tabs
  leads(data) {
    this.sortTab = '';
    this.subActiveTab = data;
    if (this.subActiveTab === this.displayTabs.NewLeads) {
      this.onReleaseTab = false;
      this.onAssignTab = false;
    } else {
      this.onReleaseTab = true;
      this.onAssignTab = false;
    }
    // this.onTabsLoading(this.subActiveTab);
    if (this.sortTab === '') {
      this.sortByLead = false;
      this.sortByDate = false;
      this.sortByProduct = false;
      this.sortByLoanAmt = false;
      this.sortByStage = false;
      // this.getSalesFilterLeads(this.itemsPerPage);
      this.onTabsLoading(this.subActiveTab);
    }
  }

  dateToFormate(date) {
    return date
      ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      : '';
  }

  // for getting productCatagory and leadStage
  dashboardFilter() {
    const data = {
      bizDiv: this.businessDivision,
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
    this.count =
      Number(res.ProcessVariables.totalPages) *
      Number(res.ProcessVariables.perPage);
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
    this.count =
      Number(res.ProcessVariables.totalPages) *
      Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
    this.from = res.ProcessVariables.from;
  }

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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
    };

    this.responseForSales(data);
  }

  getPDDLeads(perPageCount, pageNumber?) {
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
    };

    this.responseForPDD(data);
  }

  getChequeTrackingLeads(perPageCount, pageNumber?) {
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
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
      productCategory: this.filterFormDetails
        ? this.filterFormDetails.product
        : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : '',
      sortByDate: this.sortByDate,
      sortByLead: this.sortByLead,
      sortByLoanAmt: this.sortByLoanAmt,
      sortByProduct: this.sortByProduct,
      sortByStage: this.sortByStage
    };
    this.responseForCredit(data);
  }

  setPage(event) {

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
      case 21:
        this.getMyDDELeads(this.itemsPerPage, event);
        break;
      case 22:
        this.getBranchDDELeads(this.itemsPerPage, event);
        break;
      case 23:
        this.getMyDeviationLeads(this.itemsPerPage, event);
        break;
      case 24:
        this.getBranchDeviationLeads(this.itemsPerPage, event);
        break;
      case 25:
        this.getMyDecisionLeads(this.itemsPerPage, event);
        break;
      case 26:
        this.getBranchDecisionLeads(this.itemsPerPage, event);
        break;
      case 28:
        this.getMyTermsheetLeads(this.itemsPerPage, event);
        break;
      case 29:
        this.getBranchTermsheetLeads(this.itemsPerPage, event);
        break;
      case 31:
        this.getMakerLeads(this.itemsPerPage, event);
        break;
      case 32:
        this.getMakerCPCLeads(this.itemsPerPage, event);
        break;
      case 34:
        this.getCheckerLeads(this.itemsPerPage, event);
        break;
      case 35:
        this.getCheckerCPCLeads(this.itemsPerPage, event);
        break;
      default:
        break;
    }

  }

  onClick() {
    this.onTabsLoading(this.subActiveTab);
  }

  onRoutingTabs(data) {
    switch (data) {
      case 4: case 5:
        localStorage.setItem('istermSheet', 'false');
        this.router.navigateByUrl(`/pages/credit-decisions/${this.leadId}/credit-condition`);
        break;
      case 6: case 7:

        break;
      case 8: case 9:
        this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`);
        break;
      case 10: case 11:
        this.router.navigate([`/pages/viability-list/${this.leadId}/viability-list`]);
        break;
      case 13: case 14:
        this.router.navigateByUrl(`/pages/fi-dashboard/${this.leadId}/fi-list`);
        break;
      case 21: case 22:
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/lead-details`);
        break;
      case 23: case 24:
        this.router.navigateByUrl(`/pages/deviation-dashboard/${this.leadId}/dashboard-deviation-details`);
        break;
      case 25: case 26:
        localStorage.setItem('istermSheet', 'false');
        this.router.navigateByUrl(`/pages/credit-decisions/${this.leadId}/credit-condition`);
        break;
      case 28: case 29:
        localStorage.setItem('istermSheet', 'true');
        this.router.navigateByUrl(`/pages/credit-decisions/${this.leadId}/new-term-sheet`);
        break;
      case 31: case 32:
        this.router.navigateByUrl(`/pages/cpc-maker/${this.leadId}/check-list`);
        break;
      case 34: case 35:
        this.router.navigateByUrl(`/pages/cpc-checker/${this.leadId}/check-list`);
        break;

      default:
        break;
    }
  }

  onRoute(leadId, stageCode?, taskId?) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab,
    };
    this.leadId = leadId;
    if (!this.onAssignTab && !this.onReleaseTab) {
      if (stageCode == '10') {
        this.router.navigateByUrl(`/pages/lead-section/${leadId}`);
      } else if (stageCode == '20') {
        this.router.navigateByUrl(`/pages/sales/${leadId}/lead-details`);
      }
    }
    this.onRoutingTabs(this.subActiveTab);
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
    this.filterFormDetails.fromDate = this.utilityService.getDateFormat(
      this.filterFormDetails.fromDate
    );
    // this.filterFormDetails.toDate = this.dateToFormate(this.filterFormDetails.toDate);
    this.filterFormDetails.toDate = this.utilityService.getDateFormat(
      this.filterFormDetails.toDate
    );
    this.onTabsLoading(this.subActiveTab);
    // this.dashboardService.filterData(this.filterFormDetails);
  }

  onRelase(taskId) {
    this.taskDashboard.releaseTask(taskId).subscribe((res: any) => {
      const response = res;
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess(
          'Lead Released Successfully',
          'Released'
        );
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

  onAssign(taskId, leadId) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab,
    };
    this.leadId = leadId;
    this.taskDashboard.assignTask(taskId).subscribe((res: any) => {
      const response = JSON.parse(res);
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        this.onRoutingTabs(this.subActiveTab);
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
      activeTab: this.activeTab,
    };
    this.sharedService.getLoanNumber(loanNumber);
  }
  getLeadId(item) {
    localStorage.setItem('salesResponse', item.is_sales_response_completed);
    localStorage.setItem('isFiCumPd', item.isFiCumPD);
    this.vehicleDataStoreService.setCreditTaskId(item.taskId);
    this.sharedService.getTaskID(item.taskId);
  }
}
