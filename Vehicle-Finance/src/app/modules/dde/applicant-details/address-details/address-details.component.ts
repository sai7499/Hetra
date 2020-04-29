import { Component, OnInit } from '@angular/core';

import { LabelsService } from "src/app/services/labels.service";

@Component({
    templateUrl: './address-details.component.html',
    styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {
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
