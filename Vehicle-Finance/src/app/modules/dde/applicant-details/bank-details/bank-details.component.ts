
import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { LovResolverService } from '@services/Lov-resolver.service';

@Component({
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
    bankForm: FormGroup;
    lovData: any;

    constructor(private fb: FormBuilder, private bankTransaction: BankTransactionsService, private lovService: LovResolverService ) {}

    ngOnInit() {
        this.bankForm = this.fb.group({
           userId: 1,
           applicantId: 41,
           accountHolderName: [''],
           bankId: ['1'],
           accountNumber: [''],
           accountType: ['1'],
           fromDate: [''],
           toDate: [''],
           period: [''],
           limit: [''],
           id: 8,
           transactionDetails: this.fb.array([this.initRows()]  )
        });
        // this.addBankDetailsForm();
        // this.initRows();
        // this.lovService.resolve().subscribe((res:any) => { 
        //     this.lovData
        // })
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
            year: [ 2020],
            inflow: [ '' ],
            outflow: [ ''],
            noOfInWardBounces: [''],
            noOfOutWardBounces: [''],
            balanceOn5th: [''],
            balanceOn15th: [''],
            balanceOn20th: [''],
            abbOfTheMonth: ['']
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
        this.bankTransaction.setTransactionDetails(this.bankForm.value).subscribe((res: any) => {
            console.log(res);
            alert(JSON.stringify(res));
        });
    }
}
