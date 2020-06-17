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
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})

export class SharedBasicVehicleDetailsComponent implements OnInit {

  @Input() id: any;

  @Output() formDataOutput = new EventEmitter<ArrayType>();

  maxDate = new Date()

  public basicVehicleForm: FormGroup;
  public vehicleLov: any = {};
  roleId: any;
  roleName: any;
  roleType: any;
  roles: any = [];
  LOV: any = [];
  public label: any = {};
  regionDataArray = [];

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
    public sharedService: SharedService, private toasterService: ToasterService,
    private uiLoader: NgxUiLoaderService) { }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      vehicleFormArray: this._fb.array([])
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadDetails = leadData['leadDetails']
    this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.productCatoryId = this.leadDetails['productId'];
    this.loanTenor = this.leadDetails['reqTenure'];

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
  }

  onGetDateValue(event) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.controls[0].patchValue({
      ageOfAsset: Number(this.utilityService.ageFromAsset(event))
    })

    formArray.controls[0].patchValue({
      ageAfterTenure: Number(this.loanTenor) + formArray.value[0].ageOfAsset
    })

    if (this.productCatoryCode === 'UCV') {
      this.getVehicleGridValue(formArray)
    }
  }

  getVehicleGridValue(formArray: any) {

    if (formArray.value[0].vehicleId !== 0) {

      const date = this.utilityService.convertDateTimeTOUTC(formArray.value[0].manufactureYear, 'YYYY')

      const data = { "manufactureYear": date, "vehicleCode": formArray.value[0].vehicleId + '' };

      this.vehicleDetailService.getVehicleGridValue(data).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        formArray.controls[0].patchValue({
          assetCostGrid: res.ProcessVariables.vehicleCost,
          finalAssetCost: res.ProcessVariables.vehicleCost
        })
      }, err => {
        console.log('err', err)
      })
    } else {
      this.toasterService.showWarning('Please Select Asset Varient', '')
    }
  }

  onPatchFinalAssetCost(value) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    if (value) {
      formArray.controls[0].patchValue({
        finalAssetCost: value
      })
    }

  }

  onCompareFinalAssetCode(value) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    if (value && formArray.value[0].assetCostCarTrade < formArray.value[0].assetCostIBB) {
      console.log(formArray.value[0].assetCostCarTrade, 'Less')
      formArray.controls[0].patchValue({
        finalAssetCost: formArray.value[0].assetCostCarTrade
      })
    } else if (value && formArray.value[0].assetCostIBB < formArray.value[0].assetCostCarTrade) {
      console.log(formArray.value[0].assetCostIBB, 'greater')
      formArray.controls[0].patchValue({
        finalAssetCost: formArray.value[0].assetCostIBB
      })
    } else if (value && formArray.value[0].assetCostCarTrade === formArray.value[0].assetCostIBB) {
      console.log(value, 'value')
      formArray.controls[0].patchValue({
        finalAssetCost: formArray.value[0].assetCostIBB
      })
    }
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

        formArray.controls[0].patchValue({
          vehicleRegNo: VehicleDetail.vehicleRegNo || '',
          region: VehicleDetail.region || '',
          assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
          vehicleType: VehicleDetail.vehicleTypeCode || '',
          assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
          assetModel: VehicleDetail.vehicleModelCode || '',
          assetVariant: VehicleDetail.assetVarient === 'Petrol' ? 0 : '',
          assetSubVariant: VehicleDetail.assetSubVariant || '',
          manuFacMonthYear: VehicleDetail.manuFacMonthYear ? this.utilityService.getDateFromString(VehicleDetail.manuFacMonthYear) : '',
          ageOfAsset: VehicleDetail.ageOfAsset || null,
          finalAssetCost: VehicleDetail.finalAssetCost || '',
          exShowRoomCost: VehicleDetail.exShowRoomCost,
          vehicleUsage: VehicleDetail.vehicleUsage || '',
          noOfVehicles: VehicleDetail.noOfVehicles || '',
          usage: VehicleDetail.usage || '',
          vehicleId: VehicleDetail.vehicleId || '',
          assetCostGrid: VehicleDetail.assetCostGrid || null,
          assetCostCarTrade: VehicleDetail.assetCostCarTrade || null,
          assetCostIBB: VehicleDetail.assetCostIBB || null,
          rcOwnerName: VehicleDetail.rcOwnerName || '',
          collateralId: VehicleDetail.collateralId || '',
          ownerMobileNo: VehicleDetail.ownerMobileNo || null,
          address: VehicleDetail.address || '',
          ageAfterTenure: VehicleDetail.ageAfterTenure || null,
          pincode: VehicleDetail.pincode || null,
          leadId: this.leadId,
          userId: this.userId,
          category: VehicleDetail.category || ''
        })
        this.formDataOutput.emit(formArray.value);
        this.sharedService.getFormValidation(this.basicVehicleForm)
      } else if (this.roleName === 'Credit Officer') {
        const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
        const creditFormArray = (formArray['controls'][0].get('creditFormArray') as FormArray);
        this.onPatchArrayValue(formArray, VehicleDetail)
        this.formDataOutput.emit(formArray.value)
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
      assetCostCarTrade: VehicleDetail.assetCostCarTrade || null,
      assetCostIBB: VehicleDetail.assetCostIBB || null,
      assetCostLeast: VehicleDetail.assetCostLeast || null,
      assetCostRef: VehicleDetail.assetCostRef || null,
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
      depositAccountNumber: VehicleDetail.depositAccountNumber || null,
      discount: VehicleDetail.discount || '',
      duplicateRc: VehicleDetail.duplicateRc || '',
      emiProtect: VehicleDetail.emiProtect || '',
      emiProtectAmount: VehicleDetail.emiProtectAmount || null,
      engineNumber: VehicleDetail.engineNumber || null,
      exShowRoomCost: VehicleDetail.exShowRoomCost || null,
      fastTag: VehicleDetail.fastTag || '',
      fastTagAmount: VehicleDetail.fastTagAmount || null,
      finalAssetCost: VehicleDetail.finalAssetCost || '',
      fitnessDate: VehicleDetail.fitnessDate || '',
      fsrdFundingReq: VehicleDetail.fsrdFundingReq || '',
      fsrdPremiumAmount: VehicleDetail.fsrdPremiumAmount || null,
      gorssVehicleWeight: VehicleDetail.gorssVehicleWeight || '',
      idv: VehicleDetail.idv || null,
      insurance: VehicleDetail.insurance || null,
      insuranceValidity: VehicleDetail.insuranceValidity || '',
      interStateVehicle: VehicleDetail.interStateVehicle || null,
      inusrancePolicyNumber: VehicleDetail.inusrancePolicyNumber || null,
      invoiceAmount: VehicleDetail.invoiceAmount || null,
      invoiceDate: VehicleDetail.invoiceDate || '',
      invoiceNumber: VehicleDetail.invoiceNumber || '',
      isOrpFunding: VehicleDetail.isOrpFunding || '',
      leadId: Number(this.leadId),
      lmsCollateralId: VehicleDetail.lmsCollateralId || null,
      manuFacMonthYear: this.utilityService.getDateFromString(VehicleDetail.manuFacMonthYear) || '',
      manuFactureSubventionPartIRR: VehicleDetail.manuFactureSubventionPartIRR || '',
      manuFatureSubventionPartFinCharge: VehicleDetail.manuFatureSubventionPartFinCharge || '',
      manufacSubventionApplicable: VehicleDetail.manufacSubventionApplicable || '',
      manufactureSubventionAmount: VehicleDetail.manufactureSubventionAmount || '',
      noOfUnits: VehicleDetail.noOfUnits || '',
      noOfVehicles: VehicleDetail.noOfVehicles || '',
      oneTimeTax: VehicleDetail.oneTimeTax || '',
      orpValue: VehicleDetail.orpValue || '',
      others: VehicleDetail.others || '',
      pac: VehicleDetail.pac || '',
      pacAmount: VehicleDetail.pacAmount || null,
      permitExpiryDate: VehicleDetail.permitExpiryDate || '',
      processtionType: VehicleDetail.processtionType || '',
      productCatCode: VehicleDetail.productCatCode || '',
      rcOwnerName: VehicleDetail.rcOwnerName || '',
      reRegVehicle: VehicleDetail.reRegVehicle || '',
      regMonthYear: VehicleDetail.regMonthYear || '',
      region: VehicleDetail.region || '',
      registrationNo: VehicleDetail.registrationNo || '',
      seatingCapacity: VehicleDetail.seatingCapacity || '',
      subventionType: VehicleDetail.subventionType || '',
      tonnage: VehicleDetail.tonnage || '',
      typeOfPermit: VehicleDetail.typeOfPermit || '',
      typeOfPermitOthers: VehicleDetail.typeOfPermitOthers || '',
      usage: VehicleDetail.usage || '',
      vas: VehicleDetail.vas || '',
      vasAmount: VehicleDetail.vasAmount || null,
      vehicleId: VehicleDetail.vehicleId || null,
      vehicleOwnerShipNumber: VehicleDetail.vehicleOwnerShipNumber || null,
      vehiclePurchasedCost: VehicleDetail.vehiclePurchasedCost || null,
      vehicleRegDate: VehicleDetail.vehicleRegDate || null,
      vehicleRegNo: VehicleDetail.vehicleRegNo || '',
      vehicleType: VehicleDetail.vehicleTypeCode || '',
      ownerMobileNo: VehicleDetail.ownerMobileNo || null,
      address: VehicleDetail.address || '',
      pincode: VehicleDetail.pincode || null,
      vehicleUsage: VehicleDetail.vehicleUsage,
      ageAfterTenure: VehicleDetail.ageAfterTenure || null,
      userId: this.userId
    })

  }

  // event emitter for giving output to parent add vehicle component

  formDataOutputMethod(event) {
    this.sharedService.getFormValidation(this.basicVehicleForm)
    this.formDataOutput.emit(this.basicVehicleForm.value.vehicleFormArray)
  }

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
    // if (this.roleName === 'Sales Officer') {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.controls[0].patchValue({
      vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
    })
    // } else {
    //   const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    //   formArray.controls[0].patchValue({
    //     vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
    //   })
    // }

    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      0, "vehicleVariant")

  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = this._fb.group({
      vehicleRegNo: [''],
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      vehicleType: ['', Validators.required],
      assetBodyType: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: [''],
      manuFacMonthYear: ['', Validators.required],
      ageOfAsset: ['', Validators.required],
      ageAfterTenure: ['', Validators.required],
      assetCostGrid: [''],
      assetCostIBB: [''],
      assetCostCarTrade: [''],
      exShowRoomCost: [''],
      finalAssetCost: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{0,17}\.[0-9]{1,4}?$')
      ])],
      vehicleUsage: [''],
      category: ['', Validators.required],
      rcOwnerName: [''],
      ownerMobileNo: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[1-9][0-9]*$')])],
      address: ['', Validators.maxLength(140)],
      pincode: ['', Validators.maxLength(6)],
      noOfVehicles: ['', Validators.required],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    });
    formArray.push(controls);
    this.changeSalesForm()
  }

  changeSalesForm() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = formArray.at(0) as FormGroup;
    console.log(controls, 'controls')

    if (this.productCatoryCode === 'NCV') {
      controls.removeControl('vehicleRegNo');
      controls.removeControl('assetCostGrid');
      controls.removeControl('assetCostIBB');
      controls.removeControl('assetCostCarTrade');
      controls.removeControl('vehicleUsage');
      controls.removeControl('rcOwnerName');
      controls.removeControl('ownerMobileNo');
      controls.removeControl('address');
      controls.removeControl('pincode');
      controls.removeControl('exShowRoomCost');

      controls.addControl('exShowRoomCost', new FormControl('', [Validators.required, Validators.maxLength(10)]));
    } else if (this.productCatoryCode === 'NC') {
      controls.removeControl('vehicleRegNo');
      controls.removeControl('assetCostGrid');
      controls.removeControl('assetCostIBB');
      controls.removeControl('assetCostCarTrade');
      controls.removeControl('vehicleUsage');
      controls.removeControl('rcOwnerName');
      controls.removeControl('ownerMobileNo');
      controls.removeControl('address');
      controls.removeControl('pincode');
      controls.removeControl('exShowRoomCost');

      controls.addControl('vehicleUsage', new FormControl('', Validators.required));
      controls.addControl('exShowRoomCost', new FormControl('', Validators.required));
    } else if (this.productCatoryCode === 'UC') {

      controls.removeControl('vehicleRegNo');
      controls.removeControl('assetCostGrid');
      controls.removeControl('assetCostIBB');
      controls.removeControl('assetCostCarTrade');
      controls.removeControl('vehicleUsage');
      controls.removeControl('rcOwnerName');
      controls.removeControl('ownerMobileNo');
      controls.removeControl('address');
      controls.removeControl('pincode');
      controls.removeControl('exShowRoomCost');

      controls.addControl('assetCostIBB', new FormControl('', Validators.required));
      controls.addControl('assetCostCarTrade', new FormControl('', Validators.required));
      controls.addControl('vehicleRegNo', new FormControl('', Validators.required));
      controls.addControl('vehicleUsage', new FormControl('', Validators.required));
    } else if (this.productCatoryCode === 'UCV') {


      controls.removeControl('vehicleRegNo');
      controls.removeControl('assetCostGrid');
      controls.removeControl('vehicleUsage');
      controls.removeControl('rcOwnerName');
      controls.removeControl('ownerMobileNo');
      controls.removeControl('address');
      controls.removeControl('pincode');
      controls.removeControl('exShowRoomCost');

      controls.addControl('vehicleRegNo', new FormControl('', Validators.required));
      controls.addControl('assetCostGrid', new FormControl('', Validators.required));
      controls.addControl('rcOwnerName', new FormControl('', Validators.required));
      controls.addControl('ownerMobileNo', new FormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]));
      controls.addControl('address', new FormControl('', Validators.required));
      controls.addControl('pincode', new FormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{5}')]));
    }
    this.sharedService.getFormValidation(this.basicVehicleForm)
  }

  addCreditFormControls() {
    this.productCatoryCode === 'NCV' ? this.addNewCVFormControls() : this.productCatoryCode === 'NC' ? this.addNewcarFormControls :
      this.productCatoryCode === 'UCV' ? this.addUserCVFormControls() : this.addUserCarFormControls();
    this.sharedService.getFormValidation(this.basicVehicleForm)
  }

  addNewCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['LCVVEHTYP', Validators.required],
      exShowRoomCost: [null, Validators.required],
      finalAssetCost: ['', Validators.required],
      dealerSuventionApproval: ['', Validators.required],
      dealerSubventionAmount: [null, Validators.required],
      dealerSubventionPartIRR: [null, Validators.required],
      dealerSubventionPartFinCharge: [null, Validators.required],
      manufacSubventionApplicable: ['', Validators.required],
      manufactureSubventionAmount: [null, Validators.required],
      manuFactureSubventionPartIRR: [null, Validators.required],
      manuFatureSubventionPartFinCharge: [null, Validators.required],
      invoiceNumber: [null, Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceAmount: [null, Validators.required],
      isOrpFunding: ['', Validators.required],
      insurance: ['', Validators.required],
      oneTimeTax: ['', Validators.required],
      pac: ['', Validators.required],
      vas: ['', Validators.required],
      emiProtect: ['', Validators.required],
      fastTag: ['', Validators.required],
      others: ['', Validators.required],
      discount: ['', Validators.required],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    });
    formArray.push(controls);
  }

  addNewcarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['LCVVEHTYP', Validators.required],
      exShowRoomCost: [null, Validators.required],
      finalAssetCost: ['', Validators.required],
      dealerSuventionApproval: ['', Validators.required],
      dealerSubventionAmount: [null, Validators.required],
      dealerSubventionPartIRR: [null, Validators.required],
      dealerSubventionPartFinCharge: [null, Validators.required],
      manufacSubventionApplicable: ['', Validators.required],
      manufactureSubventionAmount: [null, Validators.required],
      manuFactureSubventionPartIRR: [null, Validators.required],
      manuFatureSubventionPartFinCharge: [null, Validators.required],
      invoiceNumber: [null, Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceAmount: [null, Validators.required],
      isOrpFunding: ['', Validators.required],
      insurance: ['', Validators.required],
      oneTimeTax: ['', Validators.required],
      pac: ['', Validators.required],
      vas: ['', Validators.required],
      emiProtect: ['', Validators.required],
      fastTag: ['', Validators.required],
      others: ['', Validators.required],
      discount: ['', Validators.required],
      vehicleUsage: ['', Validators.required],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    formArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      vehicleRegNo: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      region: ['', Validators.required],
      manuFacMonthYear: ['', Validators.required],
      ageOfAsset: ['', Validators.required],
      ageAfterTenure: ['', Validators.required],
      assetCostGrid: ['', Validators.required],
      finalAssetCost: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{0,17}\.[0-9]{1,4}?$')
      ])],
      fitnessDate: ['', Validators.required],
      typeOfPermit: ['', Validators.required],
      typeOfPermitOthers: ['', Validators.required],
      permitExpireDate: ['', Validators.required],
      permitUpload: [''],
      chasisNumber: [null, Validators.required],
      engineNumber: [null, Validators.required],
      vehiclePurchasedCost: [null, Validators.required],
      vehicleOwnerShipNumber: [null, Validators.required],
      rcOwnerName: ['', Validators.required],
      ownerMobileNo: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[1-9][0-9]*$'), Validators.required])],
      address: ['', Validators.compose([Validators.maxLength(140), Validators.required])],
      pincode: ['', Validators.compose([Validators.maxLength(6), Validators.required])],
      vehicleRegDate: ['', Validators.required],
      reRegVehicle: ['', Validators.required],
      interStateVehicle: ['', Validators.required],
      duplicateRC: ['', Validators.required],
      cubicCapacity: ['', Validators.required],
      seatingCapacity: ['', Validators.required],
      insuranceValidity: ['', Validators.required],
      idv: ['', Validators.required],
      insuranceCopy: [''],
      fsrdFundingReq: ['', Validators.required],
      fsrdPremiumAmount: [null, Validators.required],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    formArray.push(controls);
  }

  addUserCarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      vehicleRegNo: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVariant: '',
      assetOther: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      region: ['', Validators.required],
      vehicleUsage: ['PVEHUSG'],
      category: ['CATAVEHCAT'],
      manuFacMonthYear: '',
      ageOfAsset: '',
      assetCostIBB: '',
      assetCostCarTrade: '',
      assetCostLeast: '',
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
    formArray.push(controls);
  }

}
