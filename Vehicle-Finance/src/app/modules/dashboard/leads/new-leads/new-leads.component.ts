import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { LoginStoreService } from '@services/login-store.service';
import { Router } from '@angular/router';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.css']
})
export class NewLeadsComponent implements OnInit {

  newArray;
  salesLeads;
  creditLeads;
  itemsPerPage;
  totalItems;
  labels: any = {};
  lovData: any;
  count: any;
  currentPage: any;
  limit;
  pageNumber;
  from;
  isCreditShow;
  branchId;
  roleId;
  roleType;
  isLoadLead = true;
  filterDetails: any;
  isMobile = environment.isMobile;

  constructor(
    private labelsData: LabelsService,
    private dashboardService: DashboardService,
    private vehicleDataStoreService: VehicleDataStoreService,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private sharedService: SharedService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService
  ) {
    console.log('environment', environment);

    // if (environment.isMobile === true) {
    //   this.itemsPerPage = '25';
    // } else {
    //   this.itemsPerPage = '5';
    // }

    if (window.screen.width > 768) {
      this.itemsPerPage = '25';
    } else if (window.screen.width <= 768) {
      this.itemsPerPage = '5';
    }
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );

    this.dashboardService.isFilterData.subscribe((filterValue: any) => {
      console.log('filterDetails', filterValue);
      this.filterDetails = filterValue;
      // this.getMyLeads(value);
      this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
        this.branchId = value.branchId;
        this.roleId = value.roleId;
        this.roleType = value.roleType;
        console.log('role Type', this.roleType);
      });
      if (this.roleType == '2') {
        // this.getDDELeads(this.itemsPerPage);
        this.getCreditFilterLeads(filterValue);
      } else {
        this.getSalesFilterLeads(filterValue);
      }
    });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    if (this.roleType == '2') {
      // this.getDDELeads(this.itemsPerPage);
      this.getCreditFilterLeads(this.itemsPerPage);
    } else {
      // this.getMyLeads(this.itemsPerPage);
      this.getSalesFilterLeads(this.itemsPerPage);
    }

  }

  getMyLeads(perPageCount, pageNumber?) {

    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
    };
    console.log('normal get my leads', data)
    this.responseForSales(data);
  }

  getSalesFilterLeads(filterValue, pageNumber?) {
    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(this.itemsPerPage),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      leadId: filterValue.leadId ? filterValue.leadId : '',
      fromDate: filterValue.fromDate ? filterValue.fromDate : '',
      toDate: filterValue.toDate ? filterValue.toDate : '',
      productCategory: filterValue.product ? filterValue.product : '',
      loanMinAmt: filterValue.loanMinAmt ? filterValue.loanMinAmt : '',
      loanMaxAmt: filterValue.loanMaxAmt ? filterValue.loanMaxAmt : ''
    };
    console.log('getmyFilterdata', data);

    this.responseForSales(data);
  }

  responseForSales(data) {
    this.dashboardService.myLeads(data).subscribe((res: any) => {
      this.setPageData(res);
      if (res.ProcessVariables.loanLead != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
    }
    });
  }

  getDDELeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'DDE',
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

  getCreditFilterLeads(filterValue, pageNumber?) {
    const data = {
      taskName: 'DDE',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(this.itemsPerPage),
      myLeads: true,
      leadId: filterValue ? filterValue.leadId : '',
      fromDate: filterValue ? filterValue.fromDate : '',
      toDate: filterValue ? filterValue.toDate : '',
      product: filterValue ? filterValue.product : '',
      loanMinAmt: filterValue ? filterValue.loanMinAmt : '',
      loanMaxAmt: filterValue ? filterValue.loanMaxAmt : ''
    };
    this.responseForCredit(data);
  }

  responseForCredit(data) {
    this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
      this.setPageData(res);
      if (res.ProcessVariables.loanLead != null) {
        this.isLoadLead = true;
      } else {
        this.isLoadLead = false;
    }
    });
  }

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
    if (this.roleType == '2') {
      // this.getDDELeads(this.itemsPerPage, event);
      this.getCreditFilterLeads(this.filterDetails, event);
    } else {
      // this.getMyLeads(this.itemsPerPage, event);

      this.getSalesFilterLeads(this.filterDetails, event);
    }
  }

  onClick() {
    if (this.roleType == '2') {
      this.getDDELeads(this.itemsPerPage);
    } else {
      return;
    }
  }

  getLeadIdSales(Id, stageCode?, taskId?) {
    this.vehicleDataStoreService.setSalesLeadID(Id);
    this.sharedService.getTaskID(taskId)

    if (stageCode == '10') {
      this.router.navigateByUrl(`/pages/lead-section/${Id}`);
    } else if (stageCode == '20') {
      this.router.navigateByUrl(`/pages/sales/${Id}/lead-details`);
    }


  }

  getLeadId(item) {
    this.vehicleDataStoreService.setCreditTaskId(item.taskId);
    this.sharedService.getTaskID(item.taskId)
  }

  onRelase(id) {
    this.taskDashboard.releaseTask(id).subscribe((res: any) => {
      const response = res;
      if (response.ErrorCode == 0) {
        this.toasterService.showSuccess('Lead Released Successfully', 'Released');
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

}
