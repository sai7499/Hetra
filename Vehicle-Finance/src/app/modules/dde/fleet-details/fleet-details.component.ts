import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { FleetDetailsService } from '../services/fleet-details.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { CommentStmt } from '@angular/compiler';
import { UtilityService } from '@services/utility.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { TypeaheadOptions } from 'ngx-bootstrap/typeahead/public_api';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {
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
  // relationSelected = []
  relation: any[];
  make: any = [];
  financierName: any = [];
  // vehicleId: any;
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

  regexPattern = {
    // tensure: {
    //   rule: "^[1-9][0-9]*$",
    //   msg: 'Alphabets and Special Characters not allowed'
    // },
    // length: {
    //   rule: '3',
    //   msg: ''
    // },
    // contact: {
    //   rule: /^\d{10}$/,
    //   msg: 'Invalid Number / Alphabets and Special Characters not allowed'
    // },
    // contLength: {
    //   rule: '10'
    // },
    // maxLoanLength:{
    //   rule: '20'
    // },
    // minLoanLength:{
    //   rule: '4'
    // },
    // name: {
    //   rule: /^[a-zA-Z ]*$/,
    //   msg: 'Invalid Name / Numbers and Special Characters not allowed'
    // },
    // nameLength:{
    //   rule: '30'
    // },
    // vachilePattern: {
    //   rule: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
    //   msg: 'Invalid Name / Special Characters not allowed'
    // },
    // loanNoPattern: {
    //   rule: /^[ A-Za-z0-9_@./#&+-]*$/,
    //   msg: 'Invalid Vechile No / Special Characters not allowed'
    // }
  }
  currentYear = new Date().getFullYear();
  yearCheck = [];
  paidTenureCheck = [];
  fleetArrayList: FormArray;
  operationType: string;
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
    private toggleDdeService: ToggleDdeService) {
    this.yearCheck = [{ rule: val => val > this.currentYear, msg: 'Future year not accepted' }];
    this.fleetArrayList = this.fb.array([]);
  }


  async ngOnInit() {

    // accessing lead if from route

    this.leadId = (await this.getLeadId()) as number;
    console.log("leadID =>", this.leadId)

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();
    // const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadDetails = leadData['leadDetails']
    // this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    // this.leadId = leadData['leadId']

    console.log("user id ==>", this.userId)

    this.getLov();
    this.getFleetDetails();

    this.fleetForm = this.fb.group(
      {
        Rows: this.fleetArrayList
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

  }
  checkPaid(event, i) {
    let tenure = parseInt(this.formArr.controls[i]['controls']['tenure'].value);
    let paid = parseInt(this.formArr.controls[i]['controls']['paid'].value)
    if (paid > tenure) {
      this.formArr.controls[i]['controls']['paid'].setErrors({ 'incorrect': true })

    } else {
      // this.formArr.controls[i]['controls']['paid'].setErrors({'incorrect': false})

    }
    // this.paidTenureCheck = [{rule: val => val>tenure,msg:'Paid not grater tenure'}]
    // this.sharedService.vaildateForm$.subscribe((value) => {
    //   this.formValue = value;
    // })
  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
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
      // formData.form.controls['email'].setErrors({'incorrect': true});
      this.formArr.controls[i]['controls']['yom'].setErrors({ 'incorrect': true })
      // alert("invalid")
    } else {

    }
  }

  initRows(rowData) {
    // if (rowData) {
    //   return this.fb.group({
    //     regdNo: [rowData.regdNo],
    //     regdOwner: [rowData.regdOwner],
    //     relation: [rowData.relation],
    //     make: [rowData.make],
    //     yom: [rowData.yom],
    //     financier: [rowData.financier],
    //     loanNo: [rowData.loanNo],
    //     purchaseDate: [rowData.purchaseDate ? this.dateDbFormat(rowData.purchaseDate) : ""],
    //     tenure: [rowData.tenure],
    //     paid: [rowData.paid],
    //     seasoning: [rowData.seasoning],
    //     // ad: [{ value: rowData.ad, disabled: true }],
    //     ad: [rowData.ad],
    //     // pd: [{ value: rowData.pd, disabled: true }],
    //     pd: [rowData.pd],
    //     // gridValue: [{ value: rowData.gridValue, disabled: true }],
    //     gridValue: [rowData.gridValue],
    //     id: [rowData.id]
    //   })
    // }


    if (rowData) {
      return this.fb.group({
        regdNo: new FormControl(rowData.regdNo, Validators.compose([Validators.required])),
        regdOwner: new FormControl(rowData.regdOwner, Validators.compose([Validators.required])),
        relation: new FormControl(rowData.relation, [Validators.required]),
        region: new FormControl(rowData.region, [Validators.required]),
        make: new FormControl(rowData.make, [Validators.required]),
        vehicleType: new FormControl(rowData.vehicleType, [Validators.required]),
        assetBodyType: new FormControl(rowData.assetBodyType, [Validators.required]),
        assetModel: new FormControl(rowData.assetModel, [Validators.required]),
        yom: new FormControl(rowData.yom, Validators.compose([Validators.required])),
        financier: new FormControl(rowData.financier, [Validators.required]),
        loanNo: new FormControl(rowData.loanNo, Validators.compose([Validators.required])),
        purchaseDate: new FormControl(rowData.purchaseDate ? this.getDateFormat(rowData.purchaseDate) : "", Validators.compose([Validators.required])),
        tenure: new FormControl(rowData.tenure, Validators.compose([Validators.required])),
        paid: new FormControl(rowData.paid, Validators.compose([Validators.required])),
        seasoning: new FormControl({ value: rowData.seasoning, disabled: true }),
        ad: new FormControl({ value: rowData.ad, disabled: true }),
        pd: new FormControl({ value: rowData.pd, disabled: true }),
        gridValue: new FormControl({ value: rowData.gridValue, disabled: true }),
        id: rowData.id,
        vehicleId: rowData.vehicleId,
      })
    }
    else return this.fb.group({
      // id: [],
      regdNo: new FormControl('', Validators.compose([Validators.required])),
      regdOwner: new FormControl('', Validators.compose([Validators.required])),
      relation: new FormControl('', [Validators.required]),
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
      paid: new FormControl('', Validators.compose([Validators.required])),
      seasoning: new FormControl({ value: '', disabled: true }),
      ad: new FormControl({ value: '', disabled: true }),
      pd: new FormControl({ value: '', disabled: true }),
      gridValue: new FormControl({ value: '', disabled: true }),
      vehicleId: '',
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

    // this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
    //   0, "vehicleVariant")

    // obj.patchValue({
    //   yom : ''
    // })

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
    if (event.target.value > this.toDayDate) {
      this.customFutureDate = true;
    } else {
      this.customFutureDate = false;
      const formArray = (this.fleetForm.get('Rows') as FormArray);

      this.getVehicleGridValue(formArray, index)
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

  relationShipChange(event) {
    this.relation = [];
    console.log('relationShipChange', event.target.value);
    const relation = event.target.value;
  }

  makeChange(event) {
    this.make = [];
    console.log('make ', event.target.value);
    const make = event.target.value;
  }
  financierChange(event) {
    this.financierName = [];
    console.log('financier name', event.target.value);
    const financierName = event.target.value;
  }

  calcSeasoning(event , i){
    let tenure = parseInt(this.formArr.controls[i]['controls']['tenure'].value);
    let paid = parseInt(this.formArr.controls[i]['controls']['paid'].value)
    this.formArr.controls[i]['controls']['seasoning'].patchValue((paid/tenure)*100)   

  }

  getDateFormat(date) {

    // console.log("in getDateFormat", date)

    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);

    // year = dateFormat.getFullYear();
    // month = Number(dateFormat.getMonth()) + 1;
    // let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    // day = dateFormat.getDate().toString();
    // day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // const formattedDate = year + '-' + month1 + '-' + day;
    // //   const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("formattedDate", formattedDate)
    return dateFormat;
  }

  dateDbFormat(date) {
    // console.log("in dataDbFormat", date)
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("res", formattedDate)
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
    //console.log(this.fleetDetails);
    const formArray = (this.fleetForm.get('Rows') as FormArray);

    for (let i = 0; i < this.fleetDetails.length; i++) {
      this.fleetDetails[i]['purchaseDate'] = this.sendDate(this.fleetDetails[i]['purchaseDate'])
      this.fleetDetails[i]['tenure'] = parseInt(this.fleetDetails[i]['tenure'])
      this.fleetDetails[i]['paid'] = parseInt(this.fleetDetails[i]['paid'])
      this.fleetDetails[i]['gridValue'] = parseInt(formArray.controls[i]['controls']['gridValue'].value);
         this.fleetDetails[i]['seasoning'] = parseInt(formArray.controls[i]['controls']['seasoning'].value);

    }
    //  this.fleetDetails['purchaseDate'] = this.sendDate(this.fleetDetails['purchaseDate'])
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      fleets: this.fleetDetails,
    }
    //  console.log("in save fleet", this.fleetDetails)
    this.fleetDetailsService.saveOrUpdateFleetDetails(data).subscribe((res: any) => {
      console.log("saveFleetDetailsResponse", res.ProcessVariables.ids)
      this.fleetIDs = res.ProcessVariables.ids
      console.log("saveFleetDetailsResponse", this.fleetIDs)
      this.toasterService.showSuccess('Record saved successfully!', '');
      const fleetList: Array<any> = res.ProcessVariables.fleets;
      this.fleetArrayList.controls = [];
      fleetList.forEach(val =>
        this.fleetArrayList.push(this.initRows(val)));

      console.log("fletds", this.fleetArrayList);
      if (index != null && index != 'next') {
        console.log(" in rtr function index", index);
        // console.log("fletds", this.fleetIDs)

        this.fleetId = this.fleetIDs[index];
        console.log("this fleet id", this.fleetId);
        this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + this.fleetId]);

      }
      else if (index == 'next') {

        this.router.navigate(['pages/dde/' + this.leadId + '/exposure'])

      }
      else {
        console.log("in save function")
      }

    });
  }

  //  method for getting fleet Details

  getFleetDetails() {
    const data = {
      leadId: this.leadId
    }
    this.fleetDetailsService.getFleetDetails(data).subscribe((res: any) => {
      if (res['Status'] == "Execution Completed" && res.ProcessVariables.fleets != null) {
        const fleets = res['ProcessVariables'].fleets;
        for (let i = 0; i < fleets.length; i++) {
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
          if(!fleets[i].seasoning){
            fleets[i].seasoning = (fleets[i].paid/fleets[i].tenure) * 100
          }
          if (i == 0) {
            this.formArr.push(this.initRows(fleets[i]))
          }
          else {
            this.addNewRow(fleets[i]);
          }
        }
      } else {
        this.vehicleTypeLov[0] = this.allLovs.vehicleType;
        this.regionLov[0] = this.allLovs.assetRegion;
        this.vehicleManufacturer[0] = this.allLovs.vehicleManufacturer;
        this.formArr.push(this.initRows(null));
      }
      this.operationType = this.toggleDdeService.getOperationType();
      if (this.operationType === '1') {
        this.fleetForm.disable();
        this.disableSaveBtn = true;
      }
      // console.log("in get fleets", res.ProcessVariables.fleets)
      // console.log("get fleet response", res.ProcessVariables.fleets)
      // console.log("fleet form controls", this.fleetForm.controls.Rows)
    })
  }


  addNewRow(rowData) {
    this.formArr.push(this.initRows(rowData));
    this.regionLov[this.formArr.length - 1] = this.allLovs.assetRegion;
  }

  deleteRow(index: number, fleets: any) {
    console.log("in delete row fn ", fleets, index)
    this.formArr.removeAt(index);
    if (fleets.length > 1) {
      // console.log("inside del fun", fleets)

      // console.log("vehicleId", fleets[index].id)

      const data = {
        id: fleets[index].id,
        leadId: this.leadId
      }

      this.fleetDetailsService.deleteFleetDetails(data).subscribe((res: any) => {

        // console.log("response from delete api", res.ProcessVariables)
      });

      fleets.splice(index, 1)
      this.toasterService.showSuccess("Record deleted successfully!", '')

    } else {
      this.toasterService.showError("atleast one record required !", '')

    }
  }

  getRtr(index: number) {

    // if (this.fleetIDs! = null) {
    //   this.fleetId = (this.fleetIDs)


    //   console.log("fleet id", this.fleetId)
    // }
    // else {
    //   console.log("fleets not recieved")
    // }

    // if (this.fleetId) {
    //   // console.log("in getRtr", fleetid)
    //   // this.router.navigateByUrl('pages/dde/' + this.leadId + '/track-vehicle' , { state: { id:fleetid } });
    //   this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + this.fleetId])

    // }
    // else {
    //   this.toasterService.showError("fleet not saved!", '')
    // }


  }

  toCollaterals() {
    this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
  }
  toExposure() {


  }


  onFormSubmit(index: any) {

    this.fleetDetails = this.fleetForm.value.Rows;
    console.log("fleet form value", this.fleetForm)

    this.isDirty = true;
    if (this.operationType === '1' && index === 'next') {
      this.router.navigate(['pages/dde/' + this.leadId + '/exposure']);
      return;
    } else {
      if (this.fleetForm.valid === true) {
        // this.fleetDetails = this.fleetForm.value.Rows
        // console.log(this.fleetDetails)
        this.saveOrUpdateFleetDetails(index);
      } else {
        this.isDirty = true;
        // console.log('Error', this.fleetForm)
        this.toasterService.showError('Please enter valid details', '');
        this.utilityService.validateAllFormFields(this.fleetForm);
      }
    }
  }
}


