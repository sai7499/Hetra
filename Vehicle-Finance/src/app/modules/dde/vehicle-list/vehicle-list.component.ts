import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { UtilityService } from '@services/utility.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LoanViewService } from '@services/loan-view.service';
@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public label: any;
    leadId: number;
    applicantList: any = []

    public routerId: string = '0';
    disableSaveBtn: boolean;

    public formValue: any;
    userDefineForm: any;

    public isDirty: boolean;
    public subscription: any;
    public unsubForm: any;
    udfScreenId: string = '';
    udfGroupId: string = 'VLG002';
    udfDetails: any = [];

    productCatoryCode: string;

    constructor(private labelsData: LabelsService,
        private createLeadDataService: CreateLeadDataService,
        private utilityService: UtilityService,
        private toasterService: ToasterService,
        private route: Router,
        private sharedService: SharedService,
        private toggleDdeService: ToggleDdeService,
        private vehicleDetailService: VehicleDetailService,
        private applicantDataStoreService: ApplicantDataStoreService, private loanViewService: LoanViewService) { }

    ngOnInit() {

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];

        if (leadData && leadData['vehicleCollateral']) {
            this.routerId = leadData['vehicleCollateral'].length > 0 ? leadData['vehicleCollateral'][0].collateralId : '0';
        }

        let leadDetails = leadData['leadDetails']
        this.productCatoryCode = leadDetails['productCatCode'];
        this.applicantList = this.applicantDataStoreService.getApplicantList();

        this.labelsData.getLabelsData()
            .subscribe(data => {
                this.label = data;
                return data
            },
                error => {
                    console.log('error', error)
                });

        this.labelsData.getScreenId().subscribe((data) => {
            let udfScreenId = data.ScreenIDS;

            this.udfScreenId = udfScreenId.DDE.vehicleDetailDDE;
        })

        this.subscription = this.sharedService.vaildateForm$.subscribe((value) => {
            this.formValue = value;
        })

        this.unsubForm = this.sharedService.userDefined$.subscribe((form: any) => {
            this.userDefineForm = form;
        })

        const operationType = this.toggleDdeService.getOperationType();
        if (operationType) {
            this.disableSaveBtn = true;
            this.isDirty = false;
        }

        if (this.loanViewService.checkIsLoan360()) {
            this.disableSaveBtn = true;
            this.isDirty = false;
        }
    }

    onNext() {
        const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
        const product = leadSectioData.leadDetails.productCatCode;

        if (product === "NCV") {
            const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
            if (!result) {
                this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
            }
        }
        this.route.navigate([`pages/dde/${this.leadId}/additional-collateral-list`]);
    }

    onSubmit() {

        let isUdfField = true;

        if (this.userDefineForm) {
            isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true
        }

        if (this.formValue.valid && isUdfField) {

            if (this.formValue.value.isCheckDedpue === false) {
                this.toasterService.showError('Please check dedupe', 'Vehicle Detail')
                return
            }

            if (this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber && this.formValue.value.isVaildFinalAssetCost) {
                let data = this.formValue.value.vehicleFormArray[0];

                if (data && data.fcExpiryDate) {
                    data.fcExpiryDate = data.fcExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.fcExpiryDate, 'DD/MM/YYYY') : ''
                }

                if (data.firFiled) {
                    data.firFiled = data.firFiled === true ? '1' : '0';
                }

                if (data.onlineVerification) {
                    data.onlineVerification = data.onlineVerification === true ? '1' : '0';
                }

                if (data.accidentDate) {
                    data.accidentDate = data.accidentDate ? this.utilityService.convertDateTimeTOUTC(data.accidentDate, 'DD/MM/YYYY') : '';
                }

                if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC' || this.productCatoryCode === 'UTCR') {
                    data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');
                    data.expectedNOCDate = data.expectedNOCDate ? this.utilityService.convertDateTimeTOUTC(data.expectedNOCDate, 'DD/MM/YYYY') : '';
                    data.ageOfAsset = data.ageOfAsset ? data.ageOfAsset.split(' ')[0] : null;
                    data.ageAfterTenure = data.ageAfterTenure ? data.ageAfterTenure.split(' ')[0] : null;
                }

                data.invoiceDate = data.invoiceDate ? this.utilityService.convertDateTimeTOUTC(data.invoiceDate, 'DD/MM/YYYY') : '';
                data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate, 'DD/MM/YYYY') : '';
                data.permitExpiryDate = data.permitExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpiryDate, 'DD/MM/YYYY') : '';
                data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate, 'DD/MM/YYYY') : '';
                data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : '';

                data.fsrdFundingReq = data.fsrdFundingReq === true ? '1' : '0';

                data.udfDetails = [{
                    "udfGroupId": this.udfGroupId,
                    // "udfScreenId": this.udfScreenId,
                    "udfData": JSON.stringify(
                        this.userDefineForm && this.userDefineForm.udfData ?
                            this.userDefineForm.udfData.getRawValue() : {})
                }]

                console.log(data, 'data', this.productCatoryCode)

                this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {

                    if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
                        this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle Detail');
                        // this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
                    } else {
                        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Detail')
                    }

                }, error => {
                    console.log(error, 'error')
                    this.toasterService.showError(error, 'Vehicle Detail')
                })

            } else {
                if (!this.formValue.value.isInvalidMobileNumber) {
                    this.toasterService.showError('applicant and dealer of vehicle owner mobile number both are same', 'Invalid mobile no')
                } else if (!this.formValue.value.isValidPincode) {
                    this.toasterService.showError('Please enter valid pincode', 'Invalid pincode')
                } else if (!(this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber)) {
                    this.toasterService.showError('Please enter valid pincode and mobile no', 'Invalid pincode & mobile no')
                } else if (!this.formValue.value.isVaildFinalAssetCost) {
                    this.toasterService.showError('Discount should not greater than Ex show room price', 'Invalid Final Asset Cost')
                }
            }

        } else {
            this.isDirty = true;
            this.utilityService.validateAllFormFields(this.formValue)
            this.toasterService.showError('Please enter all mandatory field', 'Vehicle Detail')
        }
    }
}
