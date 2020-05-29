import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
// services start here
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { VehicleDetailService } from '../../lead-section/services/vehicle-detail.service';
import { LovDataService } from '@services/lov-data.service';
import { LeadStoreService } from '@services/lead-store.service';
// services ended here


@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})
export class SharedBasicVehicleDetailsComponent implements OnInit {

  public basicVehicleForm: FormGroup;
  public vehicleLov: any = {};

  roleId: any;
  roleName: any;
  roles: any = [];
  LOV: any = [];
  public label: any = {};
  public select_main_button_value: string = 'New CV';
  leadId: number;
  private vehicleDetails: any = [];
  mockLov: any = {};
  //  declared mockLov for storing mock lov values from lov service regarding asset make and .....

  constructor(
    private _fb: FormBuilder,
    private loginStoreService: LoginStoreService,
    private leadStoreService: LeadStoreService,
    private lovDataService: LovDataService,
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private vehicleDetailsService: VehicleDetailService, ) { }


  ngOnInit() {
    // this.getLeadId();
    this.getLov();
    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    console.log("userRole", this.roles[0].name)
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.initForms();

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          console.log('error')
        });

  }

  initForms() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.clear();
    this.roleName === 'Sales Officer' ? this.addSalesFormControls() : this.addCreditFormControls();
  }


  // => method for getting lead id from leadstore service for unique lead id

  // getLeadId() {
  //   this.leadStoreService.getLeadCreation().subscribe((value: any) => {
  //     console.log('response from getLeadCreation', value)

  //     // console.log("leadID" , this.leadId)
  //     // this.leadId
  //   });
  // }


  // => method for getting vehicle related lovs from common lov service

  getLov() {

    this.commonLovService.getLovData().subscribe((value: any) => {

      this.LOV = value.LOVS;

      // console.log("all lovs data", this.LOV)

      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vechicleUsage = value.LOVS.vehicleUsage;
      this.vehicleLov.vehicleType = value.LOVS.vehicleType;


      console.log('vehicle lov  => ', this.vehicleLov)

    });



    //  mock method for getting lovs for assetMake and so on ....

    this.lovDataService.getLovData().subscribe((value: any) => {

      this.mockLov = value ? value[0].vehicleDetails[0] : {};
      // console.log('vehicleLov', this.mockLov);
      this.vehicleLov.assetMake = value[0].vehicleDetails[0].assetMake;
      this.vehicleLov.assetModel = value[0].vehicleDetails[0].assetModel
      // this.vehicleLov.vehicleType = value[0].vehicleDetails[0].vehicleType
      this.vehicleLov.assetBodyType = value[0].vehicleDetails[0].assetBodyType
      // this.vehicleLov.region = value[0].vehicleDetails[0].region
      this.vehicleLov.assetVariant = value[0].vehicleDetails[0].assetVariant
      this.vehicleLov.assetSubVariant = value[0].vehicleDetails[0].assetSubVariant
      // this.vehicleLov.vechicalUsage = value[0].vehicleDetails[0].vechicalUsage



    });
    // <= mock method ends =>

  }

  // common lov method from api ends..........


  // save/update vehicle collaterals api starts here

  // saveVehicleCollaterals() {

  //   this.vehicleDetailsService.saveOrUpdateVehcicleDetails(this.vehicleDetails).subscribe((res: any) => {

  //     console.log("response from saveUpdateVehicleCollaterals", res);


  //   });
  // }




  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = new FormGroup({
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
      noOfVehicle: new FormControl('')
    });
    formArray.push(controls);
  }

  addCreditFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleTypearray: this._fb.array([])
    })
    formArray.push(controls);
  }

  select_main_button(event) {

    const value = event.target.value;
    this.select_main_button_value = value;

    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const creditFormArray = (formArray.get('vehicleTypearray') as FormArray)

    console.log(formArray['controls'])
    console.log(creditFormArray, 'credit')
    // formArray.clear();
    // this.select_main_button_value ? this.addIndividualFormControls() : this.addNonIndividualFormControls();
  }

}
