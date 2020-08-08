import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-pdc-details',
  templateUrl: './pdc-details.component.html',
  styleUrls: ['./pdc-details.component.css']
})
export class PdcDetailsComponent implements OnInit {
  roleId: any;
  roleType: any;
  leadId: any;

  constructor( private loginStoreService: LoginStoreService,
               private cpcService: CpcRolesService,
               private route: ActivatedRoute,
               private router: Router,
               private toasterService: ToasterService) { }

  async ngOnInit() {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.leadId = (await this.getLeadId()) as number;
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  submitTocpc() {

    // tslint:disable-next-line: triple-equals
     if (this.roleType == '4') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: true,
        sendBackToCredit: false
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        if (res.ProcessVariables.error.code == '0') {
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
        });
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: false,
        sendBackToCredit: false
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
          // tslint:disable-next-line: triple-equals
          if (res.ProcessVariables.error.code == '0') {
            this.router.navigate([`pages/dashboard`]);
          } else {
            this.toasterService.showError(res.Processvariables.error.message, '');
          }
        });
    }

  }
  sendBackToCredit() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true
      };
    // tslint:disable-next-line: deprecation
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
  });
}
}




