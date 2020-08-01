import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStoreService } from '../../../services/login-store.service';
import { UtilityService } from '@services/utility.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared-service/shared-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;
  userName: string = '';
  firstLetter: string;
  branchName: string;
  roles = [];
  activityClass = false;

  constructor(
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private router: Router,
    private sharedService: SharedService) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();

    if (!roleAndUserDetails) {
      return
    }
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;

    document
      .querySelector('body')
      .addEventListener('click', this.bodyClickEvent);
    if (this.router.url.includes('/activity-search')) {
      this.activityClass = true
    } else {
      this.activityClass = false;
    }
  }

  bodyClickEvent = event => {
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
  }

  logOut() {
    this.utilityService.logOut();
  }

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }

  onChangeRole(val) {

    let roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    let userRoleActivityList = this.loginStoreService.getUserRoleActivityList();
    let userDetails = this.loginStoreService.getUserDetails();
    let businessDivisionList = this.loginStoreService.getBusinessDeviation();

    let findRoleActivity = [];
    let activityList = [];
    let remainingArray = [];

    roleAndUserDetails.roles.filter((rev: any, index) => {
      if (val === rev.name) {
        findRoleActivity.push(rev)
      } else {
        remainingArray.push(rev)
      }
    })

    userRoleActivityList.filter((role: any) => {
      if (val === role.roleName) {
        activityList.push({
          id: role.activityId,
          name: role.activityName
        })
      }
    })

    if (!this.activityClass) {
      this.router.navigateByUrl('/activity-search')
    }

    let roles = findRoleActivity.concat(remainingArray)

    this.sharedService.setSearchBarActivity(activityList)
    this.loginStoreService.setRolesAndUserDetails(roles, userDetails, businessDivisionList, activityList, userRoleActivityList)
  }

}
