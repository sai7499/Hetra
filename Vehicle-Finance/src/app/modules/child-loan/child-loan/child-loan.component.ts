import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  vehicleRegPattern:any;
  labels: any;
  nameLength: number;
  mobileLength: number;


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
      ucic: new FormControl,
      loanAccountNumber: new FormControl,
      vehicleRegistrationNumber: new FormControl,
      name: new FormControl,
      mobile: new FormControl,
      aadhaar: new FormControl,
      pan: new FormControl
    })
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = data.validationData.name.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );

  }

  validateCustomPattern() {
    const vehicleRegNoPatternData = [
      {
        rule: (inputValue) => {
          let patttern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
          if (inputValue.length === 10) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
          } else if (inputValue.length === 9) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue)
          } else {
            return true
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return vehicleRegNoPatternData;
  }

  onSubmit(){
    this.isSearched = true;
    console.log('form',this.childLoanForm.value )
  }



}
