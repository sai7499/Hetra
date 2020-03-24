import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService} from  '../services/vehicle-detail.service';
import { LovDataService } from '@services/lov-data.service';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';



@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {

    vehicleForm: FormGroup;

    vehicleLov: any  = {};
    public labels = [];
    public errorMsg;
    public getAllFieldLabel;
    public vehicleType:any = [ 'Open', 'Tipper', 'Trailer', 'Goods', 'Bus', 'Passenger Vehicle', 'ODC' ];
    public vechicalRegion: any = ['TN', 'AP'];
    public assetMake: any = [ 'Tata Motors', 'Eicher'];
    public assetModel: any = ['Asset-Model-1', 'Asset-Model-2', 'Asset-Model-3'];
    public assetBodyType: any = ['Asset-Model-1', 'Asset-Model-2', 'Asset-Model-3'];
    public assetVariant:any = ['Asset-variant-1', 'Asset-variant-2', 'Asset-variant-3'];
    public assetSubVariant:any = ['Sub Variant 1', 'Sub Variant 2', 'Sub Variant 3'];
    public vechicalUsage:any = ['Yellow Board', 'White Board'];
    public vechicleCategory:any = ['CAT 1', 'CAT 2', 'CAT 3'];
    public orpFunding:any = ['Yes', 'No'];
    public pac:any = ['Yes', 'No'];
    public vas:any = ['Yes', 'No'];
    public emiProtect:any = ['Yes', 'No'];
    public fastTag:any = ['Yes', 'No'];
    public permitType: any = ['National', 'State', 'Others'];
    constructor(
      private vehicleDetailService: VehicleDetailService,
      private labelsData: LabelsService,
      private lovDataService: LovDataService,
      private router: Router,
      private leadStoreService: LeadStoreService ) { }

    ngOnInit() {
      this.initForm();
      this.getAllFieldLabel = this.vehicleDetailService.getVehicleDetailLabels()
          .subscribe( data => {
            this.labels = data;
          },
          error => {
            this.errorMsg = error;
          });
      this.lovDataService.getLovData().subscribe((value: any) => {
        this.vehicleLov = value ? value[0].vehicleDetails[0] : {};
        console.log('vehicleLov', this.vehicleLov);
        this.setFormValue();
      });
    }

    initForm() {
      this.vehicleForm = new FormGroup({
      vehicleType: new FormControl(''),
      region: new FormControl(''),
      registrationNumber: new FormControl(''),
      assetMake: new FormControl(''),
      assetModel: new FormControl(''),
      assetBodyType: new FormControl(''),
      assetVariant: new FormControl(''),
      assetSubVariant: new FormControl(''),
      monthManufacturing: new FormControl(''),
      yrManufacturing: new FormControl(''),
      ageOfAsset: new FormControl(''),
      vechicalUsage: new FormControl(''),
      vehicleCategory: new FormControl(''),
      orpFunding: new FormControl(''),
      oneTimeTax: new FormControl(''),
      pac: new FormControl(''),
      vas: new FormControl(''),
      emiProduct: new FormControl(''),
      fastTag: new FormControl(''),
      others: new FormControl(''),
      discount: new FormControl(''),
      finalAssetCost: new FormControl(''),
      idv: new FormControl(''),
      insuranceValidity: new FormControl(''),
      // insurance_copy: new FormControl(''),
      permitType: new FormControl(''),
      expiryDate: new FormControl(''),
      // permit_copy: new FormControl(''),
      permitOthers: new FormControl(''),
      frsdRequired: new FormControl(''),
      frsdAmount: new FormControl(''),
      fitnessDate: new FormControl(''),
      // fitness_copy: new FormControl(''),
      noOfVehicle: new FormControl(''),
      });
    }

    setFormValue() {
      const vehicleModel = this.leadStoreService.getVehicleDetails() || {};
      this.vehicleForm.patchValue({
        vehicleType: vehicleModel.vehicleType || '',
        region: vehicleModel.region || '',
        registrationNumber: vehicleModel.registrationNumber || '',
        assetMake: vehicleModel.assetMake || '',
        assetModel: vehicleModel.assetModel || '',
        assetBodyType: vehicleModel.assetBodyType || '',
        assetVariant: vehicleModel.assetVariant || '',
        assetSubVariant: vehicleModel.assetSubVariant || '',
        monthManufacturing: vehicleModel.monthManufacturing || '',
        yrManufacturing: vehicleModel.yrManufacturing || '',
        ageOfAsset: vehicleModel.vehicleType || '',
        vechicalUsage: vehicleModel.vechicalUsage || '',
        vehicleCategory: vehicleModel.vehicleCategory || '',
        orpFunding: vehicleModel.orpFunding || '',
        oneTimeTax: vehicleModel.oneTimeTax || '',
        pac: vehicleModel.pac || '',
        vas: vehicleModel.vas || '',
        emiProduct: vehicleModel.emiProduct || '',
        fastTag: vehicleModel.fastTag || '',
        others: vehicleModel.others || '',
        discount: vehicleModel.discount || '',
        finalAssetCost: vehicleModel.finalAssetCost || '',
        idv: vehicleModel.idv || '',
        insuranceValidity: vehicleModel.insuranceValidity || '',
        permitType: vehicleModel.permitType || '',
        expiryDate: vehicleModel.expiryDate || '',
        permitOthers: vehicleModel.permitOthers || '',
        frsdRequired: vehicleModel.frsdRequired || '',
        frsdAmount: vehicleModel.vehicleType || '',
        fitnessDate: vehicleModel.fitnessDate || '',
        noOfVehicle: vehicleModel.noOfVehicle || '',
      });
    }

    onFormSubmit() {
      const formModel = this.vehicleForm.value;
      const vehicleModel = {...formModel};
      this.leadStoreService.setVehicleDetails(vehicleModel);
      this.router.navigate(['/pages/lead-section/applicant-details']);
    }
  }
