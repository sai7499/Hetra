import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStoreService } from '../../../services/login-store.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];


  constructor(
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    // console.log("user details", roleAndUserDetails.roles[0].name)
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

}
