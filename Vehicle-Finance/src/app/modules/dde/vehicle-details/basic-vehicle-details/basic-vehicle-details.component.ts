import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit {

  basicVehicleForm: FormGroup;
  public label: any = {};
  public lovLabels: any = {};

  public select_main_button_value: string = 'New CV';

  constructor(private _fb: FormBuilder, private labelsData: LabelsService, private lovData: LovDataService, private leadStoreService: LeadStoreService) {
    this.lovData.getLovData().subscribe((res: any) => {
      this.lovLabels = res[0].basicVehicleDetails[0];
      this.setFormValue();
      console.log(this.lovLabels)
    });
  }

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
      new_cv_show: this._fb.group({
        asset_make: ['Tata Motors', Validators.required],
        asset_model: ['CITY RIDER', Validators.required],
        asset_variant: ['LP 1512 - 54 SEATER', Validators.required],
        asset_sub_variant: ['Petrol', Validators.required],
        asset_other: ['', Validators.required],
        asset_body_type: ['Chevrolet', Validators.required],
        vehicle_type: ['Open', Validators.required],
        ex_showroom_cost: ['', Validators.required],
        final_asset_cost: ['', Validators.required],
        dealer_subvention_applicable: ['Yes', Validators.required],
        dealer_subvention_amount: [''],
        dealer_subvention_irr: [''],
        dealer_subvention_finance: [''],
        manufacturer_subvention_applicable: ['Yes', Validators.required],
        manufacturer_subvention_amount: [''],
        manufacturer_subvention_irr: [''],
        manufacturer_subvention_finance: [''],
        proforma_invoice_no: [''],
        proforma_invoice_date: [''],
        proforma_invoice_amount: [''],
        orp_funding: ['Yes', Validators.required],
        insurance: [''],
        one_time_tax: [''],
        pac: ['Yes'],
        vas: ['Yes'],
        emi_protect: ['Yes'],
        fast_tag: ['Yes'],
        others: [''],
        discount: [''],
      }),
      new_car_show: this._fb.group({
        asset_make: ['Tata Motors', Validators.required],
        asset_model: ['1', Validators.required],
        asset_variant: ['1', Validators.required],
        asset_sub_variant: ['1', Validators.required],
        asset_other: ['', Validators.required],
        vehicle_type: ['Open', Validators.required],
        ex_showroom_cost: ['', Validators.required],
        final_asset_cost: ['', Validators.required],
        dealer_subvention_applicable: ['Yes', Validators.required],
        dealer_subvention_amount: [''],
        dealer_subvention_irr: [''],
        dealer_subvention_finance: [''],
        manufacturer_subvention_applicable: ['Yes', Validators.required],
        manufacturer_subvention_amount: [''],
        manufacturer_subvention_irr: [''],
        manufacturer_subvention_finance: [''],
        proforma_invoice_no: [''],
        proforma_invoice_date: [''],
        proforma_invoice_amount: [''],
        orp_funding: ['Yes', Validators.required],
        insurance: [''],
        one_time_tax: [''],
        pac: ['Yes'],
        vas: ['Yes'],
        emi_protect: ['Yes'],
        fast_tag: ['Yes'],
        others: [''],
        discount: [''],
      }),
      used_cv_show: this._fb.group({
        registartion_number: ['', Validators.required],
        asset_make: ['Tata Motors', Validators.required],
        asset_model: ['1', Validators.required],
        asset_variant: ['1', Validators.required],
        asset_sub_variant: ['1', Validators.required],
        asset_other: ['', Validators.required],
        asset_body_type: ['Body Type-1', Validators.required],
        vehicle_type: ['Open', Validators.required],
        vechical_region: ['TN', Validators.required],
        month_year: ['', Validators.required],
        age_vehicle: ['', Validators.required],
        ex_showroom_cost: ['', Validators.required],
        fitness_date: ['', Validators.required],
        permit_type: ['National', Validators.required],
        permit_other: [''],
        permit_expire_date: ['', Validators.required],
        permit_upload: [''],
        chassis_number: [''],
        engine_number: [''],
        vehicle_purchased_cost: [''],
        vehicle_ownership: [''],
        rc_owner_name: [''],
        vehicle_registration_date: ['', Validators.required],
        re_registered_vehicle: ['Yes', Validators.required],
        inter_state_vehicle: ['Yes', Validators.required],
        duplicate_rc: ['Yes', Validators.required],
        cubic_capacity: [''],
        seating_capacity: [''],
        insurance_validity: ['', Validators.required],
        idv: ['', Validators.required],
        insurance_copy: [''],
        frsd_required: ['', Validators.required],
        frsd_amount: [''],
      }),
      used_car_show: this._fb.group({
        registartion_number: ['', Validators.required],
        asset_make: ['Tata Motors', Validators.required],
        asset_model: ['1', Validators.required],
        asset_variant: ['1', Validators.required],
        asset_sub_variant: ['1', Validators.required],
        asset_other: ['', Validators.required],
        vechical_usage: ['Commercial Use', Validators.required],
        vehicle_category: ['CAT 1', Validators.required],
        month_year: ['', Validators.required],
        age_vehicle: ['', Validators.required],
        asset_cost_indian: ['', Validators.required],
        asset_cost_car: ['', Validators.required],
        asset_cost_least: ['', Validators.required],
        ex_showroom_cost: ['', Validators.required],
        chassis_number: [''],
        engine_number: [''],
        vehicle_purchased_cost: [''],
        vehicle_ownership: [''],
        rc_owner_name: [''],
        vehicle_registration_date: ['', Validators.required],
        gross_vehicle_weight: [''],
        re_registered_vehicle: ['Yes', Validators.required],
        inter_state_vehicle: ['Yes', Validators.required],
        duplicate_rc: ['Yes', Validators.required],
        cubic_capacity: [''],
        seating_capacity: [''],
        insurance_validity: ['', Validators.required],
        idv: ['', Validators.required],
        insurance_copy: [''],
        frsd_required: ['', Validators.required],
        frsd_amount: [''],
      })
    })
  }

  select_main_button(event: any) {
    this.select_main_button_value = event.target.value;
  }

  onSubmit() {

  }

  setFormValue() {
    const vehicleModel = this.leadStoreService.getVehicleDetails() || {};
    this.basicVehicleForm.patchValue({
      // vehicleType: vehicleModel.vehicleType || '',
      // region: vehicleModel.region || '',
      // registrationNumber: vehicleModel.registrationNumber || '',
      // assetMake: vehicleModel.assetMake || '',
      // assetModel: vehicleModel.assetModel || '',
      // assetBodyType: vehicleModel.assetBodyType || '',
      // assetVariant: vehicleModel.assetVariant || '',
      // assetSubVariant: vehicleModel.assetSubVariant || '',
      // monthManufacturing: vehicleModel.monthManufacturing || '',
      // yrManufacturing: vehicleModel.yrManufacturing || '',
      // ageOfAsset: vehicleModel.vehicleType || '',
      // vechicalUsage: vehicleModel.vechicalUsage || '',
      // vehicleCategory: vehicleModel.vehicleCategory || '',
      // orpFunding: vehicleModel.orpFunding || '',
      // oneTimeTax: vehicleModel.oneTimeTax || '',
      // pac: vehicleModel.pac || '',
      // vas: vehicleModel.vas || '',
      // emiProtect: vehicleModel.emiProtect || '',
      // fastTag: vehicleModel.fastTag || '',
      // others: vehicleModel.others || '',
      // discount: vehicleModel.discount || '',
      // finalAssetCost: vehicleModel.finalAssetCost || '',
      // idv: vehicleModel.idv || '',
      // insuranceValidity: vehicleModel.insuranceValidity || '',
      // insuranceCopy: vehicleModel.insuranceCopy || '',
      // permitType: vehicleModel.permitType || '',
      // expiryDate: vehicleModel.expiryDate || '',
      // permitCopy: vehicleModel.permitCopy || '',
      // permitOthers: vehicleModel.permitOthers || '',
      // frsdRequired: vehicleModel.frsdRequired || '',
      // frsdAmount: vehicleModel.vehicleType || '',
      // fitnessDate: vehicleModel.fitnessDate || '',
      // fitnessCopy: vehicleModel.permitCopy || '',
      // noOfVehicle: vehicleModel.noOfVehicle || '',
    });
  }

}
