import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { CollateralService } from '@services/collateral.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    selector: 'app-additional-collateral-details',
    templateUrl: './additional-collateral-details.component.html',
    styleUrls: ['./additional-collateral-details.component.css']
})
export class AdditionalCollateralComponent implements OnInit {

    collateralForm: FormGroup;
    public label: any = {};
    public LOV: any = {};

    public userId: number;
    public leadId: number;
    isDirty: boolean;
    collateralType: string = '0';

    constructor(private _fb: FormBuilder, private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService,
        private commonLovService: CommomLovService, private utilityService: UtilityService, private collateralService: CollateralService,
        private loginStoreService: LoginStoreService) { }

    ngOnInit() {

        this.collateralForm = this._fb.group({
            collateralType: ['0', Validators.required],
            propertyOwnership: [''],
            proofCollected: [''],
            nameofProof: [''],
            collateralFormArray: this._fb.array([])
        })

        this.labelsData.getLabelsData()
            .subscribe(data => {
                this.label = data;
            }, error => {
                console.log('error', error)
            });

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];

        let roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;


        this.initForm();
        this.getLov();
    }

    selectCollateralType(value) {
        this.collateralType = value;
        this.initForm();
    }

    getLov() {
        this.commonLovService.getLovData().subscribe((value: any) => {
            this.LOV = value.LOVS;
            this.LOV.collateralType = [
                {
                    key: '0',
                    value: 'Agriculture'
                },
                {
                    key: '1',
                    value: 'FD'
                }, {
                    key: '2',
                    value: 'Gold Loan'
                },
                {
                    key: '3',
                    value: 'Property'
                },
            ]
            this.LOV.YesORNoValue = [
                {
                    key: "1",
                    value: "Yes"
                },
                {
                    key: "0",
                    value: "NO"
                }
            ]
            this.LOV.propertyType = [
                {
                    key: "1",
                    value: "Residence"
                },
                {
                    key: "0",
                    value: "Commercial"
                }
            ]
        })
    }

    initForm() {
        this.collateralType === '0' ? this.addAgricultureFormControl() : this.collateralType === '1' ?
            this.addFDFormControl() : this.collateralType === '2' ? this.addGoldLoanFormControl() : this.addPropertyFormControl();
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
            fdValue: ['', Validators.required],
            relationWithApplicant: ['', Validators.required]
        }))
    }

    addGoldLoanFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            goldInGrams: ['', Validators.required],
            currentValuePerGram: ['', Validators.required],
            goldTotalValue: ['', Validators.required],
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
            totalLandArea: ['', Validators.required],
            totalBuiltUpArea: ['', Validators.required],
            marketValue: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            guideLineValue: ['', Validators.required],
            totalGuideLineValue: ['', Validators.required],
        }))
    }

    onFormSubmit(form) {
        if (form.valid) {

        } else {
            this.isDirty = true;
            console.log('error', form)
            this.utilityService.validateAllFormFields(form)
        }
    }
}
