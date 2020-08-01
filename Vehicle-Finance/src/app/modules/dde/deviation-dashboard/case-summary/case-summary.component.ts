import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.css']
})
export class CaseSummaryComponent implements OnInit {

  public labels: any = {};
  basicDetails: any = {
    leadCreatedBy: "Dhanapal",
    leadCreatedDate: "12-02-2020",
    product: "New Car"
  };

  constructor(private labelsData: LabelsService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(data => {
      this.labels = data;
    }, error => {
      console.log('error', error);
    });

  }

}
