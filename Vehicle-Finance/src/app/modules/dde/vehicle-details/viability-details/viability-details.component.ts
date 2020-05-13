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
        console.log(this.label)
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
        lifeNewTyres: ['60000.00']
      }),
      passangerStandOperator: this._fb.group({

      }),
      captive: this._fb.group({

      }),
    })
  }

  vehicle_viability_navigate(event) {
    this.vehicle_viability_value = event.target.value;
  }

}
