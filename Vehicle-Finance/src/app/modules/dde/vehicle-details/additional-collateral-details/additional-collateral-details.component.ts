import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

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

    constructor(private _fb: FormBuilder, private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService) { }

    ngOnInit() {

        this.collateralForm = this._fb.group({
            collateralType: ['0', Validators.required],
            collateralFormArray: this._fb.array([])
        })

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];

        this.labelsData.getLabelsData().subscribe(data => {
            this.label = data;
        }, error => {
            console.log('error', error)
        });

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
    }

    selectCollateralType(value) {
        console.log(value, 'value')
        console.log(this.collateralForm.get('collateralType').value, 'Fotm')
        // this.collateralForm.get('collateralType').value = value;
    }

}
