import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
    selector: 'app-additional-collateral-details',
    templateUrl: './additional-collateral-details.component.html',
    styleUrls: ['./additional-collateral-details.component.css']
})
export class AdditionalCollateralComponent implements OnInit {

    collateralForm: FormGroup;
    public label: any = {};
    public LOV: any = {};

    leadId: number;
    isDirty: boolean;
    collateralType: string = '0';

    constructor(private _fb: FormBuilder, private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService,
        private commonLovService: CommomLovService) { }

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
                    value: 'Gold_Loan'
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
        })
    }

    initForm() {

        // const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        // formArray.clear();
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
            totalGuideLineValue: ['', Validators.required],
            jewelOwner: ['', Validators.required]
        }))

    }

    addFDFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            fdAccountNo: ['', Validators.required],
            fdName: ['', Validators.required],
            fdValue: ['', Validators.required],
        }))
    }

    addGoldLoanFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            goldInGrams: ['', Validators.required],
            currentValuePerGram: ['', Validators.required],
            goldTotalValue: ['', Validators.required],
            purity: ['', Validators.required]
        }))
    }

    addPropertyFormControl() {
        const formArray = (this.collateralForm.get('collateralFormArray') as FormArray);
        formArray.clear();
        formArray.push(this._fb.group({
            totalLandArea: ['', Validators.required],
            totalBuiltUpArea: ['', Validators.required],
            marketValue: ['', Validators.required],
            totalMarketValue: ['', Validators.required],
            guideLineValue: ['', Validators.required],
            totalGuideLineValue: ['', Validators.required],
        }))
    }
}
