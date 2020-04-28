import { Component, OnInit } from '@angular/core';

import { LabelsService } from "src/app/services/labels.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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