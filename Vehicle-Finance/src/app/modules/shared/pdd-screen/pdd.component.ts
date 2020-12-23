import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { PddDetailsService } from '@services/pdd-details.service';
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { Constant } from '@assets/constants/constant';
import { UploadService } from '@services/upload.service';
import { DraggableContainerService } from '@services/draggable.service';
import { LabelsService } from "@services/labels.service";
import { ObjectComparisonService } from '@services/obj-compare.service';

import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '../shared-service/shared-service';

@Component({
    templateUrl: './pdd.component.html',
    styleUrls: ['./pdd.component.css']
})
export class PddComponent implements OnInit {
    disbursementDate: any;
    minEndorsementDate: Date;
    documentNumMax = {
        rule: 30,
        msg: ''
    };
    disableDocumentList: any;
    orcHistory: any[];
    showEngineNumber: boolean;
    showDialog: boolean;
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
    vehicleRegPattern: {
        rule?: any;
        msg?: string;
    }[];
    checkInForm: boolean;
    labels;
    pddDocumentList;
    isNumberSubmitted = true;

    isEnableCpccSubmit: boolean;
    apiTableValue = [];
    rtoAgent = [];
    isDirty: boolean = false;
    isRtoAgentMsg: boolean = false;
    isEndorsDateMsg: boolean = false;
    isShowError: boolean = false;
    rtoAgentsList = [];
    isLoan360: boolean;
    taskId: any;
    udfDetails: any = [];
    userDefineForm: any;
    udfScreenId: any;
    udfGroupId: any;

    constructor(
        private location: Location,
        private pddDetailsService: PddDetailsService,
        private utilityService: UtilityService,
        private lovService: CommomLovService,
        private loginStoreService: LoginStoreService,
        private toasterService: ToasterService,
        private uploadService: UploadService,
        private draggableContainerService: DraggableContainerService,
        private activatedRoute: ActivatedRoute,
        private labelsData: LabelsService,
        private router: Router,
        private objectComparisonService: ObjectComparisonService,
        private loanViewService: LoanViewService,
        private sharedService: SharedService) {

        this.toDayDate = this.utilityService.setTimeForDates(this.toDayDate)

        // var day = this.toDayDate.getDate();
        // var month = this.toDayDate.getMonth();
        // var year = this.toDayDate.getFullYear();
        // this.toDayDate = new Date(year, month, day, 0, 0)
    }
    ngOnInit() {
        this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
        this.isLoan360 = this.loanViewService.checkIsLoan360();
        this.getLabels();
        this.vehicleRegPattern = this.validateCustomPattern();
        const currentUrl = this.location.path();
        const roles = this.loginStoreService.getRolesAndUserDetails();
        this.activatedRoute.params.subscribe((params) => {
            console.log('params', params);
            this.leadId = Number(params.leadId || 0);
            if (roles) {
                this.isSales = roles.roles[0].roleType === 1;
            }
            this.initForm();
            if(this.isSales){
                this.udfGroupId= 'PDDG001'
                this.udfScreenId= 'PDDS002'
            }else{
                this.udfGroupId= 'PDDG001'
                this.udfScreenId= 'PDDS001'
            }
            if (this.isLoan360) {
                this.activatedRoute.parent.params.subscribe((paramValue) => {
                    this.leadId = Number(paramValue.leadId || 0);
                });

            }
            this.lovService.getLovData().subscribe((lov: any) => {
                this.lovs = lov;
                this.rtoAgent = [{ key: '1RTOAGENT', value: "RTO Agent 1" },
                { key: '2RTOAGENT', value: "RTO Agent 2" },
                { key: '3RTOAGENT', value: "RTO Agent 3" }]
                this.getPddDetailsData();
            });
        });
    }
    getLabels() {
        this.labelsData.getLabelsData().subscribe(
            (data: any) => (this.labels = data),
            // (error) => console.log("Vehicle Valuation Label Error", error)
        );
    }

    validateCustomPattern() {
        const regPatternData = [
            {
                rule: (inputValue) => {
                    let patttern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
                    if (inputValue.length === 10) {
                        return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
                    } else if (inputValue.length === 9) {
                        return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue)
                    } else {
                        return true
                    }
                },
                msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
            }
        ];
        return regPatternData;
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
                orcStatus: new FormControl('', Validators.required),
                orcRemarks: new FormControl(''),
                orcReceivedDate: new FormControl('', Validators.required),
                rtoAgent: new FormControl({ value: '', disabled: true }),
                endorsementDate: new FormControl({ value: '', disabled: true })

            }),
            pddDocumentDetails: new FormArray([])
        });
    }

    getPddDetailsData() {
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId'),
            "udfDetails": [
                {
                  "udfGroupId": this.udfGroupId,
                }
              ]
        };

        this.pddDetailsService.getPddDetails(data)
            .subscribe((res: any) => {
                console.log('res', res);
                const response = res.ProcessVariables;
                this.udfDetails= response.udfDetails;
                this.pddDocumentDetails = response.pddDocumentDetails;
                this.modifiedOrcStatusList = response.modifiedOrcStatusList;
                this.pddDocumentList = response.pddDocumentList;
                this.orcHistory = response.orcHistory;
                this.rtoAgentsList = response.rtoAgentsList;
                this.disableDocumentList = response.disableDocumentList;
                this.disbursementDate = this.utilityService.getDateFromString(response.disbursementDate) || '';
                if (this.orcHistory) {
                    this.minEndorsementDate = this.utilityService.getDateFromString(this.orcHistory[0].orcReceivedDate);
                    //this.minEndorsementDate.setDate(this.minEndorsementDate.getDate()-1)
                }

                this.showEngineNumber = response.showEngineNumber;
                if (this.isSales) {
                    let pddDocumentList = response.pddDocumentList;
                    if (!this.pddDocumentDetails) {
                        pddDocumentList = pddDocumentList.map((value) => {
                            return {
                                docName: value.value,
                                docId: value.key,
                                name: value.docType,
                                categoryCode: value.categoryCode,
                                docType: value.docType,
                                categoryName: value.categoryName,
                                docTypCd: value.docId,
                                subCategoryCode: value.subCategoryCode,
                                docFullName: value.value
                            };
                        });
                        this.updateDocumentDetailsTable(pddDocumentList);
                    } else {
                        this.showEngineNumber = response.showEngineNumber;
                        this.isDisableSubmitToCpc = !this.pddDocumentDetails.every((detail) => {
                            return detail.cpcStatus === 'VRIFIEDPDDDOCSSTS';
                        });

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

                    const control = this.pddForm.get('processForm')
                    if (response.orcStatus === 'RECDFRMRTOAGNTPDDDOCS') {
                        this.isEndorsDateMsg = true;

                        control.get('endorsementDate').enable();
                        control.get('endorsementDate').setValidators([Validators.required]);
                        control.get('endorsementDate').updateValueAndValidity();

                        control.get('rtoAgent').disable();
                    } else if (response.orcStatus === 'HNDOVRRTOAGNTPDDDOCS') {

                        this.isRtoAgentMsg = true;
                        control.get('rtoAgent').enable();
                        control.get('rtoAgent').setValidators([Validators.required]);
                        control.get('rtoAgent').updateValueAndValidity();

                        control.get('endorsementDate').disable();
                    }
                } else {
                    this.updateDocumentDetailsTable(this.pddDocumentDetails);
                    this.isDisableCpcSubmit = !(this.pddDocumentDetails || []).every((value) => {
                        return value.cpcStatus === 'VRIFIEDPDDDOCSSTS';
                    });
                }

                const loanFormData = {
                    disbursementDate: this.utilityService.getDateFromString(response.disbursementDate) || '',
                    expectedDate: this.utilityService.getDateFromString(response.expectedDate) || '',
                    loanNumber: response.loanNumber || '',
                    applicantName: response.applicantName || ''
                };
                const numberFormData = response.pddVehicleDetails;
                this.updateLoanForm(loanFormData);
                this.updateNumberForm(numberFormData);
                this.updateProcessForm(response);
                this.enableCpccSubmit();
                if (this.isLoan360) {
                    this.pddForm.disable();
                }
            });
    }

    updateLoanForm(value) {
        const loanForm = this.pddForm.get('loanForm');
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
            orcReceivedDate: this.utilityService.getDateFromString(value.orcReceivedDate) || '',
            rtoAgent: value.rtoAgent || '',
            endorsementDate: this.utilityService.getDateFromString(value.endorsementDate) || ''
        });

        if (value.endorsementDate) {
            this.changeEndorseDate(this.utilityService.getDateFromString(value.endorsementDate))
        }
    }

    updateNumberForm(value) {
        if (!value) {
            return;
        }
        const numberForm = this.pddForm.get('numberForm');
        if (value.regNumber || value.engNumber || value.chasNumber) {
            this.isNumberSubmitted = false;
        }
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
                docName: new FormControl(value.docType || ''),
                docNumber: new FormControl(value.docNumber || ''),
                podNumber: new FormControl(value.podNumber || ''),
                cpcStatus: new FormControl(value.cpcStatus || ''),
                phyTrackingNum: new FormControl(value.phyTrackingNum || ''),
                dmsDocId: new FormControl(value.dmsDocId || ''),
                docId: new FormControl(value.docId || ''),
                docCtgryCd: new FormControl(value.categoryCode),
                docSbCtgry: new FormControl(value.docType),
                docCatg: new FormControl(value.categoryName),
                docTypCd: new FormControl(value.docId),
                docSbCtgryCd: new FormControl(value.subCategoryCode || value.name),
                docFullName: new FormControl(value.docName || ''),
            });
            formArray.push(formGroup);
            if (this.isSales) {
                this.apiTableValue.push({
                    collectedDate: this.utilityService.getDateFromString(value.collectedDate),
                    courieredDate: this.utilityService.getDateFromString(value.courieredDate),
                    podNumber: value.podNumber,
                    docNumber: value.docNumber,
                    dmsDocId: value.dmsDocId
                });
            } else {
                this.apiTableValue.push({
                    cpcStatus: value.cpcStatus,
                    cpcReceivedDate: value.cpcReceivedDate,
                    phyTrackingNum: value.phyTrackingNum,
                });
            }
            if (this.isSales && this.disableDocumentList) {
                formArray.disable();
            } else {
                formArray.enable();
            }
        });

        // this.apiTableValue = formArray.value;

    }
    documentArray(index) {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const value = formArray['controls'][index].get('dmsDocId').value;
        return value;
    }

    documentName(index) {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const value = formArray['controls'][index].get('docFullName').value;
        return value;
    }

    getCollectedDate(index) {

        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const value = formArray['controls'][index].get('collectedDate').value;
        if (this.toDayDate < value) {
            return null;
        }
        return value;
    }

    updateTable() {
        const arrValue: any[] = this.pddForm.get('pddDocumentDetails').value;
        const formatArrValue = arrValue.map((value) => {
            return {
                ...value,
                docId: Number(value.docId),
                collectedDate: this.utilityService.getDateFormat(value.collectedDate) || '',
                courieredDate: this.utilityService.getDateFormat(value.courieredDate) || '',
                cpcReceivedDate: this.utilityService.getDateFormat(value.cpcReceivedDate) || '',
            };
        });
        const validation: any = this.checkTableValidation();
        if (validation) {
            const docName = formatArrValue[validation.index].docName;
            const dmsDocId = formatArrValue[validation.index].dmsDocId;
            if (!dmsDocId) {
                return this.toasterService.showError(`Please upload document for ${docName}`, '');
            }
            return this.toasterService.showError(`Please enter all fields for ${docName}`, '');
        }
        if (this.checkTableValueChanges()) {
            return this.toasterService.showError('No changes done to update', '');
        }
        // if (this.checkDocsIsUploaded()) {
        //     return;
        // }
        this.callUpdateAPI({ pddDocumentDetails: formatArrValue });
    }

    callAPIForNumberForm() {
        if (this.checkValidation()) {
            return this.toasterService.showError('Please enter all fields', '');
        }
        const numberForm = this.pddForm.get('numberForm').value;
        const formvalue = this.pddForm.getRawValue();
        //console.log('formvalue', formvalue)
        const processForm = formvalue.processForm;
        let data = {};
        const arrValue: any[] = this.pddForm.get('pddDocumentDetails').value;
        const formatArrValue = arrValue.map((value) => {
            return {
                ...value,
                docId: Number(value.docId),
                collectedDate: this.utilityService.getDateFormat(value.collectedDate) || '',
                courieredDate: this.utilityService.getDateFormat(value.courieredDate) || '',
                cpcReceivedDate: this.utilityService.getDateFormat(value.cpcReceivedDate) || '',
            };
        });

        if (!this.isSales) {
            const isInvalid = this.pddForm.get('numberForm').get('regNumber').invalid;
            if (isInvalid) {
                return this.toasterService.showError('Please enter valid registration no', '');
            }
            data = {
                pddDocumentDetails: formatArrValue,
                pddVehicleDetails: {
                    ...numberForm
                }
            };
            this.isNumberSubmitted = false;
            this.enableCpccSubmit();
        } else {
            data = {
                pddDocumentDetails: formatArrValue,
                pddVehicleDetails: {
                    ...processForm,
                    orcReceivedDate: this.utilityService.getDateFormat(processForm.orcReceivedDate) || '',
                    endorsementDate: this.utilityService.getDateFormat(processForm.endorsementDate) || ''
                }
            };

        }
        console.log('data', data);
        // return;
        this.callUpdateAPI(data, true);
    }

    checkValidation() {
        const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
        if (this.isSales) {
            const formValues = this.pddForm.getRawValue();
            const processForm = formValues.processForm;
            const controls = this.pddForm.get('processForm')

            if (controls.get('orcStatus').invalid ||
                controls.get('orcReceivedDate').invalid || isUDFInvalid) {
                this.isDirty = true;
                return true;

            } else if (controls.get('rtoAgent').invalid ||
                controls.get('endorsementDate').invalid ||
                this.isShowError || isUDFInvalid) {
                this.isDirty = true;

                return true;
            }
            // ( processForm.orcStatus=="RECDFRMRTOAGNTPDDDOCS" && !processForm.endorsementDate)
        } else {
            const numberForm = this.pddForm.get('numberForm').value;
            if (!numberForm.regNumber || !numberForm.engNumber || !numberForm.chasNumber || isUDFInvalid) {
                return true;
            }
        }
    }

    callUpdateAPI(value, check?: any) {
        const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId'),
            ...value,
             udfDetails : [{
                "udfGroupId": this.udfGroupId,
                //"udfScreenId": this.udfScreenId,
                "udfData": udfData
              }]
        };
        this.pddDetailsService.updatePddDetails(data)
            .subscribe((value: any) => {
                console.log('value', value);
                // const response = value.ProcessVariables;
                if (value.Error === '0') {
                    const response = value.ProcessVariables;
                    const error = response.error;
                    this.orcHistory = response.orcHistory;
                    //this.rtoAgentsList= response.rtoAgentsList;
                    if (this.orcHistory) {
                        this.minEndorsementDate = this.utilityService.getDateFromString(this.orcHistory[0].orcReceivedDate);
                        //this.minEndorsementDate.setDate(this.minEndorsementDate.getDate()-1)
                    }

                    if (error.code === '0') {
                        this.toasterService.showSuccess('Updated successfully', '');
                    }
                    else {
                        return this.toasterService.showError(error.message, '');
                    }
                    if (this.isSales && check) {
                        const pddVehicleDetails = response.pddVehicleDetails;
                        this.disableDocumentList = response.disableDocumentList;
                        this.modifiedOrcStatusList = response.modifiedOrcStatusList;
                        if (pddVehicleDetails.orcStatus === 'RECDFRMRTOAGNTPDDDOCS') {
                            this.isDisableSubmitToCpc = false;
                            this.apiCheck = true;
                        } else {
                            this.isDisableSubmitToCpc = true;
                            this.apiCheck = false;
                        }
                        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
                        if (this.isSales && this.disableDocumentList) {
                            formArray.disable();
                        } else {
                            formArray.enable();
                        }
                    }



                    if (!this.isSales) {
                        this.isNumberSubmitted = false;
                        const pddDocumentDetails = response.pddDocumentDetails;
                        this.isDisableCpcSubmit = !pddDocumentDetails.every((detail) => {
                            return detail.cpcStatus === 'VRIFIEDPDDDOCSSTS';
                        });
                        console.log('this.isDisableCpcSubmit', this.isDisableCpcSubmit)
                    }
                }
            });
    }

    enableCpccSubmit() {
        if (!this.isDisableSubmitToCpc) {
            this.isEnableCpccSubmit = false;
        } else {
            this.isEnableCpccSubmit = true;
        }
        if (!this.isNumberSubmitted) {
            this.isEnableCpccSubmit = false;
        } else {
            this.isEnableCpccSubmit = true;
        }
    }


    changeEndorseDate(event) {
        const date = new Date(event);
        //console.log('date', date)

        //console.log(date,'form', this.pddForm.get('processForm').get('endorsementDate'))
        if (date > this.toDayDate) {
            this.isShowError = true;
        } else if (date < this.minEndorsementDate) {
            this.isShowError = true;
        } else {
            this.isShowError = false;
        }

    }

    onOrcStatusChange(event) {
        //console.log('event', event, this.pddForm)
        const control = this.pddForm.get('processForm')
        if (event.key !== 'RECDFRMRTOAGNTPDDDOCS') {
            this.isDisableSubmitToCpc = true;
        } else if (this.apiCheck) {
            this.isDisableSubmitToCpc = false;
        }

        if (event.key === 'RECDFRMRTOAGNTPDDDOCS') {

            this.isRtoAgentMsg = false;
            this.isEndorsDateMsg = true;

            control.get('endorsementDate').setValidators([Validators.required]);
            control.get('endorsementDate').updateValueAndValidity();

            control.get('endorsementDate').enable();
            control.get('rtoAgent').disable();
        } else if (event.key === 'HNDOVRRTOAGNTPDDDOCS') {
            this.isEndorsDateMsg = false;
            this.isRtoAgentMsg = true;

            control.get('rtoAgent').setValidators([Validators.required]);
            control.get('rtoAgent').updateValueAndValidity();

            control.get('rtoAgent').enable();
            control.get('endorsementDate').disable();
        } else {
            this.isRtoAgentMsg = false;
            this.isEndorsDateMsg = false;
            control.get('endorsementDate').clearValidators();
            control.get('endorsementDate').updateValueAndValidity();
            control.get('rtoAgent').clearValidators();
            control.get('rtoAgent').updateValueAndValidity();
            control.get('endorsementDate').disable();
            control.get('rtoAgent').disable();
        }




    }

    checkTableValidation() {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const details = (formArray.value || []).map((value) => {
            if (this.isSales) {
                return {
                    collectedDate: value.collectedDate,
                    courieredDate: value.courieredDate,
                    podNumber: value.podNumber,
                    docNumber: value.docNumber,
                    dmsDocId: value.dmsDocId
                };
            } else {
                return {
                    cpcStatus: value.cpcStatus,
                    cpcReceivedDate: value.cpcReceivedDate,
                    phyTrackingNum: value.phyTrackingNum,
                };
            }
        });
        console.log('details', details);

        // const check = details.some((value) => {
        //     if (this.isSales) {
        //         return !value.collectedDate || !value.courieredDate || !value.docNumber || !value.podNumber;
        //     } else {
        //         return !value.cpcStatus || !value.cpcReceivedDate || !value.phyTrackingNum;
        //     }
        // });
        const check = this.objectComparisonService.isThereAnyUnfilledObj(details);
        console.log('check', check);
        return check;

    }

    checkTableValueChanges() {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const details = (formArray.value || []).map((value) => {
            if (this.isSales) {
                return {
                    collectedDate: value.collectedDate,
                    courieredDate: value.courieredDate,
                    podNumber: value.podNumber,
                    docNumber: value.docNumber,
                    dmsDocId: value.dmsDocId
                };
            } else {
                return {
                    cpcStatus: value.cpcStatus,
                    cpcReceivedDate: value.cpcReceivedDate,
                    phyTrackingNum: value.phyTrackingNum,
                };
            }
        });
        // console.table(details);
        // console.table(this.apiTableValue);
        console.log('compare', this.objectComparisonService.compare(details, this.apiTableValue));
        const check = this.objectComparisonService.compare(details, this.apiTableValue);
        if (!check) {
            this.apiTableValue = details;
        }
        return check;
    }

    checkDocsIsUploaded() {
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        const details = formArray.value;
        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const docName = this.pddDocumentList.find((value) => {
                return value.key == detail.docId;
            })
            if (!detail.dmsDocId) {
                this.toasterService.showError(`Please upload document for ${docName.value}`, '');
                return true;
            }
        }
    }

    uploadDocs(index) {
        if (this.disableDocumentList) {
            return;
        }
        const formArray = this.pddForm.get('pddDocumentDetails') as FormArray;
        // const docNm = formArray['controls'][index].get('docName').value;
        const docNm = formArray['controls'][index].get('docName').value;
        const docCtgryCd = formArray['controls'][index].get('docCtgryCd').value;
        const docTp = 'LEAD';
        const docSbCtgry = formArray['controls'][index].get('docSbCtgry').value;
        const docCatg = formArray['controls'][index].get('docCatg').value;
        const docCmnts = 'Addition of document for Lead Creation';
        const docTypCd = formArray['controls'][index].get('docTypCd').value;
        const docSbCtgryCd = formArray['controls'][index].get('docSbCtgryCd').value;

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

    onBack() {
        if (this.isLoan360) {
            return this.router.navigateByUrl(`/pages/dde/${this.leadId}/delivery-order`);
        }
        this.router.navigateByUrl(`/pages/dashboard`);
    }

    onSubmit() {
        if (!this.isSales && this.showEngineNumber) {
            const numberForm = this.pddForm.get('numberForm');
            const regNumber = numberForm.get('regNumber').value;
            const engNumber = numberForm.get('engNumber').value;
            const chasNumber = numberForm.get('chasNumber').value;
            if (!regNumber) {
                return this.toasterService.showError('Please enter Registration No', '');
            }
            if (!engNumber) {
                return this.toasterService.showError('Please enter Engine Number', '');
            }
            if (!chasNumber) {
                return this.toasterService.showError('Please enter Chassis Number', '');
            }

        }
        this.showDialog = true;
    }

    callSubmitApi() {
        const data = {
            leadId: this.leadId,
            userId: localStorage.getItem('userId'),
            isSubmit: true,
            taskId: this.taskId,
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
                        this.router.navigateByUrl(`/pages/dashboard`);
                    } else {
                        this.toasterService.showError(error.message, '');
                    }
                } else {
                    this.toasterService.showError(value.ErrorMessage, '');
                }
            });
    }

    onCancel() {
        this.showDialog = false;
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

    onSaveuserDefinedFields(value) {
        this.userDefineForm = value;
        console.log('identify', value)
      }
}
