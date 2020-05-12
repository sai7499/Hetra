import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  InsuranceDetailForm: FormGroup;

  public label: any = {};
  public labelCreditShield: any = {};
  public labelExistingInsuranceDetails: any = {};

  select_main_button_value: string = 'individual';

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();
    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data.insuranceDetails[0];
        this.labelCreditShield = this.label.creditShield[0];
        this.labelExistingInsuranceDetails = this.label.existingInsuranceDetails[0];

      },
        error => {
          console.log(error, 'error')
        });
  }

  select_main_button(event) {
    this.select_main_button_value = event.target.value;
  }

  createForm() {
    this.InsuranceDetailForm = this._fb.group({
      creditShield: this._fb.group({
        creditShieldApplicable: [''],
        insuranceCompanyName: [''],
        creditShieldCoverageAmount: [''],
        creditShieldPremium: [''],
        creditShieldNominee: [''],
        creditShieldNomineeAge: [''],
        creditShieldNomineeRelationship: [''],
        creditShieldaddedtoLoanAmount: ['']
      }),
      existingInsuranceDetails: this._fb.group({
        insuranceCompanyName: [''],
        expiryDateofCurrentpolicy: [''],
        noClaimBonus: [''],
        ownDamageDiscount: [''],
        comprehensive: [''],
        insuranceType: [''],
      })
    })
  }

}
