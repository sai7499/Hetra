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
    });
  }

  ngOnInit() {
    this.createForm();
    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {

        this.label = data.basicVehicleDetails[0];
        console.log('basicVehicleDetailsLabels', this.label)
      },
        error => {
          console.log(error, 'error')
        });

    this.lovData.getLovData().subscribe((res: any) => {

      this.values = res[0].basicVehicleDetails[0];

    });
  }

  createForm() {

    this.basicVehicleForm = this._fb.group({
      new_cv_show: this._fb.group({
        assetMake: ['1', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        assetBodyType: ['1', Validators.required],
        vehicleType: ['1', Validators.required],
        exShowroomCost: ['', Validators.required],
        finalAssetCost: ['', Validators.required],
        dealerSubventionApplicable: ['1', Validators.required],
        dealerSubventionAmount: [''],
        dealerSubventionIRR: [''],
        dealerSubventionFinance: [''],
        manufacturerSubventionApplicable: ['1', Validators.required],
        manufacturerSubventionAmount: [''],
        manufacturerSubventionIRR: [''],
        manufacturerSubventionFinance: [''],
        proformaInvoiceNo: [''],
        proformaInvoiceDate: [''],
        proformaInvoiceAmount: [''],
        orpFunding: ['1', Validators.required],
        insurance: [''],
        oneTimeTax: [''],
        pac: ['1'],
        vas: ['1'],
        emiProtect: ['1'],
        fastTag: ['1'],
        others: [''],
        discount: [''],
      }),
      new_car_show: this._fb.group({
        assetMake: ['1', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        vehicleType: ['1', Validators.required],
        exShowroomCost: ['', Validators.required],
        finalAssetCost: ['', Validators.required],
        dealerSubventionApplicable: ['1', Validators.required],
        dealerSubventionAmount: [''],
        dealerSubventionIRR: [''],
        dealerSubventionFinance: [''],
        manufacturerSubventionApplicable: ['1', Validators.required],
        manufacturerSubventionAmount: [''],
        manufacturerSubventionIRR: [''],
        manufacturerSubventionFinance: [''],
        proformaInvoiceNo: [''],
        proformaInvoiceDate: [''],
        proformaInvoiceAmount: [''],
        orpFunding: ['1', Validators.required],
        insurance: [''],
        oneTimeTax: [''],
        pac: ['1'],
        vas: ['1'],
        emiProtect: ['1'],
        fastTag: ['1'],
        others: [''],
        discount: [''],
      }),
      used_cv_show: this._fb.group({
        registartionNumber: ['', Validators.required],
        assetMake: ['1', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        assetBodyType: ['1', Validators.required],
        vehicleType: ['1', Validators.required],
        vechicalRegion: ['1', Validators.required],
        monthYear: ['', Validators.required],
        ageVehicle: ['', Validators.required],
        exShowroomCost: ['', Validators.required],
        fitnessDate: ['', Validators.required],
        permitType: ['1', Validators.required],
        permitOther: [''],
        permitExpireDate: ['', Validators.required],
        permitUpload: [''],
        chassisNumber: [''],
        engineNumber: [''],
        vehiclePurchasedCost: [''],
        vehicleOwnership: [''],
        rcOwnerName: [''],
        vehicleRegistrationDate: ['', Validators.required],
        reRegisteredVehicle: ['1', Validators.required],
        interStateVehicle: ['1', Validators.required],
        duplicateRC: ['1', Validators.required],
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
        assetMake: ['1', Validators.required],
        assetModel: ['1', Validators.required],
        assetVariant: ['1', Validators.required],
        assetSubVariant: ['1', Validators.required],
        assetOther: ['', Validators.required],
        vechicalUsage: ['1', Validators.required],
        vehicleCategory: ['1', Validators.required],
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
        reRegisteredVehicle: ['1', Validators.required],
        interStateVehicle: ['1', Validators.required],
        duplicateRC: ['1', Validators.required],
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

}
