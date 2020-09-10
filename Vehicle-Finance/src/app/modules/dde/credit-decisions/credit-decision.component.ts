import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { PersonalDiscussionService } from '@services/personal-discussion.service';
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
    roleId: any;
    roleType: any;
    salesResponse = 'false';
    istermSheet = 'false';
    isPreDone: string;
    constructor(
        private router: Router,
        private location: Location,
        private loginStoreService: LoginStoreService,
        private ddeStoreService: DdeStoreService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.salesResponse = localStorage.getItem('salesResponse');
        this.isPreDone = localStorage.getItem('is_pred_done');
        this.istermSheet = localStorage.getItem('istermSheet');
        const button = document.getElementById('checklist_identity_details');
        // tslint:disable-next-line: triple-equals
        // if (this.salesResponse != 'true') {
        // button.disable();
        // }

        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;
        this.roles = roleAndUserDetails.roles;
        this.roleId = this.roles[0].roleId;
        this.roleName = this.roles[0].name;
        this.roleType = this.roles[0].roleType;
        console.log('this user roleType', this.roleType);
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        console.log(this.locationIndex);
        this.location.onUrlChange((url: string) => {
            this.locationIndex = this.getLocationIndex(url);
            console.log(this.locationIndex);
        });
        this.activatedRoute.params.subscribe((value: any) => {
            console.log('params', value);
            this.leadId = Number(value.leadId);
        });
        // this.activatedRoute.firstChild.params.subscribe((value: any) => {
        //     this.applicantId = value.applicantId;
        //     this.version = value.version;
        //     console.log('applicant ID', value.applicantId);
        //     console.log('version in fi and pd report', this.version);
        // });
        if (this.roleType == '2' && this.salesResponse == 'false') {
            this.router.navigate([`/pages/credit-decisions/${this.leadId}/cam`]);
        } else if (this.roleType == '2' && this.istermSheet == 'true' ) {
            this.router.navigate([`/pages/credit-decisions/${this.leadId}/new-term-sheet`]);
        } else if (this.roleType == '2' && this.salesResponse == 'true') {
            this.router.navigate([`/pages/credit-decisions/${this.leadId}/negotiation`]);
        }
    }
    onNavigate(url: string) {
        this.router.navigate([`/pages/credit-decisions/${this.leadId}/${url}`]);
    }
    getLocationIndex(url: string) {
        // tslint:disable-next-line: triple-equals
        if (this.roleType == '1') {
            if (url.includes('credit-condition')) {
                return 0;
                // tslint:disable-next-line: triple-equals
            } else if (url.includes('term-sheet') && this.roleType == '1') {
                return 1;
                // tslint:disable-next-line: triple-equals
            } else if (url.includes('negotiation') && this.roleType == '1') {
                return 2;
                // tslint:disable-next-line: triple-equals
            } else if (url.includes('disbursement') && this.roleType == '1') {
                return 3;
            } else if (url.includes('sanction-details')) {
                return 4;
            } else if (url.includes('customer-feedback')) {
                return 5;
            }
            // tslint:disable-next-line: triple-equals
            // } else if(this.roleType == '1' && this.istermSheet == 'true') {
            //     if (url.includes('term-sheet') ) {
            //         return 0;
            //     }  else if (url.includes('sanction-details')) {
            //         return 1;
            //     }

        } else if (this.roleType == '2' && this.salesResponse == 'false') {
            if (url.includes('cam')) {
                return 0;
            } else if (url.includes('deviations')) {
                return 1;
            } else if (url.includes('credit-condition')) {
                return 2;
            } else if (url.includes('term-sheet')) {
                return 3;
            } else if (url.includes('sanction-details')) {
                return 4;
            }
            // tslint:disable-next-line: triple-equals
        } else if (this.roleType == '2' && this.salesResponse == 'true') {
            if (url.includes('negotiation')) {
                return 0;
            } else if (url.includes('disbursement')) {
                return 1;
            } else if (url.includes('cam')) {
                return 2;
            } else if (url.includes('deviations')) {
                return 3;
            } else if (url.includes('credit-condition')) {
                return 4;
            } else if (url.includes('term-sheet')) {
                return 5;
            } else if (url.includes('sanction-details')) {
                return 6;
                // tslint:disable-next-line: triple-equals
            } else if (url.includes('check-list') && this.isPreDone == 'true') {
                return 7;
            }
        }

    }
}
