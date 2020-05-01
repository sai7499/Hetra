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
  public values: any = [];
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

    this.lovData.getLovData().subscribe((res: any) => {

      this.values = res[0].basicVehicleDetails[0];
      console.log(this.values);
    });
  }

  createForm() {

    this.basicVehicleForm = this._fb.group({
      new_cv_show: this._fb.group({
        assetMake: ['Tata Motors', Validators.required],
        assetModel: ['CITY RIDER', Validators.required],
        assetVariant: ['LP 1512 - 54 SEATER', Validators.required],
        assetSubVariant: ['Petrol', Validators.required],
        assetOther: ['', Validators.required],
        assetBodyType: ['Chevrolet', Validators.required],
        vehicleType: ['Open', Validators.required],
        exShowroomCost: ['', Validators.required],
        finalAssetCost: ['', Validators.required],
        dealerSubventionApplicable: ['Yes', Validators.required],
        dealerSubventionAmount: [''],
        dealerSubventionIRR: [''],
        dealerSubventionFinance: [''],
        manufacturerSubventionApplicable: ['Yes', Validators.required],
        manufacturerSubventionAmount: [''],
        manufacturerSubventionIRR: [''],
        manufacturerSubventionFinance: [''],
        proformaInvoiceNo: [''],
        proformaInvoiceDate: [''],
        proformaInvoiceAmount: [''],
        orpFunding: ['Yes', Validators.required],
        insurance: [''],
        oneTimeTax: [''],
        pac: ['Yes'],
        vas: ['Yes'],
        emiProtect: ['Yes'],
        fastTag: ['Yes'],
        others: [''],
        discount: [''],
      }),
      new_car_show: this._fb.group({
        assetMake: ['Tata Motors', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        vehicleType: ['Open', Validators.required],
        exShowroomCost: ['', Validators.required],
        finalAssetCost: ['', Validators.required],
        dealerSubventionApplicable: ['Yes', Validators.required],
        dealerSubventionAmount: [''],
        dealerSubventionIRR: [''],
        dealerSubventionFinance: [''],
        manufacturerSubventionApplicable: ['Yes', Validators.required],
        manufacturerSubventionAmount: [''],
        manufacturerSubventionIRR: [''],
        manufacturerSubventionFinance: [''],
        proformaInvoiceNo: [''],
        proformaInvoiceDate: [''],
        proformaInvoiceAmount: [''],
        orpFunding: ['Yes', Validators.required],
        insurance: [''],
        oneTimeTax: [''],
        pac: ['Yes'],
        vas: ['Yes'],
        emiProtect: ['Yes'],
        fastTag: ['Yes'],
        others: [''],
        discount: [''],
      }),
      used_cv_show: this._fb.group({
        registartionNumber: ['', Validators.required],
        assetMake: ['Tata Motors', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        assetBodyType: ['Body Type-1', Validators.required],
        vehicleType: ['Open', Validators.required],
        vechicalRegion: ['TN', Validators.required],
        monthYear: ['', Validators.required],
        ageVehicle: ['', Validators.required],
        exShowroomCost: ['', Validators.required],
        fitnessDate: ['', Validators.required],
        permitType: ['National', Validators.required],
        permitOther: [''],
        permitExpireDate: ['', Validators.required],
        permitUpload: [''],
        chassisNumber: [''],
        engineNumber: [''],
        vehiclePurchasedCost: [''],
        vehicleOwnership: [''],
        rcOwnerName: [''],
        vehicleRegistrationDate: ['', Validators.required],
        reRegisteredVehicle: ['Yes', Validators.required],
        interStateVehicle: ['Yes', Validators.required],
        duplicateRC: ['Yes', Validators.required],
        cubicCapacity: [''],
        seatingCapacity: [''],
        insuranceValidity: ['', Validators.required],
        idv: ['', Validators.required],
        insuranceCopy: [''],
        frsdRequired: ['', Validators.required],
        frsdAmount: [''],
      }),
      used_car_show: this._fb.group({
        registartionNumber: ['', Validators.required],
        assetMake: ['Tata Motors', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        vechicalUsage: ['Commercial Use', Validators.required],
        vehicleCategory: ['CAT 1', Validators.required],
        monthYear: ['', Validators.required],
        ageVehicle: ['', Validators.required],
        assetCostIndian: ['', Validators.required],
        assetCostCar: ['', Validators.required],
        assetCostLeast: ['', Validators.required],
        exShowroomCost: ['', Validators.required],
        chassisNumber: [''],
        engineNumber: [''],
        vehiclePurchasedCost: [''],
        vehicleOwnership: [''],
        rcOwnerName: [''],
        vehicleRegistrationDate: ['', Validators.required],
        grossVehicleWeight: [''],
        reRegisteredVehicle: ['Yes', Validators.required],
        interStateVehicle: ['Yes', Validators.required],
        duplicateRC: ['Yes', Validators.required],
        cubicCapacity: [''],
        seatingCapacity: [''],
        insuranceValidity: ['', Validators.required],
        idv: ['', Validators.required],
        insuranceCopy: [''],
        frsdRequired: ['', Validators.required],
        frsdAmount: [''],
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
  }

}
