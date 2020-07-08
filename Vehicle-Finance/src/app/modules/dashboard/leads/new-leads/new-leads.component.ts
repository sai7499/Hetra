import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { LoginStoreService } from '@services/login-store.service';
import { Router } from '@angular/router';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.css']
})
export class NewLeadsComponent implements OnInit {

  newArray;
  salesLeads;
  creditLeads;
  itemsPerPage = '25';
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

  constructor(
    private labelsData: LabelsService,
    private dashboardService: DashboardService,
    private vehicleDataStoreService: VehicleDataStoreService,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService
  ) { }

  getMyLeads(perPageCount, pageNumber?) {

    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber)
    };

    this.dashboardService.myLeads(data).subscribe((res: any) => {
      this.setPageData(res);
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
    this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
      this.setPageData(res);
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
      this.getDDELeads(this.itemsPerPage, event);
    } else {
      this.getMyLeads(this.itemsPerPage, event);
      }
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      });
    if (this.roleType == '2') {
        this.getDDELeads(this.itemsPerPage);
        } else {
        this.getMyLeads(this.itemsPerPage);
        }

    }

    onClick() {
      if (this.roleType == '2') {
        this.getDDELeads(this.itemsPerPage);
        } else {
          return;
        }
    }

  getLeadIdSales(Id, stageCode?) {
    this.vehicleDataStoreService.setSalesLeadID(Id);

    if (stageCode == '10') {
      this.router.navigateByUrl(`/pages/lead-section/${Id}`);
    } else if (stageCode == '20') {
      this.router.navigateByUrl(`/pages/sales/${Id}/lead-details`);
    }


  }

  getLeadId(id) {
    this.vehicleDataStoreService.setCreditLeadId(id);
  }

  onRelase(id) {
    this.taskDashboard.releaseTask(id).subscribe((res: any) => {
      console.log('release Task', res);
      const response = res;
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Lead Released Successfully', 'Released');
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

}
