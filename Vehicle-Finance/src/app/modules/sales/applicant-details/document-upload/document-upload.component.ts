import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '../../services/lead.store.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  isHeight1: boolean = true;
  isHeight2: boolean;
  isHeight3: boolean;
  isHeight4: boolean;
  leadId: number;

  labels: any = {};

  constructor(
    private labelsService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location
  ) {}

  onBack() {
    this.location.back();
  }

  navigateToApplicantList() {
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
  }

  ngOnInit() {
    this.getLabelData();
    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      this.leadId = this.leadStoreService.getLeadId();
    });
  }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe((labelsData) => {
      this.labels = labelsData;
    });
  }

  showHide(e) {
    const value = e;
    this.isHeight1 = value === 'photo';
    this.isHeight2 = value === 'signature';
    this.isHeight3 = value === 'ID Proof';
    this.isHeight4 = value === 'Additional Document';
  }

  onSubmit() {
    this.router.navigateByUrl(
      `/pages/lead-section/${this.leadId}/vehicle-details`
    );
  }
}
