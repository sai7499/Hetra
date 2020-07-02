import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-deviation-dashboard',
  templateUrl: './deviation-dashboard.component.html',
  styleUrls: ['./deviation-dashboard.component.css']
})
export class DeviationDashboardComponent implements OnInit {

  labels: any = {};
  isDirty: boolean = false;

  constructor(private labelsData: LabelsService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );

  }

  FormDataParentMethod(event) {

  }

  saveorUpdateDeviationDetails() {

  }

}
