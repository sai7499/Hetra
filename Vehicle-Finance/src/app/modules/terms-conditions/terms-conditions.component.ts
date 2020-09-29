import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { CreditScoreService } from '@services/credit-score.service';
import { ThrowStmt } from '@angular/compiler';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
})
export class TermsConditionsComponent implements OnInit {
  labels: any = {};
  leadId: any;
  userId: any;
  processData: any;
  loanAmount;
  eligibleAmount;

  rejectData: {
    title: string,
    product: any;
    flowStage: string;
   
  }
  showModal:boolean;

  constructor(
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService,
    private router: Router,
    private termsService: TermAcceptanceService,
    private aRoute: ActivatedRoute,
    private creditService: CreditScoreService,
    private toasterService: ToasterService
  ) {}

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.leadId = (await this.getLeadId()) as string;
    this.getCreditFromService(this.leadId);
  }

  // getLeadId() {
  //   const leadSectionData: any = this.createLeadDataService.getLeadSectionData();
  //   return leadSectionData.leadId;
  // }
  getLeadId() {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.aRoute.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  navigateToSales() {
    const body = {
      leadId : this.leadId,
      userId:  this.userId,
      statusType : 'accept'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if ( res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
      }
    });
  }
  declineOffer() {
    const body = {
      leadId : this.leadId,
      userId:  this.userId,
      statusType : 'reject'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if ( res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/dashboard`);
      }
    });
  }
  getCreditFromService(data: any) {
    const body = { leadId: data.toString() };
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      // this.processData = res;
      if (
        res &&
       res.ProcessVariables.error.code === '0'
      ) {
        this.processData = res.ProcessVariables;
        this.loanAmount = Number(this.processData.loanAmount ).toLocaleString('en-IN');
        this.eligibleAmount = Number(this.processData.eligibleAmount ).toLocaleString('en-IN');
      }
      //  else {
      //   this.router.navigate([
      //     `pages/lead-section/${this.leadId}/vehicle-details`,
      //   ]);
      // }
    });
  }

  reject() {

    const productId = this.processData.productId || '';
    this.showModal = true;
    this.rejectData = {
      title: 'Select Reject Reason',
      product:productId,
      flowStage: '30'
    }
    

  }

  onOkay(reasonData) {
    
    const body = {
      leadId : this.leadId,
      userId:  this.userId,
      statusType : 'reject',
      isSoRejected: false,
      reasonCode: reasonData['reason'].reasonCode
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if ( res && res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Rejected successfully!','')
        this.router.navigateByUrl(`/pages/dashboard`);
      }else {
        this.toasterService.showError(res.ProcessVariables.error.message,'')
      }
    });
  }

  onCancel() {
    this.showModal = false;
  }

}
