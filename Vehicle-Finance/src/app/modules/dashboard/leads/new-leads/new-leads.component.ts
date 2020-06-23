import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { LoginStoreService } from '@services/login-store.service';
import { Router } from '@angular/router';

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
    private router: Router
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



  getCreditDashboard(perPageCount, pageNumber?) {
    const data = {
      branchId: this.branchId,
      roleId: this.roleId,
      perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber)
    };
    this.dashboardService.getCreditDashboard(data).subscribe((res: any) => {
      this.setPageData(res);      
    });
  }
  setPageData(res){
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
      this.getCreditDashboard(this.itemsPerPage, event);
    }
    else {
      this.getMyLeads(this.itemsPerPage,event);
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
        this.getCreditDashboard(this.itemsPerPage);
        } else {
        this.getMyLeads(this.itemsPerPage);
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

}
