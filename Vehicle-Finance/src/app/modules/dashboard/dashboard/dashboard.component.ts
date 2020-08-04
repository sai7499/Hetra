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
  // roleType;
  isLoadLead = true;
  leadSection = true;
  salesLead = true;
  PD: boolean;
  vehicle: boolean;
  onAssignTab: boolean;
  onReleaseTab: boolean;
  sanctionedMe: boolean;
  sanctionedBranch: boolean;
  declined: boolean;
  declinedBranch: boolean;
  myPD: boolean;
  myPDBranch: boolean;
  myViability: boolean;
  myViabilityBranch: boolean;

  // for credit
  DDESection: boolean;
  onDeviation: boolean;
  onDecision: boolean;
  onMaker: boolean;
  onChecker: boolean;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService,
    private utilityService: UtilityService,

    // new leads
    private labelsData: LabelsService,
    // private dashboardService: DashboardService,
    // private vehicleDataStoreService: VehicleDataStoreService,
    // private loginStoreService: LoginStoreService,
    private router: Router,
    // private sharedService: SharedService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
      this.businessDivision = value.businessDivision[0].bizDivId;
      // console.log(value);
    });

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
      // console.log('role Type', this.roleType);
    });
    if (this.roleType == '2') {
      // this.getCreditFilterLeads(this.itemsPerPage);
    } else {
      this.getSalesFilterLeads(this.itemsPerPage);
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
  getCreditFilterLeads(perPageCount, pageNumber?) {
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
  getCreditFilterBranchLeads(perPageCount, pageNumber?) {
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
  getBranchLeads(perPageCount, pageNumber?) {
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
  getMyCreditDecisionLeads(perPageCount, pageNumber?) {
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
  getDecisionBranchLeads(perPageCount, pageNumber?) {
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
      if (this.salesLead) {
        this.getSalesFilterLeads(this.itemsPerPage, event);
        } else if (this.sanctionedMe) {
        this.getSanctionedLeads(this.itemsPerPage, event);
        } else if (this.sanctionedBranch) {
        this.getSanctionedBranchLeads(this.itemsPerPage, event);
        } else if (this.declined) {
        this.getDeclinedLeads(this.itemsPerPage, event);
        } else if (this.declinedBranch) {
          this.getDeclinedBranchLeads(this.itemsPerPage, event);
        } else if (this.myPD) {
        this.getPdMyTask(this.itemsPerPage, event);
        } else if (this.myPDBranch) {
        this.getPdBranchTask(this.itemsPerPage, event);
        } else if (this.myViability) {
          this.getViabilityLeads(this.itemsPerPage, event);
        } else if (this.myViabilityBranch) {
        this.getViabilityBranchLeads(this.itemsPerPage, event);
        }
        } else {

      return
      // this.getSanctionedBranchLeads(this.filterFormDetails, event);
    }
  }

  // changing main tabs
  onLeads(data) {
    if (this.roleType == '1') {
      if (data === 'leads') {
        this.leadSection = true;
        this.PD = false;
        this.vehicle = false;
        this.onReleaseTab = false;
        this.onAssignTab = false;
        this.salesLead = true;
        this.myPD = false;
        this.sanctionedMe = false;
        this.sanctionedBranch = false;
        this.declined = false;
        this.declinedBranch = false;
        this.getSalesFilterLeads(this.itemsPerPage);
      } else if (data === 'PD') {
        this.leadSection = false;
        this.PD = true;
        this.vehicle = false;
        this.onReleaseTab = true;
        this.onAssignTab = false;
        this.myPD = true;
        this.salesLead = false;
        this.sanctionedMe = false;
        this.sanctionedBranch = false;
        this.declined = false;
        this.declinedBranch = false;
        this.getPdMyTask(this.filterFormDetails);
      } else if (data === 'Vehicle') {
        this.leadSection = false;
        this.PD = false;
        this.vehicle = true;
        this.onReleaseTab = true;
        this.onAssignTab = false;
        this.myViability = true;
        this.salesLead = false;
        this.sanctionedMe = false;
        this.sanctionedBranch = false;
        this.declined = false;
        this.declinedBranch = false;
        this.getViabilityLeads(this.filterFormDetails);
      }
    }
    
  }

  // changing sub tabs
  leads(data) {
    if (data === 'newLeads') {
      this.onReleaseTab = false;
      this.onAssignTab = false;
      this.salesLead = true;
      this.sanctionedMe = false;
      this.sanctionedBranch = false;
      this.declined = false;
      this.declinedBranch = false;
      this.getSalesFilterLeads(this.itemsPerPage);
    } else if (data === 'SanctionedMe') {
      this.onReleaseTab = true;
      this.onAssignTab = false;
      this.sanctionedMe = true;
      this.sanctionedBranch = false;
      this.declined = false;
      this.salesLead = false;
      this.declinedBranch = false;
      this.getSanctionedLeads(this.itemsPerPage);
    } else if (data === 'SanctionedBranch') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.salesLead = false;
      this.sanctionedMe = false;
      this.sanctionedBranch = true;
      this.declined = false;
      this.declinedBranch = false;
      this.getSanctionedBranchLeads(this.itemsPerPage);
    } else if (data === 'DeclinedMe') {
      this.onReleaseTab = true;
      this.onAssignTab = false;
      this.declined = true;
      this.sanctionedMe = false;
      this.salesLead = false;
      this.declinedBranch = false;
      this.sanctionedBranch = false;
      this.getDeclinedLeads(this.itemsPerPage);
    } else if (data === 'DeclinedBranch') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.salesLead = false;
      this.sanctionedMe = false;
      this.sanctionedBranch = true;
      this.declined = false;
      this.declinedBranch = true;
      this.getDeclinedBranchLeads(this.itemsPerPage);
    }
  }

  onPdClick(data) {
    if (data === 'myPd') {
      this.onReleaseTab = true;
      this.onAssignTab = false;
      this.myPD = true;
      this.myPDBranch = false;
      this.getPdMyTask(this.itemsPerPage);
    } else if (data === 'BranchPd') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.myPD = false;
      this.myPDBranch = true;
      this.salesLead = false;

      this.getPdBranchTask(this.itemsPerPage);
    }
  }

  onViabilityClick(data) {
    if (data === 'myViability') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.myViability = true;
      this.myViabilityBranch = false;
      this.getViabilityLeads(this.itemsPerPage);
    } else if (data === 'branchViability') {
      this.onReleaseTab = false;
      this.onAssignTab = true;
      this.myViabilityBranch = true;
      this.myViability = false;
      this.salesLead = false;

      this.getViabilityBranchLeads(this.itemsPerPage);
    }
  }

  onClick() {
    if (this.sanctionedMe) {
      this.getSanctionedLeads(this.itemsPerPage);
    } else if (this.declined) {
      this.getDeclinedLeads(this.itemsPerPage);
    } else if (this.myPD) {
      this.getPdMyTask(this.itemsPerPage);
    } else if (this.myViability) {
      this.getViabilityLeads(this.itemsPerPage);
    }
  }

  onRoute(leadId, stageCode?, taskId?) {
    // this.vehicleDataStoreService.setSalesLeadID(leadId);
    // this.sharedService.getTaskID(taskId)
    if (!this.onAssignTab && !this.onReleaseTab) {
      if (stageCode == '10') {
        this.router.navigateByUrl(`/pages/lead-section/${leadId}`);
      } else if (stageCode == '20') {
        this.router.navigateByUrl(`/pages/sales/${leadId}/lead-details`);
      }
    } else if (this.sanctionedMe) {
      this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
    } else if (this.declined) {

    } else if (this.myPD) {
      this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
    } else if (this.myViability) {
      this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
    }



  }

  onClear() {
    this.filterForm.reset();
    this.filterFormDetails = {};
    if (this.salesLead) {
      this.getSalesFilterLeads(this.itemsPerPage);
      } else if (this.sanctionedMe) {
      this.getSanctionedLeads(this.itemsPerPage);
      } else if (this.sanctionedBranch) {
      this.getSanctionedBranchLeads(this.itemsPerPage);
      } else if (this.declined) {
      this.getDeclinedLeads(this.itemsPerPage);
      } else if (this.declinedBranch) {
        this.getDeclinedBranchLeads(this.itemsPerPage);
      } else if (this.myPD) {
      this.getPdMyTask(this.itemsPerPage);
      } else if (this.myPDBranch) {
      this.getPdBranchTask(this.itemsPerPage);
      } else if (this.myViability) {
        this.getViabilityLeads(this.itemsPerPage);
      } else if (this.myViabilityBranch) {
      this.getViabilityBranchLeads(this.itemsPerPage);
      }
  }

  onApply() {
    this.filterFormDetails = this.filterForm.value;
    this.filterFormDetails.fromDate = this.dateToFormate(this.filterFormDetails.fromDate);
    this.filterFormDetails.toDate = this.dateToFormate(this.filterFormDetails.toDate);
    console.log('filter form details', this.filterFormDetails);
    if (this.salesLead) {
    this.getSalesFilterLeads(this.itemsPerPage);
    } else if (this.sanctionedMe) {
    this.getSanctionedLeads(this.itemsPerPage);
    } else if (this.sanctionedBranch) {
    this.getSanctionedBranchLeads(this.itemsPerPage);
    } else if (this.declined) {
    this.getDeclinedLeads(this.itemsPerPage);
    } else if (this.declinedBranch) {
      this.getDeclinedBranchLeads(this.itemsPerPage);
    } else if (this.myPD) {
    this.getPdMyTask(this.itemsPerPage);
    } else if (this.myPDBranch) {
    this.getPdBranchTask(this.itemsPerPage);
    } else if (this.myViability) {
      this.getViabilityLeads(this.itemsPerPage);
    } else if (this.myViabilityBranch) {
    this.getViabilityBranchLeads(this.itemsPerPage);
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
        if (!this.onAssignTab && !this.onReleaseTab) {
          this.router.navigateByUrl(`/pages/dde/${leadId}/lead-details`);
        } else if (this.sanctionedMe) {
          this.router.navigateByUrl(`/pages/credit-decisions/${leadId}/credit-condition`);
        } else if (this.declined) {

        } else if (this.myPD) {
          this.router.navigateByUrl(`/pages/pd-dashboard/${leadId}/pd-list`);
        } else if (this.myViability) {
          this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
        }
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

  // external methods
  assignTaskId(taskId) {
    this.sharedService.getTaskID(taskId)
    console.log("in assign task", taskId)
  }

}
