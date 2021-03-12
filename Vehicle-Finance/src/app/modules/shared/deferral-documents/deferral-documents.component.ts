import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from "@services/labels.service";
import { UtilityService } from '@services/utility.service';
import { DeferralDocService } from '@services/deferral-doc.service';
import { UploadService } from '@services/upload.service';
import { Constant } from '@assets/constants/constant';
import { ToasterService } from '@services/toaster.service';
import { DraggableContainerService } from '@services/draggable.service';

@Component({
  selector: 'app-deferral-documents',
  templateUrl: './deferral-documents.component.html',
  styleUrls: ['./deferral-documents.component.css']
})
export class DeferralDocumentsComponent implements OnInit {
  deferralForm: FormGroup;
  toDayDate: Date = new Date();
  isLoan360: boolean = false;

  rcvdOn: Date;
  documentArray: any = [];
  selectedDocDetails: {
    docSize: number;
    formArrayIndex: any; docsType: any;
    docNm: any; docCtgryCd: any;
    docTp: string; docSbCtgry: any;
    docCatg: any; docCmnts: string;
    docTypCd: any; docSbCtgryCd: any;
    docRefId: { idTp: string; id: any; }[];
  };
  showModal: boolean;
  leadId: any;
  labels: any;
  validationData: any;
  documentDetails: any = [];
  docName: any = [];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private labelsData: LabelsService,
    private router: Router,
    private utilityService: UtilityService,
    private deferralDocService: DeferralDocService,
    private uploadService: UploadService,
    private toasterService: ToasterService,
    private draggableContainerService: DraggableContainerService,
  ) {
    var date = this.toDayDate.getDate()
    var month = this.toDayDate.getMonth()
    var year = this.toDayDate.getFullYear()
    var hour = this.toDayDate.getHours()
    var minute = this.toDayDate.getMinutes()
    this.rcvdOn = new Date(year, month, date, hour, minute)
  }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as Number;
    this.getLabels();
    this.initForm();
    this.getDocumentDetails();
  }

  getLeadId() {
    return new Promise((resolve) => {
      this.activatedRoute.params.subscribe((value) => {
        if (!value.leadId) {
          resolve(null)
        }
        resolve(Number(value.leadId))
      })
    })
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  initForm() {
    this.deferralForm = new FormGroup({
      defDocumentArray: new FormArray([])
    })

  }

  getDocumentDetails() {
    this.deferralDocService.getDeferralDocs({ leadId: this.leadId }).subscribe((res) => {
      const processvariable = res['ProcessVariables'];
      if (processvariable.error.code == '0') {
        console.log('processvariable', processvariable)
        this.documentDetails = processvariable.documentDetails || [];
        this.documentDetails.map((data) => {
          const docNames = {
            key: data.documentType,
            value: data.documentTypeValue
          }
          this.docName.push(docNames)
        })
        setTimeout(() => {
          this.initRows(this.documentDetails)
        })

      } else {
        this.toasterService.showError(processvariable.error.message, '')
      }
    })
  }

  initRows(data) {
    if (!data) {
      return;
    }
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    data.forEach((value) => {
      const formGroup = new FormGroup({
        documentType: new FormControl(value.documentType || ''),
        deferredDate: new FormControl(this.utilityService.getDateFromString(value.deferredDate) || ''),
        receivedBy: new FormControl(value.receivedBy || ''),
        receivedOn: new FormControl({ value: this.utilityService.getDateFromString(value.receivedOn) || this.rcvdOn, disabled: true }),

        associatedId: new FormControl(value.associatedId || ''),
        associatedWith: new FormControl(value.associatedWith || ''),

        categoryCode: new FormControl(value.categoryCode || ''),
        categoryCodeValue: new FormControl(value.categoryCode || ''),

        dmsDocumentId: new FormControl(value.dmsDocumentId || ''),
        documentId: new FormControl(value.documentId || ''),
        documentName: new FormControl(value.documentName || ''),
        documentNumber: new FormControl(value.documentNumber || ''),
        subCategoryCode: new FormControl(value.subCategoryCode || ''),



      });
      formArray.push(formGroup);
    });

    // this.documentArray = data;
  }

  uploadDocs(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const docTypKey = formArray['controls'][index].get('documentType').value;
    const docTyp = this.docName.find((data) => {
      return data.key === docTypKey
    })
    console.log('docTyp', docTyp)
    const docNm = docTyp.value;
    const docCtgryCd = formArray['controls'][index].get('categoryCode').value;
    const docTp = 'LEAD';
    const docSbCtgry = docTyp.value;
    const docCatg = formArray['controls'][index].get('categoryCodeValue').value;
    const docCmnts = 'Addition of document for Lead Creation';
    const docTypCd = docTyp.key;
    const docSbCtgryCd = formArray['controls'][index].get('subCategoryCode').value;

    this.showModal = true;
    this.selectedDocDetails = {
      docSize: 2097152,
      formArrayIndex: index,
      docsType: Constant.OTHER_DOCUMENTS_ALLOWED_TYPES,
      docNm,
      docCtgryCd,
      docTp,
      docSbCtgry,
      docCatg,
      docCmnts,
      docTypCd,
      docSbCtgryCd,
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
    };
  }


  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    console.log('onUploadSuccess', event);
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    formArray['controls'][event.formArrayIndex].get('dmsDocumentId').setValue(event.dmsDocumentId);
  }

  documentArr(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const value = formArray['controls'][index].get('dmsDocumentId').value;
    return value;
  }

  async downloadDocs(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const documentId = formArray['controls'][index].get('dmsDocumentId').value;
    
    if (!documentId) {
        return;
    }
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
    const showDraggableContainer = {
        imageUrl: imageValue.imageUrl,
        imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
        image: showDraggableContainer
    });
}

getBase64String(documentId) {
    return new Promise((resolve, reject) => {
        this.uploadService
            .getDocumentBase64String(documentId)
            .subscribe((value) => {
                //rslt

                const msgHdr = value['dwnldDocumentRep'].msgHdr;
                if (msgHdr.rslt !== 'OK') {
                    const error = value['dwnldDocumentRep'].msgHdr.error[0];
                    if (error && error.cd === 'BWENGINE-100067') {
                        return this.toasterService.showError('Invalid document number', '');
                    }
                }
                const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
                const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
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
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

  onSave() {

  }

  onSubmit() {

    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const formValues = formArray.getRawValue();
    console.log('formValues', formValues)
    this.deferralDocService.submitDefDocuments(formValues).subscribe((data) => {

    })
  }

}
