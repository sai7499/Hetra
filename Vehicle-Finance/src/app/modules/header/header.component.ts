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

    const error = this.activatedRoute.snapshot.data.getLOV.Error;
    if (error === '0') {
      const LOVs = JSON.parse(this.activatedRoute.snapshot.data.getLOV.ProcessVariables.response);
      this.commomLovService.setLovData(LOVs);
    }
  }

  ngOnInit() {
  }

  goToActivitySearch() {
    this.route.navigateByUrl('/activity-search');
  }
}
