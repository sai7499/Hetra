import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '@modules/login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { LoanCreationService } from '@services/loan-creation.service';

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
    private activateRoute: ActivatedRoute
  ) {

   }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res.default;
      this.validationData = res.default.validationData;
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

  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

}
