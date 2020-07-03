import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ViabilityServiceService } from '@services/viability-service.service';
import { CommomLovService } from '@services/commom-lov-service';
import { data } from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { Location } from '@angular/common';

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
  netFlowCash = 0;

  constructor(private fb: FormBuilder, private labelsData: LabelsService,
              private viabilityService: ViabilityServiceService,
              private commonlovService: CommomLovService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private router: Router,
              private location: Location) { }

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
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
    });
    // this.createForm();
    this.viabilityForm = this.fb.group({
      type: ['', Validators.required],
      passanger: this.fb.group({ route: [],
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
        netCashFlow: [],
        emi: [],
        totalExpenses: []}),
      passangerStandOperator: this.fb.group({
        application: [],
        grossIncomePerDay: [],
        businessEarningPerDay: [],
        businessIncomePerDay: [],
        avgTyreExpenses: [],
        insuranceExpenses: [],
        miscellaneousExpenses: [],
        totalExpenses: [],
        netCashFlow: [],
        emi: []
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
        busMonthlyIncome: [],
        totalExpenses: [],
        netCashFlowEmi: [],
        emi: Number([])
      }),
    });
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.collataralId);
    // this.getViabilityList(Number(this.leadId));
    console.log(this.viabilityForm.controls);
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.getViabilityList(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  getViabilityList(id) {
    const body = {
      leadId : id
  };
    this.viabilityService.getViabilityList(body).subscribe((res: any) => {
    if (res.ProcessVariables.error.code === '0') {
   this.collataralId = Number(res.ProcessVariables.vehicleViabilityDashboardList[0].collateralId) ;
   this.getViability(this.collataralId);
   }
  });

  }
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
   privateViability.get('route').setValidators(Validators.required);
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
   privateViability.get('busMonthlyIncome').setValidators(Validators.required);
   privateViability.get('netCashFlow').setValidators(Validators.required);
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
    captive.get('busMonthlyIncome').setValidators(Validators.required);
    captive.get('totalExpenses').setValidators(Validators.required);
    captive.get('netCashFlowEmi').setValidators(Validators.required);
    captive.get('emi').setValidators(Validators.required);
   }
   private  removePassengerValidators() {
    const privateViability = this.viabilityForm.controls.passanger as FormGroup;
    privateViability.get('route').clearValidators();
    privateViability.get('natureOfGoods').clearValidators();
    privateViability.get('distanceInKm').clearValidators();
    privateViability.get('tripsPerMonth').clearValidators();
    privateViability.get('monthlyRunningKm').clearValidators();
    privateViability.get('avgLoadPerTon').clearValidators();
    privateViability.get('rateTonne').clearValidators();
    privateViability.get('fuelAvgPerKm').clearValidators();
    privateViability.get('costPerLtr').clearValidators();
    privateViability.get('noOfTyres').clearValidators();
    privateViability.get('perTyreCost').clearValidators();
    privateViability.get('newTyreLifeKm').clearValidators();
    privateViability.get('fuelCost').clearValidators();
    privateViability.get('tyreCost').clearValidators();
    privateViability.get('driversSalary').clearValidators();
    privateViability.get('cleanersSalary').clearValidators();
    privateViability.get('permitCost').clearValidators();
    privateViability.get('fcCharge').clearValidators();
    privateViability.get('paidTollTax').clearValidators();
    privateViability.get('taxes').clearValidators();
    privateViability.get('maintanence').clearValidators();
    privateViability.get('busMiscellaneousExpenses').clearValidators();
    privateViability.get('busInsurenceExpenses').clearValidators();
    privateViability.get('busMonthlyIncome').clearValidators();
    privateViability.get('netCashFlow').clearValidators();
    privateViability.get('emi').clearValidators();
    privateViability.get('totalExpenses').clearValidators();
   }
   private removeStandOverValidators() {
    const privateStandViability = this.viabilityForm.controls.passangerStandOperator as FormGroup;
    privateStandViability.get('application').clearValidators();
    privateStandViability.get('grossIncomePerDay').clearValidators();
    privateStandViability.get('businessEarningPerDay').clearValidators();
    privateStandViability.get('businessIncomePerDay').clearValidators();
    privateStandViability.get('avgTyreExpenses').clearValidators();
    privateStandViability.get('insuranceExpenses').clearValidators();
    privateStandViability.get('miscellaneousExpenses').clearValidators();
    privateStandViability.get('totalExpenses').clearValidators();
    privateStandViability.get('netCashFlow').clearValidators();
    privateStandViability.get('emi').clearValidators();
   }
   private removeCaptiveValidators() {
    const captive = this.viabilityForm.controls.captive as FormGroup;
    captive.get('natureOfBusiness').clearValidators();
    captive.get('businessIncomePerDay').clearValidators();
    captive.get('businessEarningPerDay').clearValidators();
    captive.get('busExpensesPerDay').clearValidators();
    captive.get('oblicationsPerMonth').clearValidators();
    captive.get('busTyreAvgExpenses').clearValidators();
    captive.get('busInsurenceExpenses').clearValidators();
    captive.get('busMiscellaneousExpenses').clearValidators();
    captive.get('busMonthlyIncome').clearValidators();
    captive.get('totalExpenses').clearValidators();
    captive.get('netCashFlowEmi').clearValidators();
    captive.get('emi').clearValidators();
   }
getViability(id: any) {
    const body = {
      userId: this.userId,
      collateralId: this.collataralId
    };
    this.viabilityService.getViabilityDetails(body).subscribe((res: any) => {
      if (res.ProcessVariables.error.code === '0' && res.ProcessVariables.vehicleViability != null) {
      this.viabliityDataToPatch = res.ProcessVariables.vehicleViability;
      if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '1VHCLVBTY') {
        // this.viabilityForm.controls.type = this.viabliityDataToPatch.type;
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.viabilityForm.controls.type = '1VHCLVBTY';
        this.patchViability(this.viabliityDataToPatch);
        this.calculatePassenger();
        this.calculatePassengerB();
        this.calculatePassengerC();
        this.calculatePassengerD();
       } else if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '2VHCLVBTY') {
        this.viabilityForm.controls.type = this.viabliityDataToPatch.type;
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.setPassangetStandOperator(this.viabliityDataToPatch);
        this.calculateStandOperator();
        this.calculateStandOperatorB();
        this.calculateStandOperatorC();
       } else if (this.viabliityDataToPatch && this.viabliityDataToPatch.type === '3VHCLVBTY') {
        this.viabilityForm.controls.type = this.viabliityDataToPatch.type;
        this.vehicle_viability_navigate(this.viabliityDataToPatch.type);
        this.vehicleModel = this.viabliityDataToPatch.vehicleModel;
        this.setCapative(this.viabliityDataToPatch);
        this.calculateCaptive();
        this.calculateCaptiveB();
        this.calculateCaptiveC();
       }
    } else {
      this.viabilityForm.controls.type = '1VHCLVBTY';
    }
    });

  }
  // setUpvalidators() {
  //   if (this.viabilityForm.value.type === 'passanger') {
  //     this.privateViability();
  //   } else {
  //     this.viabilityForm.controls.passanger.clearValidators();
  //     this.privateStandOverViability();
  //   }
  // }
onSave() {
    this.vehicle_viability_navigate(this.viabilityForm.controls.type);
    if (this.viabilityForm.invalid) {
      console.log(this.viabilityForm.value);
      return;
    }
    if (this.viabilityForm.controls.type === '1VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          collateralId: this.collataralId,
          type: this.viabilityForm.controls.type,
          ...this.convertPassenger(this.viabilityForm.value.passanger)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
       this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Viability');
    });
    } else if ( this.viabilityForm.controls.type === '2VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          collateralId: this.collataralId,
          type: this.viabilityForm.controls.type,
          ...this.convertStandOperative(this.viabilityForm.value.passangerStandOperator)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
        this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Viability');
    });
     } else if ( this.viabilityForm.controls.type === '3VHCLVBTY') {
      const body = {
        userId: this.userId,
        vehicleViabilityDetails : {
          collateralId: this.collataralId,
          type: this.viabilityForm.controls.type,
          ...this.convertCapitve(this.viabilityForm.value.captive)
        },
      };
      // tslint:disable-next-line: deprecation
      this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
        this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Viability');
    });
     }
  }


 // tslint:disable-next-line: no-shadowed-variable
patchViability(data: any) {
   const passanger = this.viabilityForm.controls.passanger as FormGroup;
   passanger.patchValue({
     route: data.route ? data.route : null,
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
        totalExpenses: data.totalExpenses ? data.totalExpenses : null
    });
 }
 // tslint:disable-next-line: no-shadowed-variable
 convertPassenger(data: any) {
   const body = {
    route: data.route ? data.route : null,
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
       netCashFlow: data.netCashFlow ? Number(data.netCashFlow) : null,
       emi: data.emi ? Number(data.emi) : null,
       totalExpenses: data.totalExpenses ? Number(data.totalExpenses) : null
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
    netCashFlow : data.netCashFlow ? data.netCashFlow : null,
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
    netCashFlow : data.netCashFlow ? Number(data.netCashFlow) : null,
    emi : data.emi ? Number (data.emi) : null
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
    busMonthlyIncome:  dataCaptive.busMonthlyIncome ? dataCaptive.busMonthlyIncome : null ,
    totalExpenses: dataCaptive.totalExpenses ? dataCaptive.totalExpenses : null,
    netCashFlowEmi: dataCaptive.netCashFlowEmi ? dataCaptive.netCashFlowEmi : null,
    emi: dataCaptive.emi ? dataCaptive.emi : null
  });
 }

convertCapitve(dataCaptive) {
  const body = {
    natureOfBusiness: dataCaptive.natureOfBusiness ? dataCaptive.natureOfBusiness : null ,
    businessIncomePerDay:  dataCaptive.businessIncomePerDay ? Number(dataCaptive.businessIncomePerDay) : null ,
    businessEarningPerDay:  dataCaptive.businessEarningPerDay ? Number(dataCaptive.businessEarningPerDay) : null ,
    busExpensesPerDay:  dataCaptive.busExpensesPerDay ? Number(dataCaptive.busExpensesPerDay) : null ,
    oblicationsPerMonth:  dataCaptive.oblicationsPerMonth ? Number(dataCaptive.oblicationsPerMonth) : null ,
    busTyreAvgExpenses:  dataCaptive.busTyreAvgExpenses ? Number(dataCaptive.busTyreAvgExpenses) : null ,
    busInsurenceExpenses:  dataCaptive.busInsurenceExpenses ? Number(dataCaptive.busInsurenceExpenses) : null ,
    busMiscellaneousExpenses:  dataCaptive.busMiscellaneousExpenses ? Number(dataCaptive.busMiscellaneousExpenses) : null ,
    busMonthlyIncome:  dataCaptive.busMonthlyIncome ? Number(dataCaptive.busMonthlyIncome) : null ,
    totalExpenses: dataCaptive.totalExpenses ? Number(dataCaptive.totalExpenses) : null,
    netCashFlowEmi: dataCaptive.netCashFlowEmi ? Number (dataCaptive.netCashFlowEmi) : null,
    emi: dataCaptive.emi ? Number(dataCaptive.emi) : null
  };
  return body;
 }
 onNext() {
   this.router.navigateByUrl(`pages/dde/${this.leadId}/score-card`);
 }
 onBack() {
this.location.back();
 }
 calculatePassenger() {
   this.monthlyRunningKm = 0 ;
   this.monthlyIncome = 0;
   const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
   console.log(passengerGroup);
   const distanceInKm = passengerGroup.value.distanceInKm ? Number(passengerGroup.value.distanceInKm) : 0;
   const tripsPerMonth = passengerGroup.value.tripsPerMonth ? Number(passengerGroup.value.tripsPerMonth) : 0;
   const monthlyRunningKm = distanceInKm * tripsPerMonth;
   this.monthlyRunningKm = monthlyRunningKm ;
   const avgLoadPerTon = passengerGroup.value.avgLoadPerTon ? Number(passengerGroup.value.avgLoadPerTon) : 0;
   const rateTonne = (passengerGroup.value.rateTonne) ? Number(passengerGroup.value.rateTonne) : 0;
   const tonnageCalc =  avgLoadPerTon * rateTonne;
   this.monthlyIncome = tripsPerMonth * tonnageCalc;
   passengerGroup.value.busMonthlyIncome = this.monthlyIncome;
  //  this.viabilityForm.value.passanger.patchValue({
  //   busMonthlyIncome : this.monthlyIncome
  //  });
   passengerGroup.patchValue({
    monthlyRunningKm : this.monthlyRunningKm
  });
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
  // tslint:disable-next-line: max-line-length
  const  busMiscellaneousExpenses =  passengerGroup.value.busMiscellaneousExpenses ? Number( passengerGroup.value.busMiscellaneousExpenses) : 0 ;
  const busInsurenceExpenses = passengerGroup.value.busInsurenceExpenses ? Number(passengerGroup.value.busInsurenceExpenses) : 0;
  // const busMonthlyIncome = passengerGroup.value.busMonthlyIncome ? Number(passengerGroup.value.busMonthlyIncome) : 0;
  // tslint:disable-next-line: max-line-length
  const expense = tyreCost + fuelCost + driversSalary + cleanersSalary + permitCost + fcCharge + paidTollTax + taxes + maintanence + busInsurenceExpenses;
  passengerGroup.patchValue({
  totalExpenses : expense
  });
  // passengerGroup.patchValue({
  //   netCashFlow : this.monthlyIncome - expense
  // });
  this.netFlowCash = this.monthlyIncome - expense;
 }
 calculatePassengerD() {
  const passengerGroup = this.viabilityForm.controls.passanger as FormGroup ;
  const totalExpenses = passengerGroup.value.totalExpenses ? Number(passengerGroup.value.totalExpenses) : 0;
  const emi = passengerGroup.value.emi ? Number(passengerGroup.value.emi) : 0;
  const netFlow = this.monthlyIncome - totalExpenses;
  const emiCal = (netFlow / emi).toFixed(2);
  this.netCashFlowEmiPassenger = Number(emiCal);
}
 calculateStandOperator() {
  this.montlyStandOperatorIncome = 0;
  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  console.log(passengerStandGroup);
  const businessEarningPerDay = Number(passengerStandGroup.value.businessEarningPerDay);
  const grossIncomePerDay = Number(passengerStandGroup.value.grossIncomePerDay);
  this.montlyStandOperatorIncome = businessEarningPerDay * grossIncomePerDay;
 }
 calculateStandOperatorB() {
  this.standoperatorExpense = 0;
  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  const businessIncomePerDay =  passengerStandGroup.value.businessIncomePerDay ? Number(passengerStandGroup.value.businessIncomePerDay) : 0;
  const avgTyreExpenses = passengerStandGroup.value.avgTyreExpenses ? Number(passengerStandGroup.value.avgTyreExpenses) : 0;
  const insuranceExpenses = passengerStandGroup.value.insuranceExpenses ? Number(passengerStandGroup.value.insuranceExpenses) : 0;
  // tslint:disable-next-line: max-line-length
  const miscellaneousExpenses = passengerStandGroup.value.miscellaneousExpenses ? Number(passengerStandGroup.value.miscellaneousExpenses) : 0;
  this.standoperatorExpense = businessIncomePerDay + avgTyreExpenses + insuranceExpenses + miscellaneousExpenses;
  passengerStandGroup.patchValue({
    totalExpenses : this.standoperatorExpense
  });
  const ncf = this.montlyStandOperatorIncome - this.standoperatorExpense;
  passengerStandGroup.patchValue({
    netCashFlow : ncf
  });
}
calculateStandOperatorC() {
  const passengerStandGroup = this.viabilityForm.controls.passangerStandOperator;
  const emi = passengerStandGroup.value.emi ? Number(passengerStandGroup.value.emi) : 0;
  const ncf = passengerStandGroup.value.netCashFlow ? Number(passengerStandGroup.value.netCashFlow) : 0;

  const calEMi = ncf / emi;
  this.standOperatorEmi = calEMi;
}
calculateCaptive() {
  this.montlyCaptiveIncome = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  console.log(passengerStandGroup);
  // tslint:disable-next-line: max-line-length
  const businessEarningPerDay = passengerStandGroup.value.businessEarningPerDay ? Number(passengerStandGroup.value.businessEarningPerDay) : 0;
  const grossIncomePerDay = (passengerStandGroup.value.businessIncomePerDay) ? Number(passengerStandGroup.value.businessIncomePerDay) : 0;
  this.montlyCaptiveIncome = businessEarningPerDay * grossIncomePerDay;
 }
 calculateCaptiveB() {
  this.captiveExpense = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  const businessIncomePerDay =  passengerStandGroup.value.busExpensesPerDay ? Number(passengerStandGroup.value.busExpensesPerDay) : 0;
  const avgTyreExpenses = passengerStandGroup.value.busTyreAvgExpenses ? Number(passengerStandGroup.value.busTyreAvgExpenses) : 0;
  const insuranceExpenses = passengerStandGroup.value.busInsurenceExpenses ? Number(passengerStandGroup.value.busInsurenceExpenses) : 0;
  // tslint:disable-next-line: max-line-length
  const miscellaneousExpenses = passengerStandGroup.value.busMiscellaneousExpenses ? Number(passengerStandGroup.value.busMiscellaneousExpenses) : 0;
  const oblicationsPerMonth = passengerStandGroup.value.oblicationsPerMonth ? Number(passengerStandGroup.value.oblicationsPerMonth) : 0;
  this.captiveExpense = businessIncomePerDay + avgTyreExpenses + insuranceExpenses + miscellaneousExpenses + oblicationsPerMonth;
  passengerStandGroup.patchValue({
    totalExpenses : this.captiveExpense
  });
  const ncf = this.montlyCaptiveIncome - this.captiveExpense;
  passengerStandGroup.patchValue({
    netCashFlowEmi : ncf
  });
}
calculateCaptiveC() {
  this.captiveEmi = 0;
  const passengerStandGroup = this.viabilityForm.controls.captive;
  const emi = passengerStandGroup.value.emi ? Number(passengerStandGroup.value.emi) : 0;
  const ncf = passengerStandGroup.value.netCashFlowEmi ? Number(passengerStandGroup.value.netCashFlowEmi) : 0;

  const calEMi = ncf / emi;
  this.captiveEmi = calEMi;
}
}
