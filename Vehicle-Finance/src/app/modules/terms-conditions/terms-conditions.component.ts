import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { CreateLeadDataService } from '../lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
})
export class TermsConditionsComponent implements OnInit {
  labels: any = {};
  leadId: number;

  constructor(
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );
    this.leadId = this.getLeadId();
  }

  getLeadId() {
    const leadSectionData: any = this.createLeadDataService.getLeadSectionData();
    return leadSectionData.leadId;
  }

  navigateToSales() {
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
  }
}
