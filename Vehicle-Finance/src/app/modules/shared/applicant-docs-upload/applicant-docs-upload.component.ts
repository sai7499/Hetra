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

@Component({
  selector: 'app-applicant-docs-upload',
  templateUrl: './applicant-docs-upload.component.html',
  styleUrls: ['./applicant-docs-upload.component.css'],
})
export class ApplicantDocsUploadComponent implements OnInit {
  @Input() set appId(value) {
    if (!value) {
      return;
    }
    this.applicantId = Number(value.id);
    this.associatedWith = value.associatedWith;
    this.getApplicantDocumentCategory(this.applicantId);
    this.DEFAULT_PROFILE_IMAGE = '';
    this.DEFAULT_SIGNATURE_IMAGE = '';
  }
  associatedWith;
  PROFILE_SIZE = Constant.PROFILE_IMAGE_SIZE;
  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
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
  };
  documentArr: DocumentDetails[] = [];

  documentMaxLength = {
    rule: 15,
  };

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
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({});
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
  }

  getApplicantDocumentCategory(applicantId) {
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
        this.categories.push(category);
      }
    });
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

  setDocumentDetails() {
    this.uploadService
      .getDocumentDetails(this.applicantId)
      .subscribe((value: any) => {
        const docDetails: DocumentDetails[] =
          value.ProcessVariables.documentDetails;
        this.documentArr = docDetails || [];
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
          if (formArray) {
            formArray.push(this.getDocsFormControls(docs));
            if (docs.categoryCode === '50' && docs.subCategoryCode === '1') {
              this.getBase64String(docs.dmsDocumentId).then((value: any) => {
                this.DEFAULT_PROFILE_IMAGE =
                  'data:image/jpeg;base64,' + value.imageUrl;
              });
            }

            if (docs.categoryCode === '50' && docs.subCategoryCode === '2') {
              this.getBase64String(docs.dmsDocumentId).then((value: any) => {
                this.DEFAULT_SIGNATURE_IMAGE =
                  'data:image/jpeg;base64,' + value.imageUrl;
              });
            }
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
    });
    formArray.push(controls);
  }

  onDocumentSelect(event, categoryCode, index) {
    const formArray = this.uploadForm.get(
      `${this.FORM_ARRAY_NAME}_${categoryCode}`
    ) as FormArray;
    formArray.at(index).get('documentNumber').setValue(null);
    this.docListObj[categoryCode] = event;
    console.log('onDocumentSelect', event, categoryCode);
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

    if (!imageType) {
      if (!documentName) {
        return this.toasterService.showError(
          'Please select the document name',
          ''
        );
      }
      if (!documentNumber) {
        return this.toasterService.showError(
          'Please enter the document number',
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
          id: this.leadId,
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
      docsTypeForString: imageType,
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
    if (bas64String) {
      this.setContainerPosition(el);
      this.showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: this.showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    this.setContainerPosition(el);
    this.showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: this.showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(this.applicantId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    });
  }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
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
    if (event.docsTypeForString === 'profile') {
      this.DEFAULT_PROFILE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
      const data = {
        inputValue: event.imageUrl,
        isCreate: true,
        isFingerPrint: false,
        isPhoto: true,
        isSignature: false,
        tableName: 'ind_identification_proof',
        applicantId: this.applicantId,
      };
      // this.uploadPhotoOrSignature(data);
    } else if (event.docsTypeForString === 'signature') {
      this.DEFAULT_SIGNATURE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
      const data = {
        inputValue: event.imageUrl,
        isCreate: true,
        isFingerPrint: false,
        isPhoto: false,
        isSignature: true,
        tableName: 'ind_identification_proof',
        applicantId: this.applicantId,
      };
      // this.uploadPhotoOrSignature(data);
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
    this.documentArr.forEach((value, index) => {
      const formArray = this.uploadForm.get(
        `${this.FORM_ARRAY_NAME}_${value.subCategoryCode}`
      ) as FormArray;
      const rawValue = formArray.getRawValue();
      rawValue.forEach((formValue) => {
        if (formValue.file === value.dmsDocumentId) {
          this.documentArr[index] = {
            ...this.documentArr[index],
            expiryDate:
              this.utilityService.getDateFormat(formValue.expiryDate) || '',
            issueDate:
              this.utilityService.getDateFormat(formValue.issueDate) || '',
            documentNumber: formValue.documentNumber,
          };
        }
      });
    });
    console.log('documentArr', this.documentArr);

    this.uploadService
      .saveOrUpdateDocument(this.documentArr)
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.toasterService.showSuccess('Documents saved successfully', '');
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
