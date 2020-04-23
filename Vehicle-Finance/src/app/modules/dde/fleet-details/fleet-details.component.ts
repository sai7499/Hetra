import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {

  public fleetForm: FormGroup;
  labels: any = {};


  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder

  ) { }


  ngOnInit() {


    this.fleetForm = this.fb.group(
      {
        Rows: this.fb.array([this.initRows()])
      }
    );

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
      regdNo: [''],
      regdOwner: [''],
      make: [''],
      yom: [''],
      financier: [''],
      loanNo: [''],
      purchaseDate: [''],
      tenure: [''],
      paid: [''],
      seasoning: [{value :"67%",disabled :true}],
      ad: [{value :"",disabled :true}],
      pd: [{value :"",disabled :true}],
      gridValue: [{value :"",disabled :true}]
    });
  }


  addNewRow() {
    this.formArr.push(this.initRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
}


