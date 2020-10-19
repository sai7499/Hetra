import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '@modules/login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { LoanCreationService } from '@services/loan-creation.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-loan-status',
  templateUrl: './loan-status.component.html',
  styleUrls: ['./loan-status.component.css']
})
export class LoanStatusComponent implements OnInit {

  labels;
  validationData;
  leadId;
  processLogs = [];
  isLoadLead: boolean;

  constructor(

    private fb: FormBuilder,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService,
    private router: Router,
    private loanCreationService: LoanCreationService,
    private activateRoute: ActivatedRoute,
    private toasterService: ToasterService
  ) {

  }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      console.log('label', res)
      this.validationData = res.validationData;
    });
    this.getLoanProcessLogs();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activateRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getLoanProcessLogs() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId')
    };
    this.loanCreationService.getLoanProcessLogs(data).subscribe((res: any) => {
      const response = res;
      console.log(response);

      this.processLogs = response.ProcessVariables.processLogDetails;
      console.log(this.processLogs);
      if (res.ProcessVariables.processLogDetails === null) {
        this.isLoadLead = false;
        this.processLogs = [];
      } else {
        this.isLoadLead = true;
      }

    });
  }
  Refresh() {
    this.getLoanProcessLogs();
  }

  onNext() {
    this.router.navigate([`/pages/loanbooking/${this.leadId}/welomce-letter`]);
  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

  sendLoanCreationWrapper() {
    const body = {
      leadId: this.leadId
    }
    this.loanCreationService.setLoanCreation(body).subscribe((res: any) => {

      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Lead submitted For Loan Creation', '');
      //  this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }

}
