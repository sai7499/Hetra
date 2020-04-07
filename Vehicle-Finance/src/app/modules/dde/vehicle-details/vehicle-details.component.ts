import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  locationIndex = 0;
  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.location.onUrlChange((url: string) => {
      console.log('url', url, 'state');
      this.locationIndex = this.getLocationIndex(url);
    });
  }

  getLocationIndex(url: string) {
    if (url.includes('basic-vehicle-details')) {
      return 0;
    } else if (url.includes('insurance-details')) {
      return 1;
    } else if (url.includes('rto-details')) {
      return 2;
    }
  }

}
