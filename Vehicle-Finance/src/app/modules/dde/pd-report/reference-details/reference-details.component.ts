import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  labels: any = {};
  constructor(private labelsData: LabelsService) { }

  ngOnInit() {
    this.getLabels();
  }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
    );
  }

}
