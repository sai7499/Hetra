import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LovDataService } from '@services/lov-data.service';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { VehicleDetailService} from '../services/vehicle-detail.service'
import { element } from 'protractor';


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
    selectedVehicle : number;
    isHidden : boolean =false;
  

  constructor(
      private labelsData: LabelsService,
      private lovDataService: LovDataService,
      private router: Router,
      private activatedRoute : ActivatedRoute,
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
          // this.vehicleLov.assetMake=value[0].vehicleDetails[0].assetMake;
          // this.vehicleLov.assetModel=value[0].vehicleDetails[0].assetModel

          
          // this.vehicleLov.vehicleType=value[0].vehicleDetails[0].vehicleType
          // this.vehicleLov.assetBodyType=value[0].vehicleDetails[0].assetBodyType
          // this.vehicleLov.region=value[0].vehicleDetails[0].region
          // this.vehicleLov.assetVariant=value[0].vehicleDetails[0].assetVariant
          // this.vehicleLov.assetSubVariant=value[0].vehicleDetails[0].assetSubVariant
          // this.vehicleLov.vechicalUsage=value[0].vehicleDetails[0].vechicalUsage
         
          // this.setFormValue();
          // this.onCheck();

        });
        this.activatedRoute.params.subscribe((value)=>{
          console.log('vehicle params', value);
          const vehicleId= value? value.id : null;
          console.log('vehicleId', vehicleId)
          if (vehicleId !== null && vehicleId !==undefined){
            this.isHidden= true;
            this.selectedVehicle = Number(vehicleId);
            console.log('numberselectId', this.selectedVehicle)
            const selectedVehicle : Temp= this.leadStoreService.getSelectedVehicle(Number(vehicleId));
            this.setFormValue(selectedVehicle);
            console.log('selectedVehicle', selectedVehicle) 
            
          }
          
        })
        

        
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
  
      setFormValue(vehicleValue : Temp) {
        
        // const vehicleModel = this.leadStoreService.getVehicleDetails() || {};
        console.log('vehicle model', vehicleValue)
        if (!vehicleValue){return}
        else{
          console.log('elseVehiclevalue',vehicleValue)
          this.vehicleForm.patchValue({
            vehicleType: vehicleValue.vehicleType || '',
            region: vehicleValue.region || '',
            registrationNumber: vehicleValue.registrationNumber || '',
            assetMake: vehicleValue.assetMake.key || '',
            assetModel: vehicleValue.assetModel.key || '',
            assetBodyType: vehicleValue.assetBodyType || '',
            assetVariant: vehicleValue.assetVariant.key || '',
            assetSubVariant: vehicleValue.assetSubVariant || '',
            monthManufacturing: vehicleValue.monthManufacturing || '',
            yrManufacturing: vehicleValue.yrManufacturing || '',
            ageOfAsset: vehicleValue.vehicleType || '',
            vechicalUsage: vehicleValue.vechicalUsage || '',
            vehicleCategory: vehicleValue.vehicleCategory || '',
            orpFunding: vehicleValue.orpFunding || '',
            oneTimeTax: vehicleValue.oneTimeTax || '',
            pac: vehicleValue.pac || '',
            vas: vehicleValue.vas || '',
            emiProtect: vehicleValue.emiProtect || '',
            fastTag: vehicleValue.fastTag || '',
            others: vehicleValue.others || '',
            discount: vehicleValue.discount || '',
            finalAssetCost: vehicleValue.finalAssetCost || '',
            idv: vehicleValue.idv || '',
            insuranceValidity: vehicleValue.insuranceValidity || '',
            insuranceCopy: vehicleValue.insuranceCopy || '',
            permitType: vehicleValue.permitType || '',
            expiryDate: vehicleValue.expiryDate || '',
            permitCopy: vehicleValue.permitCopy || '',
            permitOthers: vehicleValue.permitOthers || '',
            frsdRequired: vehicleValue.frsdRequired || '',
            frsdAmount: vehicleValue.vehicleType || '',
            fitnessDate: vehicleValue.fitnessDate || '',
            fitnessCopy: vehicleValue.permitCopy || '',
            noOfVehicle: vehicleValue.noOfVehicle || '',
          });

          console.log('assetModel',vehicleValue.assetModel)
          // this.vehicleLov.assetModel.forEach(element=>{
            
          //   if(vehicleValue.assetModel===element.value){
          //     console.log('hello')
          //     this.vehicleForm.controls["assetModel"].setValue(element.key)
          //   }
          // })
          
        }
        
      }
  
      onFormSubmit() {

        const formModel = this.vehicleForm.value;
        // console.log('formModel',formModel)
        const vehicleModel = {...formModel};
        this.isAlert= true
        if(this.selectedVehicle !==undefined){
          this.leadStoreService.updateVehicle(this.selectedVehicle, vehicleModel)
          return;
        }
        // console.log('vehicleModel',vehicleModel)
        this.leadStoreService.setVehicleDetails(vehicleModel);
        
         this.router.navigateByUrl['/pages/lead-section/vehicle-details']
        
      }

      
      

      onCheck(){
        this.formVehicle= this.vehicleForm.value;
        console.log('onCheck', this.formVehicle);
        this.vehicleForm.controls["assetMake"].setValue(this.formVehicle.assetMake)
        this.vehicleForm.controls["assetModel"].setValue(this.formVehicle.assetModel)
        this.vehicleForm.controls["assetVariant"].setValue(this.formVehicle.assetVariant)
        this.vehicleForm.controls["assetSubVariant"].setValue(this.formVehicle.assetSubVariant)
        this.vehicleForm.controls["assetBodyType"].setValue(this.formVehicle.assetBodyType)
        this.vehicleForm.controls["vehicleType"].setValue(this.formVehicle.vehicleType)
        this.vehicleForm.controls["region"].setValue(this.formVehicle.region)
        this.vehicleForm.controls["vechicalUsage"].setValue(this.formVehicle.vechicalUsage)
        this.vehicleForm.controls["finalAssetCost"].setValue(this.formVehicle.finalAssetCost);
        this.vehicleForm.controls["noOfVehicle"].setValue(this.formVehicle.noOfVehicle)
        this.vehicleForm.controls["yearAndMonthManufacturing"].setValue(this.formVehicle.yearAndMonthManufacturing)
            
      }

      // getcategory(category, value,formcontrolName){
      //   category.forEach(element=>{
      //     if(parseInt(value) == element.key){
      //       console.log('hello')
      //       this.vehicleForm.controls[formcontrolName].setValue(element.key)
      //     }
      //    });
      // }

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

    export interface Temp{
      vehicleType? : string
      region?:string 
      registrationNumber ?:string 
      assetMake?:{key?: string,
                 value?: string}
      assetModel?:{key?: string,
                  value?: string}
      assetBodyType?:string 
      assetVariant?:{key?: string,
                    value?: string}
      assetSubVariant?:string 
      monthManufacturing?:string 
      yrManufacturing?:string 
      yearAndMonthManufacturing ?:string 
      ageOfAsset?:string 
      vechicalUsage?:string 
      vehicleCategory ?:string 
      orpFunding ?:string 
      oneTimeTax ?:string 
      pac ?:string 
      vas?:string 
      emiProtect ?:string 
      fastTag ?:string 
      others?:string 
      discount?:string 
      finalAssetCost?:string 
      idv?:string 
      insuranceValidity?:string 
      insuranceCopy?:string 
      permitType?:string 
      expiryDate ?:string 
      permitCopy?:string 
      permitOthers?:string 
      frsdRequired?:string 
      frsdAmount?:string 
      fitnessDate ?:string 
      fitnessCopy?:string 
      noOfVehicle ?:string 
    }