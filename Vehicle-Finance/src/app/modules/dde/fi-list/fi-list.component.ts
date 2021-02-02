import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldInvestigationService } from '@services/fi/field-investigation.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import html2pdf from 'html2pdf.js';
import { PdDataService } from '../fi-cum-pd-report/pd-data.service';

@Component({
  selector: 'app-fi-list',
  templateUrl: './fi-list.component.html',
  styleUrls: ['./fi-list.component.css']
})
export class FiListComponent implements OnInit {

  LOV: any;
  labels: any;
  leadId: number;
  fiList: Array<any>;
  leadData: any;
  applicantId: any;
  userId: any;
  show: boolean;
  showStatus: boolean;
  fiStatusValue: any;
  fiStatus: { [id: string]: any; } = {};
  pdStatusValue;
  productCatCode: string;

  selectedApplicantId: any;
  version:any;
  applicantFullName: any;
  fiResidenceDetails: any;
  fiBusinessDetails: any;

  fiContactPointVerification: any;
  fiDetailsOfResidence: any;
  fiLocality: any;
  fiRnoofmonthsCity: string;
  fiRnoofyearsCity: string;
  fiRnoofmonthsResi: string;
  fiRnoofyearsResi: string;

  fiBContactPointVerification: any;
  fiBpremises: any;
  fiBofficeSize: any;

  showTypeOfConcern: boolean;
  custSegment: any;

  currentDate: Date = new Date();
  stringTime = String(new Date(new Date().getTime()).toLocaleTimeString()).split(':', 2);
  currentTime: any;
  isFiModal: boolean;
  udfScreenId: any;

  constructor(
    private labelDetails: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginStoreService: LoginStoreService,
    private fieldInvestigationService: FieldInvestigationService,
    private personalDiscussionService: PersonalDiscussionService,
    private createLeadDataService: CreateLeadDataService,
    private commonLovService: CommomLovService,
    private pdDataService: PdDataService
  ) {
    this.currentTime = this.stringTime[0] + ':' + this.stringTime[1];
    this.showTypeOfConcern = true;
   }

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
        this.getLOV();
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

    this.labelDetails.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.router.url.includes('/dde') ? udfScreenId.DDE.fiListDDE : udfScreenId.FI.fiList ;

    })


  }

  getLOV() { // fun call to get all lovs
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('Filov', this.LOV);
  }

  // getting lead data from create lead data service

  async getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    // console.log('leadSectionData Lead details', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;
    this.applicantId = data['applicantDetails'][0]['applicantId'];
    console.log('lead section applicant ID', this.applicantId);
    this.productCatCode = this.leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);

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
        if (this.fiList[i]['fiStatus'] != null) {
          this.fiStatusValue = this.fiList[i]['fiStatus']
        }

        if (this.fiList[i]['fiStatusValue'] == "Submitted") {
          this.fiStatus[this.fiList[i]['applicantId']] = this.fiList[i]['fiStatusValue']
          // this.sharedService.getPdStatus(this.pdStatus)
        }
        if (this.fiList[i]['fiReportValue'] != null) {
          this.fiList[i]['fiReportValue'] = this.fiList[i]['fiReportValue'].split(',');
        } else {
          this.fiList[i]['fiReportValue'] = [];
        }


      }
    });
  }


  onClick(applicantIdFromHtml: string) {

    console.log('this applicant id', applicantIdFromHtml);
    this.router.navigateByUrl(`pages/fi-dashboard/${this.leadId}/fi-report/${applicantIdFromHtml}/fi-residence`);
  }
  navigatePage(applicantId: string, version: any) {

    const applicantType = this.leadData.applicantDetails.find((ele) => ele.applicantId === applicantId);
    const entity = applicantType.entity
    this.pdDataService.setApplicantType(entity);
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
        if( entity == 'Individual') {
          this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-residence/${version}`]);
        }else{
          this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-business/${version}`]);
        }
        
      } else if (version === undefined || version === null) {
        console.log('in fi-cum-pd-dashboard undefined version conditon');
        if( entity == 'Individual') {
          this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-residence`]);
        }else{
          this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${applicantId}/fi-business`]);
        }
      }

    } else if (this.router.url.includes('/dde')) {
      console.log(' in dde flow');
      // this.showStatus = true;
      if (version) {
        if( entity == 'Individual') { 
          this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-residence/${version}`]);
        } else {
          this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-business/${version}`]);
        }
      } else if (version === undefined || version === null) {
        if( entity == 'Individual') { 
          this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-residence`]);
        } else {
          this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${applicantId}/fi-business`]);
        }
      }

    }
  }


  onNavigate(action) { // fun for routing into next and back pages using argument ==> 'action'
    // console.log('in on navigate', action);
    console.log(action === 'back' && this.productCatCode == 'UC');

    if (this.productCatCode == 'UC' && action === 'back') {
      this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);
    } else if (this.productCatCode != 'UC' && action === 'back') {
      this.router.navigate(['pages/dde/' + this.leadId + '/tvr-details']);
    }
    else if (action === 'next') {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    }


  }
  onNavigateToFiSummary() { // func to route to the pd dashboard

    // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

    this.router.navigate([`/pages/dashboard`]);

  }

  getFiData(){
    const data = {
      applicantId: this.applicantId,
      userId: this.userId,
      fiVersion: this.version
    };

    this.fieldInvestigationService.getFiReportDetails(data).subscribe(async (res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.applicantFullName = res.ProcessVariables.applicantName;
        this.fiResidenceDetails = res.ProcessVariables.getFIResidenceDetails;
        this.fiBusinessDetails = res.ProcessVariables.getFIBusinessDetails;
        this.custSegment = this.fiBusinessDetails.custSegment;
        this.getConcernType();


        if (this.fiResidenceDetails) {
          this.fiRnoofmonthsCity = String(Number(this.fiResidenceDetails.yrsOfStayInCity) % 12) || '';
          this.fiRnoofyearsCity = String(Math.floor(Number(this.fiResidenceDetails.yrsOfStayInCity) / 12)) || '';
        }
        if (this.fiResidenceDetails) {    
          this.fiRnoofmonthsResi = String(Number(this.fiResidenceDetails.yrsOfStayInResi) % 12) || '';
          this.fiRnoofyearsResi = String(Math.floor(Number(this.fiResidenceDetails.yrsOfStayInResi) / 12)) || '';
        }
        this.fiContactPointVerification = this.LOV.LOVS.contactPointVerification.find((value) => value.key == this.fiResidenceDetails.contactPointVerification);
        this.fiDetailsOfResidence = this.LOV.LOVS['fi/PdHouseOwnership'].find((value) => value.key == this.fiResidenceDetails.residenceDetails);
        this.fiLocality = this.LOV.LOVS['fi/PdResidentialLocality'].find((value) => value.key == this.fiResidenceDetails.locality);

        this.fiBContactPointVerification = this.LOV.LOVS.contactPointVerification.find((value) => value.key == this.fiBusinessDetails.contactPointVerification);
        this.fiBpremises = this.LOV.LOVS['fi/PdOfficePremisesType'].find((value) => value.key == this.fiResidenceDetails.officePremises);
        this.fiBofficeSize = this.LOV.LOVS['fi/PdOfficeSize'].find((value) => value.key == this.fiResidenceDetails.officeSize);
        setTimeout(() => {
          this.downloadpdf();
        });
      }
    });
  }

  getConcernType() {
    if (this.custSegment == "SALCUSTSEG" && this.custSegment != null) {
      this.showTypeOfConcern = true;
    } else if (this.custSegment == "SEMCUSTSEG" && this.custSegment != null) {
      this.showTypeOfConcern = true;
    } else {
      this.showTypeOfConcern = false;
    }
  }

  getPdf(event?) {
    this.selectedApplicantId = event;
    this.getFiData();
    this.isFiModal = true;
  }

  downloadpdf() {
    var options = {
      margin: [0.5, 0.3, 0.5, 0.3],
      filename: `FI_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 3, logging: true },
      pagebreak: { before: "#page-break" },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    }
    html2pdf().from(document.getElementById('pdf')).set(options).save();
    this.isFiModal = false;
  }
}
