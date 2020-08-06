import { Component, OnInit } from '@angular/core';
import { CreditScoreService } from '@services/credit-score.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {
  leadId: any;
  isModelShow = false;
  errorMessage: any;

  constructor(private creditService: CreditScoreService,
              private activatedRoute: ActivatedRoute,
              private route: Router) {}
 async ngOnInit() {
    this.leadId = (await this.getLeadId()) as string;
  }
  onCredit() {
    const body = { leadId : this.leadId.toString() };  console.log(body);
    this.creditService.getCreditScore(body).subscribe((res: any) => {
          console.log(res, ' in vehicle details ');
          // const resObj = res;
          // tslint:disable-next-line: no-bitwise
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            const bodyRes = res;
            this.creditService.setResponseForCibil(bodyRes);
            this.route.navigate([`pages/lead-section/${this.leadId}/credit-score`]);
          } else {
            // alert(res.ProcessVariables.error.message);
            this.errorMessage = res.ProcessVariables.error.message;
            this.isModelShow = true;
          }
    });

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

}
