import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-applicant-kyc-details',
  templateUrl: './applicant-kyc-details.component.html',
  styleUrls: ['./applicant-kyc-details.component.css']
})
export class ApplicantKycDetailsComponent implements OnInit {
  // applicantkyc: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    // this.applicantFeilds();
  }

  applicantFeilds(){
  //   this.applicantkyc = this._fb.group({
  //     name: new FormControl({ value: 'sairam', disabled: true }, Validators.required),
  //     dob: ['', Validators.required],
  //     gender: ['', Validators.required],
  //     co: ['', Validators.required],
  //     street: ['', Validators.required],
  //     location: ['', Validators.required],
  //     landmark: ['', Validators.required],
  //     city: ['', Validators.required],
  //     state: ['', Validators.required],
  //     district: ['', Validators.required],
  //     country: ['', Validators.required],
  //     pincode: ['', Validators.required],
  //     loanBranch: 1345
  // })
  }

}
