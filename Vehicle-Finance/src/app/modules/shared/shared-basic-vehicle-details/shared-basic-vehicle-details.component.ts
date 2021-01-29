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
import { Router } from '@angular/router';
import { LoanViewService } from '@services/loan-view.service';
import { ChildLoanApiService } from '@services/child-loan-api.service';
import { environment } from 'src/environments/environment';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { CreditScoreService } from '@services/credit-score.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { Location } from '@angular/common';

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
  isNegativeValue = [];
  eligibleLoanAmount: any = 0;

  public basicVehicleForm: FormGroup;
  public vehicleLov: any = {};
  roleId: any;
  roleName: any;
  roleType: any;
  roles: any = [];
  LOV: any = [];
  public label: any = {};

  public onlyFutureDate = new Date();
  maxFuteureDate = this.onlyFutureDate.setDate(this.maxDate.getDate() + 1)

  public childLoanCondition: any = {};
  public productCatoryCode: string;
  public Product: string;
  public assetProdutName: string;
  public assetProductCode: string;

  public productId: string;
  public loanTypeArray: any = [];

  public leadDetails: any = {};
  public loanTenor: number = 0;

  @Input() isDirty: boolean;
  isDisabled: boolean = true;
  isChildLoan: boolean = false;

  public minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 15))
  public isInvalidMobileNumber: boolean;

  // LovData
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetVariant: any = [];
  public userId: number;
  public leadId: number;

  public toDayDate = new Date();
  isMobile: boolean;
  isMaxDate: boolean;

  public vehicleRegPattern: {
    rule?: any;
    msg?: string;
  }[];

  // Auto Populate
  isTaxDetails: any;
  isTaxBill: string;
  reqLoanAmt: string;
  isSpareCost: any;
  isRepairCost: any;

  // Check Depdue
  isVehicleDedupe: boolean;
  vehicleRegNoChange: any;
  isShowParentLoan: boolean;
  loanDetailsData: any = [];
  isVehicleRegistrationNumber: any;
  isVehicleRegNoChange: boolean;
  searchChildLoanData: any;

  // Next to Check Value
  isShowLoanDetails: boolean;
  isApiValue: any;
  isFormValue: any;
  vehicleArray: any = [];

  @Input() udfScreenId: any;
  @Input() udfGroupId: any;
  udfDetails: any = [];
  isLoan360: boolean;
  userDefineForm: any;
  initUDFValues: any;
  eligibleModal: boolean;
  errorMessage: any;
  isModelShow: boolean;
  showEligibilityScreen: any;
  applicantList: any;
  showNotCoApplicant: boolean;
  finalValue: any;
  editedUDFValues: any;
  isFinalValue: any;

  leadSectionData: any;

  // loanDetails
  loanDetails: boolean;
  loanAccountDetails: any;

  constructor(
    private _fb: FormBuilder, private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService, private labelsData: LabelsService,
    private commonLovService: CommomLovService, private utilityService: UtilityService,
    private vehicleDetailService: VehicleDetailService, private vehicleDetailsService: VehicleDetailService,
    private vehicleDataService: VehicleDataStoreService, private uiLoader: NgxUiLoaderService,
    private createLeadDataService: CreateLeadDataService, private toasterService: ToasterService,
    public sharedService: SharedService, private applicantService: ApplicantService,
    private childLoanApiService: ChildLoanApiService, private loanViewService: LoanViewService,
    private router: Router, private vehicleDataStoreService: VehicleDataStoreService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private creditService: CreditScoreService,
    private objectComparisonService: ObjectComparisonService,
    private termsService: TermAcceptanceService,
    private location: Location) {
    this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];
    this.isNegativeValue = [{ rule: val => val < 0, msg: 'Negative value not accepted' }];
    // date
    var day = this.toDayDate.getDate();
    var month = this.toDayDate.getMonth();
    var year = this.toDayDate.getFullYear();
    this.toDayDate = new Date(year, month, day, 0, 0);
    this.minDate = new Date(new Date().getFullYear() - 15, month, month)
    // Mobile View
    this.isMobile = environment.isMobile;

  }

  ngOnInit() {

    this.basicVehicleForm = this._fb.group({
      isValidPincode: true,
      isCheckDedpue: true,
      isInvalidMobileNumber: true,
      isVaildFinalAssetCost: true,
      vehicleFormArray: this._fb.array([])
    })

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      }, error => {
        console.log('error', error)
      });

    this.applicantList = this.applicantDataStoreService.getApplicantList();

    let roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    this.isLoan360 = this.loanViewService.checkIsLoan360();

    this.userId = roleAndUserDetails.userDetails.userId;

    this.getLeadSectionData();
    this.initForms();
    this.getLov();

    this.vehicleRegPattern = this.validateCustomPattern()

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.basicVehicleForm.disable();
      this.disableSaveBtn = true;
    }

    if (this.loanViewService.checkIsLoan360()) {
      this.basicVehicleForm.disable();
      this.disableSaveBtn = true;
    }

    this.eligibleLoanAmount = this.leadDetails.eligibleLoanAmt
  }

  getLeadSectionData() {

    this.leadSectionData = this.createLeadDataService.getLeadSectionData();

    this.applicantDetails = this.leadSectionData['applicantDetails']
    this.leadDetails = this.leadSectionData['leadDetails']
    this.leadId = this.leadSectionData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.loanTenor = this.leadDetails['reqTenure'];
    this.assetProdutName = this.leadDetails['assetProdutName'];

    this.assetProductCode = this.leadDetails['assetProductCode'];
    this.reqLoanAmt = this.leadDetails['reqLoanAmt'];
    this.isChildLoan = this.leadDetails['isChildLoan'] ? this.leadDetails['isChildLoan'] === '1' ? true : false : false;
    let ProductType = {}

    this.labelsData.getChildLoanConditionData().subscribe((child: any) => {

      this.loanTypeArray = child.childLoan.isLoanType;

      if (this.isChildLoan) {
        ProductType = this.loanTypeArray.find((res: any) => res.key === this.assetProductCode)
        if (ProductType) {
          this.Product = ProductType['value'];
          this.childLoanCondition = child.childLoan.isRequired[this.Product];
        }
      }
    })
  }

  onGetMarginAmount(value, form) {
    if (this.reqLoanAmt) {
      let marginAmount = Number(value) - Number(this.reqLoanAmt)
      form.get('marginAmount').setValue(marginAmount)
    } else {
      form.get('marginAmount').setValue(null)
    }
  }

  onSaveuserDefinedFields(value) {
    //this.sharedService.getUserDefinedFields(event)
    this.userDefineForm = value;
    if (value.event === 'init') {
      this.initUDFValues = this.userDefineForm ? this.userDefineForm.udfData.getRawValue() : {};
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

  onGetDateValue(event, isVehicleGrid?: string) {

    if (!(event > this.maxDate && event < this.minDate)) {
      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

      let ageOfAssetYear = this.utilityService.ageOfAssetYear(event)['_data'];

      let ageOfLoanTenure = Number(this.loanTenor) + Number(this.utilityService.ageFromAsset(event));

      let ageOfAsset = Number(this.utilityService.ageFromAsset(event)) + '    ( ' + ageOfAssetYear.years + ' Years ' + ageOfAssetYear.months + ' Months ' + ' ) ';

      let ageAfterTenure = ageOfLoanTenure + '    ( ' + Math.floor(Number(ageOfLoanTenure) / 12) + ' Years ' + Math.floor(Number(ageOfLoanTenure % 12)) + ' Months ' + ' ) ';

      formArray.controls[0].patchValue({
        ageOfAsset: ageOfAsset,
        ageAfterTenure: ageAfterTenure
      })

      if (isVehicleGrid && this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UTCR') {
        this.getVehicleGridValue(formArray)
      }
    }
  }

  getVehicleGridValue(formArray: any) {

    if (formArray.value[0].vehicleId !== 0 && formArray.value[0].manuFacMonthYear) {

      const date = this.utilityService.convertDateTimeTOUTC(formArray.value[0].manuFacMonthYear, 'YYYY')

      let data = { "manufactureYear": date, "vehicleCode": formArray.value[0].vehicleId + '' };

      this.vehicleDetailService.getVehicleGridValue(data).subscribe((res: any) => {

        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          formArray.controls[0].patchValue({
            assetCostGrid: res.ProcessVariables.vehicleCost,
            finalAssetCost: res.ProcessVariables.vehicleCost,
            isVehAvailInGrid: res.ProcessVariables.isVehAvailInGrid,
          })
          this.isApiValue = this.basicVehicleForm.getRawValue().vehicleFormArray[0];
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Gird value')
        }
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

  onCompareFinalAssetCode(event, obj) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    if (Number(obj.controls['assetCostCarTrade'].value) < Number(obj.controls['assetCostIBB'].value)) {
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
    const details = formArray.at(0) as FormGroup;
    if (this.isChildLoan && this.childLoanCondition) {
      this.getDynamicFormControls(details)
    }

    if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC' || this.productCatoryCode === 'UTCR') {
      this.isChildLoan === true ? details.get('vehicleRegNo').disable() : details.get('vehicleRegNo').enable()
    }
  }

  getDynamicFormControls(form) {
    let keys = Object.keys(this.childLoanCondition);
    let values = Object.values(this.childLoanCondition);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] && values[i] === true) {
        let fc = this.roleType === 1 ? this._fb.control('') : this._fb.control('', [Validators.required])
        form.addControl(keys[i], fc)
      }
    }
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.LOV = value.LOVS;
      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vechicalUsage = value.LOVS.vehicleUsage;
      this.vehicleLov.vehicleCategory = value.LOVS.vehicleCategory;
      this.vehicleLov.permitType = value.LOVS.vehiclePermitType;
      this.vehicleLov.insuranceType = this.LOV['In-HouseInsuranceType']

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
    this.getVehicleDetails(this.leadId)
  }

  getVehicleDetails(id: number) {
    this.vehicleDetailsService.getAllVehicleCollateralDetails(id).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        if (res.ProcessVariables.vehicleDetails && res.ProcessVariables.vehicleDetails.length > 0) {
          this.vehicleArray = res.ProcessVariables.vehicleDetails;
          this.id = res.ProcessVariables.vehicleDetails[0].collateralId
          if (this.id && this.id !== '0') {
            this.setFormValue();
          };
        }
        this.vehicleDataStoreService.setVehicleDetails(res.ProcessVariables.vehicleDetails);
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Delete Vehicle Details')
      }
    }, error => {
      console.log(error, 'error');
    });
  }

  onChangeFinalAssetCost(value, form) {
    this.basicVehicleForm.patchValue({
      isVaildFinalAssetCost: true
    })

    if (this.roleType !== 1 && this.productCatoryCode === 'NCV' || this.productCatoryCode === 'NC') {
      let exShowRoomCost = form.controls.exShowRoomCost.value ? Number(form.controls.exShowRoomCost.value) : 0;
      let insurance = form.controls.insurance.value ? Number(form.controls.insurance.value) : 0;
      let oneTimeTax = form.controls.oneTimeTax.value ? Number(form.controls.oneTimeTax.value) : 0;
      let others = form.controls.others ? Number(form.controls.others.value) : 0;
      let discount = form.controls.discount.value ? Number(form.controls.discount.value) : 0;
      let amcAmount = form.controls.amcAmount.value ? Number(form.controls.amcAmount.value) : 0;

      if (value === '1') {

        form.get('insurance').enable();
        form.get('insurance').setValidators(Validators.required);
        form.get('insurance').updateValueAndValidity();

        form.get('oneTimeTax').enable();
        form.get('oneTimeTax').setValidators([Validators.required]);
        form.get('oneTimeTax').updateValueAndValidity();

        form.get('others').enable();
        form.get('others').setValidators([Validators.required]);
        form.get('others').updateValueAndValidity();

        form.get('amcAmount').enable();
        form.get('amcAmount').setValidators([Validators.required]);
        form.get('amcAmount').updateValueAndValidity();

        form.get('discount').enable();
        form.get('discount').setValidators([Validators.required]);
        form.get('discount').updateValueAndValidity();

        form.get('insurance').setValue(insurance === 0 ? '' : insurance);
        form.get('oneTimeTax').setValue(oneTimeTax === 0 ? '' : oneTimeTax);
        form.get('others').setValue(others === 0 ? '' : others);
        form.get('amcAmount').setValue(amcAmount === 0 ? '' : amcAmount);
        form.get('discount').setValue(discount === 0 ? '' : discount);

        if (exShowRoomCost >= discount) {
          let costValue = (exShowRoomCost + insurance + oneTimeTax + others + amcAmount) - discount;
          this.onPatchFinalAssetCost(costValue)
          this.basicVehicleForm.patchValue({
            isVaildFinalAssetCost: true
          })

        } else {
          setTimeout(() => {
            this.basicVehicleForm.patchValue({
              isVaildFinalAssetCost: false
            })
          })
          this.toasterService.showError('Discount should not greater than Ex show room price', 'Final Asset Cost')
        }
      } else {
        setTimeout(() => {

          form.get('insurance').disable();
          form.get('insurance').setValue(insurance === 0 ? '' : insurance);

          form.get('oneTimeTax').disable();
          form.get('oneTimeTax').setValue(oneTimeTax === 0 ? '' : oneTimeTax);

          form.get('others').disable();
          form.get('others').setValue(others === 0 ? '' : others);

          form.get('amcAmount').disable();
          form.get('amcAmount').setValue(amcAmount === 0 ? '' : amcAmount);

          form.get('discount').disable();
          form.get('discount').setValue(discount === 0 ? '' : discount);

        })
        this.onPatchFinalAssetCost(form.controls.exShowRoomCost.value)
        this.basicVehicleForm.patchValue({
          isVaildFinalAssetCost: true
        })
      }
    }

  }

  setFormValue() {

    let data = {
      "collateralId": this.id,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    }
    let formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    this.vehicleDetailService.getAnVehicleDetails(data).subscribe((res: any) => {
      this.getAVehicleDetails(res, formArray)
    })

  }

  onPatchArrayValue(formArray, VehicleDetail) {

    formArray.controls[0].patchValue({
      accidentDate: VehicleDetail.accidentDate ? this.utilityService.getDateFromString(VehicleDetail.accidentDate) : '',
      accidentType: VehicleDetail.accidentType || null,
      ageOfAsset: VehicleDetail.ageOfAsset || null,
      assetBodyType: VehicleDetail.vehicleSegmentUniqueCode || '',
      assetCost: VehicleDetail.assetCost || null,
      assetCostCarTrade: VehicleDetail.assetCostCarTrade || null,
      assetCostIBB: VehicleDetail.assetCostIBB || null,
      assetCostLeast: VehicleDetail.assetCostLeast || null,
      assetCostRef: VehicleDetail.assetCostRef || null,
      isVehAvailInGrid: VehicleDetail.isVehAvailInGrid || 0,
      assetMake: VehicleDetail.vehicleMfrUniqueCode || '',
      assetModel: VehicleDetail.vehicleModelCode || '',
      assetVariant: VehicleDetail.assetVarient || '',
      assetSubVarient: VehicleDetail.assetSubVarient || '',
      category: VehicleDetail.category || '',
      chasisNumber: VehicleDetail.chasisNumber || '',
      collateralId: VehicleDetail.collateralId || null,
      collateralType: VehicleDetail.collateralType || null,
      costPerTyre: VehicleDetail.costPerTyre || null,
      cubicCapacity: VehicleDetail.cubicCapacity || '',
      dealerSubventionPartIRR: VehicleDetail.dealerSubventionPartIRR || '',
      dealerSubventionAmount: VehicleDetail.dealerSubventionAmount || null,
      dealerSubventionPartFinCharge: VehicleDetail.dealerSubventionPartFinCharge || '',
      dealerSuventionApproval: VehicleDetail.dealerSuventionApproval || '',
      depositAccountNumber: VehicleDetail.depositAccountNumber || null,
      discount: VehicleDetail.discount || '',
      duplicateRC: VehicleDetail.duplicateRC || '',
      emiProtect: VehicleDetail.emiProtect || '',
      emiProtectAmount: VehicleDetail.emiProtectAmount || '',
      engineNumber: VehicleDetail.engineNumber || '',
      exShowRoomCost: Number(VehicleDetail.exShowRoomCost) || null,
      fastTag: VehicleDetail.fastTag || '',
      fastTagAmount: VehicleDetail.fastTagAmount || null,
      fcAmount: VehicleDetail.fcAmount || null,
      fcExpiryDate: VehicleDetail.fcExpiryDate ? this.utilityService.getDateFromString(VehicleDetail.fcExpiryDate) : '',
      finalAssetCost: VehicleDetail.finalAssetCost || null,
      fitnessDate: VehicleDetail.fitnessDate ? this.utilityService.getDateFromString(VehicleDetail.fitnessDate) : '',
      fsrdFundingReq: VehicleDetail.fsrdFundingReq === '1' ? true : false || '',
      firFiled: VehicleDetail.firFiled === '1' ? true : false || '',
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
      isAuthSvcCentre: VehicleDetail.isAuthSvcCentre || '',
      leadId: Number(this.leadId),
      lmsCollateralId: VehicleDetail.lmsCollateralId || null,
      manuFacMonthYear: VehicleDetail.manuFacMonthYear ? this.utilityService.getDateFromString(VehicleDetail.manuFacMonthYear) : '',
      manuFactureSubventionPartIRR: VehicleDetail.manuFactureSubventionPartIRR || '',
      manufacturesubventionPartFinCharge: VehicleDetail.manufacturesubventionPartFinCharge || '',
      manufacSubventionApplicable: VehicleDetail.manufacSubventionApplicable || '',
      manufactureSubventionAmount: VehicleDetail.manufactureSubventionAmount || null,
      marginAmount: VehicleDetail.marginAmount || null,
      noOfTyres: VehicleDetail.noOfTyres || '',
      noOfUnits: VehicleDetail.noOfUnits || '',
      noOfVehicles: VehicleDetail.noOfVehicles || '',
      oneTimeTax: VehicleDetail.oneTimeTax || '',
      orpValue: VehicleDetail.orpValue || '',
      others: VehicleDetail.others || '',
      onlineVerification: VehicleDetail.onlineVerification === '1' ? true : false || '',
      amcAmount: VehicleDetail.amcAmount || '',
      loanAmount: VehicleDetail.loanAmount ? VehicleDetail.loanAmount : this.eligibleLoanAmount || 0,
      bodyCost: VehicleDetail.bodyCost || null,
      pac: VehicleDetail.pac || '',
      pacAmount: VehicleDetail.pacAmount || null,
      parentLoanAccountNumber: VehicleDetail.parentLoanAccountNumber || null,
      isVehicleDedupe: VehicleDetail.isVehicleDedupe === 'Yes' ? true : false,
      permitExpiryDate: VehicleDetail.permitExpiryDate ? this.utilityService.getDateFromString(VehicleDetail.permitExpiryDate) : '',
      processtionType: VehicleDetail.processtionType || '',
      productCatCode: VehicleDetail.productCatCode || '',
      rcOwnerName: VehicleDetail.rcOwnerName || '',
      reRegVehicle: VehicleDetail.reRegVehicle || '',
      insuranceType: VehicleDetail.insuranceType || '',
      regMonthYear: VehicleDetail.regMonthYear ? this.utilityService.getDateFromString(VehicleDetail.regMonthYear) : '',
      region: VehicleDetail.region || '',
      registrationNo: VehicleDetail.registrationNo || '',
      repairCost: VehicleDetail.repairCost || '',
      seatingCapacity: VehicleDetail.seatingCapacity || '',
      subventionType: VehicleDetail.subventionType || '',
      spareCost: VehicleDetail.spareCost || '',
      svcCentreName: VehicleDetail.svcCentreName || '',
      taxBill: VehicleDetail.taxBill || '',
      taxDetails: VehicleDetail.taxDetails || '',
      totalCost: VehicleDetail.totalCost || '',
      totalTaxBill: VehicleDetail.totalTaxBill || '',
      tyreDealer: VehicleDetail.tyreDealer || '',
      tyreManufacturer: VehicleDetail.tyreManufacturer || '',
      tyreSpecification: VehicleDetail.tyreSpecification || '',
      tonnage: VehicleDetail.tonnage || '',
      scheme: VehicleDetail.scheme || '',
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
      vehicleType: VehicleDetail.vehicleTypeUniqueCode || '',
      ownerMobileNo: VehicleDetail.ownerMobileNo || null,
      address: VehicleDetail.address || '',
      pincode: VehicleDetail.pincode || null,
      expectedNOCDate: VehicleDetail.expectedNOCDate ? this.utilityService.getDateFromString(VehicleDetail.expectedNOCDate) : '',
      vehicleUsage: VehicleDetail.vehicleUsage,
      ageAfterTenure: VehicleDetail.ageAfterTenure || null,
      assetCostGrid: VehicleDetail.assetCostGrid || null,
      userId: this.userId
    })
    this.vehicleRegNoChange = VehicleDetail.vehicleRegNo ? VehicleDetail.vehicleRegNo : '';
    VehicleDetail.vehicleId ? this.getSchemeData(formArray.controls[0]) : '';

    this.udfDetails = VehicleDetail.udfDetails ? VehicleDetail.udfDetails : [];

    if (VehicleDetail.parentLoanAccountNumber) {
      this.isVehicleDedupe = true;
    }

    if (this.productCatoryCode !== 'NCV') {
      this.onGetDateValue(formArray.controls[0].get('manuFacMonthYear').value)
    }

    this.isApiValue = this.basicVehicleForm.getRawValue().vehicleFormArray[0];
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
            assetVariant: '',
            scheme: ''
          })
        } else {
          this.vehicleLov.assetMake = [];
          this.toasterService.showWarning('No Data in Vehicle Master Region', 'Vehicle Master Region')
        }
      } else {
        this.vehicleLov.assetMake = [];
        this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Region')
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
              assetVariant: '',
              scheme: ''
            })

          } else {
            this.vehicleLov.vehicleType = []
            this.toasterService.showWarning('No Data in Vehicle Master Asset Make', 'Vehicle Master Asset Make')
          }
        } else {
          this.vehicleLov.vehicleType = []
          this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Asset Make')
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
              assetVariant: '',
              scheme: ''
            })

          } else {
            this.vehicleLov.assetBodyType = []
            this.toasterService.showWarning('No Data in Vehicle Master Vehicle Type', 'Vehicle Master Vehicle Type')
          }
        } else {
          this.vehicleLov.assetBodyType = []
          this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Vehicle Type')
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
      assetVariant: '',
      scheme: ''
    })
  }

  onAssetModel(value: any, obj) {
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      'vehicleCode', "vehicleVariant")

    obj.patchValue({
      assetVariant: '',
      scheme: ''
    })

  }

  onCallTwoFunction(val: any, obj) {

    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    formArray.controls[0].patchValue({
      vehicleId: val ? Number(val) : 0
    })

    if (val) {
      this.getSchemeData(formArray.controls[0])
    }

    if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UTCR') {
      this.getVehicleGridValue(formArray)
    }

    obj.patchValue({
      scheme: ''
    })

  }

  onChangeMobileNumber(value) {

    this.basicVehicleForm.patchValue({
      isInvalidMobileNumber: true
    })

    // if (value.length === 10) {
    //   if (this.applicantDetails && this.applicantDetails.length > 0) {
    //     this.applicantDetails.filter((mob: any) => {
    //       let mobileNumber = mob.mobileNumber;
    //       if (mobileNumber && mobileNumber.length === 12) {
    //         mobileNumber = mob.mobileNumber.slice(2, 12);
    //       }
    //       setTimeout(() => {

    //         if (mobileNumber === value) {
    //           this.basicVehicleForm.patchValue({
    //             isInvalidMobileNumber: false
    //           })
    //           this.toasterService.showInfo('Applicant and Vehicle Owner Mobile Number Same, Please Change', 'Mobile Number')
    //         } else {
    //           this.basicVehicleForm.patchValue({
    //             isInvalidMobileNumber: true
    //           })
    //         }
    //       })
    //     })
    //   } else {
    //     this.basicVehicleForm.patchValue({
    //       isInvalidMobileNumber: true
    //     })
    //   }
    // }
  }

  getSchemeData(form) {
    let data = {
      "vehicleCode": form.controls.vehicleId.value,
      "leadId": Number(this.leadId)
    }

    this.vehicleDetailService.getScheme(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.vehicleLov.scheme = res.ProcessVariables.scheme ? res.ProcessVariables.scheme : []
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get A Scheme')
      }
    })
  }

  getPincode(pincode) {
    this.basicVehicleForm.patchValue({
      isValidPincode: true
    })
    if (pincode && pincode.length === 6) {
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
        assetSubVarient: [''],
        exShowRoomCost: ['', Validators.required],
        finalAssetCost: [''],
        scheme: [''],
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
        assetSubVarient: [''],
        vehicleUsage: ['', Validators.required],
        exShowRoomCost: ['', Validators.required],
        finalAssetCost: [''],
        scheme: [''],
        noOfVehicles: ['', Validators.required],
        vehicleId: 0,
        collateralId: 0,
        leadId: this.leadId,
        userId: this.userId
      });

    } else if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UTCR') {
      controls = this._fb.group({
        vehicleRegNo: ['', Validators.required],
        region: ['', Validators.required],
        assetMake: ['', Validators.required],
        vehicleType: ['', Validators.required],
        assetBodyType: ['', Validators.required],
        assetModel: ['', Validators.required],
        assetVariant: ['', Validators.required],
        assetSubVarient: [''],
        manuFacMonthYear: ['', Validators.required],
        ageOfAsset: ['', Validators.required],
        ageAfterTenure: ['', Validators.required],
        assetCostGrid: ['', Validators.required],
        isVehAvailInGrid: [0],
        finalAssetCost: [''],
        scheme: [''],
        rcOwnerName: ['', Validators.required],
        ownerMobileNo: ['', Validators.required],
        address: ['', Validators.compose([Validators.maxLength(120), Validators.required])],
        pincode: ['', Validators.compose([Validators.maxLength(6), Validators.required])],
        vehicleId: 0,
        collateralId: 0,
        isVehicleDedupe: true,
        parentLoanAccountNumber: [''],
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
        assetSubVarient: [''],
        manuFacMonthYear: ['', Validators.required],
        ageOfAsset: ['', Validators.required],
        ageAfterTenure: ['', Validators.required],
        assetCostIBB: ['', Validators.required],
        assetCostCarTrade: ['', Validators.required],
        finalAssetCost: [''],
        scheme: [''],
        rcOwnerName: ['', Validators.required],
        ownerMobileNo: ['', Validators.required],
        address: ['', Validators.compose([Validators.maxLength(120), Validators.required])],
        pincode: ['', Validators.compose([Validators.maxLength(6), Validators.required])],
        vehicleUsage: ['', Validators.required],
        category: ['', Validators.required],
        vehicleId: 0,
        isVehicleDedupe: true,
        parentLoanAccountNumber: [''],
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
      this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UTCR' ? this.addUserCVFormControls() : this.addUserCarFormControls();
    this.sharedService.getFormValidation(this.basicVehicleForm)
  }

  addNewCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVarient: '',
      scheme: [''],
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
      isOrpFunding: [''],
      insurance: [''],
      oneTimeTax: [''],
      amcAmount: [''],
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

    if (this.Product !== 'TyreLoan') {
      controls.addControl('invoiceAmount', this._fb.control(null))
      controls.addControl('invoiceNumber', this._fb.control(null))
      controls.addControl('invoiceDate', this._fb.control(''))
    }

    formArray.push(controls);
  }

  addNewcarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      region: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVarient: '',
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
      isOrpFunding: [''],
      insurance: [''],
      amcAmount: [''],
      oneTimeTax: [''],
      pac: [''],
      scheme: [''],
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
    if (this.Product !== 'TyreLoan') {
      controls.addControl('invoiceAmount', this._fb.control(null))
      controls.addControl('invoiceNumber', this._fb.control(null))
      controls.addControl('invoiceDate', this._fb.control(''))
    }

    formArray.push(controls);
  }

  addUserCVFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      vehicleRegNo: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVarient: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      region: ['', Validators.required],
      manuFacMonthYear: ['', Validators.required],
      expectedNOCDate: [''],
      ageOfAsset: ['', Validators.required],
      ageAfterTenure: [''],
      assetCostGrid: ['', Validators.required],
      finalAssetCost: ['', Validators.required],
      fitnessDate: [''],
      scheme: [''],
      isVehAvailInGrid: [0],
      typeOfPermitOthers: [''],
      permitExpiryDate: [''],
      permitUpload: [''],
      chasisNumber: ['', Validators.required],
      engineNumber: ['', Validators.required],
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
      duplicateRC: ['1'],
      cubicCapacity: [''],
      seatingCapacity: [''],
      loanAmount: [0],
      bodyCost: [''],
      idv: [''],
      isVehicleDedupe: true,
      parentLoanAccountNumber: [''],
      insuranceCopy: [''],
      fsrdFundingReq: [''],
      fsrdPremiumAmount: [null],
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    if (!(this.Product === 'FCLoan' || this.Product === 'TaxLoan')) {
      controls.addControl('typeOfPermit', this._fb.control(''))
    }

    if (this.Product !== 'TopUp') {
      controls.addControl('insuranceValidity', this._fb.control(''))
    }
    formArray.push(controls);

  }

  addUserCarFormControls() {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);

    const controls = this._fb.group({
      vehicleRegNo: ['', Validators.required],
      assetMake: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetVariant: ['', Validators.required],
      assetSubVarient: '',
      assetBodyType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      region: ['', Validators.required],
      vehicleUsage: ['', Validators.required],
      category: ['', Validators.required],
      manuFacMonthYear: ['', Validators.required],
      expectedNOCDate: [''],
      ageOfAsset: [''],
      ageAfterTenure: [''],
      assetCostIBB: ['', Validators.required],
      assetCostCarTrade: ['', Validators.required],
      assetCostLeast: '',
      finalAssetCost: ['', Validators.required],
      chasisNumber: ['', Validators.required],
      engineNumber: ['', Validators.required],
      scheme: [''],
      loanAmount: [0],
      bodyCost: [''],
      vehiclePurchasedCost: [''],
      vehicleOwnerShipNumber: null,
      isVehicleDedupe: false,
      parentLoanAccountNumber: [''],
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
      idv: '',
      insuranceType: ['', Validators.required],
      insuranceCopy: [''],
      fsrdFundingReq: '',
      fsrdPremiumAmount: null,
      vehicleId: 0,
      collateralId: 0,
      leadId: this.leadId,
      userId: this.userId
    })
    if (this.Product !== 'TopUp') {
      controls.addControl('insuranceValidity', this._fb.control(''))
    }
    formArray.push(controls);
  }

  onValueForCurrentDate(event) {

    let date = this.utilityService.convertDateTimeTOUTC(new Date(event), 'DD/MM/YYYY')

    let maxConvertDate = this.utilityService.convertDateTimeTOUTC(this.maxDate, 'DD/MM/YYYY')

    if (date < maxConvertDate) {
      this.isMaxDate = true
    } else if (date >= maxConvertDate) {
      this.isMaxDate = false;
    }

  }

  onGetTaxValue(val: any, form) {
    if (val === 'MONTHTAX') {
      this.isTaxDetails = 12;
    } else if (val === 'QUATTAX') {
      this.isTaxDetails = 4;
    } else if (val === 'HALFTAX') {
      this.isTaxDetails = 2;
    } else if (val === 'YEARTAX') {
      this.isTaxDetails = 1;
    }

    if (this.isTaxDetails && this.isTaxBill) {
      let totalCost = Number(this.isTaxDetails) * Number(this.isTaxBill);
      form.get('totalTaxBill').setValue(totalCost)
    } else {
      form.get('totalTaxBill').setValue(null)
    }

  }

  onGetTaxBill(val: string, form) {
    this.isTaxBill = val;
    if (this.isTaxDetails && this.isTaxBill) {
      let totalCost = Number(this.isTaxDetails) * Number(this.isTaxBill);
      form.get('totalTaxBill').setValue(totalCost)
    } else {
      form.get('totalTaxBill').setValue(null)
    }
  }

  onGetTotalCost(value: string, form) {
    this.isRepairCost = value;
    if (this.isSpareCost && this.isRepairCost) {
      let totalCost = Number(this.isSpareCost) + Number(this.isRepairCost);
      form.get('totalCost').setValue(totalCost)
    } else {
      form.get('totalCost').setValue(null)
    }
  }

  getCheckDedupe(val: string, form) {
    if (val && val.length >= 9 && form.controls['vehicleRegNo'].valid) {
      this.isVehicleRegistrationNumber = val;
      this.isVehicleDedupe = true;
    } else {
      this.isVehicleDedupe = false;
    }
  }

  onGetSpareCost(val: string, form) {
    this.isSpareCost = val;
    if (this.isSpareCost && this.isRepairCost) {
      let totalCost = Number(this.isSpareCost) + Number(this.isRepairCost);
      form.get('totalCost').setValue(totalCost)
    } else {
      form.get('totalCost').setValue(null)
    }
  }

  getRegistrationNumber(val: any, form) {

    if (form.controls['vehicleRegNo'].valid && val && val.length >= 9) {

      if (this.vehicleRegNoChange !== val) {

        this.basicVehicleForm.patchValue({
          isCheckDedpue: false
        })
        this.isVehicleRegNoChange = true;
      } else {
        this.isVehicleRegNoChange = false;
      }
    }
  }

  onClose() {
    this.isShowParentLoan = false;
    this.isVehicleRegNoChange = false;
    this.isVehicleDedupe = false;
  }

  getparentLoanAccountNumber(obj) {

    let childData = {
      vehicleRegistrationNumber: obj.controls['vehicleRegNo'].value
    }

    this.basicVehicleForm.patchValue({
      isCheckDedpue: true
    })

    this.childLoanApiService.searchChildLoanApi(childData).subscribe((res: any) => {

      const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
      const details = formArray.at(0) as FormGroup;

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.searchChildLoanData = res;
        this.isVehicleDedupe = true;
        this.isShowParentLoan = true;
        obj.get('parentLoanAccountNumber').setValidators([Validators.required]);
        obj.get('parentLoanAccountNumber').updateValueAndValidity()
        this.loanDetailsData = res.ProcessVariables.loanDetails ? res.ProcessVariables.loanDetails : [];
      } else {
        this.isVehicleDedupe = false;
        this.isShowParentLoan = false;
        this.isVehicleRegNoChange = false;
        obj.get('parentLoanAccountNumber').clearValidators();
        obj.get('parentLoanAccountNumber').updateValueAndValidity();
        obj.get('parentLoanAccountNumber').setValue('')
        this.toasterService.showInfo(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, '')
      }
    })
  }

  getLoanDetails(obj) {
    let data = {
      "loanAccountNumber": obj.get('parentLoanAccountNumber').value,
    }

    this.childLoanApiService.searchChildLoanApi(data).subscribe((res: any) => {

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        if (res.ProcessVariables.loanDetails && res.ProcessVariables.loanDetails.length > 0) {
          this.loanAccountDetails = res.ProcessVariables.loanDetails[0];

          this.loanAccountDetails.principalPaid = this.loanAccountDetails.totalLoanAmount - this.loanAccountDetails.principalOutstanding

          this.loanDetails = true;
          this.isShowLoanDetails = true;
        }

      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get A Vehicle Collateral Details')
      }
    })


  }

  onCloseLoanDetails() {
    this.isShowLoanDetails = false;
  }

  onLoanAccNoSelect(data) {
    const formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    const details = formArray.at(0) as FormGroup;

    details.patchValue({
      parentLoanAccountNumber: data.accountNumber,
      isVehicleDedupe: false
    })
  }

  onCheckVehicleDetails() {

    let formArray = (this.basicVehicleForm.get('vehicleFormArray') as FormArray);
    let details = formArray.at(0) as FormGroup;

    this.id

    let data = {
      'vehicleRegNo': details.get('vehicleRegNo').value,
      'parentLoanAccountNumber': details.get('parentLoanAccountNumber').value,
      "checkDedupe": true,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    }

    let editFiledData = data;

    this.id && this.id !== '0' ? editFiledData['collateralId'] = this.id : data;

    this.vehicleDetailService.getAnVehicleDetails(data).subscribe((res: any) => {
      this.getAVehicleDetails(res, formArray)
    })
  }

  getAVehicleDetails(res, formArray) {
    if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
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

      this.vehicleLov.vehicleType = [{
        key: VehicleDetail.vehicleTypeUniqueCode,
        value: VehicleDetail.vehicleTypeCode
      }]

      this.onPatchArrayValue(formArray, VehicleDetail)
      this.onChangeFinalAssetCost(VehicleDetail.isOrpFunding, formArray.controls[0])
      this.sharedService.getFormValidation(this.basicVehicleForm);

      this.sharedService.getApiValue(this.isApiValue)
      this.vehicleDataService.setIndividualVehicleDetail(VehicleDetail);
      this.isShowParentLoan = false;
      this.isVehicleRegNoChange = false;
    } else {
      this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get A Vehicle Collateral Details')
    }
  }

  onChangeValue() {
    this.sharedService.getFormValidation(this.basicVehicleForm);
  }

  onFormSubmit() {

    let isUdfField = true;
    this.isDirty = true;
    const url = this.location.path();
    if (this.userDefineForm) {
      isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true
    }

    if (this.basicVehicleForm.valid && isUdfField) {
      let data = this.basicVehicleForm.value.vehicleFormArray[0];

      this.isDirty = false;

      if (this.basicVehicleForm.value.isCheckDedpue === false) {
        this.toasterService.showError('Please check dedupe', 'Vehicle Detail')
        return
      }

      if (this.basicVehicleForm.value.isValidPincode && this.basicVehicleForm.value.isInvalidMobileNumber) {

        if (data && data.fcExpiryDate) {
          data.fcExpiryDate = data.fcExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.fcExpiryDate, 'DD/MM/YYYY') : ''
        }

        if (data.firFiled) {
          data.firFiled = data.firFiled === true ? '1' : '0';
        }

        if (data.onlineVerification) {
          data.onlineVerification = data.onlineVerification === true ? '1' : '0';
        }

        if (data.insuranceValidity) {
          data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : '';
        }

        if (data.accidentDate) {
          data.accidentDate = data.accidentDate ? this.utilityService.convertDateTimeTOUTC(data.accidentDate, 'DD/MM/YYYY') : '';
        }

        if (data.invoiceDate) {
          data.invoiceDate = data.invoiceDate ? this.utilityService.convertDateTimeTOUTC(data.invoiceDate, 'DD/MM/YYYY') : '';
        }


        if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC' || this.productCatoryCode === 'UTCR') {
          data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');
          data.ageOfAsset = data.ageOfAsset ? data.ageOfAsset.split(' ')[0] : null;
          data.ageAfterTenure = data.ageAfterTenure ? data.ageAfterTenure.split(' ')[0] : null;
          if (url.includes('dde')) {
            data.expectedNOCDate = data.expectedNOCDate ? this.utilityService.convertDateTimeTOUTC(data.expectedNOCDate, 'DD/MM/YYYY') : '';
          }
        }
        if (url.includes('dde')) {
          data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate, 'DD/MM/YYYY') : '';
          data.permitExpiryDate = data.permitExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpiryDate, 'DD/MM/YYYY') : '';
          data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate, 'DD/MM/YYYY') : '';
          data.fsrdFundingReq = data.fsrdFundingReq === true ? '1' : '0';
        }

        data.udfDetails = [{
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId,
          "udfData": JSON.stringify(
            this.userDefineForm && this.userDefineForm.udfData ?
              this.userDefineForm.udfData.getRawValue() : {}
          )
        }]

        this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.isApiValue = this.basicVehicleForm.getRawValue().vehicleFormArray[0];
            this.initUDFValues = this.userDefineForm.udfData.getRawValue();
            this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle Details');
            this.getVehicleDetails(this.leadId);
            //this.router.navigate(['pages/lead-section/' + this.leadId + '/vehicle-list']);
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Details')
          }
        }, error => {
          console.log(error, 'error')
          this.toasterService.showError(error, 'Vehicle Details')
        })
      } else {
        if (!this.basicVehicleForm.value.isInvalidMobileNumber) {
          this.toasterService.showError('applicant and dealer of vehicle owner mobile number both are same', 'Invalid mobile no')
        } else if (!this.basicVehicleForm.value.isValidPincode) {
          this.toasterService.showError('Please enter valid pincode', 'Invalid pincode')
        } else if (!(this.basicVehicleForm.value.isValidPincode && this.basicVehicleForm.value.isInvalidMobileNumber)) {
          this.toasterService.showError('Please enter valid pincode and mobile no', 'Invalid pincode & mobile no')
        } else if (url.includes('dde') && !this.basicVehicleForm.value.isVaildFinalAssetCost) {
          this.toasterService.showError('Discount should not greater than Ex show room price', 'Invalid Final Asset Cost')
        }

      }
    } else {
      this.isDirty = true;
      this.utilityService.validateAllFormFields(this.basicVehicleForm)
      console.log(this.basicVehicleForm, 'basicVehicleForm')
      this.toasterService.showError('Please enter all mandatory field', 'Vehicle Detail')
    }
  }


  onCredit() {

    const body = { leadId: this.leadId };
    this.creditService.getCreditScore(body).subscribe((res: any) => {
      const resObj = res;
      // tslint:disable-next-line: no-bitwise
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        const bodyRes = res;
        this.creditService.setResponseForCibil(bodyRes);

        const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
        const product = leadSectioData.leadDetails.productCatCode;
        if (product === 'NCV' || product === 'UCV' || product === 'UC' || product === 'UTCR') {
          this.showNotCoApplicant = this.applicantDataStoreService.findCoApplicant(this.applicantList)
          if (!this.showNotCoApplicant) {
            this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
          }
        }

        if (product === "NCV") {
          const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
          if (!result) {
            this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
          }
        }

        this.showEligibilityScreen = res.ProcessVariables.showEligibilityScreen;
        if (!this.showEligibilityScreen) {
          this.eligibleModal = true;
          return;
        }

        this.router.navigate([`pages/lead-section/${this.leadId}/credit-score`]);
      } else {
        this.errorMessage = res.ProcessVariables.error ? res.ProcessVariables.error.message : res.ErrorMessage;
        this.isModelShow = true;
      }
    });


  }

  navigateToSales() {
    const body = {
      leadId: this.leadId,
      userId: this.userId,
      statusType: 'accept'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code === '0') {
        this.router.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
      }
    });
  }

  onEligibleModalClose() {
    this.eligibleModal = false;
  }

  onBack() {
    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`)

    } else if (currentUrl.includes('dde')) {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`)
    } else {
      this.router.navigateByUrl(`/pages/lead-section/${this.leadId}/applicant-details`)
    }
  }

  onUrlOfNext() {
    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {
      this.router.navigate([`pages/sales/${this.leadId}/reference`]);
    } else if (currentUrl.includes('dde')) {
      this.router.navigate([`pages/dde/${this.leadId}/additional-collateral-list`]);
    } else {
      this.onCredit()
    }
  }

  onNext() {
    const currentUrl = this.location.path();
    this.finalValue = this.basicVehicleForm.getRawValue().vehicleFormArray[0];
    this.editedUDFValues = this.userDefineForm ? this.userDefineForm.udfData.getRawValue() : {};

    // if (this.finalValue['finalAssetCost']) {
    //   this.finalValue['finalAssetCost'] =
    //   typeof (this.isApiValue['finalAssetCost']) === 'string' ? String(this.finalValue['finalAssetCost']) :
    //     Number(this.finalValue['finalAssetCost']);
    // }

    const isValueCheck = this.objectComparisonService.compare(this.isApiValue, this.finalValue);
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)

    if (this.loanViewService.checkIsLoan360() || this.toggleDdeService.getOperationType()) {
      this.onUrlOfNext();
      return;
    }

    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    if (this.basicVehicleForm.invalid || isUDFInvalid) {
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }


    console.log(this.isApiValue, 'isValueCheck')
    console.log(this.finalValue, 'isValueCheck', isValueCheck)


    if (!isValueCheck || !isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }

    if (currentUrl.includes('sales')) {
      const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
      const product = leadSectioData.leadDetails.productCatCode;

      if (product === 'NCV' || product === 'UCV' || product === 'UC' || product === 'UTCR') {
        const showNotCoApplicant = this.applicantDataStoreService.findCoApplicant(this.applicantList)
        if (!showNotCoApplicant) {
          this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
        }
      }

      if (product === "NCV") {
        const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
        if (!result) {
          this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
        }
      }

      this.onUrlOfNext();

    } else if (currentUrl.includes('dde')) {
      const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
      const product = leadSectioData.leadDetails.productCatCode;

      if (product === "NCV") {
        const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
        if (!result) {
          this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
        }
      }
      this.router.navigate([`pages/dde/${this.leadId}/additional-collateral-list`]);

    } else {
      this.onCredit()
    }
  }



}