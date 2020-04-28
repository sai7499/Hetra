import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray } from '@angular/forms';

@Component({
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
    bankForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
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
