import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';

@Component({
  selector: 'app-checker-leads-with-me',
  templateUrl: './checker-leads-with-me.component.html',
  styleUrls: ['./checker-leads-with-me.component.css']
})
export class CheckerLeadsWithMeComponent implements OnInit {

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

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private taskDashboard: TaskDashboard
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
      console.log('values For User in My Task', value);
    });
    this.getPdMyTask(this.itemsPerPage);
  }

  getPdMyTask(perPageCount, pageNumber?) {
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
    this.getPdMyTask(this.itemsPerPage, event);
  }


}
