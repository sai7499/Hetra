import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/shared-service/shared-service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { Location } from '@angular/common';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LeadHistoryService } from '@services/lead-history.service';
import { CommonDataService } from '@services/common-data.service';
import { ToasterService } from '@services/toaster.service';
// import { LeadHistoriesDataService } from '@services/lead-histories-data.service';

@Component({
  selector: 'app-lead-section-header',
  templateUrl: './lead-section-header.component.html',
  styleUrls: ['./lead-section-header.component.css'],
})
export class LeadSectionHeaderComponent implements OnInit {
  labels: any = {};
  userName: string;
  leadId: number;
  productId: any;
  productIdFromLead: any;
  applicantName: string;
  loanAmount: string;
  stageDescription: string;

  leadCount: number = 0;
  userId: string = '0';

  isNeedBackButton: boolean = false;
  ddeBackLabel: string;
  ddeBackRouter: string;

  isEnableInitiateQuery: boolean = true;
  locationIndex: number;

  isEnableDdeButton: boolean = false;
  isDdeModule: boolean;
  isButtonNameChange : boolean
  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private aRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private toggleDdeService: ToggleDdeService,
    private leadHistoryService: LeadHistoryService,
    private commonDataService: CommonDataService,
    private toasterService: ToasterService,
  ) {
    // this.aRoute.parent.params.subscribe(value => this.leadId = Number(value.leadId))
    this.leadId = this.aRoute.snapshot.params['leadId'];
  }

  ngOnInit() {
    // this.leadId = (await this.getLeadId()) as number;
    const operationType = this.toggleDdeService.getOperationType()
    this.isEnableDdeButton = !this.toggleDdeService.getDdeClickedValue() && (operationType);
    this.getLabels();
    this.userId = localStorage.getItem('userId');

    if (this.leadId) {
      // console.log(this.aRoute.snapshot)
      const gotLeadData = this.aRoute.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
        this.leadStoreService.setLeadCreation(leadData);
        this.leadCount = leadData.queryCount;
      }
    }
    this.getUserDetails();
    const value = localStorage.getItem('ddePath');
    if (value) {
      const ddeButton = JSON.parse(value);
      this.ddeBackLabel = ddeButton.labelName;
      this.setDdeBackButton();
    }
    this.sharedService.productCatName$.subscribe(val =>
      this.productId = val)

    const currentUrl = this.location.path();

    if(currentUrl.includes('document-viewupload')){
      this.isButtonNameChange= true;
    }else{
      this.isButtonNameChange= false;
    }
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    this.getInitiateQueryCount(this.leadId);

  }

  getLocationIndex(url: string) {
    if (url.includes('query-model')) {
      this.isEnableInitiateQuery = false
      return 0;
    } else {
      this.isEnableInitiateQuery = true;
      return 1;
    }
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      (error) => console.log(error)
    );
  }

  getUserDetails() {
    const data = this.createLeadDataService.getLeadSectionData();
    const leadSectionData = data as any;
    // console.log('leadSectionData', leadSectionData);
    this.leadId = leadSectionData.leadId;
    // this.loanAmount = leadSectionData.leadDetails?.reqLoanAmt;
    // leadSectionData.leadDetails.reqLoanAmt : 0;
    const applicantDetails = leadSectionData.applicantDetails;
    // ? leadSectionData.applicantDetails[0]
    // : '';
    setTimeout(() => {
      applicantDetails.map((data: any) => {
        if (data.applicantTypeKey === 'APPAPPRELLEAD') {
          this.applicantName = data.fullName ? data.fullName : '';
          console.log('applicant', this.applicantName);
        }
      });
    });

    this.stageDescription = leadSectionData.leadDetails.stageDesc;

    this.sharedService.leadData$.subscribe((value) => {
      this.productId = value;
    });
    if (!this.productId) {
      this.productId = leadSectionData['leadDetails']['productCatName'];
    }
    this.sharedService.loanAmount$.subscribe(
      (value) => (this.loanAmount = Number(value).toLocaleString('en-IN'))
    );

    this.loanAmount = leadSectionData['leadDetails']['reqLoanAmt']
      ? Number(leadSectionData['leadDetails']['reqLoanAmt']).toLocaleString('en-IN')
      : '0';
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.aRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  saveCurrentUrl() {
    const currentUrl = this.location.path();
    localStorage.setItem('currentUrl', currentUrl);  
  }

  onBackDocumentUpload(){
    
    const url=  localStorage.getItem('currentUrl');
    this.router.navigateByUrl(url)

  }

  viewOrEditDde() {
    this.toggleDdeService.setIsDDEClicked();
    this.isEnableDdeButton = false;
    this.isNeedBackButton = true;
    this.router.navigate(['/pages/dde/' + this.leadId])
    this.toggleDdeService.setCurrentPath(this.location.path())
    this.setDdeBackButton()
  }

  setDdeBackButton() {
    const value = localStorage.getItem('ddePath');
    if (!value) {
      this.isNeedBackButton = false;
      return;
    }
    const ddeButton = JSON.parse(value);
    if (this.toggleDdeService.getDdeClickedValue()) {
      this.isNeedBackButton = true;
    }

    this.ddeBackLabel = ddeButton.labelName;
    this.ddeBackRouter = ddeButton.currentUrl;
  }

  backFromDde() {
    const value = localStorage.getItem('ddePath');
    const ddeButton = JSON.parse(value);
    this.router.navigateByUrl(ddeButton.currentUrl);
    localStorage.removeItem('isDdeClicked');
    this.isNeedBackButton = false
  }

  getInitiateQueryCount(lead) {
    console.log(lead, 'lead')
  }

  initinequery() {
    this.isEnableInitiateQuery = false;
    const currentUrl = this.location.path();
    localStorage.setItem('forQueryUrl', currentUrl);
    this.router.navigate(['//pages/query-model/', { leadId: this.leadId }]);
    // this.router.navigateByUrl(`/pages/query-model/${this.leadId}`)
  }

  onLeadHistory() {
    this.leadHistoryService.leadHistoryApi(this.leadId)
      .subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;

          if (appiyoError === '0' && apiError === '0') {
            const leadHistoryData = response;
            console.log('leadHistoryData', leadHistoryData);
            this.commonDataService.shareLeadHistoryData(leadHistoryData);
          } else {
            const message = response.ProcessVariables.error.message;
            this.toasterService.showError(message, 'Lead Creation');
          }
        }
      );
  }

}