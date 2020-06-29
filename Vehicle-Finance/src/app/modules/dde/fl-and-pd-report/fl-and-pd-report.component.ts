import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PdDataService } from './pd-data.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    templateUrl: './fl-and-pd-report.component.html',
    styleUrls: ['./fl-and-pd-report.component.css']
})
export class FlAndPdReportComponent implements OnInit {
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
        private pdDataService: PdDataService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;
        this.roles = roleAndUserDetails.roles;
        this.roleName = this.roles[0].name;
        console.log("this user", this.roleName)


        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        this.location.onUrlChange((url: string) => {
            this.locationIndex = this.getLocationIndex(url);
        });
        this.getPdDetails();
        this.activatedRoute.params.subscribe((value: any) => {
            console.log('params', value);
            this.leadId = Number(value.leadId);
            // if (!this.leadId) {
            //   const data: any = this.createLeadDataService.getLeadData();
            //   this.leadId = data.leadId;
            // }
            // this.leadStoreService.setLeadId(this.leadId);
            // console.log(
            //   ' this.createLeadDataService.getLeadData()',
            //   this.createLeadDataService.getLeadData()
            // );
        });
        this.activatedRoute.firstChild.params.subscribe((value: any) => {
            this.applicantId = value.applicantId;
            this.version = value.version;
            console.log('applicant ID', value.applicantId);
            console.log('version in fi and pd report', this.version);
        });
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
                    this.pdDataService.setCustomerProfile(this.pdDetail.customerProfileDetails);
                }
            }
        });

    }
    onNavigate(url: string) {
        if (this.roleName == "Credit Officer") {
            this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/${url}/${this.applicantId}/${this.version}`]);

            // this.router.navigate([
            //     '/pages/fl-and-pd-report/${this.leadId}/${url}/',this.applicantId,
            // ]);

        } else if (this.roleName == "Sales Officer") {
            // } else if (this.roleName == "Credit Officer") {

            this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/${url}/${this.applicantId}`]);
        }

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
