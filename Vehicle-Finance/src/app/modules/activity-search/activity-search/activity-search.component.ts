import { Component, OnInit, OnDestroy } from '@angular/core';
import { element } from 'protractor';
import { LoginStoreService } from '../../../services/login-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '../../../services/commom-lov-service';
import { commonRoutingUrl } from '../../shared/routing.constant';



@Component({
  selector: 'app-dashboard',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.css']
})
export class ActivitySearchComponent implements OnInit, OnDestroy {

  openProfile: boolean;
  seletedRoute: string;
  searchText: string;
  searchLead: any;
  searchDiv = false;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];
  // searchText: string;
  dropDown: boolean;
  // searchLead = [];
  routingId: string;
  activityList = [];
  routingModule: string;

  bodyClickEvent = event => {
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  }

  constructor(
    private loginStoreService: LoginStoreService,
    private route: Router) {
  }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;
    this.activityList = roleAndUserDetails.activityList;

    document
      .querySelector('body')
      .addEventListener('click', this.bodyClickEvent);
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
  }

  navigateToModule() {
    // tslint:disable-next-line: no-shadowed-variable
    commonRoutingUrl.map( element => {
      // tslint:disable-next-line: triple-equals
      if (element.routeId == this.routingId) {
        this.route.navigateByUrl(element.routeUrl);
      }
    });
  }

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }

}
