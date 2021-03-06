import { Component, OnInit } from '@angular/core';
import { commonRoutingUrl } from '@shared/routing.constant';
import { Router } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';
import { SharedService } from '../shared-service/shared-service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  dropDown: boolean;
  activityList = [];
  searchLead: any;
  searchText: string;
  routingId: string;
  activityClass = false;
  isMobile: boolean;
  roleId: any;

  constructor(
    private sharedService: SharedService,
    private route: Router,
    private loginStoreService: LoginStoreService,
    private dashboardService: DashboardService,
    private commomLovService: CommomLovService,
    private location: Location,
    private loanViewService: LoanViewService) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log('123roleAndUserDetails', roleAndUserDetails);
    this.roleId = roleAndUserDetails.roles[0].roleId;
    const currentUrl = this.location.path();
    if (currentUrl.includes('activity-search')) {
      this.isMobile = true;
    }
    this.sharedService.getSearchBarActivity().subscribe((val: any) => {
      this.activityList = val;
      console.log('activityList', this.activityList);
      this.searchLead = this.activityList;
    });
  }

  getvalue(enteredValue: string) {
    this.dropDown = (enteredValue === '') ? false : true;
    const sections = this.activityList;
    this.searchLead = sections.filter(e => {
      enteredValue = enteredValue.toLowerCase();
      const eName = e.name.toLowerCase();
      if (eName.includes(enteredValue)) {
        return e;
      }
      this.dropDown = true;
    });
  }

  getRoute(e, id, name) {
    this.searchText = name;
    this.routingId = id;
    this.dropDown = false;
    this.navigateToModule();
    const currentUrl = this.location.path();
    if (currentUrl.includes('activity-search')) {
      e.stopPropagation();
    }
  }

  navigateToModule() {
    this.loanViewService.isLoan360(false);
    this.sharedService.getUserName('');
    this.sharedService.getSupervisorName('');
    this.sharedService.getUserRoleId('');
    this.dashboardService.routingData = '';
    commonRoutingUrl.map(element => {
      if (element.routeId === this.routingId) {
        if (this.searchText == 'Supervisor Dashboard') {
          this.dashboardService.routingData = '';
        }
        if (element.routeId == '2') {
          this.commomLovService.setSearchLoan(null);
          if (this.roleId === 66) {
            return this.route.navigateByUrl('/pages/lead-creation/existing-lead-creation');
          }
        }
        this.route.navigateByUrl(element.routeUrl);
      }
    });
  }

  onSupervisorClick() {
    this.dashboardService.routingData = '';
    this.route.navigate(['/pages/supervisor']);
  }

  mouseEnter() {
    this.dropDown = true;
  }
}