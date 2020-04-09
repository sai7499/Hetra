import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';


@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.css']
})
export class EmploymentDetailsComponent implements OnInit {

  isIndividual: boolean = true;
  labels = {};

  constructor(
    private labelsService: LabelsService
  ) { }

  ngOnInit() {
    this.getLabelData();
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
