import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '../../services/lead.store.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  toDayDate: Date = new Date();
  leadId: number;
  showModal: boolean;
  labels: any = {};

  uploadForm: FormGroup;
  idProofs = {};
  additionalDocs = {};
  selectedDocsType: string;
  selectedIndex: number;

  constructor(
    private labelsService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location
  ) {}

  ngOnInit() {
    this.uploadForm = new FormGroup({
      idProofs: new FormArray([]),
      additionalDocs: new FormArray([]),
    });
    const idProofs = this.uploadForm.get('idProofs') as FormArray;
    const additionalDocs = this.uploadForm.get('additionalDocs') as FormArray;
    idProofs.push(this.getDocsFormControls());
    additionalDocs.push(this.getDocsFormControls());
    this.getLabelData();
    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      this.leadId = this.leadStoreService.getLeadId();
    });
  }

  getDocsFormControls() {
    const controls = new FormGroup({
      documentName: new FormControl(''),
      documentNumber: new FormControl(''),
      issueDate: new FormControl(''),
      expiryDate: new FormControl(''),
      file: new FormControl(''),
    });
    return controls;
  }

  onBack() {
    this.location.back();
  }

  navigateToApplicantList() {
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
  }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe((labelsData) => {
      this.labels = labelsData;
    });
  }

  removeDocumentFormControls(formArrayName: string, index: number) {
    const formArray = this.uploadForm.get(formArrayName) as FormArray;
    if (formArray.length === 1) {
      return;
    }
    formArray.removeAt(index);
  }

  addDocumentFormControls(formArrayName: string) {
    const formArray = this.uploadForm.get(formArrayName) as FormArray;
    const controls = new FormGroup({
      documentName: new FormControl(''),
      documentNumber: new FormControl(''),
      issueDate: new FormControl(''),
      expiryDate: new FormControl(''),
      file: new FormControl(''),
    });
    formArray.push(controls);
  }

  uploadDocument(type: string, index: number) {
    this.selectedDocsType = type;
    if (index !== undefined) {
      this.selectedIndex = index;
    }
    this.showModal = true;
  }

  onUploadSuccess(event) {
    if (this.selectedDocsType === 'idProofs') {
      this.idProofs[this.selectedIndex] = event;
      this.setFileValueForFormArray();
    } else if (this.selectedDocsType === 'additionalDocs') {
      this.additionalDocs[this.selectedIndex] = event;
      this.setFileValueForFormArray();
    }
    this.showModal = false;
    console.log('onUploadSuccess', this.idProofs);
  }

  setFileValueForFormArray() {
    (this.uploadForm.get(this.selectedDocsType) as FormArray)
      .at(this.selectedIndex)
      .get('file')
      .setValue(event);
  }

  onSubmit() {
    console.log('form value', this.uploadForm.value);
    // this.router.navigateByUrl(
    //   `/pages/lead-section/${this.leadId}/vehicle-details`
    // );
  }
}
