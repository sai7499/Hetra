import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesDedupeService } from '@services/sales-dedupe.service';
import { ApplicantService } from '@services/applicant.service';

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
  applicantId;
  constructor(
    private salesDedupeService: SalesDedupeService,
    private applicantService: ApplicantService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('details', this.salesDedupeService.getDedupeDetails());
    this.dedupeDetails = this.salesDedupeService.getDedupeDetails();
    this.dedupeParameter = this.salesDedupeService.getDedupeParameter();
    this.isExactAvailable = !!this.dedupeDetails.deduIndExctMatch;
    this.isIndividual = this.dedupeDetails.entityType === 'INDIVENTTYP';
    console.log(
      'this.isExactAvailable ',
      this.isExactAvailable,
      'this.isNewApplicant',
      this.isNewApplicant
    );
  }

  rejectLead() {}

  continueAsNewApplicant() {
    this.currentAction = 'new';
    this.modalName = 'newLeadModal';
  }

  continueWithSelectedUCIC() {
    this.currentAction = 'ucic';
    this.modalName = 'ucicModal2';
  }

  onProbableChange(event, value) {
    console.log('probable event', event, 'value', value);
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
    console.log('exact event', event);
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
      custSegment : this.dedupeDetails.custSegment,
      contactPerson : this.dedupeDetails.contactPerson
    };
    this.applicantService
      .checkSalesApplicantDedupe(data)
      .subscribe((value: any) => {
        console.log('callApiForNewApplicant', value);
        const leadId = this.dedupeParameter.leadId;
        if (value.Error === '0') {
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
          if (processVariables.dedupeCustomerNLTR.isNLTRFound) {
            nlTrRemarks = processVariables.dedupeCustomerNLTR.remarks;
          }

          this.negativeModalInput = {
            isNLFound: processVariables.isNLFound,
            isNLTRFound: processVariables.isNLTRFound,
            nlRemarks,
            nlTrRemarks,
          };
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
      custSegment : this.dedupeDetails.custSegment,
      contactPerson : this.dedupeDetails.contactPerson
    };

    this.applicantService
      .checkSalesApplicantUcic(data)
      .subscribe((data: any) => {
        console.log('ucicservice', data);
        if (data.Error === '0') {
          const processVariables = data.ProcessVariables;
          this.checkNegativeList(processVariables.applicantId);
          // this.router.navigateByUrl(
          //   `/pages/lead-section/${leadId}/co-applicant/${processVariables.applicantId}`
          // );
        }
      });
  }

  onCancel() {
    this.modalName = '';
  }

  async negativeListModalListener(event) {
    const leadId = this.dedupeParameter.leadId;
    this.showNegativeListModal = false;
    if (event.remarks) {
      const isProceed = event.name === 'proceed';
      const remarks = event.remarks;
      await this.storeRemarks(isProceed, remarks);
      console.log('remarks stored');
    }

    if (event.name === 'proceed' || event.name === 'next') {
      // if (this.currentAction === 'new') {
      //   // this.callApiForNewApplicant();
      // } else {
      //   this.callApiForSelectedUcic();
      // }
      this.router.navigateByUrl(
        `/pages/lead-section/${leadId}/co-applicant/${this.applicantId}`
      );
    } else if (event.name === 'reject') {
      if (this.dedupeParameter.loanApplicationRelation === 'APPAPPRELLEAD') {
        this.router.navigateByUrl('/pages/dashboard/leads-section/leads');
        return;
      }
      this.router.navigateByUrl(
        `/pages/lead-section/${this.dedupeParameter.leadId}/applicant-details`
      );
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
        console.log('checkNegativeList', value);
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
