import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit {
  locationIndex: number;
  leadId: number;
  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService
  ) {
    this.leadId = this.route.snapshot.params['leadId'];
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  ngOnInit() {
    if (this.leadId) {
      const gotLeadData = this.route.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
        this.leadStoreService.setLeadCreation(leadData);
      }
    }
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
