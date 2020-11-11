import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { environment } from 'src/environments/environment';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  labels: any = {};
  appVersion;
  buildDate;
  constructor(
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private commomLovService: CommomLovService
  ) {
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

  ngOnInit() { this.labelsData.getLabelsData().subscribe(
    (data) => {
      this.labels = data;
    },
    (error) => {
      console.log(error);
    }
  );}

  onTest(){
    
  }

  goToActivitySearch() {
    this.route.navigateByUrl('/activity-search');
  }
}
