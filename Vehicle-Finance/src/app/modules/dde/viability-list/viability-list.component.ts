import { Component, } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViabilityServiceService } from '@services/viability-service.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  templateUrl: './viability-list.component.html',
  styleUrls: ['./viability-list.component.css']
})
export class ViabilityListComponent {
  labels: any = {};
  leadId: number;
  viabilityData: any;
  userId: any;
  roles: any;
  roleId: any;
  roleName: any;
  roleType: any;
  showNext = true;
  taskId: any;
  fiCumPdStatusString: string;
  fiCumPdStatus: boolean;
  inititate = false;
  isLoan360: boolean;
  tabName: any;
  leadData: {};
  productCatCode: any;

  constructor(private labelsData: LabelsService,
              private router: Router,
              private route: ActivatedRoute,
              private viabilityService: ViabilityServiceService,
              private toasterService: ToasterService,
              private loginStoreService: LoginStoreService,
              private location: Location,
              private toggleDdeService: ToggleDdeService,
              private loanViewService: LoanViewService,
              private sharedService: SharedService,
              private createLeadDataService: CreateLeadDataService,
    ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    // tslint:disable-next-line: triple-equals
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false;
    // tslint:disable-next-line: triple-equals
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true;
    }
    this.tabName = this.sharedService.getTabName();
    console.log(this.taskId, 'task id onInit');
    this.leadId = (await this.getLeadId()) as number;
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);
    this.getLeadSectionData();

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );
    this.getViabilityList();
    if (this.router.url.includes('/dde')) {
      this.showNext = true;
    } else {
      this.showNext = false;
    }
    console.log(this.route, 'queryParams Check');

  }
  getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadData = { ...leadSectionData };
    this.productCatCode = this.leadData['leadDetails'].productCatCode;

  }
  getViability(colletaralId: any, version: any) {
    // this.viabilityService.CollateralId(body);
    // this.viabilityService.CollateralId(details);
    // tslint:disable-next-line: triple-equals
    if (this.router.url.includes('/dde')) {
      this.router.navigateByUrl(`pages/dde/${this.leadId}/viability-details/${colletaralId}/${version}`);
      // tslint:disable-next-line: triple-equals
    } else {
      this.router.navigate([`pages/viability-list/${this.leadId}/viability-details/${colletaralId}`]);
    }
  }
  onBack() {
    // if (this.isLoan360) {
    //   return this.router.navigateByUrl(`/pages/dde/${this.leadId}/tvr-details`);
    // }
    if(this.roleType == '2'){
      if (this.tabName['isFiCumPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isFI']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
      }
      else if (this.productCatCode == 'UC') {
        this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);
      }else {
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/tvr-details`);
      }
    }
    else if (this.roleType == '1') {
      this.router.navigate(['pages/dashboard']);
    }
    
    
    // if (this.fiCumPdStatus == false && this.roleType == '2') {
    //   this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    // } else if (this.fiCumPdStatus == true && this.roleType == '2') {
    //   this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    // } 
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
  getViabilityList() {
    const body = {
      leadId: this.leadId
    };
    this.viabilityService.getViabilityList(body).subscribe((res: any) => {
      if (res.ProcessVariables.error.code === '0') {
        this.viabilityData = res.ProcessVariables.vehicleViabilityDashboardList;
        this.inititate = res.ProcessVariables.initiate;
      } else {
        this.toasterService.showWarning('No Viablity Found', 'Contact Sales');
      }
    });
  }
  reInitiateViability() {
    const body = {
      leadId: this.leadId,
      // collateralId: this.collataralId,
      isReinitiated: false
    };
    this.viabilityService.reinitiateViabilityDetails(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
      this.toasterService.showSuccess('Vehicle viability task assigned succesfully', '');
      // this.router.navigateByUrl(`pages/dashboard`);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }
}
