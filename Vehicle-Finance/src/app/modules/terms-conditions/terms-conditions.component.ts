import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { CreditScoreService } from '@services/credit-score.service';
import { ThrowStmt } from '@angular/compiler';

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

  constructor(
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService,
    private router: Router,
    private termsService: TermAcceptanceService,
    private aRoute: ActivatedRoute,
    private creditService: CreditScoreService
  ) {}

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );
    this.leadId = (await this.getLeadId()) as string;
    console.log(this.leadId);
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
      console.log(res);
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
      console.log(res);
      if ( res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/dashboard`);
      }
    });
  }
  getCreditFromService(data: any) {
    const body = { leadId: data.toString() };
    console.log(body);
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      // this.processData = res;
      if (
        res &&
       res.ProcessVariables.error.code === '0'
      ) {
        this.processData = res.ProcessVariables;
      }
      //  else {
      //   this.router.navigate([
      //     `pages/lead-section/${this.leadId}/vehicle-details`,
      //   ]);
      // }
    });
  }
}
