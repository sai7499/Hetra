import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { TrackVechileService } from "./track-vechile.service";
@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};
  values: any = [];

  public trackVehicleForm: FormGroup;

  constructor(
    private trackVechileService: TrackVechileService,
    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService

  ) { }

  ngOnInit() {
    this.getFleetRtr()
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].trackVehicle[0];
    });

    this.labelsData.getLabelsFleetData().subscribe(

      data => {
        this.labels = data;
      }, error => {
        console.log(error);

      });
    this.trackVehicleForm = this.fb.group({
      clientName: new FormControl('' || 'Deepika'),
      financierName: new FormControl('' || 'Bajaj'),
      assetFinancied: new FormControl('' || 'TATA ACE M100'),
      repaymentMode: new FormControl(''),
      financeAmount: new FormControl({ value: '200000', disabled: true }),
      financeCharges: new FormControl('' || '40000'),
      contractValue: new FormControl(''),
      contNo: new FormControl(''),
      vehicleNo: new FormControl('' || 'TN011234'),
      financeType: new FormControl(''),
      accountStatus: new FormControl(''),
      loanStartDate: new FormControl('' || ''),
      loanMaturityDate: new FormControl('' || ''),
      count30: new FormControl({ value: '' || '0', disabled: true }),
      count90: new FormControl({ value: '' || '0', disabled: true }),
      totalEmi: new FormControl('' || '12'),
      noOfEmisPaid: new FormControl('' || '6'),
      balanceTenor: new FormControl({ value: '0', disabled: true }),
      totalDelay: new FormControl({ value: '4.00', disabled: true }),
      peakDelay: new FormControl({ value: '4.00', disabled: true }),
      avgDelay: new FormControl({ value: '4.00', disabled: true }),
      trackStatus: new FormControl({ value: '4.00', disabled: true }),
      totalAmtPaid: new FormControl({ value: '20000', disabled: true }),
      emiPaid: new FormControl(3254),
      installment: this.fb.array([])

    });
  }

  get formArr() {
    return this.trackVehicleForm.get('installment') as
      FormArray;
  }

  getFleetRtr() {
    this.trackVechileService.getFleetRtr().subscribe((res) => {

      if (res['Status'] == "Execution Completed") {
        const installments = res['ProcessVariables'].installment;
        for (let i = 0; i < installments.length; i++) {
          if (i == 0) {
            this.formArr.push(this.initRows(installments[i]));
          }
          else {
            this.addNewRow(installments[i]);
          }
        }
      } else {
        this.formArr.push(this.initRows(null));
      }
    })
  }

  initRows(rowData) {
    if (rowData) {
      return this.fb.group({
        id: [rowData.id],
        installmentAmt: [rowData.installmentAmt],
        dueDate: [rowData.dueDate],
        receiptNo: [rowData.receiptNo],
        receivedDate: [rowData.receivedDate],
        receivedAmt: [rowData.receivedAmt],
        delayDays: [{ value: rowData.delayDays, disabled: true }],
        paymentExcess: [{ value: rowData.paymentExcess, disabled: true }]

      });
    } else {
      return this.fb.group({
        id: [],
        installmentAmt: [''],
        dueDate: [''],
        receiptNo: [''],
        receivedDate: [''],
        receivedAmt: [''],
        delayDays: [{ value: '', disabled: true }],
        paymentExcess: [{ value: '', disabled: true }]

      });
    }
  }

  addNewRow(rowData) {
    this.formArr.push(this.initRows(rowData));
  }

  deleteRow(index: number, item) {
    if (item.value['id'] != null || item.value['id'] != undefined) {
      this.trackVechileService.deleteFleetRtr(item.value['id']).subscribe((res) => {
        this.formArr.removeAt(index);
      })
    } else {
      this.formArr.removeAt(index);
    }
  }

  onFormSubmit() {

    this.trackVehicleForm.value['financeAmount'] = parseInt(this.trackVehicleForm.controls['financeAmount'].value)
    this.trackVehicleForm.value['financeCharges'] = parseInt(this.trackVehicleForm.controls['financeCharges'].value);
    this.trackVehicleForm.value['contractValue'] = parseInt(this.trackVehicleForm.controls['contractValue'].value);
    this.trackVehicleForm.value['totalEmi'] = parseInt(this.trackVehicleForm.controls['totalEmi'].value);

    this.trackVehicleForm.value['thirtyDpdCount'] = parseInt(this.trackVehicleForm.controls['count30'].value);
    this.trackVehicleForm.value['ninetyDpdCount'] = parseInt(this.trackVehicleForm.controls['count90'].value);
    this.trackVehicleForm.value['balanceTenor'] = parseInt(this.trackVehicleForm.controls['balanceTenor'].value);
    this.trackVehicleForm.value['totalDelay'] = parseInt(this.trackVehicleForm.controls['totalDelay'].value);
    this.trackVehicleForm.value['peakDelay'] = parseInt(this.trackVehicleForm.controls['peakDelay'].value);
    this.trackVehicleForm.value['avgDelay'] = parseInt(this.trackVehicleForm.controls['avgDelay'].value);
    this.trackVehicleForm.value['trackStatus'] = parseInt(this.trackVehicleForm.controls['trackStatus'].value);
    this.trackVehicleForm.value['totalAmtPaid'] = parseInt(this.trackVehicleForm.controls['totalAmtPaid'].value);
    for (let i = 0; i < this.formArr.length; i++) {
      this.trackVehicleForm.value['installment'][i]['receivedAmt'] = parseInt(this.formArr.controls[i]['controls']['receivedAmt'].value);
      this.trackVehicleForm.value['installment'][i]['installmentAmt'] = parseInt(this.formArr.controls[i]['controls']['installmentAmt'].value);

      this.trackVehicleForm.value['installment'][i]['receiptNo'] = parseInt(this.formArr.controls[i]['controls']['receiptNo'].value);
      this.trackVehicleForm.value['installment'][i]['delayDays'] = parseInt(this.formArr.controls[i]['controls']['delayDays'].value);
      this.trackVehicleForm.value['installment'][i]['paymentExcess'] = parseInt(this.formArr.controls[i]['controls']['paymentExcess'].value);
    }
    this.trackVechileService.saveUpdateFleetRtr(this.trackVehicleForm.value, this.trackVehicleForm.value['installment']).subscribe((res: any) => {
    });
  }
}