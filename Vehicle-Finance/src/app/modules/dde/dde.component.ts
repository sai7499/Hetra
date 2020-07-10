import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CommonDataService } from '@services/common-data.service';
declare var jquery: any;
declare var $: any;

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit {
  locationIndex: number;
  leadId: number;
  show: boolean;
  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService,
    private cds: CommonDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {

    // $(document).ready(function () {

    //   $(".second-row").css({ "display": "none" });

    //   $(".prev-first-data").click(function () {
    //     $(".first-row").css({ "display": "block" });
    //     $(".second-row").css({ "display": "none" });

    //   });
    //   $(".next-second-data").click(function () {
    //     $(".first-row").css({ "display": "none" });
    //     $(".second-row").css({ "display": "block" });

    //   });
    // });
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

    if (this.locationIndex >= 8) {
      this.show = false;
      // console.log(this.locationIndex, 'sg')
      // console.log(this.elementRef.nativeElement.classList.contains('second-row'))

      // $(".second-row").css({ "display": "block" });
    } else {
      this.show = true;
    }

    // console.log("in router url", this.router.url)
    // if (this.router.url.includes('/pd-dashboard')) {
    //   console.log(" pd-dashboard ")
    //   this.show = false;
    //   console.log(" pd-dashboard ", this.show)
    // } else {
    //   this.show = true;
    //   console.log(" pd-dashboard ", this.show)
    // }
  }

  onPrevious() {
    this.show = true;
  }
  onNext() {
    this.show = false;
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
    } else if (url.includes('fl-report')) {
      return 9;
    } else if (url.includes('pd-list')) {
      return 10;
    } else if (url.includes('viability')) {
      return 11;
    } else if (url.includes('viability-dashboard')) {
      return 11;
    } else if (url.includes('cibil-od')) {
      return 12;
    } else if (url.includes('cibil-od-list')) {
      return 12;
    } else if (url.includes('score-card')) {
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
