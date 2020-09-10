import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '../../../../services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';

import {TermSheetService} from '../../services/terms-sheet.service';
import { LoginStoreService } from '@services/login-store.service';
@Component({
  selector: 'app-term-sheet-from-dashboard',
  templateUrl: './term-sheet-from-dashboard.component.html',
  styleUrls: ['./term-sheet-from-dashboard.css']
})
export class TermSheetFromDashboardComponent implements OnInit {
  labels: any = {};
 
  leadId;
  roleType: any;
  roleId: any;
  isApprove:boolean = true
  roleAndUserDetails: any;
  constructor(
     public labelsService: LabelsService,
     private activatedRoute: ActivatedRoute,
     private utilityService: UtilityService,
     private router: Router,
     private toasterService: ToasterService,
     public termSheetService : TermSheetService,
     private loginStoreService: LoginStoreService,
    ) {
      this.isApprove = true;
     }
  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels);
    });
  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }else{
          resolve(null);

        }
      });
    });
  }

 
  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    console.log( this.leadId);
  }
  




}
