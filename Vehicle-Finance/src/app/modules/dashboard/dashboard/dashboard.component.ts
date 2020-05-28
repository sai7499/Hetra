import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFilter;
  isCredit;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // console.log(localStorage.getItem('userId'));
    // this.dashboardService.isCreditShow.subscribe(value => {
    //   this.isCredit = value;
    //   console.log('action - dashboard', this.isCredit);
    // });
    this.isCredit = localStorage.getItem('userId');
  }

}
