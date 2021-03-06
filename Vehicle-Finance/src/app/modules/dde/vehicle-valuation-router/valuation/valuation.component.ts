import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LabelsService } from '@services/labels.service';
import { ToasterService } from '@services/toaster.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleValuationService } from '@modules/dde/services/vehicle-valuation.service';
import { UtilityService } from '@services/utility.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { LoginStoreService } from '@services/login-store.service';
import { LoanViewService } from '@services/loan-view.service';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { UploadService } from '@services/upload.service';
import { GpsService } from '@services/gps.service';
import { Constant } from '../../../../../assets/constants/constant';
import { environment } from 'src/environments/environment';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { LoginService } from '@modules/login/login/login.service';


@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent implements OnInit {

  vehicleValuationForm: FormGroup;
  leadId;
  colleteralId;
  public minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 15));
  maxDate = new Date();
  valuationList: [];
  LOV: any = [];
  labels: any = {};
  vehicleValuationDetails: any = {};
  isInputField = false;
  isDirty: boolean;
  isLoan360: boolean;
  customFutureDate: boolean;
  public toDayDate: Date = new Date();
  currentYear = new Date().getFullYear();
  yearCheck = [];
  valuatorType: string;
  valuatorCode: string;
  valuatorName: string;
  nameOfVehicleOwner: string;
  mobileNumberOfVehicleOwner: string;
  vehicleAddress: string;
  vehiclePincode: string;
  assetCostGrid: string;
  disableSaveBtn: boolean;
  leadCreatedDate: any;
  listArray: FormArray;
  partsArray: FormArray;
  accessoriesArray: FormArray;
  // lov data
  private vehicleCode: any;
  public vehicleLov: any = {};
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetVariant: any = [];

  valuesToYesNo: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];
  public vehicleRegPattern: {
    rule?: any;
    msg?: string;
  }[];

  monthsLOVS: any = [
    { key: 'January', value: 'January' }, { key: "February", value: "February" },
    { key: "March", value: "March" }, { key: "April", value: "April" }, { key: "May", value: "May" },
    { key: "June", value: "June" }, { key: "July", value: "July" }, { key: "August", value: "August" },
    { key: "September", value: "September" }, { key: "October", value: "October" },
    { key: "November", value: "November" }, { key: "December", value: "December" },
  ];
  ownerSerialNo: any = [
    { key: 1, value: 'First Owner' }, { key: 2, value: 'Second Owner' },
    { key: 3, value: 'Third Owner' }, { key: 4, value: 'Fourth Owner' },
    { key: 5, value: 'Fifth Owner' }, { key: 6, value: 'Sixth Owner' },
    { key: 7, value: 'Seventh Owner' }, { key: 8, value: 'Eigth Owner' },

  ];
  rcBookStatusLOV: any = [
    { key: 1, value: 'Original' }, { key: 2, value: 'Duplicate' },
    { key: 3, value: 'Xerox Copy' }, { key: 4, value: 'Not Available' }
  ];
  leadDetails: any;
  productCategoryCode: any;
  partsLOV: any = [
    { key: 0, value: 'Engine' }, { key: 1, value: 'Transmission' }, { key: 2, value: 'Battery' },
    { key: 3, value: 'Electrical parts' }, { key: 4, value: 'Chassis' }, { key: 5, value: 'Body' },
    { key: 6, value: 'Paint' }, { key: 7, value: 'Suspension' }, { key: 8, value: 'Condition Of Tyres' },
    { key: 9, value: 'Steering Assy' }, { key: 10, value: 'Upholstery' },

  ];
  partName: any;
  conditionLov: any = [
    { key: 0, value: 'Good' },
    { key: 1, value: 'Average' },
    { key: 2, value: 'Poor' },
  ];
  ratingScaleLov: any = [
    { key: 1, value: '1' }, { key: 2, value: '2' }
    , { key: 3, value: '3' }, { key: 4, value: '4' },
    { key: 5, value: '5' }
  ];
  accessoriesLov: any = [
    { key: 0, value: 'CD Player' }, { key: 1, value: 'AC' },
    { key: 2, value: 'FAN' },
    { key: 4, value: 'PARKING CAMERA' }

  ];
  accessoryName: any;
  remarksRatingScaleLov: any = [
    { key: 1, value: '1' }, { key: 2, value: '2' },
    { key: 3, value: '3' }, { key: 4, value: '4' },
    { key: 5, value: '5' }, { key: 5, value: '6' },
    { key: 7, value: '7' }, { key: 0, value: '8' },
    { key: 9, value: '9' }, { key: 10, value: '10' },
  ];
  vehiclePermitStatus: any = [
    { key: '1VEHPERSTATUS', value: 'Valid' },
    { key: '2VEHPERSTATUS', value: 'surrendered' },
    { key: '3VEHPERSTATUS', value: 'Not Available' }
  ];
  fuelUsedType: any;
  fuelTypeLOV: any;
  userId: any;
  roles: any;
  roleId: any;
  roleName: any;
  roleType: any;
  userDetails: any;
  userName: any;
  initiationDate: any;
  engineStartedType: any;
  vehicleMovedDisabled: boolean;
  vehicleMovedRequired: boolean;
  isOnline: any;
  disableForm: boolean;
  yearMonthOfManufact: any;
  yearMonthOfManufacturer: any;
  reportUrl: any;
  personInitiatedBy: any;
  regDateAndMonth: any;
  manufactureDate: Date;
  permitType: any;
  permitDisabled: boolean;
  permitRequired: boolean;
  invalidPemitDate: boolean;
  invalidFitnessDate: boolean;
  invalidTaxDate: boolean;
  invalidTaxPaid: boolean;
  modelInProd: any;
  currentInvoiceDisabled: boolean;
  currentInvoiceRequired: boolean;
  invalidInsDate: boolean;
  invalidInsuranceValidity: boolean;
  regNo: any;
  isPreRegNoDisabled: boolean;
  isPreRegNoRequired: boolean;
  accInPast: any;
  extValuator: boolean;
  disablePdfDownload: boolean;
  selectedDocDetails: DocRequest;
  showModal: boolean;
  isMobile: any;
  base64Image: any;
  latitude: string = null;
  longitude: string = null;
  capturedAddress: string = null;
  documentArr: DocumentDetails[] = [];
  SELFIE_IMAGE: string;
  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;
  dmsDocumentId: string;
  vehiclePhotoRequired: boolean;
  taskId: any;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId: any;
  udfGroupId: any;
  initUDFValues: any;
  editedUDFValues: any;
  public format = 'dd/MM/yyyy HH:mm';
  presentTime: any;
  invalidRegDate: boolean;
  invalidInsuDiff: boolean;
  count: number;
  initalZeroCheck = [];
  remarksRequired: boolean;
  apiValue: any;
  finalValue: any;
 




  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private vehicleValuationService: VehicleValuationService,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private vehicleDetailService: VehicleDetailService,
    private uiLoader: NgxUiLoaderService,
    private createLeadDataService: CreateLeadDataService,
    private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService,
    // tslint:disable-next-line: no-shadowed-variable
    private loanViewService: LoanViewService,
    private uploadService: UploadService,
    private gpsService: GpsService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private loginService: LoginService,
    private objectComparisonService: ObjectComparisonService) {
    this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];

    this.listArray = this.fb.array([]);
    this.partsArray = this.fb.array([]);
    this.accessoriesArray = this.fb.array([]);
    this.isMobile = environment.isMobile;
    // this.isMobile = true;
    const hour = this.toDayDate.getHours();
    const minutes = this.toDayDate.getMinutes();
    this.presentTime = hour + ':' + minutes
  }

  async ngOnInit() {

    if (this.isMobile) {
      this.checkGpsEnabled();
    }

    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));

    this.isLoan360 = this.loanViewService.checkIsLoan360();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    //  details from loginstore service
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.userDetails = roleAndUserDetails.userDetails;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    this.userName = this.userDetails.firstName;
    console.log('user details ==> ', roleAndUserDetails);
    console.log('user id ==>', this.userId);
    console.log('user name', this.userName);
    console.log('role id', this.roleId);
    console.log('role name', this.roleName);
    if (this.roleType === 9) {
      this.udfGroupId = 'VAG001'
      //this.udfScreenId = 'VAS001'
    } else if (this.roleType === 2) {
      this.udfGroupId = 'VAG001'
      //this.udfScreenId = 'VAS002'
    }
    if (this.roleId === 86) {
      this.extValuator = true;
    }
    console.log('today date', this.toDayDate);
    console.log('min date', this.minDate);
    this.minDate = this.utilityService.getDateFromString(this.utilityService.getDateFormat(this.minDate));
    this.toDayDate = this.utilityService.getDateFromString(this.utilityService.getDateFormat(this.toDayDate));
    console.log('min date', this.minDate);
    console.log('today date', this.toDayDate);
    this.getLabels();
    this.InitForm();
    this.getLOV();
    //return;
    this.leadId = (await this.getLeadId()) as number;
    // this.getLeadId();
    // console.log('LEADID::::', this.leadId);
    this.colleteralId = (await this.getCollateralId()) as Number;
    // this.getCollateralId();
    // console.log('COLLATERALID::::', this.colleteralId);
    this.getVehicleValuation();
    this.getLeadSectionData();
    this.yearCheck = [{ rule: val => val > this.currentYear, msg: 'Future year not accepted' }];
    // this.toDayDate = this.utilityService.getDateFromString(this.utilityService.getDateFormat(this.toDayDate));
    this.vehicleRegPattern = this.validateCustomPattern();
    setTimeout(() => {
      const operationType = this.toggleDdeService.getOperationType();
      if (operationType) {
        this.vehicleValuationForm.disable();
        this.disableSaveBtn = true;
      }

      if (this.loanViewService.checkIsLoan360()) {
        this.vehicleValuationForm.disable();
        this.disableSaveBtn = true;
      }

    });
    // console.log('valuation form', this.vehicleValuationForm);
    // console.log('vehicle lov', this.vehicleLov);

    this.selectedDocDetails = {
      docsType: this.PROFILE_TYPE,
      docSize: this.OTHER_DOCUMENTS_SIZE,
      docTp: "LEAD",
      docSbCtgry: "ACCOUNT OPENING FORM",
      docNm: "ACCOUNT_OPENING_FORM20206216328474448.pdf",
      docCtgryCd: 70,
      docCatg: "KYC - I",
      docTypCd: 276,
      flLoc: "",
      docCmnts: "Addition of document for Lead Creation",
      bsPyld: "Base64 data of the image",
      docSbCtgryCd: 204,
      docsTypeForString: "selfie",
      docRefId: [
        {
          idTp: 'LEDID',
          id: this.leadId,
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
    };

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;
      if (this.roleType === 9) {
        this.udfScreenId = udfScreenId.VehicleValuation.vehicleValuation;
      } else if (this.roleType === 2) {
        this.udfScreenId = udfScreenId.DDE.vehicleValuationDDE
      }

    })

  }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data: any) => (this.labels = data),
      // (error) => console.log("Vehicle Valuation Label Error", error)
    );
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.aRoute.params.subscribe((value) => {
        const leadId = value.leadId;
        if (leadId) {
          resolve(Number(leadId));
        }
        resolve(null);
      });
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((value: any) => {
      this.LOV = value.LOVS;
      this.vehicleLov.region = value.LOVS.assetRegion;
      this.vehicleLov.vehicleCategory = value.LOVS.vehicleCategory;
      this.fuelTypeLOV = this.LOV.fuelType;

      this.LOV.defaultfinanciers = this.LOV.financiers;

      let defaultfinanciers = [{
        key: 'Not-Applicable', 
        value: 'NA'
      }]

      this.LOV.defaultfinanciers = defaultfinanciers.concat(this.LOV.financiers);

    });
    console.log(' LOV**** --->', this.LOV);
  }
  getDateFormat(date) { // fun for converting the response date to the valid form date 

    // console.log('in getDateFormat', date);
    const datePart = date.match(/\d+/g);
    const month = datePart[1];
    const day = datePart[0];
    const year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
    // console.log('formated data', dateFormat);
    return dateFormat;
  }

  getCollateralId() {
    return new Promise((resolve, reject) => {
      this.aRoute.firstChild.params.subscribe((value) => {
        const colleteralId = value.colleteralId;
        if (colleteralId) {
          resolve(Number(colleteralId));
        }
        resolve(null);
      });
    });
  }

  // onInspectionTimeChange(){
  //   const inspectionTime = this.vehicleValuationForm.get('inspectionDetails').get('timeOfInspection').value;
  //   let inspectionDate = this.vehicleValuationForm.get('inspectionDetails').get('inspectionDate').value;
  //   inspectionDate = new Date(inspectionDate);
  //   if(this.toDayDate.getTime() !== inspectionDate.getTime()){
  //     return;
  //   }
  //   const todayDate = new Date()
  //   const hour = todayDate.getHours();
  //   const minutes = todayDate.getMinutes();
  //   this.presentTime = hour + ':' + minutes
  //   //console.log(event,'event', this.vehicleValuationForm.get('inspectionDetails').get('timeOfInspection'))
  //   const presentTime = this.hourMinuteConvertion(this.presentTime);
  //   const enteredTime = this.hourMinuteConvertion(inspectionTime);
  //   if(enteredTime.hour > presentTime.hour){
  //     this.invalidTimeError = true;  
  //     return;   
  //   } 
  //   if((enteredTime.hour === presentTime.hour) && (enteredTime.minute > presentTime.minute)){
  //     this.invalidTimeError = true;
  //   }
  //   else{
  //     this.invalidTimeError = false;
  //   }
  // }

  // hourMinuteConvertion(value){
  //   const splittedValue = value.split(':')
  //   const hour = splittedValue[0];
  //   const minute = splittedValue[1];
  //   const timeObj={
  //     hour : hour,
  //     minute : minute
  //   }
  //   return timeObj
  // }

  // onInspectionDateChange(){
  //   let inspectionDate = this.vehicleValuationForm.get('inspectionDetails').get('inspectionDate').value;
  //   inspectionDate = new Date(inspectionDate);
  //   const inspectionTime = this.vehicleValuationForm.get('inspectionDetails').get('timeOfInspection').value;
  //   if((this.toDayDate.getTime() === inspectionDate.getTime()) && inspectionTime){  
  //     this.onInspectionTimeChange()
  //   }else{
  //     this.invalidTimeError = false;
  //   }
  // }

  // Custom Validation Pattern For Vehicle Number
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
            return true;
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return regPatternData;
  }

  // GET LEAD SECTION DATA
  getLeadSectionData() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails']
    console.log('lead data', leadData);
    this.productCategoryCode = this.leadDetails['productCatCode'];
    // this.leadCreatedDate = new Date(leadData['leadDetails'].leadCreatedOn);
    let leadCreatedDate = String(leadData['leadDetails'].leadCreatedOn).slice(0, 10);
    this.leadCreatedDate = this.utilityService.getDateFromString(leadCreatedDate);
    // this.leadCreatedDate = this.utilityService.getDateFromString(leadData['leadDetails'].leadCreatedOn);
    // console.log("LEAD_CREATED_DATE::", this.vehicleValuationForm.get('valuationDate').value >= this.leadCreatedDate);
    // console.log('LEAD_CREATED_DATE::', this.leadCreatedDate);
    // console.log('MAX_DATE::', this.toDayDate);


  }

  // CHANGE EVENT FUNCTION FOR monthLOVS
  // onChangeMonthValues(event: any) {
  //   const monthChange = event.target.value;
  //   console.log("CHANGE_IN_MONTH::", monthChange);
  // }

  // CHANGE_YEAR
  onGetDateValue(event) {
    //  const yearOfManufacturer = event;
    // console.log("YEAR_OF_MANUFACTURER::", yearOfManufacturer);
    // if (yearOfManufacturer > this.toDayDate) {
    //   this.customFutureDate = true;
    // } else {
    //   this.customFutureDate = false;
    // }
    console.log('in on get date value fn');
    console.log(this.vehicleValuationForm);
    this.customFutureDate = false;
    if (event > this.toDayDate) {
      this.customFutureDate = true;
    } else {
      this.customFutureDate = false;
      this.vehicleValuationForm.get('registerationDetails').patchValue({
        ageOfAsset: Number(this.utilityService.ageFromAsset(event))
      });
    }
  }
  validateDateOfReg() {
    const regDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg) : null;
    console.log('reg date', regDate);
    const mfctrDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.yearOfManufacturer)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.yearOfManufacturer) : null;
    console.log('mfctr date', mfctrDate);
    if (regDate !== null && mfctrDate !== null) {
      if (regDate < mfctrDate) {
        this.invalidRegDate = true;
        this.toasterService.showWarning('Registration Date should be greater than Month and Year Of Manufacture', '');
      }else{
        this.invalidRegDate = false;

      }
    }
    console.log('Form Data', this.vehicleValuationForm);

  }
  onPermitChange(event: any) {
    this.permitType = event ? event : '';
    if (this.permitType === '3VEHPERSTATUS') {
      this.permitDisabled = true;
      this.permitRequired = false;
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').disable();
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').clearValidators();
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').updateValueAndValidity();
      // setTimeout(() => {
      //   this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').patchValue(null);

      // });
      this.vehicleValuationForm.removeControl('permitValidUpto');
      console.log('this form after permit', this.vehicleValuationForm);
    } else if (this.engineStartedType !== '3VEHPERSTATUS') {
      this.permitDisabled = false;
      this.permitRequired = true;
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').enable();
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').setValidators(Validators.required);
      this.vehicleValuationForm.get('permitAndTaxDetails').get('permitValidUpto').updateValueAndValidity();
    }


  }

  // tslint:disable-next-line: no-shadowed-variable
  validatingBeforeRegDate(value?: any) {
    console.log('value', value);
    const regDate = new Date(this.vehicleValuationForm.value.dateofReg)
      ? new Date(this.vehicleValuationForm.value.dateofReg) : null;
    const permitDate = new Date(this.vehicleValuationForm.value.permitValidUpto)
      ? new Date(this.vehicleValuationForm.value.permitValidUpto) : null;
    const fitnessDate = new Date(this.vehicleValuationForm.value.fcExpiryDate)
      ? new Date(this.vehicleValuationForm.value.fcExpiryDate) : null;
    const taxDate = new Date(this.vehicleValuationForm.value.taxValidUpto)
      ? new Date(this.vehicleValuationForm.value.taxValidUpto) : null;
    const insuranceDate = new Date(this.vehicleValuationForm.value.validFrom)
      ? new Date(this.vehicleValuationForm.value.validFrom) : null;


    if (value === 'permitDate') {
      if (regDate !== null && permitDate !== null) {
        if (permitDate < regDate) {
          this.invalidPemitDate = true;
          this.toasterService.showWarning('Permit Validity Date should be greater than Registration Date', '');
        } else {
          this.invalidPemitDate = false;
        }
      }
    } else if (value === 'fitnessDate') {
      if (regDate !== null && fitnessDate !== null) {
        if (fitnessDate < regDate) {
          this.invalidFitnessDate = true;
          this.toasterService.showWarning('Fitness Validity Date should be greater than Registration Date', '');
        } else {
          this.invalidFitnessDate = false;
        }
      }
    } else if (value === 'taxDate') {
      if (regDate !== null && taxDate !== null) {
        if (taxDate < regDate) {
          this.invalidTaxDate = true;
          this.toasterService.showWarning('Tax Validity Date should be greater than Registration Date', '');
        } else {
          this.invalidTaxDate = false;
        }
      }
    } else if (value === 'insuranceDate') {
      if (regDate !== null && insuranceDate !== null) {
        if (insuranceDate < regDate) {
          this.invalidInsDate = true;
          this.toasterService.showWarning('Insurance Valid From should be greater than Registration Date', '');
        } else {
          this.invalidInsDate = false;
        }
      }
    }
  }

  validateFitnessDate() {
    const regDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg) : null;
    // const permitDate = new Date(this.vehicleValuationForm.value.permitValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.permitValidUpto) : null;
    const fitnessDate = new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.fcExpiryDate)
      ? new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.fcExpiryDate) : null;
    // const taxDate = new Date(this.vehicleValuationForm.value.taxValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.taxValidUpto) : null;
    // const insuranceDate = new Date(this.vehicleValuationForm.value.validFrom)
    //   ? new Date(this.vehicleValuationForm.value.validFrom) : null;


    if (regDate !== null && fitnessDate !== null) {
      if (fitnessDate < regDate) {
        this.invalidFitnessDate = true;
        
        this.toasterService.showWarning('Fitness Validity Date should be greater than Registration Date', '');
      } else {
        this.invalidFitnessDate = false;
      }
    }
  }
  validateInsuranceDate() {
    const regDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg) : null;
    // const permitDate = new Date(this.vehicleValuationForm.value.permitValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.permitValidUpto) : null;
    // const fitnessDate = new Date(this.vehicleValuationForm.value.fcExpiryDate)
    //   ? new Date(this.vehicleValuationForm.value.fcExpiryDate) : null;
    // const taxDate = new Date(this.vehicleValuationForm.value.taxValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.taxValidUpto) : null;
    const insuranceDate = new Date(this.vehicleValuationForm.get('insuranceDetails').value.validFrom)
      ? new Date(this.vehicleValuationForm.get('insuranceDetails').value.validFrom) : null;


    if (regDate !== null && insuranceDate !== null) {
      if (insuranceDate < regDate) {
        this.invalidInsDate = true;
        
        this.toasterService.showWarning('Insurance Valid From should be greater than Registration Date', '');
      } else {
        this.invalidInsDate = false;
      }
    }
  }
  validatePermitDate() {
    const regDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg) : null;
    const permitDate = new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.permitValidUpto)
      ? new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.permitValidUpto) : null;
    // const fitnessDate = new Date(this.vehicleValuationForm.value.fcExpiryDate)
    //   ? new Date(this.vehicleValuationForm.value.fcExpiryDate) : null;
    // const taxDate = new Date(this.vehicleValuationForm.value.taxValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.taxValidUpto) : null;
    // const insuranceDate = new Date(this.vehicleValuationForm.value.validFrom)
    //   ? new Date(this.vehicleValuationForm.value.validFrom) : null;


    if (regDate !== null && permitDate !== null) {
      if (permitDate < regDate) {
        this.invalidPemitDate = true;
        this.toasterService.showWarning('Permit Validity Date should be greater than Registration Date', '');
      } else {
        this.invalidPemitDate = false;
      }

    }
  }
  validateTaxDate() {
    const regDate = new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg)
      ? new Date(this.vehicleValuationForm.get('registerationDetails').value.dateofReg) : null;
    // const permitDate = new Date(this.vehicleValuationForm.value.permitValidUpto)
    //   ? new Date(this.vehicleValuationForm.value.permitValidUpto) : null;
    // const fitnessDate = new Date(this.vehicleValuationForm.value.fcExpiryDate)
    //   ? new Date(this.vehicleValuationForm.value.fcExpiryDate) : null;
    const taxDate = new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.taxValidUpto)
      ? new Date(this.vehicleValuationForm.get('permitAndTaxDetails').value.taxValidUpto) : null;
    // const insuranceDate = new Date(this.vehicleValuationForm.value.validFrom)
    //   ? new Date(this.vehicleValuationForm.value.validFrom) : null;


    if (regDate !== null && taxDate !== null) {
      if (taxDate < regDate) {
        this.invalidTaxDate = true;
        
        this.toasterService.showWarning('Tax Validity Date should be greater than Registration Date', '');
      } else {
        this.invalidTaxDate = false;
      }
    }
  }


  taxPaidCheck() {
    const taxPaid = Number(this.vehicleValuationForm.get('permitAndTaxDetails').value.taxPaid) ?
      Number(this.vehicleValuationForm.get('permitAndTaxDetails').value.taxPaid) : null;
    console.log('tax paid', taxPaid);
    const valuationAmount = Number(this.vehicleValuationForm.get('recomendationDetails').value.valuationAmt) ?
      Number(this.vehicleValuationForm.get('recomendationDetails').value.valuationAmt) : null;
    console.log('valuation amount', valuationAmount);
    // if (taxPaid === valuationAmount) {
    //   console.log('equal amounts');
    // }
    if (taxPaid !== null && valuationAmount !== null) {
      if (taxPaid > valuationAmount) {
        this.invalidTaxPaid = true;
        this.toasterService.showWarning('Tax Paid should not be greater than Vehicle Value', '');
      } else if (taxPaid < valuationAmount) {
        this.invalidTaxPaid = false;
      }
    }
  }
  accidentsInPast(event?: any) {
    console.log(event);
    this.accInPast = event ? event : null;
    this.remarksRequired = false;
    // const currnentInvoice = this.vehicleValuationForm.get('remarksDetails').value.currInvoiceValue;
    // console.log(currnentInvoice);
    if (this.accInPast === '0') {
      // this.currentInvoiceRequired = false;
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').disable();
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').clearValidators();
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').updateValueAndValidity();
      setTimeout(() => {
        
        this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').patchValue(null);

      });
    } else if (this.accInPast === '1') {
      // this.currentInvoiceDisabled = false;
      // this.currentInvoiceRequired = true;
    this.remarksRequired = true;
      setTimeout(() => {
        this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').patchValue(null);

      });
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').enable();
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').setValidators(Validators.required);
      this.vehicleValuationForm.get('remarksDetails').get('valuatorRemarks').updateValueAndValidity();
    }

  }
  modelInProdChange(event?: any) {
    console.log(event);
    this.modelInProd = event ? event : null;
    const currnentInvoice = this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').value ? this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').value : this.vehicleValuationDetails.currInvoiceValue;
    console.log(currnentInvoice);
    
    if (this.modelInProd === '0') {
      this.currentInvoiceDisabled = true;
      this.currentInvoiceRequired = false;
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').disable();
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').clearValidators();
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').updateValueAndValidity();
      setTimeout(() => {
        this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').patchValue(currnentInvoice || null);

      });
    } else if (this.modelInProd === '1') {
      this.currentInvoiceDisabled = false;
      this.currentInvoiceRequired = true;
      // console.log('in no condition', this.modelInProd, this.currentInvoiceDisabled, this.currentInvoiceRequired);
      setTimeout(() => {
        this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').patchValue(currnentInvoice || null);
      });
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').enable();
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').setValidators(Validators.required);
      this.vehicleValuationForm.get('remarksDetails').get('currInvoiceValue').updateValueAndValidity();
    }
  }
  onRegistrationNoChange(event?: any) {
    const registrationNo = event ? event : null;
    console.log('in reg no change', event);
    this.regNo = registrationNo;
    this.vehicleValuationForm.get('registerationDetails').patchValue({
      regdNo: this.regNo ? this.regNo : ''
    });

  }

  insuranceValidUptoCheck() {
    console.log(' in valid upto');
    const insuranceValidFrom = new Date(this.vehicleValuationForm.get('insuranceDetails').value.validFrom)
      ? new Date(this.vehicleValuationForm.get('insuranceDetails').value.validFrom) : null;
    const insuranceValidUpto = new Date(this.vehicleValuationForm.get('insuranceDetails').value.validUpto)
      ? new Date(this.vehicleValuationForm.get('insuranceDetails').value.validUpto) : null;
    // const validFromMonth = Number(insuranceValidFrom.getMonth()) + 1;
    // time difference
    const timeDiff = Math.abs(insuranceValidUpto.getTime() - insuranceValidFrom.getTime());
    // days difference
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // if (insuranceValidUpto) { }
    if (insuranceValidUpto < insuranceValidFrom) {
      this.invalidInsuranceValidity = true;
      
      this.toasterService.showWarning('Insurance Validity Date should be greater than insurance Start Date', '');
    } else if (insuranceValidUpto > insuranceValidFrom) {
      this.invalidInsuranceValidity = false;
      // tslint:disable-next-line: align
      function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
console.log(insuranceValidUpto.getFullYear());
  if(leapYear(insuranceValidUpto.getFullYear())) {
    this.count = 365
  } else {
    this.count = 364;
  }

  // const count = leapYear(insuranceValidUpto.getFullYear()) == true ? 366 : 365;

    } if (diffDays < this.count) {
      this.invalidInsuDiff = true;
      this.toasterService.showWarning('Insurance Validity Date should be one year after insurance Start Date', '');

    } else {
      this.invalidInsuDiff = false;
    }

    console.log('in valid upto', diffDays);
  }
  onRegTypeChange(event?: any) {
    const isReRegistered = event ? event : null;
    const reRegNumber = this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').value ? this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').value : this.vehicleValuationDetails.reRegNumber;
    if (isReRegistered === '0') {
      this.isPreRegNoDisabled = true;
      this.isPreRegNoRequired = false;
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').disable();
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').clearValidators();
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').updateValueAndValidity();
      setTimeout(() => {
        this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').setValue(reRegNumber || null);

      });
    } else if (isReRegistered === '1') {
      this.isPreRegNoDisabled = false;
      // this.currentInvoiceRequired = true;
      this.isPreRegNoRequired = true;
      // console.log('in no condition', this.modelInProd, this.currentInvoiceDisabled, this.currentInvoiceRequired);
      // setTimeout(() => {
      //   this.vehicleValuationForm.get('currInvoiceValue').patchValue(null);

      // });
      setTimeout(() => {
        this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').setValue(reRegNumber || null);
      });
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').enable();
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').setValidators(Validators.required);
      this.vehicleValuationForm.get('registerationDetails').get('reRegNumber').updateValueAndValidity();
    }


  }

  // formvalueChange() {
  //   const formValue = this.vehicleValuationForm.getRawValue();
  //   formValue.valuationInitiatedDate = this.utilityService.convertDateTimeTOUTC(formValue.valuationInitiatedDate, 'DD/MM/YYYY');
  //   console.log('in form value change', formValue.valuationInitiatedDate);
  //   console.log('in form value change', formValue);
  // }

  getVehicleValuation() {

    const data = this.colleteralId;
    const udfData = {
      "udfGroupId": this.udfGroupId,
    }
    // const data = 1695;
    // console.log('DATA::::', data);
    this.vehicleValuationService.getVehicleValuation(data, udfData).subscribe((res: any) => {
      const response = res;
      this.udfDetails = response.ProcessVariables.udfDetails;
      this.SELFIE_IMAGE = response.ProcessVariables.vehicleImage;
      console.log("RESPONSE_FROM_GET_VEHICLE_VALUATION_API", response);
      this.vehicleValuationDetails = response.ProcessVariables.vehicleValutionDetails;
      this.vehicleCode = this.vehicleValuationDetails.vehicleCode;
      // console.log('vehicle code', this.vehicleCode);
      console.log('valuation details', this.vehicleValuationDetails);
      this.valuatorType = this.vehicleValuationDetails.valuatorType;
      this.valuatorCode = this.vehicleValuationDetails.valuatorCode;
      this.valuatorName = this.vehicleValuationDetails.valuatorName;
      this.nameOfVehicleOwner = this.vehicleValuationDetails.vehicleOwnerName;
      this.mobileNumberOfVehicleOwner = this.vehicleValuationDetails.vehicleOwnerMobile;
      this.vehicleAddress = this.vehicleValuationDetails.vehicleAddress;
      this.vehiclePincode = this.vehicleValuationDetails.pincode;
      this.assetCostGrid = this.vehicleValuationDetails.gridAmt;
      if (this.vehicleValuationDetails.valuationInitiationDate != null) {
        this.initiationDate = new Date(this.getDateFormat(this.vehicleValuationDetails.valuationInitiationDate));
      }
      this.isOnline = response.ProcessVariables.isOnline;
      // this.isOnline = true;
      // this.isOnline = false;
      console.log('is online valutation', this.isOnline);
      setTimeout(() => {
        if (this.isOnline) {
          console.log('from is disabled', this.isOnline);
          this.vehicleValuationForm.disable();
          this.disableSaveBtn = true;
          this.disableForm = true;
          // this.vehicleValuationDetails.pdfUrl = 'sampleurl.com';
          if (this.vehicleValuationDetails.pdfUrl !== null) {
            this.reportUrl = this.vehicleValuationDetails.pdfUrl;
            console.log('report url', this.reportUrl);
            this.disablePdfDownload = false;
          } else if (this.vehicleValuationDetails.pdfUrl === null) {
            this.disablePdfDownload = true;

          }
        }
        console.log('after set timeout', this.disablePdfDownload);
      });
      console.log('after set timeout', this.isOnline);
      // console.log('after set timeout', this.disablePdfDownload);


      this.latitude = this.vehicleValuationDetails.latitude;
      this.longitude = this.vehicleValuationDetails.longitude;
      this.capturedAddress = this.vehicleValuationDetails.capturedAddress;
      // if (this.dmsDocumentId) {
      //   this.downloadDocs(this.dmsDocumentId);
      // }


      if (this.isOnline) {
        this.vehicleValuationForm.disable();
        this.disableSaveBtn = true;
        this.disableForm = true;
      }
      // const lastvaluationsList = this.vehicleValuationDetails.valuationList;
      const lastvaluationsList = null;
      const assetsConditionList = null;
      const accConditionList = null;
      // if (this.vehicleValuationDetails.reportUrl) {
      //   this.reportUrl = this.vehicleValuationDetails.reportUrl;
      //   console.log('report url', this.reportUrl);
      // }

      // patching lovs for vehicle details
      if (this.vehicleCode != null) {
        this.vehicleLov.assetMake = [{
          key: this.vehicleValuationDetails.vehicleMfrCode,
          value: this.vehicleValuationDetails.vehicleMfr
        }];

        this.vehicleLov.assetBodyType = [{
          key: this.vehicleValuationDetails.vehicleSegCode,
          value: this.vehicleValuationDetails.vehicleSegment
        }];

        this.vehicleLov.assetModel = [
          {
            key: this.vehicleValuationDetails.vehicleModelCode,
            value: this.vehicleValuationDetails.vehicleModel
          }
        ];
        this.vehicleLov.assetVariant = [{
          key: this.vehicleValuationDetails.assetVariant,
          value: this.vehicleValuationDetails.assetVariant
        }];

        this.vehicleLov.vehicleType = [{
          key: this.vehicleValuationDetails.vehicleTypeCode,
          value: this.vehicleValuationDetails.vehicleType
        }];

      }
      // if (lastvaluationsList !== null) {
      //   this.populateData(lastvaluationsList, 'last3Valuations');
      // } else if (lastvaluationsList === null) {
      //   const control = this.vehicleValuationForm.controls.valuationsList as FormArray;
      //   for (let j = 0; j < 3; j++) {
      //     control.push(this.initRows(null, 'last3Valuations'));
      //   }
      // }
      // if (assetsConditionList !== null) {
      //   this.populateData(assetsConditionList, 'partsCondition');
      // } else if (assetsConditionList === null) {
      //   const control = this.vehicleValuationForm.controls.partsConditionList as FormArray;
      //   for (let k = 0; k < this.partsLOV.length; k++) {
      //     this.partName = this.partsLOV[k]['value']
      //     control.push(this.initRows(null, 'partsCondition'));

      //   }
      // }
      // if (accConditionList !== null) {
      //   this.populateData(accConditionList, 'accessoriesCondition');
      // } else if (accConditionList === null) {
      //   const control = this.vehicleValuationForm.controls.accessoriesList as FormArray;
      //   for (let i = 0; i < this.accessoriesLov.length; i++) {
      //     this.accessoryName = this.accessoriesLov[i]['value']
      //     control.push(this.initRows(null, 'accessoriesCondition'));
      //   }
      // }
      // this.onPermitChange(this.vehicleValuationDetails.permitStatus);
      // this.engineStarted(this.vehicleValuationDetails.engineStarted);
      // this.modelInProdChange(this.vehicleValuationDetails.modelUnderProduction);
      if ((this.vehicleValuationDetails.modelUnderProduction) && (this.vehicleValuationDetails.preReRegNumber)) {
        if ((this.vehicleValuationDetails.preReRegNumber !== null) &&
          (this.vehicleValuationDetails.modelUnderProduction !== null)) {
          this.onRegTypeChange(this.vehicleValuationDetails.preReRegNumber);
          this.modelInProdChange(this.vehicleValuationDetails.modelUnderProduction);
        }
      }
      if ((this.vehicleValuationDetails.personInitiated !== null) && (!this.disableForm)) {
        this.personInitiatedBy = this.vehicleValuationDetails.personInitiated;
      } else if (this.vehicleValuationDetails.personInitiated === null) {
        this.personInitiatedBy = this.userName;

      }
      const valuationTime = this.vehicleValuationDetails.valuationInitiationTime;
      const hour = valuationTime ? valuationTime.split(':')[0] : 0;
      const minute = valuationTime ? valuationTime.split(':')[1] : 0;
      //  console.log('valuationTime', valuationTime)
      let valuationDate = this.vehicleValuationDetails.valuationInitiationDate ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.valuationInitiationDate) : null;
      const date = valuationDate.getDate();
      const month = valuationDate.getMonth();
      const year = valuationDate.getFullYear();
      valuationDate = new Date(year, month, date, hour, minute)
      this.vehicleValuationForm.get('referenceDetails').patchValue({
        valuationInitiationDate: valuationDate,
        personInitiated: this.personInitiatedBy ? this.personInitiatedBy : '',
      })
      // if (this.vehicleValuationDetails.valuatorRefNo) {
        this.setFormValue();
      // }
      // console.log("VALUATION DATE****", this.vehicleValuationDetails.valuationDate);
    });
  }
  redirectUrl() {
    // this.router.navigate([this.reportUrl]);

    window.open(this.reportUrl, '_blank');
    // window.focus();
    return;

  }

  public populateData(data?: any, type?: any) {
    if (type === 'last3Valuations') {
      const valuationList = data;
      for (let i = 0; i < valuationList.length; i++) {
        this.addProposedUnit(valuationList[i], type);
      }
    } else if (type === 'partsCondition') {
      const partConditionList = data;
      for (let i = 0; i < partConditionList.length; i++) {
        this.addProposedUnit(partConditionList[i], type);
        // console.log('in parts condition ');
      }
    } else if (type === 'accessoriesCondition') {
      const accessoriesConditionList = data;
      for (let i = 0; i < accessoriesConditionList.length; i++) {
        this.addProposedUnit(accessoriesConditionList[i], type);
      }

    }
  }
  addProposedUnit(data?: any, type?: any) {
    if (type === 'last3Valuations') {
      const control = this.vehicleValuationForm.controls.valuationList as FormArray;
      // control.push(this.populateRowData(data, type));
    } else if (type === 'partsCodition') {
      const control = this.vehicleValuationForm.controls.partsConditionList as FormArray;
      control.push(this.populateRowData(data, type));
      // console.log('in parts condition ');
    } else if (type === 'accessoriesCondition') {
      const control = this.vehicleValuationForm.controls.accessoriesCondition as FormArray;
      control.push(this.populateRowData(data, type));
    }
  }

  public populateRowData(rowData, type) {
    if (type === 'last3Valuations') {
      // console.log('in initRows RowData');
      return this.fb.group({
        financier: rowData.financier ? rowData.financier : null,
        monthOfReport: rowData.monthOfReport ? rowData.monthOfReport : null,
        valuation: rowData.valuation ? rowData.valuation : null,
      });
    } else if (type === 'partsCodition') {
      // console.log('in initRows RowData parts condition');
      return this.fb.group({
        partName: rowData.partName ? rowData.partName : null,
        condition: rowData.condition ? rowData.condition : null,
        ratingScale: rowData.ratingScale ? rowData.ratingScale : null,
      });
    } else if (type === 'accessoriesCondition') {
      // console.log('in initRows RowData');
      return this.fb.group({
        accessoryName: rowData.accessoryName ? rowData.accessoryName : null,
        availability: rowData.availability ? rowData.availability : null,
      });
    }
  }
  public initRows(index: number, type?: any) {
    // console.log('in initRows no RowData', type);
    if (type === 'last3Valuations') {
      return this.fb.group({
        financier: new FormControl(''),
        monthOfReport: new FormControl(''),
        valuation: new FormControl(''),
      });
    } else if (type === 'partsCondition') {
      // console.log('in initRows no RowData parts condition');
      return this.fb.group({
        partName: this.partName,
        condition: new FormControl(''),
        ratingScale: new FormControl(''),
      });

    } else if (type === 'accessoriesCondition') {
      return this.fb.group({
        accessoryName: this.accessoryName,
        availability: new FormControl(''),
      });
    }
  }
  changedFuelUsed(key) {
    // console.log('in changed fuel use', key, this.fuelTypeLOV);
    this.fuelTypeLOV.forEach(element => {
      if (element.key === key) {
        // tslint:disable-next-line: no-shadowed-variable
        const value = element.value;
        this.fuelUsedType = value;
      }
    });


    this.vehicleValuationForm.patchValue({
      fuelUsedType: this.fuelUsedType ? this.fuelUsedType : null
    });
  }

  InitForm() {
    this.vehicleValuationForm = new FormGroup({
      valuatorType: new FormControl({ value: '', disabled: true }),
      valuatorCode: new FormControl({ value: '', disabled: true }),
      vehicleCode: new FormControl({ value: 0 }),
      referenceDetails: new FormGroup(this.getReferenceDetails()),
      inspectionDetails: new FormGroup(this.getInspectionDetails()),
      vehicleIdentityDetails: new FormGroup(this.getvehicleIdentityDetails()),
      registerationDetails: new FormGroup(this.getregisterationDetails()),
      permitAndTaxDetails: new FormGroup(this.getpermitAndTaxDetails()),
      insuranceDetails: new FormGroup(this.getinsuranceDetails()),
      remarksDetails: new FormGroup(this.getremarksDetails()),
      recomendationDetails: new FormGroup(this.getrecomendationDetails()),
      vehiclePhotoDetails: new FormGroup(this.getvehiclePhotoDetails()),
    });
  }
  getReferenceDetails() {
    return {
      vehicleOwnerName: new FormControl({ value: '', disabled: true }),
      vehicleOwnerMobile: new FormControl({ value: '', disabled: true }),
      vehicleAddress: new FormControl({ value: '', disabled: true }),
      pincode: new FormControl({ value: '', disabled: true }),
      valuatorName: new FormControl({ value: '', disabled: true }),
      valuationInitiationDate: new FormControl({ value: '', disabled: true }),
      personInitiated: new FormControl({ value: '', disabled: true }),
      valuatorRefNo: new FormControl('', Validators.required)
    }

  }
  getInspectionDetails() {
    return {
      borrowersName: new FormControl('', Validators.required),
      inspectedBy: new FormControl('', Validators.required),
      inspectionDate: new FormControl('', Validators.required),
      inspectionPlace: new FormControl('', Validators.required),
      timeOfInspection: new FormControl({value : '', disabled :true}),
      engineStarted: new FormControl('', Validators.required),
      vehicleMoved: new FormControl('')
    }
  }

  getvehicleIdentityDetails() {
    return {
      registrationNo: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required),
      assetMake: new FormControl('', Validators.required),
      vehicleType: new FormControl('', Validators.required),
      assetBodyType: new FormControl('', Validators.required),
      assetModel: new FormControl('', Validators.required),
      assetVariant: new FormControl(''),
      colour: new FormControl('', Validators.required),
      chasisNumber: new FormControl('', Validators.required),
      engineNumber: new FormControl('', Validators.required),
      odometerReading: new FormControl('', Validators.required),
      estimatedReading: new FormControl(''),
      gvw: new FormControl('', Validators.required),
      vehicleUsedFor: new FormControl('', Validators.required),
      fuelUsed: new FormControl('', Validators.required)
    }
  }
  getregisterationDetails() {
    return {
      regdNo: new FormControl('', Validators.required),
      preReRegNumber: new FormControl('', Validators.required),
      reRegNumber: new FormControl(''),
      regOwnerName: new FormControl('', Validators.required),
      regAddress: new FormControl('', Validators.required),
      ownerSerialNo: new FormControl('', Validators.required),
      yearOfManufacturer: new FormControl(''),
      ageOfAsset: new FormControl({ value: '', disabled: true }),
      dateofReg: new FormControl('', Validators.required),
      makeName: new FormControl('', Validators.required),
      reRegTypeOfBody: new FormControl('', Validators.required),
      makersClassification: new FormControl(''),
      regChasisNo: new FormControl('', Validators.required),
      regEngineNo: new FormControl('', Validators.required),
      regFuelUsed: new FormControl('', Validators.required),
      seatingCapacity: new FormControl('', Validators.required),
      cubicCapacity: new FormControl(''),
      unladenWeight: new FormControl('', Validators.required),
      hypothecation: new FormControl('', Validators.required),
      interStateVehicle: new FormControl('', Validators.required)
    }
  }

  getpermitAndTaxDetails() {
    return {
      permitStatus: new FormControl('', Validators.required),
      permitValidUpto: new FormControl(''),
      fcExpiryDate: new FormControl('', Validators.required),
      routeOfOperation: new FormControl('', Validators.required),
      taxPaid: new FormControl('', Validators.required),
      taxValidUpto: new FormControl('', Validators.required)
    }
  }

  getinsuranceDetails() {
    return {
      insuCompany: new FormControl('', Validators.required),
      insuPolicyNo: new FormControl('', Validators.required),
      typeOfPolicy: new FormControl('', Validators.required),
      validFrom: new FormControl('', Validators.required),
      validUpto: new FormControl('', Validators.required),
      idv: new FormControl('', Validators.required),
      // idvValidityDate: new FormControl('', Validators.required),
    }
  }
  getremarksDetails() {
    return {
      modelUnderProduction: new FormControl('', Validators.required),
      currInvoiceValue: new FormControl(''),
      originalInvoice: new FormControl('', Validators.required),
      rcBookStatus: new FormControl('', Validators.required),
      noOfOriginalTyres: new FormControl(''),
      noOfRetreadedTyres: new FormControl(''),
      majorRepairTillDate: new FormControl('', Validators.required),
      anyAccidentsInPast: new FormControl('', Validators.required),
      valuatorRemarks: new FormControl('', Validators.compose([Validators.maxLength(1500),
      Validators.pattern(/^[a-zA-Z0-9 ]*$/)])),
    }
  }
  getrecomendationDetails() {
    return {
      remarksRating: new FormControl('', Validators.required),
      remarksRatingScale: new FormControl('', Validators.required),
      expectedFutureLife: new FormControl('', Validators.required),
      marketValue: new FormControl('', Validators.required),
      valuationAmt: new FormControl('', Validators.required),
      valuationDate: new FormControl({value: this.toDayDate, disabled: true})
    }
  }
  getvehiclePhotoDetails() {
    return {
      latitude: new FormControl({ value: '', disabled: true }),
      longitude: new FormControl({ value: '', disabled: true }),
      capturedAddress: new FormControl({ value: '', disabled: true })
    }
  }


  
  setFormValue() {

    if (this.disableForm) {
      this.yearMonthOfManufact = this.vehicleValuationDetails.yearOfManufacturer || '';
      this.personInitiatedBy = this.vehicleValuationDetails.personInitiated;
    } else {
      this.yearMonthOfManufacturer = this.vehicleValuationDetails.yearOfManufacturer ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.yearOfManufacturer) : '';
    }

    this.vehicleValuationForm.patchValue({
      valuatorCode : this.valuatorCode,
      valuatorType : this.valuatorType,
      vehicleCode : this.vehicleCode
    })

    this.vehicleValuationForm.get('referenceDetails').patchValue({
      valuatorRefNo: this.vehicleValuationDetails.valuatorRefNo || '',
      vehicleOwnerName : this.nameOfVehicleOwner || '',
      vehicleOwnerMobile : this.mobileNumberOfVehicleOwner || '',
      vehicleAddress : this.vehicleAddress || '',
      pincode : this.vehiclePincode || '',
      valuatorName : this.valuatorName || ''

    })
    this.vehicleValuationForm.get('inspectionDetails').patchValue({
      borrowersName: this.vehicleValuationDetails.borrowersName || '',
      inspectionPlace: this.vehicleValuationDetails.inspectionPlace || '',
      inspectedBy: this.vehicleValuationDetails.inspectedBy || '',
      inspectionDate: this.vehicleValuationDetails.inspectionDate ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.inspectionDate) : '',
       timeOfInspection: this.vehicleValuationDetails.timeOfInspection? this.vehicleValuationDetails.timeOfInspection : this.presentTime,
      engineStarted: this.vehicleValuationDetails.engineStarted || '',
      vehicleMoved: this.vehicleValuationDetails.vehicleMoved || '',
      

    })
    this.vehicleValuationForm.get('vehicleIdentityDetails').patchValue({

      assetMake: this.vehicleValuationDetails.vehicleMfrCode || '',
      assetModel: this.vehicleValuationDetails.vehicleModelCode || '',
      assetVariant: this.vehicleValuationDetails.assetVariant || '',
      assetBodyType: this.vehicleValuationDetails.vehicleSegCode || '',
      region: this.vehicleValuationDetails.region || '',
      vehicleType: this.vehicleValuationDetails.vehicleTypeCode || '',
      registrationNo: this.vehicleValuationDetails.registrationNo || '',
      colour: this.vehicleValuationDetails.color || '',
      odometerReading: this.vehicleValuationDetails.odometerReading || '',
      estimatedReading: this.vehicleValuationDetails.estimatedReading || '',
      vehicleUsedFor: this.vehicleValuationDetails.vehicleUsedFor || '',
      chasisNumber: this.vehicleValuationDetails.chasisNumber || '',
      engineNumber: this.vehicleValuationDetails.engineNumber || '',
      gvw: this.vehicleValuationDetails.gvw || '',
      fuelUsed: this.vehicleValuationDetails.fuelUsed || '',
    })
    this.vehicleValuationForm.get('registerationDetails').patchValue({
      reRegNumber: this.vehicleValuationDetails.reRegNumber || '',
      regOwnerName: this.vehicleValuationDetails.regOwnerName || '',
      regAddress: this.vehicleValuationDetails.regAddress || '',
      ownerSerialNo: this.vehicleValuationDetails.ownerSerialNo || '',
      regEngineNo: this.vehicleValuationDetails.regEngineNo || '',
      regChasisNo: this.vehicleValuationDetails.regChasisNo || '',
      regFuelUsed: this.vehicleValuationDetails.regFuelUsed || '',
      unladenWeight: this.vehicleValuationDetails.unladenWeight || '',
      hypothecation: this.vehicleValuationDetails.hypothecation || '',
      ageOfAsset: this.vehicleValuationDetails.ageOfAsset || '',
      dateofReg: this.vehicleValuationDetails.dateofReg ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.dateofReg) : '',
      preReRegNumber: this.vehicleValuationDetails.preReRegNumber || '',
      interStateVehicle: this.vehicleValuationDetails.interStateVehicle || '',
      cubicCapacity: this.vehicleValuationDetails.cubicCapacity || '',
      seatingCapacity: this.vehicleValuationDetails.seatingCapacity || '',
      reRegTypeOfBody: this.vehicleValuationDetails.reRegTypeOfBody || '',
      regdNo: this.vehicleValuationDetails.registrationNo ? this.vehicleValuationDetails.registrationNo : '',
      makeName: this.vehicleValuationDetails.makeName || '',

      makersClassification: this.vehicleValuationDetails.makersClassification || '',
      yearOfManufacturer: this.yearMonthOfManufacturer ? this.yearMonthOfManufacturer : '',

    })
    this.vehicleValuationForm.get('permitAndTaxDetails').patchValue({

      permitStatus: this.vehicleValuationDetails.permitStatus || '',
      permitValidUpto: this.vehicleValuationDetails.permitValidUpto ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.permitValidUpto) : '',
      routeOfOperation: this.vehicleValuationDetails.routeOfOperation || '',
      taxPaid: this.vehicleValuationDetails.taxPaid || '',
      taxValidUpto: this.vehicleValuationDetails.taxValidUpto ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.taxValidUpto) : '',
      fcExpiryDate: this.vehicleValuationDetails.fcExpiryDate ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.fcExpiryDate) : '',
    })
    this.vehicleValuationForm.get('insuranceDetails').patchValue({
      insuCompany: this.vehicleValuationDetails.insuCompany || '',
      insuPolicyNo: this.vehicleValuationDetails.insuPolicyNo || '',
      typeOfPolicy: this.vehicleValuationDetails.typeOfPolicy || '',
      validFrom: this.vehicleValuationDetails.validFrom ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.validFrom) : '',
      validUpto: this.vehicleValuationDetails.validUpto ?
        this.utilityService.getDateFromString(this.vehicleValuationDetails.validUpto) : '',
      idv: this.vehicleValuationDetails.idv || '',
      // idvValidityDate: this.vehicleValuationDetails.idvValidityDate ?
      //   this.utilityService.getDateFromString(this.vehicleValuationDetails.idvValidityDate) : '',
    })
    this.vehicleValuationForm.get('remarksDetails').patchValue({
      modelUnderProduction: this.vehicleValuationDetails.modelUnderProduction || '',
      anyAccidentsInPast: this.vehicleValuationDetails.anyAccidentsInPast || '',
      majorRepairTillDate: this.vehicleValuationDetails.majorRepairTillDate || '',
      originalInvoice: this.vehicleValuationDetails.originalInvoice || '',
      currInvoiceValue: this.vehicleValuationDetails.currInvoiceValue || '',
      rcBookStatus: this.vehicleValuationDetails.rcBookStatus || '',
      noOfOriginalTyres: this.vehicleValuationDetails.noOfOriginalTyres || '',
      noOfRetreadedTyres: this.vehicleValuationDetails.noOfRetreadedTyres || '',
      valuatorRemarks: this.vehicleValuationDetails.valuatorRemarks ? this.vehicleValuationDetails.valuatorRemarks : '',

    })
    this.vehicleValuationForm.get('recomendationDetails').patchValue({
      remarksRating: this.vehicleValuationDetails.remarksRating || '',
      remarksRatingScale: this.vehicleValuationDetails.remarksRatingScale || '',
      expectedFutureLife: this.vehicleValuationDetails.expectedFutureLife || '',
      marketValue: this.vehicleValuationDetails.marketValue || '',
      valuationAmt: this.vehicleValuationDetails.valuationAmt || '',
      valuationDate: this.toDayDate

    })
    this.vehicleValuationForm.get('vehiclePhotoDetails').patchValue({
      latitude: this.latitude || "",
      longitude: this.longitude || "",
      capturedAddress: this.capturedAddress || "",

    })

    this.vehicleValuationForm.patchValue({
      // vehicleAvailGrid: this.vehicleValuationDetails.vehicleAvailGrid || '',  
      vehicleCode: this.vehicleValuationDetails.vehicleCode || null,
      // sellerShortDesc: this.vehicleValuationDetails.sellerShortDesc || '',
      // secondAsset: this.vehicleValuationDetails.secondAsset || '',
      // secondVehiclePrefixNo: this.vehicleValuationDetails.secondVehiclePrefixNo || '',
      // make: this.vehicleValuationDetails.make || '',
      // model: this.vehicleValuationDetails.model || '',
      // regMonthYear: this.vehicleValuationDetails.regMonthYear || '',
      // yearMonthOfManufact: this.yearMonthOfManufact ? this.yearMonthOfManufact : '',  
    });
    this.apiValue = this.vehicleValuationForm.getRawValue();
  }

  onVehicleRegion(value: any, obj) {
    const region = value ? value : '';
    let assetMakeArray = [];
    // console.log('obj in vehRegion', obj);

    const data = {
      'region': region,
      'productCategory': this.productCategoryCode
    };

    this.vehicleDetailService.getVehicleMasterFromRegion(data).subscribe((res: any) => {
      this.uiLoader.start();
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

          assetMakeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
            'uniqueMFRCode', 'mfrCode');
          this.vehicleLov.assetMake = assetMakeArray;
          obj.get('vehicleIdentityDetails').patchValue({
            assetMake: '',
            vehicleType: '',
            assetBodyType: '',
            assetModel: '',
            // assetVariant: ''valuatorRemarks
          });
        } else {
          this.vehicleLov.assetMake = [];
          this.toasterService.showWarning('No Data in Vehicle Master Region', 'Vehicle Master Region');
        }
      } else {
        this.vehicleLov.assetMake = [];
        this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Region');
      }
      this.uiLoader.stop();
    }, error => {
      // console.log(error, 'error');
      this.uiLoader.stop();
    });
  }

  onAssetMake(value, obj) {

    let VehicleTypeArray = [];

    if (value) {

      const data = {
        "region": obj.get('vehicleIdentityDetails').value.region,
        "productCategory": this.productCategoryCode,
        "make": value
      };

      this.vehicleDetailService.getVehicleMasterFromAssetMake(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

            VehicleTypeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "vehicleTypeUniqueCode", "vehicleTypeCode");

            this.vehicleLov.vehicleType = VehicleTypeArray;
            obj.get('vehicleIdentityDetails').patchValue({
              vehicleType: '',
              assetBodyType: '',
              assetModel: '',
              // assetVariant: ''
            });

          } else {
            this.vehicleLov.vehicleType = [];
            this.toasterService.showWarning('No Data in Vehicle Master Asset Make', 'Vehicle Master Asset Make')
          }
        } else {
          this.vehicleLov.vehicleType = [];
          this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Asset Make')
        }
        this.uiLoader.stop();
      }, error => {
        // console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  onVehicleType(value, obj) {

    let assetBodyType = [];

    if (value) {

      const data =
      {
        "region": obj.get('vehicleIdentityDetails').value.region,
        "productCategory": this.productCategoryCode,
        "make": obj.get('vehicleIdentityDetails').value.assetMake,
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

            obj.get('vehicleIdentityDetails').patchValue({
              assetBodyType: '',
              assetModel: '',
              assetVariant: ''
            })

          } else {
            this.vehicleLov.assetBodyType = []
            this.toasterService.showWarning('No Data in Vehicle Master Vehicle Type', 'Vehicle Master Vehicle Type');
          }
        } else {
          this.vehicleLov.assetBodyType = [];
          this.toasterService.showWarning(res.ErrorMessage ?
            res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Vehicle Type')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error');
        this.uiLoader.stop();
      });
    }
  }

  onAssetBodyType(value: any, obj) {
    this.assetModelType = this.assetBodyType.filter((data) => data.uniqueSegmentCode === value)
    this.vehicleLov.assetModel = this.utilityService.getValueFromJSON(this.assetModelType,
      'vehicleModelCode', 'vehicleModel');
    // console.log(this.assetModelType, 'data', this.vehicleLov);
    obj.get('vehicleIdentityDetails').patchValue({
      assetModel: '',
      assetVariant: ''
    });
  }

  onAssetModel(value: any, obj) {
    // console.log('value in asset model', value);
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value);
    const array = this.utilityService.getCommonUniqueValue(this.assetVariant, 'vehicleVariant');
    this.vehicleValuationForm.get('vehicleCode').setValue(
      array.length > 0 ? Number(array[0].vehicleCode) : 0);

    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      'vehicleCode', 'vehicleVariant');

    obj.get('vehicleIdentityDetails').patchValue({
      assetVariant: ''
    });
    // console.log('in version', this.assetVariant);
    // console.log('vehicle id :', array[0].vehicleCode);

  }

  engineStarted(event: any) {
    console.log(event);
    this.engineStartedType = event ? event : event;
    if (this.engineStartedType === '0') {
      this.vehicleMovedDisabled = true;
      this.vehicleMovedRequired = false;
      // console.log('in no condition disabled');
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').disable();
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').clearValidators();
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').updateValueAndValidity();
      setTimeout(() => {
        this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').patchValue(0);
        console.log('vehilce moved', this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').value);

      });

    } else if (this.engineStartedType === '1') {
      this.vehicleMovedDisabled = false;
      this.vehicleMovedRequired = true;
      setTimeout(() => {
        this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').patchValue(null);
        console.log('vehilce moved', this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').value);

      });
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').enable();
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').setValidators(Validators.required);
      this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').updateValueAndValidity();
      // console.log('vehilce moved', this.vehicleValuationForm.get('inspectionDetails').get('vehicleMoved').value);
    }

  }

  onFormSubmit() {
    this.isDirty = true;
    this.validateFitnessDate();
    this.validateInsuranceDate();
    this.validatePermitDate();
    this.validateTaxDate();
    this.validateDateOfReg();
    this.insuranceValidUptoCheck();
    if(this.invalidFitnessDate || 
      this.invalidInsDate || 
      this.invalidTaxDate || 
      this.invalidRegDate|| 
      this.invalidInsuranceValidity || 
      this.invalidInsuDiff){
        this.invalidFitnessDate = false 
        this.invalidInsDate = false 
        this.invalidTaxDate = false 
        this.invalidRegDate = false 
        this.invalidInsuranceValidity = false 
        this.invalidInsuDiff = false
      return
    }
    
    console.log('latitude::', this.latitude);
    console.log('longitude::', this.longitude);
    console.log('address::', this.capturedAddress);
    console.log('SELFIE_IMAGE::', this.SELFIE_IMAGE);
    console.log('is mobile', this.isMobile);
    // this.SELFIE_IMAGE = 'jkhkhkj';

    console.log('length of image', this.SELFIE_IMAGE.length);
    if (this.SELFIE_IMAGE.length == 0) {
      this.vehiclePhotoRequired = true;
    } else {
      this.vehiclePhotoRequired = false;
    }

    if (this.isMobile && this.vehiclePhotoRequired) {
      this.toasterService.showError('Vehicle photo is required', '');
      return;
    }
    let formValue = this.vehicleValuationForm.getRawValue();
   const referenceDetails = formValue.referenceDetails;
   const inspectionDetails = formValue.inspectionDetails;
   const vehicleIdentityDetails = formValue.vehicleIdentityDetails;
   const registerationDetails = formValue.registerationDetails;
   const permitAndTaxDetails = formValue.permitAndTaxDetails;
   const insuranceDetails = formValue.insuranceDetails;
   const remarksDetails = formValue.remarksDetails;
   const recomendationDetails = formValue.recomendationDetails;
   const vehiclePhotoDetails = formValue.vehiclePhotoDetails;
    console.log(recomendationDetails,'formvalue after removing valuator type', formValue);
 

    recomendationDetails.valuationDate = this.utilityService.convertDateTimeTOUTC(recomendationDetails.valuationDate, 'DD/MM/YYYY');
    // insuranceDetails.idvValidityDate = this.utilityService.convertDateTimeTOUTC(insuranceDetails.idvValidityDate, 'DD/MM/YYYY');
    registerationDetails.yearOfManufacturer = this.utilityService.convertDateTimeTOUTC(registerationDetails.yearOfManufacturer, 'DD/MM/YYYY');
    registerationDetails.dateofReg = this.utilityService.convertDateTimeTOUTC(registerationDetails.dateofReg, 'DD/MM/YYYY');
    inspectionDetails.inspectionDate = this.utilityService.convertDateTimeTOUTC(inspectionDetails.inspectionDate, 'DD/MM/YYYY');
    permitAndTaxDetails.permitValidUpto =permitAndTaxDetails.permitValidUpto?  this.utilityService.convertDateTimeTOUTC(permitAndTaxDetails.permitValidUpto, 'DD/MM/YYYY') : '';
    permitAndTaxDetails.taxValidUpto = this.utilityService.convertDateTimeTOUTC(permitAndTaxDetails.taxValidUpto, 'DD/MM/YYYY');
    insuranceDetails.validFrom = this.utilityService.convertDateTimeTOUTC(insuranceDetails.validFrom, 'DD/MM/YYYY');
    insuranceDetails.validUpto = this.utilityService.convertDateTimeTOUTC(insuranceDetails.validUpto, 'DD/MM/YYYY');
    permitAndTaxDetails.fcExpiryDate = this.utilityService.convertDateTimeTOUTC(permitAndTaxDetails.fcExpiryDate, 'DD/MM/YYYY');
    referenceDetails.valuationInitiationDate = this.utilityService.convertDateTimeTOUTC(referenceDetails.valuationInitiationDate, 'DD/MM/YYYY');
    console.log(recomendationDetails,'after converting date to utc', formValue);

   formValue= {
    valuatorType :formValue.valuatorType,
    valuatorCode :formValue.valuatorCode,
    vehicleCode : formValue.vehicleCode,
    ...referenceDetails,
    ...inspectionDetails,
    ...vehicleIdentityDetails,
    ...registerationDetails,
    ...permitAndTaxDetails,
    ...insuranceDetails,
    ...remarksDetails,
    ...recomendationDetails,
    ...vehiclePhotoDetails
   }
    
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false;
    if (this.vehicleValuationForm.invalid || isUDFInvalid) {
      this.toasterService.showError('Please enter required details', '');
      console.log('valuation form', this.vehicleValuationForm);
      return;
    }
    const udfData = this.userDefineForm ? JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: this.leadId,
      collateralId: this.colleteralId,
      latitude: this.latitude || '',
      longitude: this.longitude || '',
      capturedAddress: this.capturedAddress || '',
      vehicleImage: this.SELFIE_IMAGE,
      ...formValue,
      udfDetails: [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }]

    };
    console.log('datas',data )
    //return;
    // this.vehicleValuationService.saveUpdateVehicleValuation(data).subscribe((res: any) => {
    //   const response = res;
    //   // console.log('VEHICLE_VALUATION_RESPONSE_SAVE_OR_UPDATE_API', response);
    //   if (response["Error"] == 0 && response['ProcessVariables'].error['code'] == "0") {
    //     this.toasterService.showSuccess('Record Saved Successfully', '');
    //     this.getVehicleValuation();
    //   } else {
    //     this.toasterService.showError(response['ProcessVariables'].error['message'], 'Valuation');
    //   }
    // });
    this.vehicleValuationService.saveUpdateVehicleValuation(data).subscribe((res: any) => {
      console.log('save or update valuation Response', res);
      const message = res.ProcessVariables.error.message;
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
        this.initUDFValues = this.userDefineForm.udfData.getRawValue();
        this.apiValue = this.vehicleValuationForm.getRawValue();
        // this.getVehicleValuation();

      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError(message, '');

      }
    });
  }

  // onFormSubmit() {

  //   // this.vehicleValuationForm.removeControl('valuatorType');
  //   this.saveUpdateVehicleValuation();
  // }
  submitValuationTask() {
    this.finalValue = this.vehicleValuationForm.getRawValue();
    this.editedUDFValues = this.userDefineForm ? this.userDefineForm.udfData.getRawValue() : {};
    const isValuationValidCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues);
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false;
    console.log('apivalue',this.apiValue);
    console.log('finalValue',this.finalValue);
    console.log('compare',this.objectComparisonService.compare(this.apiValue, this.finalValue));
    
    if (this.vehicleValuationForm.invalid || isUDFInvalid) {
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }
    // this.validateFitnessDate();
    // this.validateInsuranceDate();
    // this.validatePermitDate();
    // this.validateTaxDate();
    // this.validateDateOfReg();
    // this.insuranceValidUptoCheck();
    // if(this.invalidFitnessDate || this.invalidInsDate || this.invalidTaxDate || this.invalidRegDate|| this.invalidInsuranceValidity || this.invalidInsuDiff){
    //   return;
    // }
    if (!isUDFCheck || !isValuationValidCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      isSubmitVal: true,
      collateralId: this.colleteralId,
      taskId: this.taskId
    };
    this.vehicleValuationService.sumbitValuationTask(data).subscribe((res: any) => {
      console.log('submit valuation Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Submitted Successfully', '');
        this.router.navigate([`/pages/dashboard`]);
      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });
  }

  onNext() {
    this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
  }

  onBack() {
    if (this.roleId === 86) {
      this.router.navigate([`/pages/valuation-dashboard/${this.leadId}/vehicle-valuation`]);
    } else {
      this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);

    }
  }

  async onUploadSuccess(event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    // const data = {
    //   inputValue: event.imageUrl,
    //   isPhoto: true,
    //   applicantId: this.applicantId,
    // };
    //this.uploadPhotoOrSignature(data);

    event.imageUrl = '';

    // const formArray = this.uploadForm.get(
    //   `${this.FORM_ARRAY_NAME}_${event.subCategoryCode}`
    // ) as FormArray;
    // formArray.at(this.selectedIndex).get('file').setValue(event.dmsDocumentId);
    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    }
    console.log('documentArr', this.documentArr);
    this.individualImageUpload(event, index);

    let position = await this.getLatLong();
    if (position["latitude"]) {
      this.latitude = position["latitude"].toString();
      this.longitude = position["longitude"].toString();
      this.vehicleValuationForm.get("latitude").patchValue(this.latitude);
      this.vehicleValuationForm.get("longitude").patchValue(this.longitude);

      var lat: number = +this.latitude;
      var lng: number = +this.longitude;
      this.loginService.geocode(new google.maps.LatLng(lat, lng)).subscribe((position) => {
        console.log("Position" + position[0].formatted_address);
        this.capturedAddress = position[0].formatted_address.toString();
        this.vehicleValuationForm.get("capturedAddress").patchValue(this.capturedAddress);
      });

    } else {
      this.latitude = "";
      this.longitude = "";
      this.toasterService.showError(position["message"], "GPS Alert");
    }

  }

  individualImageUpload(request: DocumentDetails, index: number) {
    this.uploadService
      .saveOrUpdateDocument([request])
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.toasterService.showSuccess('Document uploaded successfully', '');
        console.log('saveOrUpdateDocument', value);
        const processVariables = value.ProcessVariables;
        const documentId = processVariables.documentIds[0];
        console.log("documentId******", documentId);
        this.dmsDocumentId = documentId;
        // this.documentArr[index].documentId = documentId;
        //const subCategoryCode = this.documentArr[index].subCategoryCode;
      });
  }

  async getLatLong() {
    /* Get latitude and longitude from mobile */

    return new Promise((resolve, reject) => {

      if (this.isMobile) {

        this.gpsService.getLatLong().subscribe((position) => {
          console.log("Mobile position", position);
          resolve(position);
        });

        // this.gpsService.initLatLong().subscribe((res) => {
        //   console.log("Error position", res);
        //   if (res) {
        //     this.gpsService.getLatLong().subscribe((position) => {
        //       console.log("Mobile position", position);
        //       resolve(position);
        //     });
        //   } else {
        //     console.log("Error position", res);
        //   }
        // });
      } else {
        this.gpsService.getBrowserLatLong().subscribe((position) => {
          console.log("Browser position", position);
          if (position["code"]) {
            this.toasterService.showError(position["message"], "GPS Alert");
          }
          resolve(position);
        });
      }
    });
  }

  async checkGpsEnabled() {
    this.gpsService.getLatLong().subscribe((position) => {
      console.log("getLatLong", position);
      this.gpsService.initLatLong().subscribe((res) => {
        console.log("gpsService", res);
        if (res) {
          this.gpsService.getLatLong().subscribe((position) => {
            console.log("getLatLong", position);
          });
        } else {
          console.log("error initLatLong", res);
        }
      });
    });
  }

  async downloadDocs(documentId: string) {
    console.log(event);

    // let el = event.srcElement;
    // const formArray = this.uploadForm.get(formArrayName) as FormArray;
    // const documentId = formArray.at(index).get('file').value;
    if (!documentId) {
      return;
    }

    const imageValue: any = await this.getBase64String(documentId);
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + imageValue.imageUrl;

  }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
          });
          console.log('downloadDocs', value);
        });
    });
  }


  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value);
    if (value.event === 'init') {
      this.initUDFValues = this.userDefineForm ? this.userDefineForm.udfData.getRawValue() : {};
    }
  }
}
