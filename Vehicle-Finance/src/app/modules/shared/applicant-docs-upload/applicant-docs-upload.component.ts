import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {
  Categories,
  SubCategories,
  DocRequest,
  DocumentDetails,
} from '@model/upload-model';
import { CommomLovService } from '@services/commom-lov-service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';
import { Location } from '@angular/common';
import { Base64StorageService } from '@services/base64-storage.service';
import { DraggableContainerService } from '@services/draggable.service';
import { ToasterService } from '@services/toaster.service';
import { Constant } from '@assets/constants/constant';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-applicant-docs-upload',
  templateUrl: './applicant-docs-upload.component.html',
  styleUrls: ['./applicant-docs-upload.component.css'],
})
export class ApplicantDocsUploadComponent implements OnInit {
  apiId;
  @Input() set appId(value) {
    if (!value) {
      return;
    }
    this.applicantId = Number(value.id);
    this.associatedWith = value.associatedWith;
    if (this.associatedWith === 2 ) {
      this.apiId = value.apiId;
      this.getApplicantDetails();
    }
    this.getApplicantDocumentCategory(this.applicantId);
    this.DEFAULT_PROFILE_IMAGE = '';
    this.DEFAULT_SIGNATURE_IMAGE = '';
  }
  @Input() set docSize(value) {
      this.OTHER_DOCUMENTS_SIZE = value;
  }
  associatedWith;
  PROFILE_SIZE = Constant.PROFILE_IMAGE_SIZE;
  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE: number; 
  // = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;
  DEFAULT_PROFILE_IMAGE: string;
  DEFAULT_SIGNATURE_IMAGE: string;
  values: any = [];
  labels: any = {};
  @Input() leadId: number;
  applicantList: { key: number; value: string }[];
  selectedApplicant: number;
  documentCategorySubs$: Subscription;
  applicantCategory = {};
  setCss = {
    top: '',
    left: '',
  };
  toDayDate: Date = new Date();
  showModal: boolean;
  uploadForm: FormGroup;
  selectedDocsType: string;
  selectedDocDetails: DocRequest;
  selectedIndex: number;
  categories: Categories[];
  subCategories: SubCategories[] = [];
  FORM_ARRAY_NAME = 'subCategory';
  docListObj = {};
  applicantId: number;
  uploadedDocs = {};
  selectedDocsId: {
    formArrayName?: string;
    index?: number;
    docsId?: string;
  };

  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
    name: string
  };
  documentArr: DocumentDetails[] = [];
  apiRes: any[];

  isApplicantDetails: boolean;

    // userDefineFields
    udfScreenId = 'RCS002';
    udfDetails: any = [];
    userDefineForm: any;
    udfGroupId: string = 'RCG001';
    jsonScreenId: any;

  currentlySelectedDocs: number;
  documentNumberPattern: string;
  documentMaxLength: number;
  validationData;
  errorMsg: string;
  docsValidation = {};
  selectedCode;
  passport: string;
  drivingLicence: string;
  aadharCard: string;
  voterId: string;
  panCard: string;
  isNewUpload = false;
  docError = {};
  isProfileSignUploaded: boolean;
  isLoan360: boolean;
 
  constructor(
    private lovData: LovDataService,
    private router: Router,
    private labelsData: LabelsService,
    private applicantService: ApplicantService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private lovService: CommomLovService,
    private uploadService: UploadService,
    private utilityService: UtilityService,
    private base64StorageService: Base64StorageService,
    private draggableContainerService: DraggableContainerService,
    private toasterService: ToasterService,
    private loanViewService: LoanViewService
  ) {

  }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.uploadForm = new FormGroup({});
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
        this.setDocumentValidation();
        console.log('valid', this.docsValidation);
      },
      (error) => {
        console.log(error);
      }
    );

    this.labelsData.getScreenId().subscribe((data: any) => {
      this.jsonScreenId = data.ScreenIDS;
      this.udfScreenId = this.jsonScreenId.Common.documentUploadCommon;
    })

    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].applicantDocument[0];
    });

    const url = this.location.path();
    this.isApplicantDetails = url.includes('sales-applicant-details') ? true : false
    console.log(url, 'isApplicantDetails' ,this.isApplicantDetails)

  }

  getApplicantDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const applicant = {
        ...processVariables,
      };
      console.log('applicant', applicant);
      const indivIdentityInfoDetails = applicant.indivIdentityInfoDetails;
      const corporateProspectDetails = applicant.corporateProspectDetails;
      if (indivIdentityInfoDetails) {
        this.passport = indivIdentityInfoDetails.passportNumber;
        this.panCard = indivIdentityInfoDetails.pan;
        this.voterId = indivIdentityInfoDetails.voterIdNumber;
        this.drivingLicence = indivIdentityInfoDetails.drivingLicenseNumber;
        this.aadharCard = indivIdentityInfoDetails.aadhar;
      } else if(corporateProspectDetails) {
        this.passport = corporateProspectDetails.passportNumber;
        this.panCard = corporateProspectDetails.panNumber;
        this.voterId = corporateProspectDetails.voterIdNumber;
        this.drivingLicence = corporateProspectDetails.drivingLicenseNumber;
        this.aadharCard = corporateProspectDetails.aadhar;
      }
    });
  }

  getApplicantDocumentCategory(applicantId) {
    console.log('this.subCategories', this.subCategories);
    this.subCategories.forEach((val) => {
      const formArray = this.uploadForm.get(
        `${this.FORM_ARRAY_NAME}_${val.code}`
      ) as FormArray;
      if (formArray) {
        formArray.clear();
      }
    });
    this.applicantId = applicantId;
    if (this.applicantCategory[applicantId]) {
      this.getSubCategoryForApplicant(this.applicantCategory[applicantId]);
      return;
    }
    const data = {
      applicantId,
      associatedWith: this.associatedWith,
    };
    if (this.documentCategorySubs$) {
      this.documentCategorySubs$.unsubscribe();
    }
    this.documentCategorySubs$ = this.applicantService
      .getDocumentCategory(data)
      .subscribe((value: any) => {
        this.documentCategorySubs$.unsubscribe();
        if (value.Error !== '0') {
          return;
        }
        const processVariables = value.ProcessVariables;
        this.applicantCategory[applicantId] = processVariables.categoryCodes;
        this.getSubCategoryForApplicant(this.applicantCategory[applicantId]);
      });
  }

  getSubCategoryForApplicant(categoryCode) {
    this.getCategoriesDetails(categoryCode);
  }

  getCategoriesDetails(categoryCode: any[]) {
    console.log('categoryCode', categoryCode);
    const categories = this.lovService.getDocumentCategories();
    // this.categories = categories.filter((category) => {
    //   return category.code === 50 || category.code === 70;
    // });

    this.categories = [];
    categoryCode.forEach((code) => {
      if (code) {
        const category = categories.find((category) => {
          return category.code === Number(code);
        });
        if (category) {
            this.categories.push(category);
          }
      }
    });
    console.log('this.categories', this.categories);
    const subCategories = this.categories.map((category) => {
      return category.subcategories;
    });

    let subCategoryList: any = [];
    for (const subCategory of subCategories) {
      subCategoryList = [...subCategoryList, ...subCategory];
    }
    this.subCategories = subCategoryList;
    if (this.applicantId) {
      this.constructOnlyFormArray();
      this.setDocumentDetails();
      return;
    }
    this.constructFormForUpload();
    
  }

  downloadForLoan360(formArrayName: string, index: number, event) {
    if (!this.isLoan360) {
      return;
    }
    this.downloadDocs(formArrayName,index,event);
  }

  setDocumentDetails() {
    this.uploadService
      .getDocumentDetails(this.applicantId, this.associatedWith)
      .subscribe((value: any) => {
        console.log('doc details', value);
        const processVariables = value.ProcessVariables;
        const docDetails: DocumentDetails[] = processVariables.documentDetails;
        this.apiRes = processVariables.documentDetails || [];
        this.documentArr = docDetails || [];
        const photo = processVariables.photo;
        const signature = processVariables.signature;
        if (photo) {
          this.DEFAULT_PROFILE_IMAGE = 'data:image/jpeg;base64,' + photo;
        }

        if (signature) {
          this.DEFAULT_SIGNATURE_IMAGE = 'data:image/jpeg;base64,' + signature;
        }
        console.log('this.documentArr', this.documentArr);
        if (!docDetails) {
          this.subCategories.forEach((subCategory) => {
            const formArray = this.uploadForm.get(
              `${this.FORM_ARRAY_NAME}_${subCategory.code}`
            ) as FormArray;
            formArray.push(this.getDocsFormControls());
          });
          if (this.isLoan360) {
            this.uploadForm.disable();
          }
          return;
        }
        docDetails.forEach((docs, index) => {
          const formArray = this.uploadForm.get(
            `${this.FORM_ARRAY_NAME}_${docs.subCategoryCode}`
          ) as FormArray;
          if (formArray) {
            formArray.push(this.getDocsFormControls(docs));
            // if (docs.categoryCode === '50' && docs.subCategoryCode === '1') {
            //   this.getBase64String(docs.dmsDocumentId).then((value: any) => {
            //      this.DEFAULT_PROFILE_IMAGE =
            //       'data:image/jpeg;base64,' + value.imageUrl;
            //   });
            // }

            // if (docs.categoryCode === '50' && docs.subCategoryCode === '2') {
            //   this.getBase64String(docs.dmsDocumentId).then((value: any) => {
            //      this.DEFAULT_SIGNATURE_IMAGE =
            //       'data:image/jpeg;base64,' + value.imageUrl;
            //   });
            // }
          }
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
        if (this.isLoan360) {
          this.uploadForm.disable();
        }
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

  toggleDeferralDate(categoryCode, index) {
    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${categoryCode}`
    ) as FormArray;
    const formGroup = formArray.at(index);
    console.log('checked value', formGroup.get('isDeferred').value);
    const isChecked = formGroup.get('isDeferred').value;
    if (isChecked) {
      formGroup.get('deferredDate').enable();
    } else {
      formGroup.get('deferredDate').disable();
    }
  }

  getDocsFormControls(data?: DocumentDetails) {
    const document = data || {};
    const isDeferred = document.isDeferred === '1';
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
      isDeferred: new FormControl(isDeferred),
      deferredDate: new FormControl(
        this.utilityService.getDateFromString(document.deferredDate) || ''
      ),
    });
    return controls;
  }

  onBack() {
    this.location.back();
  }

  navigateToApplicantList() {
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
  }

  removeDocumentFormControls(formArrayName: string, index: number) {
    const formArray = this.uploadForm.get(formArrayName) as FormArray;
    // if (formArray.length === 1) {
    //   return;
    // }

    const formControl = formArray.at(index).get('documentId');
    if (formControl.value === 0) {
      formArray.removeAt(index);
      const length = formArray.length;
      formArray.removeAt(index);
      if (length === 0) {
        formArray.push(this.getDocsFormControls());
      }
      return;
    }
    this.selectedDocsId = formControl
      ? { formArrayName, index, docsId: formControl.value }
      : null;
    console.log('docsId', this.selectedDocsId);
    // if (!this.selectedDocsId.docsId) {
    //   const length = formArray.length;
    //   formArray.removeAt(index);
    //   if (length === 1) {
    //     formArray.push(this.getDocsFormControls());
    //   }
    // }

    // formArray.removeAt(index);
  }

  deleteDocument() {
    this.uploadService
      .softDeleteDocument(this.selectedDocsId.docsId)
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }

        this.toasterService.showSuccess('Document deleted successfully', '');

        const formArray = this.uploadForm.get(
          this.selectedDocsId.formArrayName
        ) as FormArray;
        formArray.removeAt(this.selectedDocsId.index);
        const length = formArray.length;
        this.documentArr = this.documentArr.filter(
          (docs) => docs.documentId !== Number(this.selectedDocsId.docsId)
        );
        this.selectedDocsId = null;
        if (length === 0) {
          formArray.push(this.getDocsFormControls());
        }

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
      deferredDate: new FormControl(''),
      isDeferred: new FormControl(''),
    });
    formArray.push(controls);
  }

  onDocumentSelect(event, categoryCode, index) {
    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${categoryCode}`
    ) as FormArray;
    console.log('index', index);
    const documentNumber = formArray.at(index).get('documentNumber');
    documentNumber.setValue(null);
    documentNumber.enable();
    this.docListObj[categoryCode] = event;
    console.log('onDocumentSelect', event, categoryCode);
    const documentCode = event.code;
    if (documentCode === 12 && this.passport) {
      documentNumber.setValue(this.passport);
      documentNumber.disable();
      return;
    }
    if (documentCode === 13 && this.drivingLicence) {
      documentNumber.setValue(this.drivingLicence);
      documentNumber.disable();
      return;
    }
    if (documentCode === 14 && this.aadharCard) {
      documentNumber.setValue(this.aadharCard);
      documentNumber.disable();
      return;
    }
    if (documentCode === 15 && this.voterId) {
      documentNumber.setValue(this.voterId);
      documentNumber.disable();
      return;
    }
    if (documentCode === 16 && this.panCard) {
      documentNumber.setValue(this.panCard);
      documentNumber.disable();
      return;
    }
    const docValue = formArray.at(index).get('documentName').value;
    console.log('docValue', docValue);
    // if (docValue) {
    //   this.setDocumentValidation(Number(docValue));
    // }
    // this.currentlySelectedDocs = categoryCode;
  }

  onDocumentNumberPress(event, index, code) {
    if (code === 12 || code === 13 || code === 15 || code === 16) {
      const value = event.target.value;
      const formArray = this.uploadForm.get(`${this.FORM_ARRAY_NAME}_${code}`) as FormArray;
      console.log('formArray.at[index]', formArray.at(index))
      formArray.at(index).get('documentNumber').setValue(String(value).toUpperCase());
    }
  }

  setDocumentValidation() {
    // this.selectedCode = subCategoryCode;
    // if (subCategoryCode === 12) { // passport
      const passportNumber = this.validationData.passportNumber;
      this.docsValidation[12] = {
        pattern: passportNumber.patternCheck.rule,
        maxLength: passportNumber.maxLength.rule,
        patternMsg: passportNumber.patternCheck.msg
      };
    //   return;
    // }
    // if (subCategoryCode === 13) {
      const drivingLicense = this.validationData.drivingLicense;
      this.docsValidation[13] = {
        pattern: drivingLicense.patternCheck.rule,
        maxLength: drivingLicense.maxLength.rule,
        patternMsg: drivingLicense.patternCheck.msg
      };
    //   return;
    // }
    // if (subCategoryCode === 14) {
      const adhaarNumber = this.validationData.adhaarNumber;
      this.docsValidation[14] = {
        pattern: adhaarNumber.patternCheck.rule,
        maxLength: adhaarNumber.maxLength.rule,
        patternMsg: adhaarNumber.patternCheck.msg
      };
    //   return;
    // }
    // if (subCategoryCode === 15) {
      const voterId = this.validationData.voterId;
      this.docsValidation[15] = {
        pattern: voterId.patternCheck.rule,
        maxLength: voterId.maxLength.rule,
        patternMsg: voterId.patternCheck.msg
      };
    //   return;
    // }
    // if (subCategoryCode === 16) {
      const panNumber = this.validationData.panNumber;
      this.docsValidation[16] = {
        pattern: panNumber.patternCheck.rule,
        maxLength: panNumber.maxLength.rule,
        patternMsg: panNumber.patternCheck.msg
      };
    //   return;
    // }
  }

  // get docsList() {
  //   return this.uploadForm.get(`${this.FORM_ARRAY_NAME}_${this.currentlySelectedDocs}`) as FormArray;
  // }

  docsList(code): any {
    return this.uploadForm.get(`${this.FORM_ARRAY_NAME}_${code}`) as FormArray || {};
  }

  onPanelClick(code) {
    // console.log('docList', this.uploadForm.get(`${this.FORM_ARRAY_NAME}_${code}`));
    // console.log('code', code);
    // setTimeout(() => {
    //   this.currentlySelectedDocs = code;
    // }, 1000);
  }

  uploadDocument(
    type: string,
    index: number,
    subCategory: SubCategories,
    docSize: number,
    docsAllowedType: string,
    imageType: string
  ) {
    let category: Categories;

    this.categories.forEach((val) => {
      val.subcategories.forEach((subCat) => {
        if (subCat.code === subCategory.code) {
          category = val;
        }
      });
    });
    this.selectedDocsType = type;
    const formGroup = (this.uploadForm.get(type) as FormArray).at(index);
    const issueDate = formGroup.get('issueDate').value || '';
    const expiryDate = formGroup.get('expiryDate').value || '';
    const documentNumber = formGroup.get('documentNumber').value;
    const documentId = formGroup.get('documentId').value;
    const documentName = formGroup.get('documentName').value;
    const isDeferred = formGroup.get('isDeferred').value;
    const deferredDate = formGroup.get('deferredDate').value;

    

    if (!imageType) {
      if (!documentName) {
        return this.toasterService.showError(
          'Please select the document name',
          ''
        );
      }
      if (!documentNumber && !isDeferred) {
        return this.toasterService.showError(
          'Please enter the document number',
          ''
        );
      }
      if (formGroup.get('documentNumber').invalid) {
        return this.toasterService.showError('Please enter valid document number', '');
      }
    }

    if (isDeferred) {
      if (!deferredDate) {
        return this.toasterService.showError(
          'Please enter the deferral date',
          ''
        );
      }
    }

    if (index !== undefined) {
      this.selectedIndex = index;
    }
    this.showModal = true;

    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${subCategory.code}`
    ) as FormArray;

    let docId = formArray.at(index).get('documentName').value;

    // set for profile
    let docCmnts = 'Addition of document for Applicant Creation';
    if (
      category.code === 50 &&
      (subCategory.code === 1 || subCategory.code === 2)
    ) {
      docId = subCategory.docList[0].code;
      this.docListObj[subCategory.code] = subCategory.docList[0];
      docCmnts = this.docListObj[subCategory.code].desc;
    }

    let docObj = subCategory.docList.find((val) => {
      return val.code === Number(docId);
    });

    docObj = docObj || {};
    let id;
    if (this.associatedWith === 2) {
      id = this.apiId;
    } else {
      id = this.leadId;
    }

    this.selectedDocDetails = {
      formArrayIndex: index,
      docsType: docsAllowedType,
      docSize,
      issueDate,
      expiryDate,
      associatedId: String(this.applicantId),
      associatedWith: this.associatedWith,
      documentNumber,
      documentId,
      docTp: 'Lead',
      docSbCtgry: subCategory.displayName,
      docNm: docObj.desc,
      docCtgryCd: category.code,
      docCatg: category.desc,
      docTypCd: docObj.code,
      docCmnts,
      docSbCtgryCd: subCategory.code,
      docRefId: [
        {
          idTp: 'LEDID',
          id,
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
      docsTypeForString: imageType,
      deferredDate,
      isDeferred: isDeferred ? '1' : '0',
    };
  }

  getProfileImage() { }

  async downloadDocs(formArrayName: string, index: number, event) {
    
    let el = event.srcElement;
    const formArray = this.uploadForm.get(formArrayName) as FormArray;
    const documentId = formArray.at(index).get('file').value;
    if (!documentId) {
      return;
    }
    const bas64String = this.base64StorageService.getString(
      this.applicantId + documentId
    );
    // if (bas64String) {
    //   this.setContainerPosition(el);
    //   this.showDraggableContainer = {
    //     ...bas64String
    //   };
    //   this.draggableContainerService.setContainerValue({
    //     image: this.showDraggableContainer,
    //     css: this.setCss,
    //   });
    //   return;
    // }
    const imageValue: any = await this.getBase64String(documentId);
    if (imageValue.imageType.includes('xls')) {
      console.log('xls', imageValue.imageUrl);
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/vnd.ms-excel');
      return;
    }
    if (imageValue.imageType.includes('doc')) {
      console.log('xls', imageValue.imageUrl);
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/msword');
      return;
    }
    this.setContainerPosition(el);
    this.showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
      name: imageValue.documentName
    };
    this.draggableContainerService.setContainerValue({
      image: this.showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(this.applicantId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
      name: imageValue.documentName
    });
  }

  getDownloadXlsFile(base64: string, fileName: string, type) {
    const contentType = type;
    const blob1 = this.base64ToBlob(base64, contentType);
    const blobUrl1 = URL.createObjectURL(blob1);
    console.log('blobUrl1', blobUrl1);
    
    setTimeout(() => {

      const a: any = document.createElement('a');
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = blobUrl1;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(blobUrl1);
      // window.open(blobUrl1);
    });
  }

  base64ToBlob(b64Data, contentType, sliceSize?: any) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {

          const dwnldDocumentRep = value['dwnldDocumentRep'];

          if (dwnldDocumentRep.msgHdr.rslt === 'ERROR') {
             this.toasterService.showError(dwnldDocumentRep.msgHdr.error[0].rsn, '')
             return;
          }

          const imageUrl = dwnldDocumentRep.msgBdy.bsPyld;
          const documentName = dwnldDocumentRep.msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
            documentName
          });
          console.log('downloadDocs', value);
        });
    });
  }

  setContainerPosition(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    this.setCss = {
      top: offsetTop + 'px',
      left: offsetLeft + 'px',
    };
  }

  onUploadSuccess(event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');
    this.showModal = false;
    this.isNewUpload = true;
    if (event.docsTypeForString === 'profile') {
      this.DEFAULT_PROFILE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
      const data = {
        inputValue: event.imageUrl,
        isPhoto: true,
        applicantId: this.applicantId,
      };
      this.uploadPhotoOrSignature(data);
    } else if (event.docsTypeForString === 'signature') {
      this.DEFAULT_SIGNATURE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
      const data = {
        inputValue: event.imageUrl,
        isSignature: true,
        applicantId: this.applicantId,
      };
      this.uploadPhotoOrSignature(data);
    }

    event.imageUrl = '';

    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${event.subCategoryCode}`
    ) as FormArray;
    formArray.at(this.selectedIndex).get('file').setValue(event.dmsDocumentId);
    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    } else {
      index = this.documentArr.findIndex((value) => {
        return (
          value.subCategoryCode === event.subCategoryCode &&
          value.documentId === event.documentId
        );
      });
      if (index === -1) {
        this.documentArr.push(event);
        index = this.documentArr.length - 1;
      } else {
        this.documentArr[index] = event;
      }
    }

    console.log('documentArr', this.documentArr);
    this.individualImageUpload(event, index);
  }

  uploadPhotoOrSignature(data) {
    this.isProfileSignUploaded = true;
    this.applicantService.uploadPhotoOrSignature(data).subscribe((value) => {
      console.log('uploadPhotoOrSignature', value, 'data', data);
    });
  }

  checkDate(subCategoryCode, index, controlName) {
    const issueDate = (this.uploadForm.get(
      this.FORM_ARRAY_NAME + '_' + subCategoryCode
    ) as FormArray)
      .at(index)
      .get(controlName);
    return issueDate.value && issueDate.errors;
  }

  individualImageUpload(request: DocumentDetails, index: number) {
    this.uploadService
      .saveOrUpdateDocument([request])
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.toasterService.showSuccess('Document uploaded successfully', '');
        console.log('saveOrUpdateDocument', value);
        const processVariables = value.ProcessVariables;
        const documentId = processVariables.documentIds[0];
        this.documentArr[index].documentId = documentId;
        const subCategoryCode = this.documentArr[index].subCategoryCode;
        const formArray = this.uploadForm.get(
          `${this.FORM_ARRAY_NAME}_${subCategoryCode}`
        ) as FormArray;
        formArray
          .at(this.documentArr[index].formArrayIndex)
          .get('documentId')
          .setValue(documentId);
        console.log('this.documentArr', this.documentArr);
        // documentIds.forEach((id, index) => {
        //   this.documentArr[index].documentId = id;
        // });
        // this.documentArr.forEach((docs, index) => {
        //   const formArrayIndex = docs.formArrayIndex;
        //   if (formArrayIndex !== undefined) {
        //     const formArray = this.uploadForm.get(
        //       `${this.FORM_ARRAY_NAME}_${docs.subCategoryCode}`
        //     ) as FormArray;
        //     formArray
        //       .at(formArrayIndex)
        //       .get('documentId')
        //       .setValue(documentIds[index]);
        //   }
        // });
      });
  }

  setFileValueForFormArray(event) {
    (this.uploadForm.get(this.selectedDocsType) as FormArray)
      .at(this.selectedIndex)
      .get('file')
      .setValue('ID:' + event.docIndx);
  }

  onSubmit() {
    if (this.uploadForm.invalid) {
      return this.toasterService.showError('Please fill mandatory fields', '');
    }
    this.docError = {};
    const formValue = this.uploadForm.getRawValue();
    const requestArr = [];
    let isDocNumberError = false;
    for (const key in formValue) {
      if (formValue[key]) {
        const subCategoryCode = Number(key.split('_')[1]);
        let category: Categories;

        this.categories.forEach((val) => {
          val.subcategories.forEach((subCat) => {
            if (subCat.code === subCategoryCode) {
              category = val;
            }
          });
        });
        const values = formValue[key] || [];
        // for (let i = 0;  i < values.length; i++) {

        // }
        (values).forEach((value, index) => {
          const documentName = value.documentName;
          const deferredDate =
            this.utilityService.getDateFormat(value.deferredDate) || '';
          if (documentName || deferredDate) {
            const documentNumber = value.documentNumber;
            if (!documentNumber && subCategoryCode !== 1 && subCategoryCode !== 2 && subCategoryCode !== 3) {
                isDocNumberError = true;
                this.docError[`${key}_${index}`] = true;
            } else {
              this.docError[`${key}_${index}`] = false;
            }
            requestArr.push({
              deferredDate:
                this.utilityService.getDateFormat(value.deferredDate) || '',
              documentId: value.documentId,
              documentName: value.documentName,
              documentType: value.documentName,
              documentNumber: value.documentNumber || '',
              expiryDate:
                this.utilityService.getDateFormat(value.expiryDate) || '',
              dmsDocumentId: value.file,
              isDeferred: value.isDeferred ? '1' : '0',
              issueDate:
                this.utilityService.getDateFormat(value.issueDate) || '',
              subCategoryCode,
              issuedAt: 'check',
              categoryCode: category.code,
              formArrayIndex: index,
              associatedId: String(this.applicantId),
              associatedWith: String(this.associatedWith),
            });
          }
        });
      }
    }
    this.documentArr = requestArr;
    // }

    // check defer past date
    if (isDocNumberError) {
      return this.toasterService.showError('Please enter valid document number', '');
    }

    const checkAnyPast = this.documentArr.some((docs) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const deferDate = new Date(docs.deferredDate);
      deferDate.setHours(0, 0, 0, 0);
      return docs.isDeferred === '1' && deferDate < now;
    });

    if (checkAnyPast) {
      this.toasterService.showError('Deferral date should be future date', '');
      return;
    }
    const checkDeferralDate = this.documentArr.some((docs) => {
      return docs.isDeferred === '1' && !docs.deferredDate;
    });

    if (checkDeferralDate) {
      return this.toasterService.showError('Please enter deferral date', '');
    }


    if (this.documentArr.length === 0 ) {
      if (this.isProfileSignUploaded) {
        this.isProfileSignUploaded = false;
        return this.toasterService.showSuccess('Documents saved successfully', '');
      }
      this.toasterService.showWarning('No documents uploaded to save', '');
      return;
    }

    const apiValue = {};

    this.apiRes.forEach((value) => {
        apiValue[value.documentId] = {
          documentName:  value.documentName || '',
          documentNumber: value.documentNumber || '',
          issueDate: value.issueDate || '',
          expiryDate: value.expiryDate || '',
          isDeferred: value.isDeferred || '',
          deferredDate: value.deferredDate || ''
        };
    });

    const isValueChange = this.documentArr.some((value) => {
      const doc = apiValue[value.documentId];
      if (!doc) {
        return true;
      }
      return (
        value.documentName !== doc.documentName ||
        value.documentNumber !== doc.documentNumber ||
        value.issueDate !== doc.issueDate ||
        value.expiryDate !== doc.expiryDate ||
        value.isDeferred !== doc.isDeferred ||
        value.deferredDate !== doc.deferredDate
      );
    });


    if (this.isNewUpload) {
      if (!isValueChange && this.isProfileSignUploaded) {
          this.isProfileSignUploaded = false;
          this.isNewUpload = false;
          return this.toasterService.showSuccess('Documents saved successfully', '');
      }
       return this.callAppiyoUploadApi();
    }

    if (!isValueChange) {
      if (this.isProfileSignUploaded) {
        this.isProfileSignUploaded = false;
        return this.toasterService.showSuccess('Documents saved successfully', '');
      }
      return this.toasterService.showWarning('No changes done to save', '');
      
    }
    console.log('documentArr', this.documentArr);
    const docNotAvailable =  this.documentArr.find((doc) => {
      return !doc.dmsDocumentId;
    });
    console.log('docNotAvailable', docNotAvailable);
    if (docNotAvailable) {
      const category = this.categories.find((category) => {
        return category.code === Number(docNotAvailable.categoryCode)
      });
      const subCategory = category.subcategories.find((subCategory) => {
        return subCategory.code === Number(docNotAvailable.subCategoryCode);
      })
      const docList = subCategory.docList;
      const docName = docList.find((value) => {
        return value.code === Number(docNotAvailable.documentType);
      })
      return this.toasterService.showError(`Please upload document for ${docName.displayName}`, '')
    }
    
    
    this.callAppiyoUploadApi();
  }



  callAppiyoUploadApi() {
    this.uploadService
      .saveOrUpdateDocument(this.documentArr)
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.isProfileSignUploaded = false;
        this.toasterService.showSuccess('Documents saved successfully', '');
        this.isNewUpload = false;
        this.apiRes = [...this.documentArr];
        console.log('saveOrUpdateDocument', value);
        const processVariables = value.ProcessVariables;
        const documentIds = processVariables.documentIds;
        documentIds.forEach((id, index) => {
          this.documentArr[index].documentId = id;
        });
        this.documentArr.forEach((docs, index) => {
          const formArrayIndex = docs.formArrayIndex;
          if (formArrayIndex !== undefined) {
            const formArray = this.uploadForm.get(
              `${this.FORM_ARRAY_NAME}_${docs.subCategoryCode}`
            ) as FormArray;
            formArray
              .at(formArrayIndex)
              .get('documentId')
              .setValue(documentIds[index]);
          }
        });
      });
  }

  navigateBack() {
    this.router.navigateByUrl(localStorage.getItem('currentUrl'));
  }
}
