import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { DashboardService } from '@services/dashboard/dashboard.service';


@Component({
  selector: 'app-decision-with-me',
  templateUrl: './decision-with-me.component.html',
  styleUrls: ['./decision-with-me.component.css']
})
export class DecisionWithMeComponent implements OnInit {

  leadDetails;
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
  roleType: any;
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

  //   this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
  //     this.roleId = String(value.roleId);
  //     this.branchId = value.branchId;
  //     console.log('values For User in My Task', value);
  //   });
  //   this.getMyCreditDecisionLeads(this.itemsPerPage);
  // }


    this.dashboardService.isFilterData.subscribe((filterValue: any) => {
    console.log('filterDetails', filterValue);
    this.filterDetails = filterValue;
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = String(value.roleId);
      this.branchId = value.branchId;
      this.roleType = value.roleType;
    });
    this.getMyCreditDecisionLeads(filterValue);
  });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
    this.roleId = String(value.roleId);
    this.branchId = value.branchId;
    this.roleType = value.roleType;
  });
    this.getMyCreditDecisionLeads(this.itemsPerPage);

}

onClick() {
  this.getMyCreditDecisionLeads(this.itemsPerPage);
}

getMyCreditDecisionLeads(filterValue, pageNumber?) {
  const data = {
    taskName: 'Credit Decision',
    branchId: this.branchId,
    roleId: this.roleId,
    // tslint:disable-next-line: radix
    currentPage: parseInt(pageNumber),
    // tslint:disable-next-line: radix
    perPage: parseInt(this.itemsPerPage),
    myLeads: true,
    leadId: filterValue.leadId ? filterValue.leadId : '',
    fromDate: filterValue.fromDate ? filterValue.fromDate : '',
    toDate: filterValue.toDate ? filterValue.toDate : '',
    product: filterValue.product ? filterValue.product : '',
    loanMinAmt: filterValue.loanMinAmt ? filterValue.loanMinAmt : '',
    loanMaxAmt: filterValue.loanMaxAmt ? filterValue.loanMaxAmt : ''
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

  // getMyCreditDecisionLeads(perPageCount, pageNumber?) {
  //   const data = {
  //     taskName: 'Credit Decision',
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
    this.getMyCreditDecisionLeads(this.filterDetails, event);
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
