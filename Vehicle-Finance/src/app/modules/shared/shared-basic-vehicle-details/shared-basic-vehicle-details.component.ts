import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleDetailService } from '../../lead-section/services/vehicle-detail.service';

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

  constructor(private _fb: FormBuilder, private loginStoreService: LoginStoreService, private labelsData: LabelsService, private commonLovService: CommomLovService,
    private vehicleDetailService: VehicleDetailService) { }

  ngOnInit() {
    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;

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
    this.getLov();
    this.roleName === 'Sales Officer' ? this.addSalesFormControls() : this.addCreditFormControls();
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {

      this.LOV = value.LOVS;

      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vechicalUsage = value.LOVS.vehicleUsage;
      this.vehicleLov.vehicleType = value.LOVS.vehicleType;
      this.vehicleLov.vehicleCategory = value.LOVS.vehicleCategory;
      console.log(this.vehicleLov)
    });
  }

  onVehicleRegionSales(value: any) {
    console.log(value, 'region')
    const region = value ? value : '';
    this.vehicleDetailService.getVehicleMasterFromRegion(region).subscribe((data: any) => {
      console.log(data, 'data')
    })
  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleType: ['LCVVEHTYP'],
      region: ['APASTRGN'],
      registrationNumber: [''],
      assetMake: [''],
      assetModel: [''],
      assetBodyType: [''],
      assetVariant: [''],
      assetSubVariant: [''],
      monthManufacturing: [''],
      yrManufacturing: [''],
      yearAndMonthManufacturing: [''],
      ageOfAsset: [''],
      vechicalUsage: ['PVEHUSG'],
      vehicleCategory: ['CATAVEHCAT'],
      orpFunding: [''],
      oneTimeTax: [''],
      pac: [''],
      vas: [''],
      emiProtect: [''],
      fastTag: [''],
      others: [''],
      discount: [''],
      finalAssetCost: [''],
      idv: [''],
      insuranceValidity: [''],
      insuranceCopy: [''],
      permitType: [''],
      expiryDate: [''],
      permitCopy: [''],
      permitOthers: [''],
      frsdRequired: [''],
      frsdAmount: [''],
      fitnessDate: [''],
      fitnessCopy: [''],
      noOfVehicle: ['']
    });
    formArray.push(controls);
    this.onVehicleRegionSales('APASTRGN')
  }

  addCreditFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      creditFormArray: this._fb.array([])
    })
    formArray.push(controls);
    this.addNewCVFormControls();
  }

  select_main_button(event) {
    this.select_main_button_value = event.target.value;
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);
    creditFormArray.clear();
    this.select_main_button_value === 'New CV' ? this.addNewCVFormControls() : this.select_main_button_value === 'New Car' ? this.addNewcarFormControls() :
      this.select_main_button_value === 'Used CV' ? this.addUserCVFormControls() : this.addUserCarFormControls();
  }

  addNewCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      assetMake: ['1', Validators.required],
      assetModel: ['1', Validators.required],
      assetVariant: ['1', Validators.required],
      assetSubVariant: ['1', Validators.required],
      assetOther: ['', Validators.required],
      assetBodyType: ['1', Validators.required],
      vehicleType: ['LCVVEHTYP', Validators.required],
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
      discount: ['']
    });
    creditFormArray.push(controls);
  }

  addNewcarFormControls() {

    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      assetMake: ['1', Validators.required],
      assetModel: ['1', Validators.required],
      assetVariant: ['1', Validators.required],
      assetSubVariant: ['1', Validators.required],
      assetOther: ['', Validators.required],
      vehicleType: ['LCVVEHTYP', Validators.required],
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
      discount: ['']
    })
    creditFormArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      registartionNumber: ['', Validators.required],
      assetMake: ['1', Validators.required],
      assetModel: ['1', Validators.required],
      assetVariant: ['1', Validators.required],
      assetSubVariant: ['1', Validators.required],
      assetOther: ['', Validators.required],
      assetBodyType: ['1', Validators.required],
      vehicleType: ['LCVVEHTYP', Validators.required],
      vechicalRegion: ['APASTRGN', Validators.required],
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
      frsdAmount: ['']
    })
    creditFormArray.push(controls);
  }

  addUserCarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      registartionNumber: ['', Validators.required],
      assetMake: ['1', Validators.required],
      assetModel: ['1', Validators.required],
      assetVariant: ['1', Validators.required],
      assetSubVariant: ['1', Validators.required],
      assetOther: ['', Validators.required],
      vechicalUsage: ['PVEHUSG', Validators.required],
      vehicleCategory: ['CATAVEHCAT', Validators.required],
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
      frsdAmount: ['']
    })
    creditFormArray.push(controls);
  }

}
