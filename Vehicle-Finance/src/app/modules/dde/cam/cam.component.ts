import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CamService } from '@services/cam.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cam',
  templateUrl: './cam.component.html',
  styleUrls: ['./cam.component.css']
})
export class CamComponent implements OnInit {
  labels: any = {};
  leadId: number;
  basicDetails: any;
  sourcingDetails: any;
  proposedVehicleDetails: any;
  partyToAgreement: any;
  partyToAnyOtherRemarks: any;
  proposedToAnyOtherRemarks: any;
  cibilSynopsys: any;
  cibilSynopsysToAnyOtherRemark: any;
  bankingSummary: any;
  camDetails: any;
  fleetSummary: any;
  trackValidation: any;
  keyFinancial: any;
  creditOfficersRemarks: any;
  cmRecommendation: any;
  acmRecommendation: any;
  ncmBhApprovalRecommendation: any;

  constructor(private labelsData: LabelsService,
    private camService: CamService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
      }
    );
    this.getLeadId();
    this.getCamDetails();
  }

  getCamDetails() {
    const data = {
      leadId: this.leadId,
    };
    this.camService.getCamDetails(data).subscribe((res: any) => {
      console.log(res)
      this.camDetails = res.ProcessVariables
      this.basicDetails = res.ProcessVariables['basicDetailsObj'];
      this.sourcingDetails = res.ProcessVariables['sourcingObj'];
      this.proposedVehicleDetails = res.ProcessVariables['proposedVehiclesObj'];
      this.proposedToAnyOtherRemarks = res.ProcessVariables['proposedToAnyOtherRemarks']
      this.partyToAgreement = res.ProcessVariables['partyToAgreementObj'];
      this.partyToAnyOtherRemarks = res.ProcessVariables['partyToAnyOtherRemarks']
      this.cibilSynopsys = res.ProcessVariables['cibilSynopsysObj'];
      this.cibilSynopsysToAnyOtherRemark = res.ProcessVariables['cibilSynopsysToAnyOtherRemark']
      this.bankingSummary = res.ProcessVariables['bankingSummaryObj']
      this.fleetSummary = res.ProcessVariables['fleetSummaryObj']
      this.trackValidation = res.ProcessVariables['trackValidationObj']
      this.keyFinancial = res.ProcessVariables['keyFinancialObj']
      this.creditOfficersRemarks = res.ProcessVariables['creditOfficersRemarksObj']
      this.cmRecommendation = res.ProcessVariables['cmRecommendationObj']
      this.acmRecommendation = res.ProcessVariables['acmRecommendationObj']
      this.ncmBhApprovalRecommendation = res.ProcessVariables['ncmBhApprovalRecommendationObj']
this.proposedVehicleDetails.forEach(element => {
  console.log(element);
  
});




    })
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }
}
