import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    templateUrl: './applicant-details.component.html',
    styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {
    locationIndex = 0;
    constructor(private router: Router, private location: Location) { }

    ngOnInit() {
        const currentUrl = this.location.path();
        this.locationIndex = this.getLocationIndex(currentUrl);
        this.location.onUrlChange((url: string) => {
            console.log('url', url, 'state');
            this.locationIndex = this.getLocationIndex(url);
        });
    }

    getLocationIndex(url: string) {
        if (url.includes('basic-data')) {
            return 0;
        } else if (url.includes('bank-details')) {
            return 1;
        } else if (url.includes('identity-details')) {
            return 2;
        } else if (url.includes('address-details')) {
            return 3;
        } else if (url.includes('employment-details')) {
            return 4;
        } else if (url.includes('document-upload')) {
            return 5;
        }
    }
}
