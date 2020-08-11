import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { PersonalDiscussionService } from '@services/personal-discussion.service';

import { LoginStoreService } from '@services/login-store.service';


@Component({
  selector: 'app-cpc-maker-dde',
  templateUrl: './cpc-maker-dde.component.html',
  styleUrls: ['./cpc-maker-dde.component.css'],
})
export class CpcMakerDdeComponent implements OnInit {
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
  constructor(
    private router: Router,
    private location: Location,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    console.log(this.locationIndex);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
      console.log(this.locationIndex);
    });
    this.activatedRoute.params.subscribe((value: any) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
    });
    this.activatedRoute.firstChild.params.subscribe((value: any) => {
      this.applicantId = value.applicantId;
      this.version = value.version;
      console.log('applicant ID', value.applicantId);
      console.log('version in fi and pd report', this.version);
    });
  }
  onNavigate(url: string) {
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '4') {
      this.router.navigate([`/pages/cpc-maker/${this.leadId}/${url}`]);
    // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`/pages/cpc-checker/${this.leadId}/${url}`]);
    }
  }
  getLocationIndex(url: string) {
    if (url.includes('check-list')) {
      return 0;
    }  else if (url.includes('term-sheet')) {
      return 1;
    } else if (url.includes('negotiation')) {
      return 2;
    } else if (url.includes('sanction-details')) {
      return 3;
    } else if (url.includes('pdc-details')) {
      return 4;
    }
  }
}
