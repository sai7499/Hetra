import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';

import { LabelsService } from "@services/labels.service";
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent implements OnInit {

  public vehicleValForm: FormGroup;

  public vhValLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService) { }

  ngOnInit() {
    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });

    this.lovDataService.getLovData().subscribe((value: any) => {
      this.vhValLov = value ? value[0].vehicleVal[0] : {};
      this.setFormValue();
    });

  }

  initForm() {
    this.vehicleValForm = new FormGroup({
      valuatorType: new FormControl(""),
      valuatorCode: new FormControl(""),
      valuatorName: new FormControl(""),
      valuationAmount: new FormControl(""),
      valuationDate: new FormControl(""),
      idv: new FormControl(""),
      idvValidityDate: new FormControl(""),
      vhAvailInGrid: new FormControl(""),
      gridAmount: new FormControl(""),
      assetManufacturer: new FormControl(""),
      assetModel: new FormControl(""),
      newUsedAsset: new FormControl(""),
      vechicleNoPrefix: new FormControl(""),
      vechicleNumber: new FormControl(""),
      chassisNumber: new FormControl(""),
      engineNumber: new FormControl(""),
      yearRegOfAsset: new FormControl(""),
      monthRegOfAsset: new FormControl(""),
      ageOfAsset: new FormControl(""),
      sellerShortDescr: new FormControl(""),
      secondAsset: new FormControl(""),
      secondVechicleNoPrefix: new FormControl(""),
      secondVechicleNo: new FormControl(""),
      secondChassisNumber: new FormControl(""),
      agricultureProof: new FormControl(""),
      fcExpiryDate: new FormControl(""),
      vehicleRegDate: new FormControl(""),
      gvw: new FormControl(""),
      reRegisteredVechicle: new FormControl(""),
      interStateVehicle: new FormControl(""),
      duplicateRC: new FormControl(""),
      cubicCapacity: new FormControl(""),
      seatingCapacity: new FormControl(""),
      existingVechicleOwned: new FormControl(""),
      noOfVehicles: new FormControl(""),
      existingSelfCostAsset: new FormControl(""),
      total: new FormControl(""),
      make: new FormControl(""),
      model: new FormControl(""),
      year: new FormControl(""),
      registeredOwner: new FormControl(""),
      registeredOwnerName: new FormControl(""),
      vhNoPrefix: new FormControl(""),
      vhNumber: new FormControl(""),
      costOfVehicle: new FormControl("")
    });
  }

  setFormValue() {
    const vehicleValModel = this.ddeStoreService.getVehicleValuation() || {};

    this.vehicleValForm.patchValue({
      valuatorType: vehicleValModel.valuatorType || '',
      valuatorCode: vehicleValModel.valuatorCode || '',
      valuatorName: vehicleValModel.valuatorName || '',
      valuationAmount: vehicleValModel.valuationAmount || '',
      valuationDate: vehicleValModel.valuationDate || '',
      idv: vehicleValModel.idv || '',
      idvValidityDate: vehicleValModel.idvValidityDate || '',
      vhAvailInGrid: vehicleValModel.vhAvailInGrid || '',
      gridAmount: vehicleValModel.gridAmount || '',
      assetManufacturer: vehicleValModel.assetManufacturer || '',
      assetModel: vehicleValModel.assetModel || '',
      newUsedAsset: vehicleValModel.newUsedAsset || '',
      vechicleNoPrefix: vehicleValModel.vechicleNoPrefix || '',
      vechicleNumber: vehicleValModel.vechicleNumber || '',
      chassisNumber: vehicleValModel.chassisNumber || '',
      engineNumber: vehicleValModel.engineNumber || '',
      yearRegOfAsset: vehicleValModel.yearRegOfAsset || '',
      monthRegOfAsset: vehicleValModel.monthRegOfAsset || '',
      ageOfAsset: vehicleValModel.ageOfAsset || '',
      sellerShortDescr: vehicleValModel.sellerShortDescr || '',
      secondAsset: vehicleValModel.secondAsset || '',
      secondVechicleNoPrefix: vehicleValModel.secondVechicleNoPrefix || '',
      secondVechicleNo: vehicleValModel.secondVechicleNo || '',
      secondChassisNumber: vehicleValModel.secondChassisNumber || '',
      agricultureProof: vehicleValModel.agricultureProof || '',
      fcExpiryDate: vehicleValModel.fcExpiryDate || '',
      vehicleRegDate: vehicleValModel.vehicleRegDate || '',
      gvw: vehicleValModel.gvw || '',
      reRegisteredVechicle: vehicleValModel.reRegisteredVechicle || '',
      interStateVehicle: vehicleValModel.interStateVehicle || '',
      duplicateRC: vehicleValModel.duplicateRC || '',
      cubicCapacity: vehicleValModel.cubicCapacity || '',
      seatingCapacity: vehicleValModel.seatingCapacity || '',
      existingVechicleOwned: vehicleValModel.existingVechicleOwned || '',
      noOfVehicles: vehicleValModel.noOfVehicles || '',
      existingSelfCostAsset: vehicleValModel.existingSelfCostAsset || '',
      total: vehicleValModel.total || '',
      make: vehicleValModel.make || '',
      model: vehicleValModel.model || '',
      year: vehicleValModel.year || '',
      registeredOwner: vehicleValModel.registeredOwner || '',
      registeredOwnerName: vehicleValModel.registeredOwnerName || '',
      vhNoPrefix: vehicleValModel.vhNoPrefix || '',
      vhNumber: vehicleValModel.vhNoPrefix || '',
      costOfVehicle: vehicleValModel.costOfVehicle || ''
    });
  }

  onFormSubmit() {
    const formModel = this.vehicleValForm.value;
    const vhValModel = { ...formModel };
    this.router.navigate(['/pages/dde/vehicle-valuation']);
  }

}
