import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFilter;
  isCredit;
  constructor(private dashboardService: DashboardService, private loginService: LoginService) { 
    // this.loginService.getUserDetails().subscribe((res: any) => {
    //   const response = res.ProcessVariables.roles[0].name;
    //   this.dashboardService.leadsChange(response);
    //   this.isCredit = response;
    // });
    this.isCredit = localStorage.getItem('role');
  }

  ngOnInit() {  }

}
