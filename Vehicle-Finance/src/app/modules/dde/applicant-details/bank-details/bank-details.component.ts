
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
import { ActivatedRoute, Router } from '@angular/router';



@Component({
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})


export class BankDetailsComponent implements OnInit {
    bankForm: FormGroup;
    lovData: any;
    bankDetails: any;
    applicantId: number;
    formType: string;

    constructor(private fb: FormBuilder, private bankTransaction: BankTransactionsService, private lovService: LovResolverService,
                private route: ActivatedRoute ) {}

    ngOnInit() {
        // const navigation = this.route.getCurrentNavigation();
        this.applicantId = Number(this.route.snapshot.queryParams.applicantId);
        this.formType = this.route.snapshot.queryParams.formType;
        // this.lovService.resolve().subscribe((res: any) => {
        //     console.log(res, ' lov in bank trans');
        // });
        this.getBankDetails();
        if (this.formType) {
            console.log(this.formType , 'applicant ID');
            // this.getBankDetails();
            // setTimeout(() => {
                // setTimeout( () => {
            console.log(this.bankDetails, 'bank detailsin if');
            this.populateData(this.bankDetails);
                    // }, 2000);


                // }, 10000);
                 } else {

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
           transactionDetails: this.fb.array([this.initRows(null)]  )
        });
    }
    }

   public initRows(data?: any) {
        return this.fb.group({
            month: ['jan' ],
            year: [ 2020 ],
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
    getBankDetails() {
       let bankDetails;
       bankDetails = this.bankTransaction.getBankDetails({applicantId: 41}).subscribe((res: any) => {
        console.log(res);
        return res;
            });
       console.log(bankDetails, 'let bank details');
       return bankDetails;
    }
    public populateData(data: any) {
        console.log('data in patch', data);
        this.bankForm.patchValue({
            accountHolderName: data.ProcessVariables.accountHolderName,
            bankId: data.ProcessVariables.bankId ,
            accountNumber: data.ProcessVariables.accountNumber,
            accountType: data.ProcessVariables.accountType,
            fromDate: data.ProcessVariables.fromDate,
            toDate: data.ProcessVariables.toDate,
            period: data.ProcessVariables.period,
            limit: data.ProcessVariables.limit
        });
        const transactionDetailsList = data.transactionDetails;
        for (let i = 0; i < data.ProcessVariables.transactionDetails; i++ ) {
           this.addProposedUnit(transactionDetailsList);
        }
    }

    // get formArr() {
    //     return this.bankForm.get('transactions') as FormArray;
    //   }
      addProposedUnit(data?: any) {
        const control = this.bankForm.controls.transactionDetails as FormArray;
        control.push(this.initRows(data));
      }
    onSave() {
        console.log('form value', this.bankForm.value);
        this.bankTransaction.setTransactionDetails(this.bankForm.value).subscribe((res: any) => {
            console.log(res);
            alert(JSON.stringify(res));
        });
    }

    getMonths() {
    const fromDate = new Date(this.bankForm.value.fromDate);
    const toDate = new Date(this.bankForm.value.toDate);
    // const diff = toDate.getMonth() - fromDate.getMonth();
    console.log(fromDate.getMonth() + 1, toDate.getMonth() + 1);
    }
}
