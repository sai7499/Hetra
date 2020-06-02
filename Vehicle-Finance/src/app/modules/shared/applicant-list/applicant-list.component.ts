import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';

@Component({
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css'],
})
export class ApplicantListComponent implements OnInit {
  labels: any = {};
  showAddApplicant: boolean;
  applicantUrl: string;
  applicantList: ApplicantList[] = [];
  p = 1;

  constructor(
    private labelsData: LabelsService,
    private location: Location,
    private applicantService: ApplicantService
  ) {}

  ngOnInit() {
    const currentUrl = this.location.path();

    console.log('currentUrl', currentUrl);

    this.isShowAddaApplicant(currentUrl);

    if (currentUrl.includes('sales')) {
      this.applicantUrl = '/pages/sales-applicant-details/basic-details';
    } else {
      this.applicantUrl = '/pages/applicant-details/basic-data';
    }

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getApplicantList();
  }

  getApplicantList() {
    const data = {
      leadId: 3,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      console.log('applicant list', value);
      const processVariables = value.ProcessVariables;
      this.applicantList = processVariables.applicantListForLead;
      console.log('applicantList', this.applicantList);
    });
  }

  isShowAddaApplicant(currentUrl: string) {
    this.showAddApplicant = !currentUrl.includes('dde');
  }
  onApplicantClick(item) {
    console.log('item', item);
  }

  softDeleteApplicant(index: number, applicantId: number) {
    console.log('index', index, 'id', applicantId, 'p', this.p);

    const findIndex = this.p === 1 ? index : this.p - 1 + 5 + index;
    console.log('findIndex', findIndex);
  }
}
