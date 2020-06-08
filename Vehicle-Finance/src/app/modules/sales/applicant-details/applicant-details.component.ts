import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadStoreService } from '../services/lead.store.service';

@Component({
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit, OnDestroy {
  locationIndex: number;
  applicantId = '';
  leadId: number;
  constructor(
    private location: Location,
    private applicantDataStoreservice: ApplicantDataStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService
  ) {}

  ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
    this.activatedRoute.params.subscribe((value: any) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
      if (!this.leadId) {
        const data: any = this.createLeadDataService.getLeadData();
        this.leadId = data.leadId;
      }
      this.leadStoreService.setLeadId(this.leadId);
      console.log(
        ' this.createLeadDataService.getLeadData()',
        this.createLeadDataService.getLeadData()
      );
    });
    this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
    });
  }

  onNavigate(url: string) {
    this.router.navigate([
      `/pages/sales-applicant-details/${this.leadId}/${url}`,
      this.applicantId,
    ]);
  }

  getLocationIndex(url: string) {
    if (url.includes('basic-details')) {
      return 0;
    } else if (url.includes('identity-details')) {
      return 1;
    } else if (url.includes('address-details')) {
      return 2;
    } else if (url.includes('document-upload')) {
      return 3;
    }
  }

  ngOnDestroy() {
    console.log('applicant details destroy');
  }
}
