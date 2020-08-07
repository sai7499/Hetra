import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PdDataService } from './pd-data.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    templateUrl: './fi-cum-pd-report.component.html',
    styleUrls: ['./fi-cum-pd-report.component.css']
})
export class FiCumPdReportComponent implements OnInit {
    locationIndex = 0;
    pdDetail: any;
    leadId: any;
    applicantId: any;
    version: any;
    userId: any;
    roleName: any;
    roles: any = [];
    roleId: any;
    roleType: any;
    show: boolean;
    constructor(
        private router: Router,
        private location: Location,
        private loginStoreService: LoginStoreService,
        private personalDiscussion: PersonalDiscussionService,
        private ddeStoreService: DdeStoreService,
        private pdDataService: PdDataService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {


        console.log("in router url", this.router.url)
        if (this.router.url.includes('/pd-dashboard')) {

            console.log(" pd-dashboard ")
            this.show = false;
            console.log(" pd-dashboard ", this.show)


        } else {

            this.show = true;
            console.log(" pd-dashboard ", this.show)
        }

        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;
        this.roles = roleAndUserDetails.roles;
        this.roleId = this.roles[0].roleId;
        this.roleName = this.roles[0].name;
        this.roleType = this.roles[0].roleType;
        console.log("this user roleType", this.roleType)


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
            // applicantId: 6,
            applicantId: this.applicantId
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

        if (this.version) {
            this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/${url}/${this.version}`]);
            // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);

        } else {
            this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/${url}`]);
            // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/${url}/${this.version}`]);
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
