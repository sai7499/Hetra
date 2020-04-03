import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  basicVehicleDetailForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.basicVehicleDetailForm = this._fb.group({
      vehicleType: ['Open'],
      region:  ['TN'],
      registrationNumber:  ['']
    })
  }

}
