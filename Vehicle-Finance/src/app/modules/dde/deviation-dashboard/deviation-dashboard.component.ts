import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-deviation-dashboard',
    templateUrl: './deviation-dashboard.component.html',
    styleUrls: ['./deviation-dashboard.component.css']
})
export class DeviationDashboardComponent implements OnInit {

    locationIndex = 0;
    constructor(private location: Location) { }
  
    ngOnInit() {
      const currentUrl = this.location.path();
      this.locationIndex = this.getLocationIndex(currentUrl);
      this.location.onUrlChange((url: string) => {
        this.locationIndex = this.getLocationIndex(url);
      });
    }
  
    getLocationIndex(url: string) {
      if (url.includes('dashboard-deviation-details')) {
        return 0;
      } else if (url.includes('case-summary')) {
        return 1;
      }
    }

}