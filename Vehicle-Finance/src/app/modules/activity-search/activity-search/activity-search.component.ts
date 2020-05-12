import { Component, OnInit, OnDestroy } from '@angular/core';
import { element } from 'protractor';
import { LoginStoreService } from '../../../services/login-store.service';


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

  bodyClickEvent = event => {
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  }

  constructor(private loginStoreService: LoginStoreService) { }

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

getvalue(env: any) {
  const sections = [
    { name: 'Create Lead', route: '/pages/lead-creation' },
    { name: 'QDE' , route: 'USA'},
    { name: 'PD' , route: 'UK'},
    { name: 'DDE' , route: '/pages/dde' },
  ];
  console.log(this.searchText);
  this.searchLead = sections.filter( e => {
        //  return e.name.includes(env);
        env = env.toLowerCase();
        const eName = e.name.toLowerCase();
        if (eName.includes(env)) {
          return e;
        }
        this.searchDiv = true;
  }
  );
  console.log('SortedArray :', this.searchLead);
}

getRoute(data: any) {
  console.log(data);

}

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }

}
