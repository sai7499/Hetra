import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-fl-report',
  templateUrl: './fl-report.component.html',
  styleUrls: ['./fl-report.component.css']
})
export class FlReportComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;

  constructor( private labelsData: LabelsService, private router:Router ) { }

  ngOnInit() {
    this.getLabels = this.labelsData.getLabelsData()
    .subscribe( data => {
      this.labels = data;
      // console.log("UCU", this.labels);
      
    },
    error => {
      this.errorMsg = error;
    });
  }

  onFormSubmit() {
    this.router.navigate(['/pages/dde/pd-report']);
  }


}
