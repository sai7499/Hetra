import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { TrackVechileService } from "./track-vechile.service";
import { UtilityService } from '@services/utility.service';
@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};
  values: any = [];
  totalExcesssOrShort: number = 0;
  fleetRtrDetails: any = {};
  emiAmount: any;
  loanEmiDate:any;
  noOfEmi: any;
  public trackVehicleForm: FormGroup;

  constructor(
    private trackVechileService: TrackVechileService,
    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private utilityService: UtilityService
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
      loanStartDate: new FormControl(this.utilityService.getDateFormat('3-may-2018')),
      loanMaturityDate: new FormControl('' || ''),
      count30: new FormControl({ value: '' || '0', disabled: true }),
      count90: new FormControl({ value: '' || '0', disabled: true }),
      totalEmi: new FormControl('' || '12'),
      noOfEmisPaid: new FormControl('' || '26'),
      balanceTenor: new FormControl({ value: '0', disabled: true }),
      totalDelay: new FormControl({ value: '4.00', disabled: true }),
      peakDelay: new FormControl({ value: '4.00', disabled: true }),
      avgDelay: new FormControl({ value: '4.00', disabled: true }),
      trackStatus: new FormControl({ value: '4.00', disabled: true }),
      totalAmtPaid: new FormControl({ value: '20000', disabled: true }),
      emiPaid: new FormControl(3254),
      emiAmount: new FormControl('' || '1000'),
      installment: this.fb.array([])
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
    this.addRows(null);
    console.log()
    this.emiAmount = this.trackVehicleForm.controls['emiAmount'].value;
    this.loanEmiDate = this.trackVehicleForm.controls['loanStartDate'].value;
    this.noOfEmi = this.trackVehicleForm.controls['noOfEmisPaid'].value;
  }
  addMonth(date, n) {
   // console.log('in date conversion ' + date);
    const dateFormat: Date = new Date(date);
    let year = Number(dateFormat.getFullYear());
    let month = Number(dateFormat.getMonth()) + 1;
    let fullmonth = month + n;
    if(Math.floor(fullmonth/12) >=1  && fullmonth % 12 != 0){
      year = year + Math.floor(fullmonth/12);
    }
    if(fullmonth >0 && fullmonth <= 12){
      month = fullmonth;
    }else if (fullmonth > 12 && fullmonth % 12 != 1 && fullmonth % 12 != 0) {
      month = 0 + (fullmonth % 12);
    }else if(fullmonth >= 12 && fullmonth % 12 == 1){
      month = 1;
    } 
     if(fullmonth >= 12 && fullmonth % 12 == 0){
     // year = year + Math.floor(month/12);
      month = 12;
    }
    if(month == 12){
      year = (year + Math.floor(fullmonth/12)) - 1;
    }
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    // console.log('final Value ' + formattedDate);
    // console.log('month' + month);
    // console.log('year' + year);
    return formattedDate;
  }
  loanStartDate(event){
    const confirmed = confirm("Are you sure to change EMI amount");
    if(confirmed){
      this.loanEmiDate = this.utilityService.getDateFormat(event.target.value)
      this.formArr.controls = [];
      let addDueDate = this.utilityService.getDateFormat(event.target.value);
      for (let i = 0; i < this.noOfEmi; i++) {
        if(i < this.fleetRtrDetails.length ){
          if (i == 0) {
            this.fleetRtrDetails[i].dueDate = addDueDate;
            this.fleetRtrDetails[i].delayDays =  this.dateDiff(this.fleetRtrDetails[i].dueDate ,this.fleetRtrDetails[i]['receivedDate']);
            this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
          }
          else {
           let addDueDate2 = this.addMonth(addDueDate, i)
            this.fleetRtrDetails[i].dueDate = addDueDate2;
            this.fleetRtrDetails[i].delayDays =  this.dateDiff(this.fleetRtrDetails[i].dueDate ,this.fleetRtrDetails[i]['receivedDate']);
            this.addNewRow(this.fleetRtrDetails[i]);
          }
        } else{
          let rowData = {
            installmentAmt: this.trackVehicleForm.value['emiAmount'],
            dueDate: this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
                }
          this.formArr.push(this.initRows(rowData));
        }    
      }
    }else{
      this.trackVehicleForm.controls['loanStartDate'].setValue(this.loanEmiDate);
    }
 
  }
  emaiAmount(event){
    console.log(event);
    const confirmed = confirm("Are you sure to change EMI amount");
    if(confirmed){
      this.emiAmount = event.target.value;
      this.formArr.controls = [];
      let emiAmount = event.target.value;
      for (let i = 0; i < this.noOfEmi; i++) {  
        if(i < this.fleetRtrDetails.length ){
          this.fleetRtrDetails[i].installmentAmt = emiAmount;
        }else{

        }
      }
      this.paymentExcessOrShort(null , 0)
    }else{
      this.trackVehicleForm.controls['emiAmount'].setValue(this.emiAmount);

    }
   
  }
  noOfPaidEmis(event){
    console.log(event);
    const confirmed = confirm("Are you sure to change EMI amount");
    if(confirmed){
      this.formArr.controls = [];
      this.noOfEmi = parseInt(event.target.value);
      for (let i = 0; i < this.noOfEmi; i++) {
        if(i < this.fleetRtrDetails.length ){
          if (i == 0) {
            this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
          }
          else {
            this.addNewRow(this.fleetRtrDetails[i]);
          }
        }else{
          let rowData = {
              installmentAmt: this.trackVehicleForm.value['emiAmount'],
              dueDate: this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
                  }
            this.formArr.push(this.initRows(rowData));
        }
      }
    }else{
      this.trackVehicleForm.controls['noOfEmisPaid'].setValue(this.noOfEmi);

    }
  }
  get formArr() {
    return this.trackVehicleForm.get('installment') as
      FormArray;
  }

  getFleetRtr() {
    this.trackVechileService.getFleetRtr().subscribe((res) => {

      if (res['Status'] == "Execution Completed") {
        const installments = res['ProcessVariables'].installment;
        this.fleetRtrDetails = res['ProcessVariables'].installment;
        let noOfEmi = parseInt(this.trackVehicleForm.controls['noOfEmisPaid'].value)
        for (let i = 0; i < noOfEmi; i++) {
          if(i < installments.length ){
            if (i == 0) {
              this.formArr.push(this.initRows(installments[i]));
            }
            else {
              this.addNewRow(installments[i]);
            }
          }else{
            let rowData = {
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
                    }
              this.formArr.push(this.initRows(rowData));
          }
        }
      } else {
        this.formArr.push(this.initRows(null));
      }
    })
  }
  addRows(Data) {
  //   const noOfRows = parseInt(this.trackVehicleForm.controls['noOfEmisPaid'].value);
  // if(Data != null ){
  //   if (noOfRows) {
  //     for (let i = 0; i < noOfRows; i++) {
  //       let addDueDate = this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate']);
  //       if (i > 0) {
  //         addDueDate = this.addMonth(addDueDate, i)
  //       }
  //       let rowData = {
  //         installmentAmt: this.trackVehicleForm.value['emiAmount'],
  //         dueDate: addDueDate
  //       }
  //       this.formArr.push(this.initRows(rowData));
  //     }

  //   }
  // } else {
  //   if (noOfRows) {
  //     for (let i = 0; i < noOfRows; i++) {
  //       let addDueDate = this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate']);
  //       if (i > 0) {
  //         addDueDate = this.addMonth(addDueDate, i)
  //       }
  //       let rowData = {
  //         installmentAmt: this.trackVehicleForm.value['emiAmount'],
  //         dueDate: addDueDate
  //       }
  //       this.formArr.push(this.initRows(rowData));
  //     }

  //   }
 // }
 
  }
  delayDays(event, i, rowData) {
    console.log(event);
    const dueDate = new Date(this.trackVehicleForm.value['installment'][i]['dueDate']);
    const recDate = new Date(event.target.value);
    let delayedDays = (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
    this.trackVehicleForm.value['installment'][i]['delayDays'] = delayedDays;
    rowData.value['paymentExcess'] = this.formArr.controls[i]['controls']['paymentExcess'].value
    rowData.value['delayDays'] = delayedDays;
    this.formArr['controls'].splice(i, 1, this.initRows(rowData.value))
  }
  dateDiff(d1,d2){
    const dueDate = new Date(d1);
    const recDate = new Date(d2);
    return (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
  }
  paymentExcessOrShort(event, index) {
    let toalExcess = 0;
    let installmentAmount = 0;
    let receivedAmt = 0;
    if(event != null && index < this.fleetRtrDetails.length ){
      this.fleetRtrDetails[index].receivedAmt = parseInt(event.target['value']);
    }else if(event != null && index >= this.fleetRtrDetails.length){
      this.fleetRtrDetails.push({'receivedAmt' : parseInt(event.target['value']),
                                  'installmentAmt' : parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value)})
    }
    this.formArr.controls = [];
    for (let i = 0; i < this.noOfEmi; i++) {
      if(i < this.fleetRtrDetails.length ){
        installmentAmount = installmentAmount +parseInt(this.fleetRtrDetails[i].installmentAmt);
        receivedAmt= receivedAmt + parseInt(this.fleetRtrDetails[i].receivedAmt);
        toalExcess = receivedAmt - installmentAmount;  
        if (i == 0) {
          this.fleetRtrDetails[i].paymentExcess = toalExcess;
          this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
        }
        else {
          this.fleetRtrDetails[i].paymentExcess = toalExcess;
        this.addNewRow(this.fleetRtrDetails[i]);
        }
      } else{
        let rowData = {
          installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.utilityService.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
              }
        this.formArr.push(this.initRows(rowData));
      }
     
    }
}
  
  // paymentExcessCalc(installmentAmount , rcptAmount ){
  //   let balance =  rcptAmount - installmentAmount
  //   if(balance < 0){
  //       this.totalExcesssOrShort = this.totalExcesssOrShort + balance 
  //   }else{
  //     if(this.totalExcesssOrShort >= 0){    
  //       this.totalExcesssOrShort = balance + this.totalExcesssOrShort
  //     }else{
  //       this.totalExcesssOrShort = balance +  this.totalExcesssOrShort
  //     }
  //   }
  //   return this.totalExcesssOrShort;
  // }
  initRows(rowData) {
    if (rowData) {
      return this.fb.group({
        id: [rowData.id],
        installmentAmt: [rowData.installmentAmt],
        dueDate: [rowData.dueDate ? this.utilityService.getDateFormat(rowData.dueDate) : ''],
        receiptNo: [rowData.receiptNo ? rowData.receiptNo : ''],
        receivedDate: [rowData.receivedDate ? this.utilityService.getDateFormat(rowData.receivedDate) : ''],
        receivedAmt: [rowData.receivedAmt ],
        delayDays: [{ value: rowData.delayDays , disabled: true }],
        paymentExcess: [{ value: rowData.paymentExcess , disabled: true }]

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
      console.log(item.value);
      this.trackVechileService.deleteFleetRtr(item.value['id']).subscribe((res) => {
        console.log(res);
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
      console.log(res);
      if (res['Status'] == "Execution Completed") {
        alert("Saved Success");
      }
    });
  }
}