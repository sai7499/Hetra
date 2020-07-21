import { Component, OnInit } from '@angular/core';
import { LabelsService } from '../../../../services/labels.service';

@Component({
  selector: 'app-term-sheet',
  templateUrl: './term-sheet.component.html',
  styleUrls: ['./term-sheet.component.css']
})
export class TermSheetComponent implements OnInit {
  labels: any = {};
  manufacturer: any = '';

  constructor(   
     public labelsService: LabelsService,
    ) { }
  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels);
    })
  }
  ngOnInit() {
    this.getLabelData();
  }

}
