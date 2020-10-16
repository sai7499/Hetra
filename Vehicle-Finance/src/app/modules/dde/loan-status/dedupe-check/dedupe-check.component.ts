import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { LoanCreationService } from '@services/loan-creation.service';
import { ToasterService } from '@services/toaster.service';
import { DataRowOutlet } from '@angular/cdk/table';


@Component({
    templateUrl: './dedupe-check.component.html',
    styleUrls: ['./dedupe-check.component.css']
})
export class DedupeCheckComponent implements OnInit {

    dedupeMatch: any[];
    selectedUcic: any;
    applicantId;
    leadId;
    constructor( private location: Location,
                 private loanCreationService: LoanCreationService,
                 private activatedRoute: ActivatedRoute,
                 private toaster: ToasterService) {

    }

     async ngOnInit() {
        this.leadId = (await this.getLeadId()); 
        this.activatedRoute.params.subscribe((value) => {
        this.applicantId=value.applicantId;
      if (this.applicantId) {
                const data ={
                    applicantId : this.applicantId,
                    leadId:this.leadId,
                    userId:localStorage.getItem('userId')
            
                }
                     
                this.loanCreationService.getLoanDedupeResult(data)
                    .subscribe((response: any) => {
                        console.log('dedupe result', response);
                        const error = response.Error;
                        if (error !== '0') {
                            return this.toaster.showError(response.ErrorMessage, '');
                        }
                        const processVariables = response.ProcessVariables;
                        this.dedupeMatch = processVariables.deduIndExctMatch || [];
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
        this.location.back();
    }

    selectedApplicant(applicant) {
        this.selectedUcic = applicant;
    }

    update() {
        const data = {
            applicantId: this.applicantId,
            ucic: this.selectedUcic.ucic,
            leadId:this.leadId,
            userId: localStorage.getItem('userId')
        };
        this.loanCreationService.updateLoanDedupe(data)
            .subscribe((value: any) => {
                console.log('update value', value);
                const error = value.Error;
                if (error !== '0') {
                    return this.toaster.showError(value.ErrorMessage, '');
                }
                this.toaster.showSuccess('Updated Successfully', '');
                this.location.back();
            });
    }
}
