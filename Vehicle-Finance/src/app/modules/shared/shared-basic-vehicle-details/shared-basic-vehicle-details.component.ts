import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { VehicleDataStoreService } from '../../../services/vehicle-data-store.service';
import { LovDataService } from '@services/lov-data.service';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})

export class SharedBasicVehicleDetailsComponent implements OnInit {

  @Input() id: any;

  @Output() formDataOutput = new EventEmitter<ArrayType>();

  public basicVehicleForm: FormGroup;
  public vehicleLov: any = {};
  roleId: any;
  roleName: any;
  roleType: any;
  roles: any = [];
  LOV: any = [];
  public label: any = {};
  public select_main_button_value: string = 'New CV';
  public vehicleFormData: any = [];
  mockLov: any = {};
  regionDataArray = [];
  public vehicleRegionLov: any = {};

  constructor(
    private _fb: FormBuilder,
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private vehicleDetailService: VehicleDetailService,
    private vehicleDataService: VehicleDataStoreService,
    private lovDataService: LovDataService) { }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;

    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    if (this.id) {
      this.setFormValue();
    }

    this.initForms();
    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      }, error => {
        console.log('error', error)
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
    });
  }

  setFormValue() {

    this.vehicleDetailService.getAnVehicleDetails(this.id).subscribe((res: any) => {
      const VehicleDetail = res.ProcessVariables ? res.ProcessVariables : {};
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      formArray.controls[0].patchValue({
        vehicleType: VehicleDetail.vehicleTypeCode || '',
        region: VehicleDetail.region || '',
        registrationNumber: VehicleDetail.registrationNo || '',
        assetMake: VehicleDetail.vehicleMfrCode || '',
        assetModel: VehicleDetail.vehicleModelCode || '',
        assetBodyType: VehicleDetail.assetBodyType || '',
        assetVariant: [''],
        assetSubVariant: [''],
        monthManufacturing: [''],
        yrManufacturing: [''],
        yearAndMonthManufacturing: VehicleDetail.manuFacMonthYear || '',
        ageOfAsset: VehicleDetail.ageOfAsset || '',
        vechicleUsage: VehicleDetail.vehicleUsage || '',
        vehicleCategory: [''],
        orpFunding: VehicleDetail.isOrpFunding || '',
        oneTimeTax: VehicleDetail.oneTimeTax || '',
        pac: VehicleDetail.pac || '',
        vas: VehicleDetail.vas || '',
        emiProtect: VehicleDetail.emiProtect || '',
        fastTag: VehicleDetail.fastTag || '',
        others: VehicleDetail.others || '',
        discount: VehicleDetail.discount || '',
        finalAssetCost: VehicleDetail.finalAssetCost || '',
        idv: VehicleDetail.idv || '',
        insuranceValidity: VehicleDetail.insuranceValidity || '',
        insuranceCopy: [''],
        permitType: VehicleDetail.typeOfPermit || '',
        expiryDate: [''],
        permitCopy: [''],
        permitOthers: VehicleDetail.typeOfPermitOthers || '',
        frsdRequired: VehicleDetail.fsrdFundingReq || '',
        frsdAmount: VehicleDetail.fsrdPremiumAmount || '',
        fitnessDate: VehicleDetail.fitnessDate || '',
        fitnessCopy: [''],
        noOfVehicles: [''],
        vehicleId: VehicleDetail.vehicleId || '',
        vehicleCode: VehicleDetail.vehicleCode || '',
      })
      this.onVehicleRegionSales(VehicleDetail.region)
      this.vehicleDataService.setIndividualVehicleDetails(VehicleDetail);
    })

  }

  // event emitter for giving output to parent add vehicle component

  formDataOutputMethod(value) {
    this.formDataOutput.emit(this.basicVehicleForm.value.vehicleFormArray)
  }

  //  method to get vehicle master data from region 

  onVehicleRegionSales(value: any) {
    const region = value ? value : '';
    const assetMakeArray = [];
    this.vehicleDetailService.getVehicleMasterFromRegion(region).subscribe((data: any) => {
      this.regionDataArray = data.ProcessVariables.vehicleMasterDetails ? data.ProcessVariables.vehicleMasterDetails : [];

      if (this.regionDataArray.length > 0) {
        this.regionDataArray.map((data, i) => {
          assetMakeArray.push({
            key: i,
            value: data['mfrCode']
          })
        })
      }
      this.vehicleLov.assetMake = assetMakeArray;
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      formArray.controls[0].patchValue({
        assetMake: '',
      })
    })
    this.onChangeSalesAssetMake(0)
  }

  onChangeSalesAssetMake(value) {
    const vehiclTypeArray = [];
    if (value) {
      const assetMake = this.vehicleLov.assetMake[value];

      this.regionDataArray.filter((data, i) => {

        if (assetMake.value === data.mfrCode) {
          vehiclTypeArray.push({
            key: i,
            value: data['vehicleTypeUniqueCode']
          })
        }
        this.vehicleLov.vehicleType = vehiclTypeArray;
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        formArray.controls[0].patchValue({
          vehicleType: '',
        })
      })
    }
  }

  onChangeSalesVehicleType(value) {
    const assetBodyArray = [];
    if (value) {
      const vehicleType = this.vehicleLov.vehicleType[value];
      this.regionDataArray.filter((data, i) => {

        if (vehicleType.value === data.vehicleTypeUniqueCode) {
          assetBodyArray.push({
            key: i,
            value: data['uniqueSegmentCode']
          })
        }
        this.vehicleLov.assetBodyType = assetBodyArray;
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        formArray.controls[0].patchValue({
          assetBodyType: '',
        })
      })
    }
  }

  onChangeSalesAssetBodyType(value) {
    const assetModelArray = [];
    if (value) {
      const assetModelBodyType = this.vehicleLov.assetBodyType[value];
      this.regionDataArray.filter((data, i) => {
        if (assetModelBodyType.value === data.uniqueSegmentCode) {
          assetModelArray.push({
            key: i,
            value: data['vehicleModelCode']
          })
        }
        this.vehicleLov.assetModel = assetModelArray;
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        formArray.controls[0].patchValue({
          assetModel: '',
          assetVariant: '',
          assetSubVariant: ''
        })
      })
    }
  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleType: [''],
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
      vechicleUsage: [''],
      vehicleCategory: [''],
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
      noOfVehicles: [''],
      vehicleId: 0,
      vehicleCode: 0,
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
