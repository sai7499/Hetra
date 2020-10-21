import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { PddDetailsService } from '@services/pdd-details.service';
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { Constant } from '@assets/constants/constant';
import { UploadService } from '@services/upload.service';
import { DraggableContainerService } from '@services/draggable.service';

@Component({
    templateUrl: './pdd.component.html',
    styleUrls: ['./pdd.component.css']
})
export class PddComponent implements OnInit {
    showModal: boolean;
    isSales: boolean;
    pddForm: FormGroup;
    pddDocumentDetails: any[];
    modifiedOrcStatusList: any;
    lovs: any;
    isDisableSubmitToCpc = true;
    selectedDocDetails;
    toDayDate: Date = new Date();
    apiCheck = false;
    leadId: number;
    isDisableCpcSubmit: boolean;


    constructor(private location: Location,
                private pddDetailsService: PddDetailsService,
                private utilityService: UtilityService,
                private lovService: CommomLovService,
                private loginStoreService: LoginStoreService,
                private toasterService: ToasterService,
                private uploadService: UploadService,
                private draggableContainerService: DraggableContainerService,
                private activatedRoute: ActivatedRoute) {
                }
    ngOnInit() {
        const currentUrl = this.location.path();
        const roles = this.loginStoreService.getRolesAndUserDetails();
        this.activatedRoute.params.subscribe((params) => {
            console.log('params', params);
            this.leadId = Number(params.leadId || 0);
            if (roles) {
                this.isSales = roles.roles[0].roleType === 1;
            }
            this.initForm();
            this.lovService.getLovData().subscribe((lov: any) => {
                 this.lovs = lov;
                 this.getPddDetailsData();
            });
        });   
    }

    initForm() {
        this.pddForm = new FormGroup({
            loanForm: new FormGroup({
                loanNumber: new FormControl(''),
                applicantName: new FormControl(''),
                disbursementDate: new FormControl(''),
                expectedDate: new FormControl('')
            }),
            numberForm: new FormGroup({
                regNumber: new FormControl(''),
                engNumber: new FormControl(''),
                chasNumber: new FormControl('')
            }),
            processForm: new FormGroup({
                orcStatus: new FormControl(''),
                orcRemarks: new FormControl(''),
                orcReceivedDate: new FormControl(''),
            }),
            pddDocumentDetails: new FormArray([])
        });
    }

    getPddDetailsData() {
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId')
        };

        this.pddDetailsService.getPddDetails(data)
            .subscribe((res: any) => {
                console.log('res', res);
                const response = res.ProcessVariables;
                this.pddDocumentDetails = response.pddDocumentDetails;
                this.modifiedOrcStatusList = response.modifiedOrcStatusList;
                if (this.isSales) {
                    let pddDocumentList = response.pddDocumentList;
                    if (!this.pddDocumentDetails) {
                        pddDocumentList = pddDocumentList.map((value) => {
                            return {
                                docName: value.value,
                                docId: value.key
                            };
                        });
                        this.updateDocumentDetailsTable(pddDocumentList);
                    } else {
                        this.updateDocumentDetailsTable(this.pddDocumentDetails);
                    }
                    this.pddForm.get('processForm').get('orcStatus').setValue(response.orcStatus);
                    if (response.orcStatus === 'RECDFRMRTOAGNTPDDDOCS') {
                        this.isDisableSubmitToCpc = false;
                        this.apiCheck = true;
                    } else {
                        this.isDisableSubmitToCpc = true;
                        this.apiCheck = false;
                    }
                } else {
                    this.updateDocumentDetailsTable(this.pddDocumentDetails);
                    this.isDisableCpcSubmit = !this.pddDocumentDetails.every((value) => {
                        return value.cpcStatus === 'VRIFIEDPDDDOCSSTS';
                    });
                }
                const loanFormData  = {
                    disbursementDate: this.utilityService.getDateFromString(response.disbursementDate) || '',
                    expectedDate: this.utilityService.getDateFromString(response.expectedDate) || '',
                    loanNumber: response.loanNumber || '',
                    applicantName: response.applicantName || ''
                };
                const numberFormData = response.pddVehicleDetails;
                this.updateLoanForm(loanFormData);
                this.updateNumberForm(numberFormData);
                this.updateProcessForm(response);
            });
    }

    updateLoanForm(value) {
        const loanForm =  this.pddForm.get('loanForm');
        loanForm.patchValue({
            disbursementDate: value.disbursementDate,
            engNumber: value.engNumber,
            loanNumber: value.loanNumber,
            applicantName: value.applicantName,
            expectedDate: value.expectedDate,
        });
    }

    updateProcessForm(value) {
        const processForm = this.pddForm.get('processForm');
        processForm.patchValue({
            orcRemarks: value.orcRemarks || '',
            orcStatus: value.orcStatus || '',
            orcReceivedDate: this.utilityService.getDateFromString(value.orcReceivedDate) || ''
        });
    }

    updateNumberForm(value) {
       if (!value) {
           return;
       }
       const numberForm =  this.pddForm.get('numberForm');
       numberForm.patchValue({
        regNumber: value.regNumber || '',
        engNumber: value.engNumber || '',
        chasNumber: value.chasNumber || ''
       });
    }

    updateDocumentDetailsTable(data) {
        if (!data) {
            return;
        }
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        data.forEach((value) => {
            const formGroup = new FormGroup({
                collectedDate: new FormControl(this.utilityService.getDateFromString(value.collectedDate) || ''),
                courieredDate: new FormControl(this.utilityService.getDateFromString(value.courieredDate) || ''),
                cpcReceivedDate: new FormControl(this.utilityService.getDateFromString(value.cpcReceivedDate) || ''),
                docName: new FormControl(value.docName || ''),
                docNumber: new FormControl(value.docNumber || ''),
                podNumber: new FormControl(value.podNumber || ''),
                cpcStatus: new FormControl(value.cpcStatus || ''),
                phyTrackingNum: new FormControl(value.phyTrackingNum || ''),
                dmsDocId: new FormControl(value.dmsDocId || ''),
                docId: new FormControl(value.docId || '')
            });
            formArray.push(formGroup);
        });

    }
    documentArray(index) {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const value = formArray['controls'][index].get('dmsDocId').value;
        return value;
    }

    updateTable() {
        console.log('form', this.pddForm);
        const arrValue: any[] = this.pddForm.get('pddDocumentDetails').value;
        const formatArrValue = arrValue.map((value) => {
            return  {
                ...value,
                docId: Number(value.docId),
                collectedDate: this.utilityService.getDateFormat(value.collectedDate) || '',
                courieredDate: this.utilityService.getDateFormat(value.courieredDate) || '',
                cpcReceivedDate: this.utilityService.getDateFormat(value.cpcReceivedDate) || '',
            };
        });

        console.log('formatArrValue', formatArrValue);
        if (this.checkTableValidation()) {
            return this.toasterService.showError('Please enter all fields', '');
        }
        this.callUpdateAPI({pddDocumentDetails: formatArrValue});
    }

    callAPIForNumberForm() {
        if (this.checkValidation()) {
            return this.toasterService.showError('Please enter all fields', '');
        }
        const numberForm = this.pddForm.get('numberForm').value;
        const processForm = this.pddForm.get('processForm').value;
        let data = {};
        const arrValue: any[] = this.pddForm.get('pddDocumentDetails').value;
        const formatArrValue = arrValue.map((value) => {
            return  {
                ...value,
                docId: Number(value.docId),
                collectedDate: this.utilityService.getDateFormat(value.collectedDate) || '',
                courieredDate: this.utilityService.getDateFormat(value.courieredDate) || '',
                cpcReceivedDate: this.utilityService.getDateFormat(value.cpcReceivedDate) || '',
            };
        });

        if (!this.isSales) {
          data = {
            pddDocumentDetails: formatArrValue,
            pddVehicleDetails: {
                ...numberForm 
            }
          }
        } else {
           data =  {
               pddDocumentDetails: formatArrValue,
               pddVehicleDetails: {
                ...processForm,
                orcReceivedDate: this.utilityService.getDateFormat(processForm.orcReceivedDate) || '' 
            }};
        }
        console.log('data', data);
        // return;
        this.callUpdateAPI(data, true);
    }

    checkValidation() {
        if (this.isSales) {
            const processForm = this.pddForm.get('processForm').value;
            if (!processForm.orcStatus || !processForm.orcReceivedDate || !processForm.orcRemarks) {
               return true;
            }
        } else {
            const numberForm = this.pddForm.get('numberForm').value;
            if (!numberForm.regNumber || !numberForm.engNumber || !numberForm.chasNumber) {
               return true;
            }
        }
    }

    callUpdateAPI(value, check?: any) {
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId'),
            ...value
        };
        this.pddDetailsService.updatePddDetails(data)
            .subscribe((value: any) => {
                console.log('value', value);
                // const response = value.ProcessVariables;
                if (value.Error === '0') {
                    const response = value.ProcessVariables;
                    const error = response.error;
                    if (error.code === '0') {
                        this.toasterService.showSuccess('Updated successfully', '');
                    }
                    if (this.isSales && check) {
                        const pddVehicleDetails = response.pddVehicleDetails;
                        if (pddVehicleDetails.orcStatus === 'RECDFRMRTOAGNTPDDDOCS') {
                            this.isDisableSubmitToCpc = false;
                            this.apiCheck = true;
                        } else {
                            this.isDisableSubmitToCpc = true;
                            this.apiCheck = false;
                        }
                    }

                    if (!this.isSales) {
                        const pddDocumentDetails = response.pddDocumentDetails;
                        this.isDisableCpcSubmit = !pddDocumentDetails.every((detail) => {
                            return detail.cpcStatus === 'VRIFIEDPDDDOCSSTS';
                        });
                    }
                 }
            });
    }

    onOrcStatusChange(event) {
        if (event.key !== 'RECDFRMRTOAGNTPDDDOCS') {
            this.isDisableSubmitToCpc = true;
        } else if (this.apiCheck) {
            this.isDisableSubmitToCpc = false;
        }
    }

    checkTableValidation() {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const details = formArray.value;
        console.log('details', details);
        const check = details.some((value) => {
            if (this.isSales) {
                return !value.collectedDate || !value.courieredDate || !value.docNumber || !value.dmsDocId || !value.podNumber;
            } else {
                return !value.cpcStatus || !value.cpcReceivedDate || !value.phyTrackingNum;
            }
        });
        console.log('check', check);
        return check;

    }

    uploadDocs(index) {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        // const docNm = formArray['controls'][index].get('docName').value;
        const docNm = 'ACCOUNT_OPENING_FORM';
        const docCtgryCd = 70;
        const docTp = 'LEAD';
        const docSbCtgry = 'ACCOUNT OPENING FORM';
        const docCatg = 'KYC - I';
        const docCmnts = 'Addition of document for Lead Creation';
        const docTypCd = 276;
        const docSbCtgryCd = 204;

        this.showModal = true;
        this.selectedDocDetails = {
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
                  id: 2295,
                },
                {
                  idTp: 'BRNCH',
                  id: Number(localStorage.getItem('branchId')),
                },
              ],
        };
    }

    onBack() {
        this.location.back();
    }

    onSubmit() {
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId'),
            isSubmit: true
        };
        if (this.isSales) {
            data.isSubmit = false;
        } else {
            data.isSubmit = true;
        }
        this.pddDetailsService.submitPDD(data)
            .subscribe((value: any) => {
                console.log('submit', value);
                if (value.Error === '0') {
                   const response = value.ProcessVariables;
                   const error = response.error;
                   if (error.code === '0') {
                       this.toasterService.showSuccess('Submitted successfully', '');
                   }
                }
            });

    }

    onUploadSuccess(event) {
        this.showModal = false;
        this.toasterService.showSuccess('Document uploaded successfully', '');
        console.log('onUploadSuccess', event);
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        formArray['controls'][event.formArrayIndex].get('dmsDocId').setValue(event.dmsDocumentId);
    }

    async downloadDocs(index) {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const documentId = formArray['controls'][index].get('dmsDocId').value;
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
                    return this.toasterService.showError('Invalid document number' , '');
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
          const blob = new Blob(byteArrays, {type: contentType});
          return blob;
        }
}
