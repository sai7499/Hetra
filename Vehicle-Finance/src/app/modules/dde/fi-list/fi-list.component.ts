import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldInvestigationService } from '@services/fi/field-investigation.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-fi-list',
  templateUrl: './fi-list.component.html',
  styleUrls: ['./fi-list.component.css']
})
export class FiListComponent implements OnInit {

  labels: any;
  leadId: number;
  fiList: Array<any>;
  leadData: {};
  applicantId: any;
  userId: any;
  show: boolean;
  showStatus: boolean;
  fiStatusValue: any;
  fiStatus: { [id: string]: any; } = {};
  constructor(
    private labelDetails: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginStoreService: LoginStoreService,
    private fieldInvestigationService: FieldInvestigationService,
    private personalDiscussionService: PersonalDiscussionService,
    private createLeadDataService: CreateLeadDataService
  ) { }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.getLeadSectionData();
        }
        resolve(null);
      });
    });
  }

  async ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    //  details from loginstore service
    this.userId = roleAndUserDetails.userDetails.userId;
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.leadId = (await this.getLeadId()) as number;
    this.getFiList();
    if (this.router.url.includes('/fi-dashboard')) {   // showing/hiding the buttons based on url

      console.log(' fi-dashboard ');
      this.show = true;

    } else if (this.router.url.includes('/dde')) {
      this.showStatus = true;

    } else {
      this.show = false;
    }


  }

  // getting lead data from create lead data service

  async getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    // console.log('leadSectionData Lead details', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;
    this.applicantId = data['applicantDetails'][0]['applicantId'];
    console.log('lead section applicant ID', this.applicantId);


  }

  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      applicantId: this.applicantId,
      userId: this.userId,
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      this.fiList = processvariables.finalPDList;
      console.log('PD List', this.fiList);

    }
    );
  }

  getFiList() {

    const data = {
      applicantId: this.applicantId, // uncomment when we get proper applicant ID
      // applicantId: 1177, // hardCoded for testing purpose
      userId: this.userId,
    };
    this.fieldInvestigationService.getFiList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      // console.log('in get fi list', processvariables);
      this.fiList = processvariables.finalFIList;
      console.log('fi List', this.fiList);

      for (var i in this.fiList) {
        this.fiStatusValue = this.fiList[i]['fiStatusValue']
        if (this.fiList[i]['fiStatusValue'] == "Submitted") {
          this.fiStatus[this.fiList[i]['applicantId']] = this.fiList[i]['fiStatusValue']
          // this.sharedService.getPdStatus(this.pdStatus)
        }

      }
    });
  }


  onClick(applicantIdFromHtml: string) {

    console.log('this applicant id', applicantIdFromHtml);
    this.router.navigateByUrl(`pages/fi-dashboard/${this.leadId}/fi-report/${applicantIdFromHtml}/fi-residence`);
  }
  navigatePage(applicantId: string, version: any) {
    console.log(
      'applicantId',
      applicantId,
    );
    console.log('version', version);

    console.log('URL', URL);

    if (this.router.url.includes('fi-dashboard')) {

      console.log(' in fi-dashboard flow');

      // this.show = true;
      if (version) {
        console.log('in fi-dashboard version conditon');
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-residence/${version}`]);
      } else if (version === undefined || version === null) {
        console.log('in fi-cum-pd-dashboard undefined version conditon');
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-residence`]);
      }

    } else if (this.router.url.includes('/dde')) {
      console.log(' in dde flow');
      // this.showStatus = true;
      if (version) {
        this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-residence/${version}`]);
      } else if (version === undefined || version === null) {

        this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-residence`]);
      }

    }
  }


  onNavigate(action) { // fun for routing into next and back pages using argument ==> 'action'
    // console.log('in on navigate', action);

    if (action === 'back') {
      this.router.navigate(['pages/dde/' + this.leadId + '/tvr-details']);
    } else if (action === 'next') {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

    }


  }
  onNavigateToFiSummary() { // func to route to the pd dashboard

    // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

    this.router.navigate([`/pages/dashboard`]);

  }
}
