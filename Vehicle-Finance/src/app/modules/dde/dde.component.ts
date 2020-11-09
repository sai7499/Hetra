import { Component, OnInit, Renderer2, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CommonDataService } from '@services/common-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit, OnChanges {
  locationIndex: number;
  leadId: number;
  show: boolean;
  showNav: boolean = false;
  fiCumPdStatusString: any;
  fiCumPdStatus: boolean;
  productCatCode: string;

  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService,
    private cds: CommonDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService
  ) {
    this.leadId = this.route.snapshot.params['leadId'];
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  ngOnInit() {
    this.fiCumPdStatusString = localStorage.getItem('isFiCumPd');
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false;
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true;
    }

    console.log('ficumpd status', this.fiCumPdStatus);

    if (this.leadId) {
      const gotLeadData = this.route.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        // console.log("LEAD_SECTION_DATA::", leadData);
        this.productCatCode = leadData.leadDetails.productCatCode;
        console.log("ProductCODE::", this.productCatCode);
        this.createLeadDataService.setLeadSectionData(leadData);
        this.leadStoreService.setLeadCreation(leadData);
      }
      this.sharedService.pslDataNext$.subscribe((val) => {
        if(val === true) {
          // this.onNext();
          this.show = false;
          // this.location.onUrlChange((url: string) => {
          //   this.locationIndex = this.getLocationIndex(url);
          // });
        } else {
          this.show = true;
        }
      });
      // this.sharedService.vehicleValuationNext$.subscribe((val) => {
      //   if (val === true) {
      //     this.onNext();
      //   }
      // });
      // this.sharedService.tvrDetailsPrevious$.subscribe((val) => {
      //   if (val === true) {
      //     this.onPrevious();
      //   }
      // });
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

    if (
      this.router.url.includes('/fi-cum-pd-dashboard') ||
      this.router.url.includes('/fi-dashboard') ||
      this.router.url.includes('/cheque-tracking') ||
      this.router.url.includes('/pdd-details') ||
      this.router.url.includes('/loan-status')
    ) {
      this.showNav = false;
    } else {
      this.showNav = true;
    }
  }

  ngOnChanges() {
    console.log('on change');
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
  }



  onPrevious() {
    this.show = true;
    if(this.productCatCode != 'NCV') {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/vehicle-valuation`);
    } else if(this.productCatCode == 'NCV') {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/psl-data`);
    }
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
    } else if (url.includes('reference')) {
      return 3;
    } else if (url.includes('fleet-details')) {
      return 4;
    } else if (url.includes('exposure')) {
      return 5;
    } else if (url.includes('income-details')) {
      return 6;
    } else if (url.includes('psl-data')) {
      return 7;
    } else if (url.includes('vehicle-valuation')) {
      return 8;
    } else if (url.includes('tvr-details')) {
      return 9;
    }else if (url.includes('rcu')) {
      return 10;
    }else if (url.includes('fi-list')) {
      return 11;
    } else if (url.includes('pd-list')) {
      return 12;
    } else if (url.includes('viability')) {
      return 13;
    } else if (url.includes('viability-dashboard')) {
      return 13;
    } else if (url.includes('cibil-od')) {
      return 14;
    } else if (url.includes('score-card')) {
      return 15;
    } else if (url.includes('cam')) {
      return 16;
    } else if (url.includes('deviations')) {
      return 17;
    } else if (url.includes('insurance-details')) {
      return 17;
    }
  }
}
