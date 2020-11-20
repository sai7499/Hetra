import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { environment } from 'src/environments/environment';
import { LabelsService } from 'src/app/services/labels.service';
import { CommonDataService } from '@services/common-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  labels: any = {};
  appVersion;
  buildDate;
  leadHistories: any;
  topBandData: any;

  itemsPerPage: any = '25';
  currentPage: any;
  count: any;
  maxSize: number;

  constructor(
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private commomLovService: CommomLovService,
    private commonDataService: CommonDataService

  ) {
    if (environment.isMobile === true) {
      this.itemsPerPage = '25';
      this.maxSize = 2;
    } else {
      this.itemsPerPage = '100';
      this.maxSize = 7;
    }

    this.appVersion = environment.version;
    this.buildDate = environment.buildDate;
    const lovData = this.activatedRoute.snapshot.data.getLOV;
    if (lovData.Error === '0') {
      const LOVs = JSON.parse(lovData.ProcessVariables.response);
      const documentCategories = JSON.parse(
        lovData.ProcessVariables.documentCategories
      );
      this.commomLovService.setLovData(LOVs);
      this.commomLovService.setDocumentCategories(documentCategories);
    }
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.commonDataService.leadHistoryData$.subscribe(
      (data: any) => {
        console.log('leadHistory', data);
        if (!data) {
          return;
        }
        this.leadHistories = data.ProcessVariables.leads;
        this.topBandData = data.ProcessVariables;
        console.log('leadHistoryData', this.leadHistories);
      })
  }

  setPage(event) {
    console.log("pagenation", event);
    this.currentPage = event;
  }

  goToActivitySearch() {
    this.route.navigateByUrl('/activity-search');
  }
}