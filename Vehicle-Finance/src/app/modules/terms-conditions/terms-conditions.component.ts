import { Component, OnInit } from '@angular/core';

import { LabelsService } from "src/app/services/labels.service";

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  labels: any = {};


  constructor( private labelsData: LabelsService) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );
  }
}
