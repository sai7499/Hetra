import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanCreationService } from '@services/loan-creation.service';
import { ToasterService } from '@services/toaster.service';
import { DataRowOutlet } from '@angular/cdk/table';
import { ApplicantService } from '@services/applicant.service';

@Component({
  templateUrl: './dedupe-check.component.html',
  styleUrls: ['./dedupe-check.component.css'],
})
export class DedupeCheckComponent implements OnInit {
  showModal: boolean;
  dedupeMatch: any[];
  selectedUcic: any;
  applicantId;
  leadId;
  dedupeParameter;
  exactRefNo: any ={};
  constructor(
    private location: Location,
    private loanCreationService: LoanCreationService,
    private activatedRoute: ActivatedRoute,
    private toaster: ToasterService,
    private router:Router,
    private applicantService: ApplicantService,
    private toasterService: ToasterService,
  ) {}

  async ngOnInit() {
    this.leadId = await this.getLeadId();
    this.activatedRoute.params.subscribe((value) => {
      this.applicantId = value.applicantId;
      if (this.applicantId) {
        const data = {
          applicantId: this.applicantId,
          leadId: this.leadId,
          userId: localStorage.getItem('userId'),
        };

        this.loanCreationService
          .getLoanDedupeResult(data)
          .subscribe((response: any) => {
            console.log('dedupe result', response);
            const error = response.Error;
            if (error !== '0') {
              return this.toaster.showError(response.ErrorMessage, '');
            }
            if(response.ProcessVariables.error['code'] !=='0'){
              return this.toaster.showError(response.ProcessVariables.error['message'], '');
            }
            const processVariables = response.ProcessVariables;
            this.dedupeMatch = processVariables.deduIndExctMatch || [];
            this.dedupeParameter = processVariables.matchedCriteria;
          });
      }
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(String(value.leadId));
        }
        resolve(null);
      });
    });
  }

  onBack() {
    this.router.navigate([`/pages/loanbooking/${this.leadId}/loan-booking-status`])
  //  this.location.back();
  }

  selectedApplicant(applicant) {
    this.selectedUcic = applicant;
  }

  update() {
    this.showModal = true;
  }

  callApiForSelectedUcic() {
    const data = {
      applicantId: this.applicantId,
      ucic: this.selectedUcic.ucic,
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
    };
    this.loanCreationService.updateLoanDedupe(data).subscribe((value: any) => {
      const error = value.Error;
      if (error == '0' && value.ProcessVariables.error['code'] == '0') {
        this.toaster.showSuccess('Updated Successfully', '');
        this.router.navigate([`/pages/loanbooking/${this.leadId}/loan-booking-status`])        
      }else{
        this.showModal=false
        return this.toaster.showError(value.ProcessVariables.error['message'], ''); 
      }  
      
     
      //this.location.back();
    });
  }

  onCancel() {
    this.showModal = false;
  }

  getOriginaladhar(data, index){
    
      this.exactRefNo[index] = data.aadhar;

    this.applicantService.retreiveAdhar(data.aadhar).subscribe((res) => {
      if (res['ProcessVariables'].error.code == "0") {
        const uid = res['ProcessVariables'].uid
        this.dedupeMatch[index].aadhar = uid;
        data.isClicked = true;
      }
      else {
        this.toasterService.showError(res['ProcessVariables'].error.message, '')
        data.isClicked = false;
      }
    })

  }

  getRefAdhar(data, index){
    this.dedupeMatch[index].aadhar = this.exactRefNo[index] || data.aadhar;
    data.isClicked = false;
  }
}
