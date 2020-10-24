import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesDedupeService } from '@services/sales-dedupe.service';
import { ApplicantService } from '@services/applicant.service';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common'
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';

@Component({
  templateUrl: './sales-exact-match.component.html',
  styleUrls: ['./sales-exact-match.component.css'],
})
export class SalesExactMatchComponent implements OnInit {
  currentAction: string;
  showNegativeListModal: boolean;
  negativeModalInput: {
    isNLFound?: boolean;
    isNLTRFound?: boolean;
    nlRemarks?: string;
    nlTrRemarks?: string;
  };
  isNewApplicant: boolean;
  isSelectedUcic = true;
  dedupeDetails;
  dedupeParameter;
  modalName: string;
  selectedApplicant: string;
  selectedDetails;
  isExactAvailable: boolean;
  isIndividual: boolean;
  panValidate: boolean = false;
  applicantId;
  isNavigateToApplicant: boolean = false;
  constructor(
    private salesDedupeService: SalesDedupeService,
    private applicantService: ApplicantService,
    private router: Router,
    private toasterService: ToasterService,
    private location: Location,
    private applicantDataStoreService: ApplicantDataStoreService
  ) { }

  ngOnInit() {
    this.dedupeDetails = this.salesDedupeService.getDedupeDetails();
    this.dedupeParameter = this.salesDedupeService.getDedupeParameter();
    this.isExactAvailable = !!this.dedupeDetails.deduIndExctMatch;
    this.isIndividual = this.dedupeDetails.entityType === 'INDIVENTTYP';
    this.isNavigateToApplicant=this.applicantDataStoreService.getNavigateForDedupe()
    console.log('dedupeDetails', this.dedupeDetails)
  }

  rejectLead() { }

  continueAsNewApplicant() {
    this.currentAction = 'new';
    this.modalName = 'newLeadModal';
    this.applicantDataStoreService.setDetectvalueChange(true)
  }

  continueWithSelectedUCIC() {
    this.currentAction = 'ucic';
    this.modalName = 'ucicModal2';
    this.applicantDataStoreService.setDetectvalueChange(true)
  }

  onProbableChange(event, value) {
    if (this.selectedDetails && value.ucic === this.selectedDetails.ucic) {
      if (!this.isExactAvailable) {
        this.isNewApplicant = false;
      }
      this.isSelectedUcic = true;
      this.selectedDetails = null;
      this.selectedApplicant = null;
      return;
    }
    this.selectedDetails = value;
    this.enableUcicButton();
  }

  onExactChange(event) {
    this.selectedDetails = event;
    this.enableUcicButton();
  }

  enableUcicButton() {
    this.isNewApplicant = true;
    this.isSelectedUcic = false;
  }

  callApiForNewApplicant() {
    const data = {
      ...this.dedupeParameter,
      ignoreProbablematch: true,
      isIndividual: !(this.dedupeDetails.entityType !== 'INDIVENTTYP'),
      loanApplicationRelation: this.dedupeDetails.loanApplicationRelation,
      custSegment: this.dedupeDetails.custSegment,
      contactPerson: this.dedupeDetails.contactPerson
    };
    this.applicantService
      .checkSalesApplicantDedupe(data)
      .subscribe((value: any) => {
        const leadId = this.dedupeParameter.leadId;
        if (value.ProcessVariables.error.code === '0') {
          const processVariables = value.ProcessVariables;
          // this.checkNegativeList(processVariables.applicantId);
          // this.router.navigateByUrl(
          //   `/pages/lead-section/${leadId}/co-applicant/${processVariables.applicantId}`
          // );
          this.applicantId = processVariables.applicantId;
          this.showNegativeListModal = true;
          let nlRemarks = '';
          let nlTrRemarks = '';
          if (processVariables.isNLFound) {
            nlRemarks = processVariables.dedupeCustomerNL.remarks;
          }
          if (processVariables.isNLTRFound) {
            nlTrRemarks = processVariables.dedupeCustomerNLTR.remarks;
          }

          this.negativeModalInput = {
            isNLFound: processVariables.isNLFound,
            isNLTRFound: processVariables.isNLTRFound,
            nlRemarks,
            nlTrRemarks,
          };
        } else {
          this.toasterService.showError(value.ProcessVariables.error.message, '')
        }
      });
  }

  callApiForSelectedUcic() {
    this.currentAction = 'ucic';
    const leadId = this.dedupeParameter.leadId;

    const data = {
      ucic: Number(this.selectedDetails.ucic),
      leadId,
      applicantId: this.dedupeParameter.applicantId,
      loanApplicationRelation: this.dedupeDetails.loanApplicationRelation,
      isIndividual: !(this.dedupeDetails.entityType !== 'INDIVENTTYP'),
      isMobileNumberChanged: this.dedupeDetails.isMobileNumberChanged,
      custSegment: this.dedupeDetails.custSegment,
      contactPerson: this.dedupeDetails.contactPerson,
      monthlyIncomeAmount: this.dedupeDetails.monthlyIncomeAmount || '',
      annualIncomeAmount: this.dedupeDetails.annualIncomeAmount || '',
     ownHouseProofAvail:this.dedupeDetails.ownHouseProofAvail,
      houseOwnerProperty: this.dedupeDetails.houseOwnerProperty || '',
      ownHouseAppRelationship: this.dedupeDetails.ownHouseAppRelationship || '',
      averageBankBalance: this.dedupeDetails.averageBankBalance || '',
      rtrType: this.dedupeDetails.rtrType || '',
      prevLoanAmount: this.dedupeDetails.prevLoanAmount || '',
      loanTenorServiced: this.dedupeDetails.loanTenorServiced
        ? Number(this.dedupeDetails.loanTenorServiced)
        : 0,
      currentEMILoan: this.dedupeDetails.currentEMILoan || '',
      agriNoOfAcres: this.dedupeDetails.agriNoOfAcres
        ? Number(this.dedupeDetails.agriNoOfAcres)
        : 0,
      agriOwnerProperty: this.dedupeDetails.agriOwnerProperty || '',
      agriAppRelationship: this.dedupeDetails.agriAppRelationship || '',
      grossReceipt: this.dedupeDetails.grossReceipt || '',
    };

    this.applicantService
      .checkSalesApplicantUcic(data)
      .subscribe((data: any) => {
        if (data.ProcessVariables.error.code === '0') {
          const processVariables = data.ProcessVariables;
          this.checkNegativeList(processVariables.applicantId);
          // this.router.navigateByUrl(
          //   `/pages/lead-section/${leadId}/co-applicant/${processVariables.applicantId}`
          // );
        } else {
          this.toasterService.showError(data.ProcessVariables.error.message, '');
        }
      });
  }

  getPanValidation() {
    const data = {
      applicantId: this.applicantId
    }
    const leadId = this.dedupeParameter.leadId;
   
    this.applicantService.wrapperPanValidaion(data).subscribe((responce) => {
      if (responce['ProcessVariables'].error.code == '0') {
        this.toasterService.showSuccess(responce['ProcessVariables'].error.message,
          'PAN Validation Successful');
        if(!this.isNavigateToApplicant){
          this.router.navigateByUrl(
            `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
          );
        }else{
          this.router.navigateByUrl(
            `/pages/sales-applicant-details/${leadId}/add-applicant/${this.applicantId}`
          );
        }
        

      } else {
        //this.panValidate = true;
        this.toasterService.showError(
          responce['ProcessVariables'].error.message,
          'PAN Validation Error'
        );
        this.modalName=''
        this.showNegativeListModal = false;

      }
    })
  }

  onCancel() {
    this.modalName = '';
  }

  onBack() {
    this.applicantDataStoreService.setDedupeFlag(true)
    const leadId = this.dedupeParameter.leadId;
    const applicantId= this.dedupeParameter.applicantId
    // this.location.back()
    if(!this.isNavigateToApplicant){
      this.router.navigateByUrl(
        `/pages/lead-section/${leadId}/co-applicant/${applicantId}`
      );
    }else{
      this.router.navigateByUrl(
        `/pages/sales-applicant-details/${leadId}/add-applicant/${applicantId}`
      );
    }
    // this.router.navigateByUrl(
    //   `/pages/lead-section/${leadId}/co-applicant/${applicantId}` 
    // );
  }

  async negativeListModalListener(event) {
    const leadId = this.dedupeParameter.leadId;
    this.showNegativeListModal = false;
    if (event.remarks) {
      const isProceed = event.name === 'proceed';
      const remarks = event.remarks;
      await this.storeRemarks(isProceed, remarks);
    }

    // if (event.name === 'proceed' || event.name === 'next') {
    if (event.name === 'proceed') {
      // if (this.currentAction === 'new') {
      //   // this.callApiForNewApplicant();
      // } else {
      //   this.callApiForSelectedUcic();
      // }
      if(!this.isNavigateToApplicant){
        this.router.navigateByUrl(
          `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
        );
      }else{
        this.router.navigateByUrl(
          `/pages/sales-applicant-details/${leadId}/add-applicant/${this.applicantId}`
        );
      }
      // this.router.navigateByUrl(
      //   `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
      // );
    }
    else if (event.name === 'next' && this.currentAction === 'new') {
      const panType=this.dedupeParameter.panType==='1PANTYPE'
      if(panType){
        this.getPanValidation();
      }else{
        if(!this.isNavigateToApplicant){
          this.router.navigateByUrl(
            `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
          );
        }else{
          this.router.navigateByUrl(
            `/pages/sales-applicant-details/${leadId}/add-applicant/${this.applicantId}`
          );
        }
        // this.router.navigateByUrl(
        //   `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
        // );
      }
      
    } else if (event.name === 'next') {
      if(!this.isNavigateToApplicant){
        this.router.navigateByUrl(
          `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
        );
      }else{
        this.router.navigateByUrl(
          `/pages/sales-applicant-details/${leadId}/add-applicant/${this.applicantId}`
        );
      }
    } else if (event.name === 'reject') {
      if (this.dedupeParameter.loanApplicationRelation === 'APPAPPRELLEAD') {
        this.router.navigateByUrl('/pages/dashboard');
        return;
      }
      if(!this.isNavigateToApplicant){
        this.router.navigateByUrl(
          `/pages/lead-section/${this.dedupeParameter.leadId}/co-applicant`
        );
      }else{
        this.router.navigateByUrl(
          `/pages/sales-applicant-details/${this.dedupeParameter.leadId}/add-applicant`
        );
      }
      // this.router.navigateByUrl(
      //   `/pages/lead-section/${this.dedupeParameter.leadId}/applicant-details`
      // );
    }
  }

  storeRemarks(isProceed: boolean, remarks: string) {
    return new Promise((resolve, reject) => {
      const data = {
        applicantId: this.dedupeParameter.applicantId,
        isProceed,
        remarks,
      };

      this.applicantService
        .applicantNLUpdatingRemarks(data)
        .subscribe((value) => {
          this.showNegativeListModal = false;
          resolve();
        });
    });
  }

  negativeForNewApplicant() {
    const data = {
      applicantId: this.dedupeParameter.applicantId,
      leadId: this.dedupeParameter.leadId,
    };

    this.applicantService
      .applicantNegativeListWrapper(data)
      .subscribe((value) => {
        console.log('applicantNegativeListWrapper', value);
      });
  }

  negativeForUcic() {
    const data1 = {
      applicantId: this.dedupeParameter.applicantId,
      uciciNo: Number(this.selectedDetails.ucic),
    };

    this.applicantService
      .applicantNegativeListWrapper(data1)
      .subscribe((value) => {
        console.log('applicantNegativeListWrapper', value);
      });
  }

  checkNegativeList(applicantId) {
    const data = {
      applicantId: Number(applicantId),
    };
    this.applicantId = Number(applicantId);
    if (this.currentAction === 'new') {
      data['leadId'] = this.dedupeParameter.leadId;
    } else {
      data['uciciNo'] = Number(this.selectedDetails.ucic);
    }
    this.modalName = '';
    this.applicantService
      .applicantNegativeListWrapper(data)
      .subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        this.showNegativeListModal = true;
        let nlRemarks = '';
        let nlTrRemarks = '';
        if (processVariables.isNLFound) {
          nlRemarks = processVariables.dedupeCustomerNL.remarks;
        }
        if (processVariables.dedupeCustomerNLTR.remarks) {
          nlTrRemarks = processVariables.dedupeCustomerNLTR.remarks;
        }
        this.negativeModalInput = {
          isNLFound: processVariables.isNLFound,
          isNLTRFound: processVariables.isNLTRFound,
          nlRemarks,
          nlTrRemarks,
        };
      });
  }
}
