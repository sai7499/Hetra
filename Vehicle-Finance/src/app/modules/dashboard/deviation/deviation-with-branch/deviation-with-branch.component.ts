import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { Router } from '@angular/router';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-deviation-with-branch',
  templateUrl: './deviation-with-branch.component.html',
  styleUrls: ['./deviation-with-branch.component.css']
})
export class DeviationWithBranchComponent implements OnInit {

  itemsPerPage = '25';
  labels: any = {};
  roleId: string;
  branchId: any;
  newArray: any;
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
    private router: Router,
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
  //     this.roleType = value.roleType;
  //   });
  //   this.getBranchLeads(this.itemsPerPage);
  // }

    this.dashboardService.isFilterData.subscribe((filterValue: any) => {
    console.log('filterDetails', filterValue);
    this.filterDetails = filterValue;
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = String(value.roleId);
      this.branchId = value.branchId;
      this.roleType = value.roleType;
    });
    this.getBranchLeads(filterValue);
  });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
    this.roleId = String(value.roleId);
    this.branchId = value.branchId;
    this.roleType = value.roleType;
  });
    this.getBranchLeads(this.itemsPerPage);

}

onClick() {
  this.getBranchLeads(this.itemsPerPage);
}

getBranchLeads(filterValue, pageNumber?) {
  const data = {
    taskName: 'Deviation',
    branchId: this.branchId,
    roleId: this.roleId,
    // tslint:disable-next-line: radix
    currentPage: parseInt(pageNumber),
    // tslint:disable-next-line: radix
    perPage: parseInt(this.itemsPerPage),
    myLeads: false,
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

  // getBranchLeads(perPageCount, pageNumber?) {
  //   const data = {
  //     taskName: 'Deviation',
  //     branchId: this.branchId,
  //     roleId: this.roleId,
  //     // tslint:disable-next-line: radix
  //     currentPage: parseInt(pageNumber),
  //     // tslint:disable-next-line: radix
  //     perPage: parseInt(perPageCount),
  //     myLeads: false,
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
    this.getBranchLeads(this.filterDetails, event);
  }

  onAssign(id, leadId) {

    this.taskDashboard.assignTask(id).subscribe((res: any) => {
      console.log('assignResponse', res);
      const response = JSON.parse(res);
      console.log(response);
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        this.router.navigate(['/pages/deviation-dashboard/' + leadId + '/dashboard-deviation-details']);
      } else {
        this.toasterService.showError(response.Error, '');

      }
    });
  }

}
