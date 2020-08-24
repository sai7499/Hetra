import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-cheque-tracking',
  templateUrl: './cheque-tracking.component.html',
  styleUrls: ['./cheque-tracking.component.css']
})
export class ChequeTrackingComponent implements OnInit {
  labels: any = {};
  validationData: any;
  LOV: any = [];
  statusLov= [];
  status : any;

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
   
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLOV();
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      console.log('lov', this.LOV)
    });
  }
  onUpdate() {
    this.router.navigate([`/pages/dashboard`]);
  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

}
