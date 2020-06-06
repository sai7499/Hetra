import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { VehicleDataStoreService } from '../../../services/vehicle-data-store.service';
import { ArrayType } from '@angular/compiler';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';

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
  public remainingArray = [];

  // LovData
  public assetMake: any = [];
  public vehicleType: any = [];
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetVarient: any = [];
  public userId: number;
  public leadId: number;

  constructor(
    private _fb: FormBuilder,
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private vehicleDetailService: VehicleDetailService,
    private vehicleDataService: VehicleDataStoreService,
    private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService) { }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;

    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId']

    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.initForms();
    this.getLov();
    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      }, error => {
        console.log('error', error)
      });
    console.log(this.id, 'oidg')
    if (this.id) {
      this.setFormValue();
    }

  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      formArray.controls[0].patchValue({
        ageOfAsset: Number(this.utilityService.ageFromAsset(event.date))
      })
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  initForms() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.clear();
    this.roleName === 'Sales Officer' ? this.addSalesFormControls() : this.addCreditFormControls();
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log(value.Lovs)
      this.LOV = value.LOVS;
      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vechicalUsage = value.LOVS.vehicleUsage;
      this.vehicleLov.vehicleType = value.LOVS.vehicleType;
      this.vehicleLov.vehicleCategory = value.LOVS.vehicleCategory;
      this.vehicleLov.YesORNoValue = [
        {
          key: "1",
          value: "Yes"
        },
        {
          key: "0",
          value: "NO"
        }
      ]
    });
  }

  setFormValue() {

    this.vehicleDetailService.getAnVehicleDetails(this.id).subscribe((res: any) => {
      let VehicleDetail = res.ProcessVariables ? res.ProcessVariables : {};

      this.vehicleLov.assetMake = [{
        key: VehicleDetail.vehicleMfrUniqueCode,
        value: VehicleDetail.vehicleMfrCode
      }]

      this.vehicleLov.assetBodyType = [{
        key: VehicleDetail.vehicleSegmentUniqueCode,
        value: VehicleDetail.vehicleSegmentCode
      }]

      this.vehicleLov.assetModel = [
        {
          key: VehicleDetail.vehicleModelCode,
          value: VehicleDetail.vehicleModel
        }
      ]

      this.vehicleLov.assetVariant = [{
        key: 0,
        value: VehicleDetail.assetVarient
      }]

      if (this.roleName === 'Sales Officer') {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        this.onPatchArrayValue(formArray, VehicleDetail, this.leadId)
      } else if (this.roleName === 'Credit Officer') {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

        console.log(creditFormArray, 'CreditFormArray')
        this.onPatchArrayValue(creditFormArray, VehicleDetail, this.id)
      }

      this.vehicleDataService.setIndividualVehicleDetails(VehicleDetail);
    })

  }

  onPatchArrayValue(formArray, VehicleDetail, leadId) {
    formArray.controls[0].patchValue({
      vehicleType: VehicleDetail.vehicleTypeCode || '',
      region: VehicleDetail.region || '',
      registrationNumber: VehicleDetail.registrationNo || '',
      assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
      assetModel: VehicleDetail.vehicleModelCode || '',
      assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
      assetVariant: VehicleDetail.assetVariant,
      assetSubVariant: VehicleDetail.assetVarient,
      monthManufacturing: '',
      yrManufacturing: '',
      manuFacMonthYear: this.utilityService.convertDateTimeTOUTC(VehicleDetail.manuFacMonthYear) || '',
      ageOfAsset: VehicleDetail.ageOfAsset || '',
      vehicleUsage: VehicleDetail.vehicleUsage || '',
      vehicleCategory: '',
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
      insuranceCopy: '',
      permitType: VehicleDetail.typeOfPermit || '',
      expiryDate: '',
      permitCopy: '',
      permitOthers: VehicleDetail.typeOfPermitOthers || '',
      frsdRequired: VehicleDetail.fsrdFundingReq || '',
      frsdAmount: VehicleDetail.fsrdPremiumAmount || '',
      fitnessDate: VehicleDetail.fitnessDate || '',
      fitnessCopy: '',
      noOfVehicles: VehicleDetail.noOfVehicles,
      vehicleId: VehicleDetail.vehicleId || '',
      collateralId: VehicleDetail.collateralId || '',
      leadId: leadId,
      userId: this.userId
    })
  }

  // event emitter for giving output to parent add vehicle component

  formDataOutputMethod(event) {
    this.formDataOutput.emit(this.basicVehicleForm.value.vehicleFormArray)
  }

  onChangeUppercase(event) {
  }
  //  method to get vehicle master data from region 

  onVehicleRegion(value: any) {
    const region = value ? value : '';
    console.log(value)
    let assetMakeArray = [];
    this.vehicleDetailService.getVehicleMasterFromRegion(region).subscribe((data: any) => {
      this.regionDataArray = data.ProcessVariables.vehicleMasterDetails ? data.ProcessVariables.vehicleMasterDetails : [];
      this.assetMake = this.utilityService.getCommonUniqueValue(this.regionDataArray, 'uniqueMFRCode')
      assetMakeArray = this.regionDataArray.length > 0 ? this.utilityService.getValueFromJSON(this.regionDataArray, "uniqueMFRCode", "mfrCode") : []
      this.vehicleLov.assetMake = assetMakeArray;
    }, error => {
      console.log(error, 'error')
    })
  }

  onAssetMake(value) {
    if (value) {
      this.vehicleType = this.regionDataArray.filter(data => data.uniqueMFRCode === value)

      let vehicleTypeArray = this.assetMake.filter(data => data.uniqueMFRCode === value)

      this.vehicleLov.vehicleType = this.utilityService.getValueFromJSON(this.vehicleType,
        "vehicleTypeUniqueCode", "vehicleTypeDescription");
    }
  }

  onVehicleType(value) {

    this.assetBodyType = this.vehicleType.filter((data) => data.vehicleTypeUniqueCode === value)

    this.vehicleLov.assetBodyType = this.utilityService.getValueFromJSON(this.assetBodyType,
      "uniqueSegmentCode", "segmentCode");
  }

  onAssetBodyType(value) {
    this.assetModelType = this.assetBodyType.filter((data) => data.uniqueSegmentCode === value)
    this.vehicleLov.assetModel = this.utilityService.getValueFromJSON(this.assetModelType,
      "vehicleModelCode", "vehicleModel")
  }

  onAssetModel(value) {
    this.assetVarient = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    const array = this.utilityService.getCommonUniqueValue(this.assetVarient, 'vehicleVariant')
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.controls[0].patchValue({
      vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
    })
    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVarient,
      0, "vehicleVariant")
  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleType: '',
      region: '',
      registrationNumber: '',
      assetMake: '',
      assetModel: '',
      assetBodyType: '',
      assetVariant: '',
      assetSubVariant: '',
      monthManufacturing: '',
      yrManufacturing: '',
      manuFacMonthYear: '',
      ageOfAsset: '',
      vehicleUsage: '',
      vehicleCategory: '',
      orpFunding: '',
      oneTimeTax: '',
      pac: '',
      vas: '',
      emiProtect: '',
      fastTag: '',
      others: '',
      discount: '',
      finalAssetCost: '',
      idv: '',
      insuranceValidity: '',
      insuranceCopy: '',
      permitType: '',
      expiryDate: '',
      permitCopy: '',
      permitOthers: '',
      frsdRequired: '',
      frsdAmount: '',
      fitnessDate: '',
      fitnessCopy: '',
      noOfVehicles: '',
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    });
    formArray.push(controls);
    // this.onVehicleRegion('APASTRGN')
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
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: '',
      vehicleType: ['LCVVEHTYP'],
      exShowroomCost: '',
      finalAssetCost: '',
      dealerSubventionApplicable: ['1'],
      dealerSubventionAmount: [''],
      dealerSubventionIRR: [''],
      dealerSubventionFinance: [''],
      manufacturerSubventionApplicable: ['1'],
      manufacturerSubventionAmount: [''],
      manufacturerSubventionIRR: [''],
      manufacturerSubventionFinance: [''],
      proformaInvoiceNo: [''],
      proformaInvoiceDate: [''],
      proformaInvoiceAmount: [''],
      orpFunding: ['1'],
      insurance: [''],
      oneTimeTax: [''],
      pac: ['1'],
      vas: ['1'],
      emiProtect: ['1'],
      fastTag: ['1'],
      others: [''],
      discount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    });
    creditFormArray.push(controls);
  }

  addNewcarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      vehicleType: ['LCVVEHTYP'],
      exShowroomCost: '',
      finalAssetCost: '',
      dealerSubventionApplicable: ['1'],
      dealerSubventionAmount: [''],
      dealerSubventionIRR: [''],
      dealerSubventionFinance: [''],
      manufacturerSubventionApplicable: ['1'],
      manufacturerSubventionAmount: [''],
      manufacturerSubventionIRR: [''],
      manufacturerSubventionFinance: [''],
      proformaInvoiceNo: [''],
      proformaInvoiceDate: [''],
      proformaInvoiceAmount: [''],
      orpFunding: ['1'],
      insurance: [''],
      oneTimeTax: [''],
      pac: ['1'],
      vas: ['1'],
      emiProtect: ['1'],
      fastTag: ['1'],
      others: [''],
      discount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    console.log(creditFormArray, 'dgsdj')

    const controls = this._fb.group({
      registartionNumber: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: '',
      vehicleType: ['LCVVEHTYP', Validators.required],
      region: [''],
      monthYear: '',
      ageVehicle: '',
      exShowroomCost: '',
      fitnessDate: '',
      permitType: '',
      permitOther: [''],
      permitExpireDate: '',
      permitUpload: [''],
      chassisNumber: [''],
      engineNumber: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnership: [''],
      rcOwnerName: [''],
      vehicleRegistrationDate: '',
      reRegisteredVehicle: ['1'],
      interStateVehicle: ['1'],
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      insuranceValidity: '',
      idv: '',
      insuranceCopy: [''],
      frsdRequired: '',
      frsdAmount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

  addUserCarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      registartionNumber: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      vechicalUsage: ['PVEHUSG'],
      vehicleCategory: ['CATAVEHCAT'],
      monthYear: '',
      ageVehicle: '',
      assetCostIndian: '',
      assetCostCar: '',
      assetCostLeast: '',
      exShowroomCost: '',
      chassisNumber: [''],
      engineNumber: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnership: [''],
      rcOwnerName: [''],
      vehicleRegistrationDate: '',
      grossVehicleWeight: [''],
      reRegisteredVehicle: ['1'],
      interStateVehicle: ['1'],
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      insuranceValidity: '',
      idv: '',
      insuranceCopy: [''],
      frsdRequired: '',
      frsdAmount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

}
