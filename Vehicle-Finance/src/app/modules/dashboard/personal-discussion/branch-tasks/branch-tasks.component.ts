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
  itemsPerPage = 5;
  labels: any = {};
  q;
  roleId: string;
  branchId: any;
  pdListDashboard: any;

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
      console.log('value.branchId For User in branch Task', value.branchId);
     });
    this.getPdBrabchTask();
  }

  getPdBrabchTask() {
    const data = {
      taskName: 'Personal Discussion',
      branchId: this.branchId,
      roleId: this.roleId, /* Uncomment this after getting proper data */
      // roleId: '1',
      currentPage: 1,
      perPage: 3,
      myLeads: false,
    };
    this.personalDiscussion.getPdTaskDashboard(data).subscribe((value: any) => {
      const processveriables = value.ProcessVariables;
      this.pdListDashboard = processveriables.loanLead;
      console.log('Leads for Get PD data dashboard for BankBranch', this.pdListDashboard);
    });
  }

}
