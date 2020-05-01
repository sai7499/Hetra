import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {

  public fleetForm: FormGroup;
  labels: any = {};
  values: any = [];


  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,



  ) { }


  ngOnInit() {

    this.fleetForm = this.fb.group(
      {
        Rows: this.fb.array([this.initRows()])
      }
    );


    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].fleetDetails[0];
      // console.log(this.values.relation = this.values);
    });

    this.labelsData.getLabelsFleetData().subscribe(
      data => {
        this.labels = data;
        // console.log('labels', this.labels);
      },
      error => {
        console.log(error);

      });

  }

  get formArr() {
    return this.fleetForm.get('Rows') as
      FormArray;
  }

  initRows() {
    return this.fb.group({
      regdNo: ['' || 'TN01AA1234'],
      regdOwner: ['' || 'Deepika'],
      relation: [''],
      make: [''],
      yom: ['' || '2015'],
      financier: [''],
      loanNo: ['' || '4587'],
      purchaseDate: ['' || '2007-05-12'],
      tenure: ['' || '60'],
      paid: ['' || '40'],
      seasoning: [{ value: "67%", disabled: true }],
      ad: [{ value: "", disabled: true }],
      pd: [{ value: "", disabled: true }],
      gridValue: [{ value: "", disabled: true }]
    });
  }


  addNewRow() {
    this.formArr.push(this.initRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  onFormSubmit() {

    console.log('form values ', this.fleetForm.value.Rows[0])
  }
}


