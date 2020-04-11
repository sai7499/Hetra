import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit {

  basicVehicleForm: FormGroup;
  public label: any = {};

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();

    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].basicVehicleDetails[0];
      },
        error => {
          console.log(error, 'error')
        });
  }

  createForm() {
    this.basicVehicleForm = this._fb.group({
      asset_variant: ['1', Validators.required],
      asset_sub_variant: ['1', Validators.required],
      month_manufacturing: ['', Validators.required],
      year_manufacturing: ['', Validators.required],
      vechical_group: [{ value: '', disabled: true }, Validators.required],
      vechical_usage: ['Yellow Board', Validators.required],
      vehicle_category: ['CAT 1', Validators.required],
      orp_funding: ['Yes', Validators.required],
      one_time_tax: [''],
      pac: ['Yes'],
      vas: ['Yes'],
      emi_protect: ['Yes'],
      fast_tag: ['Yes'],
      others: [''],
      discount: [''],
      final_asset_cost: ['', Validators.required],
      idv: ['', Validators.required],
      insurance_validity: ['', Validators.required],
      permit_type: ['National', Validators.required],
      expiry_date: ['', Validators.required],
      permit_others: [''],
      frsd_required: ['', Validators.required],
      frsd_amount: [''],
      fitness_date: ['', Validators.required],
      no_vehicle: ['', Validators.required]
    })
  }

}
