import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '@services/utility.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { debounceTime, retry, share, switchMap } from 'rxjs/operators';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { QueryModelService } from '@services/query-model.service';
import { Router, ActivatedRoute } from '@angular/router';

import { PollingService } from '@services/polling.service';
import { timer } from 'rxjs';
import { LeadHistoryService } from '@services/lead-history.service';
import { CommonDataService } from '@services/common-data.service';
import { SupervisorService } from '@modules/supervisor/service/supervisor.service';

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
  CPCCheckerWithBranch,
  PreDisbursementQueue,
  PreDisbursementWithMe,
  PreDisbursementWithBranch,
  PDDforCPC,
  PDDWithMe,
  PDDWithBranch,
  ReversedLeadsWithMe,
  ReversedLeadsWithBranch,
  RCU,
  RCUWithMe,
  RCUWithBranch,
  CPCCAD,
  CPCCADWithMe,
  CPCCADWithBranch
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
export class DashboardComponent implements OnInit, OnDestroy {
  roleList = [
    'USER 1',
    'USER 2',
    'USER 3',
    'USER 4',
    'USER 5',
    'USER 6',
  ];

  roleFilter = new FormControl(this.roleList);
  supervisorForm: FormGroup
  filterForm: FormGroup;
  showFilter;
  roleType: any;
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
  itemsPerPage = '25';
  totalItems;
  lovData: any;
  count: any;
  currentPage: any;
  limit;
  pageNumber;
  from;
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
  salesResponse;
  taskName: string;
  myLeads: boolean;
  isClaim: boolean;
  isRelease: boolean;
  isFromDate: boolean;
  fromDateChange;
  minLoanAmtChange;
  maxLoanAmtChange;
  isPDD;
  isChequeTracking;
  isLog;
  isAmountChange: boolean;
  isLoadLead = true;
  onAssignTab: boolean;
  onReleaseTab: boolean;

  // Query Model
  leadCount: number = 0;
  userId: string;
  intervalId: any;
  isIntervalId: boolean = false;
  subscription: any;

  displayTabs = DisplayTabs;
  sortTables = sortingTables;
  endDateChange: string;
  disbFromDate: any;
  disbToDate: string;
  supervisor: boolean;
  userName: any;
  reAssignData: any;
  loginId: any;
  userData: any;
  supervisorRoleId: any;
  supervisorRoleType: any;
  userDetailsRoleType: any;
  selfAssign: boolean;
  selfAssignLoginId: any;
  showModal: boolean;
  @ViewChild('closeModal', { static: false }) public closeModal: ElementRef;
  @ViewChild('closeModal1', { static: false }) public closeModal1: ElementRef;
  @ViewChild('closeModal2', { static: false }) public closeModal2: ElementRef;
  userDetailsRoleId: any;
  supervisorUserId: any;
  loginUserId: string;
  supervisorName: any;
  leadTaskId: any;
  pendingName: any;
  // slectedDateNew: Date = this.filterFormDetails ? this.filterFormDetails.fromDate : '';

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService,
    private utilityService: UtilityService,
    private vehicleDataStoreService: VehicleDataStoreService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService,
    private location: Location,
    private pollingService: PollingService,
    private queryModelService: QueryModelService,
    private leadHistoryService: LeadHistoryService,
    private commonDataService: CommonDataService,
    private supervisorService: SupervisorService
  ) {
    if (environment.isMobile === true) {
      this.itemsPerPage = '5';
    } else {
      this.itemsPerPage = '25';
    }

    this.leadId = this.aRoute.snapshot.params['leadId'];

  }

  ngOnInit() {
    const thisUrl = this.router.url;
    console.log(thisUrl);
    this.sharedService.isSUpervisorUserName.subscribe((value: any) => {
      console.log(value);
      if (value) {
        this.userName = value.roleName;
        this.supervisorRoleId = value.roleId;
        this.supervisorRoleType = value.roleType;
      }
    });
    this.sharedService.isSupervisorRoleId.subscribe((value: any) => {
      console.log(value);
      if (value) {
        this.supervisorUserId = value;
      }

    });
    this.sharedService.isSupervisorName.subscribe((value: any) => {
      console.log(value);
      if(value) {
        this.supervisorName = value;
      }
      
    })


    this.loginStoreService.isCreditDashboard.subscribe((userDetails: any) => {
      this.branchId = userDetails.branchId;
      this.userDetailsRoleId = userDetails.roleId;
      this.businessDivision = userDetails.businessDivision[0].bizDivId;
      this.userDetailsRoleType = userDetails.roleType;
      this.selfAssignLoginId = userDetails.loginId;
    });


    if (this.supervisorRoleType == this.userDetailsRoleType) {
      this.selfAssign = true;
    } else {
      this.selfAssign = false;
    }
    if (this.userName) {
      this.roleType = this.supervisorRoleType;
      this.loginUserId = this.supervisorUserId;
      this.roleId = this.supervisorRoleId;
      this.loginUserId = this.supervisorUserId;
      this.router.navigate(['/pages/supervisor/dashboard']);
      this.pendingName = this.supervisorName
    } else {
      this.roleType = this.userDetailsRoleType;
      this.roleId = this.userDetailsRoleId;
      this.loginUserId = localStorage.getItem('userId');
      this.router.navigate(['/pages/dashboard']);
      this.pendingName = 'Me'
    }
    console.log(this.roleType);

    this.supervisorForm = this.fb.group({
      roles: ['']
    })

    if (this.router.url === "/pages/supervisor/dashboard") {
      this.supervisor = true;
    } else {
      this.supervisor = false;
    }



    this.userId = localStorage.getItem('userId')

    localStorage.removeItem('is_pred_done');
    localStorage.removeItem('isPreDisbursement');
    localStorage.removeItem('istermSheet');
    localStorage.removeItem('salesResponse');
    localStorage.removeItem('isFiCumPd');


    localStorage.setItem('isPreDisbursement', 'false');
    if (this.dashboardService.routingData) {
      this.activeTab = this.dashboardService.routingData.activeTab;
      this.subActiveTab = this.dashboardService.routingData.subActiveTab;

      this.onTabsLoading(this.subActiveTab);
    } else {
      if (this.roleType == '1') {
        this.activeTab = 0;
        this.subActiveTab = 3;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType == '2') {
        this.activeTab = 18;
        this.subActiveTab = 21;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType == '4') {
        this.activeTab = 30;
        this.subActiveTab = 31;
        this.onTabsLoading(this.subActiveTab);
        this.onLeads(this.displayTabs.CPCMaker, this.displayTabs.CPCMakerWithMe, 'CPC');
      } else if (this.roleType == '5') {
        this.activeTab = 33;
        this.subActiveTab = 34;
        this.onTabsLoading(this.subActiveTab);
        this.onLeads(this.displayTabs.CPCChecker, this.displayTabs.CPCCheckerWithMe, 'CPC');
      } else if (this.roleType == '6') {
        this.activeTab = 44;
        this.subActiveTab = 45;
        this.onTabsLoading(this.subActiveTab);
      } else if (this.roleType == '7') {
        this.activeTab = 47;
        this.subActiveTab = 48;
        this.onTabsLoading(this.subActiveTab);
      }
    }

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });

    this.filterForm = this.fb.group({
      leadId: [''],
      loanNumber: [''],
      product: [''],
      leadStage: [''],
      fromDate: [''],
      toDate: [''],
      disbFromDate: [''],
      disbToDate: [''],
      loanMinAmt: [null],
      loanMaxAmt: [null]
    });

    this.dashboardFilter();
    this.loanMaxAmtChange();
    this.loanMinAmtChange();
    this.onFromDateChange();
    const currentUrl = this.location.path();
    const value = localStorage.getItem('ddePath');
    const currentLabel = JSON.parse(value);
    if (currentLabel && currentLabel.labelName && currentLabel.labelName === 'Back To Deviation') {
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('1', 'Deviation', currentUrl);
    }

    this.getCountAcrossLeads(this.userId)

    setTimeout(() => {
      if (currentUrl.includes('dashboard') && this.isIntervalId) {
        this.intervalId = this.getPollCount()
      } else {
        clearInterval(this.intervalId)
      }
    }, 300000)

  }

  getPollCount() {
    return setInterval(() => {
      this.pollingService.getPollingLeadCount(this.userId).subscribe((res: any) => {
        console.log('Polling request')
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.leadCount = res.ProcessVariables.leadCount ? res.ProcessVariables.leadCount : 0;
        } else {
          clearInterval(this.intervalId)
        }
      })
    }, 300000)
  }

  getCountAcrossLeads(userId) {

    this.queryModelService.getCountAcrossLeads(userId).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.leadCount = res.ProcessVariables.leadCount ? res.ProcessVariables.leadCount : 0;
        this.isIntervalId = true;
      } else {
        this.leadCount = 0;
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Count Across Leads')
      }
    })

  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  initinequery() {
    const currentUrl = this.location.path();
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigateByUrl(`/pages/query-model`)
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
    this.filterForm.get('loanMaxAmt').valueChanges.pipe(debounceTime(0)).subscribe((data) => {

      const minAmt = this.filterForm.get('loanMinAmt').value;
      const minLoanAmt = Number(minAmt || 0);
      if (data && minLoanAmt >= data) {
        this.isAmountChange = true;
        // this.toasterService.showWarning('Invalid Amount', '');
      }
    });
  }

  loanMinAmtChange() {
    this.filterForm.get('loanMinAmt').valueChanges.pipe(debounceTime(0)).subscribe((data) => {
      if (data) {
        this.isAmountChange = true;
        this.filterForm.get('loanMaxAmt').setValue(null);
      } else {
        this.isAmountChange = false;
      }
    });
  }

  onChangeFromDate(event) {
    this.fromDateChange = this.utilityService.getDateFormat(event);

    if (this.fromDateChange) {
      this.isFromDate = true;
    } else {
      this.isFromDate = false;
    }
  }
  onChangeEndDate(event) {
    this.endDateChange = this.utilityService.getDateFormat(event);
    if (this.endDateChange) {
      this.isFromDate = false;
    } else if (this.fromDateChange && (this.endDateChange == undefined || this.endDateChange == '')) {
      this.isFromDate = true;
    }
  }

  onChangeDisbFromDate(event) {
    this.disbFromDate = this.utilityService.getDateFormat(event);
    if (this.disbFromDate) {
      this.isFromDate = true;
    } else {
      this.isFromDate = false;
    }
  }

  onChangeDisbToDate(event) {
    this.disbToDate = this.utilityService.getDateFormat(event);
    if (this.disbToDate) {
      this.isFromDate = false;
    } else if (this.disbFromDate && (this.disbToDate == undefined || this.disbToDate == '')) {
      this.isFromDate = true;
    }
  }

  onMinAmtChange(event) {
    this.minLoanAmtChange = event;
    if (this.minLoanAmtChange) {
      this.isAmountChange = true;
    }
  }

  onMaxAmtChange(event) {
    this.maxLoanAmtChange = event;
    if (this.maxLoanAmtChange) {
      this.isAmountChange = false;
    } else if (this.minLoanAmtChange && !this.maxLoanAmtChange) {
      this.isAmountChange = true;
    }
  }

  onFromDateChange() {
    if (!this.displayTabs.PDD && !this.displayTabs.PDDforCPC) {

    }
    this.filterForm.get('fromDate').valueChanges.pipe(debounceTime(0)).subscribe((data) => {
      if (data || this.filterForm.get('fromDate').dirty) {
        // this.isFromDate = true;
        this.filterForm.get('toDate').setValue(null);
      } else if (this.fromDateChange == undefined) {
        this.isFromDate = false;
      }
    });

    this.filterForm.get('disbFromDate').valueChanges.pipe(debounceTime(0)).subscribe((data) => {
      if (data || this.filterForm.get('disbFromDate').dirty) {
        // this.isFromDate = true;
        this.filterForm.get('disbToDate').setValue(null);
      } else if (this.disbFromDate == undefined) {
        this.isFromDate = false;
      }
    });
  }


  // Loading dashboard pages
  onTabsLoading(data, event?) {
    switch (this.activeTab) {
      case 15:
        this.isPDD = false;
        this.isChequeTracking = false;
        this.isLog = true;
        this.getSalesLeads(this.itemsPerPage, event);
        break;
      case 16:
        this.isPDD = true;
        this.isChequeTracking = false;
        this.isLog = false;
        this.getSalesLeads(this.itemsPerPage, event);
        break;
      case 17:
        this.isPDD = false;
        this.isChequeTracking = true;
        this.isLog = false;
        this.getSalesLeads(this.itemsPerPage, event);
        break;
      default:
        break;
    }
    switch (data) {
      case 4: case 6: case 8: case 10: case 13: case 21: case 23: case 25: case 28: case 31: case 34: case 37: case 40: case 42: case 45: case 48:
        this.onAssignTab = false;
        this.onReleaseTab = true;
        this.myLeads = true;
        break;
      case 5: case 7: case 9: case 11: case 14: case 22: case 24: case 26: case 29: case 32: case 35: case 38: case 41: case 43: case 46: case 49:
        this.onAssignTab = true;
        this.onReleaseTab = false;
        this.myLeads = false;
        break;
      default:
        break;
    }
    switch (data) {
      case 3:
        this.isPDD = false;
        this.isChequeTracking = false;
        this.isLog = false;
        this.getSalesLeads(this.itemsPerPage, event);
        break;
      case 4: case 5:
        this.taskName = 'Sanctioned Leads';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 6: case 7:
        this.taskName = 'Declined Leads';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 8: case 9:
        this.taskName = 'Personal Discussion';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 10: case 11:
        this.taskName = 'Vehicle Viability';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 13: case 14:
        this.taskName = 'Field Investigation';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 21: case 22:
        this.taskName = 'DDE';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 23: case 24:
        this.taskName = 'Deviation';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 25: case 26:
        this.taskName = 'Credit Decision';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 28: case 29:
        this.taskName = 'TermSheet';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 31: case 32:
        this.taskName = 'CPC Maker';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 34: case 35:
        this.taskName = 'CPC Checker';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 37: case 38:
        this.taskName = 'Predisbursement';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 40: case 41:
        this.taskName = 'CPC-PDD';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 42: case 43:
        this.taskName = 'Send Back To Sales';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 45: case 46:
        this.taskName = 'RCU';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
        break;
      case 48: case 49:
        this.taskName = 'CPC-CAD';
        this.getTaskDashboardLeads(this.itemsPerPage, event);
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
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab,
    };
    if (this.sortTab === '') {
      this.sortByLead = false;
      this.sortByDate = false;
      this.sortByProduct = false;
      this.sortByLoanAmt = false;
      this.sortByStage = false;
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
    } else if (tabName === 'CPC') {
      this.toggleDdeService.setIsDDEClicked('0');
      this.toggleDdeService.setOperationType('1', 'CPC', currentUrl);
    } else {
      this.toggleDdeService.clearToggleData();
    }

    if (this.activeTab === this.displayTabs.Leads && this.subActiveTab === this.displayTabs.NewLeads) {
      this.onReleaseTab = false;
      this.onAssignTab = false;
    } else {
      this.onReleaseTab = true;
      this.onAssignTab = false;
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
    this.newArray = res.ProcessVariables.loanLead;
    switch (this.activeTab) {
      case 15:
        this.newArray = res.ProcessVariables.processLogs;
        break;
      case 16:
        this.newArray = res.ProcessVariables.pddDetails;
        break;
      case 17:
        this.newArray = res.ProcessVariables.chequeTrackingDetails;
        break;

      default:
        break;
    }
    // this.newArray = response;
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
      if (this.subActiveTab === this.displayTabs.NewLeads) {
        if (res.ProcessVariables.loanLead != null) {
          this.isLoadLead = true;
        } else {
          this.isLoadLead = false;
          this.newArray = [];
        }
      } else {
        switch (this.activeTab) {
          case 15:
            if (res.ProcessVariables.processLogs != null) {
              this.isLoadLead = true;
            } else {
              this.isLoadLead = false;
              this.newArray = [];
            }
            break;
          case 16:
            if (res.ProcessVariables.pddDetails != null) {
              this.isLoadLead = true;
            } else {
              this.isLoadLead = false;
              this.newArray = [];
            }
            break;
          case 17:
            if (res.ProcessVariables.chequeTrackingDetails != null) {
              this.isLoadLead = true;
            } else {
              this.isLoadLead = false;
              this.newArray = [];
            }
            break;

          default:
            break;
        }
      }

    });
  }

  // new leads
  getSalesLeads(perPageCount, pageNumber?) {
    const data = {
      userId: this.loginUserId,
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      isPDD: this.isPDD,
      isChequeTracking: this.isChequeTracking,
      isLog: this.isLog,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
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

  getTaskDashboardLeads(perPageCount, pageNumber?) {
    
    const data = {
      taskName: this.taskName,
      branchId: this.branchId,
      roleId: this.roleId,
      userId: this.loginUserId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: this.myLeads,
      leadId: this.filterFormDetails ? this.filterFormDetails.leadId : '',
      fromDate: this.filterFormDetails ? this.filterFormDetails.fromDate : '',
      toDate: this.filterFormDetails ? this.filterFormDetails.toDate : '',
      productCategory: this.filterFormDetails ? this.filterFormDetails.product : '',
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
    this.onTabsLoading(this.subActiveTab, event);
  }

  onClick() {
    this.onTabsLoading(this.subActiveTab);
  }

  onRoutingTabs(data) {
    switch (this.activeTab) {
      case 15:
        this.router.navigateByUrl(`/pages/loanbooking/${this.leadId}/loan-booking-status`);
        break;
      case 16:
        this.router.navigateByUrl(`/pages/pdd/${this.leadId}`);
        break;
      case 17:
        this.router.navigateByUrl(`/pages/cheque-tracking/${this.leadId}`);
        break;

      default:
        break;
    }
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
        // tslint:disable-next-line: triple-equals
        if (this.salesResponse == false) {
          this.router.navigate([`/pages/credit-decisions/${this.leadId}/cam`]);
          // tslint:disable-next-line: triple-equals
        } else if (this.salesResponse == true) {
          this.router.navigate([`/pages/credit-decisions/${this.leadId}/negotiation`]);
        }
        break;
      case 28: case 29:
        localStorage.setItem('istermSheet', 'true');
        this.router.navigateByUrl(`/pages/credit-decisions/${this.leadId}/new-term-sheet`);
        break;
      case 31: case 32:
        this.router.navigateByUrl(`/pages/cpc-maker/${this.leadId}/term-sheet`);
        break;
      case 34: case 35:
        this.router.navigateByUrl(`/pages/cpc-checker/${this.leadId}/term-sheet`);
        break;
      case 37: case 38:
        this.router.navigateByUrl(`/pages/pre-disbursement/${this.leadId}/credit-condition`);
        break;
      case 40: case 41:
        this.router.navigateByUrl(`/pages/pdd/${this.leadId}`);
        break;
      case 42: case 43:
        this.router.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
        break;
      case 45: case 46:
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/rcu`);
        break;
      case 48: case 49:
        this.router.navigateByUrl(`/pages/cpc-maker/${this.leadId}/term-sheet`);
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
      if (stageCode === '10') {
        this.router.navigateByUrl(`/pages/lead-section/${leadId}`);
      } else if (stageCode === '20') {
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
    console.log(this.filterForm.controls);
    if (this.filterForm.dirty) {
      this.showFilter = !this.showFilter;
      this.isFilterApplied = true;
      this.filterFormDetails = this.filterForm.value;
      this.filterFormDetails.fromDate = this.utilityService.getDateFormat(
        this.filterFormDetails.fromDate
      );
      this.filterFormDetails.toDate = this.utilityService.getDateFormat(
        this.filterFormDetails.toDate
      );
      this.onTabsLoading(this.subActiveTab);
    } else {
      this.toasterService.showError('Please fill atleast one field.', 'Filter Details');
    }
  }

  onRelase(taskId?, leadId?) {
    this.isRelease = true;
    this.isClaim = false;
    this.leadId = leadId;
    this.taskDashboard.releaseTask(taskId).subscribe((res: any) => {
      const response = res;
      // tslint:disable-next-line: triple-equals
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess(
          'Lead Released Successfully',
          'Released'
        );
        this.saveTaskLogs();
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

  onAssign(taskId?, leadId?) {
    this.isClaim = true;
    this.isRelease = false;
    this.leadId = leadId;
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab,
    };
    this.taskDashboard.assignTask(taskId).subscribe((res: any) => {
      const response = JSON.parse(res);
      // tslint:disable-next-line: triple-equals
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        if (this.userName) {
          return;
        } else {
          this.onRoutingTabs(this.subActiveTab);
        }
        this.saveTaskLogs();
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }


  // Self-Assign Method
  onSelfAssignClick(taskId) {
    this.leadTaskId = taskId;
    console.log(this.leadTaskId);
    
  }
  onSupervisorAssign() {
    const data = {
      taskId: this.leadTaskId,
      loginId: this.selfAssignLoginId
    }
    this.supervisorService.supervisorReAssign(data).subscribe((res: any) => {
      console.log(res);
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.toasterService.showSuccess('Self Assigned Successfully', 'Self-Assign');
        this.closeModal2.nativeElement.click();
        this.onClick();
      } else {
        this.toasterService.showError(response.ProcessVariables.error.message, 'Self-Assign');
      }

    })

  }

  onReAssignClick(item) {
    this.reAssignData = item;
    // console.log(this.reAssignData);
    this.getSupervisorUserDetails();
    // console.log(this.supervisorForm);
  }

  getSupervisorUserDetails() {
    const data = {
      leadId: this.reAssignData.leadId,
      roleId: this.supervisorRoleId,
      userId: this.supervisorUserId
    }
    this.supervisorService.getSupervisorUserDetails(data).subscribe((res: any) => {
      console.log(res);
      this.userData = res.ProcessVariables.loginIds;
      this.loginId = res.ProcessVariables.thisUser;

    })
  }

  onConfirmAssign() {
    this.showModal = true;
  }

  supervisorReAssign() {
    const data = {
      taskId: this.reAssignData.taskId,
      loginId: this.supervisorForm.value.roles
    }
    this.supervisorService.supervisorReAssign(data).subscribe((res: any) => {
      console.log(res);
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.toasterService.showSuccess('Re Assigned Successfully', 'Re-Assign');
        this.onClick();
        this.closeModal.nativeElement.click();
        this.closeModal1.nativeElement.click();
      } else {
        this.toasterService.showError(response.ProcessVariables.error.message, 'Re-Assign');
      }

    })
  }

  onBack() {
    this.sharedService.getUserName('');
    this.sharedService.getSupervisorName('');
    this.sharedService.getUserRoleId('');
    this.router.navigate(['pages/supervisor']);
  }

  saveTaskLogs() {
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: this.leadId,
      isClaim: this.isClaim,
      isRelease: this.isRelease,
      taskName: this.taskName
    };
    console.log(data);
    this.taskDashboard.saveTaskLogs(data).subscribe((res: any) => {
      console.log('save task response', res);
    });
  }

  // external methods
  assignTaskId(taskId) {
    this.sharedService.getTaskID(taskId);
  }
  getLoanNumber(loanNumber) {
    this.dashboardService.routingData = {
      activeTab: this.activeTab,
      subActiveTab: this.subActiveTab
    };
    this.sharedService.getLoanNumber(loanNumber);
  }
  getLeadId(item) {
    localStorage.setItem('salesResponse', item.is_sales_response_completed);
    this.salesResponse = item.is_sales_response_completed;
    localStorage.setItem('is_pred_done', item.is_pred_done);
    localStorage.setItem('isFiCumPd', item.isFiCumPD);
    this.vehicleDataStoreService.setCreditTaskId(item.taskId);
    this.sharedService.getTaskID(item.taskId);
    this.sharedService.setProductCatCode(item.productCatCode);
    this.sharedService.setProductCatName(item.productCatName);
  }

  onLeadHistory(leadId) {
    this.leadHistoryService.leadHistoryApi(leadId)
      .subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;

          if (appiyoError === '0' && apiError === '0') {
            const leadHistoryData = response;
            console.log('leadHistoryData', leadHistoryData);
            this.commonDataService.shareLeadHistoryData(leadHistoryData);
          } else {
            const message = response.ProcessVariables.error.message;
            this.toasterService.showError(message, 'Lead Creation');
          }
        }
      );
  }
}
