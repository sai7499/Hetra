import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStoreService } from '../../../services/login-store.service';
import { UtilityService } from '@services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];
  activityClass = false;

  constructor(
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    // console.log("user details", roleAndUserDetails.roles[0].name)
    if (!roleAndUserDetails) {
      return;
    }
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;

    document
      .querySelector('body')
      .addEventListener('click', this.bodyClickEvent);

    console.log(this.router.url);
    if (this.router.url.includes('/activity-search')) {
      this.activityClass = true;
      // console.log(this.activityClass);'
    } else {
      this.activityClass = false;
      // console.log(this.activityClass);
    }
  }

  bodyClickEvent = (event) => {
    const targetId = event.target.id;
    if (targetId === 'roles') {
      this.openProfile = true;
      return;
    }
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  };

  logOut() {
    this.utilityService.logOut();
  }

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }
}
