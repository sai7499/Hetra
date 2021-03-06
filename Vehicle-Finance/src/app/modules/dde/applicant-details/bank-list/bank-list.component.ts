import { Component } from '@angular/core';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabelsService } from '@services/labels.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { ToasterService } from '@services/toaster.service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})

export class BankListComponent {
  bankDetails: any;
  applicantId: number;
  leadId: number;
  userId: string;
  labels: any;
  disableAddbankDetailsBtn: boolean;
  isLoan360: boolean;
  udfScreenId: any;

  deleteBankData: any;

  constructor(private bankService: BankTransactionsService,
              private route: Router, private activatedRoute: ActivatedRoute,
              private location: Location,
              private labelsData: LabelsService,
              private toggleDdeService: ToggleDdeService,
              private toasterService: ToasterService,
              private loanViewService: LoanViewService) { }
  // tslint:disable-next-line: use-lifecycle-interface
  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.userId = localStorage.getItem('userId');
    this.leadId = (await this.getLeadId()) as number;
    this.applicantId = (await this.getApplicantId()) as number;
    this.bankService.getBankList({ applicantId: this.applicantId }).subscribe((res: any) => {
      this.bankDetails = res.ProcessVariables.applicantBankDetails;
    });
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );
    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.disableAddbankDetailsBtn = true;
    }
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.bankListDDE ;

    })
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getApplicantId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        const applicantId = value.applicantId;
        if (applicantId) {
          resolve(Number(applicantId));
        }
        resolve(null);
      });
    });
  }

  routeDetails(data: any) {
    const id = {
      applicantId: this.applicantId,
      formType: 'edit'
    };
    this.bankService.setBankId(data)
    this.route.navigate([`pages/applicant-details/${this.leadId}/bank-details/${this.applicantId}`],
    );
  }

  bankDetail() {
    this.bankService.setBankId(null)
    this.route.navigateByUrl(`pages/applicant-details/${this.leadId}/bank-details/${this.applicantId}`);
  }

  onBack() {
    // this.location.back();
    this.route.navigateByUrl(`pages/applicant-details/${this.leadId}/address-details/${this.applicantId}`);
  }

  onNext() {
    this.route.navigateByUrl(`pages/applicant-details/${this.leadId}/employment-details/${this.applicantId}`);
  }

  loadAppplicant() {
    this.route.navigateByUrl(`pages/dde/${this.leadId}/applicant-list`);
  }

  softDelete(data) {
    this.deleteBankData = data;
  }

  onDelete() {
    const body = {
      applicantId: this.applicantId,
      id: this.deleteBankData.id,
      userId: this.userId
    };

    this.bankService.deleteBankList(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Record deleted successfully', '');
        this.bankService.getBankList({ applicantId: this.applicantId }).subscribe((resVar: any) => {
          this.bankDetails = resVar.ProcessVariables.applicantBankDetails;
        });
      } else {
        this.toasterService.showWarning(res.ProcessVariables.error.message, '');
      }
    });
  }

}
