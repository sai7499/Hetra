import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ViabilityServiceService } from '@services/viability-service.service';
import { CommomLovService } from '@services/commom-lov-service';

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
  // tslint:disable-next-line: variable-name
  public vehicle_viability_value = '1VHCLVBTY';

  public viabilityForm: FormGroup;
  viabilityObj: any;

  constructor(private fb: FormBuilder, private labelsData: LabelsService,
              private viabilityService: ViabilityServiceService,
              private commonlovService: CommomLovService) { }

  ngOnInit() {
    this.labelsData.getLabelsData()
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
      type: ['passanger', Validators.required],
      passanger: this.fb.group({ route: [],
        natureOfGoods: ['Oil'],
        distanceInKm: [220],
        tripsPerMonth: [25],
        monthlyRunningKm: [5500],
        avgLoadPerTon: [9],
        rateTonne: [600],
        fuelAvgPerKm: [5.00],
        costPerLtr: [65.00],
        noOfTyres: [6.00],
        perTyreCost: [8000.00],
        newTyreLifeKm: [60000.00],
        fuelCost: [71500.00],
        tyreCost: [4400.00],
        driversSalary: [8000.00],
        cleanersSalary: [4000.00],
        permitCost: [0.00],
        fcCharge: [0.00],
        paidTollTax: [0.00],
        taxes: [1500.00],
        maintanence: [2000.00],
        busMiscellaneousExpenses: [1000.00],
        busInsurenceExpenses: [5000.00],
        busMonthlyIncome: [97400.00],
        netCashFlow: [16580.00],
        emi: [5000],
        totalExpense: [50000]}),
      passangerStandOperator: this.fb.group({
        application: [],
        grossIncomePerDay: [3100],
        businessEarningPerDay: [22],
        businessIncomePerDay: [1300.00],
        avgTyreExpenses: [1500.00],
        insuranceExpenses: [2000.00],
        miscellaneousExpenses: [2000.00],
        totalExpenses: [34100.00],
        netCashFlow: [34100.00],
        emi: [15810.00]
      }),
      captive: this.fb.group({
        natureOfBusiness: ['SAND'],
        businessIncomePerDay: [5000],
        businessEarningPerDay: [25],
        busExpensesPerDay: [3000.00],
        oblicationsPerMonth: [5000.00],
        busTyreAvgExpenses: [1500.00],
        busInsurenceExpenses: [2000.00],
        busMiscellaneousExpenses: [1500.00],
        busMonthlyIncome: [1334578],
        totalExpenses: [80000.00],
        netCashFlowEmi: [45000.00],
        emi: [15670.00]
      }),
    });
    this.getViability();
    console.log(this.viabilityForm.controls);
  }

  createForm() {
    this.viabilityForm = this.fb.group({
      type: ['passanger', Validators.required],
      passanger: this.fb.array([this.passengerForm()]),
      passangerStandOperator: this.fb.group({
        application: [],
        grossIncomePerDay: [3100],
        businessEarningPerDay: [22],
        businessIncomePerDay: [1300.00],
        avgTyreExpenses: [1500.00],
        insuranceExpenses: [2000.00],
        miscellaneousExpenses: [2000.00],
        totalExpenses: [34100.00],
        netCashFlow: [34100.00],
        emi: [15810.00]
      }),
      captive: this.fb.group({
        natureOfBusiness: ['SAND'],
        businessIncomePerDay: [5000],
        businessEarningPerDay: [25],
        busExpensesPerDay: [3000.00],
        oblicationsPerMonth: [5000.00],
        busTyreAvgExpenses: [1500.00],
        busInsurenceExpenses: [2000.00],
        busMiscellaneousExpenses: [1500.00],
        busMonthlyIncome: [1334578],
        totalExpenses: [80000.00],
        netCashFlowEmi: [45000.00],
        emi: [15670.00]
      }),
    });
    // this.privateViability();
    this.vehicle_viability_navigate( this.vehicle_viability_value);
    this.patchViability();
  }
  private passengerForm() {
    return this.fb.group({
        route: [],
        natureOfGoods: ['Oil'],
        distanceInKm: [220],
        tripsPerMonth: [25],
        monthlyRunningKm: [5500],
        avgLoadPerTon: [9],
        rateTonne: [600],
        fuelAvgPerKm: [5.00],
        costPerLtr: [65.00],
        noOfTyres: [6.00],
        perTyreCost: [8000.00],
        newTyreLifeKm: [60000.00],
        fuelCost: [71500.00],
        tyreCost: [4400.00],
        driversSalary: [8000.00],
        cleanersSalary: [4000.00],
        permitCost: [0.00],
        fcCharge: [0.00],
        paidTollTax: [0.00],
        taxes: [1500.00],
        maintanence: [2000.00],
        busMiscellaneousExpenses: [1000.00],
        busInsurenceExpenses: [5000.00],
        busMonthlyIncome: [97400.00],
        netCashFlow: [16580.00],
        emi: [5000],
        totalExpense: [50000]
    });
  }
  vehicle_viability_navigate(event) {
    console.log(event);
    this.vehicle_viability_value = event ? event : event;
    if (this.vehicle_viability_value === '1VHCLVBTY') {
      this.privateViability();
    } else {
      this.viabilityForm.controls.passanger.get('route').clearValidators();
      this.privateStandOverViability();
    }
  }
   privateViability() {
  //  const privateViability = this.viabilityForm.controls.passanger as FormArray;
   this.viabilityForm.controls.passanger.get('route').setValidators(Validators.required);
  }
   privateStandOverViability() {
    const privateStandViability = this.viabilityForm.controls.passangerStandOperator as FormArray;
    privateStandViability.get('application').setValidators(Validators.required);
   }
  getViability() {
    const body = {
      // loginId: 'e12346@equitasbank.in',
      userId : '1002',
      // id: 1020,
      collateralId: 81
    };
    this.viabilityService.getViabilityDetails(body).subscribe((res: any) => {
      console.log(res);
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
    if (this.viabilityForm.invalid) {
      alert('Hell yaa');
      return;
    }
    const body = {
      userId: '1002',
      customerName: 'Nixon',
      vehicleModel: 1,
      income: 45154,
    // iId: 1180,
      vehicleViabilityDetails : {
        collateralId: 81,
        type: this.viabilityForm.value.type,
        ...this.viabilityForm.value.passangerStandOperator
      },
    };
    console.log(this.viabilityForm.value);
    console.log(body, 'Viability Body');
    this.viabilityService.setViabilityDetails(body).subscribe((res: any) => {
console.log(res);
    });
  }

 patchViability() {
   this.viabilityForm.value.passanger.patchValue({ route: 'abcd'});
 }

}
