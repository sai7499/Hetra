import { Component, OnInit } from '@angular/core';

import { LabelsService } from 'src/app/services/labels.service';
@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};

  constructor(
    private labelsData: LabelsService
  ) { }

  ngOnInit() {

    this.labelsData.getLabelsFleetData().subscribe(
      data =>{
        this.labels = data;
      },
      error =>{
        console.log(error);

      });

      
  }

}
