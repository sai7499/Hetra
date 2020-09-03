import { Component } from '@angular/core';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { Router , ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { LabelsService } from '@services/labels.service';

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
    constructor(private bankService: BankTransactionsService,
                private route: Router, private activatedRoute: ActivatedRoute,
                private location: Location,
                private labelsData: LabelsService) { }
    // tslint:disable-next-line: use-lifecycle-interface
   async  ngOnInit() {
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
        this.route.navigate([`pages/applicant-details/${this.leadId}/bank-details/${this.applicantId}`],
         );
    }
    bankDetail() {
            this.route.navigateByUrl(`pages/applicant-details/${this.leadId}/bank-details/${this.applicantId}` );
    }
    onBack() {
      this.location.back();
    }
    onNext() {
      this.route.navigateByUrl(`pages/applicant-details/${this.leadId}/employment-details/${this.applicantId}` );
    }
    loadAppplicant() {
      this.route.navigateByUrl(`pages/dde/${this.leadId}/applicant-list`);
    }
    onDelete() {
    const body = {
     applicantId : this.applicantId,
      userId : this.userId
    };
    this.bankService.deleteBankList(body).subscribe((res: any) => { console.log(res); });
    }

}
