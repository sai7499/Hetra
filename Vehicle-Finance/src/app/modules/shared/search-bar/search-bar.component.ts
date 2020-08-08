import { Component, OnInit } from '@angular/core';
import { commonRoutingUrl } from '@shared/routing.constant';
import { Router } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';
import { SharedService } from '../shared-service/shared-service';

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

  constructor(
    private sharedService: SharedService,
    private route: Router,
    private loginStoreService: LoginStoreService,
    private location: Location) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    // this.activityList = roleAndUserDetails.activityList;
    // this.searchLead = this.activityList;
    const currentUrl = this.location.path();
    if (currentUrl.includes('activity-search')) {
      this.isMobile = true;
    }
    this.sharedService.getSearchBarActivity().subscribe((val: any) => {
      this.activityList = val;
      this.searchLead = this.activityList;
    })

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

  getRoute(id, name) {
    this.searchText = name;
    this.routingId = id;
    this.dropDown = false;
    this.navigateToModule();
  }

  navigateToModule() {
    commonRoutingUrl.map(element => {
      if (element.routeId === this.routingId) {
        this.route.navigateByUrl(element.routeUrl);
      }
    });
  }

  mouseEnter() {
    this.dropDown = true;
  }

}
