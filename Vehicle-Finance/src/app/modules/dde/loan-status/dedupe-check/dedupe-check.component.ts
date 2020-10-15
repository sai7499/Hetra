import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { LoanCreationService } from '@services/loan-creation.service';
import { ToasterService } from '@services/toaster.service';


@Component({
    templateUrl: './dedupe-check.component.html',
    styleUrls: ['./dedupe-check.component.css']
})
export class DedupeCheckComponent implements OnInit {

    dedupeMatch: any[];
    selectedUcic: any;
    applicantId;

    constructor( private location: Location,
                 private loanCreationService: LoanCreationService,
                 private activatedRoute: ActivatedRoute,
                 private toaster: ToasterService) {

    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((value) => {
            const applicantId = value.applicantId;
            if (applicantId) {
                this.applicantId = applicantId;
                this.loanCreationService.getLoanDedupeResult({applicantId})
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

    onBack() {
        this.location.back();
    }

    selectedApplicant(applicant) {
        this.selectedUcic = applicant;
    }

    update() {
        const data = {
            applicantId: this.applicantId,
            ucic: this.selectedUcic.ucic
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
