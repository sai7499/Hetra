import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { LovResolverService } from '@services/Lov-resolver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';


@Component({
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css'],
})
export class BankDetailsComponent implements OnInit {
  bankForm: FormGroup;
  lovData: any;
  bankDetails: any;
  applicantId: number;
  formType: string;
  monthArray: any;
  assignedArray: any;
  listArray: FormArray;

  constructor(
    private fb: FormBuilder,
    private bankTransaction: BankTransactionsService,
    private lovService: CommomLovService,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
  ) {
    this.listArray = this.fb.array([]);
  }

  ngOnInit() {
    this.bankForm = this.fb.group({
        userId: 1,
        applicantId: 42,
        accountHolderName: [''],
        bankId: [''],
        accountNumber: [''],
        accountType: [''],
        fromDate: [''],
        toDate: [''],
        period: [''],
        limit: [''],
        id: 8,
        transactionDetails: this.fb.array([this.initRows()]),
      });
    this.monthArray = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    this.lovService.getLovData().subscribe((res: any) => {
        this.lovData = res.LOVS;
        console.log(this.lovData);
    });
    // const navigation = this.route.getCurrentNavigation();
    this.applicantId = Number(this.route.snapshot.queryParams.applicantId);
    this.formType = this.route.snapshot.queryParams.formType;
    // this.lovService.resolve().subscribe((res: any) => {
    //     console.log(res, ' lov in bank trans');
    // });
    console.log(this.monthArray);
    // this.getBankDetails();
    if (this.formType) {
      console.log(this.formType, 'applicant ID');
      this.getBankDetails();
    } else {

    }
  }

  public initRows(data?: any, status?: string) {
      console.log(data, status);
      if (status === 'init') {
       alert('No Row Init');
      } else {
        return this.fb.group({
            month: ['jan' ],
            year: [2020 ],
            inflow: ['' ],
            outflow: ['' ],
            noOfInWardBounces: ['' ],
            noOfOutWardBounces: ['' ],
            balanceOn5th: ['' ],
            balanceOn15th: ['' ],
            balanceOn20th: ['' ],
            abbOfTheMonth: ['' ],
          });
      }
  }
  getBankDetails() {
    //    let bankDetails;
    this.bankTransaction
      .getBankDetails({ applicantId: 41 })
      .subscribe((res: any) => {
        this.populateData(res);
      });
    //    console.log(bankDetails, 'let bank details');
  }
  public populateData(data: any) {
    console.log('data in patch', data);
    this.bankForm.patchValue({
        accountHolderName: data.ProcessVariables.accountHolderName
        ? data.ProcessVariables.accountHolderName
        : 'test 2',
        bankId: data.ProcessVariables.bankId
        ? data.ProcessVariables.bankId
        : null,
        accountNumber: data.ProcessVariables.accountNumber
        ? data.ProcessVariables.accountNumber
        : null,
        accountType: data.ProcessVariables.accountType ? data.ProcessVariables.accountType : null,
        fromDate: data.ProcessVariables.fromDate ? data.ProcessVariables.fromDate : null,
        toDate: data.ProcessVariables.toDate ? data.ProcessVariables.toDate : null,
        period: data.ProcessVariables.period ? data.ProcessVariables.period : null,
        limit: data.ProcessVariables.limit ? data.ProcessVariables.limit : null ,
    });
    const transactionDetailsList = data.ProcessVariables.transactionDetails;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < transactionDetailsList.length; i++) {
      this.addProposedUnit(transactionDetailsList[i]);
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
    this.bankTransaction
      .setTransactionDetails(this.bankForm.value)
      .subscribe((res: any) => {
        console.log(res);
        alert(JSON.stringify(res));
      });
  }

  getMonths() {
    const fromDate = new Date(this.bankForm.value.fromDate) ? new Date(this.bankForm.value.fromDate) : null;
    const toDate = new Date(this.bankForm.value.toDate) ? new Date(this.bankForm.value.toDate) : null;
    const diff = toDate.getMonth() - fromDate.getMonth();
    console.log(diff);
    console.log(this.monthArray);
    if (diff === undefined || diff === null) {
    } else {
      setTimeout(() => {
        for (let i = 0; i < diff; i++) {
          // tslint:disable-next-line: prefer-const
          // let month = this.monthArray(i);
          // this.assignedArray.push(month);
          this.addProposedUnit(null);
          console.log(i, 'loop count');
        }
      }, 2000);
    }
    console.log(this.assignedArray);
  }
}
