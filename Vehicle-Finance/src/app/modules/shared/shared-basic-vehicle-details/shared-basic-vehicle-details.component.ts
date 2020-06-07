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
import { ActivatedRoute } from '@angular/router';

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
  public assetVariant: any = [];
  public userId: number;
  public leadId: number;
  routerId: number;

  constructor(
    private _fb: FormBuilder,
    private loginStoreService: LoginStoreService,
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private vehicleDetailService: VehicleDetailService,
    private vehicleDataService: VehicleDataStoreService,
    private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;

    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId'];

    let leadId = (await this.getLeadId()) as number;

    this.routerId = this.id ? this.id : leadId;

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
    if (this.id) {
      this.setFormValue();
    }

  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        const leadId = value.leadId;
        if (leadId) {
          resolve(Number(leadId));
        }
        resolve(null);
      });
    });
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
        this.onPatchArrayValue(creditFormArray, VehicleDetail, this.routerId)
      }

      this.vehicleDataService.setIndividualVehicleDetails(VehicleDetail);
    })

  }

  onPatchArrayValue(formArray, VehicleDetail, leadId) {
    formArray.controls[0].patchValue({
      dealerSubventionPartIRR: VehicleDetail.DealerSubventionPartIRR || '',
      ageOfAsset: VehicleDetail.ageOfAsset,
      assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
      assetCost: VehicleDetail.assetCost || null,
      assetCostCarTrade: VehicleDetail.assetCostCarTrade,
      assetCostIBB: VehicleDetail.assetCostIBB,
      assetCostLeast: VehicleDetail.assetCostLeast,
      assetCostRef: VehicleDetail.assetCostLeast || null,
      assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
      assetModel: VehicleDetail.vehicleModelCode || '',
      assetVariant: VehicleDetail.assetVarient === 'Petrol' ? 0 : '',
      category: VehicleDetail.category || '',
      chasisNumber: VehicleDetail.chasisNumber || null,
      collateralId: VehicleDetail.collateralId || null,
      collateralType: VehicleDetail.collateralType || null,
      cubicCapacity: VehicleDetail.cubicCapacity || '',
      dealerSubventionAmount: VehicleDetail.dealerSubventionAmount || null,
      dealerSubventionPartFinCharge: VehicleDetail.dealerSubventionPartFinCharge || '',
      dealerSuventionApproval: VehicleDetail.dealerSuventionApproval || '',
      depositAccountNumber: null,
      discount: VehicleDetail.discount || '',
      duplicateRc: VehicleDetail.duplicateRc || '',
      emiProtect: VehicleDetail.emiProtect || '',
      emiProtectAmount: null,
      engineNumber: VehicleDetail.engineNumber || null,
      exShowRoomCost: VehicleDetail.exShowRoomCost || '',
      fastTag: VehicleDetail.exShowRoomCost || '',
      fastTagAmount: null,
      finalAssetCost: VehicleDetail.finalAssetCost || '',
      fitnessDate: VehicleDetail.fitnessDate || '',
      fsrdFundingReq: VehicleDetail.fsrdFundingReq || '',
      fsrdPremiumAmount: VehicleDetail.fsrdPremiumAmount || null,
      gorssVehicleWeight: VehicleDetail.gorssVehicleWeight || '',
      idv: VehicleDetail.idv || null,
      insurance: VehicleDetail.insurance || null,
      insuranceValidity: VehicleDetail.insuranceValidity || null,
      interStateVehicle: VehicleDetail.interStateVehicle || null,
      inusrancePolicyNumber: VehicleDetail.inusrancePolicyNumber || null,
      invoiceAmount: VehicleDetail.invoiceAmount || '',
      invoiceDate: VehicleDetail.invoiceDate || '',
      invoiceNumber: VehicleDetail.invoiceNumber || '',
      isOrpFunding: VehicleDetail.isOrpFunding || '',
      leadId: Number(VehicleDetail.leadId),
      lmsCollateralId: null,
      manuFacMonthYear: VehicleDetail.fitnessDate || '',
      manuFactureSubventionPartIRR: VehicleDetail.manuFactureSubventionPartIRR || '',
      manuFatureSubventionPartFinCharge: VehicleDetail.manuFatureSubventionPartFinCharge || '',
      manufacSubventionApplicable: VehicleDetail.manufacSubventionApplicable || '',
      manufactureSubventionAmount: VehicleDetail.manufactureSubventionAmount || '',
      noOfUnits: null,
      noOfVehicles: VehicleDetail.noOfVehicles || '',
      oneTimeTax: VehicleDetail.oneTimeTax || '',
      orpValue: null,
      others: VehicleDetail.others || '',
      pac: VehicleDetail.pac || '',
      pacAmount: null,
      permitExpiryDate: null,
      processtionType: null,
      productCatCode: "UCV",
      rcOwnerName: VehicleDetail.rcOwnerName || '',
      reRegVehicle: VehicleDetail.reRegVehicle || '',
      regMonthYear: null,
      region: VehicleDetail.region || '',
      registrationNo: VehicleDetail.registrationNo || '',
      seatingCapacity: VehicleDetail.seatingCapacity || '',
      subventionType: null,
      tonnage: null,
      typeOfPermit: VehicleDetail.typeOfPermit || '',
      typeOfPermitOthers: VehicleDetail.typeOfPermitOthers || '',
      usage: null,
      vas: VehicleDetail.vas || null,
      vasAmount: null,
      vehicleId: VehicleDetail.vehicleId || null,
      vehicleOwnerShipNumber: VehicleDetail.vehicleOwnerShipNumber || null,
      vehiclePurchasedCost: VehicleDetail.vehiclePurchasedCost || null,
      vehicleRegDate: VehicleDetail.vehicleRegDate || null,
      vehicleRegNo: null,
      vehicleType: VehicleDetail.vehicleTypeCode || '',
      vehicleUsage: VehicleDetail.vehicleUsage
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
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    const array = this.utilityService.getCommonUniqueValue(this.assetVariant, 'vehicleVariant')
    if (this.roleName === 'Sales Officer') {
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      formArray.controls[0].patchValue({
        vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
      })
    } else {
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);
      console.log('CreditFormArray', creditFormArray.controls[0])
      creditFormArray.controls[0].patchValue({
        vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
      })
    }

    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      0, "vehicleVariant")
  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleType: '',
      region: '',
      registrationNo: '',
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
      category: '',
      isOrpFunding: '',
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
      typeOfPermit: '',
      expiryDate: '',
      permitCopy: '',
      permitOthers: '',
      fsrdFundingReq: '',
      fsrdPremiumAmount: '',
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
      region: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: '',
      vehicleType: ['LCVVEHTYP'],
      exShowroomCost: null,
      finalAssetCost: '',
      dealerSuventionApproval: ['1'],
      dealerSubventionAmount: [''],
      dealerSubventionPartIRR: [''],
      dealerSubventionPartFinCharge: [''],
      manufacSubventionApplicable: ['1'],
      manufactureSubventionAmount: [''],
      manuFactureSubventionPartIRR: [''],
      manuFatureSubventionPartFinCharge: [''],
      invoiceNumber: [''],
      invoiceDate: [''],
      invoiceAmount: [''],
      isOrpFunding: ['1'],
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
      leadId: this.routerId,
      userId: this.userId
    });
    creditFormArray.push(controls);
  }

  addNewcarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      region: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      vehicleType: ['LCVVEHTYP'],
      exShowroomCost: null,
      finalAssetCost: '',
      dealerSuventionApproval: ['1'],
      dealerSubventionAmount: [''],
      dealerSubventionPartIRR: [''],
      dealerSubventionPartFinCharge: [''],
      manufacSubventionApplicable: ['1'],
      manufactureSubventionAmount: [''],
      manuFactureSubventionPartIRR: [''],
      manuFatureSubventionPartFinCharge: [''],
      invoiceNumber: [''],
      invoiceDate: [''],
      invoiceAmount: [''],
      isOrpFunding: ['1'],
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
      leadId: this.routerId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      registrationNo: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: '',
      vehicleType: ['LCVVEHTYP', Validators.required],
      region: [''],
      manuFacMonthYear: '',
      ageOfAsset: '',
      exShowroomCost: null,
      fitnessDate: '',
      typeOfPermit: '',
      typeOfPermitOthers: [''],
      permitExpireDate: '',
      permitUpload: [''],
      chasisNumber: [''],
      engineNumber: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnerShipNumber: [''],
      rcOwnerName: [''],
      vehicleRegDate: '',
      reRegVehicle: ['1'],
      interStateVehicle: ['1'],
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      insuranceValidity: '',
      idv: '',
      insuranceCopy: [''],
      fsrdFundingReq: '',
      fsrdPremiumAmount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.routerId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

  addUserCarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      region: '',
      registrationNo: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      vehicleUsage: ['PVEHUSG'],
      category: ['CATAVEHCAT'],
      manuFacMonthYear: '',
      ageOfAsset: '',
      assetCostIBB: '',
      assetCostCarTrade: '',
      assetCostLeast: '',
      exShowroomCost: null,
      chasisNumber: [''],
      engineNumber: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnerShipNumber: [''],
      rcOwnerName: [''],
      vehicleRegDate: '',
      gorssVehicleWeight: [''],
      reRegVehicle: ['1'],
      interStateVehicle: ['1'],
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      insuranceValidity: '',
      idv: '',
      insuranceCopy: [''],
      fsrdFundingReq: '',
      fsrdPremiumAmount: [''],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.routerId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

}
