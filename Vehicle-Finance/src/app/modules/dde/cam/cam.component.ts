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

  constructor(private labelsData: LabelsService,
    private camService : CamService,
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

  getCamDetails(){
    const data = {
      leadId: this.leadId,
    };
   this.camService.getCamDetails(data).subscribe((res:any)=>{
     console.log(res)
     this.basicDetails = res.ProcessVariables['basicDetailsObj'];
     console.log('basic cam details...>',this.basicDetails)
     this.sourcingDetails = res.ProcessVariables['sourcingObj'];
     console.log('sourcing details...>',this.sourcingDetails)
     this.proposedVehicleDetails = res.ProcessVariables['proposedVehiclesObj'];
     console.log('proposedVehicleDetails ...>',this.proposedVehicleDetails)
     this.partyToAgreement = res.ProcessVariables['partyToAgreementObj'];
     console.log('partyToAgreement ...>',this.partyToAgreement)

     

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
