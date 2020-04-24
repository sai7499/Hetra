import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import {Router} from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-document-viewupload',
  templateUrl: './document-viewupload.component.html',
  styleUrls: ['./document-viewupload.component.css']
})
export class DocumentViewuploadComponent implements OnInit {

  currentPage = 0;
  public labels: any;

  constructor(
    public router : Router,
    private location: Location,
    private labelsData: LabelsService,
  ) {}


  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    
    this.location.onUrlChange((url, state) => {
      if (url.includes('collateral-documents')) {
        this.currentPage = 1;
      } else {
        this.currentPage = 0;
      }
    });

  }

}
