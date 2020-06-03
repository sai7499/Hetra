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

  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService) {
  }

  ngOnInit() {
    this.isCredit = localStorage.getItem('roleType');
  }

}

