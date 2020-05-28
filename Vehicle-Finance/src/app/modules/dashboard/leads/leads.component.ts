import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  isCredit;

  constructor(private dashboardService: DashboardService) {

    // this.dashboardService.isCreditShow.subscribe(value => {
    //   this.isCredit = value;
    //   console.log('action - leads', this.isCredit);
    // });
   }

  ngOnInit() {
    this.isCredit = localStorage.getItem('userId');

  }

}
