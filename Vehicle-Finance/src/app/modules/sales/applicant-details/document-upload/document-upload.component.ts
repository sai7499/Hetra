import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '../../services/lead.store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';
import {
  Categories,
  SubCategories,
  DocRequest,
  DocumentDetails,
} from '@model/upload-model';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  details;
  applicantId;
  leadId;
  constructor(
    private activatedRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private lovService: CommomLovService,
    private createLeadDataService: CreateLeadDataService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((value) => {
      this.leadId = Number(value.leadId);
      this.leadId = Number(this.leadStoreService.getLeadId());
      this.applicantId = Number(value.applicantId);
      const leadSectionData: any = this.createLeadDataService.getLeadSectionData();
      const applicantList = leadSectionData.applicantDetails;
      const applicant = applicantList.find((val) => {
          return val.applicantId === this.applicantId;
      });
      const apiId = applicant.wizardLeadId || applicant.ucic;
      this.details = {
        id: this.applicantId,
        associatedWith: 2,
        apiId
      };
    });
    console.log('document category', this.lovService.getDocumentCategories());
  }
}
