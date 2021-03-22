import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';

@Component({
    selector: 'app-dashboard-pdc-details',
    templateUrl: './dashboard-pdc-details.component.html',
    styleUrls: ['./dashboard-pdc-details.component.css']
})
export class DashboardPdcDetailsComponent implements OnInit {

    roleId: any;
    roleType: any;
    isCpcCheque: boolean;

    constructor(private loginStoreService: LoginStoreService) { }

    ngOnInit() {

        this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
            this.roleId = value.roleId;
            this.roleType = value.roleType;
        });

        this.isCpcCheque = this.roleType === 5 ? true : false;
    }



}