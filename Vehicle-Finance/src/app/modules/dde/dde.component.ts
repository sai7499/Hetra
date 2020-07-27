import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CommonDataService } from '@services/common-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit {
  locationIndex: number;
  leadId: number;
  show: boolean;
  showNav: boolean = false;

  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService,
    private cds: CommonDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private sharedService: SharedService
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
      this.sharedService.vehicleValuationNext$.subscribe( (val) => {
        if(val === true) {
          this.onNext();
        }
        // this.sharedService.getVehicleValuationNext(false);
      });
      this.sharedService.tvrDetailsPrevious$.subscribe( (val) => {
        if(val === true) {
          this.onPrevious();
        }
      });
    }

    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    if (this.locationIndex >= 8) {
      this.show = false;
    } else {
      this.show = true;
    }

    if (this.router.url.includes('/pd-dashboard')) {
      this.showNav = false;
    } else {
      this.showNav = true;
    }
  }

  onPrevious() {
    this.show = true;
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/vehicle-valuation`);
  }
  onNext() {
    this.show = false;
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/tvr-details`);
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
    } else if (url.includes('vehicle-valuation')) {
      return 7;
    } else if (url.includes('tvr-details')) {
      return 8;
    } else if (url.includes('fi-list')) {
      return 9;
    } else if (url.includes('pd-list')) {
      return 10;
    } else if (url.includes('viability')) {
      return 11;
    } else if (url.includes('viability-dashboard')) {
      return 11;
    } else if (url.includes('cibil-od')) {
      return 12;
    }  else if (url.includes('score-card')) {
      return 13;
    } else if (url.includes('cam')) {
      return 14;
    } else if (url.includes('deviations')) {
      return 15;
    } else if (url.includes('insurance-details')) {
      return 16;
    }
  }
}
