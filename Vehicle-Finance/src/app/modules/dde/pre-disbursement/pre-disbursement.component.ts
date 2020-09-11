import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { DdeStoreService } from '@services/dde-store.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    templateUrl: './pre-disbursement.component.html',
    styleUrls: ['./pre-disbursement.component.css']
})
export class PreDisbursementComponent implements OnInit {
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
    salesResponse = 'false';
    istermSheet = 'false'
    constructor(
        private router: Router,
        private location: Location,
        private loginStoreService : LoginStoreService,
        private ddeStoreService : DdeStoreService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.salesResponse = localStorage.getItem('salesResponse');
        this.istermSheet = localStorage.getItem('istermSheet');
        const button = document.getElementById('checklist_identity_details');

        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;
        this.roles = roleAndUserDetails.roles;
        this.roleId = this.roles[0].roleId;
        this.roleName = this.roles[0].name;
        this.roleType = this.roles[0].roleType;
        console.log("this user roleType", this.roleType);
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        console.log(this.locationIndex);
        this.location.onUrlChange((url: string) => {
            this.locationIndex = this.getLocationIndex(url);
            console.log(this.locationIndex);
        });
        this.activatedRoute.params.subscribe((value: any) => {
            console.log(this.activatedRoute['_routerState']['snapshot'].url);
            this.leadId = Number(value.leadId);
        });
        localStorage.setItem("isPreDisbursement" , "true")
        // this.activatedRoute.firstChild.params.subscribe((value: any) => {
        //     this.applicantId = value.applicantId;
        //     this.version = value.version;
        //     console.log('applicant ID', value.applicantId);
        //     console.log('version in fi and pd report', this.version);
        // });
    }
    onNavigate(url: string) {
            this.router.navigate([`/pages/pre-disbursement/${this.leadId}/${url}`]);
        }
    getLocationIndex(url: string) {
        if (url.includes('credit-condition')) {
            return 0;
        } else if (url.includes('term-sheet')) {
            return 1;
        } else if (url.includes('sanction-details')) {
            return 2;
        }
    }
}
