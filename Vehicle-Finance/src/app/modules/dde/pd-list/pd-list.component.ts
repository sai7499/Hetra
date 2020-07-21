import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-pd-report',
  templateUrl: './pd-list.component.html',
  styleUrls: ['./pd-list.component.css']
})
export class PdListComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;
  pdList: [];
  leadId: number;
  userId: any;
  roles: any;
  roleName: string;
  roleId: any;
  roleType: any;
  pdStatus: { [id: string]: any; } = {};
  show: boolean;
  showStatus: boolean;
  pdStatusValue: any;

  constructor(private labelsData: LabelsService,
              private router: Router,
              public sharedService: SharedService,
              private loginStoreService: LoginStoreService,
              private personalDiscussionService: PersonalDiscussionService,
              private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType)

    this.leadId = (await this.getLeadId()) as number;
    console.log('Lead ID', this.leadId);
    this.getLabels = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.labels = data;
      },
        error => {
          this.errorMsg = error;
        });
    console.log('in pd report')
    this.getPdList();


    if (this.router.url.includes('/pd-dashboard')) {   // showing/hiding the nav bar based on url

      console.log(' pd-dashboard ');
      this.show = true;

    } else if (this.router.url.includes('/dde')) {
      this.showStatus = true;

    } else {
      this.show = false;
    }
  }

  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      leadId: this.leadId,
      userId: '1001',
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processveriables = value.ProcessVariables;
      this.pdList = processveriables.finalPDList;
      console.log('PD List', this.pdList);

      for (var i in this.pdList) {
        console.log('in for pd list', i)
        this.pdStatusValue = this.pdList[i]['pdStatusValue']
        console.log('pd status value', this.pdStatusValue)

        if (this.pdList[i]['pdStatusValue'] == "Submitted") {
          this.pdStatus[this.pdList[i]['applicantId']] = this.pdList[i]['pdStatusValue']

          console.log("pd status array", this.pdStatus)
          this.sharedService.getPdStatus(this.pdStatus)
        }

      }
    });
  }
  onNavigateToPdSummary() { // func to route to the pd dashboard

    // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

    this.router.navigate([`/pages/dashboard/personal-discussion/my-pd-tasks`]);

  }

  navigatePage(applicantId: string, version) {
    console.log(
      'applicantId',
      applicantId,
    );

    console.log('URL', URL);
    if (version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details/${version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${applicantId}/applicant-details`]);
    }
  }

  getLeadId() {  // function to get the respective  lead id from the url
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }



  onNavigateBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);

  }
  onNavigateNext() {

    this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);

  }

}
