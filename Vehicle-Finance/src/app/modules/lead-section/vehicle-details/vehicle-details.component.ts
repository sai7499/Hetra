import { Component, OnInit } from '@angular/core';
import { CreditScoreService } from '@services/credit-score.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ToasterService } from '@services/toaster.service';
import { CommonDataService } from '@services/common-data.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';

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
  showEligibilityScreen: boolean;
  eligibleModal: boolean;
  userId : any;
  applicantList: any=[]
  showNotCoApplicant: boolean;


  constructor(private creditService: CreditScoreService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private toasterService: ToasterService,
    private commonDataService: CommonDataService,
    private termsService: TermAcceptanceService,
    private route: Router) { }
  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.leadId = (await this.getLeadId()) as string;
    
    this.applicantList= this.applicantDataStoreService.getApplicantList();
    // const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    // const product = leadSectioData.leadDetails.productCatCode;
    // const applicantDetailsFromPool = leadSectioData.applicantDetails;
    // this.commonDataService.applicantDeleted$.subscribe(data => {
    //   const result = data.bool;
    //   if (result) {
    //     this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product,data.app);

    //   } else {
    //     this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product, applicantDetailsFromPool);

    //   }
    // })

  }
  forFindingCoApplicantType() {
    if (this.applicantList) {
      const findCoApplicant = this.applicantList.find((data) => data.applicantTypeKey == "COAPPAPPRELLEAD")
      console.log('findApplicant', findCoApplicant)
      this.showNotCoApplicant = findCoApplicant == undefined ? true : false;
    } else {
      this.showNotCoApplicant = true;
    }

  }

  onCredit() {
    const body = { leadId: this.leadId };
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      const resObj = res;
      // tslint:disable-next-line: no-bitwise
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        const bodyRes = res;
        this.creditService.setResponseForCibil(bodyRes);
      
        const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
        const product = leadSectioData.leadDetails.productCatCode;
        if (product === 'NCV' || product === 'UCV' || product === 'UC') {
          this.showNotCoApplicant= this.applicantDataStoreService.findCoApplicant(this.applicantList)
          if (!this.showNotCoApplicant) {
             this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
          }
        }
    
       if(product==="NCV"){
         const result= this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
        if (!result) {
          this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
        }
       }
        
        this.showEligibilityScreen = res.ProcessVariables.showEligibilityScreen;
        if (!this.showEligibilityScreen) {
          this.eligibleModal = true;
          return;
       }

        this.route.navigate([`pages/lead-section/${this.leadId}/credit-score`]);
      } else {
        this.errorMessage = res.ProcessVariables.error ? res.ProcessVariables.error.message : res.ErrorMessage;
        this.isModelShow = true;
      }
    });

  }

  navigateToSales(){
    const body = {
      leadId : this.leadId,
      userId:  this.userId,
      statusType : 'accept'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if ( res && res.ProcessVariables.error.code === '0') {
        this.route.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
      }
    });
  }

  onEligibleModalClose() {
    this.eligibleModal = false;
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
