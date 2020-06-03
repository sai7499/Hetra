import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  Form,
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
      applicantId: 41,
      accountHolderName: [''],
      bankId: [''],
      accountNumber: [''],
      accountType: [''],
      fromDate: [''],
      toDate: [''],
      period: [''],
      limit: [''],
      id: 8,
      // transactionDetails: this.fb.array([]),
      transactionDetails: this.listArray
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
    this.applicantId = Number(this.route.snapshot.queryParams.applicantId);
    this.formType = this.route.snapshot.queryParams.formType;

    if (this.formType) {
      this.getBankDetails();
    } else {

    }
  }

  public initRows() {
    return this.fb.group({
      month: ['jan'],
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
        this.populateData(res);
      });
  }
  public populateData(data: any) {
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
      accountType: data.ProcessVariables.accountTypeId ? data.ProcessVariables.accountTypeId : null,
      fromDate: data.ProcessVariables.fromDate ? this.utilityService.getDateFormat(data.ProcessVariables.fromDate) : null,
      toDate: data.ProcessVariables.toDate ? this.utilityService.getDateFormat(data.ProcessVariables.toDate) : null,
      period: data.ProcessVariables.period ? data.ProcessVariables.period : null,
      limit: data.ProcessVariables.limit ? data.ProcessVariables.limit : null,
    });
    const transactionDetailsList = data.ProcessVariables.transactionDetails;
    for (let i = 0; i < transactionDetailsList.length; i++) {
      this.addProposedUnit(transactionDetailsList[i]);
    }
  }

  addProposedUnit(data?: any) {
    const control = this.bankForm.controls.transactionDetails as FormArray;
    control.push(this.populateTransaction(data));
  }
  onSave() {
    this.bankTransaction
      .setTransactionDetails(this.bankForm.value)
      .subscribe((res: any) => {
        alert(JSON.stringify(res));
        this.router.navigateByUrl('pages/dde/applicant-list');
      });
  }

  getMonths() {

    const fromDate = new Date(this.bankForm.value.fromDate) ? new Date(this.bankForm.value.fromDate) : null;
    const toDate = new Date(this.bankForm.value.toDate) ? new Date(this.bankForm.value.toDate) : null;
    const diff = toDate.getMonth() - fromDate.getMonth();

    if (diff === undefined || diff === null) {
    } else {
      this.bankForm.patchValue({
        period: diff + 1
      });
      this.assignedArray = this.monthArray(fromDate, toDate);
      setTimeout(() => {
        this.listArray.controls = [];
        for (let i = 0; i <= diff; i++) {
          this.listArray.push(this.initRows());
        }
      }, 2000);
    }
  }


}
