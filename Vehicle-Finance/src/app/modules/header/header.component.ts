import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private commomLovService: CommomLovService) {

    const lovData = this.activatedRoute.snapshot.data.getLOV;
    if (lovData.Error === '0') {
      const LOVs = JSON.parse(lovData.ProcessVariables.response);
      this.commomLovService.setLovData(LOVs);
    }
  }

  ngOnInit() {
  }

  goToActivitySearch() {
    this.route.navigateByUrl('/activity-search');
  }
}
