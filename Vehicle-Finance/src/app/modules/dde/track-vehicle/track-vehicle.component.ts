import { Component, OnInit } from '@angular/core';

import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};
  values: any = [];

  public trackVehicleForm: FormGroup;
  // public trackVehicleTable : FormGroup;


  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,

  ) { }

  ngOnInit() {



    this.lovData.getLovData().subscribe((res: any) => {
      
      this.values = res[0].trackVehicle[0];
      // console.log(this.values.repaymentMode[0]);
    });

    this.labelsData.getLabelsFleetData().subscribe(

      data => {
        this.labels = data;
        // console.log('labels', this.labels)
      },

      error => {
        console.log(error);

      });
    this.trackVehicleForm = this.fb.group({
      client: new FormControl('' ||'Deepika'),
      financier: new FormControl('' || 'Bajaj'),
      assetFinanced: new FormControl(''||'TATA ACE M100'),
      paymentMode: new FormControl(''),
      financeAmount: new FormControl({ value: '200000', disabled: true }),
      financeCharges: new FormControl(''||'40000'),
      contractValue: new FormControl(''),
      contNo: new FormControl(''),
      vehicleNo: new FormControl(''||'TN011234'),
      typesOfFinance: new FormControl(''),
      accountStatus: new FormControl(''),
      loanStartDate: new FormControl(''||''),
      loanMaturityDate: new FormControl(''||''),
      count30: new FormControl({ value: ''|| '0', disabled: true }),
      count90: new FormControl({ value: '' || '0', disabled: true }),
      totalNoOfEmis: new FormControl(''||'12'),
      noOfEmisPaid: new FormControl(''||'6'),
      balanceTenor: new FormControl({ value: '0', disabled: true }),
      totalDelay: new FormControl({ value: '4.00', disabled: true }),
      peakDelay: new FormControl({ value: '4.00', disabled: true }),
      avgDelay: new FormControl({ value: '4.00', disabled: true }),
      trackStatus: new FormControl({ value: '4.00', disabled: true }),
      totalAmtPaid: new FormControl({ value: '20000', disabled: true }),
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
      installmentNo: ['' ],
      installmentAmt: [''|| '10000'],
      dueDate: ['' || '01-01-2018'],
      rcptNo: [''|| '1001'],
      recdDate: ['' || '05-01-2018'],
      rcptAmount: ['' || '10000'],
      delayDays: [{ value: '4', disabled: true }],
      paymentsExcess: [{ value: '0', disabled: true }]

    });
  }

  addNewRow() {

    this.formArr.push(this.initRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

}