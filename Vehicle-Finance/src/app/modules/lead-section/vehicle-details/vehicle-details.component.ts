import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval} from 'rxjs'
import { map} from 'rxjs/operators'

import { LovDataService } from '@services/lov-data.service';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { VehicleDetailService} from '../services/vehicle-detail.service'

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {

  vehicleForm: FormGroup;

    public vehicleLov: any  = {};
    public label: any = {};
    public errorMsg;
    public getAllFieldLabel;
    public show: boolean = false;
    public vehicleDetails : any;
    public isAlert : boolean = true
    
    public varVehicle=[];
    


    
    constructor(
      private labelsData: LabelsService,
      private lovDataService: LovDataService,
      private router: Router,
      private activateroute : ActivatedRoute,
      private leadStoreService: LeadStoreService,
      private vehicleDetailService : VehicleDetailService ) { }
  
      
    ngOnInit() {
      this.initForm();
      console.log('ngonit', this.vehicleForm.value)
      this.getAllFieldLabel = this.labelsData.getLabelsData()
          .subscribe( data => {
            this.label = data;
            console.log('Vehicle Labels', this.label.save);
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


  // ngOnInit() {
  //   this.initForm();
  //   this.getAllFieldLabel = this.labelsData.getLabelsData()
  //     .subscribe(data => {
  //       this.label = data;
  //     },
  //       error => {
  //         this.errorMsg = error;
  //       });
  //   this.lovDataService.getLovData().subscribe((value: any) => {
  //     this.vehicleLov = value ? value[0].vehicleDetails[0] : {};
  //     console.log('vehicleLov', this.vehicleLov);
  //     this.setFormValue();
  //   });
  // }

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
      emiProtect: new FormControl(''),
      fastTag: new FormControl(''),
      others: new FormControl(''),
      discount: new FormControl(''),
      finalAssetCost: new FormControl('500000', ),
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
      console.log('formmodel', formModel)
      const vehicleModel = {...formModel};
      this.isAlert= false
      setTimeout(() => {
        this.isAlert = true
      },1000);
      // this.isAlert = true
      this.leadStoreService.setVehicleDetails(vehicleModel);
      
    }
    getData(){
      this.vehicleDetails = this.leadStoreService.getVehicleDetails();

       console.log('vehicle',this.vehicleDetails)
      this.getCategory(this.vehicleLov.assetMake, this.vehicleDetails.assetMake, this.varVehicle)
      this.getCategory(this.vehicleLov.assetModel, this.vehicleDetails.assetModel, this.varVehicle)
      this.getCategory(this.vehicleLov.assetVariant, this.vehicleDetails.assetVariant, this.varVehicle)
      
        
    }
    

    getCategory( category, value, varVehicle ){
      category.forEach(element => {
        // console.log(element)
          if(parseInt(value) == element.key){
          varVehicle.push(element.value)
          }
      });
      // console.log('varVehicle',this.varVehicle)
    }
   

  ngOnChanges() { }


    editVehicle() {
      this.router.navigate(['pages/lead-section/add-vehicle']);
      const tableVehicle= this.varVehicle
      console.log('vehicleTable',tableVehicle)
      
    }

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
