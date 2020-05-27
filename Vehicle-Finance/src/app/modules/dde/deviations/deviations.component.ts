import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";

import { LabelsService } from "src/app/services/labels.service";
@Component({
  selector: 'app-deviations',
  templateUrl: './deviations.component.html',
  styleUrls: ['./deviations.component.css']
})
export class DeviationsComponent implements OnInit {
  labels: any = {};
  deviationsForm: FormGroup;
  constructor(private labelsData: LabelsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );
    this.deviationsForm = this.formBuilder.group({
      manualDeviations: this.formBuilder.array([this.getManualDeviations()]),
      bcmJustification: [""  ],
      bcmApproveAction: ["" ],
      bcmReferAction: ["" ],
      bcmDeclineAction: ["" ],
      acmJustification: [""  ],
      acmApproveAction: ["" ],
      acmReferAction: ["" ],
      acmDeclineAction: ["" ],
      ncmJustification: [""  ],
      ncmApproveAction: ["" ],
      ncmReferAction: ["" ],
      ncmDeclineAction: ["" ],

    });
  }
  private getManualDeviations() {
    return this.formBuilder.group({
      manualDeviationOne: ["" || "Deviation " ],
      approvalLevelOne: ["" ],
      manualJustficationOne: ["" ],
      approveAction: ["" ],
      referAction: ["" ],
      declineAction: ["" ],
    });
  }
  addDeviationUnit() {
    const control = this.deviationsForm.controls.manualDeviations as FormArray;
    control.push(this.getManualDeviations());
  }
  removeDeviationIndex(i?: any) {
    const control = this.deviationsForm.controls.manualDeviations as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert("Atleast One Row Required");
    }
  }
}
