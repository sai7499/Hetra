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
        this.bankForm = new FormGroup(this.addBankDetailsForm());
        this.addBankDetailsForm();
    }

    addBankDetailsForm() {
        const controls = {
           holderName: new FormControl(null),
           bankName: new FormControl(null),
           accountNumber: new FormControl(null),
           accountType: new FormControl(''),
           fromDate: new FormControl(null),
           toDate: new FormControl(null),
           period: new FormControl(null),
           limit: new FormControl(null),
        };
        return controls;
    }

    onSave() {
        console.log('form value', this.bankForm.value);
    }
}