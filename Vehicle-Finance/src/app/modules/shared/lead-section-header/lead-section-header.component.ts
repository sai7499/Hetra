import { Component, OnInit, OnDestroy } from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@shared/shared-service/shared-service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';

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

  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private loginStoreService: LoginStoreService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService
  ) { }

  ngOnInit() {
    this.getLabels();
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
    console.log('leadSectionData',leadSectionData);
    this.leadId = leadSectionData.leadId;
    this.applicantName = leadSectionData.applicantDetails[0].fullName;
    this.sharedService.leadData$.subscribe(value => {
      this.productId = value;
    });
  }
}