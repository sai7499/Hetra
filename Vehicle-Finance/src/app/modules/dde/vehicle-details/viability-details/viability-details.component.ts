import { Base64StorageService } from './../../../../services/base64-storage.service';
import { LoginService } from '@modules/login/login/login.service';
import { ApplicantService } from '@services/applicant.service';
import { UploadService } from '@services/upload.service';
import { GpsService } from 'src/app/services/gps.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ViabilityServiceService } from '@services/viability-service.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common';
import { LoginStoreService } from '@services/login-store.service';

import { Constant } from '../../../../../assets/constants/constant';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-viability-details',
  templateUrl: './viability-details.component.html',
  styleUrls: ['./viability-details.component.css']
})
export class ViabilityDetailsComponent implements OnInit {

  public label: any = {};
  public labelPassanger: any = {};
  public labelPassangerStandOperator: any = {};
  public labelCaptive: any = {};
  public viabilityData: any;
  public vehicleModel = '';
  // tslint:disable-next-line: variable-name
  public vehicle_viability_value = '1VHCLVBTY';
  isDirty = false;
  namePattern = {
    rule: '^[A-Z,a-z, ]*$',
    msg: 'Invalid Name',
  };
  nameLength30 = {
    rule: 30,
  };
  inputValidation = {
    rule: '^[0-9]*$',
    msg: 'Enter Digits Only',
  };
  inputLength10 = {
    rule: 10,
  };
  public viabilityForm: any;
  viabilityObj: any;
  viabliityDataToPatch: any;
  collataralId: any;
  leadId: number;
  userId: string;
  monthlyIncome = 0;
  monthlyRunningKm = 0;
  montlyStandOperatorIncome = 0;
  standoperatorExpense: number;
  standOperatorEmi = 0;
  montlyCaptiveIncome = 0;
  captiveExpense = 0;
  captiveEmi = 0;
  netCashFlowEmiPassenger = 0;
  netFlowCash = 0;  // netcashflow for passengar group
  roleAndUserDetails: any;
  routerUrl: any;
  hideSubmit = true;
  taskId: any;
  viabilityDataObj = {};
  viabilityDataObjArray: any;

  base64Image: any;
  showModal: boolean;
  isMobile: any;

  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;

  SELFIE_IMAGE: string;

  documentArr: DocumentDetails[] = [];
  latitude: string = null;
  longitude: string = null;
  branchLatitude: string;
  branchLongitude: string;
  custProfileDetails: {};
  showRouteMap: boolean;

  selectedDocDetails: DocRequest;
  dmsDocumentId: string;


  constructor(private fb: FormBuilder, private labelsData: LabelsService,
              private viabilityService: ViabilityServiceService,
              private commonlovService: CommomLovService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private router: Router,
              private location: Location,
              private loginStoreService: LoginStoreService,
              private gpsService: GpsService,
              private uploadService: UploadService,
              private applicantService: ApplicantService,
              private loginService: LoginService,
              private base64StorageService: Base64StorageService,
              ) {
                this.route.queryParams.subscribe((res: any) => {
                  this.taskId = res.taskId;
                });
                this.isMobile = environment.isMobile;

               }

  async ngOnInit() {

    // if (this.isMobile) {
    //   this.gpsService.getLatLong().subscribe((position) => {
    //     console.log("getLatLong", position);
    //     this.gpsService.initLatLong().subscribe((res) => {
    //       console.log("gpsService", res);
    //       if (res) {
    //         this.gpsService.getLatLong().subscribe((position) => {
    //           console.log("getLatLong", position);
    //         });
    //       } else {
    //         console.log("error initLatLong", res);
    //       }
    //     });
    //   });
    // }

    this.userId = localStorage.getItem('userId');
    this.roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log(this.roleAndUserDetails);
    this.routerUrl = this.router;

    this.labelsData.getLabelsData()
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(data => {
        this.label = data;
      },
        error => {
          console.log(error, 'error');
        });
    this.commonlovService.getLovData().subscribe((res: any) => {
      console.log(res.LOVS);
      this.viabilityObj = res.LOVS;
      console.log(this.viabilityObj.businessType);
    });
    // this.createForm();
    this.viabilityForm = this.fb.group({
      type: ['', Validators.required],
      passanger: this.fb.group({
        onwardRoute : [],
        returnRoute: [],
        natureOfGoods: [],
        distanceInKm: [],
        tripsPerMonth: [],
        monthlyRunningKm: [],
        avgLoadPerTon: [],
        rateTonne: [],
        fuelAvgPerKm: [],
        costPerLtr: [],
        noOfTyres: [],
        perTyreCost: [],
        newTyreLifeKm: [],
        fuelCost: [],
        tyreCost: [],
        driversSalary: [],
        cleanersSalary: [],
        permitCost: [],
        fcCharge: [],
        paidTollTax: [],
        taxes: [],
        maintanence: [],
        busMiscellaneousExpenses: [],
        busInsurenceExpenses: [],
        busMonthlyIncome: [this.monthlyIncome],
        netCashFlow: [this.netFlowCash],
        emi: [],
        totalExpenses: [],
        otherIncome: [],
        otherIncomeRemarks: [],
        otherExpenses: [],
        otherExpensesRemarks: [],
        operationsExpenses: [],
        netCashFlowEmi: this.netCashFlowEmiPassenger

      }),
      passangerStandOperator: this.fb.group({
        application: [],
        grossIncomePerDay: [],
        businessEarningPerDay: [],
        businessIncomePerDay: [],
        avgTyreExpenses: [],
        insuranceExpenses: [],
        miscellaneousExpenses: [],
        totalExpenses: [],
        netCashFlow: [this.montlyStandOperatorIncome],
        emi: [],
        netCashFlowEmi: this.standOperatorEmi
      }),
      captive: this.fb.group({
        natureOfBusiness: [],
        businessIncomePerDay: [],
        businessEarningPerDay: [],
        busExpensesPerDay: [],
        oblicationsPerMonth: [],
        busTyreAvgExpenses: [],
        busInsurenceExpenses: [],
        busMiscellaneousExpenses: [],
        busMonthlyIncome: [this.montlyCaptiveIncome],
        totalExpenses: [],
        netCashFlow: [],
        emi: ([]),
        netCashFlowEmi: this.captiveEmi
      }),
    });
    this.leadId = (await this.getLeadId()) as number;
    this.collataralId = (await this.getCollateralId()) as number;
    console.log(this.collataralId);
    this.getViability();
    // this.getViabilityList(Number(this.leadId));
    console.log(this.viabilityForm.controls);
    console.log(this.route.parent.firstChild.params);
    if (this.router.url.includes('/dde')) {
      this.hideSubmit = false;
      console.log('dde url found', this.router);
    }
    // this.viabilityForm.controls.passanger.get('otherIncome').valueChanges.subscribe(x => {
    //   setTimeout( () => {
    //     if ( x != null || undefined ) {
    //       // let i = this.label?.validationData?.amountValue;
    //       // tslint:disable-next-line: max-line-length
    //       this.viabilityForm.controls.passanger.addControl('otherIncomeRemarks');
    //       this.viabilityForm.controls.passanger.get('otherIncomeRemarks').setValidators([Validators.required, Validators.maxLength(40)]);
    //       this.viabilityForm.controls.passanger.get('otherIncomeRemarks').updateValueAndValidity();
    //       // alert('control added');
    //      } else {
    //       this.viabilityForm.controls.passanger.removeControl('otherIncomeRemarks');
    //       this.viabilityForm.controls.passanger.get('otherIncomeRemarks').clearValidators();
    //       this.viabilityForm.controls.passanger.get('otherIncomeRemarks').updateValueAndValidity();
    //       alert('control cleared');
    //      }
    //   }, 500);
    // });
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

  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  getCollateralId() {
    return new Promise((resolve, reject) => {
      this.route.parent.firstChild.params.subscribe((value) => {
        if (value && value.collateralId) {
          resolve(Number(value.collateralId));
          this.viabilityDataObj = this.viabilityService.getCollateralId();
          console.log(this.viabilityDataObj);
          if (this.viabilityDataObj === null || this.viabilityDataObj === undefined) {
             this.viabilityService.getViabilityList({leadId: this.leadId}).subscribe((res: any) => {
              res.ProcessVariables.vehicleViabilityDashboardList.filter((dataRes: any) => {
              if ( dataRes.collateralId === value.collateralId) {
                this.viabilityDataObj = dataRes;
                console.log(this.viabilityDataObj);
              }
            });
             }
             );

          }
        }
        resolve(null);
      });
      console.log(this.viabilityDataObj);
    });

  }
  submitViability() {
    this.isDirty = true;
    if (this.viabilityForm.invalid) {
      this.toasterService.showError('Details Not Saved', 'Please Save before submitting');
      return;
    } else { this.onSave(); }
    const body = {
      leadId : this.leadId,
      collateralId: this.collataralId,
      taskId: this.taskId
    };
    this.viabilityService.submitViabilityTask(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if ( res.ProcessVariables.error.code == '0') {
       this.toasterService.showSuccess('Record Saved Successfully', 'Viability');
       this.router.navigateByUrl(`pages/dashboard`);
      // tslint:disable-next-line: triple-equals
      } else if (res.ProcessVariables.error.code == '1') {
        this.toasterService.showError(res.ProcessVariables.error.message, 'Viability');
      }
    });
  }
  // getViabilityList(id) {
  //   const body = {
  //     leadId : id
  // };
  //   this.viabilityService.getViabilityList(body).subscribe((res: any) => {
  //   if (res.ProcessVariables.error.code === '0') {
  //  this.collataralId = Number(res.ProcessVariables.vehicleViabilityDashboardList[0].collateralId) ;
  // //  this.getViability(this.collataralId);
  //  }
  // });

  // }
vehicle_viability_navigate(event) {
    console.log(event);
    this.vehicle_viability_value = event ? event : event;
    if (this.vehicle_viability_value === '1VHCLVBTY') {
      this.passengerViability();
      this.removeStandOverValidators();
      this.removeCaptiveValidators();
    } else if (this.vehicle_viability_value === '2VHCLVBTY') {
      this.StandOverViability();
      this.removePassengerValidators();
      this.removeCaptiveValidators();

    } else if (this.vehicle_viability_value === '3VHCLVBTY') {
      this.captiveViability();
      this.removePassengerValidators();
      this.removeStandOverValidators();

    }
  }
  private  passengerViability() {
   const privateViability = this.viabilityForm.controls.passanger as FormGroup;
   privateViability.get('onwardRoute').setValidators(Validators.required);
   privateViability.get('returnRoute').setValidators(Validators.required);
   privateViability.get('natureOfGoods').setValidators(Validators.required);
  //  privateViability.get('distanceInKm').setValidators(Validators.required);
   privateViability.get('tripsPerMonth').setValidators(Validators.required);
   privateViability.get('monthlyRunningKm').setValidators(Validators.required);
   privateViability.get('avgLoadPerTon').setValidators(Validators.required);
   privateViability.get('rateTonne').setValidators(Validators.required);
   privateViability.get('fuelAvgPerKm').setValidators(Validators.required);
   privateViability.get('costPerLtr').setValidators(Validators.required);
   privateViability.get('noOfTyres').setValidators(Validators.required);
   privateViability.get('perTyreCost').setValidators(Validators.required);
   privateViability.get('newTyreLifeKm').setValidators(Validators.required);
   privateViability.get('fuelCost').setValidators(Validators.required);
   privateViability.get('tyreCost').setValidators(Validators.required);
   privateViability.get('driversSalary').setValidators(Validators.required);
   privateViability.get('cleanersSalary').setValidators(Validators.required);
   privateViability.get('permitCost').setValidators(Validators.required);
   privateViability.get('fcCharge').setValidators(Validators.required);
   privateViability.get('paidTollTax').setValidators(Validators.required);
   privateViability.get('taxes').setValidators(Validators.required);
   privateViability.get('maintanence').setValidators(Validators.required);
   privateViability.get('busMiscellaneousExpenses').setValidators(Validators.required);
   privateViability.get('busInsurenceExpenses').setValidators(Validators.required);
  //  privateViability.get('otherIncome').setValidators(null);
  //  privateViability.get('netCashFlow').setValidators(Validators.required);
   privateViability.get('emi').setValidators(Validators.required);
   privateViability.get('totalExpenses').setValidators(Validators.required);

  }
   private StandOverViability() {
    const privateStandViability = this.viabilityForm.controls.passangerStandOperator as FormGroup;
    privateStandViability.get('application').setValidators(Validators.required);
    privateStandViability.get('grossIncomePerDay').setValidators(Validators.required);
    privateStandViability.get('businessEarningPerDay').setValidators(Validators.required);
    privateStandViability.get('businessIncomePerDay').setValidators(Validators.required);
    privateStandViability.get('avgTyreExpenses').setValidators(Validators.required);
    privateStandViability.get('insuranceExpenses').setValidators(Validators.required);
    privateStandViability.get('miscellaneousExpenses').setValidators(Validators.required);
    privateStandViability.get('totalExpenses').setValidators(Validators.required);
    privateStandViability.get('netCashFlow').setValidators(Validators.required);
    privateStandViability.get('emi').setValidators(Validators.required);
   }
   private captiveViability() {
    const captive = this.viabilityForm.controls.captive as FormGroup;
    captive.get('natureOfBusiness').setValidators(Validators.required);
    captive.get('businessIncomePerDay').setValidators(Validators.required);
    captive.get('businessEarningPerDay').setValidators(Validators.required);
    captive.get('busExpensesPerDay').setValidators(Validators.required);
    captive.get('oblicationsPerMonth').setValidators(Validators.required);
    captive.get('busTyreAvgExpenses').setValidators(Validators.required);
    captive.get('busInsurenceExpenses').setValidators(Validators.required);
    captive.get('busMiscellaneousExpenses').setValidators(Validators.required);
    captive.get('busMonthlyIncome').setValidators(null);
    captive.get('totalExpenses').setValidators(Validators.required);
    captive.get('netCashFlow').setValidators(Validators.required);
    captive.get('emi').setValidators(Validators.required);
   }
   public removePassengerValidators() {
    const privateViability = this.viabilityForm.controls.passanger as FormGroup;
    // tslint:disable-next-line: forin
    for (const key in privateViability.controls) {
      privateViability.get(key).clearValidators();
      privateViability.get(key).updateValueAndValidity();
    }
}
public removeStandOverValidators() {
  const privateViability = this.viabilityForm.controls.passangerStandOperator as FormGroup;
  // tslint:disable-next-line: forin
  for (const key in privateViability.controls) {
    privateViability.get(key).clearValidators();
    privateViability.get(key).updateValueAndValidity();
  }
}
  public removeCaptiveValidators() {
    const privateViability = this.viabilityForm.controls.captive as FormGroup;
    // tslint:disable-next-line: forin
    for (const key in privateViability.controls) {
      privateViability.get(key).clearValidators();
      privateViability.get(key).updateValueAndValidity();
    }
  }
getViability() {
    const body = {
      userId: this.userId,
      collateralId: this.collataralId
    };
    this.viabilityService.getViabilityDetails(body).subscribe((res: any) => {
      if (res.ProcessVariables.error.code === '0' && res.ProcessVariables.vehicleViability != null) {
      this.viabliityDataToPatch = res.ProcessVariables.vehicleViability;

      this.latitude = this.viabliityDataToPatch.latitude;
      this.longitude = this.viabliityDataToPatch.longitude;
      this.branchLatitude = this.viabliityDataToPatch.brLatitude;
      this.branchLongitude = this.viabliityDataToPatch.brLongitude;
      this.dmsDocumentId = this.viabliityDataToPatch.selfiePhoto

      if(this.dmsDocumentId){
        this.downloadDocs(this.dmsDocumentId);
      }
      if(this.latitude){
        this.getRouteMap();
      }

      if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '1VHCLVBTY') {
        this.viabilityForm.value.type = this.viabliityDataToPatch.type;
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.patchViability(this.viabliityDataToPatch);
        this.calculatePassenger();
        this.calculatePassengerB();
        this.calculatePassengerC();
        this.calculatePassengerD();
        this.viabilityForm.patchValue ({
          type: this.viabliityDataToPatch.type
         }) ;
       } else if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '2VHCLVBTY') {
        this.viabilityForm.value.type = this.viabliityDataToPatch.type;
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.viabilityForm.patchValue ({
          type: this.viabliityDataToPatch.type
         }) ;
        this.setPassangetStandOperator(this.viabliityDataToPatch);
        this.calculateStandOperator();
        this.calculateStandOperatorB();
        this.calculateStandOperatorC();
       } else if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '3VHCLVBTY') {
        this.viabilityForm.patchValue ({
         type: this.viabliityDataToPatch.type
        }) ;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.setCapative(this.viabliityDataToPatch);
        this.calculateCaptive();
        this.calculateCaptiveB();
        this.calculateCaptiveC();
       }
    } else {
      this.viabilityForm.patchValue({
        type: this.vehicle_viability_value
      }) ;
    }
    });

  }
onSave() {
    this.isDirty = true;
    this.vehicle_viability_navigate(this.viabilityForm.value.type);
    if (this.viabilityForm.invalid) {
      console.log(this.viabilityForm);
      this.toasterService.showError('Mandatory fields missing', '');
      return;
    }
    if (this.viabilityForm.value.type === '1VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          longitude: this.longitude,
          latitude: this.latitude,
          selfiePhoto: this.dmsDocumentId,
          collateralId: this.collataralId,
          type: this.viabilityForm.value.type,
          ...this.convertPassenger(this.viabilityForm.value.passanger)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
        if ( res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', 'Viability');
          this.getViability();
          if (this.router.url.includes('/dde')) {
            // this.router.navigateByUrl(`/pages/dde/${this.leadId}/viability-list`);
              //  this.getViability();
          } else {
            // this.router.navigateByUrl(`/pages/viability-list/${this.leadId}/viability-list`);
          }
         } else {
       this.toasterService.showError(res.ProcessVariables.error.message, 'Viability');
      }
    });
    } else if ( this.viabilityForm.value.type === '2VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          longitude: this.longitude,
          latitude: this.latitude,
          selfiePhoto: this.dmsDocumentId,
          collateralId: this.collataralId,
          type: this.viabilityForm.value.type,
          ...this.convertStandOperative(this.viabilityForm.value.passangerStandOperator)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
        if ( res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', 'Viability');
          this.getViability();
         } else {
       this.toasterService.showError(res.ProcessVariables.error.message, 'Viability');
      }
    });
     } else if ( this.viabilityForm.value.type === '3VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          longitude: this.longitude,
          latitude: this.latitude,
          selfiePhoto: this.dmsDocumentId,
          collateralId: this.collataralId,
          type: this.viabilityForm.value.type,
          ...this.convertCapitve(this.viabilityForm.value.captive)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
        if ( res.ProcessVariables.error.code === '0') {
           this.toasterService.showSuccess('Record Saved Successfully', 'Viability');
           this.getViability();
          } else {
        this.toasterService.showError(res.ProcessVariables.error.message, 'Viability');
       }
    });
     }
  }


 // tslint:disable-next-line: no-shadowed-variable
patchViability(data: any) {
   const passanger = this.viabilityForm.controls.passanger as FormGroup;
   passanger.patchValue({
    //  route: data.route ? data.route : null,
        onwardRoute : data.onwardRoute ? data.onwardRoute : null,
        returnRoute: data.returnRoute ?  data.returnRoute : null,
        natureOfGoods: data.natureOfGoods ? data.natureOfGoods : null ,
        distanceInKm: data.distanceInKm ? data.distanceInKm : 45,
        tripsPerMonth: data.tripsPerMonth ? data.tripsPerMonth : null,
        monthlyRunningKm: data.monthlyRunningKm ? data.monthlyRunningKm : null,
        avgLoadPerTon: data.avgLoadPerTon ? data.avgLoadPerTon : null,
        rateTonne: data.rateTonne ? data.rateTonne : null,
        fuelAvgPerKm: data.fuelAvgPerKm ? data.fuelAvgPerKm : null,
        costPerLtr: data.costPerLtr ? data.costPerLtr : null,
        noOfTyres: data.noOfTyres ? data.noOfTyres : null,
        perTyreCost: data.perTyreCost ? data.perTyreCost : null,
        newTyreLifeKm: data.newTyreLifeKm ? data.newTyreLifeKm : null,
        fuelCost: data.fuelCost ? data.fuelCost : null,
        tyreCost: data.tyreCost ? data.tyreCost : null,
        driversSalary: data.driversSalary ? data.driversSalary : null,
        cleanersSalary: data.cleanersSalary ? data.cleanersSalary : null,
        permitCost: data.permitCost ? data.permitCost : null,
        fcCharge: data.fcCharge ? data.fcCharge : null,
        paidTollTax: data.paidTollTax ? data.paidTollTax : null,
        taxes: data.taxes ? data.taxes : null,
        maintanence: data.maintanence ? data.maintanence : null,
        busMiscellaneousExpenses: data.busMiscellaneousExpenses ? data.busMiscellaneousExpenses : null,
        busInsurenceExpenses: data.busInsurenceExpenses ? data.busInsurenceExpenses : null,
        busMonthlyIncome: data.busMonthlyIncome ? data.busMonthlyIncome : null,
        netCashFlow: data.netCashFlow ? data.netCashFlow : null,
        emi: data.emi ? data.emi : null,
        totalExpenses: data.totalExpenses ? data.totalExpenses : null,
        otherIncome: data.otherIncome ? data.otherIncome : null,
        otherIncomeRemarks: data.otherIncomeRemarks ? data.otherIncomeRemarks : null,
        otherExpenses: data.otherExpenses ? data.otherExpenses : null,
        otherExpensesRemarks: data.otherExpensesRemarks ? data.otherExpensesRemarks : null,
        operationsExpenses: data.operationsExpenses ? data.operationsExpenses : null


    });
 }
 // tslint:disable-next-line: no-shadowed-variable
 convertPassenger(data: any) {
   const body = {
       otherIncome: data.otherIncome ? data.otherIncome : null,
       otherIncomeRemarks: data.otherIncomeRemarks ? data.otherIncomeRemarks : '',
       onwardRoute : data.onwardRoute ? data.onwardRoute : null,
       returnRoute: data.returnRoute ?  data.returnRoute : null,
       natureOfGoods: data.natureOfGoods ? data.natureOfGoods : null ,
       distanceInKm: data.distanceInKm ? Number (data.distanceInKm) : null,
       tripsPerMonth: data.tripsPerMonth ? Number (data.tripsPerMonth) : null,
       monthlyRunningKm: data.monthlyRunningKm ? Number(data.monthlyRunningKm) : null,
       avgLoadPerTon: data.avgLoadPerTon ? Number(data.avgLoadPerTon) : null,
       rateTonne: data.rateTonne ? Number(data.rateTonne) : null,
       fuelAvgPerKm: data.fuelAvgPerKm ? Number(data.fuelAvgPerKm) : null,
       costPerLtr: data.costPerLtr ? Number(data.costPerLtr) : null,
       noOfTyres: data.noOfTyres ? Number(data.noOfTyres) : null,
       perTyreCost: data.perTyreCost ? Number(data.perTyreCost) : null,
       newTyreLifeKm: data.newTyreLifeKm ? Number(data.newTyreLifeKm) : null,
       fuelCost: data.fuelCost ? Number(data.fuelCost)  : null,
       tyreCost: data.tyreCost ? Number(data.tyreCost) : null,
       driversSalary: data.driversSalary ? Number(data.driversSalary) : null,
       cleanersSalary: data.cleanersSalary ? Number(data.cleanersSalary) : null,
       permitCost: data.permitCost ? Number(data.permitCost) : null,
       fcCharge: data.fcCharge ? Number(data.fcCharge) : null,
       paidTollTax: data.paidTollTax ? Number(data.paidTollTax) : null,
       taxes: data.taxes ? Number(data.taxes) : null,
       maintanence: data.maintanence ? Number(data.maintanence) : null,
       busMiscellaneousExpenses: data.busMiscellaneousExpenses ? Number(data.busMiscellaneousExpenses) : null,
       busInsurenceExpenses: data.busInsurenceExpenses ? Number(data.busInsurenceExpenses) : null,
       busMonthlyIncome: data.busMonthlyIncome ? Number(data.busMonthlyIncome) : null,
       netCashFlow: this.netFlowCash ? this.netFlowCash : null,
       emi: data.emi ? Number(data.emi) : null,
       totalExpenses: data.totalExpenses ? Number(data.totalExpenses) : null,
       otherExpenses: data.otherExpenses ? data.otherExpenses : null,
       otherExpensesRemarks: data.otherExpensesRemarks ? data.otherExpensesRemarks : null,
       operationsExpenses: data.operationsExpenses ? data.operationsExpenses : null,
       netCashFlowEmi : this.netCashFlowEmiPassenger ? this.netCashFlowEmiPassenger : null
   };
   return body;
 }
 // tslint:disable-next-line: no-shadowed-variable
setPassangetStandOperator(data: any) {
  const passangerStandOperator = this.viabilityForm.controls.passangerStandOperator as FormGroup;
  passangerStandOperator.patchValue({
    application: data.application ? data.application : null,
    grossIncomePerDay: data.grossIncomePerDay ? data.grossIncomePerDay : null,
    businessEarningPerDay : data.businessEarningPerDay ? data.businessEarningPerDay : null,
    businessIncomePerDay : data.businessIncomePerDay ? data.businessIncomePerDay : null,
    avgTyreExpenses : data.avgTyreExpenses ? data.avgTyreExpenses : null,
    insuranceExpenses : data.insuranceExpenses ? data.insuranceExpenses : null,
    miscellaneousExpenses : data.miscellaneousExpenses ? data.miscellaneousExpenses  : null,
    totalExpenses : data.totalExpenses ? data.totalExpenses : null,
    netCashFlow : data.netCashFlow  ? data.netCashFlow : null,
    emi : data.emi ?  data.emi : null
  });
 }
 // tslint:disable-next-line: no-shadowed-variable
 convertStandOperative(data: any) {
   const body = {
    application: data.application ? data.application : null,
    grossIncomePerDay: data.grossIncomePerDay ? Number(data.grossIncomePerDay) : null,
    businessEarningPerDay : data.businessEarningPerDay ? Number(data.businessEarningPerDay) : null,
    businessIncomePerDay : data.businessIncomePerDay ? Number(data.businessIncomePerDay) : null,
    avgTyreExpenses : data.avgTyreExpenses ? Number(data.avgTyreExpenses) : null,
    insuranceExpenses : data.insuranceExpenses ? Number(data.insuranceExpenses) : null,
    miscellaneousExpenses : data.miscellaneousExpenses ? Number(data.miscellaneousExpenses)  : null,
    totalExpenses : data.totalExpenses ? Number (data.totalExpenses) : null,
    netCashFlow : data.netCashFlow  ? data.netCashFlow : null,
    emi : data.emi ? Number (data.emi) : null,
    netCashFlowEmi : this.standOperatorEmi ? this.standOperatorEmi : null
   };
   return body;
 }
 setCapative(dataCaptive: any) {
  const captive = this.viabilityForm.controls.captive as FormGroup;
  captive.patchValue({
    natureOfBusiness: dataCaptive.natureOfBusiness ? dataCaptive.natureOfBusiness : null ,
    businessIncomePerDay:  dataCaptive.businessIncomePerDay ? dataCaptive.businessIncomePerDay : null ,
    businessEarningPerDay:  dataCaptive.businessEarningPerDay ? dataCaptive.businessEarningPerDay : null ,
    busExpensesPerDay:  dataCaptive.busExpensesPerDay ? dataCaptive.busExpensesPerDay : null ,
    oblicationsPerMonth:  dataCaptive.oblicationsPerMonth ? dataCaptive.oblicationsPerMonth : null ,
    busTyreAvgExpenses:  dataCaptive.busTyreAvgExpenses ? dataCaptive.busTyreAvgExpenses : null ,
    busInsurenceExpenses:  dataCaptive.busInsurenceExpenses ? dataCaptive.busInsurenceExpenses : null ,
    busMiscellaneousExpenses:  dataCaptive.busMiscellaneousExpenses ? dataCaptive.busMiscellaneousExpenses : null ,
    busMonthlyIncome:  dataCaptive.busMonthlyIncome ? Number(this.montlyCaptiveIncome) : null ,
    totalExpenses: dataCaptive.totalExpenses ? dataCaptive.totalExpenses : null,
    netCashFlow: dataCaptive.netCashFlow ? dataCaptive.netCashFlow : null,
    emi: dataCaptive.emi ? dataCaptive.emi : null
  });
 }

convertCapitve(dataCaptive) {
  console.log(this.montlyCaptiveIncome, 'this.montlyCaptiveIncome', this.netFlowCash, 'this.netFlowCash');
  const body = {
    natureOfBusiness: dataCaptive.natureOfBusiness ? dataCaptive.natureOfBusiness : null ,
    businessIncomePerDay:  dataCaptive.businessIncomePerDay ? Number(dataCaptive.businessIncomePerDay) : null ,
    businessEarningPerDay:  dataCaptive.businessEarningPerDay ? Number(dataCaptive.businessEarningPerDay) : null ,
    busExpensesPerDay:  dataCaptive.busExpensesPerDay ? Number(dataCaptive.busExpensesPerDay) : null ,
    oblicationsPerMonth:  dataCaptive.oblicationsPerMonth ? Number(dataCaptive.oblicationsPerMonth) : null ,
    busTyreAvgExpenses:  dataCaptive.busTyreAvgExpenses ? Number(dataCaptive.busTyreAvgExpenses) : null ,
    busInsurenceExpenses:  dataCaptive.busInsurenceExpenses ? Number(dataCaptive.busInsurenceExpenses) : null ,
    busMiscellaneousExpenses:  dataCaptive.busMiscellaneousExpenses ? Number(dataCaptive.busMiscellaneousExpenses) : null ,
    busMonthlyIncome:  this.montlyCaptiveIncome ? Number(this.montlyCaptiveIncome) : null ,
    totalExpenses: dataCaptive.totalExpenses ? Number(dataCaptive.totalExpenses) : null,
    netCashFlow: dataCaptive.netCashFlow ? dataCaptive.netCashFlow : null,
    emi: dataCaptive.emi ? Number(dataCaptive.emi) : null,
    netCashFlowEmi : this.captiveEmi   ? this.captiveEmi : null
  };
  return body;
 }
 onNext() {
   this.router.navigateByUrl(`pages/dde/${this.leadId}/score-card`);
 }
 onBack() {
// this.location.back();
if (this.router.url.includes('/dde')) {
  this.router.navigateByUrl(`pages/dde/${this.leadId}/viability-list`);
} else {
  this.router.navigateByUrl(`pages/viability-list/${this.leadId}/viability-list`);
}
 }
 calculatePassenger() {
   this.monthlyRunningKm = 0 ;
   this.monthlyIncome = 0;
   const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
   console.log(passengerGroup);
   const distanceInKm = passengerGroup.value.distanceInKm ? Number(passengerGroup.value.distanceInKm) : 0;
   const tripsPerMonth = passengerGroup.value.tripsPerMonth ? Number(passengerGroup.value.tripsPerMonth) : 0;
   const otherIncome = passengerGroup.value.otherIncome ? Number(passengerGroup.value.otherIncome) : 0;
   const monthlyRunningKm = distanceInKm * tripsPerMonth;
   this.monthlyRunningKm = monthlyRunningKm ;
   const avgLoadPerTon = passengerGroup.value.avgLoadPerTon ? Number(passengerGroup.value.avgLoadPerTon) : 0;
   const rateTonne = (passengerGroup.value.rateTonne) ? Number(passengerGroup.value.rateTonne) : 0;
   const tonnageCalc =  avgLoadPerTon * rateTonne;
   this.monthlyIncome = tripsPerMonth * tonnageCalc + otherIncome;
   passengerGroup.value.busMonthlyIncome = this.monthlyIncome;
  //  this.viabilityForm.value.passanger.patchValue({
  //   busMonthlyIncome : this.monthlyIncome
  //  });
   passengerGroup.patchValue({
    monthlyRunningKm : this.monthlyRunningKm
  });
   this.calculatePassengerB();
  //  this.calculatePassengerC();
  //  this.calculatePassengerD();
 }
 calculatePassengerB() {
  const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
  const monthlyRunningKm = passengerGroup.value.monthlyRunningKm ? Number(passengerGroup.value.monthlyRunningKm) : 0;
  const costPerLtr = passengerGroup.value.costPerLtr ? Number(passengerGroup.value.costPerLtr) : 0;
  const fuelAvgPerKm = passengerGroup.value.fuelAvgPerKm ? Number(passengerGroup.value.fuelAvgPerKm) : 0;
  const fuelCostPass = Math.round( (monthlyRunningKm * costPerLtr) / fuelAvgPerKm) ;
  passengerGroup.patchValue({
    fuelCost : fuelCostPass
  });
  const noOfTyres = passengerGroup.value.noOfTyres ? Number(passengerGroup.value.noOfTyres) : 0;
  const newTyreLifeKm = passengerGroup.value.newTyreLifeKm ? Number(passengerGroup.value.newTyreLifeKm) : 0;
  const perTyreCost = passengerGroup.value.perTyreCost ? Number(passengerGroup.value.perTyreCost) : 0;
  const tyreCostPass = Math.round ((noOfTyres * perTyreCost * monthlyRunningKm) / newTyreLifeKm);
  passengerGroup.patchValue( {
    tyreCost : tyreCostPass
  });
  // this.calculatePassenger();
  // this.calculatePassengerB();
  this.calculatePassengerC();
  // this.calculatePassengerD();
 }
 calculatePassengerC() {
  const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
  const tyreCost = passengerGroup.value.tyreCost ? Number(passengerGroup.value.tyreCost) : 0;
  const fuelCost = passengerGroup.value.fuelCost ? Number(passengerGroup.value.fuelCost) : 0;
  const driversSalary = passengerGroup.value.driversSalary ? Number(passengerGroup.value.driversSalary) : 0;
  const cleanersSalary = passengerGroup.value.cleanersSalary ? Number(passengerGroup.value.cleanersSalary) : 0;
  const permitCost = passengerGroup.value.permitCost ? Number(passengerGroup.value.permitCost) : 0;
  const fcCharge = passengerGroup.value.fcCharge ? Number(passengerGroup.value.fcCharge) : 0;
  const paidTollTax =  passengerGroup.value.paidTollTax ? Number(passengerGroup.value.paidTollTax) : 0;
  const taxes = passengerGroup.value.taxes ? Number(passengerGroup.value.taxes) : 0 ;
  const maintanence =  passengerGroup.value.maintanence ? Number( passengerGroup.value.maintanence ) : 0 ;
  const otherExpenses =  passengerGroup.value.otherExpenses ? Number( passengerGroup.value.otherExpenses ) : 0 ;
  const operationsExpenses =  passengerGroup.value.operationsExpenses ? Number( passengerGroup.value.operationsExpenses ) : 0 ;
  // tslint:disable-next-line: max-line-length
  const  busMiscellaneousExpenses =  passengerGroup.value.busMiscellaneousExpenses ? Number( passengerGroup.value.busMiscellaneousExpenses) : 0 ;
  const busInsurenceExpenses = passengerGroup.value.busInsurenceExpenses ? Number(passengerGroup.value.busInsurenceExpenses) : 0;
  // const busMonthlyIncome = passengerGroup.value.busMonthlyIncome ? Number(passengerGroup.value.busMonthlyIncome) : 0;
  // tslint:disable-next-line: max-line-length
  const expense = tyreCost + fuelCost + driversSalary + busMiscellaneousExpenses + cleanersSalary + permitCost + fcCharge + paidTollTax + taxes + maintanence + busInsurenceExpenses + operationsExpenses + otherExpenses;
  passengerGroup.patchValue({
  totalExpenses : expense
  });
  // passengerGroup.patchValue({
  //   netCashFlow : this.monthlyIncome - expense
  // });
  this.netFlowCash = this.monthlyIncome - expense;
  // this.calculatePassenger();
  // this.calculatePassengerB();
  // this.calculatePassengerC();
  this.calculatePassengerD();
 }
 calculatePassengerD() {
  const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
  const totalExpenses = passengerGroup.value.totalExpenses ? Number(passengerGroup.value.totalExpenses) : 0;
  const emi = passengerGroup.value.emi ? Number(passengerGroup.value.emi) : '';
  const netFlow = this.monthlyIncome - totalExpenses;
  // tslint:disable-next-line: triple-equals
  if (emi != '') {
    const emiCal = (netFlow / emi).toFixed(2);
    this.netCashFlowEmiPassenger = Number(emiCal);
  }
  // const emiCal = (netFlow / emi).toFixed(2);

  // this.calculatePassenger();
  // this.calculatePassengerB();
  // this.calculatePassengerC();
  // this.calculatePassengerD();
}
 calculateStandOperator() {
  this.montlyStandOperatorIncome = 0;
  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  console.log(passengerStandGroup);
  const businessEarningPerDay = Number(passengerStandGroup.value.businessEarningPerDay);
  const grossIncomePerDay = Number(passengerStandGroup.value.grossIncomePerDay);
  this.montlyStandOperatorIncome = businessEarningPerDay * grossIncomePerDay;
  // this.calculateStandOperator();
  this.calculateStandOperatorB();
  // this.calculateStandOperatorC();
 }
 calculateStandOperatorB() {
  this.standoperatorExpense = 0;

  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  const businessEarningPerDay = passengerStandGroup.value.businessEarningPerDay ?
  Number(passengerStandGroup.value.businessEarningPerDay) : 0;
  // tslint:disable-next-line: max-line-length
  // const grossIncomePerDay = Number(passengerStandGroup.value.grossIncomePerDay) ?  Number(passengerStandGroup.value.grossIncomePerDay) : 0;
  const businessIncomePerDay =  passengerStandGroup.value.businessIncomePerDay ? Number(passengerStandGroup.value.businessIncomePerDay) : 0;
  const avgTyreExpenses = passengerStandGroup.value.avgTyreExpenses ? Number(passengerStandGroup.value.avgTyreExpenses) : 0;
  const insuranceExpenses = passengerStandGroup.value.insuranceExpenses ? Number(passengerStandGroup.value.insuranceExpenses) : 0;
  // tslint:disable-next-line: max-line-length
  const miscellaneousExpenses = passengerStandGroup.value.miscellaneousExpenses ? Number(passengerStandGroup.value.miscellaneousExpenses) : 0;
  this.standoperatorExpense = (businessIncomePerDay * businessEarningPerDay ) + avgTyreExpenses + insuranceExpenses + miscellaneousExpenses;
  passengerStandGroup.patchValue({
    totalExpenses : this.standoperatorExpense
  });
  const ncf = this.montlyStandOperatorIncome - this.standoperatorExpense;
  passengerStandGroup.patchValue({
    netCashFlow : ncf
  });
  // this.calculateStandOperator();
  // this.calculateStandOperatorB();
  this.calculateStandOperatorC();
}
calculateStandOperatorC() {
  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  const emi = passengerStandGroup.value.emi ? Number(passengerStandGroup.value.emi) : '';
  const ncf = passengerStandGroup.value.netCashFlow ? Number(passengerStandGroup.value.netCashFlow) : 0;
  // tslint:disable-next-line: triple-equals
  if (emi != '') {
  const calEMI: number = Number( ncf / emi);
  const emiCal = Number(calEMI.toFixed(2));
  console.log(calEMI);
  this.standOperatorEmi = (emiCal);
 }

  // this.calculateStandOperator();
  // this.calculateStandOperatorB();
  // this.calculateStandOperatorC();
}
calculateCaptive() {
  this.montlyCaptiveIncome = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  console.log(passengerStandGroup);
  // tslint:disable-next-line: max-line-length
  const businessEarningPerDay = passengerStandGroup.value.businessEarningPerDay ? Number(passengerStandGroup.value.businessEarningPerDay) : 0;
  const grossIncomePerDay = (passengerStandGroup.value.businessIncomePerDay) ? Number(passengerStandGroup.value.businessIncomePerDay) : 0;
  this.montlyCaptiveIncome = businessEarningPerDay * grossIncomePerDay;
  // this.calculateCaptive();
  this.calculateCaptiveB();
  // this.calculateCaptiveC();
 }
 calculateCaptiveB() {
  this.captiveExpense = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  const businessEarningPerDay = passengerStandGroup.value.businessEarningPerDay ?
  Number(passengerStandGroup.value.businessEarningPerDay) : 0;
  const businessIncomePerDay =  passengerStandGroup.value.busExpensesPerDay ? Number(passengerStandGroup.value.busExpensesPerDay) : 0;
  const avgTyreExpenses = passengerStandGroup.value.busTyreAvgExpenses ? Number(passengerStandGroup.value.busTyreAvgExpenses) : 0;
  const insuranceExpenses = passengerStandGroup.value.busInsurenceExpenses ? Number(passengerStandGroup.value.busInsurenceExpenses) : 0;
  // tslint:disable-next-line: max-line-length
  const miscellaneousExpenses = passengerStandGroup.value.busMiscellaneousExpenses ? Number(passengerStandGroup.value.busMiscellaneousExpenses) : 0;
  const oblicationsPerMonth = passengerStandGroup.value.oblicationsPerMonth ? Number(passengerStandGroup.value.oblicationsPerMonth) : 0;
  // tslint:disable-next-line: max-line-length
  this.captiveExpense = (businessIncomePerDay * businessEarningPerDay) + avgTyreExpenses + insuranceExpenses + miscellaneousExpenses + oblicationsPerMonth;
  passengerStandGroup.patchValue({
    totalExpenses : this.captiveExpense
  });
  const ncf = this.montlyCaptiveIncome - this.captiveExpense;
  passengerStandGroup.patchValue({
    netCashFlow : ncf
  });
  // this.calculateCaptive();
  // this.calculateCaptiveB();
  this.calculateCaptiveC();
}
calculateCaptiveC() {
  this.captiveEmi = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  const emi = passengerStandGroup.value.emi ? Number(passengerStandGroup.value.emi) : '';
  const ncf = passengerStandGroup.value.netCashFlow ? Number(passengerStandGroup.value.netCashFlow) : 0;
  // tslint:disable-next-line: triple-equals
  if (emi != '') {
    const calEMi = ncf / emi;
    this.captiveEmi = Number(calEMi.toFixed(2));
  }

  // this.calculateCaptive();
  // this.calculateCaptiveB();
  // this.calculateCaptiveC();
}
  async onUploadSuccess(event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');

    console.log('onUploadSuccess', event);
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    this.dmsDocumentId = event.dmsDocumentId;
    // const data = {
    //   inputValue: event.imageUrl,
    //   isPhoto: true,
    //   applicantId: this.applicantId,
    // };
    // this.uploadPhotoOrSignature(data);

    event.imageUrl = '';

    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    }
    console.log('documentArr', this.documentArr);
    this.individualImageUpload(event, index);

    // let position = await this.getLatLong();
    // if (position["latitude"]) {
    //   this.latitude = position["latitude"].toString();
    //   this.longitude = position["longitude"].toString();
    //   this.getRouteMap();
    // } else {
    //   this.latitude = "";
    //   this.longitude = "";
    //   this.showRouteMap = false;
    // }

  }

  uploadPhotoOrSignature(data) {
    this.applicantService.uploadPhotoOrSignature(data).subscribe((value) => {
      console.log('uploadPhotoOrSignature', value, 'data', data);
    });
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
        this.documentArr[index].documentId = documentId;
        const subCategoryCode = this.documentArr[index].subCategoryCode;
      });
  }

  getRouteMap() {
    var that = this;
    let branchPos = {
      latitude: this.branchLatitude,
      longitude: this.branchLongitude
    };
    let currentPos = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.loginService.getPolyLine(function (result) {
      that.base64Image = result;
      that.showRouteMap = true;
      // console.log("getPolyLine", that.base64Image);
    }, currentPos, branchPos);
  }

  async getLatLong() {
    /* Get latitude and longitude from mobile */

    return new Promise((resolve, reject) => {

      if (this.isMobile) {

        this.gpsService.getLatLong().subscribe((position) => {
          console.log("Mobile position", position);
          resolve(position);
        });

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

}
