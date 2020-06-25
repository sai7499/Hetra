import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PdDataService } from './pd-data.service';

@Component({
    templateUrl: './fl-and-pd-report.component.html',
    styleUrls: ['./fl-and-pd-report.component.css']
})
export class FlAndPdReportComponent implements OnInit {
    locationIndex = 0;
    pdDetail: any;
    constructor(
        private router: Router,
        private location: Location,
        private personalDiscussion: PersonalDiscussionService,
        private ddeStoreService: DdeStoreService,
        private pdDataService: PdDataService) { }

    ngOnInit() {
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        this.location.onUrlChange((url: string) => {
            this.locationIndex = this.getLocationIndex(url);
        });
        this.getPdDetails();
    }
    getPdDetails() {
        const data = {
            applicantId: 6,
        };

        this.personalDiscussion.getPdData(data).subscribe((value: any) => {
            const processVariables = value.ProcessVariables;
            if (processVariables.error.code === '0') {
                this.pdDetail = value.ProcessVariables;
                console.log('PD Details', this.pdDetail);

                if (this.pdDetail) {
                    this.pdDataService.setCustomerProfile(this.pdDetail.customerProfileDetails)
                }
            }
        });

    }
    getLocationIndex(url: string) {
        if (url.includes('applicant-details')) {
            return 0;
        } else if (url.includes('customer-profile')) {
            return 1;
        } else if (url.includes('loan-details')) {
            return 2;
        }
    }
}
