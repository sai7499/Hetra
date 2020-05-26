import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';


@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})
export class SharedBasicVehicleDetailsComponent implements OnInit {

  public basicVehicleForm: FormGroup;
  roleId: any;
  roleName: any;
  public label: any = {};

  public select_main_button_value: string = 'New CV';

  constructor(private _fb: FormBuilder, private loginStoreService: LoginStoreService, private labelsData: LabelsService) { }

  ngOnInit() {
    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

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

  }

  initForms() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.clear();
    this.roleName === 'Sales Officer' ? this.addSalesFormControls() : this.addCreditFormControls();
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
    // this.select_main_button_value = value === 'individual';
    // const formArray = (this.basicForm.get('details') as FormArray);
    // formArray.clear();
    // this.select_main_button_value ? this.addIndividualFormControls() : this.addNonIndividualFormControls();
  }

}
