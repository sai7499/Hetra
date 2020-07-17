import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '../../services/lead.store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { Categories, SubCategories, DocRequest } from '@model/upload-model';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';

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
  selectedDocsType: string;
  selectedDocDetails: DocRequest;
  selectedIndex: number;
  categories: Categories;
  subCategories: SubCategories[];
  FORM_ARRAY_NAME = 'subCategory';
  docListObj = {};

  constructor(
    private labelsService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private http: HttpClient,
    private lovService: CommomLovService,
    private applicantDataService: ApplicantDataStoreService
  ) {}

  ngOnInit() {
    this.uploadForm = new FormGroup({});
    this.getLabelData();
    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      this.leadId = this.leadStoreService.getLeadId();
    });

    console.log('document category', this.lovService.getDocumentCategories());

    const categories = this.lovService.getDocumentCategories();
    this.categories = categories.find((category) => {
      return category.code === 70;
    });
    this.subCategories = this.categories.subcategories;
    this.constructFormForUpload();
    console.log('subCategories', this.subCategories);

    console.log('applicant data', this.applicantDataService.getApplicant());

    // this.lovService.getLovData().subscribe((value) => {
    //   console.log('lov value', value);
    // });

    // this.http
    //   .get('assets/jsonData/document-master.json')
    //   .subscribe((value: any) => {
    //     console.log('document', value);
    //     const categories: Categories[] = value.categories;
    //     this.categories = categories.find((category) => {
    //       return category.code === 70;
    //     });
    //     this.subCategories = this.categories.subcategories;
    //     this.constructFormForUpload();
    //     console.log('subCategories', this.subCategories);
    //   });
  }

  constructFormForUpload() {
    this.subCategories.forEach((val) => {
      this.uploadForm.addControl(
        `${this.FORM_ARRAY_NAME}_${val.code}`,
        new FormArray([this.getDocsFormControls()])
      );
    });
    console.log('this.uploadForm', this.uploadForm.value);
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

  addDocumentFormControls(code: string) {
    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${code}`
    ) as FormArray;
    const controls = new FormGroup({
      documentName: new FormControl(''),
      documentNumber: new FormControl(''),
      issueDate: new FormControl(''),
      expiryDate: new FormControl(''),
      file: new FormControl(''),
    });
    formArray.push(controls);
  }

  onDocumentSelect(event, categoryCode) {
    this.docListObj[categoryCode] = event;
    console.log('onDocumentSelect', event, categoryCode);
  }

  uploadDocument(type: string, index: number, subCategory: SubCategories) {
    this.selectedDocsType = type;
    const docTypeCategoryId = (this.uploadForm.get(type) as FormArray)
      .at(index)
      .get('documentName').value;
    if (index !== undefined) {
      this.selectedIndex = index;
    }
    this.showModal = true;

    this.selectedDocDetails = {
      docTp: 'Lead',
      docSbCtgry: subCategory.displayName,
      docNm: this.docListObj[subCategory.code].desc,
      docCtgryCd: this.categories.code,
      docCatg: this.categories.desc,
      docTypCd: this.docListObj[subCategory.code].code,
      docCmnts: 'Addition of document for Applicant Creation',
      docSbCtgryCd: subCategory.code,
      docRefId: [
        {
          idTp: 'LEDID',
          id: 20059563,
        },
        {
          idTp: 'BRNCH',
          id: 1001,
        },
      ],
    };

    console.log('selectedDocDetails', this.selectedDocDetails);
  }

  onUploadSuccess(event) {
    // if (this.selectedDocsType === 'idProofs') {
    //   this.idProofs[this.selectedIndex] = event;
    //   this.setFileValueForFormArray();
    // } else if (this.selectedDocsType === 'additionalDocs') {
    //   this.additionalDocs[this.selectedIndex] = event;
    //   this.setFileValueForFormArray();
    // }
    this.setFileValueForFormArray(event);
    this.showModal = false;
    // console.log('onUploadSuccess', this.idProofs);
  }

  setFileValueForFormArray(event) {
    (this.uploadForm.get(this.selectedDocsType) as FormArray)
      .at(this.selectedIndex)
      .get('file')
      .setValue('ID:' + event.docIndx);
  }

  onSubmit() {
    console.log('form value', this.uploadForm.value);
    // this.router.navigateByUrl(
    //   `/pages/lead-section/${this.leadId}/vehicle-details`
    // );
  }
}
