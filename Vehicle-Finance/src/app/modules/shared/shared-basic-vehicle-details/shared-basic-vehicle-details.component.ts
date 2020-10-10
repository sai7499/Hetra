import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { VehicleDataStoreService } from '../../../services/vehicle-data-store.service';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { SharedService } from '../shared-service/shared-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from '@services/toaster.service';
import { ApplicantService } from '@services/applicant.service';
import { map } from 'rxjs/operators';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared-basic-vehicle-details',
  templateUrl: './shared-basic-vehicle-details.component.html',
  styleUrls: ['./shared-basic-vehicle-details.component.css']
})

export class SharedBasicVehicleDetailsComponent implements OnInit {

  @Input() id: any;
  applicantDetails: any = [];
  disableSaveBtn: boolean;

  maxDate = new Date();
  initalZeroCheck = [];
  eligibleLoanAmount: any = 0;

  public basicVehicleForm: FormGroup;
  public vehicleLov: any = {};
  roleId: any;
  roleName: any;
  roleType: any;
  roles: any = [];
  LOV: any = [];
  public label: any = {};
  public productCatoryCode: string;
  public leadDetails: any = {};
  public loanTenor: number = 0;

  @Input() isDirty: boolean;
  isDisabled: boolean = true;

  public minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 15))
  public isInvalidMobileNumber: boolean;

  // LovData
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetVariant: any = [];
  public userId: number;
  public leadId: number;

  public vehicleRegPattern: {
    rule?: any;
    msg?: string;
  }[];

  constructor(
    private _fb: FormBuilder, private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService, private labelsData: LabelsService,
    private commonLovService: CommomLovService, private utilityService: UtilityService,
    private vehicleDetailService: VehicleDetailService, private activedRoute: ActivatedRoute,
    private vehicleDataService: VehicleDataStoreService, private uiLoader: NgxUiLoaderService,
    private createLeadDataService: CreateLeadDataService, private toasterService: ToasterService,
    public sharedService: SharedService, private applicantService: ApplicantService) {
    this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];
  }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      isValidPincode: true,
      isInvalidMobileNumber: true,
      vehicleFormArray: this._fb.array([])
    })

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      }, error => {
        console.log('error', error)
      });

    let roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.userId = roleAndUserDetails.userDetails.userId;
    let leadData = this.createLeadDataService.getLeadSectionData();

    this.applicantDetails = leadData['applicantDetails']
    this.leadDetails = leadData['leadDetails']
    this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.loanTenor = this.leadDetails['reqTenure'];

    this.eligibleLoanAmount = this.activedRoute.snapshot.params['eligibleLoanAmount'] ? this.activedRoute.snapshot.params['eligibleLoanAmount'] : 0;

    this.initForms();
    this.getLov();

    if (this.id) {
      this.setFormValue();
    };

    this.vehicleRegPattern = this.validateCustomPattern()

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType === '1' || operationType === '2') {
      this.basicVehicleForm.disable();
      this.disableSaveBtn = true;
    }

  }

  validateCustomPattern() {
    const regPatternData = [
      {
        rule: (inputValue) => {
          let patttern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
          if (inputValue.length === 10) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
          } else if (inputValue.length === 9) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue)
          } else {
            return true
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return regPatternData;
  }

  onGetDateValue(event) {

    if (!(event > this.maxDate || event < this.minDate)) {
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
  }

  getVehicleGridValue(formArray: any) {

    if (formArray.value[0].vehicleId !== 0 && formArray.value[0].manuFacMonthYear) {

      const date = this.utilityService.convertDateTimeTOUTC(formArray.value[0].manuFacMonthYear, 'YYYY')

      let data = { "manufactureYear": date, "vehicleCode": formArray.value[0].vehicleId + '' };

      this.vehicleDetailService.getVehicleGridValue(data).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        formArray.controls[0].patchValue({
          assetCostGrid: res.ProcessVariables.vehicleCost,
          finalAssetCost: res.ProcessVariables.vehicleCost,
          isVehAvailInGrid: res.ProcessVariables.isVehAvailInGrid,
        })
      }, err => {
        console.log('err', err)
      })
    } else {
      this.toasterService.showWarning(formArray.value[0].vehicleId === 0 ? 'Please Select Asset Varient' : 'Please Select Year & Month of Manufacturing ', '')
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

  onCompareFinalAssetCode(event) {
    const value = event.target.value;
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    if (formArray.value[0].assetCostCarTrade < formArray.value[0].assetCostIBB) {
      formArray.controls[0].patchValue({
        finalAssetCost: formArray.value[0].assetCostCarTrade
      })
    } else {
      formArray.controls[0].patchValue({
        finalAssetCost: formArray.value[0].assetCostIBB
      })
    }

  }

  onChangeFRSD(event) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const controls = formArray.at(0) as FormGroup;

    if (event.target.checked) {
      controls.addControl('fsrdPremiumAmount', new FormControl('', [Validators.required, Validators.maxLength(10)]));
    } else {
      controls.removeControl('fsrdPremiumAmount');
    }
  }

  initForms() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.clear();
    this.roleType === 1 ? this.addSalesFormControls() : this.addCreditFormControls();
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.LOV = value.LOVS;
      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vechicalUsage = value.LOVS.vehicleUsage;
      this.vehicleLov.vehicleType = value.LOVS.vehicleType;
      this.vehicleLov.vehicleCategory = value.LOVS.vehicleCategory;
      this.vehicleLov.permitType = value.LOVS.vehiclePermitType;

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
      this.vehicleLov.isVehAvailInGrid = [
        {
          key: 1,
          value: "Yes"
        },
        {
          key: 0,
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
        key: VehicleDetail.assetVarient,
        value: VehicleDetail.assetVarient
      }]

      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      this.onPatchArrayValue(formArray, VehicleDetail)
      this.sharedService.getFormValidation(this.basicVehicleForm)
      this.vehicleDataService.setIndividualVehicleDetail(VehicleDetail);
    })

  }

  onPatchArrayValue(formArray, VehicleDetail) {

    formArray.controls[0].patchValue({
      dealerSubventionPartIRR: VehicleDetail.dealerSubventionPartIRR || '',
      ageOfAsset: VehicleDetail.ageOfAsset || null,
      assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
      assetCost: VehicleDetail.assetCost || null,
      assetCostCarTrade: VehicleDetail.assetCostCarTrade || null,
      assetCostIBB: VehicleDetail.assetCostIBB || null,
      assetCostLeast: VehicleDetail.assetCostLeast || null,
      assetCostRef: VehicleDetail.assetCostRef || null,
      isVehAvailInGrid: VehicleDetail.isVehAvailInGrid || '',
      assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
      assetModel: VehicleDetail.vehicleModelCode || '',
      assetVariant: VehicleDetail.assetVarient || '',
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
      exShowRoomCost: Number(VehicleDetail.exShowRoomCost) || null,
      fastTag: VehicleDetail.fastTag || '',
      fastTagAmount: VehicleDetail.fastTagAmount || null,
      finalAssetCost: VehicleDetail.finalAssetCost || null,
      fitnessDate: VehicleDetail.fitnessDate ? this.utilityService.getDateFromString(VehicleDetail.fitnessDate) : '',
      fsrdFundingReq: VehicleDetail.fsrdFundingReq === '1' ? true : false || '',
      fsrdPremiumAmount: VehicleDetail.fsrdPremiumAmount || null,
      grossVehicleWeight: VehicleDetail.grossVehicleWeight || '',
      idv: VehicleDetail.idv || null,
      insurance: VehicleDetail.insurance || null,
      insuranceValidity: VehicleDetail.insuranceValidity ? this.utilityService.getDateFromString(VehicleDetail.insuranceValidity) : '',
      interStateVehicle: VehicleDetail.interStateVehicle || null,
      inusrancePolicyNumber: VehicleDetail.inusrancePolicyNumber || null,
      invoiceAmount: VehicleDetail.invoiceAmount || null,
      invoiceDate: VehicleDetail.invoiceDate ? this.utilityService.getDateFromString(VehicleDetail.invoiceDate) : '',
      invoiceNumber: VehicleDetail.invoiceNumber || null,
      isOrpFunding: VehicleDetail.isOrpFunding || '',
      leadId: Number(this.leadId),
      lmsCollateralId: VehicleDetail.lmsCollateralId || null,
      manuFacMonthYear: VehicleDetail.manuFacMonthYear ? this.utilityService.getDateFromString(VehicleDetail.manuFacMonthYear) : '',
      manuFactureSubventionPartIRR: VehicleDetail.manuFactureSubventionPartIRR || '',
      manufacturesubventionPartFinCharge: VehicleDetail.manufacturesubventionPartFinCharge || '',
      manufacSubventionApplicable: VehicleDetail.manufacSubventionApplicable || '',
      manufactureSubventionAmount: VehicleDetail.manufactureSubventionAmount || null,
      noOfUnits: VehicleDetail.noOfUnits || '',
      noOfVehicles: VehicleDetail.noOfVehicles || '',
      oneTimeTax: VehicleDetail.oneTimeTax || '',
      orpValue: VehicleDetail.orpValue || '',
      others: VehicleDetail.others || '',
      loanAmount: VehicleDetail.loanAmount ? VehicleDetail.loanAmount : this.eligibleLoanAmount || 0,
      bodyCost: VehicleDetail.bodyCost || null,
      pac: VehicleDetail.pac || '',
      pacAmount: VehicleDetail.pacAmount || null,
      permitExpiryDate: VehicleDetail.permitExpiryDate ? this.utilityService.getDateFromString(VehicleDetail.permitExpiryDate) : '',
      processtionType: VehicleDetail.processtionType || '',
      productCatCode: VehicleDetail.productCatCode || '',
      rcOwnerName: VehicleDetail.rcOwnerName || '',
      reRegVehicle: VehicleDetail.reRegVehicle || '',
      regMonthYear: VehicleDetail.regMonthYear ? this.utilityService.getDateFromString(VehicleDetail.regMonthYear) : '',
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
      vehicleRegDate: VehicleDetail.vehicleRegDate ? this.utilityService.getDateFromString(VehicleDetail.vehicleRegDate) : '',
      vehicleRegNo: VehicleDetail.vehicleRegNo || '',
      vehicleType: VehicleDetail.vehicleTypeCode || '',
      ownerMobileNo: VehicleDetail.ownerMobileNo || null,
      address: VehicleDetail.address || '',
      pincode: VehicleDetail.pincode || null,
      vehicleUsage: VehicleDetail.vehicleUsage,
      ageAfterTenure: VehicleDetail.ageAfterTenure || null,
      assetCostGrid: VehicleDetail.assetCostGrid || null,
      userId: this.userId
    })
  }

  onVehicleRegion(value: any, obj) {
    const region = value ? value : '';
    let assetMakeArray = [];

    const data = {
      "region": region,
      "productCategory": this.productCatoryCode
    }

    this.vehicleDetailService.getVehicleMasterFromRegion(data).subscribe((res: any) => {
      this.uiLoader.start();
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

          assetMakeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
            "uniqueMFRCode", "mfrCode")
          this.vehicleLov.assetMake = assetMakeArray;
          obj.patchValue({
            assetMake: '',
            vehicleType: '',
            assetBodyType: '',
            assetModel: '',
            assetVariant: ''
          })
        } else {
          this.vehicleLov.assetMake = []
          this.toasterService.showWarning('No Data in Vehicle Master Region', 'Vehicle Master Region')
        }
      } else {
        this.vehicleLov.assetMake = []
        this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Region')
      }
      this.uiLoader.stop();
    }, error => {
      console.log(error, 'error')
      this.uiLoader.stop();
    })
  }

  onAssetMake(value, obj) {
    let VehicleTypeArray = []

    if (value) {

      const data = {
        "region": obj.value.region,
        "productCategory": this.productCatoryCode,
        "make": value
      }

      this.vehicleDetailService.getVehicleMasterFromAssetMake(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

            VehicleTypeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "vehicleTypeUniqueCode", "vehicleTypeCode");

            this.vehicleLov.vehicleType = VehicleTypeArray;
            obj.patchValue({
              vehicleType: '',
              assetBodyType: '',
              assetModel: '',
              assetVariant: ''
            })

          } else {
            this.vehicleLov.vehicleType = []
            this.toasterService.showWarning('No Data in Vehicle Master Asset Make', 'Vehicle Master Asset Make')
          }
        } else {
          this.vehicleLov.vehicleType = []
          this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Asset Make')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  onVehicleType(value, obj) {

    let assetBodyType = []

    if (value) {

      const data =
      {
        "region": obj.value.region,
        "productCategory": this.productCatoryCode,
        "make": obj.value.assetMake,
        "vehicleType": value
      }

      this.vehicleDetailService.getVehicleMasterFromVehicleType(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {
            this.assetBodyType = res.ProcessVariables.vehicleMasterDetails;
            assetBodyType = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "uniqueSegmentCode", "segmentCode");

            this.vehicleLov.assetBodyType = assetBodyType;

            obj.patchValue({
              assetBodyType: '',
              assetModel: '',
              assetVariant: ''
            })

          } else {
            this.vehicleLov.assetBodyType = []
            this.toasterService.showWarning('No Data in Vehicle Master Vehicle Type', 'Vehicle Master Vehicle Type')
          }
        } else {
          this.vehicleLov.assetBodyType = []
          this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Vehicle Type')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  onAssetBodyType(value: any, obj) {
    this.assetModelType = this.assetBodyType.filter((data) => data.uniqueSegmentCode === value)
    this.vehicleLov.assetModel = this.utilityService.getValueFromJSON(this.assetModelType,
      "vehicleModelCode", "vehicleModel")
    obj.patchValue({
      assetModel: '',
      assetVariant: ''
    })
  }

  onAssetModel(value: any, obj) {
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    const array = this.utilityService.getCommonUniqueValue(this.assetVariant, 'vehicleVariant')
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.controls[0].patchValue({
      vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0
    })

    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      'vehicleCode', "vehicleVariant")

    obj.patchValue({
      assetVariant: ''
    })

  }

  onChangeMobileNumber(value) {

    this.basicVehicleForm.patchValue({
      isInvalidMobileNumber: true
    })

    if (value.length === 10) {
      if (this.applicantDetails && this.applicantDetails.length > 0) {
        this.applicantDetails.filter((mob: any) => {
          let mobileNumber = mob.mobileNumber;
          if (mobileNumber && mobileNumber.length === 12) {
            mobileNumber = mob.mobileNumber.slice(2, 12);
          }
          setTimeout(() => {

            if (mobileNumber === value) {
              this.basicVehicleForm.patchValue({
                isInvalidMobileNumber: false
              })
              this.toasterService.showInfo('Applicant and Vehicle Owner Mobile Number Same, Please Change', 'Mobile Number')
            } else {
              this.basicVehicleForm.patchValue({
                isInvalidMobileNumber: true
              })
            }
          })
        })
      } else {
        this.basicVehicleForm.patchValue({
          isInvalidMobileNumber: true
        })
      }
    }
  }

  getPincode(pincode) {
    this.basicVehicleForm.patchValue({
      isValidPincode: true
    })
    if (pincode.length === 6) {
      const pincodeNumber = Number(pincode);
      this.getPincodeResult(pincodeNumber);
    }
  }

  getPincodeResult(pincodeNumber: number) {

    let pincodeResult = [];
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      })
      .pipe(
        map((value: any) => {
          if (value.ProcessVariables.GeoMasterView && value.ProcessVariables.GeoMasterView.length > 0) {
            return value.ProcessVariables.GeoMasterView;
          } else {
            this.toasterService.showError('Invalid pincode', '');
            this.basicVehicleForm.patchValue({
              isValidPincode: false
            })
            return;
          }
        })).subscribe((res: any) => {
          if (!res) {
            return;
          }
          pincodeResult = res;
          if (res && res.length > 0) {
            this.basicVehicleForm.patchValue({
              isValidPincode: true
            })
          } else {
            this.basicVehicleForm.patchValue({
              isValidPincode: false
            })
          }
        })

    setTimeout(() => {
    });
  }

  addSalesFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    let controls = this._fb.group({
    })

    if (this.productCatoryCode === 'NCV') {
      controls = this._fb.group({
        region: ['', Validators.required],
        assetMake: ['', Validators.required],
        vehicleType: ['', Validators.required],
        assetBodyType: ['', Validators.required],
        assetModel: ['', Validators.required],
        assetVariant: ['', Validators.required],
        assetSubVariant: [''],
        exShowRoomCost: ['', Validators.required],
        finalAssetCost: [''],
        noOfVehicles: ['', Validators.required],
        vehicleId: 0,
        collateralId: 0,
        leadId: this.leadId,
        userId: this.userId
      });

    } else if (this.productCatoryCode === 'NC') {
      controls = this._fb.group({
        region: ['', Validators.required],
        assetMake: ['', Validators.required],
        vehicleType: ['', Validators.required],
        assetBodyType: ['', Validators.required],
        assetModel: ['', Validators.required],
        assetVariant: ['', Validators.required],
        assetSubVariant: [''],
        vehicleUsage: ['', Validators.required],
        exShowRoomCost: ['', Validators.required],
        finalAssetCost: [''],
        noOfVehicles: ['', Validators.required],
        vehicleId: 0,
        collateralId: 0,
        leadId: this.leadId,
        userId: this.userId
      });

    } else if (this.productCatoryCode === 'UCV') {
      controls = this._fb.group({
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
        ageAfterTenure: ['', Validators.required],
        assetCostGrid: ['', Validators.required],
        isVehAvailInGrid: [1],
        finalAssetCost: [''],
        rcOwnerName: ['', Validators.required],
        ownerMobileNo: ['', Validators.required],
        address: ['', Validators.maxLength(120)],
        pincode: ['', Validators.maxLength(6)],
        vehicleId: 0,
        collateralId: 0,
        leadId: this.leadId,
        userId: this.userId
      });
    } else if (this.productCatoryCode === 'UC') {
      controls = this._fb.group({
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
        ageAfterTenure: ['', Validators.required],
        assetCostIBB: ['', Validators.required],
        assetCostCarTrade: ['', Validators.required],
        finalAssetCost: [''],
        rcOwnerName: ['', Validators.required],
        ownerMobileNo: ['', Validators.required],
        address: ['', Validators.maxLength(120)],
        pincode: ['', Validators.maxLength(6)],
        vehicleUsage: ['', Validators.required],
        category: ['', Validators.required],
        vehicleId: 0,
        collateralId: 0,
        leadId: this.leadId,
        userId: this.userId
      });
    }
    formArray.push(controls)
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
      vehicleType: ['', Validators.required],
      exShowRoomCost: [null, Validators.required],
      finalAssetCost: ['', Validators.required],
      dealerSuventionApproval: [''],
      dealerSubventionAmount: [null],
      dealerSubventionPartIRR: [null],
      dealerSubventionPartFinCharge: [null],
      manufacSubventionApplicable: [''],
      manufactureSubventionAmount: [null],
      manuFactureSubventionPartIRR: [null],
      manufacturesubventionPartFinCharge: [null],
      grossVehicleWeight: [''],
      invoiceNumber: [null],
      invoiceDate: [''],
      invoiceAmount: [null],
      isOrpFunding: [''],
      insurance: [''],
      oneTimeTax: [''],
      loanAmount: [0],
      bodyCost: [''],
      pac: [''],
      vas: [''],
      emiProtect: [''],
      fastTag: [''],
      others: [''],
      discount: [''],
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
      vehicleType: ['', Validators.required],
      exShowRoomCost: [null, Validators.required],
      finalAssetCost: ['', Validators.required],
      dealerSuventionApproval: [''],
      dealerSubventionAmount: [null],
      dealerSubventionPartIRR: [null],
      dealerSubventionPartFinCharge: [null],
      manufacSubventionApplicable: [''],
      manufactureSubventionAmount: [null],
      manuFactureSubventionPartIRR: [null],
      manufacturesubventionPartFinCharge: [null],
      invoiceNumber: [null],
      invoiceDate: [''],
      invoiceAmount: [null],
      isOrpFunding: [''],
      insurance: [''],
      oneTimeTax: [''],
      pac: [''],
      vas: [''],
      emiProtect: [''],
      loanAmount: [0],
      bodyCost: [''],
      fastTag: [''],
      others: [''],
      discount: [''],
      vehicleUsage: [''],
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
      ageAfterTenure: [''],
      assetCostGrid: ['', Validators.required],
      finalAssetCost: ['', Validators.required],
      fitnessDate: [''],
      isVehAvailInGrid: [1],
      typeOfPermit: [''],
      typeOfPermitOthers: [''],
      permitExpiryDate: [''],
      permitUpload: [''],
      chasisNumber: [''],
      engineNumber: [''],
      vehiclePurchasedCost: [null],
      vehicleOwnerShipNumber: null,
      rcOwnerName: ['', [Validators.required, Validators.pattern('^[A-Za-z ]{0,99}$')]],
      ownerMobileNo: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]],
      address: ['', Validators.compose([Validators.maxLength(120), Validators.required])],
      pincode: ['', Validators.compose([Validators.maxLength(6), Validators.required])],
      vehicleRegDate: [''],
      grossVehicleWeight: [''],
      reRegVehicle: [''],
      interStateVehicle: [''],
      duplicateRC: [''],
      cubicCapacity: [''],
      seatingCapacity: [''],
      loanAmount: [0],
      bodyCost: [''],
      insuranceValidity: [''],
      idv: [''],
      insuranceCopy: [''],
      fsrdFundingReq: [''],
      fsrdPremiumAmount: [null],
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
      vehicleUsage: ['', Validators.required],
      category: ['', Validators.required],
      manuFacMonthYear: ['', Validators.required],
      ageOfAsset: [''],
      ageAfterTenure: [''],
      assetCostIBB: ['', Validators.required],
      assetCostCarTrade: ['', Validators.required],
      assetCostLeast: '',
      finalAssetCost: ['', Validators.required],
      chasisNumber: [''],
      engineNumber: [''],
      loanAmount: [0],
      bodyCost: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnerShipNumber: null,
      rcOwnerName: ['', Validators.pattern('^[A-Za-z ]{0,99}$')],
      ownerMobileNo: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]],
      address: ['', Validators.compose([Validators.maxLength(120), Validators.required])],
      pincode: ['', Validators.compose([Validators.maxLength(6), Validators.required])],
      vehicleRegDate: '',
      grossVehicleWeight: [''],
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