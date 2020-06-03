import { Component, OnInit } from '@angular/core';
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
  leadId: any;
  productId: any;
  productIdFromLead: any;

  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private loginStoreService: LoginStoreService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService
  ) { }

  ngOnInit() {
    this.getLabels();
    this.sharedService.leadData$.subscribe(value => {
      this.productId = value;
    });

    this.getUserDetails();

  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => this.labels = data,
      error => console.log(error)
    );
  }

  getUserDetails() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;

    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadId = (leadSectionData as any).leadId;

    this.sharedService.leadData$.subscribe(value => {
      this.productId = value;
    });




  }

}