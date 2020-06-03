import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { LovDataService } from 'src/app/services/lov-data.service';


@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.css']
})
export class EmploymentDetailsComponent implements OnInit {

  isIndividual: boolean = true;
  labels: any = {};
  values: any = [];

  constructor(
    private labelsService: LabelsService,
    private lovDataService: LovDataService
  ) { }

  ngOnInit() {
    this.getLabelData();
    this.lovDataService.getLovData().subscribe((res: any) => {
      this.values = res[0].employmentDetails[0];
    })
  }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
    })
  }

  selection(e) {
    const value = e.target.value;
    this.isIndividual = (value === 'individual') ? true : false;
  }

}
