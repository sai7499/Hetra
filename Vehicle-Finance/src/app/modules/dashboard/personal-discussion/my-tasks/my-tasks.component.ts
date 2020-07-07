import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  itemsPerPage = '25';
  labels: any = {};
  roleId: any;
  pdListDashboard: any;
  branchId: any;
  limit: any;
  count: any;
  pageNumber: any;
  currentPage: any;
  totalItems: any;

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService
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
      // console.log('values For User in My Task', value);
    });
    this.getPdMyTask(this.itemsPerPage);
  }

  onClick() {
    this.getPdMyTask(this.itemsPerPage);
  }
  getPdMyTask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Personal Discussion',
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
    this.pdListDashboard = response;
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
  }

  setPage(event) {
    this.getPdMyTask(this.itemsPerPage, event);
  }

  onRelase(id) {
    this.taskDashboard.releaseTask(id).subscribe((res: any) => {
      console.log('release Task', res);
      const response = res;
      console.log(response.ErrorCode);
      
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Lead Released Successfully', 'Released');
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

}
