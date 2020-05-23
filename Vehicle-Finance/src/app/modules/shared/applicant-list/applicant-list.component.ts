import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { LabelsService } from 'src/app/services/labels.service';

@Component({
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css'],
})
export class ApplicantListComponent implements OnInit {
  labels: any = {};

  applicantUrl: string;

  constructor(private labelsData: LabelsService, private location: Location) {}

  ngOnInit() {
    const currentUrl = this.location.path();

    console.log('currentUrl', currentUrl);

    if (currentUrl.includes('sales')) {
      this.applicantUrl = '/pages/sales-applicant-details';
    } else {
      this.applicantUrl = '/pages/applicant-details/basic-data';
    }

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
