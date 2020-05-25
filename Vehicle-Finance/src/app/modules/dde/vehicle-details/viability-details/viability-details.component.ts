import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

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
  public vehicle_viability_value: string = 'passanger';

  public viabilityForm: FormGroup;

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();

    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].viabilityDetails[0];
        this.labelPassanger = this.label.passanger[0];
        this.labelPassangerStandOperator = this.label.passangerStandOperator[0];
        this.labelCaptive = this.label.captive[0];
      },
        error => {
          console.log(error, 'error')
        });
  }

  createForm() {
    this.viabilityForm = this._fb.group({
      vehicleViabilityNavigate: ['passanger', Validators.required],
      passanger: this._fb.group({
        route: ['Chennai to Athipattu'],
        natureGoods: ['Oil'],
        distanceKm: ['220'],
        noofTrips: ['25'],
        monthlyRunninginKm: ['5500'],
        averageLoad: ['9'],
        rateTonneKL: ['600'],
        fuelAverage: ['5.00'],
        costLitreFuel: ['65.00'],
        numTyres: ['6.00'],
        costTyre: ['8000.00'],
        lifeNewTyres: ['60000.00'],
        fuelCost: ['71500.00'],
        tyreCost: ['4400.00'],
        driversSalaryAllowances: ['8000.00'],
        cleanersSalaryAllowances: ['4000.00'],
        permitCost: ["0.00"],
        fcCharges: ['0.00'],
        tollTaxPaid: ['0.00'],
        taxes: ['1500.00'],
        maintenance: ['2000.00'],
        miscellaneous: ['1000.00'],
        insuranceExpenses: ['5000.00'],
        totalExpenses: ['97400.00'],
        emi: ["16580.00"]
      }),
      passangerStandOperator: this._fb.group({
        application: ['Travels'],
        grossIncome: ['3100'],
        earningsperday: ['22'],
        expensesperday: ['1300.00'],
        avgTyreExpenses: ['1500.00'],
        insuranceExpenses: ['2000.00'],
        miscellaneousExpenses: ['2000.00'],
        totalExpenses: ['34100.00'],
        netCashFlow: ['34100.00'],
        emi: ["15810.00"]
      }),
      captive: this._fb.group({
        natureBusiness: ['SAND'],
        grossIncome: ['5000'],
        numEarnings: ['25'],
        expensesperdayBusiness: ['3000.00'],
        obligationsBusinessMonth: ['5000.00'],
        avgTyreExpenses: ['1500.00'],
        insuranceExpenses: ['2000.00'],
        miscellaneousExpenses: ['1500.00'],
        totalExpenses: ['80000.00'],
        netCashFlow: ['45000.00'],
        emi: ["15670.00"]
      }),
    })
  }

  vehicle_viability_navigate(event) {
    this.vehicle_viability_value = event.target.value;
  }

}
