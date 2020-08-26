import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-pd-list',
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
  isFiCumPD: boolean;
  fiCumPdStatusString: string;
  fiCumPdStatus: boolean;

  constructor(private labelsData: LabelsService,
    private router: Router,
    public sharedService: SharedService,
    private loginStoreService: LoginStoreService,
    private personalDiscussionService: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true
    }

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.leadId = (await this.getLeadId()) as number;
    this.getLabels = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.labels = data;
      },
        error => {
          this.errorMsg = error;
        });
    this.getPdList();


    if (this.router.url.includes('/fi-cum-pd-dashboard')) {   // showing/hiding the nav bar based on url
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
      userId: localStorage.getItem('userId'),
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      this.isFiCumPD = processvariables.isFiCumPD;
      this.pdList = processvariables.finalPDList;

      for (var i in this.pdList) {
        this.pdStatusValue = this.pdList[i]['pdStatusValue']
        if (this.pdList[i]['pdStatusValue'] == "Submitted") {
          this.pdStatus[this.pdList[i]['applicantId']] = this.pdList[i]['pdStatusValue']
          this.sharedService.getPdStatus(this.pdStatus)
        }

      }
    });
  }
  onNavigateToPdSummary() { // func to route to the pd dashboard

    // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

    this.router.navigate([`/pages/dashboard`]);

  }

  navigatePage(applicantId: string, version?: any) {

    console.log('in navigate page', version);

    if (this.isFiCumPD === true) { // for routing to fi cum pd screens

      if (this.router.url.includes('fi-cum-pd-dashboard')) {
        // this.show = true;
        if (version) {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details/${version}`]);
        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details`]);
        }

      } else if (this.router.url.includes('/dde')) {
        // this.showStatus = true;
        if (version) {
          this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details/${version}`]);
        } else if (version === undefined || version === null) {

          this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details`]);
        }

      }
    } else if (this.isFiCumPD === false) { // for routing to pd screens only

      if (this.router.url.includes('/fi-cum-pd-dashboard')) {

        // this.show = true;
        if (version !== null && version !== undefined) {
          // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          // right now version not available so

        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details`]);
        }

      } else if (this.router.url.includes('/dde')) {
        // this.showStatus = true;
        if (version) {
          // this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          // right now version not available so
        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details`]);
        }

      }

    }
  }
  navigateNewPdPage(applicantId: string, version: any) {
    if (version !== null && version !== undefined) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
    } else if (version === undefined || version === null) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details`]);
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
    if (this.fiCumPdStatus == false) {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
      // this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    } else if (this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/tvr-details']);

    }

  }
  onNavigateNext() {

    this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);

  }

}
