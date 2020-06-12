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
import { SharedService } from '../shared-service/shared-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  public product_value: string = 'New Commercial Vehicle';
  public vehicleFormData: any = [];
  mockLov: any = {};
  regionDataArray = [];
  public vehicleRegionLov: any = {};
  public remainingArray = [];

  public productCatoryCode: string;
  public leadDetails: any = {};
  public loanTenor: number = 0;
  public productCatoryId: any;

  // LovData
  public assetMake: any = [];
  public vehicleType: any = [];
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetVariant: any = [];
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
    private createLeadDataService: CreateLeadDataService,
    public sharedService: SharedService,
    private uiLoader: NgxUiLoaderService) { }

  async ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;

    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadDetails = leadData['leadDetails']

    console.log(this.leadDetails, 'Product')

    this.leadId = leadData['leadId'];
    // this.productCatoryCode = this.leadDetails['productCatName'];

    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.sharedService.leadData$.subscribe((value: string) => {
      this.product_value = value;
    })

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
    };

    const data = this.vehicleDataService.getLeadDataforLoan();

    if (data) {
      console.log(data, 'data')
      // this.loanTenor = data.requestedTenor ? data.requestedTenor : data.reqTenure ? data.reqTenure : 0;
      if (data.requestedTenor) {
        this.loanTenor = data.requestedTenor;
      } else if (data.reqTenure) {
        this.loanTenor = data.reqTenure;
      }
    }

    console.log(this.loanTenor, 'data')

  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {

      if (this.roleName === 'Sales Officer') {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        formArray.controls[0].patchValue({
          ageOfAsset: Number(this.utilityService.ageFromAsset(event.date))
        })
        console.log(formArray.value[0].ageOfAsset)
        console.log(this.loanTenor, 'Loan')
        formArray.controls[0].patchValue({
          ageOfVehicle: Number(this.loanTenor) + formArray.value[0].ageOfAsset
        })
      } else {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);
        creditFormArray.controls[0].patchValue({
          ageOfAsset: Number(this.utilityService.ageFromAsset(event.date))
        })
      }
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

        let date = new Date(VehicleDetail.manuFacMonthYear)

        formArray.controls[0].patchValue({
          vehicleRegNo: VehicleDetail.vehicleRegNo || '',
          region: VehicleDetail.region || '',
          assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
          vehicleType: VehicleDetail.vehicleTypeCode || '',
          assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
          assetModel: VehicleDetail.vehicleModelCode || '',
          assetVariant: VehicleDetail.assetVarient === 'Petrol' ? 0 : '',
          assetSubVariant: VehicleDetail.assetSubVariant || '',
          manuFacMonthYear: VehicleDetail.manuFacMonthYear ? date : '',
          ageOfAsset: VehicleDetail.ageOfAsset || null,
          finalAssetCost: VehicleDetail.finalAssetCost || '',
          vehicleUsage: VehicleDetail.vehicleUsage || '',
          noOfVehicles: VehicleDetail.noOfVehicles || '',
          usage: VehicleDetail.usage || '',
          vehicleId: VehicleDetail.vehicleId || '',
          collateralId: VehicleDetail.collateralId || '',
          leadId: this.leadId,
          userId: this.userId
        })
        this.formDataOutput.emit(formArray.value)
      } else if (this.roleName === 'Credit Officer') {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);
        this.onPatchArrayValue(creditFormArray, VehicleDetail)
        this.formDataOutput.emit(creditFormArray.value)
      }
      this.vehicleDataService.setIndividualVehicleDetails(VehicleDetail);
    })

  }

  onPatchArrayValue(formArray, VehicleDetail) {

    formArray.controls[0].patchValue({
      dealerSubventionPartIRR: VehicleDetail.DealerSubventionPartIRR || '',
      ageOfAsset: VehicleDetail.ageOfAsset || null,
      assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
      assetCost: VehicleDetail.assetCost || null,
      assetCostCarTrade: VehicleDetail.assetCostCarTrade,
      assetCostIBB: VehicleDetail.assetCostIBB,
      assetCostLeast: VehicleDetail.assetCostLeast,
      assetCostRef: VehicleDetail.assetCostLeast || null,
      assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
      assetModel: VehicleDetail.vehicleModelCode || '',
      assetVariant: VehicleDetail.assetVarient === 'Petrol' ? 0 : '',
      assetSubVariant: VehicleDetail.assetSubVariant || '',
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
      leadId: Number(this.leadId),
      lmsCollateralId: null,
      manuFacMonthYear: new Date(VehicleDetail.manuFacMonthYear),
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
      permitExpiryDate: VehicleDetail.permitExpiryDate || '',
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
      vehicleRegNo: VehicleDetail.vehicleRegNo || '',
      vehicleType: VehicleDetail.vehicleTypeCode || '',
      vehicleUsage: VehicleDetail.vehicleUsage,
      userId: this.userId
    })

  }

  // event emitter for giving output to parent add vehicle component

  formDataOutputMethod(event) {
    // if (this.basicVehicleForm.valid) {
    //   this.formDataOutput.emit(this.basicVehicleForm.value.vehicleFormArray)
    // } else {
    //   this.utilityService.validateAllFormFields(this.basicVehicleForm)
    // }
    this.formDataOutput.emit(this.basicVehicleForm.value.vehicleFormArray)
  }

  //  method to get vehicle master data from region 

  onVehicleRegion(value: any) {
    const region = value ? value : '';
    let assetMakeArray = [];
    this.vehicleDetailService.getVehicleMasterFromRegion(region).subscribe((data: any) => {
      this.uiLoader.start();
      this.regionDataArray = data.ProcessVariables.vehicleMasterDetails ? data.ProcessVariables.vehicleMasterDetails : [];
      this.assetMake = this.utilityService.getCommonUniqueValue(this.regionDataArray, 'uniqueMFRCode')
      assetMakeArray = this.regionDataArray.length > 0 ? this.utilityService.getValueFromJSON(this.regionDataArray, "uniqueMFRCode", "mfrCode") : []
      this.vehicleLov.assetMake = assetMakeArray;
      this.uiLoader.stop();
    }, error => {
      console.log(error, 'error')
      this.uiLoader.stop();
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

    this.assetBodyType = this.vehicleType.filter(data => data.vehicleTypeUniqueCode === value)

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
      vehicleRegNo: ['', Validators.required],
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      vehicleType: ['', Validators.required],
      assetBodyType: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: [''],
      manuFacMonthYear: ['', Validators.required],
      ageOfAsset: ['', Validators.required],
      ageOfVehicle: ['', Validators.required],
      assetCostGrid: [''],
      assetCostIndian: ['', Validators.maxLength(10)],
      assetCostCarwale: ['', Validators.maxLength(10)],
      exShowroomPrice: ['', Validators.maxLength(10)],
      finalAssetCost: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{0,17}\.[0-9]{1,4}?$')
      ])],
      vehicleUsage: ['', Validators.required],
      category: [''],
      nameOfVehicleOwner: [''],
      mobileNumberOfVehicle: [''],
      vehicleAddress: [''],
      vehiclePinCode: [''],
      noOfVehicles: ['', Validators.required],
      usage: ['', Validators.required],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    });
    formArray.push(controls);
    console.log(this.basicVehicleForm.get('vehicleFormArray')['controls'][0].get('region'))
  }

  addCreditFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      creditFormArray: this._fb.array([])
    })
    formArray.push(controls);
    this.product_value === 'New Commercial Vehicle' ? this.addNewCVFormControls() : this.product_value === 'New Car' ? this.addNewcarFormControls :
      this.product_value === 'Used Commercial Vehicle' ? this.addUserCVFormControls() : this.addUserCarFormControls();
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
      leadId: this.leadId,
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
      leadId: this.leadId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);

    const controls = this._fb.group({
      vehicleRegNo: '',
      assetMake: '',
      assetModel: '',
      assetVariant: '',
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: '',
      vehicleType: '',
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
      interStateVehicle: [1],
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      insuranceValidity: '',
      idv: '',
      insuranceCopy: [''],
      fsrdFundingReq: '',
      fsrdPremiumAmount: null,
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
      region: '',
      vehicleRegNo: '',
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
      fsrdPremiumAmount: null,
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    creditFormArray.push(controls);
  }

}
