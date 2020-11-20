import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-child-loan',
  templateUrl: './child-loan.component.html',
  styleUrls: ['./child-loan.component.css']
})
export class ChildLoanComponent implements OnInit {

  isSearched: boolean;
  childLoanForm: FormGroup;
  vehicleRegPattern: any;
  labels: any;
  nameLength: number;
  mobileLength: number;
  minAge: number;
  maxAge: number;
  isDirty: boolean;

  constructor(
    private commonLovService: CommomLovService,
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.vehicleRegPattern = this.validateCustomPattern();
  }

  initForm() {
    this.childLoanForm = new FormGroup({
      ucic: new FormControl('', Validators.required),
      loanAccountNumber: new FormControl('', Validators.required),
      vehicleRegistrationNumber: new FormControl('', Validators.required),
      aadhaar: new FormControl('', Validators.required),
      drivingLicense: new FormControl('', Validators.required),
      voterId: new FormControl('', Validators.required),
      passport: new FormControl('', Validators.required),
      pan: new FormControl('', Validators.required),
      cin: new FormControl('', Validators.required),
      tan: new FormControl('', Validators.required),
      gst: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required)
    });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = data.validationData.name.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );

  }

  validateCustomPattern() {
    const vehicleRegNoPatternData = [
      {
        rule: (inputValue) => {
          const pattern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
          if (inputValue.length === 10) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
          } else if (inputValue.length === 9) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue);
          } else {
            return true;
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return vehicleRegNoPatternData;
  }

  onSubmit() {
    const ucic = this.childLoanForm.controls.ucic.value;
    const loanAccountNumber = this.childLoanForm.controls.loanAccountNumber.value;
    const vehicleRegistrationNumber = this.childLoanForm.controls.vehicleRegistrationNumber.value;
    const aadhaar = this.childLoanForm.controls.aadhaar.value;
    const drivingLicense = this.childLoanForm.controls.drivingLicense.value;
    const voterId = this.childLoanForm.controls.voterId.value;
    const passport = this.childLoanForm.controls.passport.value;
    const pan = this.childLoanForm.controls.pan.value;
    const cin = this.childLoanForm.controls.cin.value;
    const tan = this.childLoanForm.controls.tan.value;
    const gst = this.childLoanForm.controls.gst.value;
    const name = this.childLoanForm.controls.name.value;
    const mobile = this.childLoanForm.controls.mobile.value;
    const dateOfBirth = this.childLoanForm.controls.dateOfBirth.value;
    if (
      ucic || loanAccountNumber ||
      vehicleRegistrationNumber ||
      aadhaar || drivingLicense ||
      voterId || passport || pan ||
      cin || tan || gst
    ) {
      this.isSearched = true;
      this.isDirty = false;
      console.log('form', this.childLoanForm.controls);
    } else if (name && dateOfBirth) {
      this.isSearched = true;
      this.isDirty = false;
      console.log('form', this.childLoanForm.controls);
    } else if (name && mobile) {
      this.isSearched = true;
      this.isDirty = false;
      console.log('form', this.childLoanForm.controls);
    } else {
      this.isDirty = true;
    }

  }

  getFormControlValues() {
    const ucic = this.childLoanForm.controls.ucic.value;
    const loanAccountNumber = this.childLoanForm.controls.value;
    const vehicleRegistrationNumber = this.childLoanForm.controls.value;
    const aadhaar = this.childLoanForm.controls.value;
    const drivingLicense = this.childLoanForm.controls.value;
    const voterId = this.childLoanForm.controls.value;
    const passport = this.childLoanForm.controls.value;
    const pan = this.childLoanForm.controls.value;
    const cin = this.childLoanForm.controls.value;
    const tan = this.childLoanForm.controls.value;
    const gst = this.childLoanForm.controls.value;
    const name = this.childLoanForm.controls.value;
    const mobile = this.childLoanForm.controls.value;
    const dateOfBirth = this.childLoanForm.controls.value;
  }



}
