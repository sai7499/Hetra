import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '../../../services/commom-lov-service';

@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})
export class SharedBasicVehicleDetailsComponent implements OnInit {

  public basicVehicleForm: FormGroup;
  roleId: any;
  roleName: any;
  roles: any = [];
  public label: any = {};
  LOV: any = [];

  public select_main_button_value: string = 'New CV';

  constructor(
    private _fb: FormBuilder,
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private commonLovService: CommomLovService
  ) { }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    // console.log('roleUser', this.roles[0].name)
    this.roleId = this.loginStoreService.getRoleId();
    this.roleName = this.loginStoreService.getRoleName();


    this.initForms();

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
        // console.log("labesl", this.label)
      },
        error => {
          console.log('error')
        });

    this.getLOV();

  }

  initForms() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.clear();
    console.log("inintForms rolename => ", this.roleName)
    this.roleName === 'Sales Officer' ? this.addSalesFormControls() : this.addCreditFormControls();
  }

  getLOV() {

    // console.log("in getLOV")
    this.commonLovService.getLovData().subscribe(lov => this.LOV = lov);
    console.log('vehicle lov data ---', this.LOV);

  }

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
    const controls = new FormGroup({
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
