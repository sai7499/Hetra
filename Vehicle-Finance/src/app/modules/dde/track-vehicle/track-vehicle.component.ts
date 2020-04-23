import { Component, OnInit } from '@angular/core';

import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};
  public trackVehicleForm: FormGroup;
  // public trackVehicleTable : FormGroup;


  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder

  ) { }

  ngOnInit() {

    this.labelsData.getLabelsFleetData().subscribe(

      data => {
        this.labels = data;
        // console.log('labels', this.labels)
      },

      error => {
        console.log(error);

      });
    this.trackVehicleForm = this.fb.group({
      client: new FormControl(''),
      financier: new FormControl(''),
      assetFinanced: new FormControl(''),
      paymentMode: new FormControl(''),
      financeAmount: new FormControl({ value: '', disabled: true }),
      financeCharges: new FormControl(''),
      contractValue: new FormControl(''),
      contNo: new FormControl(''),
      vehicleNo: new FormControl(''),
      typesOfFinance: new FormControl(''),
      accountStatus: new FormControl(''),
      loanStartDate: new FormControl(''),
      loanMaturityDate: new FormControl(''),
      count30: new FormControl({ value: '', disabled: true }),
      count90: new FormControl({ value: '', disabled: true }),
      totalNoOfEmis: new FormControl(''),
      noOfEmisPaid: new FormControl(''),
      balanceTenor: new FormControl({ value: '', disabled: true }),
      totalDelay: new FormControl({ value: '', disabled: true }),
      peakDelay: new FormControl({ value: '', disabled: true }),
      avgDelay: new FormControl({ value: '', disabled: true }),
      trackStatus: new FormControl({ value: '', disabled: true }),
      totalAmtPaid: new FormControl({ value: '', disabled: true }),
      Rows: this.fb.array([this.initRows()])
      // Rows: this.fb.array([this.fb.group({


      //   installmentNo: [''],
      //   installmentAmt: [''],
      //   dueDate: [''],
      //   rcptNo: [''],
      //   recdDate: [''],
      //   rcptAmount: [''],
      //   delayDays: [{ value: '', disabled: true }],
      //   paymentsExcess: [{ value: '', disabled: true }]


      // })])
     

    });
    // this.addNewRow();
    // console.warn(this.trackVehicleForm.value);
  }

  get formArr() {
    return this.trackVehicleForm.get('Rows') as
      FormArray;
  }



  initRows() {
    return this.fb.group({
      installmentNo: [''],
      installmentAmt: [''],
      dueDate: [''],
      rcptNo: [''],
      recdDate: [''],
      rcptAmount: [''],
      delayDays: [{ value: '', disabled: true }],
      paymentsExcess: [{ value: '', disabled: true }]

    });
  }

  addNewRow() {

    this.formArr.push(this.initRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

}