import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-pd-report',
  templateUrl: './pd-report.component.html',
  styleUrls: ['./pd-report.component.css']
})
export class PdReportComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;

  constructor( private labelsData: LabelsService, private router:Router ) { }

  ngOnInit() {
    this.getLabels = this.labelsData.getLabelsData()
    .subscribe( data => {
      this.labels = data;
    },
    error => {
      this.errorMsg = error;
    });
  }

  onFormSubmit() {
    this.router.navigate(['/pages/dde/viability-report']);
  }

}
