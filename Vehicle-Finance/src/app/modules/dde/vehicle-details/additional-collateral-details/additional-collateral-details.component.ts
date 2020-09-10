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

    public userId: number;
    public leadId: number;
    isDirty: boolean;
    leadData: any = {};
    applicantDetails: any = [];
    collateralType: string = 'AGRIADDCOLTYP';

    constructor(private _fb: FormBuilder, private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService, private collateralDataService: CollateralDataStoreService,
        private commonLovService: CommomLovService, private utilityService: UtilityService, private collateralService: CollateralService,
        private loginStoreService: LoginStoreService, private toasterService: ToasterService, private router: Router, private activatedRoute: ActivatedRoute) {

        this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];

    }

    ngOnInit() {

        this.collateralForm = this._fb.group({
            collateralType: ['AGRIADDCOLTYP', Validators.required],
            propertyOwnership: [''],
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
            this.setFormValue(collateralId);
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
            marketValue: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            guideLineValue: ['', Validators.required],
            totalGuideLineValue: ['', Validators.required]
        }))

    }

    addFDFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            fdAccountNo: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            relationWithApplicant: ['', Validators.required]
        }))
    }

    addGoldLoanFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            goldInGrams: ['', Validators.required],
            currentValuePerGram: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            purity: ['', Validators.required],
            propertyOwner: ['', Validators.required],
            relationWithApplicant: ['', Validators.required]
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
            totalLandArea: ['', Validators.required],
            totalBuiltUpArea: ['', Validators.required],
            marketValue: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            guideLineValue: ['', Validators.required],
            totalGuideLineValue: ['', Validators.required],
        }))
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
                        purity: collateralDetail.purity || null,
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
        if (form.valid) {

            let additionalCollaterals = {}

            let formArray = (this.collateralForm.get('collateralFormArray') as FormArray);

            additionalCollaterals = formArray.controls[0].value;

            additionalCollaterals['collateralType'] = form.value.collateralType;
            additionalCollaterals['proofName'] = form.value.proofName;
            additionalCollaterals['proofCollected'] = form.value.proofCollected;
            additionalCollaterals['propertyOwnership'] = form.value.propertyOwnership;

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
                    this.toasterService.showError(apiError, 'Additional Collateral Detail')
                }
            })

        } else {
            this.isDirty = true;
            this.utilityService.validateAllFormFields(form)
        }
    }
}
