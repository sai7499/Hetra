import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleDataStoreService } from '../../../services/vehicle-data-store.service';
import { LeadDataResolverService } from '../services/leadDataResolver.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent implements OnInit {

  vehicleForm: FormGroup;
  private vehicleDetails: any = [];
  public vehicleLov: any = {};
  public label: any = {};
  public errorMsg;
  public getAllFieldLabel;
  public show: boolean = false;
  public formVehicle: any;
  public isAlert: boolean = false;
  selectedVehicle: number;
  isHidden: boolean = false;

  vehicleArray = [];
  routerId = 0;

  // process variable for save/update vehicle collaterals

  userId: number;
  vehicleId: number = 101;
  leadId: number;

  LOV: any = [];

  formDataFromChild: any = {};


  constructor(

    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private router: Router,
    private leadData: LeadDataResolverService,
    private activatedRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private vehicleDetailService: VehicleDetailService,
    private loginStoreService: LoginStoreService) { }

  ngOnInit() {


    // method for getting all vehicle details related to a lead
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.leadId = parseInt(this.leadData.leadId);

    this.getVehicleDetails();

    // method for getting labels 

    this.getAllFieldLabel = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
      if (this.routerId !== null && this.routerId !== undefined) {
        this.isHidden = true;
        this.selectedVehicle = Number(this.routerId);
      }

    })

  }

  // parent method to call the child method to access form data

  FormDataParentMethod(value: any) {
    this.formDataFromChild = value;
    this.vehicleDetails = value;
  }

  onFormSubmit() {
    // const formModel = this.vehicleForm.value;
    // const vehicleModel = { ...formModel };
    // this.isAlert = true
    // if (this.routerId !== undefined && this.routerId !== 0) {
    //   this.vehicleDetailService.saveOrUpdateVehcicleDetails(this.vehicleDetails, 121, 100, 1).subscribe((res: any) => {
    //   })
    //   return;
    // }
    // this.leadStoreService.setVehicleDetails(vehicleModel);

    this.saveVehicleCollaterals();

    this.router.navigateByUrl['/pages/lead-section/' + this.leadId + '/vehicle-details']
  }


  onCheck() {
    this.formVehicle = this.vehicleForm.value;
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

  }

  getVehicleDetails() {
    this.vehicleDetailService.getAllVehicleCollateralDetails(this.leadId).subscribe((res: any) => {
      this.vehicleArray = res.ProcessVariables;
    })

  }

  saveVehicleCollaterals() {
    this.vehicleDetailService.saveOrUpdateVehcicleDetails(this.vehicleId, this.userId, this.leadId, this.vehicleDetails).subscribe((res: any) => {
      console.log(res, 'res')
    });
  }

  getcategory(category, value, formcontrolName) {
    category.forEach(element => {
      if (parseInt(value) == element.key) {
        this.vehicleForm.controls[formcontrolName].setValue(element.key)
      }
    });
  }

  ngOnChanges() {

  }

  //To show and hide lov--select "Open" in Vehicle dependency
  onShow(event) {
    if (event.target.value === "1") {
      this.show = true;
    } else {
      this.show = false;
    }
  }

}
