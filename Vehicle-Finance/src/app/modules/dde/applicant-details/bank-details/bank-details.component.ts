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
// import * as $ from 'jquery';

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
    rule: 20,
  };
  inputValidation = {
    rule: '^[0-9]*$',
    msg: 'Enter Digits Only',
  };
  inputLength10 = {
    rule: 10,
  };
  labels: any;
  constructor(
    private fb: FormBuilder,
    private bankTransaction: BankTransactionsService,
    private lovService: CommomLovService,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private location: Location,
    private toasterService: ToasterService,
    private labelsService: LabelsService
  ) {
    this.listArray = this.fb.array([]);
  }
  async ngOnInit() {
    this.bankForm = this.fb.group({
      userId: localStorage.getItem('userId'),
      applicantId: this.applicantId,
      accountHolderName: [null, [Validators.required, Validators.pattern('^[A-Z,a-z, ]*$')]],
      bankId: [null, [Validators.required]],
      accountNumber: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      accountType: [null, [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      period: ['', { disabled: true }],
      limit: [null],
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
      this.formType = this.route.snapshot.queryParams.formType;
      if (this.formType) {
        this.getBankDetails();
      } else {
      }
    });

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
  public initRows(data?: any) {
    return this.fb.group({
      month: [''],
      year: [2020],
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
        for (let i = 0; i < this.bankDetailsNew.length; i++) {
          this.assignedArray[i] = this.bankDetailsNew[i].month.toString();
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
    const abb5th = control.at(i).value.balanceOn5th ? control.at(i).value.balanceOn5th : 0;
    const abb15th = control.at(i).value.balanceOn15th ? control.at(i).value.balanceOn15th : 0;
    const abb20th = control.at(i).value.balanceOn20th ? control.at(i).value.balanceOn20th : 0;
    const totalAbb = ((Number(abb5th) + Number(abb15th) + Number( abb20th)) / 3).toFixed(2);
    control.at(i).patchValue ({ abbOfTheMonth : totalAbb});
  }
  onSave() {
    for (let i = 0; i < this.bankForm.value.transactionDetails.length; i++) {
      // tslint:disable-next-line: max-line-length
      console.log(this.assignedArray[i]);
      this.bankForm.value.transactionDetails[i].month = this.assignedArray[i]
        ? this.assignedArray[i]
        : this.assignedArray[i].month;
    }
    this.bankForm.value.fromDate = this.utilityService.getDateFormat(
      this.bankForm.value.fromDate
    );
    this.bankForm.value.toDate = this.utilityService.getDateFormat(
      this.bankForm.value.toDate
    );
    this.bankForm.value.limit = Number(this.bankForm.value.limit);
    this.bankForm.value.applicantId = this.applicantId;
    this.bankForm.value.id = 7;
    console.log(this.bankForm.value.transactionDetails);
    if (this.bankForm.invalid) {
      this.toasterService.showWarning(
        'Mandatory Fields Missing Or Invalid Pattern Detected',
        'Bank Transactions'
      );
      return;
    }
    this.bankTransaction
      .setTransactionDetails(this.bankForm.value)
      .subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess(
            'Bank Detail Saved Successfully',
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

  getMonths() {
    const fromDate = new Date(this.bankForm.value.fromDate)
      ? new Date(this.bankForm.value.fromDate)
      : null;
    const toDate = new Date(this.bankForm.value.toDate)
      ? new Date(this.bankForm.value.toDate)
      : null;
    const diff = toDate.getMonth() - fromDate.getMonth();
    const numberOfMonths = Math.round(
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (toDate.getMonth() - fromDate.getMonth()) +
        1
    );
    if (
      diff === undefined ||
      (diff === null && fromDate.getFullYear() > toDate.getFullYear())
    ) {
      this.listArray.controls = [];
      // alert('Invalid Date Selection');
    } else {
      // const numberOfMonths =
      //   (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      //   (toDate.getMonth() - fromDate.getMonth()) +
      //   1;
      if (numberOfMonths >= 1) {
        this.bankForm.patchValue({
          period: numberOfMonths,
        });
      } else {
        // alert('Invalid Date Selection');
        this.bankForm.value.period = '';
        return false;
      }

      this.listArray.controls = [];
      for (let i = 0; i <= numberOfMonths - 1; i++) {
        this.listArray.push(this.initRows());
      }
      // const startMonth = fromDate.getMonth();
      // const endMonth = toDate.getMonth();
      this.assignedArray = [];
      const controlArray = this.bankForm.controls
        .transactionDetails as FormArray;
      let stratMonth = fromDate.getMonth();
      for (let i = 0; i < numberOfMonths; i++) {
        // const count = i % 12;
        const count = stratMonth % 12;
        stratMonth = stratMonth + 1;
        console.log('start monthy', stratMonth);
        // const array = this.monthArray.slice(count, count + 1);
        // tslint:disable-next-line: one-variable-per-declaration
        const array = this.monthArray[count];
        console.log(array, array[0]);
        this.assignedArray.push(array);

        // console.log(controlArray, 'Control Array') ;
        // controlArray.at(i).patchValue({ month: array });

        //
      }
      // this.assignedArray = this.assignedArray.reverse();
      console.log(this.assignedArray, ' assigned Array');
    }
  }
  onBack() {
    this.location.back();
  }
  // log(this.assignedArray);

  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }
}


