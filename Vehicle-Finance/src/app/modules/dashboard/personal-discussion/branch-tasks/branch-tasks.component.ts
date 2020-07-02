import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '../../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';

@Component({
  selector: 'app-branch-tasks',
  templateUrl: './branch-tasks.component.html',
  styleUrls: ['./branch-tasks.component.css']
})
export class BranchTasksComponent implements OnInit {

  leadDetails;
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

  constructor(private labelsData: LabelsService,
              private loginService: LoginService,
              private loginStoreService: LoginStoreService,
              private personalDiscussion: PersonalDiscussionService) {
    this.leadDetails = [
      {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000002, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000003, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000004, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'}
    ];
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
    this.getPdBrabchTask(this.itemsPerPage);
  }

  getPdBrabchTask(perPageCount, pageNumber?) {
    const data = {
      taskName: 'Personal Discussion',
      branchId: this.branchId,
      roleId: this.roleId,
      currentPage: parseInt(pageNumber),
      perPage: parseInt(perPageCount),
      myLeads: false,
    };
    this.personalDiscussion.getPdTaskDashboard(data).subscribe((res: any) => {
      this.setPageData(res);
      const processveriables = res.ProcessVariables;
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
   this.getPdBrabchTask(this.itemsPerPage, event);
  }

}
