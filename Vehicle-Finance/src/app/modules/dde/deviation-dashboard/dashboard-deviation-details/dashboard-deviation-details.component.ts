import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-dashboard-deviation-details',
  templateUrl: './dashboard-deviation-details.component.html',
  styleUrls: ['./dashboard-deviation-details.component.css']
})
export class DashboardDeviationDetailsComponent implements OnInit {

  labels: any = {};
  isDirty: boolean = false;
  public formValue: any = {};
  public leadId: number;
  public userId: string;
  public subscription: any;

  constructor(private labelsData: LabelsService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data.default;
      },
      error => {
        console.log(error);
      }
    );
  }

}
