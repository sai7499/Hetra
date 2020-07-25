import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-decision-with-branch',
  templateUrl: './decision-with-branch.component.html',
  styleUrls: ['./decision-with-branch.component.css']
})
export class DecisionWithBranchComponent implements OnInit {

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

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = String(value.roleId);
      this.branchId = value.branchId;
    });
    this.getDecisionLeads(this.itemsPerPage);
  }

  onClick() {
    this.getDecisionLeads(this.itemsPerPage);

  }

  getDecisionLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Credit Decision',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: false,
    };
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
  }

  setPage(event) {
    this.getDecisionLeads(this.itemsPerPage, event);
  }

  onAssign(id, leadId) {

    this.taskDashboard.assignTask(id).subscribe((res: any) => {
      console.log('assignResponse', res);
      const response = JSON.parse(res);
      console.log(response);
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Assigned Successfully', 'Assigned');
        this.router.navigate(['pages/credit-decisions/' + leadId + '/credit-condition']);
      } else {
        this.toasterService.showError(response.Error, '');

      }
    });
  }

}
