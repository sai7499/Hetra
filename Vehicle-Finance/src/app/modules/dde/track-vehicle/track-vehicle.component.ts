import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { TrackVechileService } from "./track-vechile.service";
import { UtilityService } from '@services/utility.service';
//import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {

  labels: any = {};
  values: any = [];
  totalExcesssOrShort: number = 0;
  fleetRtrDetails: any = [];
  emiAmount: any;
  loanEmiDate: any;
  noOfEmi: any;
  fleetId: number;
  public trackVehicleForm: FormGroup;
  leadId: number;
  constructor(
    private trackVechileService: TrackVechileService,
    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private utilityService: UtilityService,
    private location: Location,
    private actRoute: ActivatedRoute
  ) { }
async getId(){
  this.leadId = (await this.getLeadId()) as number;

}

  async ngOnInit() {
    let state = this.location.getState();
    this.getId();
    console.log("leadID =>", this.leadId)
    this.fleetId = parseInt(this.actRoute.snapshot.params.id);
    console.log(this.actRoute);
    if (this.fleetId != null && this.fleetId != undefined) {
      this.getFleetRtr(this.fleetId)
    }


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
      clientName: new FormControl('' ),
      financierName: new FormControl('' ),
      assetFinancied: new FormControl(''),
      repaymentMode: new FormControl(''),
      financeAmount: new FormControl({ value: '200000', disabled: true }),
      financeCharges: new FormControl(''),
      contractValue: new FormControl(''),
      contNo: new FormControl(''),
      vehicleNo: new FormControl(''),
      financeType: new FormControl(''),
      accountStatus: new FormControl(''),
      loanStartDate: new FormControl(''),
      loanMaturityDate: new FormControl('' || ''),
      count30: new FormControl({ value: '' || '0', disabled: true }),
      count90: new FormControl({ value: '' || '0', disabled: true }),
      totalEmi: new FormControl('' ),
      noOfEmisPaid: new FormControl('' ),
      balanceTenor: new FormControl({ value: '0', disabled: true }),
      totalDelay: new FormControl({ value: '4.00', disabled: true }),
      peakDelay: new FormControl({ value: '4.00', disabled: true }),
      avgDelay: new FormControl({ value: '4.00', disabled: true }),
      trackStatus: new FormControl({ value: '4.00', disabled: true }),
      totalAmtPaid: new FormControl({ value: '20000', disabled: true }),
      emiPaid: new FormControl(3254),
      emiAmount: new FormControl(''),
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
    if (Math.floor(fullmonth / 12) >= 1 && fullmonth % 12 != 0) {
      year = year + Math.floor(fullmonth / 12);
    }
    if (fullmonth > 0 && fullmonth <= 12) {
      month = fullmonth;
    } else if (fullmonth > 12 && fullmonth % 12 != 1 && fullmonth % 12 != 0) {
      month = 0 + (fullmonth % 12);
    } else if (fullmonth >= 12 && fullmonth % 12 == 1) {
      month = 1;
    }
    if (fullmonth >= 12 && fullmonth % 12 == 0) {
      // year = year + Math.floor(month/12);
      month = 12;
    }
    if (month == 12) {
      year = (year + Math.floor(fullmonth / 12)) - 1;
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
  loanStartDate(event) {
    const confirmed = confirm("Are you sure to change EMI amount");
    if (confirmed) {
      this.loanEmiDate = this.dateDbFormat(event.target.value)
      this.formArr.controls = [];
      let addDueDate = this.dateDbFormat(event.target.value);
      if(this.fleetRtrDetails){
        for (let i = 0; i < this.noOfEmi; i++) {
          if (i < this.fleetRtrDetails.length) {
            if (i == 0) {
              this.fleetRtrDetails[i].dueDate = addDueDate;
              if(this.fleetRtrDetails[i]['receivedDate'] != ""){
                this.fleetRtrDetails[i].delayDays = this.dateDiff(this.fleetRtrDetails[i].dueDate, this.fleetRtrDetails[i]['receivedDate']);

              }
              this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
            }
            else {
              let addDueDate2 = this.addMonth(addDueDate, i)
              this.fleetRtrDetails[i].dueDate = addDueDate2;
              this.fleetRtrDetails[i].delayDays = this.dateDiff(this.fleetRtrDetails[i].dueDate, this.fleetRtrDetails[i]['receivedDate']);
              this.addNewRow(this.fleetRtrDetails[i]);
            }
          } else {
          let dueDate1 = this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])

            let rowData = {
              installmentAmt: this.trackVehicleForm.value['emiAmount'],
              dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
            }
            if(this.fleetRtrDetails.length == 0){
              this.fleetRtrDetails.push({
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: dueDate1
              })
            } else{

              let addDueDate2 = this.addMonth(dueDate1, i)
              this.fleetRtrDetails.push({
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: addDueDate2
               })
               rowData = {
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: addDueDate2
                }
            }
           
            this.formArr.push(this.initRows(rowData));
          }
        }
      }else{
        
        let rowData = {
          installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
        }
        this.fleetRtrDetails.push({
          installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
        })
        this.formArr.push(this.initRows(rowData));    
        }
      
    } else {
      this.trackVehicleForm.controls['loanStartDate'].setValue(this.loanEmiDate);
    }

  }
  emaiAmount(event) {
    console.log(event);
    const confirmed = confirm("Are you sure to change EMI amount");
    if (confirmed) {
      this.emiAmount = event.target.value;
      this.formArr.controls = [];
      let emiAmount = event.target.value;
      for (let i = 0; i < this.noOfEmi; i++) {
        if (i < this.fleetRtrDetails.length) {
          this.fleetRtrDetails[i].installmentAmt = emiAmount;
        } else {

        }
      }
      this.paymentExcessOrShort(null, 0)
    } else {
      this.trackVehicleForm.controls['emiAmount'].setValue(this.emiAmount);

    }

  }
  noOfPaidEmis(event) {
    console.log(event);
    const confirmed = confirm("Are you sure to change EMI amount");
    if (confirmed) {
      this.formArr.controls = [];
      this.noOfEmi = parseInt(event.target.value)
      let data = {};
      data['target'] ={
        value: this.trackVehicleForm.controls['loanStartDate'].value
      } 
      this.loanStartDate(data)
      // this.noOfEmi = parseInt(event.target.value);
      // for (let i = 0; i < this.noOfEmi; i++) {
      //   if (i < this.fleetRtrDetails.length) {
      //     if (i == 0) {
      //       this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
      //     }
      //     else {
      //       this.addNewRow(this.fleetRtrDetails[i]);
      //     }
      //   } else {
      //     let rowData = {
      //       installmentAmt: this.trackVehicleForm.value['emiAmount'],
      //       dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
      //     }
      //     this.formArr.push(this.initRows(rowData));
      //   }
      // }
    } else {
      this.trackVehicleForm.controls['noOfEmisPaid'].setValue(this.noOfEmi);

    }
  }
  get formArr() {
    return this.trackVehicleForm.get('installment') as
      FormArray;
  }

  getFleetRtr(fleetId) {
    this.trackVechileService.getFleetRtr(fleetId).subscribe((res) => {

      if (res['Status'] == "Execution Completed") {
        const installments = res['ProcessVariables'].installment;
        let noOfEmi = parseInt(this.trackVehicleForm.controls['noOfEmisPaid'].value)
        if (installments) {
          noOfEmi = installments.length;
        this.fleetRtrDetails = res['ProcessVariables'].installment;
          for (let i = 0; i < noOfEmi; i++) {

            if (i < installments.length) {
              if (i == 0) {
                installments[i]['dueDate'] = this.getDateFormat(installments[i]['dueDate'])
                installments[i]['receivedDate'] = this.getDateFormat(installments[i]['receivedDate'])

                this.formArr.push(this.initRows(installments[i]));
              }
              else {
                installments[i]['dueDate'] = this.getDateFormat(installments[i]['dueDate'])
                installments[i]['receivedDate'] = this.getDateFormat(installments[i]['receivedDate'])
                this.addNewRow(installments[i]);
              }
            } else {
              let rowData = {
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: this.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
              }
              this.formArr.push(this.initRows(rowData));
            }
          }
        } else {
          this.formArr.push(this.initRows(null));
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
    //       let addDueDate = this.getDateFormat(this.trackVehicleForm.value['loanStartDate']);
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
    //       let addDueDate = this.getDateFormat(this.trackVehicleForm.value['loanStartDate']);
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
  receiptNumber(event ,i){
    this.fleetRtrDetails[i]['receiptNo'] = event.target.value;
  }
  delayDays(event, i, rowData) {
    console.log(event);
    const dueDate = new Date(this.trackVehicleForm.value['installment'][i]['dueDate']);
    const recDate = new Date(event.target.value);
    let delayedDays = (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
    this.trackVehicleForm.value['installment'][i]['delayDays'] = delayedDays;
    rowData.value['paymentExcess'] = this.formArr.controls[i]['controls']['paymentExcess'].value
    rowData.value['dueDate'] = this.formArr.controls[i]['controls']['dueDate'].value

      rowData.value['delayDays'] = delayedDays;
      this.fleetRtrDetails[i]['receivedDate'] = this.dateDbFormat(event.target.value);
      this.fleetRtrDetails[i]['delayDays'] = delayedDays

    this.formArr['controls'].splice(i, 1, this.initRows(rowData.value))
  }
  dateDiff(d1, d2) {
    const dueDate = new Date(d1);
    const recDate = new Date(d2);
    return (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
  }
  paymentExcessOrShort(event, index) {
    let toalExcess = 0;
    let installmentAmount = 0;
    let receivedAmt = 0;
    if(this.fleetRtrDetails){
      if (event != null && index < this.fleetRtrDetails.length) {
        this.fleetRtrDetails[index].receivedAmt = parseInt(event.target['value']);
      } else if (event != null && index >= this.fleetRtrDetails.length) {
        this.fleetRtrDetails.push({
          'receivedAmt': parseInt(event.target['value']),
          'installmentAmt': parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value),
        })
      }
    }else{  
      receivedAmt = parseInt(this.formArr.controls[index]['controls']['receivedAmt'].value);
      installmentAmount =  parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value)
      
      this.fleetRtrDetails.push({
        'receivedAmt': parseInt(this.formArr.controls[0].value['receivedAmt']),
        'installmentAmt': parseInt(this.formArr.controls[0].value['installmentAmt']),
        'receiptNo': parseInt(this.formArr.controls[0].value['receiptNo']),
        'dueDate': this.formArr.controls[0].value['dueDate'],
        'receivedDate': this.formArr.controls[0].value['receivedDate'],
        'paymentExcess' : receivedAmt - installmentAmount
      });
 //     this.fleetRtrDetails[0]['paymentExcess'] = receivedAmt - installmentAmount;
      this.formArr.push(this.initRows(this.fleetRtrDetails[0]));
    }
  
   
    this.formArr.controls = [];
    for (let i = 0; i < this.noOfEmi; i++) {
      if (i < this.fleetRtrDetails.length) {
        installmentAmount = installmentAmount + parseInt(this.fleetRtrDetails[i].installmentAmt);
        if(this.fleetRtrDetails[i].receivedAmt){
          receivedAmt = receivedAmt + parseInt(this.fleetRtrDetails[i].receivedAmt);
          toalExcess = receivedAmt - installmentAmount;
          this.fleetRtrDetails[i].paymentExcess = toalExcess;
        }
        
        if (i == 0) {
          
          this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
        }
        else {
          this.addNewRow(this.fleetRtrDetails[i]);
        }
      } else {
        let rowData = {
          installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
        }
        this.formArr.push(this.initRows(rowData));
      }

    }
  }
  getDateFormat(date) {
    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(month + '/' + day + '/' + year);
    year = dateFormat.getFullYear();
    month = Number(dateFormat.getMonth()) + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
   const formattedDate = year + '-' + month1 + '-' + day;
  //   const formattedDate = day + '-' + month1 + '-' + year;
    return formattedDate;
  }

  dateDbFormat(date){
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
     const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '-' + month1 + '-' + year;
    return formattedDate;
  }

  sendDate(date) {
    const dateFormat: Date = new Date(date);
    let year = dateFormat.getFullYear();
    let month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + "/" + month1 + "/" + year;
    return formattedDate;

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
    console.log(rowData);
    if (rowData) {
      return this.fb.group({
        id: [rowData.id],
        installmentAmt: [rowData.installmentAmt],
        dueDate: [rowData.dueDate ? rowData.dueDate : ''],
        receiptNo: [rowData.receiptNo ? rowData.receiptNo : ''],
        receivedDate: [rowData.receivedDate ? this.dateDbFormat(rowData.receivedDate) : ''],
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
    this.trackVehicleForm.value['loanStartDate'] = this.sendDate(this.trackVehicleForm.controls['loanStartDate'].value);
    this.trackVehicleForm.value['loanMaturityDate'] = this.sendDate(this.trackVehicleForm.controls['loanMaturityDate'].value);

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
      this.trackVehicleForm.value['installment'][i]['dueDate'] = this.sendDate(this.formArr.controls[i]['controls']['dueDate'].value);
      this.trackVehicleForm.value['installment'][i]['receivedDate'] = this.sendDate(this.formArr.controls[i]['controls']['receivedDate'].value);

      this.trackVehicleForm.value['installment'][i]['receiptNo'] = parseInt(this.formArr.controls[i]['controls']['receiptNo'].value);
      this.trackVehicleForm.value['installment'][i]['delayDays'] = parseInt(this.formArr.controls[i]['controls']['delayDays'].value);
      this.trackVehicleForm.value['installment'][i]['paymentExcess'] = parseInt(this.formArr.controls[i]['controls']['paymentExcess'].value);
    }
    this.trackVechileService.saveUpdateFleetRtr(this.trackVehicleForm.value, this.trackVehicleForm.value['installment'] , this.fleetId, this.leadId).subscribe((res: any) => {
      console.log(res);
      if (res['Error'] == "0") {
        alert("Saved Success");
        this.router.navigate(['/pages/dde/'+this.leadId +'/fleet-details']);
      }
    });
  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.actRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }
}