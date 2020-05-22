import { Component, OnInit } from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-lead-section-header',
  templateUrl: './lead-section-header.component.html',
  styleUrls: ['./lead-section-header.component.css']
})
export class LeadSectionHeaderComponent implements OnInit {
  labels: any = {};
  constructor(private labelsData: LabelsService,
    public router :  Router) {  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );
  }

}
