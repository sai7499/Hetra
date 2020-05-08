import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStoreService } from '../../services/login-store.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  openProfile: boolean;

  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];

  constructor(private loginStoreService: LoginStoreService) {}

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;
    
    document
      .querySelector("body")
      .addEventListener("click", this.bodyClickEvent);
  }

  bodyClickEvent = event => {
    if (event.target.id === "profileDropDown") {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  };




  ngOnDestroy() {
    document
      .querySelector("body")
      .removeEventListener("click", this.bodyClickEvent);
  }
}
