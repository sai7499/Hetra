import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { CreditScoreService } from '@services/credit-score.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { Lead } from '@model/lead.model';
import { CommomLovService } from '@services/commom-lov-service';
import { LeadDetails } from '../services/sourcingLeadDetails.service';
import { ToasterService } from '@services/toaster.service';

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
  ageAfterTenure: number;
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
  loanAmount;
  eligibleAmount;

  rejectData: {
    title: string,
    product: any;
    flowStage: string;

  }

  showModal: boolean;
  isChildLoan: string;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private labelService: LabelsService,
    private creditService: CreditScoreService,
    private termsService: TermAcceptanceService,
    private commonLovService: CommomLovService,
    private createLeadService: LeadDetails,
    private toasterService: ToasterService

  ) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.labelService.getLabelsData().subscribe((res: any) => {
      console.log('ress----.>', res);
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

        let ageOfAssetInMonths = this.variable ? this.variable.ageOfAsset ? 
        Math.floor(Number(this.variable.ageOfAsset) / 12) + ' Years ' + 
        Math.floor(Number(this.variable.ageOfAsset % 12)) + ' Months ' : 0 : 0;

        let ageOfLoanTenureInMonths = this.variable ? this.variable.ageAfterTenure ? 
        Math.floor(Number(this.variable.ageAfterTenure) / 12) + ' Years ' + 
        Math.floor(Number(this.variable.ageAfterTenure % 12)) + ' Months ' : 0 : 0;

        let loanTenorInMonths = this.variable ? this.variable.loanTenure ? 
        Math.floor(Number(this.variable.loanTenure) / 12) + ' Years ' + 
        Math.floor(Number(this.variable.loanTenure % 12)) + ' Months ' : 0 : 0;

        this.variable['ageOfAssetInMonths'] = ageOfAssetInMonths;
        this.variable['ageOfLoanTenureInMonths'] = ageOfLoanTenureInMonths;
        this.variable['loanTenorInMonths'] = loanTenorInMonths;

        this.isChildLoan = this.creditScore.ProcessVariables.isChildLoan;
        this.loanAmount = Number(this.variable.loanAmount).toLocaleString('en-IN');
        this.eligibleAmount = Number(this.variable.eligibleAmount).toLocaleString('en-IN');
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
    this.router.navigateByUrl(`/pages/dashboard`);
  }
  declineOffer() {
    const body = {
      leadId: this.leadId,
      userId: this.userId,
      statusType: 'reject'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      console.log(res);
      if (res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/dashboard`);
      }
    });
  }


  reject() {
    const productId = this.variable.productId || '';
    this.showModal = true;
    this.rejectData = {
      title: 'Select Reject Reason',
      product: productId,
      flowStage: '15'
    }
  }

  onOkay(reasonData) {


    const body = {
      leadId: this.leadId,
      userId: this.userId,
      statusType: 'reject',
      isSoRejected: true,
      reasonCode: reasonData['reason'].reasonCode
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      console.log(res);
      if (res && res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Rejected successfully!', '')
        this.router.navigateByUrl(`/pages/dashboard`);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '')
      }
    });
  }

  onCancel() {
    this.showModal = false;
  }
  onBack() {
    this.router.navigateByUrl(`/pages/lead-section/${this.leadId}`);

  }


}