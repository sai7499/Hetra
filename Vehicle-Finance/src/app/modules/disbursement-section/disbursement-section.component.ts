import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-disbursement-section',
  templateUrl: './disbursement-section.component.html',
  styleUrls: ['./disbursement-section.component.css']
})
export class DisbursementSectionComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
