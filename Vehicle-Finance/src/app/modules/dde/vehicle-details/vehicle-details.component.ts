import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  basicVehicleDetailForm: FormGroup;
  public label: any = {};

  constructor(private _fb: FormBuilder, private labelsData: LabelsService, ) { }

  ngOnInit() {
    this.basicVehicleDetailForm = this._fb.group({
      vehicleType: ['Open'],
      region: ['TN'],
      registrationNumber: [''],
      assetMake: ['Tata Motors'],
      assetModel: ['1'],
      assetBodyType: ['1']
    })
    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          console.log(error, 'error')
        });
  }

}
