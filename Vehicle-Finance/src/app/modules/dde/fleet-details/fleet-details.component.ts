import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { FleetDetailsService } from '../services/fleet-details.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToggleDdeService } from '@services/toggle-dde.service';

import readXlsxFile from 'read-excel-file';
import { LoanViewService } from '@services/loan-view.service';

import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ObjectComparisonService } from '@services/obj-compare.service';

@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})

export class FleetDetailsComponent implements OnInit {
  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Characters not allowed'
    }
  };  
  validFleetData: any;
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;
  docsFleetDetails;
  csvData: any;
  showError: string;
  fileUrl;
  fileName: string;
  fileSize: string;
  showUploadModal: boolean;
  disableSaveBtn: boolean;
  public fleetForm: FormGroup;
  labels: any = {};
  formValidation: any = {};
  values: any = [];
  leadId: number;
  userId: number;
  fleetDetails: any = [];
  customFutureDate: boolean;

  fleetArray = [];
  formValue: any;
  toDayDate: Date = new Date();
  minDate: Date = new Date();

  relation: any[];
  make: any = [];
  financierName: any;

  fleetIDs: any = [];
  fleetId: any;
  validationData: any;
  isDirty = false;
  vehicleLov: any = [];
  leadDetails: any;
  productCatoryCode: any;

  // lov Data
  public assetBodyType: any = [];
  public assetModelType: any = [];
  public assetModelTypeLov: any = []
  public assetVariant: any = [];
  public vehicleManufacturer: any = []; // make field lov
  public vehicleTypeLov: any = [];
  public assetBodyTypeLov: any = [];
  public regionLov: any = [];
  public allLovs: any;
  fleetLov: any = [];

  currentYear = new Date().getFullYear();
  yearCheck = [];
  initalZeroCheck: any;
  paidTenureCheck = [];
  fleetArrayList: FormArray;
  operationType: boolean;
  deleteRecordData: { index: number; fleets: any; };
  isLoan360: boolean;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId = '';
  udfGroupId = 'FLG001';

  itemsPerPage = '5';
  // pageNumber = 1;
  // currentPage = 1;
  // totalItems: any;
  // count = 1;
  // slicedArray: any;
  q;

  apiValue: any;
  finalValue: any;
  applicantArray: any;
  applicantList = [];
  financeRequired = true;
  initalZeroCheck: { rule: (val: any) => boolean; msg: string; }[];

  constructor(
    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private fleetDetailsService: FleetDetailsService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private uiLoader: NgxUiLoaderService,
    private vehicleDetailService: VehicleDetailService,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService,
    private objectComparisonService: ObjectComparisonService,
    private loanViewService: LoanViewService) {
    this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];
    this.yearCheck = [{ rule: val => val > this.currentYear, msg: 'Future year not accepted' }];
    this.initalZeroCheck = [{ rule: val => val < 1, msg: 'Initial Zero value not accepted' }];
    this.fleetArrayList = this.fb.array([]);
  }

  async ngOnInit() {

    // accessing lead if from route

    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.leadId = (await this.getLeadId()) as number;

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadDetails = leadData['leadDetails']
    this.productCatoryCode = this.leadDetails['productCatCode'];

    
    this.applicantArray = leadData['applicantDetails']

    this.applicantArray.forEach((val) => {
      const keyValue = {
        key: val.applicantId,
        value: val.fullName
      }
      this.applicantList.push(keyValue)
    })

    this.getLov();
    this.getFleetDetails();

    this.fleetForm = this.fb.group(
      {
        Rows: this.fleetArrayList,
        isValidPurchaseDate: new FormControl(true)
      }
    );

    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].fleetDetails[0];
    });

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        this.formValidation = data;
        this.validationData = data.validationData
      },
      error => {
        console.log(error);
      });

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.fleetListDDE;

    })
  }

  checkPaid(event, i, obj) {

    let tenure = obj.controls['tenure'].value ? Number(obj.controls['tenure'].value) : 0;
    let paid = obj.controls['paid'].value ? Number(obj.controls['paid'].value) : 0;

    if (paid > tenure) {
      this.formArr.controls[i]['controls']['paid'].setErrors({ 'incorrect': true })
    } else {
      paid && paid !== 0 ? this.formArr.controls[i]['controls']['paid'].setErrors(null) : 
      this.formArr.controls[i]['controls']['paid'].setValidators(Validators.required)
    }

  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  get formArr() {
    return this.fleetForm.get('Rows') as
      FormArray;
  }

  checkManufacturingYear(event, i) {
    const dateFormat: Date = new Date();
    const year = dateFormat.getFullYear();
    let yom = parseInt(event.target.value);
    if (yom > year) {
      this.formArr.controls[i]['controls']['yom'].setErrors({ 'incorrect': true })
    }
  }

  initRows(rowData) {

    if (rowData) {
      return this.fb.group({
        // regdNo: new FormControl(rowData.regdNo, Validators.compose([Validators.required])),
        // regdOwner: new FormControl(rowData.regdOwner, Validators.compose([Validators.required])),
        // relation: new FormControl(rowData.relation, [Validators.required]),
        // region: new FormControl(rowData.region, [Validators.required]),
        // make: new FormControl(rowData.make, [Validators.required]),
        // vehicleType: new FormControl(rowData.vehicleType, [Validators.required]),
        // assetBodyType: new FormControl(rowData.assetBodyType, [Validators.required]),
        // assetModel: new FormControl(rowData.assetModel, [Validators.required]),
        // yom: new FormControl(rowData.yom, Validators.compose([Validators.required])),
        // financier: new FormControl(rowData.financier, [Validators.required]),
        // loanNo: new FormControl(rowData.loanNo, Validators.compose([Validators.required])),
        // purchaseDate: new FormControl(rowData.purchaseDate ? this.getDateFormat(rowData.purchaseDate) : "", Validators.compose([Validators.required])),
        // tenure: new FormControl(rowData.tenure, Validators.compose([Validators.required])),
        // paid: new FormControl(rowData.paid, Validators.compose([Validators.required])),
        // seasoning: new FormControl({ value: rowData.seasoning, disabled: true }),
        // ad: new FormControl({ value: rowData.ad, disabled: true }),
        // pd: new FormControl({ value: rowData.pd, disabled: true }),
        // gridValue: new FormControl({ value: rowData.gridValue, disabled: true }),
        // id: rowData.id,
        // vehicleId: rowData.vehicleId

        ad: new FormControl({ value: rowData.ad, disabled: true }),
        assetBodyType: new FormControl(rowData.assetBodyType, [Validators.required]),
        assetBodyTypeDesc: new FormControl(rowData.assetBodyTypeDesc),
        assetModel: new FormControl(rowData.assetModel, [Validators.required]),
        assetModelDesc: new FormControl(rowData.assetModelDesc),
        financier: new FormControl(rowData.financier, [Validators.required]),
        financierDesc: new FormControl(rowData.financierDesc),
        gridValue: new FormControl({ value: rowData.gridValue, disabled: true }),
        id: rowData.id,
        leadId: rowData.leadId,
        loanNo: new FormControl(rowData.loanNo, Validators.compose([Validators.required])),
        make: new FormControl(rowData.make, [Validators.required]),
        makeDesc: new FormControl(rowData.makeDesc),
        paid: new FormControl(rowData.paid, Validators.required),
        pd: new FormControl({ value: rowData.pd, disabled: true }),
        purchaseDate: new FormControl(rowData.purchaseDate ? this.getDateFormat(rowData.purchaseDate) : "", Validators.compose([Validators.required])),
        regdNo: new FormControl(rowData.regdNo, Validators.compose([Validators.required])),
        regdOwner: new FormControl(rowData.regdOwner, Validators.compose([Validators.required])),
        region: new FormControl(rowData.region, [Validators.required]),
        regionDesc: new FormControl(rowData.regionDesc),
        relation: new FormControl({value: rowData.relation, disabled: true}),
        relationDesc: new FormControl(rowData.relationDesc),
        seasoning: new FormControl({ value: rowData.seasoning, disabled: true }),
        tenure: new FormControl(rowData.tenure, Validators.compose([Validators.required])),
        vehicleId: rowData.vehicleId,
        vehicleType: new FormControl(rowData.vehicleType, [Validators.required]),
        vehicleTypeDesc: new FormControl(rowData.vehicleTypeDesc),
        yom: new FormControl(rowData.yom, Validators.compose([Validators.required]))
      })
    }
    else return this.fb.group({
      regdNo: new FormControl('', Validators.compose([Validators.required])),
      regdOwner: new FormControl('', Validators.compose([Validators.required])),
      relation: new FormControl({value: '', disabled: true}),
      make: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required]),
      assetBodyType: new FormControl('', [Validators.required]),
      assetModel: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      yom: new FormControl('', Validators.compose([Validators.required])),
      financier: new FormControl('', [Validators.required]),
      loanNo: new FormControl('', Validators.compose([Validators.required])),
      purchaseDate: new FormControl('', [Validators.required]),
      tenure: new FormControl('', Validators.compose([Validators.required])),
      paid: new FormControl('', Validators.required),
      seasoning: new FormControl({ value: '', disabled: true }),
      ad: new FormControl({ value: '', disabled: true }),
      pd: new FormControl({ value: '', disabled: true }),
      gridValue: new FormControl({ value: '', disabled: true }),
      vehicleId: ''
    });
  }

  // make field changes 
  onAssetMake(value, obj, index) {
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

            this.vehicleTypeLov[index] = VehicleTypeArray;
            obj.patchValue({
              vehicleType: '',
              assetBodyType: '',
              yom: ''
            })

          } else {
            this.vehicleTypeLov = []
            this.toasterService.showWarning('No Data in Vehicle Master Asset Make', 'Vehicle Master Asset Make')
          }
        } else {
          this.vehicleTypeLov = []
          this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Asset Make')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  //  vechile type change event
  onVehicleType(value, obj, index) {

    let assetBodyTypeData = []

    if (value) {

      const data =
      {
        "region": obj.value.region,
        "productCategory": this.productCatoryCode,
        "make": obj.value.make,
        "vehicleType": value
      }

      this.vehicleDetailService.getVehicleMasterFromVehicleType(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {
            this.assetBodyType = res.ProcessVariables.vehicleMasterDetails;
            assetBodyTypeData = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "uniqueSegmentCode", "segmentCode");

            this.assetBodyTypeLov[index] = assetBodyTypeData;

            obj.patchValue({
              assetBodyType: '',
              assetModel: '',
              assetVariant: '',
              yom: ''
            })

          } else {
            this.assetBodyTypeLov = []
            this.toasterService.showWarning('No Data in Vehicle Master Vehicle Type', 'Vehicle Master Vehicle Type')
          }
        } else {
          this.assetBodyTypeLov = []
          this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Vehicle Type')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  // asst body tye event
  onAssetBodyType(value: any, obj, index) {
    this.assetModelType = this.assetBodyType.filter((data) => data.uniqueSegmentCode === value)
    this.assetModelTypeLov[index] = this.utilityService.getValueFromJSON(this.assetModelType,
      "vehicleModelCode", "vehicleModel")
    obj.patchValue({
      assetModel: '',
      yom: ''
    })
  }

  // get vechile Id
  onAssetModel(value: any, obj, index) {
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    const array = this.utilityService.getCommonUniqueValue(this.assetVariant, 'vehicleVariant')
    const formArray = (this.fleetForm.get('Rows') as FormArray);
    formArray.controls[index].patchValue({
      vehicleId: array.length > 0 ? Number(array[0].vehicleCode) : 0,
      yom: ' '

    })
  }

  // region change event
  onVehicleRegion(value: any, obj, index) {
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
          this.vehicleManufacturer[index] = assetMakeArray;
          obj.patchValue({
            make: '',
            vehicleType: '',
            assetBodyType: '',
            assetModel: '',
            assetVariant: '',
            yom: ''
          })
        } else {
          this.vehicleManufacturer = []
          this.toasterService.showWarning('No Data in Vehicle Master Region', 'Vehicle Master Region')
        }
      } else {
        this.vehicleManufacturer = []
        this.toasterService.showWarning(res.ErrorMessage, 'Vehicle Master Region')
      }
      this.uiLoader.stop();
    }, error => {
      console.log(error, 'error')
      this.uiLoader.stop();
    })
  }

  // YOM changes 
  onGetDateValue(event, index) {
    if (event > this.toDayDate) {
      this.customFutureDate = true;
    } else {
      this.customFutureDate = false;
      const formArray = (this.fleetForm.get('Rows') as FormArray);
      this.getVehicleGridValue(formArray, index)

      this.onCheckPurchaseDate(formArray.controls[index].get('purchaseDate').value, index, formArray.controls[index])
    }
  }

  onCheckPurchaseDate(dateOfPurchase, index, obj) {

    if (dateOfPurchase) {
      const formArray = (this.fleetForm.get('Rows') as FormArray);
      let yomDate = new Date(formArray.controls[index].get('yom').value, 12, 0, 0, 0);
      this.minDate = yomDate;

      const event = new Date(dateOfPurchase)
      if (event <= this.toDayDate) {
        const purchaseYear = event.getFullYear();
        const yomYear = yomDate.getFullYear();

        if (yomYear > purchaseYear) {
          this.fleetForm.patchValue({
            isValidPurchaseDate: false
          })
          // this.toasterService.showError('Purchase Date Invalid', '')
        } else {
          this.fleetForm.patchValue({
            isValidPurchaseDate: true
          })
        }

      } else {
        this.fleetForm.patchValue({
          isValidPurchaseDate: true
        })
      }

    }
  }

  // get grid value
  getVehicleGridValue(formArray: any, index) {

    if (formArray.value[index].vehicleId !== 0) {

      const date = this.utilityService.convertDateTimeTOUTC(formArray.value[index].manufactureYear, 'YYYY')
      const data = { "manufactureYear": date, "vehicleCode": formArray.value[index].vehicleId + '' };

      this.vehicleDetailService.getVehicleGridValue(data).subscribe((res: any) => {
        const apiError = res.ProcessVariables.error.message;

        formArray.controls[index].patchValue({
          gridValue: res.ProcessVariables.vehicleCost,
        })
      }, err => {
        console.log('err', err)
      })
    } else {
      this.toasterService.showWarning('Please Select Asset Varient', '')
    }
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.fleetLov.applicantRelationshipWithLead = value.LOVS.applicantRelationshipWithLead;
      this.allLovs = value.LOVS;

      this.fleetLov.vehicleFinanciers = value.LOVS.vehicleFinanciers;
    });
  }

  regsOwnerChange(event, index) {
    // this.relation = [];
    const relation = event.target.value;
    const applicantType = this.applicantArray.find(
      (ele) => 
      ele.applicantId === Number(relation));
    console.log(applicantType, "type");
    

    const relationArray = this.fleetLov.applicantRelationshipWithLead
    const relationValue = relationArray.find((data)=>data.key === applicantType.applicantTypeKey)
    console.log(index, relationValue, "relation");
    this.formArr.controls[index]['controls']['relation'].setValue(relationValue.key)
    
    


  }

  makeChange(event) {
    this.make = [];
    const make = event.target.value;
  }

  financierChange(event, index) {
    const financierName = event.target.value;
    this.financierName = financierName;
    console.log(financierName, 'financierName');
    if(financierName === 'Not-Applicable') {
      this.disableFinanceierBased(index);
      this.removeValidatoresFinanceierBased(index);
      this.formArr.controls[index].patchValue({
        loanNo: null,
        tenure: null,
        paid: null,
        seasoning: null
      })
    } else {
      this.addValidatoresFinanceierBased(index);
      this.enableFinanceierBased(index);
    }

  }

  addValidatoresFinanceierBased(index) {
    this.formArr.controls[index]['controls']['loanNo'].setValidators(Validators.required);
    this.formArr.controls[index]['controls']['tenure'].setValidators(Validators.required);
    this.formArr.controls[index]['controls']['paid'].setValidators(Validators.required);
    this.formArr.controls[index]['controls']['loanNo'].updateValueAndValidity();
    this.formArr.controls[index]['controls']['tenure'].updateValueAndValidity();
    this.formArr.controls[index]['controls']['paid'].updateValueAndValidity();
  }

  removeValidatoresFinanceierBased(index) {
    this.formArr.controls[index]['controls']['loanNo'].clearValidators();
    this.formArr.controls[index]['controls']['tenure'].clearValidators();
    this.formArr.controls[index]['controls']['paid'].clearValidators();
    this.formArr.controls[index]['controls']['loanNo'].updateValueAndValidity();
    this.formArr.controls[index]['controls']['tenure'].updateValueAndValidity();
    this.formArr.controls[index]['controls']['paid'].updateValueAndValidity();
  }

  enableFinanceierBased(index) {
    this.formArr.controls[index]['controls']['loanNo'].enable();
    this.formArr.controls[index]['controls']['tenure'].enable();
    this.formArr.controls[index]['controls']['paid'].enable();
  }

  disableFinanceierBased(index) {
    console.log(this.formArr.controls[index]['controls'], 'form')
    this.formArr.controls[index]['controls']['loanNo'].disable();
    this.formArr.controls[index]['controls']['tenure'].disable();
    this.formArr.controls[index]['controls']['paid'].disable();

  }

  calcSeasoning(event, i) {
    let tenure = parseInt(this.formArr.controls[i]['controls']['tenure'].value);
    let paid = parseInt(this.formArr.controls[i]['controls']['paid'].value)
    this.formArr.controls[i]['controls']['seasoning'].patchValue((paid / tenure) * 100)
  }

  getDateFormat(date) {
    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
    return dateFormat;
  }

  dateDbFormat(date) {
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    return formattedDate;
  }

  sendDate(date) {
    const dateFormat: Date = new Date(date);
    let year = dateFormat.getFullYear();
    let month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + "/" + month1 + "/" + year;
    return formattedDate;
  }

  // method for saving and updating fleet details

  saveOrUpdateFleetDetails(index) {
    const formArray = (this.fleetForm.get('Rows') as FormArray);

    for (let i = 0; i < this.fleetDetails.length; i++) {
      this.fleetDetails[i]['purchaseDate'] = this.sendDate(this.fleetDetails[i]['purchaseDate'])
      this.fleetDetails[i]['tenure'] = this.fleetDetails[i]['tenure'] ? Number(this.fleetDetails[i]['tenure']) : null;
      this.fleetDetails[i]['paid'] = this.fleetDetails[i]['paid'] ? Number(this.fleetDetails[i]['paid']) : null;
      this.fleetDetails[i]['gridValue'] = Number(formArray.controls[i]['controls']['gridValue'].value);

      this.fleetDetails[i]['seasoning'] = formArray.controls[i]['controls']['seasoning'].value;
      this.fleetDetails[i]['ad'] = formArray.controls[i]['controls']['ad'].value;
      this.fleetDetails[i]['pd'] = formArray.controls[i]['controls']['pd'].value;
    }
    const udfData = this.userDefineForm ? JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      fleets: this.fleetDetails,
      udfDetails: [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }]
    }

    this.fleetDetailsService.saveOrUpdateFleetDetails(data).subscribe((res: any) => {
      if (res['ProcessVariables'].error['code'] == "0") {
        this.fleetIDs = res.ProcessVariables.ids
        this.toasterService.showSuccess('Record saved successfully!', '');
        const fleetList: Array<any> = res.ProcessVariables.fleets;
        // for (let i = 0; i < fleetList.length; i++) {
        //   this.onGetDateValue(fleetList[i], i)
        // }
        // this.fleetArrayList.controls = [];        
        // fleetList.map((val: any, i) =>
        //   this.fleetArrayList.push(this.initRows(val)));
        if (index != null && index != 'next') {
          this.fleetId = this.fleetIDs[index];
          this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + this.fleetId]);
        }
      } else if (res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
      } else if (res['Error'] == "1") {
        this.toasterService.showError(res['ErrorMessage'], '');
      }
      // return false
    });
  }

  //  method for getting fleet Details

  getFleetDetails() {
    const data = {
      leadId: this.leadId,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          //"udfScreenId": this.udfScreenId
        }
      ]
    }
    this.fleetDetailsService.getFleetDetails(data).subscribe((res: any) => {
      if (res['Status'] == "Execution Completed" && res.ProcessVariables.fleets != null) {
        const fleets = res['ProcessVariables'].fleets;
        this.udfDetails = res['ProcessVariables'].udfDetails;
        this.formArr.clear();
        for (let i = 0; i < fleets.length; i++) {
          this.apiValue = fleets;
          this.vehicleTypeLov[i] = this.allLovs.vehicleType;
          this.regionLov[i] = this.allLovs.assetRegion;
          this.vehicleManufacturer[i] = this.allLovs.vehicleManufacturer;
          this.assetBodyTypeLov[i] = [{
            key: fleets[i].assetBodyType,
            value: fleets[i].assetBodyTypeDesc
          }];
          this.assetModelTypeLov[i] = [{
            key: fleets[i].assetModel,
            value: fleets[i].assetModelDesc
          }];
          if (!fleets[i].seasoning) {
            fleets[i].seasoning = (fleets[i].paid / fleets[i].tenure) * 100
          }
          if (i == 0) {
            this.formArr.push(this.initRows(fleets[i]))
          }
          else {
            this.addNewRow(fleets[i]);
          }

          const financierName =  this.apiValue[i].financier
          if(financierName === 'Not-Applicable') {
            this.disableFinanceierBased(i);
            this.removeValidatoresFinanceierBased(i);
          } else {
            this.addValidatoresFinanceierBased(i);
            this.enableFinanceierBased(i); 
          }
          // this.onGetDateValue(fleets[i].yom, i)
        }
      } else {
        if (res['Error'] == "1") {
          this.toasterService.showError(res['ErrorMessage'], '');
        }
        this.vehicleTypeLov[0] = this.allLovs.vehicleType;
        this.regionLov[0] = this.allLovs.assetRegion;
        this.vehicleManufacturer[0] = this.allLovs.vehicleManufacturer;
        this.formArr.push(this.initRows(null));
      }
      this.operationType = this.toggleDdeService.getOperationType();
      if (this.operationType) {
        this.fleetForm.disable();
        this.disableSaveBtn = true;
      }

      if (this.loanViewService.checkIsLoan360()) {
        this.fleetForm.disable();
        this.disableSaveBtn = true;
      }
    })
  }

  addNewRow(rowData?: any) {
    this.formArr.push(this.initRows(rowData));
    this.regionLov[this.formArr.length - 1] = this.allLovs.assetRegion;
  }

  deleteRow(index: number, fleets: any) {
    this.deleteRecordData = {
      index,
      fleets
    };
  }

  callDeleteRecord() {
    const index = this.deleteRecordData.index;
    const fleets = this.deleteRecordData.fleets;
    
    // if (fleets.length > 1) {
    this.formArr.removeAt(index);

    const data = {
      id: fleets[index].id,
      leadId: this.leadId
    };

    this.fleetDetailsService.deleteFleetDetails(data).subscribe((res: any) => {
      if (fleets.length === 0) {
        this.addNewRow()
      }
      // this.getFleetDetails();
    });

    fleets.splice(index, 1)
    this.toasterService.showSuccess("Record deleted successfully!", '')

    // } 

    // else {
    //   this.toasterService.showError("atleast one record required !", '')
    // }
  }

  toReference() {
    this.router.navigate(['pages/dde/' + this.leadId + '/reference']);
  }

  pageChange(event) {
    this.itemsPerPage = event.target.value;
  }

  onFormSubmit(index: any) {

    if (this.isLoan360) {
      if (index === 'next') {
        return this.router.navigateByUrl(`pages/dde/${this.leadId}/exposure`);
      }
      return;
    }

    this.fleetDetails = this.fleetForm.getRawValue().Rows;
    console.log('Fleet Form', this.fleetForm.controls);
    

    if (this.operationType && index === 'next') {
      this.router.navigate(['pages/dde/' + this.leadId + '/exposure']);
      return;
    } else {

      if (index === 'next') {

        let isValueCheck = true;
        this.isDirty = false;

        this.finalValue = this.fleetForm.getRawValue().Rows;

        if (this.finalValue.length > 0 && this.apiValue && this.apiValue.length > 0) {
          this.finalValue.filter((data, i) => {
            data.purchaseDate = this.sendDate(data['purchaseDate'])
            this.apiValue.filter((res, j) => {
              if (i === j) {
                isValueCheck = this.objectComparisonService.compare(data, res);
              }
            })
          })
        }

        // if (!this.fleetForm.valid) {
        //   this.toasterService.showInfo('Please SAVE details before proceeding', '');
        //   return;
        // }

        if (!isValueCheck) {
          this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
          return;
        }

        this.router.navigate(['pages/dde/' + this.leadId + '/exposure'])

      } else {
        const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false;

        if (this.fleetForm.valid && !isUDFInvalid && this.fleetForm.controls['isValidPurchaseDate'].value === true) {
          this.saveOrUpdateFleetDetails(index);
        } else {
          this.isDirty = true;
          this.toasterService.showError('Please enter valid details', '');
          console.log(this.fleetForm, 'fleetForm')
          this.utilityService.validateAllFormFields(this.fleetForm);
        }
      }
    }
  }

  onClose() {
    this.showUploadModal = false;
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  removeFile() {
    this.fileUrl = null;
    this.fileName = null;
    this.fileSize = null;
    this.showError = null;
    this.fileInput.nativeElement.value = '';
  }

  uploadFile() {
    if (this.showError) {
      return this.toasterService.showError('Please select valid document', '');
    }

    this.fleetDetailsService.validateFleetDetails({
      allText: this.csvData,
      userId: this.userId,
      leadId: this.leadId
    }).subscribe(((value: any) => {
      if (value.Error !== '0') {
        return this.toasterService.showError(value.ErrorMessage, '');
      }
      const processVariables = value.ProcessVariables;
      const error = processVariables.error;
      if (error && error.code !== '0') {
        return this.toasterService.showError(error.message, '');
      }
      this.removeFile();
      this.docsFleetDetails = processVariables.fleetDetails;
    }));
  }

  onFileSelect(event) {
    this.csvData = null;
    const files: File = event.target.files[0];
    let fileType = '';
    this.fileUrl = files;
    const target: DataTransfer = event.target;
    if (target.files.length !== 1) {
      return this.toasterService.showError('Cannot use multiple files', '');
    }
    if (!files.type) {
      const type = files.name.split('.')[1];
      fileType = this.getFileType(type);
    } else {
      fileType = this.getFileType(files.type);
    }
    this.fileName = files.name;
    this.fileSize = this.bytesToSize(files.size);

    if (!fileType.includes('xls') && !fileType.includes('csv')) {
      this.showError = `Only files with following extensions are allowed: xlsx,csv`;
      return;
    }
    if (files.size > 2097152) {
      this.showError = `File is too large. Allowed maximum size is 2 MB`;
      return;
    }
    this.showError = null;

    const fileToRead = files;
    const fileReader = new FileReader();
    if (fileType.includes('xls')) {
      this.getDataFromXlsFile(target);
    } else {
      fileReader.onload = (fileLoadedEvent: any) => {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        this.csvData = textFromFileLoaded;
      };
      fileReader.readAsText(fileToRead);
    }
  }

  getDataFromXlsFile(target) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });

      if (data && data.length !== 0) {
        const size = data.length;
        const header: any = data[0];
        let i = -1;
        const dateHeaders = [];
        for (const element of header) {
          i++;
          if (element && element.includes('date')) {
            dateHeaders.push(i);
          }
        }

        const xlsData = data.map((value: any, index) => {
          let val = value.join(',');
          if (size - 1 !== index) {
            val = val === '' ? '' : val + '\r\n';
          }
          return val;
        });
        let finalData = '';
        xlsData.forEach((value) => {
          finalData += value;
        });
        this.csvData = finalData;

      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  getDateFormattedXlsData(data, dateIndex: any[]) {
    let index = -1;
    for (const element of data) {
      index++;
      if (index !== 0) {
        dateIndex.forEach((value) => {
          const dataValue = element[value];
          const parse = Date.parse(dataValue);
          if (!isNaN(parse) && parse >= 0) {
            const valueType = typeof dataValue;
            if (valueType === 'string' && dataValue.includes('-')) {
              let dateValue = dataValue.split('-');
              if (dateValue.length === 3) {
                dateValue = dateValue.join('/');
                element[value] = dateValue;
                data[index] = element;
              }
            } else if (valueType === 'string' && dataValue.includes('/')) {
              let dateValue = dataValue.split('/');
              if (dateValue.length === 3) {
                dateValue = dateValue.join('/');
                element[value] = dataValue;
                data[index] = element;
              }
            } else {
              const d = new Date(dataValue);
              let month: any = d.getMonth() + 1;
              const year = d.getFullYear();
              let day: any = d.getDate();
              day = day <= 9 ? `0${day}` : day;
              month = month <= 9 ? `0${month}` : month;
              element[value] = moment(new Date(dataValue)).format('DD/MM/YYYY');
              data[index] = element;
            }
          }
        });
      }
    }
    return data;
  }

  onFileLoad(fileLoadedEvent: any) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvData = textFromFileLoaded;
  }

  saveValidRecords() {
    const filteredData = this.docsFleetDetails.filter((value) => {
      return value.status;
    });

    if (filteredData.length === 0 && this.fleetForm.invalid) {
      return this.toasterService.showError('All are invalid records', '');
    }

    this.fleetDetailsService.saveValidRecords({
      fleetDetails: filteredData,
      userId: this.userId,
      leadId: this.leadId,

    }).subscribe(((value: any) => {
      if (value.Error !== '0') {
        return this.toasterService.showError(value.ErrorMessage, '');
      }
      const processVariables = value.ProcessVariables;
      const error = processVariables.error;
      if (error && error.code !== '0') {
        return this.toasterService.showError(error.message, '');
      }
      this.docsFleetDetails = null;
      this.showUploadModal = false;
      this.toasterService.showSuccess('Saved successfully', '');
      this.getFleetDetails();
    }));
  }

  onModalClose() {
    this.docsFleetDetails = null;
  }

  getFileType(type: string) {
    const types = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'image/tiff': 'tiff',
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'application/msword': 'docx',
      'text/csv': 'csv',
      csv: 'csv'
    };
    return types[type] || type;
  }

  private bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return 'n/a';
    }
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
  }

}
