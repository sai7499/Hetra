
import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { BankTransactionsService } from '@services/bank-transactions.service';

@Component({
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
    bankForm: FormGroup;

    constructor(private fb: FormBuilder, private bankTransaction: BankTransactionsService ) {}

    ngOnInit() {
        this.bankForm = this.fb.group({
           userId: 1,
           applicantId: 41,
           accountHolderName: ['test'],
           bankId: ['1'],
           accountNumber: ['123'],
           accountType: ['2'],
           fromDate: ['2020-01-01'],
           toDate: ['2020-05-05'],
           period: ['5'],
           limit: ['4'],
           id: ['8'],
           transactionDetails: this.fb.array([this.initRows()]  )
        });
        // this.addBankDetailsForm();
        // this.initRows();
    }

    // addBankDetailsForm() {
    //     // const controls = {
    //     //     userId: 1,
    //     //     applicantId: 41,
    //     //    holderName: new FormControl(null),
    //     //    bankName: new FormControl(null),
    //     //    accountNumber: new FormControl(null),
    //     //    accountType: new FormControl(''),
    //     //    fromDate: new FormControl(null),
    //     //    toDate: new FormControl(null),
    //     //    period: new FormControl(null),
    //     //    limit: new FormControl(null),
    //     // };
    //     // return controls;
    //     return this.fb.group({

    //        holderName: new FormControl(null),
    //        bankName: new FormControl(''),
    //        accountNumber: new FormControl(null),
    //        accountType: new FormControl(''),
    //        fromDate: new FormControl(null),
    //        toDate: new FormControl(null),
    //        period: new FormControl(null),
    //        limit: new FormControl(null),
    //     });
    // }
   public initRows() {
        return this.fb.group({
            month: ['jan'],
            year: ['' || '2020'],
            inflow: ['10'],
            outflow: ['20'],
            noOfInWardBounces: ['21'],
            noOfOutWardBounces: ['45'],
            balanceOn5th: ['42'],
            balanceOn15th: ['48'],
            balanceOn20th: ['45'],
            abbOfTheMonth: ['74']
        });
    }
    // get formArr() {
    //     return this.bankForm.get('transactions') as FormArray;
    //   }
      addProposedUnit() {
        const control = this.bankForm.controls.transactionDetails as FormArray;
        control.push(this.initRows());
      }
    onSave() {
        console.log('form value', this.bankForm.value);
        this.bankTransaction.setTransactionDetails(this.bankForm).subscribe((res: any) => {
            console.log(res);
            alert(JSON.stringify(res));
        });
    }
}
