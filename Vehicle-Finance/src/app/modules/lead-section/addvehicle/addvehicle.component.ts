import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LovDataService } from '@services/lov-data.service';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { VehicleDetailService} from '../services/vehicle-detail.service'

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent implements OnInit {

  vehicleForm: FormGroup;

    public vehicleLov: any  = {};
    public label: any = {};
    public errorMsg;
    public getAllFieldLabel;
    public show: boolean = false;
    public formVehicle: any;
    public isAlert : boolean = false;
  

  constructor(
      private labelsData: LabelsService,
      private lovDataService: LovDataService,
      private router: Router,
      private leadStoreService: LeadStoreService,
      private vehicleDetailService : VehicleDetailService ) { }

      ngOnInit() {
        this.initForm();
        this.getAllFieldLabel = this.labelsData.getLabelsData()
            .subscribe( data => {
              this.label = data;
            },
            error => {
              this.errorMsg = error;
            });
        this.lovDataService.getLovData().subscribe((value: any) => {
          
          this.vehicleLov = value ? value[0].vehicleDetails[0] : {};
          console.log('vehicleLov', this.vehicleLov);
          this.vehicleLov.assetMake=value[0].vehicleDetails[0].assetMake;
          this.vehicleLov.assetModel=value[0].vehicleDetails[0].assetModel
          this.vehicleLov.vehicleType=value[0].vehicleDetails[0].vehicleType
          this.vehicleLov.assetBodyType=value[0].vehicleDetails[0].assetBodyType
          this.vehicleLov.region=value[0].vehicleDetails[0].region
          this.vehicleLov.assetVariant=value[0].vehicleDetails[0].assetVariant
          this.vehicleLov.assetSubVariant=value[0].vehicleDetails[0].assetSubVariant
          this.vehicleLov.vechicalUsage=value[0].vehicleDetails[0].vechicalUsage
          // this.vehicleLov.assetMake=value[0].vehicleDetails[0].assetMake
          // this.vehicleLov.assetMake=value[0].vehicleDetails[0].assetMake
          // this.getVehicle();
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
        yearAndMonthManufacturing: new FormControl(''),
        ageOfAsset: new FormControl(''),
        vechicalUsage: new FormControl(''),
        vehicleCategory: new FormControl(''),
        orpFunding: new FormControl(''),
        oneTimeTax: new FormControl(''),
        pac: new FormControl(''),
        vas: new FormControl(''),
        emiProtect: new FormControl(''),
        fastTag: new FormControl(''),
        others: new FormControl(''),
        discount: new FormControl(''),
        finalAssetCost: new FormControl(''),
        idv: new FormControl(''),
        insuranceValidity: new FormControl(''),
        insuranceCopy: new FormControl(''),
        permitType: new FormControl(''),
        expiryDate: new FormControl(''),
        permitCopy: new FormControl(''),
        permitOthers: new FormControl(''),
        frsdRequired: new FormControl(''),
        frsdAmount: new FormControl(''),
        fitnessDate: new FormControl(''),
        fitnessCopy: new FormControl(''),
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
          emiProtect: vehicleModel.emiProtect || '',
          fastTag: vehicleModel.fastTag || '',
          others: vehicleModel.others || '',
          discount: vehicleModel.discount || '',
          finalAssetCost: vehicleModel.finalAssetCost || '',
          idv: vehicleModel.idv || '',
          insuranceValidity: vehicleModel.insuranceValidity || '',
          insuranceCopy: vehicleModel.insuranceCopy || '',
          permitType: vehicleModel.permitType || '',
          expiryDate: vehicleModel.expiryDate || '',
          permitCopy: vehicleModel.permitCopy || '',
          permitOthers: vehicleModel.permitOthers || '',
          frsdRequired: vehicleModel.frsdRequired || '',
          frsdAmount: vehicleModel.vehicleType || '',
          fitnessDate: vehicleModel.fitnessDate || '',
          fitnessCopy: vehicleModel.permitCopy || '',
          noOfVehicle: vehicleModel.noOfVehicle || '',
        });
      }
  
      onFormSubmit() {

        const formModel = this.vehicleForm.value;
        // console.log('formModel',formModel)
        const vehicleModel = {...formModel};
        this.isAlert= true
        
        // console.log('vehicleModel',vehicleModel)
        this.leadStoreService.setVehicleDetails(vehicleModel);
        
         this.router.navigateByUrl['/pages/lead-section/vehicle-details']
        
      }
      

      onCheck(){
           this.formVehicle= this.vehicleForm.value;
           console.log('onCheck', this.formVehicle);
           this.getcategory(this.vehicleLov.assetMake, this.formVehicle.assetMake, "assetMake")
           this.getcategory(this.vehicleLov.assetModel, this.formVehicle.assetModel, "assetModel")
           this.getcategory(this.vehicleLov.assetVariant, this.formVehicle.assetVariant, "assetVariant")
           this.getcategory(this.vehicleLov.assetSubVariant, this.formVehicle.assetSubVariant, "assetSubVariant")
           this.getcategory(this.vehicleLov.assetBodyType, this.formVehicle.assetBodyType, "assetBodyType")
           this.getcategory(this.vehicleLov.vehicleType, this.formVehicle.vehicleType, "vehicleType")
           this.getcategory(this.vehicleLov.region, this.formVehicle.region, "region")
           this.getcategory(this.vehicleLov.vechicalUsage, this.formVehicle.vechicalUsage, "vechicalUsage")

           this.vehicleForm.controls["finalAssetCost"].setValue(this.formVehicle.finalAssetCost);
           this.vehicleForm.controls["noOfVehicle"].setValue(this.formVehicle.noOfVehicle)
          //  this.vehicleLov.assetMake.forEach(element=>{
          //   if(parseInt(this.formVehicle.assetMake) == element.key){
          //     console.log('hello')
          //     this.vehicleForm.controls["assetMake"].setValue(element.key)
          //   }
          //  });
            
            
      }

      getcategory(category, value,formcontrolName){
        category.forEach(element=>{
          if(parseInt(value) == element.key){
            console.log('hello')
            this.vehicleForm.controls[formcontrolName].setValue(element.key)
          }
         });
      }

      // getVehicle(){
      //  this.tableVehicleDetail=this.vehicleDetailService.getVehicle()
      //  console.log('tableDetails',this.tableVehicleDetail)
      // }
  
      ngOnChanges() { }
  
      //To show and hide lov--select "Open" in Vehicle dependency
      onShow(event) {
        // console.log("event ", event.target.value);
        if (event.target.value === "1") {
          this.show = true;
        } else {
          this.show = false;
        }
      }
  
    }
