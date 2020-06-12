import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { CreditScoreService } from '@services/credit-score.service';
import { promise } from 'protractor';
import { resolve } from 'url';

@Component({
  selector: 'app-credit-score',
  templateUrl: './credit-score.component.html',
  styleUrls: ['./credit-score.component.css']
})
export class CreditScoreComponent implements OnInit {
leadId;
labels: any;
creditScore: any;
  applicantList: any;
  variable: any;
  constructor(private aRoute: ActivatedRoute,
              private router: Router,
              private labelService: LabelsService,
              private creditService: CreditScoreService) { }

  async ngOnInit() {
    console.log('labels api start');
    this.labelService.getLabelsData().subscribe((res: any) => {
      console.log(res);
      this.labels = res;
    });
    console.log('labels api end');
    this.leadId = (await this.getLeadId()) as number;
    // this.aRoute.parent.params.
    // subscribe((val: any) => {
    //                 this.leadId = Number(val.leadId);
    //                 console.log('leadId', this.leadId); });
    // tslint:disable-next-line: radix
    // this.creditScore = this.creditService.getResponseForCibil();
    // if (this.creditScore) {
    //     this.applicantList = this.creditScore.ProcessVariables.applicantList;
    //     this.variable = this.creditScore.ProcessVariables;
    //     console.log(this.creditScore);
    //   } else {
    //     this.router.navigate([`pages/lead-section/${this.leadId}/vehicle-details`]);
    //   }
    //  });
    this.getCreditFromService(this.leadId);

    console.log('test credit', this.creditScore);
  }
getCreditFromService(data: any) {
    const body = { leadId : data.toString() };  console.log(body);
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      this.creditScore = res;
      if (this.creditScore && this.creditScore.ProcessVariables.error.code === '0') {
        this.applicantList = this.creditScore.ProcessVariables.applicantList;
        this.variable = this.creditScore.ProcessVariables;
        console.log(this.creditScore);
      } else {
        this.router.navigate([`pages/lead-section/${this.leadId}/vehicle-details`]);
      }
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

}
