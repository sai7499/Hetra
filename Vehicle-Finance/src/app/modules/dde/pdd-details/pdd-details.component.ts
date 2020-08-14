import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { FormBuilder } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-pdd-details',
  templateUrl: './pdd-details.component.html',
  styleUrls: ['./pdd-details.component.css']
})
export class PddDetailsComponent implements OnInit {
  labels: any = {};
  pddDetailsForm : any;
  isDirty = false;

  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    
    this.getLabels();
    this.getLov();
    this.pddDetailsForm = this.formBuilder.group({
      documentName:[""],
      expectedDate:[""],
      documentNumber:[""],
      viewDocument:[""],
      collectedDate:[""],
      status:[""],
      cpcCheck:[""],
      physicalTrackingNumber:[""],
     
    })
  }
  // getting labels from labels.json
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (data) => {
        this.labels = data;
      },
      (error) => { }
    );
  }
  //getting LOV's from commonLovService
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log("values",value);
      
    });
  }
}
