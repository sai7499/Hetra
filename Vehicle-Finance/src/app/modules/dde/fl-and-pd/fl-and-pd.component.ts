import { Component, OnInit } from '@angular/core';

import { LabelsService } from '@services/labels.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fl-and-pd',
  templateUrl: './fl-and-pd.component.html',
  styleUrls: ['./fl-and-pd.component.css']
})
export class FlAndPDComponent implements OnInit {

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
