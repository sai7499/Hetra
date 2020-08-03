import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-document-viewupload',
  templateUrl: './document-viewupload.component.html',
  styleUrls: ['./document-viewupload.component.css'],
})
export class DocumentViewuploadComponent implements OnInit {
  currentPage = 0;
  public labels: any;

  constructor(
    public router: Router,
    private location: Location,
    private labelsData: LabelsService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });

    // this.location.onUrlChange((url, state) => {
    //   if (url.includes('collateral-documents')) {
    //     this.currentPage = 1;
    //   } else {
    //     this.currentPage = 0;
    //   }
    // });
    const currentUrl = this.location.path();
    this.currentPage = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.currentPage = this.getLocationIndex(url);
    });

    this.activateRoute.data.subscribe((data) => {
      console.log('lead data', data);
    });
  }

  getLocationIndex(url: string) {
    if (url.includes('collateral-documents')) {
      return 1;
    } else {
      return 0;
    }
  }
}
