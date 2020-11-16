import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    templateUrl: './cheque.component.html',
    styleUrls: ['./cheque.component.css']
})
export class ChequeComponent implements OnInit {

    leadId: any;
    locationIndex: number;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private location: Location) {}


    ngOnInit() {
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        this.location.onUrlChange((url: string) => {
        this.locationIndex = this.getLocationIndex(url);
        });
        this.activatedRoute.params.subscribe((value) => {
            console.log('value params', value);
            this.leadId = value.leadId;
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
