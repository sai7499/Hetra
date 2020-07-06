import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '@modules/login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';

@Component({
  selector: 'app-viability-checks',
  templateUrl: './viability-checks.component.html',
  styleUrls: ['./viability-checks.component.css']
})
export class ViabilityChecksComponent implements OnInit {

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

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
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
    });
    this.getViabilityDashboard(this.itemsPerPage);
  }

  getViabilityDashboard(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Vehicle Viability',
      branchId: this.branchId,
      roleId: this.roleId,
      // tslint:disable-next-line: radix
      currentPage: parseInt(pageNumber),
      // tslint:disable-next-line: radix
      perPage: parseInt(perPageCount),
      myLeads: true,
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
  }

  setPage(event) {
    this.getViabilityDashboard(this.itemsPerPage, event);
  }

  onRelase(id) {
    this.taskDashboard.releaseTask(id).subscribe((res: any) => {
      console.log('release Task', res);
    });
  }

}
