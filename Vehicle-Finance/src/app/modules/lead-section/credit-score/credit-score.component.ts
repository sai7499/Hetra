import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { CreditScoreService } from '@services/credit-score.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { Lead } from '@model/lead.model';
interface CibilData {
  ageOfAsset?: number;
// applicantList: [ApplicantDetails]
customerSegment: string;
eligibleAmount: number;
leadId?: string;
loanAmount: number;
loanTenure: number;
productCategoryCode: string;
productCategoryName?: string;
productId?: string;
totalAmount: number;
}
@Component({
  selector: 'app-credit-score',
  templateUrl: './credit-score.component.html',
  styleUrls: ['./credit-score.component.css'],
})


export class CreditScoreComponent implements OnInit {
  leadId;
  labels: any;
  creditScore: any;
  applicantList: any;
  leadData: any;
  variable: CibilData;
  userId: any;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private labelService: LabelsService,
    private creditService: CreditScoreService,
    private termsService: TermAcceptanceService
  ) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.labelService.getLabelsData().subscribe((res: any) => {
      console.log(res);
      this.labels = res;
    });
    this.leadId = (await this.getLeadId()) as number;

    this.leadData = this.getCreditFromService(this.leadId);
  }
  getCreditFromService(data: any) {
    const body = { leadId: data.toString() };
    console.log(body);
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      this.creditScore = res;
      if (
        this.creditScore &&
        this.creditScore.ProcessVariables.error.code === '0'
      ) {
        this.applicantList = this.creditScore.ProcessVariables.applicantList;
        this.variable = this.creditScore.ProcessVariables;
        console.log(this.creditScore);
      } else {
        this.router.navigate([
          `pages/lead-section/${this.leadId}/vehicle-details`,
        ]);
      }
      return res;
    });
  }
  getLeadId() {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.aRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  navigateUrl() {
    this.router.navigateByUrl(`/pages/terms-condition/${this.leadId}`);
  }
  backToLeads() {
    this.router.navigateByUrl(`/pages/dashboard/leads-section/leads`);
  }
  declineOffer() {
    const body = {
      leadId : this.leadId,
      userId:  this.userId,
      statusType : 'reject'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      console.log(res);
      if ( res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
      }
    });
  }
}
