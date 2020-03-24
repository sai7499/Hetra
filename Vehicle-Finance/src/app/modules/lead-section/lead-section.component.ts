<<<<<<< HEAD
import { Component, OnInit } from "@angular/core";
import { VehicleDetailService } from "./services/vehicle-detail.service";
import { Location } from "@angular/common";
import { LabelsService } from 'src/app/services/labels.service';
=======
import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from './services/vehicle-detail.service';
import { LeadStoreService } from '@services/lead-store.service';

import { Location } from '@angular/common';
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c

@Component({
  selector: 'app-lead-section',
  templateUrl: './lead-section.component.html',
  styleUrls: ['./lead-section.component.css']
})
export class LeadSectionComponent implements OnInit {
  applicantName: string;
  applicantMobile: string;
  currentPage = 0;
  public labels :any;

  constructor(
    private leadSectionService: VehicleDetailService,
    private location: Location,
<<<<<<< HEAD
    private labelsData :LabelsService
  ) {}

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data =>{
        this.labels = data
       
      }
    )
=======
    private leadStoreService: LeadStoreService
  ) {}

  ngOnInit() {
    const leadValue = this.leadStoreService.getLeadCreation();
    if (leadValue) {
      this.applicantName = `${leadValue.firstName} ${leadValue.lastName}`;
      this.applicantMobile = leadValue.mobile;
    }
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c
    this.location.onUrlChange((url, state) => {
      if (url.includes('product-details')) {
        this.currentPage = 1;
      } else if (url.includes('vehicle-details')) {
        this.currentPage = 2;
      } else if (url.includes('applicant-details')) {
        this.currentPage = 3;
      } else if (url.includes('loan-details')) {
        this.currentPage = 4;
      } else {
        this.currentPage = 0;
      }
    });

  
  }
  

}
