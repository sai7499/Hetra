import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CommonDataService } from '@services/common-data.service';
declare var jquery:any;
declare var $ :any;

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
    private leadStoreService: LeadStoreService,
    private cds: CommonDataService
  ) {
    $(document).ready(function(){
      $(".second-row").css("display", "none");
      $(".prev-first-data").click(function(){
          $(".first-row").css({"display":"block"});
          $(".second-row").css({"display":"none"});

      });
      $(".next-second-data").click(function(){
          $(".first-row").css({"display":"none"});
          $(".second-row").css({"display":"block"});

      });
    });
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
    }else if (url.includes('vehicle-valuation')) {
      return 7;
    }else if (url.includes('tvr-details')) {
      return 8;
    }else if (url.includes('fl-report')) {
      return 9;
    }else if (url.includes('pd-report')) {
      return 10;
    }else if (url.includes('viability-details')) {
      return 11;
    }else if (url.includes('score-card')) {
      return 12;
    }else if (url.includes('cam')) {
      return 13;
    }else if (url.includes('deviations')) {
        return 14;
    }else if (url.includes('insurance-details')) {
      return 15;
    }else if (url.includes('credit_conditions')) {
      return 16;
    }else if (url.includes('term-sheets')) {
      return 17;
    }
  }
}
