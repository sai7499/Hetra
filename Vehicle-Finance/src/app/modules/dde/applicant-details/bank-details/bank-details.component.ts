import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { Location } from '@angular/common';
import * as $ from 'jquery';

@Component({
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css'],
})
export class BankDetailsComponent implements OnInit {
  bankDetailsNew: any;
  bankForm: FormGroup;
  lovData: any;
  bankDetails: any;
  applicantId: number;
  formType: string;
  monthArray: any;
  assignedArray = [];
  listArray: FormArray;
  leadId;
  bsDatepickerConfig: any;
  toDate;
  assignedArray1 = [];
  constructor(
    private fb: FormBuilder,
    private bankTransaction: BankTransactionsService,
    private lovService: CommomLovService,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private location: Location ,
  ) {
    this.listArray = this.fb.array([]);
  }
  async ngOnInit() {
  const date = new Date();
  console.log(date);
  this.bankForm = this.fb.group({
    userId: localStorage.getItem('userId'),
    applicantId: this.applicantId,
    accountHolderName: [''],
    bankId: [''],
    accountNumber: [''],
    accountType: [''],
    fromDate: ['' ],
    toDate: [this.utilityService.getNewDateFormat(date), {disabled: true}],
    period: ['' , { disabled : true}],
    limit: [''],
    id: this.leadId,
    // transactionDetails: this.fb.array([]),
    transactionDetails: this.listArray,
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
    });
  this.applicantId = (await this.getApplicantId()) as number;
  this.leadId = (await this.getLeadId()) as number;

  this.formType = this.route.snapshot.queryParams.formType;
  if (this.formType) {
      this.getBankDetails();
    } else {
    }
  // $('.datepicker').datepicker('update', new Date());
  }
  getApplicantId() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe((value) => {
        const applicantId = value.applicantId;
        if (applicantId) {
          resolve(Number(applicantId));
        }
        resolve(null);
      });
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  public initRows( data?: any) {
    return this.fb.group({
      month: [''],
      year: [2020],
      inflow: [''],
      outflow: [''],
      noOfInWardBounces: [''],
      noOfOutWardBounces: [''],
      balanceOn5th: [''],
      balanceOn15th: [''],
      balanceOn20th: [''],
      abbOfTheMonth: [''],
    });
  }
  public populateTransaction(data?: any) {
    console.log(data, 'data in aptch ');
    return this.fb.group({
      month: data.month,
      year: data.year,
      inflow: data.inflow,
      outflow: data.outflow,
      noOfInWardBounces: data.noOfInWardBounces,
      noOfOutWardBounces: data.noOfOutWardBounces,
      balanceOn5th: data.balanceOn5th,
      balanceOn15th: data.balanceOn15th,
      balanceOn20th: data.balanceOn20th,
      abbOfTheMonth: data.abbOfTheMonth,
    });
  }
  getBankDetails() {
    this.bankTransaction
      .getBankDetails({ applicantId: this.applicantId })
      .subscribe((res: any) => {
        console.log('res from bank', res);
        this.bankDetailsNew = res.ProcessVariables.transactionDetails;
        console.log(this.bankDetailsNew, ' bank details new');
        // if (res.error === null) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0 ; i < this.bankDetailsNew.length; i++ ) {
          this.assignedArray.push(this.bankDetailsNew[i].month);
          }
        console.log(this.assignedArray, ' on init');
        this.populateData(res);
        // }
      });
  }
  getDate() {
    const date = new Date();
    console.log(date, ' date function');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day1 = day < 10 ? '0' + day : day;
    const month1 = month < 10 ? ' 0' + month : month;
    const newDate = (day1 + '-' + month1 + '-' + year).toString();
    console.log(newDate);
    return newDate;
  }
  public populateData(data?: any) {
    this.bankForm.patchValue({
      accountHolderName: data.ProcessVariables.accountHolderName
        ? data.ProcessVariables.accountHolderName
        : null,
      bankId: data.ProcessVariables.bankId
        ? data.ProcessVariables.bankId
        : null,
      accountNumber: data.ProcessVariables.accountNumber
        ? Number(data.ProcessVariables.accountNumber)
        : null,
      accountType: data.ProcessVariables.accountTypeId
        ? data.ProcessVariables.accountTypeId
        : null,
      fromDate: data.ProcessVariables.fromDate
        ? this.utilityService.getNewDateFormat(data.ProcessVariables.fromDate)
        : '',
      toDate: data.ProcessVariables.toDate
        ? this.utilityService.getNewDateFormat(data.ProcessVariables.toDate)
        : '',
      period: data.ProcessVariables.period
        ? Number(data.ProcessVariables.period)
        : null,
      limit: data.ProcessVariables.limit ? Number(data.ProcessVariables.limit) : null,
    });
    const transactionDetailsList = data.ProcessVariables.transactionDetails;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < transactionDetailsList.length; i++) {
      this.addProposedUnit(transactionDetailsList[i]);
    }
  }

  addProposedUnit(data?: any) {
    const control = this.bankForm.controls.transactionDetails as FormArray;
    control.push(this.populateTransaction(data));
  }
  onSave() {
    this.bankForm.value.fromDate = this.utilityService.getDateFormat(this.bankForm.value.fromDate);
    this.bankForm.value.toDate = this.utilityService.getDateFormat(this.bankForm.value.toDate);
    this.bankForm.value.applicantId = this.applicantId;
    this.bankForm.value.id = 7;
    console.log(this.bankForm.value.transactionDetails);
    const newArray: {} = this.assignedArray;
      // console.log(newArray);
    for (let i = 0; i < this.bankForm.value.transactionDetails.length; i++) {
        this.bankForm.value.transactionDetails[i].month = newArray[i] ? newArray[i][0] : newArray[i].month;
      }
    this.bankTransaction
      .setTransactionDetails(this.bankForm.value)
      .subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0' ) {
        this.router.navigateByUrl(`/pages/applicant-details/${this.leadId}/bank-list/${this.applicantId}`);
        }
      });
    console.log(this.bankForm.value);
  }
  getNewMonth(event: Date) {
    const fromDate = new Date(this.bankForm.value.fromDate)
      ? new Date(this.bankForm.value.fromDate)
      : null;
    const toDate = new Date(this.bankForm.value.toDate)
      ? new Date(this.bankForm.value.toDate)
      : null;
    console.log(fromDate, toDate , event, ' new Date function');
    if ( fromDate.getMonth() <= toDate.getMonth() && fromDate.getFullYear() <= toDate.getFullYear()) {
    if (fromDate.getDate() >= toDate.getDate() &&  fromDate.getMonth() === toDate.getMonth()) {
       alert( ' Invalid date');
     } else {
      const numberOfMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth()) +
      1;
      const startMonth = fromDate.getMonth();
       // tslint:disable-next-line: prefer-const
      this.assignedArray1 = [];
      for ( let i = numberOfMonths ; i >= startMonth; i--) {
        const index = startMonth % 12;
        this.assignedArray1.push(this.monthArray[index]);
        console.log(this.assignedArray1, ' new month array');
       }
      //  let index = startMonth % 12;
      //  this.assignedArray1.push(this.monthArray[index]);
      //  console.log(this.assignedArray1, ' new month array');
       }
    }
  }

  getMonths() {
    // this.changeDateFormat();
    // this.changeToDateFormat();
    const fromDate = new Date(this.bankForm.value.fromDate)
      ? new Date(this.bankForm.value.fromDate)
      : null;
    const toDate = new Date(this.bankForm.value.toDate)
      ? new Date(this.bankForm.value.toDate)
      : null;
    const diff = toDate.getMonth() - fromDate.getMonth();
    console.log(diff);
    console.log(this.monthArray, 'month array in month function');
    const numberOfMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth()) +
      1;
    if (
      diff === undefined ||
      (diff === null && fromDate.getFullYear() > toDate.getFullYear())
    ) {
      this.listArray.controls = [];
      alert('Invalid Date Selection');
    } else {
      // const numberOfMonths =
      //   (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      //   (toDate.getMonth() - fromDate.getMonth()) +
      //   1;
      this.bankForm.patchValue({
        period: numberOfMonths,
      });
      const startMonth = fromDate.getMonth();
      const endMonth = toDate.getMonth();
      this.assignedArray = [];
      for (let i = numberOfMonths + 3  ; i >= 0; i--) {
        // if ( i > 11) {
        //   // tslint:disable-next-line: prefer-const
        //   let diff1 = numberOfMonths - 11;
        //   console.log('diff of months', diff1);
        // } else {
        // tslint:disable-next-line: prefer-const
        // this.assignedArray = [];
//
        // tslint:disable-next-line: prefer-const
        // console.log(i, 'checking index');
        let count = i % 12;
        const array = this.monthArray.slice(count, count + 1);
        this.assignedArray.push(array);
        // }

        this.assignedArray = this.assignedArray.reverse();
        }
      console.log(this.assignedArray, ' assigned Array');
      }
    this.listArray.controls = [];
    for (let i = 0; i <= numberOfMonths - 1; i++) {
        this.listArray.push(this.initRows());
      }
  }
onBack() {
    this.location.back();
  }
  // log(this.assignedArray);

  onBackToApplicant(){
    
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`)
    
  }
}


