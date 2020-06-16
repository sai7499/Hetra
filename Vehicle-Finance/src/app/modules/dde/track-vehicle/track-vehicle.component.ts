import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { TrackVechileService } from "./track-vechile.service";
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
//import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track-vehicle',
  templateUrl: './track-vehicle.component.html',
  styleUrls: ['./track-vehicle.component.css']
})
export class TrackVehicleComponent implements OnInit {
  submitted = false;
  labels: any = {};
  values: any = [];
  totalExcesssOrShort: number = 0;
  fleetRtrDetails: any = [];
  fleetDetails: any = {};
  emiAmount: any;
  loanEmiDate: any;
  noOfEmi: any;
  fleetId: number;
  fleetRtrLov: any = {};
  totalDelayDays: number;
  public trackVehicleForm: FormGroup;
  leadId: number;
  constructor(
    private trackVechileService: TrackVechileService,
    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private router: Router,
    private commonLovService: CommomLovService,
    private ddeStoreService: DdeStoreService,
    private utilityService: UtilityService,
    private location: Location,
    private actRoute: ActivatedRoute
  ) { }
  async getId() {
    this.leadId = (await this.getLeadId()) as number;

  }

  getLov() {

    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log(value);
      this.fleetRtrLov.fleetRepaymentMode = value.LOVS.fleetRepaymentMode;
      this.fleetRtrLov.typesOfFinance = value.LOVS.typesOfFinance;
      this.fleetRtrLov.accountStatus = value.LOVS.accountStatus;
    });

  }

  fleetRtrForm(fleetRtr) {
    if (fleetRtr) {
      this.trackVehicleForm = this.fb.group({
        clientName: new FormControl(fleetRtr.clientName),
        financierName: new FormControl(fleetRtr.financierName),
        assetFinancied: new FormControl(fleetRtr.assetFinancied),
        repaymentMode: new FormControl(fleetRtr.repaymentMode),
        financeAmount: new FormControl({ value: 200000, disabled: true }),
        financeCharges: new FormControl(fleetRtr.financeCharges),
        contractValue: new FormControl(fleetRtr.contractValue),
        contNo: new FormControl(fleetRtr.contNo),
        vehicleNo: new FormControl(fleetRtr.vehicleNo),
        financeType: new FormControl(fleetRtr.financeType),
        accountStatus: new FormControl(fleetRtr.accountStatus),
        loanStartDate: new FormControl(this.getDateFormat(fleetRtr.loanStartDate)),
        loanMaturityDate: new FormControl(this.getDateFormat(fleetRtr.loanMaturityDate)),
        thirtyDpdCount: new FormControl({ value: fleetRtr.thirtyDpdCount ? fleetRtr.thirtyDpdCount : 0, disabled: true }),
        ninetyDpdCount: new FormControl({ value: fleetRtr.ninetyDpdCount ? fleetRtr.ninetyDpdCount : 0, disabled: true }),
        noOfEmi: new FormControl(fleetRtr.noOfEmi),
        emisPaid: new FormControl(fleetRtr.emisPaid),
        balanceTenor: new FormControl({ value: fleetRtr.balanceTenor ? fleetRtr.balanceTenor : 0, disabled: true }),
        totalDelay: new FormControl({ value: fleetRtr.totalDelay ? fleetRtr.totalDelay : 0, disabled: true }),
        peakDelay: new FormControl({ value: fleetRtr.peakDelay ? fleetRtr.peakDelay : 0, disabled: true }),
        avgDelay: new FormControl({ value: fleetRtr.avgDelay ? fleetRtr.avgDelay : 0, disabled: true }),
        trackStatus: new FormControl({ value: fleetRtr.trackStatus ? fleetRtr.trackStatus : 0, disabled: true }),
        totalAmtPaid: new FormControl({ value: fleetRtr.totalAmtPaid ? fleetRtr.totalAmtPaid : 0, disabled: true }),
        emiPaid: new FormControl(fleetRtr.emiPaid),
        // emiAmount: new FormControl(1000),
        installment: this.fb.array([])
      });
      this.noOfEmi = this.trackVehicleForm.controls['emisPaid'].value;

    } else {
      this.trackVehicleForm = this.fb.group({
        clientName: new FormControl('' ),
        financierName: new FormControl(''),
        assetFinancied: new FormControl(''),
        repaymentMode: new FormControl(''),
        financeAmount: new FormControl({ value: 200000, disabled: true }),
        financeCharges: new FormControl(),
        contractValue: new FormControl(),
        contNo: new FormControl(),
        vehicleNo: new FormControl(''),
        financeType: new FormControl(''),
        accountStatus: new FormControl(''),
        loanStartDate: new FormControl(),
        loanMaturityDate: new FormControl(),
        thirtyDpdCount: new FormControl({ value:0, disabled: true }),
        ninetyDpdCount: new FormControl({ value:0, disabled: true }),
        noOfEmi: new FormControl(''),
        emisPaid: new FormControl(),
        balanceTenor: new FormControl({ value: 0, disabled: true }),
        totalDelay: new FormControl({  value: 0 ,disabled: true }),
        peakDelay: new FormControl({ value:0, disabled: true }),
        avgDelay: new FormControl({  value: 0, disabled: true }),
        trackStatus: new FormControl({ value: 0, disabled: true }),
        totalAmtPaid: new FormControl({ value: 0, disabled: true }),
        emiPaid: new FormControl(3254),
        // emiAmount: new FormControl(''),
        installment: this.fb.array([])
      });
    }


  }
  async ngOnInit() {
    this.getLov();
    let state = this.location.getState();
    this.getId();
    console.log("leadID =>", this.leadId)
    this.fleetId = parseInt(this.actRoute.snapshot.params.id);
    console.log(this.actRoute);
    if (this.fleetId != null && this.fleetId != undefined) {
      this.getFleetRtr(this.fleetId)
    }
    this.fleetRtrForm(null);

    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].trackVehicle[0];
    });

    this.labelsData.getLabelsFleetData().subscribe(

      data => {
        this.labels = data;
      }, error => {
        console.log(error);

      });
  //  this.addRows(null);
    //  this.emiAmount = this.trackVehicleForm.controls['emiAmount'].value;
    this.loanEmiDate = this.trackVehicleForm.controls['loanStartDate'].value;
    this.noOfEmi = this.trackVehicleForm.controls['emisPaid'].value;
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
    const formattedDate = new Date( year + '/' + month1 + '/' + day);
    return formattedDate;
  }
  loanStartDate(event) {
    const confirmed = confirm("Are you sure to loan start date");
    if (confirmed) {
      this.loanEmiDate = this.dateDbFormat(event)
      this.formArr.controls = [];
      let addDueDate = this.dateDbFormat(event);
      if (this.fleetRtrDetails && this.fleetRtrDetails.length != 0) {
        for (let i = 0; i < this.fleetRtrDetails.length; i++) {
          if (i < this.fleetRtrDetails.length) {
            if (i == 0) {
              this.fleetRtrDetails[i].dueDate = addDueDate;
              if (this.fleetRtrDetails[i]['receivedDate'] != "") {
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
              //   installmentAmt: this.trackVehicleForm.value['emiAmount'],
              dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
            }
            if (this.fleetRtrDetails.length == 0) {
              this.fleetRtrDetails.push({
                //  installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: dueDate1
              })
            } else {

              let addDueDate2 = this.addMonth(dueDate1, i)
              this.fleetRtrDetails.push({
                //   installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: addDueDate2
              })
              rowData = {
                // installmentAmt: this.trackVehicleForm.value['emiAmount'],
                'dueDate': addDueDate2
              }
            }

            this.formArr.push(this.initRows(rowData));
          }
        }
      } else {

        let rowData = {
          // installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
        }
        this.fleetRtrDetails.push({
          //  installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
        })
        this.formArr.push(this.initRows(rowData));
      }

    } else {
      this.trackVehicleForm.controls['loanStartDate'].setValue(this.loanEmiDate);
    }

  }
  // changeEmiAmount(event) {
  //   console.log(event);
  //   const confirmed = confirm("Are you sure to change EMI amount");
  //   if (confirmed) {
  //     this.emiAmount = event.target.value;
  //     this.formArr.controls = [];
  //     let emiAmount = event.target.value;
  //     for (let i = 0; i < this.noOfEmi; i++) {
  //       if (i < this.fleetRtrDetails.length) {
  //         this.fleetRtrDetails[i].installmentAmt = emiAmount;
  //       } else {

  //       }
  //     }
  //     this.paymentExcessOrShort(null, 0)
  //   } else {
  //     this.trackVehicleForm.controls['emiAmount'].setValue(this.emiAmount);

  //   }

  // }
  // noOfPaidEmis(event) {
  //   console.log(event);
  //   const confirmed = confirm("Are you sure to change EMI amount");
  //   if (confirmed) {
  //     this.formArr.controls = [];
  //     this.noOfEmi = parseInt(event.target.value)
  //     let data = {};
  //     data['target'] ={
  //       value: this.trackVehicleForm.controls['loanStartDate'].value
  //     } 
  //     this.loanStartDate(data)
  //     // this.noOfEmi = parseInt(event.target.value);
  //     // for (let i = 0; i < this.noOfEmi; i++) {
  //     //   if (i < this.fleetRtrDetails.length) {
  //     //     if (i == 0) {
  //     //       this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
  //     //     }
  //     //     else {
  //     //       this.addNewRow(this.fleetRtrDetails[i]);
  //     //     }
  //     //   } else {
  //     //     let rowData = {
  //     //       installmentAmt: this.trackVehicleForm.value['emiAmount'],
  //     //       dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
  //     //     }
  //     //     this.formArr.push(this.initRows(rowData));
  //     //   }
  //     // }
  //   } else {
  //     this.trackVehicleForm.controls['noOfEmisPaid'].setValue(this.noOfEmi);

  //   }
  // }
  get formArr() {
    return this.trackVehicleForm.get('installment') as
      FormArray;
  }
  get f() { return this.trackVehicleForm.controls; }

  getFleetRtr(fleetId) {
    this.trackVechileService.getFleetRtr(fleetId).subscribe((res) => {

      if (res['Status'] == "Execution Completed") {
        const installments = res['ProcessVariables'].installment;
        let noOfEmi = parseInt(this.trackVehicleForm.controls['emisPaid'].value)
        const fleetRtr = res['ProcessVariables'].fleetRtr;
        if (fleetRtr) {
          this.fleetRtrForm(fleetRtr)
          this.loanEmiDate = this.getDateFormat(fleetRtr['loanStartDate'])
          this.fleetDetails = fleetRtr;
        }
        if (installments) {
          noOfEmi = installments.length;
          this.fleetRtrDetails = res['ProcessVariables'].installment;
          for (let i = 0; i < this.fleetRtrDetails.length; i++) {

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
                //   installmentAmt: this.trackVehicleForm.value['emiAmount'],
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
 
  receiptNumber(event, i) {
    this.fleetRtrDetails[i] = { 'receiptNo': event.target.value };
  }
  delayDays(event, i, rowData) {
    console.log(event);
    const dueDate = new Date(this.trackVehicleForm.value['installment'][i]['dueDate']);
    const recDate = new Date(event);
    let delayedDays = (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
    this.trackVehicleForm.value['installment'][i]['delayDays'] = delayedDays;
    rowData.value['payment'] = this.formArr.controls[i]['controls']['payment'].value
    rowData.value['dueDate'] = this.formArr.controls[i]['controls']['dueDate'].value

    rowData.value['delayDays'] = delayedDays;

    this.fleetRtrDetails[i] = {
      'receivedDate': this.dateDbFormat(event),
      "delayDays": delayedDays
    }
    //  this.fleetRtrDetails[i]['delayDays'] = delayedDays

    this.formArr['controls'].splice(i, 1, this.initRows(rowData.value))
    // totaldelay days
    this.totalDelayDays = 0;
    let allDelayDays = []
    for (let i = 0; i < this.formArr.length; i++) {
      this.totalDelayDays = this.totalDelayDays + parseInt(this.formArr.controls[i]['controls']['delayDays'].value);
      allDelayDays.push(parseInt(this.formArr.controls[i]['controls']['delayDays'].value))
    }
    let avgDelay = this.totalDelayDays / this.formArr.length;
    let peakDelay = Math.max(...allDelayDays);
    //  this.trackVehicleForm.get('totalDelay').setValue(this.totalDelayDays);
    this.trackVehicleForm.get("peakDelay").setValue(peakDelay)
    this.trackVehicleForm.get("avgDelay").setValue(avgDelay)
    this.trackVehicleForm.get("totalDelay").setValue(this.totalDelayDays)
    //  this.fleetRtrForm(this.fleetDetails);
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
    if (this.fleetRtrDetails) {
      if (event != null && index < this.fleetRtrDetails.length) {
        this.fleetRtrDetails[index].installmentAmt = parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value);
        this.fleetRtrDetails[index].dueDate = this.dateDbFormat(this.formArr.controls[index]['controls']['dueDate'].value)
        this.fleetRtrDetails[index].receiptNo = this.formArr.controls[index]['controls']['receiptNo'].value
        this.fleetRtrDetails[index].receivedAmt = parseInt(event.target['value']);
      } else if (event != null && index >= this.fleetRtrDetails.length) {
        this.fleetRtrDetails.push({
          'receivedAmt': parseInt(event.target['value']),
          'installmentAmt': parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value),
        })
      }
    } else {
      receivedAmt = parseInt(this.formArr.controls[index]['controls']['receivedAmt'].value);
      installmentAmount = parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value)
      this.fleetRtrDetails.push({
        'receivedAmt': parseInt(this.formArr.controls[0].value['receivedAmt']),
        'installmentAmt': parseInt(this.formArr.controls[0].value['installmentAmt']),
        'receiptNo': parseInt(this.formArr.controls[0].value['receiptNo']),
        'dueDate': this.formArr.controls[0].value['dueDate'],
        'receivedDate': this.formArr.controls[0].value['receivedDate'],
        'payment': receivedAmt - installmentAmount
      });
      //     this.fleetRtrDetails[0]['paymentExcess'] = receivedAmt - installmentAmount;
      this.formArr.push(this.initRows(this.fleetRtrDetails[0]));
    }

    this.formArr.controls = [];
    let totalAmount = 0;
    for (let i = 0; i < this.fleetRtrDetails.length; i++) {
      if (i < this.fleetRtrDetails.length) {
        installmentAmount = installmentAmount + parseInt(this.fleetRtrDetails[i].installmentAmt);
        if (this.fleetRtrDetails[i].receivedAmt) {
          receivedAmt = receivedAmt + parseInt(this.fleetRtrDetails[i].receivedAmt);
          toalExcess = receivedAmt - installmentAmount;
          this.fleetRtrDetails[i].payment = toalExcess;
          totalAmount = totalAmount + receivedAmt;
        }
        if (i == 0) {
          this.formArr.push(this.initRows(this.fleetRtrDetails[i]));
        }
        else {
          this.addNewRow(this.fleetRtrDetails[i]);
        }
      } else {
        let rowData = {
          // installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.getDateFormat(this.trackVehicleForm.value['loanStartDate'])
        }
        this.formArr.push(this.initRows(rowData));
      }

    }
    this.trackVehicleForm.get('totalAmtPaid').setValue(totalAmount)
  }
  getDateFormat(date) {
    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date( year + '/' + month  + '/' + day);
    return dateFormat;
  }

  dateDbFormat(date) {
    const dateFormat: Date = new Date(date);
    return dateFormat;
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
  initRows(rowData) {
    console.log(rowData);
    if (rowData) {
      return this.fb.group({
        id: [rowData.id],
        installmentAmt: [rowData.installmentAmt],
        dueDate: [rowData.dueDate ? rowData.dueDate : ''],
        receiptNo: [rowData.receiptNo ? rowData.receiptNo : ''],
        receivedDate: [rowData.receivedDate ? rowData.receivedDate : ''],
        receivedAmt: [rowData.receivedAmt],
        delayDays: [{ value: rowData.delayDays, disabled: true }],
        payment: [{ value: rowData.payment, disabled: true }]

      });
    } else {
      return this.fb.group({
        id: [],
        installmentAmt: [],
        dueDate: [''],
        receiptNo: [''],
        receivedDate: [''],
        receivedAmt: [],
        delayDays: [{  disabled: true }],
        payment: [{ disabled: true }]

      });
    }
  }

  addNewRow(rowData) {
    if(rowData){
      this.formArr.push(this.initRows(rowData));
    }else{
     let intialDate = this.dateDbFormat(this.trackVehicleForm.controls['loanStartDate'].value);
      let duedate = this.addMonth(intialDate , this.formArr.length);
      rowData = {
        'dueDate' : duedate
      }
      this.formArr.push(this.initRows(rowData));

    }
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
    this.submitted = true;

    // stop here if form is invalid
    // if (this.trackVehicleForm.invalid) {
    //     return;
    // }else{
   console.log(this.trackVehicleForm.getRawValue()) ;
   let formDetails = this.trackVehicleForm.getRawValue();
   formDetails['loanStartDate'] = this.sendDate(this.trackVehicleForm.controls['loanStartDate'].value);
   formDetails['loanMaturityDate'] = this.sendDate(this.trackVehicleForm.controls['loanMaturityDate'].value);
   for (let i = 0; i < this.formArr.length; i++) {
      formDetails['installment'][i]['dueDate'] = this.sendDate(this.formArr.controls[i]['controls']['dueDate'].value);
      formDetails['installment'][i]['receivedDate'] = this.sendDate(this.formArr.controls[i]['controls']['receivedDate'].value);
      }
    this.trackVechileService.saveUpdateFleetRtr(formDetails, this.fleetId, this.leadId).subscribe((res: any) => {
      console.log(res);
      if (res['Error'] == "0") {
        alert("Saved Success");
        this.router.navigate(['/pages/dde/' + this.leadId + '/fleet-details']);
      }
    });
  // }
  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.actRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  nextToFleet(){
  this.router.navigate(['/pages/dde/'+this.leadId +'/fleet-details']);
}

}