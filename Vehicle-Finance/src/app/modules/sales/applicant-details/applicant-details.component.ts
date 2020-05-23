import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit {
  locationIndex: number;
  constructor(private location: Location) {}

  ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      console.log('url', url, 'state');
      this.locationIndex = this.getLocationIndex(url);
    });
  }

  getLocationIndex(url: string) {
    if (url.includes('basic-details')) {
      return 0;
    } else if (url.includes('identity-details')) {
      return 1;
    } else if (url.includes('address-details')) {
      return 2;
    } else if (url.includes('document-upload')) {
      return 3;
    }
  }
}
