import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { CollateralService } from '@services/collateral.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CollateralDataStoreService } from '@services/collateral-data-store.service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
    selector: 'app-additional-collateral-details',
    templateUrl: './additional-collateral-details.component.html',
    styleUrls: ['./additional-collateral-details.component.css']
})
export class AdditionalCollateralComponent implements OnInit {

    collateralForm: FormGroup;
    public label: any = {};
    public LOV: any = {};
    public relationLov: any = [];
    initalZeroCheck: any = [];
    id: number = 0;

    public userId: number;
    public leadId: number;
    isDirty: boolean;
    leadData: any = {};
    applicantDetails: any = [];
    collateralType: string = 'AGRIADDCOLTYP';
    currentValue: any
    goldGramsValue: any;
    disableSaveBtn: boolean;

    constructor(private _fb: FormBuilder, private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService, private collateralDataService: CollateralDataStoreService,
        private commonLovService: CommomLovService, private utilityService: UtilityService, private collateralService: CollateralService, private toggleDdeService: ToggleDdeService,
        private loginStoreService: LoginStoreService, private toasterService: ToasterService, private router: Router, private activatedRoute: ActivatedRoute) {

        this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];

    }

    ngOnInit() {

        this.collateralForm = this._fb.group({
            collateralType: ['AGRIADDCOLTYP', Validators.required],
            proofCollected: [''],
            proofName: [''],
            collateralFormArray: this._fb.array([])
        })

        this.labelsData.getLabelsData()
            .subscribe(data => {
                this.label = data;
            }, error => {
                console.log('error', error)
            });

        this.leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = this.leadData['leadId'];
        this.applicantDetails = this.leadData.applicantDetails;

        let collateralId = this.activatedRoute.snapshot.params['collateralId'];

        let roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;

        this.initForm();
        this.getLov();
        if (collateralId) {
            this.id = Number(collateralId);
            this.setFormValue(collateralId);
        }

        const operationType = this.toggleDdeService.getOperationType();
        if (operationType === '1' || operationType === '2') {
            this.disableSaveBtn = true;
            this.collateralForm.disable()
        }
    }

    selectCollateralType(value) {
        this.collateralType = value;
        this.initForm();
    }

    getLov() {
        this.commonLovService.getLovData().subscribe((value: any) => {
            this.LOV = value.LOVS;
            let propertOwner = [];
            if (this.applicantDetails && this.applicantDetails.length > 0) {
                this.applicantDetails.map((res) => {
                    propertOwner.push({
                        key: res.applicantId,
                        value: res.fullName
                    })
                })
            }

            this.LOV.propertOwner = propertOwner;
            this.relationLov = this.LOV.relationship;

        })
    }

    initForm() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        this.collateralType === 'AGRIADDCOLTYP' ? this.addAgricultureFormControl() : this.collateralType === 'FDADDCOLTYP' ?
            this.addFDFormControl() : this.collateralType === 'GOLDADDCOLTYP' ? this.addGoldLoanFormControl() : this.addPropertyFormControl();
    }

    addAgricultureFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            surveyNumber: ['', Validators.required],
            landInAcres: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            relationWithApplicant: ['', Validators.required],
            marketValue: [null, Validators.required],
            totalMarketValue: [null],
            guideLineValue: [null, Validators.required],
            totalGuideLineValue: [null],
            collateralId: this.id
        }))

    }

    addFDFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            fdAccountNo: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            totalMarketValue: [null, Validators.required],
            relationWithApplicant: ['', Validators.required],
            collateralId: this.id
        }))
    }

    addGoldLoanFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            goldInGrams: [null, Validators.required],
            currentValuePerGram: [null, Validators.required],
            totalMarketValue: [null],
            purity: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            relationWithApplicant: ['', Validators.required],
            collateralId: this.id
        }))
    }

    addPropertyFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            propertyType: ['', Validators.required],
            propertyAddress: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            relationWithApplicant: ['', Validators.required],
            totalLandArea: [null, Validators.required],
            totalBuiltUpArea: [null, Validators.required],
            marketValue: [null, Validators.required],
            totalMarketValue: [null],
            guideLineValue: [null, Validators.required],
            totalGuideLineValue: [null],
            propertyOwnerType: ['', Validators.required],
            collateralId: this.id
        }))
    }

    currentValueGrams(value) {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        const details = formArray.at(0)
        this.currentValue = value;
        if (this.goldGramsValue) {
            const totalValue = this.currentValue * this.goldGramsValue;
            this.convertTotalValue(totalValue)

        } else {
            details.get('totalMarketValue').setValue(null)
        }

    }

    goldGrams(value) {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        const details = formArray.at(0)
        this.goldGramsValue = value;
        if (this.currentValue) {
            const totalValue = this.currentValue * this.goldGramsValue;
            this.convertTotalValue(totalValue)
        }
        else {
            details.get('totalMarketValue').setValue(null)
        }
    }

    convertTotalValue(totalValue) {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        const details = formArray.at(0)
        const totalValueString = totalValue.toString();
        if (totalValueString.includes('.')) {
            const secondIndexValue = totalValueString.split('.')[1]
            const firstIndexValue = totalValueString.split('.')[0]
            const sliceValue = secondIndexValue.slice(0, 4)
            const finalValue = firstIndexValue + '.' + sliceValue;
            details.get('totalMarketValue').setValue(finalValue)
        } else {
            details.get('totalMarketValue').setValue(totalValue)
        }
    }

    onFindRelationship(value) {
        let typeOfApplicant = this.applicantDetails.find((res => res.applicantId === Number(value)))

        let lovOfSelf = [{
            key: "5RELATION",
            value: "Self"
        }]

        let lovOfRelationship = this.relationLov.filter((data) => data.key !== "5RELATION")
        this.LOV.relationship = typeOfApplicant['applicantType'] === "Applicant" ? lovOfSelf : lovOfRelationship;
    }

    setFormValue(id) {
        this.collateralService.getAdditionalCollateralsDetails(Number(id)).subscribe((res: any) => {

            let apiError = res.ProcessVariables.error.message;
            if (res.Error === '0' && res.Error === '0' && res.ProcessVariables.error.code === '0') {
                let collateralDetail = res.ProcessVariables.aAdditionalCollaterals ? res.ProcessVariables.aAdditionalCollaterals : {};
                this.collateralDataService.setAdditionalCollateralList(collateralDetail);

                const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);

                this.collateralType = collateralDetail.collateralType;

                this.collateralForm.patchValue({
                    collateralType: collateralDetail.collateralType || '',
                    proofCollected: collateralDetail.proofCollected || '',
                    proofName: collateralDetail.proofName || ''
                })

                formArray.clear();
                this.currentValue = collateralDetail.currentValuePerGram
                this.goldGramsValue = collateralDetail.goldInGrams

                formArray.controls.push(
                    this._fb.group({
                        collateralId: collateralDetail.collateralId || null,
                        currentValuePerGram: collateralDetail.currentValuePerGram || null,
                        fdAccountNo: collateralDetail.fdAccountNo || '',
                        fdName: collateralDetail.fdName || '',
                        goldInGrams: collateralDetail.goldInGrams || null,
                        guideLineValue: collateralDetail.guideLineValue || null,
                        landInAcres: collateralDetail.landInAcres || null,
                        marketValue: collateralDetail.marketValue || null,
                        propertyAddress: collateralDetail.propertyAddress || '',
                        propertyOwner: collateralDetail.propertyOwner || '',
                        propertyType: collateralDetail.propertyType || '',
                        propertyOwnerType: collateralDetail.propertyOwnerType || '',
                        purity: collateralDetail.purity || '',
                        relationWithApplicant: collateralDetail.relationWithApplicant || '',
                        surveyNumber: collateralDetail.surveyNumber || null,
                        totalBuiltUpArea: collateralDetail.totalBuiltUpArea || null,
                        totalGuideLineValue: collateralDetail.totalGuideLineValue || null,
                        totalLandArea: collateralDetail.totalLandArea || null,
                        totalMarketValue: collateralDetail.totalMarketValue || null,
                    })
                )
            }
        })
    }

    onFormSubmit(form) {

        let formArray = (this.collateralForm.get('collateralFormArray') as FormArray);

        if (form.valid && formArray.controls[0].valid) {
            let additionalCollaterals = {}

            additionalCollaterals = formArray.controls[0].value;

            additionalCollaterals['collateralType'] = form.value.collateralType;
            additionalCollaterals['proofName'] = form.value.proofName;
            additionalCollaterals['proofCollected'] = form.value.proofCollected;

            if (this.collateralType === 'AGRIADDCOLTYP') {

                additionalCollaterals['totalMarketValue'] = additionalCollaterals['marketValue'] * additionalCollaterals['landInAcres'];
                additionalCollaterals['totalGuideLineValue'] = additionalCollaterals['guideLineValue'] * additionalCollaterals['landInAcres']

            } else if (this.collateralType === 'PROPADDCOLTYP') {

                additionalCollaterals['totalMarketValue'] = additionalCollaterals['marketValue'] * additionalCollaterals['totalLandArea'];
                additionalCollaterals['totalGuideLineValue'] = additionalCollaterals['guideLineValue'] * additionalCollaterals['totalLandArea']
            }

            const data = {
                "userId": this.userId,
                "leadId": this.leadId,
                "additionalCollaterals": additionalCollaterals
            }

            this.collateralService.saveOrUpdateAdditionalCollaterals(data).subscribe((res: any) => {
                let apiError = res.ProcessVariables.error.message;
                if (res.Error === '0' && res.Error === '0' && res.ProcessVariables.error.code === '0') {
                    this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Additional Collateral Detail');
                    this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
                } else {
                    this.toasterService.showError(apiError, 'Additional CollateralAdditional Collateral Detail')
                }
            })

        } else {
            this.isDirty = true;
            this.utilityService.validateAllFormFields(form)
            this.toasterService.showError('Please enter all mandatory field', 'Additional Collateral Detail')
        }
    }
}
