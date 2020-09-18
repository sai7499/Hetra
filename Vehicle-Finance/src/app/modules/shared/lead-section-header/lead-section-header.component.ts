import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@shared/shared-service/shared-service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { Location } from '@angular/common';
import { ToggleDdeService } from '@services/toggle-dde.service';

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
  loanAmount: number;
  stageDescription: string;

  isNeedBackButton: boolean = false;
  ddeBackLabel: string;
  ddeBackRouter: string;

  isEnableDdeButton: boolean = false;
  isDdeModule: boolean;
  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private loginStoreService: LoginStoreService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private aRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private toggleDdeService: ToggleDdeService
  ) {
    // this.aRoute.parent.params.subscribe(value => this.leadId = Number(value.leadId))
    this.leadId = this.aRoute.snapshot.params['leadId'];
  }

  ngOnInit() {
    // this.leadId = (await this.getLeadId()) as number;
    const operationType = this.toggleDdeService.getOperationType()
    this.isEnableDdeButton = !this.toggleDdeService.getDdeClickedValue() && (operationType === '1' || operationType === '2' );
    this.getLabels();
    if (this.leadId) {
      // console.log(this.aRoute.snapshot)
      const gotLeadData = this.aRoute.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
        this.leadStoreService.setLeadCreation(leadData);
      }
    }
    this.getUserDetails();
    const value = localStorage.getItem('ddePath');
    if(value){
    const ddeButton = JSON.parse(value);
    this.ddeBackLabel = ddeButton.labelName;
    this.setDdeBackButton();
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
    const applicantDetails = leadSectionData.applicantDetails
      ? leadSectionData.applicantDetails[0]
      : '';
    this.applicantName = applicantDetails.fullName;

    this.stageDescription = leadSectionData.leadDetails.stageDesc;

    this.sharedService.leadData$.subscribe((value) => {
      this.productId = value;
    });
    if (!this.productId) {
      this.productId = leadSectionData['leadDetails']['productCatName'];
    }
    this.sharedService.loanAmount$.subscribe(
      (value) => (this.loanAmount = value)
    );
    // Number(value).toLocaleString('en-IN')
    'en-IN'
    this.loanAmount = leadSectionData['leadDetails']['reqLoanAmt']
      ? leadSectionData['leadDetails']['reqLoanAmt']
      : 0;
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
    if(this.toggleDdeService.getDdeClickedValue()){
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
    // this.toggleDdeService.clearToggleData();
    // this.toggleDdeService.setIsDDEClicked(0);
    // this.isEnableDdeButton = false;
    this.isNeedBackButton = false
    
  }

}
