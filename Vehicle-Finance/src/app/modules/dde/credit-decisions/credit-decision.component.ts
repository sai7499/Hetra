import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    templateUrl: './credit-decision.component.html',
    styleUrls: ['./credit-decision.component.css']
})
export class CreditDecisionComponent implements OnInit {
    locationIndex = 0;
    pdDetail: any;
    leadId: any;
    applicantId: any;
    version: any;
    userId: any;
    roleName: any;
    roles: any = [];
    constructor(
        private router: Router,
        private location: Location,
        private loginStoreService: LoginStoreService,
        private personalDiscussion: PersonalDiscussionService,
        private ddeStoreService: DdeStoreService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

    }
   
    getLocationIndex(url: string) {
        if (url.includes('applicant-details')) {
            return 0;
        } else if (url.includes('customer-profile')) {
            return 1;
        } else if (url.includes('loan-details')) {
            return 2;
        } else if (url.includes('reference-check')) {
            return 3;
        }
    }
}
