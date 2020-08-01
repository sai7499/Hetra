import { Component, OnInit } from '@angular/core';
import { commonRoutingUrl } from '@shared/routing.constant';
import { Router } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
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

  constructor(
    private sharedService: SharedService,
    private route: Router,
    private loginStoreService: LoginStoreService,

  ) { }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log('Rolea', roleAndUserDetails)
    // this.activityList = roleAndUserDetails.activityList;

    this.sharedService.getSearchBarActivity().subscribe((val: any) => {
      // if () {
        this.activityList = val;
        this.searchLead = this.activityList;
        console.log('activityList', this.activityList)
    })


  }

  getvalue(enteredValue: string) {
    this.dropDown = (enteredValue === '') ? false : true;
    const sections = this.activityList;
    console.log('section', sections);

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
      console.log('URl', element)
      if (element.routeId === this.routingId) {
        this.route.navigateByUrl(element.routeUrl);
      }
    });
  }

  mouseEnter() {
    this.dropDown = true;
    console.log('dropdown', this.dropDown);
  }

}
