import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  appVersion;
  buildDate;
  constructor(
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

  ngOnInit() {}

  goToActivitySearch() {
    this.route.navigateByUrl('/activity-search');
  }
}
