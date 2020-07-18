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
  applicantId: string;
  uploadedDocs = {};
  selectedDocsId: {
    formArrayName?: string;
    index?: number;
    docsId?: string;
  };

  documentArr: DocumentDetails[] = [];

  constructor(
    private labelsService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private http: HttpClient,
    private lovService: CommomLovService,
    private applicantDataService: ApplicantDataStoreService,
    private uploadService: UploadService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.uploadForm = new FormGroup({});
    this.getLabelData();
    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      this.leadId = this.leadStoreService.getLeadId();
      this.applicantId = value.applicantId;
      this.getCategoriesDetails();
    });
    console.log('document category', this.lovService.getDocumentCategories());
  }

  getCategoriesDetails() {
    const categories = this.lovService.getDocumentCategories();
    this.categories = categories.find((category) => {
      return category.code === 70;
    });
    this.subCategories = this.categories.subcategories;
    if (this.applicantId) {
      this.constructOnlyFormArray();
      this.setDocumentDetails();
      return;
    }
    this.constructFormForUpload();
  }

  setDocumentDetails() {
    this.uploadService
      .getDocumentDetails(this.applicantId)
      .subscribe((value: any) => {
        console.log('doc details', value);
        const docDetails: DocumentDetails[] =
          value.ProcessVariables.documentDetails;
        this.documentArr = docDetails;
        if (!docDetails) {
          this.subCategories.forEach((subCategory) => {
            const formArray = this.uploadForm.get(
              `${this.FORM_ARRAY_NAME}_${subCategory.code}`
            ) as FormArray;
            formArray.push(this.getDocsFormControls());
          });
          return;
        }
        docDetails.forEach((docs, index) => {
          const formArray = this.uploadForm.get(
            `${this.FORM_ARRAY_NAME}_${docs.subCategoryCode}`
          ) as FormArray;
          formArray.push(this.getDocsFormControls(docs));
        });

        this.setUploadDocsValue(docDetails);

        this.subCategories.forEach((subCategory) => {
          const formArray = this.uploadForm.get(
            `${this.FORM_ARRAY_NAME}_${subCategory.code}`
          ) as FormArray;
          if (formArray.length === 0) {
            formArray.push(this.getDocsFormControls());
          }
        });
      });
  }

  setUploadDocsValue(docDetails: DocumentDetails[]) {
    docDetails.forEach((value) => {
      this.uploadedDocs = {
        [value.subCategoryCode]: {
          [value.documentName]: value,
        },
      };
    });
  }

  constructOnlyFormArray() {
    this.subCategories.forEach((val) => {
      this.uploadForm.addControl(
        `${this.FORM_ARRAY_NAME}_${val.code}`,
        new FormArray([])
      );
    });
  }

  constructFormForUpload() {
    console.log('before this.uploadForm', this.uploadForm.value);
    this.subCategories.forEach((val) => {
      this.uploadForm.addControl(
        `${this.FORM_ARRAY_NAME}_${val.code}`,
        new FormArray([this.getDocsFormControls()])
      );
    });
    console.log('this.uploadForm', this.uploadForm.value);
  }

  getDocsFormControls(data?: DocumentDetails) {
    const document = data || {};
    const controls = new FormGroup({
      documentName: new FormControl(document.documentName || ''),
      documentNumber: new FormControl(document.documentNumber || ''),
      issueDate: new FormControl(
        this.utilityService.getDateFromString(document.issueDate) || ''
      ),
      expiryDate: new FormControl(
        this.utilityService.getDateFromString(document.expiryDate) || ''
      ),
      file: new FormControl(document.dmsDocumentId || ''),
      documentId: new FormControl(document.documentId || 0),
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
    // if (formArray.length === 1) {
    //   return;
    // }

    const formControl = formArray.at(index).get('documentId');
    this.selectedDocsId = formControl
      ? { formArrayName, index, docsId: formControl.value }
      : null;
    console.log('docsId', this.selectedDocsId);
    if (!this.selectedDocsId.docsId) {
      const length = formArray.length;
      formArray.removeAt(index);
      if (length === 1) {
        formArray.push(this.getDocsFormControls());
      }
    }

    // formArray.removeAt(index);
  }

  deleteDocument() {
    this.uploadService
      .softDeleteDocument(this.selectedDocsId.docsId)
      .subscribe((value) => {
        const formArray = this.uploadForm.get(
          this.selectedDocsId.formArrayName
        ) as FormArray;
        formArray.removeAt(this.selectedDocsId.index);
        this.selectedDocsId = null;
        console.log('delete document', value);
      });
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
      documentId: new FormControl(0),
    });
    formArray.push(controls);
  }

  onDocumentSelect(event, categoryCode) {
    this.docListObj[categoryCode] = event;
    console.log('onDocumentSelect', event, categoryCode);
  }

  uploadDocument(type: string, index: number, subCategory: SubCategories) {
    this.selectedDocsType = type;
    const formGroup = (this.uploadForm.get(type) as FormArray).at(index);
    const issueDate = formGroup.get('issueDate').value;
    const expiryDate = formGroup.get('expiryDate').value;
    const documentNumber = formGroup.get('documentNumber').value;
    const documentId = formGroup.get('documentId').value;
    if (index !== undefined) {
      this.selectedIndex = index;
    }
    this.showModal = true;

    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${subCategory.code}`
    ) as FormArray;

    const docId = formArray.at(index).get('documentName').value;

    let docObj = subCategory.docList.find((val) => {
      return val.code === Number(docId);
    });

    docObj = docObj || {};

    this.selectedDocDetails = {
      issueDate,
      expiryDate,
      associatedId: this.applicantId,
      associatedWith: '1',
      documentNumber,
      documentId,
      docTp: 'Lead',
      docSbCtgry: subCategory.displayName,
      docNm: docObj.desc,
      docCtgryCd: this.categories.code,
      docCatg: this.categories.desc,
      docTypCd: docObj.code,
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
  }

  onUploadSuccess(event: DocumentDetails) {
    // this.setFileValueForFormArray(event);
    this.showModal = false;
    console.log('onUploadSuccess', event);
    // if (!this.uploadedDocs[event.subCategoryCode]) {
    //   this.uploadedDocs[event.subCategoryCode] = {
    //     [event.documentType]: event,
    //   };
    //   return;
    // }

    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${event.subCategoryCode}`
    ) as FormArray;
    formArray.at(this.selectedIndex).get('file').setValue(event.dmsDocumentId);
    // this.uploadedDocs[event.subCategoryCode][event.documentType] = event;

    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
    } else {
      const index = this.documentArr.findIndex((value) => {
        return (
          value.subCategoryCode === event.subCategoryCode &&
          value.documentName === event.documentName &&
          value.documentId === event.documentId
        );
      });
      if (index === -1) {
        this.documentArr.push(event);
        return;
      }
      this.documentArr[index] = event;
    }

    console.log('documentArr', this.documentArr);
  }

  setFileValueForFormArray(event) {
    (this.uploadForm.get(this.selectedDocsType) as FormArray)
      .at(this.selectedIndex)
      .get('file')
      .setValue('ID:' + event.docIndx);
  }

  onSubmit() {
    this.documentArr.forEach((value, index) => {
      const formArray = this.uploadForm.get(
        `${this.FORM_ARRAY_NAME}_${value.subCategoryCode}`
      ) as FormArray;
      const rawValue = formArray.getRawValue();
      rawValue.forEach((formValue) => {
        if (formValue.file === value.dmsDocumentId) {
          this.documentArr[index] = {
            ...this.documentArr[index],
            expiryDate: this.utilityService.getDateFormat(formValue.expiryDate),
            issueDate: this.utilityService.getDateFormat(formValue.issueDate),
            documentNumber: formValue.documentNumber,
          };
        }
      });
    });
    console.log('documentArr', this.documentArr);

    this.uploadService
      .saveOrUpdateDocument(this.documentArr)
      .subscribe((value) => {
        console.log('saveOrUpdateDocument', value);
      });
  }
}
