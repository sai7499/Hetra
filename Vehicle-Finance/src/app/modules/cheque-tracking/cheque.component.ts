import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Location } from '@angular/common';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    templateUrl: './cheque.component.html',
    styleUrls: ['./cheque.component.css']
})
export class ChequeComponent implements OnInit {

    leadId: any;
    locationIndex: number;
  isSales: boolean;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private loginStoreService: LoginStoreService,) {}


    ngOnInit() {
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        this.location.onUrlChange((url: string) => {
        this.locationIndex = this.getLocationIndex(url);
        });
        const roles = this.loginStoreService.getRolesAndUserDetails();
        this.activatedRoute.params.subscribe((value) => {
            console.log('value params', value);
            this.leadId = value.leadId;
            this.isSales = roles.roles[0].roleType === 1;
        });
    }


    navigatePage(url: string) {
        if (!url) {
           return this.router.navigateByUrl(
                `pages/cheque-tracking/${this.leadId}`
              );
        }
        this.router.navigateByUrl(
          `pages/cheque-tracking/${this.leadId}/${url}`
        );
      }
    getLocationIndex(url: string) {
        if (url.includes('welcome-letter')) {
            return 1;
        } else if (url.includes('cheque-tracking')) {
          return 0;
        }
      }
}
