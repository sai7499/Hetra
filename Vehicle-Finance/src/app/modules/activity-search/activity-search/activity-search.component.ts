import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStoreService } from '../../../services/login-store.service';
import { DashboardService } from '@services/dashboard/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.css']
})
export class ActivitySearchComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];
  // isCredit = true;

  bodyClickEvent = event => {
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  }

  constructor(
    private loginStoreService: LoginStoreService,
    private dashboardService: DashboardService
    ) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;

    document
      .querySelector('body')
      .addEventListener('click', this.bodyClickEvent);
  }

  onSelectDashboard() {
    this.dashboardService.leadsChange(true);
    console.log('action - search');
  }

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }
}
