import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-declined-leads-with-me',
  templateUrl: './declined-leads-with-me.component.html',
  styleUrls: ['./declined-leads-with-me.component.css']
})
export class DeclinedLeadsWithMeComponent implements OnInit {

  itemsPerPage = '25';
  labels: any = {};
  roleId: any;
  newArray: any;
  branchId: any;
  limit: any;
  count: any;
  pageNumber: any;
  currentPage: any;
  totalItems: any;
  isLoadLead = true;
  roleType: string;
  filterDetails: any;

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private dashboardService: DashboardService
    ) {
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
      this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
        this.roleId = String(value.roleId);
        this.branchId = value.branchId;
        this.roleType = value.roleType;
      });
      this.getDeclinedLeads(filterValue);
    });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = String(value.roleId);
      this.branchId = value.branchId;
      this.roleType = value.roleType;
    });
    this.getDeclinedLeads(this.itemsPerPage);

  }

  onClick() {
    this.getDeclinedLeads(this.itemsPerPage);
  }

  getDeclinedLeads(filterValue, pageNumber?) {
    const data = {
      taskName: 'Declined Leads',
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
      productCategory: filterValue ? filterValue.product : '',
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

  // getBranchDeclinedLeads(perPageCount, pageNumber?) {
  //   const data = {
  //     taskName: 'Declined Leads',
  //     branchId: this.branchId,
  //     roleId: this.roleId,
  //     // tslint:disable-next-line: radix
  //     currentPage: parseInt(pageNumber),
  //     // tslint:disable-next-line: radix
  //     perPage: parseInt(perPageCount),
  //     myLeads: true
  //   };
  //   this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
  //     this.setPageData(res);
  //     if (res.ProcessVariables.loanLead != null) {
  //       this.isLoadLead = true;
  //     } else {
  //       this.isLoadLead = false;
  //   }
  //   });
  // }

  setPageData(res) {
    const response = res.ProcessVariables.loanLead;
    this.newArray = response;
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
  }

  setPage(event) {
    this.getDeclinedLeads(this.filterDetails, event);
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
