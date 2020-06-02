import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray } from '@angular/forms';
  import { LabelsService } from "src/app/services/labels.service";
  import { CommomLovService} from '@services/commom-lov-service';
  import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { IndivIdentityInfoDetails, CorporateProspectDetails } from '@model/applicant.model';

@Component({
  selector: 'app-identity-details',
  templateUrl: './identity-details.component.html',
  styleUrls: ['./identity-details.component.css']
})
export class IdentityDetailsComponent implements OnInit {
  labels: any = {};
  lov: any= {};

  isIndividual = true;

  identityForm: FormGroup;

  constructor(private labelsData: LabelsService,
             private commomLovservice : CommomLovService,
             private applicantService: ApplicantService,
             private applicantDataService: ApplicantDataStoreService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );
    this.getLov()

  // this.identityForm = this.fb.group({
  //     details: this.fb.array([])
  // });
  this.identityForm = new FormGroup({
    entity : new FormControl(''),
      details: new FormArray([])
  });
  this.addIndividualFormControls();
  this.identityForm.patchValue({entity : "INDIVENTTYP"})
  }


  getLov(){
    this.commomLovservice.getLovData().subscribe((lov)=> (this.lov=lov));
    console.log('lov', this.lov)
  }
  addIndividualFormControls() {
    const controls = new FormGroup({
    //    idDetails: new FormControl(''),
    //    idNumber: new FormControl(null),
    //    expiryDate: new FormControl(null),
    aadhar: new FormControl(null),
    form60: new FormControl(''),
    pan: new FormControl(null),
    passportNumber: new FormControl(null),
    passportIssueDate: new FormControl(null),
    passportExpiryDate: new FormControl(null),
    drivingLicenseNumber: new FormControl(null),
    drivingLicenseIssueDate: new FormControl(null),
    licenseExpiry: new FormControl(null),
    voterIdNumber: new FormControl(null),
    voterIdIssueDate: new FormControl(null),
    voterIdExpiryDate: new FormControl(null)
    });
    (this.identityForm.get('details') as FormArray).push(controls);
}

addNonIndividualFormControls() {
    const controls = new FormGroup({
      tinNumber: new FormControl(null),
      panNumber: new FormControl(null),
      corporateIdentificationNumber: new FormControl(null),
      gstNumber: new FormControl(null)
    });
    (this.identityForm.get('details') as FormArray).push(controls);
}

onIndividualChange(event) {
    const value = event.target.value;
    console.log('value', value)
    this.isIndividual = value === 'INDIVENTTYP';
    const formArray = (this.identityForm.get('details') as FormArray);
    formArray.clear();
    // const length = formArray.length;
    // for (let i = 0; i < length; i++) {
    //     formArray.removeAt(i);
    // }
    // console.log('formArray', formArray);
    this.isIndividual ? this.addIndividualForm() : this.addNonIndividualForm();
}

addIndividualForm() {
    this.addIndividualFormControls();
}

addNonIndividualForm() {
    this.addNonIndividualFormControls();
}

onSave() {
    // const rawValue = this.identityForm.getRawValue();
    // if(this.isIndividual){
    //   this.storeIndividualValueInService(rawValue);
    //   this.applicantDataService.setIndivIdentityInfoDetails(null);
    // } else {
    //   this.storeNonIndividualValueInService(rawValue);
    //   this.applicantDataService.setCorporateProspectDetails(null);
    // }
    // const identityData = this.applicantDataService.getApplicant();
   
}

// storeIndividualValueInService(value){
//     const identityDetails : IndivIdentityInfoDetails ={}
//     const formValue = value.details[0];
//     identityDetails.aadhar = formValue.aadhar;
//     identityDetails.pan = formValue.pan;
//     identityDetails.form60 = formValue.form60;
//     identityDetails.passportNumber = formValue.aadhar;
//     identityDetails.passportIssueDate = formValue.aadhar;
//     identityDetails.passportExpiryDate = formValue.aadhar;
//     identityDetails.drivingLicenseNumber = formValue.aadhar;
//     identityDetails.drivingLicenseIssueDate = formValue.aadhar;
//     identityDetails.drivingLicenseExpiryDate = formValue.aadhar;
//     identityDetails.voterIdNumber = formValue.voterIdNumber;
//     identityDetails.voterIdIssueDate = formValue.voterIdIssueDate;
//     identityDetails.voterIdExpiryDate = formValue.voterIdExpiryDate;

//     this.applicantDataService.setIndivIdentityInfoDetails(identityDetails);

// }

// storeNonIndividualValueInService(value){
//  const prospectDetails : CorporateProspectDetails= {}
//  const formValue = value.details[0];
//  prospectDetails.tinNumber = formValue.tinNumber;
//  prospectDetails.panNumber = formValue.panNumber;
//  prospectDetails.corporateIdentificationNumber = formValue.corporateIdentificationNumber;
//  prospectDetails.gstNumber = formValue.gstNumber;

//  this.applicantDataService.setCorporateProspectDetails(prospectDetails);
// }

}
