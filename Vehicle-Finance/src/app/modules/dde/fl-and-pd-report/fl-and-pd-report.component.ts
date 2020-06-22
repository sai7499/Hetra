import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';

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
        private personaldiscussion: PersonalDiscussionService) { }

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
            applicantId: 63,
        };

        this.personaldiscussion.getPdData(data).subscribe((value: any) => {
            const processVariables = value.ProcessVariables;
            this.pdDetail = processVariables.personalDiscussionDetail;
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
