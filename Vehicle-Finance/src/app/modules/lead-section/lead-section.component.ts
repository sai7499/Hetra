import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { VehicleDetailService } from '../../services/vehicle-detail.service';
import { LeadStoreService } from '@services/lead-store.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-lead-section',
  templateUrl: './lead-section.component.html',
  styleUrls: ['./lead-section.component.css'],
})
export class LeadSectionComponent implements OnInit {
  applicantName: string;
  applicantMobile: string;
  currentPage: number = 0;
  public labels: any;
  public hideElement: boolean = false;
  public leadId: any;

  constructor(
    public router: Router,
    private leadSectionService: VehicleDetailService,
    private location: Location,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService
  ) {
    this.onHideRoute();
    this.leadId = this.route.snapshot.params['leadId'];
  }

  ngOnInit() {
    if (this.leadId) {
      const gotLeadData = this.route.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
      }
    }

    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });

    const leadValue = this.leadStoreService.getLeadCreation();
    if (leadValue) {
      this.applicantName = `${leadValue.firstName} ${leadValue.lastName}`;
      this.applicantMobile = leadValue.mobile;
    }

    const currentUrl = this.location.path();
    this.currentPage = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.currentPage = this.getLocationIndex(url);
    });
  }

  getLocationIndex(url: string) {

    if (url.includes('applicant-details')) {
      return 1
    } else if (url.includes('vehicle-list') || url.includes('add-vehicle') ) {
      return 2
    } else {
      return 0
    }

  }

  onHideRoute() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes('co-applicant') ||
          event.url.includes('credit-score') ||
          event.url.includes('exact-match') ||
          event.url.includes('otp-section')
        ) {
          console.log('welcome to hide element');
          this.hideElement = true;
          console.log(this.hideElement);
        } else {
          this.hideElement = false;
        }
      }
    });
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
