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
import { ToasterService } from '@services/toaster.service';
import { LabelsService } from '@services/labels.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
// import * as $ from 'jquery';

@Component({
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css'],
})
export class BankDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
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
  toDayDate: Date = new Date();
  isDirty = false;
  namePattern = {
    rule: '^[A-Z,a-z, ]*$',
    msg: 'Invalid Name',
  };
  nameLength30 = {
    rule: 30,
  };
  accountNumberPattern = {
    rule: '^[0-9]*$',
    msg: 'Invalid Account Number',
  };
  numberLength20 = {
    rule: 20,
  };
  limitNumberPattern = {
    rule: '^[0-9]*$',
    msg: 'Invalid Limit',
  };
  limitLength20 = {
    rule: 5,
  };
  inputValidation = {
    rule: '^[0-9]*$',
    msg: 'Enter Digits Only',
  };
  inputLength10 = {
    rule: 10,
  };
  labels: any;
  transactionData: any;
  OldFromDate: Date;
  OldToDate: any;
  todayDateNew: any = new Date();
  isLimitRequire = false;
  submitForm = false;
  constructor(
    private fb: FormBuilder,
    private bankTransaction: BankTransactionsService,
    private lovService: CommomLovService,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private location: Location,
    private toasterService: ToasterService,
    private labelsService: LabelsService,
    private toggleDdeService: ToggleDdeService
  ) {
    this.listArray = this.fb.array([]);
  }
  async ngOnInit() {
    this.bankForm = this.fb.group({
      userId: localStorage.getItem('userId'),
      applicantId: this.applicantId,
      accountHolderName: [
        null,
        [Validators.required, Validators.pattern('^[A-Z,a-z, ]*$')],
      ],
      bankId: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
      accountType: [null, [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      period: ['', { disabled: true }],
      limit: [''],
      accountBranch: [''],
      micrNumber: [''],
      totalCredits: [''],
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

    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
    this.labelsService.getLabelsData().subscribe((res: any) => {
      this.labels = res;
    });
    this.lovService.getLovData().subscribe((res: any) => {
      this.lovData = res.LOVS;
      // this.formType = this.route.snapshot.queryParams.formType;
      // if (this.formType) {
      //
      // } else {
      // }
    });
    this.getBankDetails();
    this.bankForm.get('accountType').valueChanges.subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res == '4BNKACCTYP') {
      this.isLimitRequire = true;
      this.bankForm.get('limit').setValidators(Validators.required);
      this.bankForm.get('limit').updateValueAndValidity();
      } else {
      this.isLimitRequire = false;
      this.bankForm.get('limit').clearValidators();
      this.bankForm.get('limit').updateValueAndValidity();
      }
    });
    console.log(this.f);
  }
  get f() {
    console.log(this.bankForm.controls, ' contrl f');
    return this.bankForm.controls;
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
  public initRows(index: number) {
    return this.fb.group({
      month: [this.assignedArray[index]],
      year: [this.fetchYear(this.assignedArray[index])],
      inflow: [null, [Validators.required]],
      outflow: [null, [Validators.required]],
      noOfInWardBounces: [null, [Validators.required]],
      noOfOutWardBounces: [null, [Validators.required]],
      balanceOn5th: [null, [Validators.required]],
      balanceOn15th: [null, [Validators.required]],
      balanceOn20th: [null, [Validators.required]],
      abbOfTheMonth: [null, [Validators.required]],
    });
  }
  public populateTransaction(data?: any) {
    console.log(data, 'data in aptch ');
    return this.fb.group({
      month: data.month ? data.month : null,
      year: data.year ? Number(data.year) : null,
      inflow: data.inflow ? Number(data.inflow) : null,
      outflow: data.outflow ? Number(data.outflow) : null,
      noOfInWardBounces: data.noOfInWardBounces
        ? Number(data.noOfInWardBounces)
        : null,
      noOfOutWardBounces: data.noOfOutWardBounces
        ? Number(data.noOfOutWardBounces)
        : null,
      balanceOn5th: data.balanceOn5th ? Number(data.balanceOn5th) : null,
      balanceOn15th: data.balanceOn15th ? Number(data.balanceOn15th) : null,
      balanceOn20th: data.balanceOn20th ? Number(data.balanceOn20th) : null,
      abbOfTheMonth: data.abbOfTheMonth ? Number(data.abbOfTheMonth) : null,
    });
  }
  getBankDetails() {
    this.bankTransaction
      .getBankDetails({ applicantId: this.applicantId })
      .subscribe((res: any) => {
        console.log('res from bank', res);
        this.bankDetailsNew = res.ProcessVariables.transactionDetails;
        console.log(this.bankDetailsNew, ' bank details new');
        if (this.bankDetailsNew) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.bankDetailsNew.length; i++) {
          this.assignedArray[i] = this.bankDetailsNew[i].month.toString();
        }
        console.log(this.assignedArray, ' on init');
        this.populateData(res);
        }
        const operationType = this.toggleDdeService.getOperationType();
        if (operationType === '1') {
          this.bankForm.disable();
          this.disableSaveBtn  = true;
        }
        // }
      });
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
        ? data.ProcessVariables.accountNumber
        : null,
      accountType: data.ProcessVariables.accountTypeId
        ? data.ProcessVariables.accountTypeId
        : null,
      fromDate: data.ProcessVariables.fromDate
        ? this.utilityService.getDateFromString(data.ProcessVariables.fromDate)
        : '',
      toDate: data.ProcessVariables.toDate
        ? this.utilityService.getDateFromString(data.ProcessVariables.toDate)
        : '',
      period: data.ProcessVariables.period
        ? Number(data.ProcessVariables.period)
        : null,
      limit: data.ProcessVariables.limit
        ? Number(data.ProcessVariables.limit)
        : null,
      totalCredits : data.ProcessVariables.totalCredits
      ? (data.ProcessVariables.totalCredits)
      : null,
      micrNumber: data.ProcessVariables.micrNumber
      ? (data.ProcessVariables.micrNumber)
      : null,
      accountBranch: data.ProcessVariables.accountBranch
      ? (data.ProcessVariables.accountBranch)
      : null,
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
  calculateAbb(i?: number) {
    const control = this.bankForm.controls.transactionDetails as FormArray;
    console.log(control);
    const abb5th = control.at(i).value.balanceOn5th
      ? control.at(i).value.balanceOn5th
      : 0;
    const abb15th = control.at(i).value.balanceOn15th
      ? control.at(i).value.balanceOn15th
      : 0;
    const abb20th = control.at(i).value.balanceOn20th
      ? control.at(i).value.balanceOn20th
      : 0;
    const totalAbb = (
      (Number(abb5th) + Number(abb15th) + Number(abb20th)) /
      3
    ).toFixed(2);
    control
      .at(i)
      .patchValue({ abbOfTheMonth: Math.round(Number(totalAbb)).toString() });
    this.savetransactionData();
  }
  fetchYear(event: any) {
    const year  = event.split('-');
    console.log('Year Spliting', year);
    return Number(year[1]);
      }
  onSave() {
    this.submitForm = true;
    this.isDirty = true;
    if (this.bankForm.invalid) {
      this.toasterService.showError(
        'Mandatory Fields Missing ',
        'Bank Transactions'
      );
      console.log(this.bankForm, 'Invalid Form');
      return;
    }
    this.bankForm.value.fromDate = this.bankForm.value.fromDate
      ? this.utilityService.getDateFormat(this.bankForm.value.fromDate)
      : this.bankForm.value.fromDate;
    this.bankForm.value.toDate = this.utilityService.getDateFormat(
      this.bankForm.value.toDate
    );
    // this.bankForm.value.year = Number(this.bankForm.value.year);
    this.bankForm.value.accountNumber = this.bankForm.value.accountNumber;
    this.bankForm.value.limit = this.bankForm.value.limit;
    this.bankForm.value.period = this.bankForm.value.period;
    this.bankForm.value.totalCredits = Number(this.bankForm.value.totalCredits);
    this.bankForm.value.applicantId = this.applicantId;
    this.bankForm.value.id = 7;
    const transactionArray = this.bankForm.value
      .transactionDetails as FormArray;
    console.log(transactionArray, ' transaction data');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < transactionArray.length; i++) {
      transactionArray[i].year = transactionArray[i].year.toString();
      transactionArray[i].outflow = transactionArray[i].outflow.toString();
      transactionArray[i].inflow = transactionArray[i].inflow.toString();
      transactionArray[i].noOfInWardBounces = transactionArray[
        i
      ].noOfInWardBounces.toString();
      transactionArray[i].noOfOutWardBounces = transactionArray[
        i
      ].noOfOutWardBounces.toString();
      transactionArray[i].balanceOn5th = transactionArray[
        i
      ].balanceOn5th.toString();
      transactionArray[i].balanceOn15th = transactionArray[
        i
      ].balanceOn15th.toString();
      transactionArray[i].balanceOn20th = transactionArray[
        i
      ].balanceOn20th.toString();
      transactionArray[i].abbOfTheMonth = transactionArray[
        i
      ].abbOfTheMonth.toString();
    }
    this.bankForm.value.transactionDetails = transactionArray;
    // console.log(this.bankForm.value.transactionDetails);

    this.bankTransaction
      .setTransactionDetails(this.bankForm.value)
      .subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess(
            'Record Saved Successfully',
            'Bank Detail'
          );
          this.router.navigateByUrl(
            `/pages/applicant-details/${this.leadId}/bank-list/${this.applicantId}`
          );
        } else {
          this.toasterService.showError(
            res.ProcessVariables.error.message,
            'Bank Detail'
          );
        }
      });
    console.log(this.bankForm.value);
  }
  getNewDateFormat(date) {
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // const formattedDate = year + '-' + month1 + '-' + day;
    const formattedDate = day + '/' + month1 + '/' + year;
    console.log('return Date', formattedDate);
    return formattedDate;
  }
  savetransactionData() {
    this.transactionData = null;
    const details = this.bankForm.controls.transactionDetails as FormArray;
    this.transactionData = details.value;
    console.log(this.transactionData);
  }
  setToDateMax() {
    const toDate = this.bankForm.value.toDate
      ? this.bankForm.value.toDate
      : new Date();
    this.todayDateNew = toDate;
    this.getMonths();
  }

  getMonths() {
    const tempArray: Array<any> = this.listArray.value;
    console.log('temp array', tempArray);
    if (this.OldToDate && this.OldFromDate) {
      const txt = confirm('Are You Sure Want To Change Dates ?');
      if (txt === false) {
        return;
      }
    }
    const fromDate = new Date(this.bankForm.value.fromDate)
      ? new Date(this.bankForm.value.fromDate)
      : null;
    const toDate = new Date(this.bankForm.value.toDate)
      ? new Date(this.bankForm.value.toDate)
      : null;
    if (fromDate > toDate) {
      this.toasterService.showWarning('Invalid Date Selection', '');
      if (this.OldFromDate || this.OldToDate) {
        // this.listArray.controls = [];
        const date = new Date(this.OldFromDate);
        this.bankForm.patchValue({
          fromDate: this.OldFromDate,
          toDate: this.OldFromDate,
        });
      }
      return;
    }
    const fromDateNew = this.bankForm.value.fromDate;
    const toDateNew = this.bankForm.value.toDate;
    this.OldFromDate = fromDateNew;
    this.OldToDate = toDateNew;
    const diff = toDate.getMonth() - fromDate.getMonth();
    const numberOfMonths = Math.round(
                            (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
                            (toDate.getMonth() - fromDate.getMonth()) + 1);

    if (
      diff === undefined ||
      (diff === null && fromDate.getFullYear() > toDate.getFullYear())
    ) {
      this.listArray.controls = [];
    } else {
      if (numberOfMonths >= 1) {
        this.bankForm.patchValue({
          period: numberOfMonths,
        });
      } else {
        this.bankForm.value.period = '';
        return false;
      }
      this.assignedArray = [];
      let stratMonth = fromDate.getMonth();
      const startYear = fromDate.getFullYear().toString();
      const endYear = toDate.getFullYear().toString();
      for (let i = 0; i < numberOfMonths; i++) {
        const count = stratMonth % 12;
        stratMonth = stratMonth + 1;
        console.log('start monthy', stratMonth);
        // tslint:disable-next-line: one-variable-per-declaration
        const array = this.monthArray[count];
        if ( stratMonth <= 12) {
          const fullMonth = array + '-' + startYear;
          this.assignedArray.push(fullMonth);
        } else {
          const fullMonth = array + '-' + endYear;
          this.assignedArray.push(fullMonth);
        }
        if (this.assignedArray.length > numberOfMonths) {
          return;
        }
      }
      if (this.transactionData && this.transactionData.length > 0) {
        this.listArray.controls = [];
        for (let i = 0; i <= numberOfMonths - 1; i++) {
          this.listArray.push(this.initRows(i));
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0 ; i < this.listArray.controls.length; i++) {
           // tslint:disable-next-line: prefer-const
           for ( let j = 0 ; j < this.transactionData.length;  j++) {
             if (this.listArray.controls[i].value.month === this.transactionData[j].month) {
              console.log( i , j, 'indexes of arrays');
              this.listArray.controls[i].patchValue({
                // month: ,
                // year: [2020],
                inflow: this.transactionData[j].inflow,
                outflow: this.transactionData[j].outflow,
                noOfInWardBounces: this.transactionData[j].noOfInWardBounces,
                noOfOutWardBounces: this.transactionData[j].noOfOutWardBounces,
                balanceOn5th: this.transactionData[j].balanceOn5th,
                balanceOn15th: this.transactionData[j].balanceOn15th,
                balanceOn20th: this.transactionData[j].balanceOn20th,
                abbOfTheMonth: this.transactionData[j].abbOfTheMonth,
              });
             }
           }
        }
      } else {
      this.listArray.controls = [];
      for (let i = 0; i <= numberOfMonths - 1; i++) {
          this.listArray.push(this.initRows(i));
        }
      }
    }
      // this.assignedArray.forEach(
      //   monName =>
      //     {
      //       this.listArray.push( this.initRows(
      //         tempArray.filter(val => val.month == monName)))
      //     }
      // );

  }

  onBack() {
    this.router.navigate([`/pages/applicant-details/${this.leadId}/bank-list/${this.applicantId}`]);
  }

  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }
}
