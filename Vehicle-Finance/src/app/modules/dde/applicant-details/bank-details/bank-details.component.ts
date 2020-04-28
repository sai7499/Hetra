import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray } from '@angular/forms';
    import { LabelsService } from "src/app/services/labels.service";

@Component({
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
    bankForm: FormGroup;
    labels: any = {};

    constructor(private fb: FormBuilder,
        private labelsData: LabelsService) {}

    ngOnInit() {
        this.labelsData.getLabelsData().subscribe(
            data => {
              this.labels = data;
              // console.log(this.labels)
            },
            error => {
              console.log(error);
            }
          );

        this.bankForm = this.fb.group({
            details: this.fb.array([])
        });
        this.addBankDetailsForm();
    }

    addBankDetailsForm() {
        const controls = new FormGroup({
           bankName: new FormControl(null),
           bankBranch: new FormControl(null),
           bankAddress: new FormControl(null),
           accountType: new FormControl(''),
           accountNumber: new FormControl(null),
           holderName: new FormControl(null),
           averageBalance: new FormControl(null),
           micrCode: new FormControl(null),
           ifscCode: new FormControl(null)
        });

        (this.bankForm.get('details') as FormArray).push(controls);

    }

    onSave() {
        console.log('form value', this.bankForm.value);
    }
}
