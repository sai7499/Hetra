import { Component, OnInit } from '@angular/core';

import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { Router } from '@angular/router';
import { HttpService } from '@services/http.service';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-dde-branch-leads',
  templateUrl: './dde-branch-leads.component.html',
  styleUrls: ['./dde-branch-leads.component.css']
})
export class DdeBranchLeadsComponent implements OnInit {

  itemsPerPage = '25';
  labels: any = {};
  roleId: string;
  branchId: any;
  pdListDashboard: any;
  limit: any;
  count: any;
  pageNumber: any;
  currentPage: any;
  totalItems: any;
  taskId: any;
  isLoadLead: boolean;


  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private taskDashboard: TaskDashboard,
    private router: Router,
    private httpService: HttpService,
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
    });
    this.getDDEBranchLeads(this.itemsPerPage);
  }

  onClick() {
    this.getDDEBranchLeads(this.itemsPerPage);
  }

  getDDEBranchLeads(perPageCount, pageNumber?) {
    const data = {
      taskName: 'DDE',
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
    this.pdListDashboard = response;
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
  }

  setPage(event) {
    this.getDDEBranchLeads(this.itemsPerPage, event);
  }

  onAssign(id, leadId) {

    this.taskDashboard.assignTask(id).subscribe((res: any) => {
      console.log('assignResponse', res);
      const response = JSON.parse(res);
      console.log(response);
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Lead Assigned Successfully', 'Assigned');
        this.router.navigate(['/pages/dde/' + leadId + '/lead-details']);
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

}
