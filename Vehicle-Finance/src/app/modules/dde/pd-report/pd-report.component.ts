import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-pd-report',
  templateUrl: './pd-report.component.html',
  styleUrls: ['./pd-report.component.css']
})
export class PdReportComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;
  pdList: [];
  leadId: number;
  userId: any;
  roles: any;
  roleName: string;

  constructor(private labelsData: LabelsService,
    private router: Router,
    private loginStoreService: LoginStoreService,
    private personalDiscussionService: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleName = this.roles[0].name;
    // this.roleName = 'Sales Officer';
    // this.roleName = 'Credit Officer';
    console.log("this user", this.roleName)

    this.leadId = (await this.getLeadId()) as number;
    console.log('Lead ID', this.leadId);
    this.getLabels = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.labels = data;
      },
        error => {
          this.errorMsg = error;
        });
    console.log("in pd report")
    this.getPdList();
  }

  getPdList() {
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
    });
  }

  navigatePage(applicantId: string, version) {
    console.log(
      'applicantId',
      applicantId,
    );
    const URL = `/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${applicantId}`;
    console.log('URL', URL);
    if (this.roleName === 'Sales Officer') {
      this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${applicantId}`]);
    }
    else if (this.roleName === 'Credit Officer') {
      this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${applicantId}/${version}`]);

    }
    // routerLink="/pages/fl-and-pd-report/applicant-detail"
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  onFormSubmit() {
    this.router.navigate(['/pages/dde/pd-report']);
  }

}
