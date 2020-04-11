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
  creditShieldForm: FormGroup;
  existingInsuranceDetailForm: FormGroup;

  public label: any = {};
  public label_credit_shield: any = {};
  public label_existing_insurance_details: any = {};

  select_main_button_value: string = 'individual';

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();
    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].insuranceDetails[0];
        this.label_credit_shield = this.label.credit_shield[0];
        this.label_existing_insurance_details = this.label.existing_insurance_details[0]
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
      select_main_button_value: ['']
    })

    this.creditShieldForm = this._fb.group({
      credit_shield_applicable: [''],
      insurance_company_name: [''],
      credit_shield_coverage_amount: [''],
      credit_shield_premium: [''],
      credit_shield_nominee: [''],
      credit_shield_nominee_age: [''],
      credit_shield_nominee_relationship: [''],
      credit_shield_added: ['']
    })

    this.existingInsuranceDetailForm = this._fb.group({
      insurance_company_name: [''],
      date_current_policy: [''],
      no_claim_bonus: [''],
      own_damage_discount: [''],
      comprehensive: [''],
      insurance_type: [''],
    })
  }

}
