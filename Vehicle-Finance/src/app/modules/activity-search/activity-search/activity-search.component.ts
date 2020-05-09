import { Component, OnInit, OnDestroy } from '@angular/core';
import { element } from 'protractor';


@Component({
  selector: 'app-dashboard',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.css']
})
export class ActivitySearchComponent implements OnInit, OnDestroy {

  constructor() {}
  openProfile: boolean;
  seletedRoute: string;
  searchText: string;
  searchLead: any;
  bodyClickEvent = event => {
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  }

  ngOnInit() {
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
  // tslint:disable-next-line: no-unused-expression
  // tslint:disable-next-line: only-arrow-functions
  this.searchLead = sections.filter( e => {
         return e.name.includes(env);
  });
  console.log('SortedArray :', this.searchLead);
}

isInArray() {

}

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }

}
