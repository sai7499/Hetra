import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { LabelsService } from '../../../services/labels.service';

@Component({
  selector: 'app-credit-conditions',
  templateUrl: './credit-conditions.component.html',
  styleUrls: ['./credit-conditions.component.css']
})
export class CreditConditionsComponent implements OnInit {
  labels: any = {};
  constructor(
    public labelsService: LabelsService
  ) { }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels.creditCondition);
    })
  }

  ngOnInit() {
    this.getLabelData();
  }

}
