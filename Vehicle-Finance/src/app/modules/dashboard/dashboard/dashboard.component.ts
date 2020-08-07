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

export enum DisplayTabs {
  // sales
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
}
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
  CreditDecisionWithBranch
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

  // new leads
  newArray;
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

  selectedDate;

  displayTabs = DisplayTabs;
  displayCreditTabs = DisplayCreditTabs;
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
    private sharedService: SharedService
  ) {
    console.log(DisplayTabs.NewLeads);
  }

  ngOnInit() {


    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
      this.businessDivision = value.businessDivision[0].bizDivId;
      // console.log(value);
    });
    this.activeTab = 0;
    this.subActiveTab = this.roleType === 1 ? 3 : 4;

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

    // new leads

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', typeof this.roleType, this.roleType);
    });
    if (this.roleType == '2') {
      this.onReleaseTab = true;
      this.getMyDDELeads(this.itemsPerPage);
    } else if (this.roleType == '1') {
      this.getSalesFilterLeads(this.itemsPerPage);
    } else if (this.roleType == '4') {
      this.onReleaseTab = true;
      this.getMakerLeads(this.itemsPerPage);
    } else if (this.roleType == '5') {
      this.onReleaseTab = true;
      this.getCheckerLeads(this.itemsPerPage);
    }
  }


  // changing main tabs
  onLeads(data, subTab) {
   

    this.activeTab = data;
    this.subActiveTab = subTab;
    console.log('activeTab', this.activeTab);
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
      }
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
    console.log('subActiveTab', this.subActiveTab);
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

        default:
          break;
      }
    }

  }

  onCPCMakerClick(data) {
    if (data === 'myMaker') {
      this.onReleaseTab = true;
      this.onAssignTab = false;
      this.makerWithMe = true;
      this.makerWithCPC = false;
      this.getMakerLeads(this.itemsPerPage);
    } else if (data === 'cpcMaker') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.makerWithMe = false;
      this.makerWithCPC = true;
      this.getMakerCPCLeads(this.itemsPerPage);
    }
  }

  onCPCCheckerClick(data) {
    if (data === 'myChecker') {
      this.onReleaseTab = true;
      this.onAssignTab = false;
      this.checkerWithMe = true;
      this.checkerWithCPC = false;
      this.getCheckerLeads(this.itemsPerPage);
    } else if (data === 'cpcChecker') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.checkerWithMe = false;
      this.checkerWithCPC = true;
      this.getCheckerCPCLeads(this.itemsPerPage);
    }
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
      console.log('get product catagory', res);
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
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
      leadStage: this.filterFormDetails ? this.filterFormDetails.leadStage : '',
      loanMinAmt: this.filterFormDetails ? this.filterFormDetails.loanMinAmt : '',
      loanMaxAmt: this.filterFormDetails ? this.filterFormDetails.loanMaxAmt : ''
    };
    // console.log('getmyFilterdata', data);
    // console.log('filter form data', this.filterFormDetails);


    this.responseForSales(data);
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
      myLeads: true
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
      myLeads: false
    };
    this.responseForCredit(data);
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
  setPage(event) {
    if (this.roleType == '1') {
      // this.getSalesFilterLeads(this.itemsPerPage, event);
      if (this.subActiveTab === this.displayTabs.NewLeads) {
        this.getSalesFilterLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithMe) {
        this.getSanctionedLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithBranch) {
        this.getSanctionedBranchLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithMe) {
        this.getDeclinedLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithBranch) {
        this.getDeclinedBranchLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.getViabilityLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithBranch) {
        this.getViabilityBranchLeads(this.itemsPerPage, event);
      }
    } else if (this.roleType == '2') {
      if (this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.getMyDDELeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.DDEWithBranch) {
        this.getBranchDDELeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.getMyDeviationLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithBranch) {
        this.getBranchDeviationLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.getMyDecisionLeads(this.itemsPerPage, event);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithBranch) {
        this.getBranchDecisionLeads(this.itemsPerPage, event);
      }
    } else if (this.roleType == '4') {
      if (this.makerWithMe) {
        this.getMakerLeads(this.itemsPerPage);
      } else if (this.makerWithCPC) {
        this.getMakerCPCLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '5') {
      if (this.checkerWithMe) {
        this.getCheckerLeads(this.itemsPerPage);
      } else if (this.checkerWithCPC) {
        this.getCheckerCPCLeads(this.itemsPerPage);
      }
    }
  }


  onClick() {
    if (this.roleType == '1') {
      if (this.subActiveTab === this.displayTabs.SanctionedWithMe) {
        this.getSanctionedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithMe) {
        this.getDeclinedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.getViabilityLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '2') {
      if (this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.getMyDDELeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.getMyDeviationLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.getMyDecisionLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '4' || this.roleType == '5') {
      if (this.makerWithMe) {
        this.getMakerLeads(this.itemsPerPage);
      } else if (this.checkerWithMe) {
        this.getCheckerLeads(this.itemsPerPage);
      }
    }
  }

  onRoute(leadId, stageCode?, taskId?) {
    // this.vehicleDataStoreService.setSalesLeadID(leadId);
    // this.sharedService.getTaskID(taskId)
    if (this.roleType === 1) {
      if (!this.onAssignTab && !this.onReleaseTab) {
        if (stageCode == '10') {
          this.router.navigateByUrl(`/pages/lead-section/${leadId}`);
        } else if (stageCode == '20') {
          this.router.navigateByUrl(`/pages/sales/${leadId}/lead-details`);
        }
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithMe) {
        this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithMe) {

      } else if (this.subActiveTab === this.displayTabs.MyPD) {
        this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
      }
    } else if (this.roleType === 2) {
      if (this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.router.navigateByUrl(`/pages/dde/${leadId}/lead-details`);
      } else if (this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.router.navigateByUrl(`/pages/deviation-dashboard/${leadId}/dashboard-deviation-details`);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
      }
    }

  }

  onClear() {
    this.filterForm.reset();
    this.filterFormDetails = {};
    if (this.roleType == '1') {
      if (this.subActiveTab === this.displayTabs.NewLeads) {
        this.getSalesFilterLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithMe) {
        this.getSanctionedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithBranch) {
        this.getSanctionedBranchLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithMe) {
        this.getDeclinedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithBranch) {
        this.getDeclinedBranchLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.getViabilityLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithBranch) {
        this.getViabilityBranchLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '2') {
      if (this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.getMyDDELeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DDEWithBranch) {
        this.getBranchDDELeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.getMyDeviationLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithBranch) {
        this.getBranchDeviationLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.getMyDecisionLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithBranch) {
        this.getBranchDecisionLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '4' || this.roleType == '5') {
      if (this.makerWithMe) {
        this.getMakerLeads(this.itemsPerPage);
      } else if (this.makerWithCPC) {
        this.getMakerCPCLeads(this.itemsPerPage);
      } else if (this.checkerWithMe) {
        this.getCheckerLeads(this.itemsPerPage);
      } else if (this.checkerWithCPC) {
        this.getCheckerCPCLeads(this.itemsPerPage);
      }
    }
  }

  onApply() {
    this.filterFormDetails = this.filterForm.value;
    this.filterFormDetails.fromDate = this.dateToFormate(this.filterFormDetails.fromDate);
    this.filterFormDetails.toDate = this.dateToFormate(this.filterFormDetails.toDate);
    this.selectedDate = this.dateToFormate(this.filterFormDetails.fromDate);
    console.log('filter form details', this.filterFormDetails);
    if (this.roleType == '1') {
      if (this.subActiveTab === this.displayTabs.NewLeads) {
        this.getSalesFilterLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithMe) {
        this.getSanctionedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.SanctionedWithBranch) {
        this.getSanctionedBranchLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithMe) {
        this.getDeclinedLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.DeclinedWithBranch) {
        this.getDeclinedBranchLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithMe) {
        this.getViabilityLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayTabs.ViabilityWithBranch) {
        this.getViabilityBranchLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '2') {
      if (this.subActiveTab === this.displayCreditTabs.DDEWithMe) {
        this.getMyDDELeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DDEWithBranch) {
        this.getBranchDDELeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.MyPD) {
        this.getPdMyTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.BranchPd) {
        this.getPdBranchTask(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithMe) {
        this.getMyDeviationLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithBranch) {
        this.getBranchDeviationLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithMe) {
        this.getMyDecisionLeads(this.itemsPerPage);
      } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithBranch) {
        this.getBranchDecisionLeads(this.itemsPerPage);
      }
    } else if (this.roleType == '4' || this.roleType == '5') {
      if (this.makerWithMe) {
        this.getMakerLeads(this.itemsPerPage);
      } else if (this.makerWithCPC) {
        this.getMakerCPCLeads(this.itemsPerPage);
      } else if (this.checkerWithMe) {
        this.getCheckerLeads(this.itemsPerPage);
      } else if (this.checkerWithCPC) {
        this.getCheckerCPCLeads(this.itemsPerPage);
      }
    }
    // this.dashboardService.filterData(this.filterFormDetails);
  }

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

    this.taskDashboard.assignTask(taskId).subscribe((res: any) => {
      console.log('assignResponse', res);
      const response = JSON.parse(res);
      console.log(response);
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        // this.router.navigate(['/pages/dde/' + leadId + '/lead-details']);
        if (this.roleType === 1) {
          if (this.subActiveTab === this.displayTabs.SanctionedWithBranch) {
            this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
          } else if (this.subActiveTab === this.displayTabs.DeclinedWithBranch) {

          } else if (this.subActiveTab === this.displayTabs.BranchPd) {
            this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
          } else if (this.subActiveTab === this.displayTabs.ViabilityWithBranch) {
            this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
          }
        } else if (this.roleType === 2) {
          if (this.subActiveTab === this.displayCreditTabs.DDEWithBranch) {
            this.router.navigateByUrl(`/pages/dde/${leadId}/lead-details`);
          } else if (this.subActiveTab === this.displayCreditTabs.BranchPd) {
            this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
          } else if (this.subActiveTab === this.displayCreditTabs.DeviationWithBranch) {
            this.router.navigateByUrl(`/pages/deviation-dashboard/${leadId}/dashboard-deviation-details`);
          } else if (this.subActiveTab === this.displayCreditTabs.CreditDecisionWithBranch) {
            this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
          }
        } else if (this.roleType === 4) {
           if (this.makerWithCPC) {

          } else if (this.roleType === 5) {
            if (this.checkerWithCPC) {

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
    console.log('in assign task', taskId);
  }
  getLeadId(item) {
    this.vehicleDataStoreService.setCreditTaskId(item.taskId);
    this.sharedService.getTaskID(item.taskId);
  }

}
