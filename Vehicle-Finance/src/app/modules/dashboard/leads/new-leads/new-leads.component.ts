import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.css']
})
export class NewLeadsComponent implements OnInit {

  newArray;
  salesLeads;
  creditLeads;
  itemsPerPage = '5';
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
    private vehicleDataStoreService: VehicleDataStoreService
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
      const response = res.ProcessVariables.loanLead;
      this.newArray = response;
      this.limit = res.ProcessVariables.perPage;
      this.pageNumber = res.ProcessVariables.from;
      this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);

      this.currentPage = res.ProcessVariables.currentPage;
      this.totalItems = res.ProcessVariables.totalPages;
      this.from = res.ProcessVariables.from;

    });
  }



  getCreditDashboard() {
    const data = {
      branchId: this.branchId,
      roleId: this.roleId
    };
    this.dashboardService.getCreditDashboard(data).subscribe((res: any) => {
      const response = res.ProcessVariables.loanLead;
      this.newArray = response;
    });
  }

  setPage(event) {
    this.getMyLeads(this.itemsPerPage, event);
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );

    this.dashboardService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      });
    if (this.roleType == '2') {
        this.getCreditDashboard();
        } else {
        this.getMyLeads(this.itemsPerPage);
        }

    }

  getLeadIdSales(Id) {
    this.vehicleDataStoreService.setSalesLeadID(Id);
  }

  getLeadId(id) {
    this.vehicleDataStoreService.setCreditLeadId(id);
  }

}
