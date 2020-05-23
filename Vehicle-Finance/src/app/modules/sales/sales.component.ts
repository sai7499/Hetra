import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  locationIndex: number;
  constructor(private location: Location) {}
  ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
  }

  getLocationIndex(url: string) {
    if (url.includes('lead-details')) {
      return 0;
    } else if (url.includes('applicant-list')) {
      return 1;
    } else if (url.includes('vehicle-details')) {
      return 2;
    } else if (url.includes('document-upload')) {
      return 3;
    }
  }
}
