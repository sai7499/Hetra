import { Component, OnInit } from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";
import { Router, ActivatedRoute } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@shared/shared-service/shared-service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';


@Component({
  selector: 'app-lead-section-header',
  templateUrl: './lead-section-header.component.html',
  styleUrls: ['./lead-section-header.component.css']
})
export class LeadSectionHeaderComponent implements OnInit {
  labels: any = {};
  userName: string;
  leadId: number;
  productId: any;
  productIdFromLead: any;
  applicantName: string;
  loanAmount: Number;
  stageDescription: string;

  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private loginStoreService: LoginStoreService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private aRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService
  ) {
    // this.aRoute.parent.params.subscribe(value => this.leadId = Number(value.leadId))
    this.leadId = this.aRoute.snapshot.params["leadId"];
  }

  ngOnInit() {
    // this.leadId = (await this.getLeadId()) as number;
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
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => this.labels = data,
      error => console.log(error)
    );
  }

  getUserDetails() {
    const data = this.createLeadDataService.getLeadSectionData();
    const leadSectionData = (data as any);
    // console.log('leadSectionData', leadSectionData);
    this.leadId = leadSectionData.leadId;
    // this.loanAmount = leadSectionData.leadDetails?.reqLoanAmt;
                      // leadSectionData.leadDetails.reqLoanAmt : 0;
    const applicantDetails= leadSectionData.applicantDetails? leadSectionData.applicantDetails[0] : ''
    this.applicantName = applicantDetails.fullName;
    this.loanAmount = leadSectionData['leadDetails']['reqLoanAmt'];
    this.stageDescription = leadSectionData.leadDetails.stageDesc;

    this.sharedService.leadData$.subscribe(value => {
      this.productId = value;
    });
    if (!this.productId) {
      this.productId = leadSectionData['leadDetails']['productCatName'];
    }
    this.sharedService.loanAmount$.subscribe(value =>
      this.loanAmount = value)
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
}