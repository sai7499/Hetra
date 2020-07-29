import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFilter;
  roleType;
  labels;
  validationData;
  isDirty: boolean;
  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService
     ) { }

  ngOnInit() {
     this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
       this.roleType = value.roleType;
      });

     this.labelService.getLabelsData().subscribe(res => {
        this.labels = res;
        this.validationData = res.validationData;
      });
  }

}
