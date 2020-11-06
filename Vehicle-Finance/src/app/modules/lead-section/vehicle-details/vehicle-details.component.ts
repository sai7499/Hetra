import { Component, OnInit } from '@angular/core';
import { CreditScoreService } from '@services/credit-score.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ToasterService } from '@services/toaster.service';
import { CommonDataService } from '@services/common-data.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {
  leadId: any;
  isModelShow = false;
  errorMessage: any;
  isFemaleForNCVFromApp: boolean;
  isFemaleForNCVFromPool: boolean;
  isFemaleForNCV: boolean;


  constructor(private creditService: CreditScoreService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private toasterService: ToasterService,
    private commonDataService: CommonDataService,
    private route: Router) { }
  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as string;
    const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    const product = leadSectioData.leadDetails.productCatCode;
    const applicantDetailsFromPool = leadSectioData.applicantDetails;
    this.commonDataService.applicantDeleted$.subscribe(data => {
      const result = data.bool;
      if (result) {
        this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product,data.app);

      } else {
        this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product, applicantDetailsFromPool);

      }
    })

  }
  onCredit() {
    const body = { leadId: this.leadId };
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      const resObj = res;
      // tslint:disable-next-line: no-bitwise
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        const bodyRes = res;
        this.creditService.setResponseForCibil(bodyRes);

        if (this.isFemaleForNCV) {
          this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
        }

        this.route.navigate([`pages/lead-section/${this.leadId}/credit-score`]);
      } else {
        this.errorMessage = res.ProcessVariables.error ? res.ProcessVariables.error.message : res.ErrorMessage;
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
