import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit {
  locationIndex: number;
  constructor(public router: Router, private location: Location) {}

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

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
    } else if (url.includes('vehicle-list')) {
      return 2;
    } else if (url.includes('fleet-details')) {
      return 3;
    } else if (url.includes('exposure')) {
      return 4;
    } else if (url.includes('income-details')) {
      return 5;
    } else if (url.includes('psl-data')) {
      return 6;
    }
  }
}
