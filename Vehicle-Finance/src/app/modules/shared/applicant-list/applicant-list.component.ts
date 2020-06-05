import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';
import { LeadStoreService } from '../../sales/services/lead.store.service';

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
  index: number;
  selectedApplicantId: number;
  leadId: number;

  constructor(
    private labelsData: LabelsService,
    private location: Location,
    private applicantService: ApplicantService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const currentUrl = this.location.path();

    this.isShowAddaApplicant(currentUrl);

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );

    // this.activatedRoute.parent.params.subscribe((value) => {
    //   console.log('parent params', value);
    // });

    this.leadId = (await this.getLeadId()) as number;
    if (currentUrl.includes('sales')) {
      this.applicantUrl = `/pages/sales-applicant-details/${this.leadId}/basic-details`;
    } else {
      this.applicantUrl = '/pages/applicant-details/basic-data';
    }
    this.getApplicantList();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantList = processVariables.applicantListForLead;
    });
  }

  isShowAddaApplicant(currentUrl: string) {
    this.showAddApplicant = !currentUrl.includes('dde');
  }
  onApplicantClick(item) {}

  softDeleteApplicant(index: number, applicantId: number) {
    const findIndex = this.p === 1 ? index : (this.p - 1) * 5 + index;
    this.index = findIndex;
    this.selectedApplicantId = applicantId;

    // const data = {
    //   applicantId,
    // };
    // this.applicantService.softDeleteApplicant(data).subscribe((res) => {
    //   console.log('res', applicantId);
    //   this.applicantList.splice(findIndex, 1);
    // });
  }

  callDeleteApplicant() {
    const data = {
      applicantId: this.selectedApplicantId,
    };
    this.applicantService.softDeleteApplicant(data).subscribe((res) => {
      console.log('res', this.selectedApplicantId);
      this.applicantList.splice(this.index, 1);
    });
  }
}
