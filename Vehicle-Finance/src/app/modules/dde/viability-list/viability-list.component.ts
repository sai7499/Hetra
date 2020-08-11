import { Component, } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViabilityServiceService } from '@services/viability-service.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { Location } from '@angular/common';

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

  constructor(private labelsData: LabelsService,
    private router: Router,
    private route: ActivatedRoute,
    private viabilityService: ViabilityServiceService,
    private toasterService: ToasterService,
    private loginStoreService: LoginStoreService,
    private location: Location) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  async ngOnInit() {
    this.fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true
    }
    console.log(this.taskId, 'task id onInit');
    this.leadId = (await this.getLeadId()) as number;
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);

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
  getViability(data: any, make: any, model: any, applicantName: any) {
    const body = {
      data: Number(data),
      // tslint:disable-next-line: object-literal-shorthand
    };
    const details = { make, model, applicantName };
    console.log(body);
    // this.viabilityService.CollateralId(body);
    this.viabilityService.CollateralId(details);
    // tslint:disable-next-line: triple-equals
    if (this.router.url.includes('/dde')) {
      this.router.navigateByUrl(`pages/dde/${this.leadId}/viability-details/${data}`);
      // tslint:disable-next-line: triple-equals
    } else {
      this.router.navigate([`pages/viability-list/${this.leadId}/viability-details/${data}`]);
    }
  }
  onBack() {
    // this.location.back();
    if (this.fiCumPdStatus == false) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    } else if (this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

    }
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
      } else {
        this.toasterService.showWarning('No Viablity Found', 'Contact Sales');
      }
    });
  }
}
