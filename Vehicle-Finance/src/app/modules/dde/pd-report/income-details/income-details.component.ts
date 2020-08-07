import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.css']
})
export class IncomeDetailsComponent implements OnInit {
  incomeDetailsForm: FormGroup;
  labels: any;
  acType: any = [{}]
  public errorMsg;
  constructor(private labelsData: LabelsService) { }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // console.log('in labels data', this.labels);
      },
      error => {
        this.errorMsg = error;
      });
  }

  initForm() { // initialising the form group
    this.incomeDetailsForm = new FormGroup({
      // applicantName: new FormControl({ value: this.applicantFullName, disabled: true }),
      grossIncome: new FormControl('', Validators.required),
      netIncome: new FormControl('', Validators.required),
      additionaIncome: new FormControl('', Validators.required),
      grossSalary: new FormControl('', Validators.required),
      netSalary: new FormControl('', Validators.required),
      individualIncome: new FormControl('', Validators.required),
      acType: new FormControl('', Validators.required),
      bankName: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      ccOdLimit: new FormControl('', Validators.required),
      ifCcOdLimit: new FormControl('', Validators.required),
      noOfChqReturns: new FormControl('', Validators.required),
      cashBankBalance: new FormControl('', Validators.required),
      monthlyInflows: new FormControl('', Validators.required),
      monthlyOutflows: new FormControl('', Validators.required),
      creditCardFirstName: new FormControl('', Validators.required),
      creditCardMiddleName: new FormControl('', Validators.required),
      creditCardLastName: new FormControl('', Validators.required),
      creditCardFullName: new FormControl('', Validators.required),
      creditcardIssuedby: new FormControl('', Validators.required),
      creditcardLimit: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getLabels();
    this.initForm();
  }

}
