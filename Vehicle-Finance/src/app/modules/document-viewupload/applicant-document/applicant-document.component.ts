import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantList } from '@model/applicant.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-applicant-document',
  templateUrl: './applicant-document.component.html',
  styleUrls: ['./applicant-document.component.css'],
})
export class ApplicantDocumentComponent implements OnInit {
  values: any = [];
  labels: any = {};
  leadId: number;
  applicantList: { key: number; value: string }[];
  applicantId;
  selectedApplicant: {
    id: number;
    associatedWith;
  };

  constructor(
    private lovData: LovDataService,
    private labelsData: LabelsService,
    private applicantService: ApplicantService,
    private activateRoute: ActivatedRoute,
    private leadService: CreateLeadDataService
  ) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].applicantDocument[0];
    });

    this.activateRoute.parent.params.subscribe((value) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
      // this.getApplicantList();
    });
    console.log('lead data applicant', this.leadService.getLeadSectionData());
    const leadSectionData: any = this.leadService.getLeadSectionData();
    const applicantList = leadSectionData.applicantDetails;
    this.getApplicantList(applicantList);

  }

  getApplicantList(applicantList: ApplicantList[]) {
    this.applicantList = applicantList.map((val) => {
      return {
        key: val.applicantId,
        value: val.fullName,
      };
    });
    if (this.applicantList.length === 0) {
      return;
    }
    console.log('applicantList', this.applicantList);
    this.applicantId = Number(this.applicantList[0].key);
    this.selectedApplicant = {
      id: this.applicantId,
      associatedWith: 2,
    };
    // const data = {
    //   leadId: this.leadId,
    // };

    // this.applicantService
    //   .getApplicantList(data)
    //   .pipe(
    //     map((value: any) => {
    //       if (value.Error !== '0') {
    //         return null;
    //       }
    //       const processVariables = value.ProcessVariables;
    //       const applicantList: ApplicantList[] =
    //         processVariables.applicantListForLead || [];
    //       return applicantList.map((val) => {
    //         return {
    //           key: val.applicantId,
    //           value: val.fullName,
    //         };
    //       });
    //     })
    //   )
    //   .subscribe((value: any) => {
    //     this.applicantList = value;
    //     if (this.applicantList.length === 0) {
    //       return;
    //     }
    //     console.log('applicantList', this.applicantList);
    //     this.applicantId = Number(this.applicantList[0].key);
    //     this.selectedApplicant = {
    //       id: this.applicantId,
    //       associatedWith: 2,
    //     };
    //   });
  }

  onApplicantChange(value) {
    this.selectedApplicant = {id:value.key, associatedWith: 2}
  }
}
