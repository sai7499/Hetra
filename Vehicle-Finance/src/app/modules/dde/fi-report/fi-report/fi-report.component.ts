import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DdeStoreService } from '@services/dde-store.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-fi-report',
  templateUrl: './fi-report.component.html',
  styleUrls: ['./fi-report.component.css']
})
export class FiReportComponent implements OnInit {
  locationIndex = 0;
  pdDetail: any;
  leadId: any;
  applicantId: any;
  version: any;
  userId: any;
  roleName: any;
  roles: any = [];
  roleId: any;
  roleType: any;
  show: boolean;
  leadData: {};

  constructor(
    private router: Router,
    private location: Location,
    private loginStoreService: LoginStoreService,
    private ddeStoreService: DdeStoreService,
    private activatedRoute: ActivatedRoute) {
    this.leadId = Number(this.activatedRoute.snapshot.params.leadId);
    // this.applicantId = Number(this.activatedRoute.snapshot.parent.params.applicantId);
    console.log(this.leadId);

  }

  ngOnInit() {

    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
    this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      console.log('applicant ID', value.applicantId);
    });


  }

  onNavigate(url: string) {

    if (url) {
      this.router.navigate([`/pages/fi-list/${this.leadId}/${this.applicantId}/fi-report/${url}`]);
    }


  }
  getLocationIndex(url: string) {
    if (url.includes('fi-residence')) {
      return 0;
    } else if (url.includes('fi-business')) {
      return 1;
    }
  }
}

