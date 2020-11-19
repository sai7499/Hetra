import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  insuranceDetailForm: FormGroup;
  LOV: any = {};

  public label: any = {};
  public labelCreditShield: any = {};
  public labelExistingInsuranceDetails: any = {};
  disableSaveBtn: boolean;

  insuranceType: string = '0';
  labels: any;
  validationData: any;

  constructor(private _fb: FormBuilder, private labelsData: LabelsService, private toggleDdeService: ToggleDdeService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });



    // this.InsuranceDetailForm = this._fb.group({
    //   insuranceType: ['0'],
    //   InsuranceFormArray: this._fb.array([])
    // })

    // this.labelsData.getLabelsOfDDEData()
    //   .subscribe(data => {
    //     this.label = data.insuranceDetails[0];
    //     this.labelCreditShield = this.label.creditShield[0];
    //     this.labelExistingInsuranceDetails = this.label.existingInsuranceDetails[0];

    //   },
    //     error => {
    //       console.log(error, 'error')
    //     });

    // this.LOV.insuranceType = [
    //   {
    //     key: '0',
    //     value: 'Credit Shield'
    //   },
    //   {
    //     key: '1',
    //     value: 'Existing Insurance Details'
    //   },
    // ]
    // this.createForm();
    // const operationType = this.toggleDdeService.getOperationType();
    // if (operationType) {
    //   this.InsuranceDetailForm.disable();
    //   this.disableSaveBtn  = true;
    // }
  }

  initForm() {
    this.insuranceDetailForm = this._fb.group({
      creditShieldRequired: [''],
      guardianAddLine1: [''],
      guardianAddLine2: [''],
      guardianAddLine3: [''],
      guardianCity: [''],
      guardianCountry: [''],
      guardianDOB: [''],
      guardianDistrict: [''],
      guardianFirstName: [''],
      guardianFullName: [''],
      guardianLastName: [''],
      guardianMiddleName: [''],
      guardianMobileNumber: [''],
      guardianPincode: [''],
      guardianRelationWithApp: [''],
      guardianState: [''],
      motorInsuranceRequired: [''],
      nomineeAddLine1: [''],
      nomineeAge: [''],
      nomineeCity: [''],
      nomineeCountry: [''],
      nomineeDOB: [''],
      nomineeDistrict: [''],
      nomineeFirstName: [''],
      nomineeFullName: [''],
      nomineeLastName: [''],
      nomineeMiddleName: [''],
      nomineeMobileNumber: [''],
      nomineePincode: [''],
      nomineeRelationWithApp: [''],
      nomineeState: [''],
      typeOfApplicant: [''],
      usedCoverageAmount: [''],
    })
  }

  // selectInsuranceType(value) {
  //   this.insuranceType = value;
  //   this.createForm();
  // }

  // createForm() {
  //   const formArray = (this.InsuranceDetailForm.get('InsuranceFormArray') as FormArray);
  //   formArray.clear();
  //   this.insuranceType === '0' ? this.isCreditShield() : this.isExistingInsuranceDetails()
  // }

  // isCreditShield() {
  //   const formArray = (this.InsuranceDetailForm.get('InsuranceFormArray') as FormArray);
  //   const controls = this._fb.group({
  //     creditShieldApplicable: [''],
  //     insuranceCompanyName: [''],
  //     creditShieldCoverageAmount: [''],
  //     creditShieldPremium: [''],
  //     creditShieldNominee: [''],
  //     creditShieldNomineeAge: [''],
  //     creditShieldNomineeRelationship: [''],
  //     creditShieldaddedtoLoanAmount: ['']
  //   });;
  //   formArray.push(controls);
  // }

  // isExistingInsuranceDetails() {
  //   const formArray = (this.InsuranceDetailForm.get('InsuranceFormArray') as FormArray);

  //   const controls = this._fb.group({
  //     insuranceCompanyName: [''],
  //     expiryDateofCurrentpolicy: [''],
  //     noClaimBonus: [''],
  //     ownDamageDiscount: [''],
  //     comprehensive: [''],
  //     insuranceType: [''],
  //   });
  //   formArray.push(controls);

  // }

}