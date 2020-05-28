import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  isCredit;

  constructor(private dashboardService: DashboardService, private loginService:LoginService) {

    // this.dashboardService.isCreditShow.subscribe(value => {
    //   this.isCredit = value;
    //   console.log('action - leads', this.isCredit);
    // });
   }

  ngOnInit() {
    this.isCredit = localStorage.getItem('userId');
    this.loginService.getUserDetails().subscribe((res: any) => {
      const response = res.ProcessVariables.roles[0].name;
      // console.log(response);
      this.dashboardService.leadsChange(response);
      this.isCredit = response;
    });

  }

}
