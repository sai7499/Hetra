import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit, OnDestroy {
  locationIndex: number;
  leadId;
  constructor(private location: Location,
              private aRoute: ActivatedRoute,
              private createLeadDataService: CreateLeadDataService,
              private leadStoreService: LeadStoreService) {
  this.leadId = this.aRoute.snapshot.parent.params['leadId'];

  }
  ngOnInit() {
    if (this.leadId) {
      const gotLeadData = this.aRoute.snapshot.data.leadData;
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
    } else if (url.includes('vehicle-list') || url.includes('add-vehicle')) {
      return 2;
    } else if (url.includes('document-upload')) {
      return 3;
    }
  }

  ngOnDestroy() {
    console.log('sales destroy');
  }
}
