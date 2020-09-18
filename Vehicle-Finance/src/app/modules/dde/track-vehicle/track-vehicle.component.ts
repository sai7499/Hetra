import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, FormArrayName } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { TrackVechileService } from "./track-vechile.service";
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
//import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';


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
  public toDayDate: Date = new Date();
  minEmiStartDate: Date = new Date();
  public trackVehicleForm: FormGroup;
  leadId: number;
  isDirty: boolean;
  focusedDate: any;
  showEmiAmountModal : boolean = false;
  showNoOfEmisAccruedModal : boolean = false;
  showEmiStartDateModal : boolean = false;
  maturedDate: Date = new Date();
  validationData: any;
  dateExceeded: boolean = false;
  disableActionBtn: boolean;
  installment: FormArrayName;
  deletedInstallments : any = [];
  overdueLov: any = [
    {key: "1", value: "YES"},
    {key: "2", value: "NO"}
  ]
  // regexPattern = {
  //   amount: {
  //     rule: "^[1-9][0-9]*$",
  //     msg: 'Alphabets and Special Characters not allowed'
  //   },
  //   nameLength: {
  //     rule: '30',
  //     msg: ''
  //   },
  //   contact: {
  //     rule: /^\d{10}$/,
  //     msg: 'Invalid Number / Alphabets and Special Characters not allowed'
  //   },
  //   contLength: {
  //     rule: '10'
  //   },
  //   name: {
  //     rule: /^[a-zA-Z ]*$/,
  //     msg: 'Invalid Name / Numbers and Special Characters not allowed'
  //   },
  //   vachilePattern: {
  //     rule: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
  //     msg: 'Invalid Name / Special Characters not allowed'
  //   },
  //   vechileNoPattern: {
  //     rule: /^[ A-Za-z0-9_@./#&+-]*$/,
  //     msg: 'Invalid Vechile No / Special Characters not allowed'
  //   }
  // }

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
    private toasterService: ToasterService,
    private actRoute: ActivatedRoute,
    private toggleDdeService: ToggleDdeService
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
      this.trackVehicleForm.patchValue({ clientName: fleetRtr.clientName });
      this.trackVehicleForm.patchValue({ financierName: fleetRtr.financierName });
      this.trackVehicleForm.patchValue({ assetFinancied: fleetRtr.assetFinanciedDesc });
      this.trackVehicleForm.patchValue({ repaymentMode: fleetRtr.repaymentMode });
      this.trackVehicleForm.patchValue({ financeAmount: fleetRtr.financeAmount ? fleetRtr.financeAmount : '' });
      this.trackVehicleForm.patchValue({ financeCharges: fleetRtr.financeCharges });
      // this.trackVehicleForm.patchValue({ contractValue: fleetRtr.contractValue});
      // this.trackVehicleForm.patchValue({ contractValue: fleetRtr.contractValue});
      this.trackVehicleForm.patchValue({ contractValue: fleetRtr.contractValue ? fleetRtr.contractValue : "" });
      this.trackVehicleForm.patchValue({ contNo: fleetRtr.contNo });
      this.trackVehicleForm.patchValue({ vehicleNo: fleetRtr.vehicleNo });
      this.trackVehicleForm.patchValue({ financeType: fleetRtr.financeType });
      this.trackVehicleForm.patchValue({ accountStatus: fleetRtr.accountStatus });
      this.trackVehicleForm.patchValue({ loanStartDate: this.getDateFormat(fleetRtr.loanStartDate) });
      this.trackVehicleForm.patchValue({ loanMaturityDate: this.getDateFormat(fleetRtr.loanMaturityDate) });
      this.trackVehicleForm.patchValue({ emiStartDate: this.getDateFormat(fleetRtr.emiStartDate) });

      this.trackVehicleForm.patchValue({ thirtyDpdCount: fleetRtr.thirtyDpdCount ? fleetRtr.thirtyDpdCount : 0 });
      this.trackVehicleForm.patchValue({ ninetyDpdCount: fleetRtr.ninetyDpdCount ? fleetRtr.ninetyDpdCount : 0 });
      this.trackVehicleForm.patchValue({ noOfEmi: fleetRtr.noOfEmi });
      this.trackVehicleForm.patchValue({ emisPaid: fleetRtr.emisPaid });
      this.trackVehicleForm.patchValue({ balanceTenor: fleetRtr.balanceTenor ? fleetRtr.balanceTenor : 0 });
      this.trackVehicleForm.patchValue({ totalDelay: fleetRtr.totalDelay });
      this.trackVehicleForm.patchValue({ peakDelay: fleetRtr.peakDelay });
      this.trackVehicleForm.patchValue({ avgDelay: fleetRtr.avgDelay });

      this.trackVehicleForm.patchValue({ minDelay: fleetRtr.minDelay ? fleetRtr.minDelay : 0 });

      this.trackVehicleForm.patchValue({ trackStatus: fleetRtr.trackStatus ? fleetRtr.trackStatus : 0 });
      this.trackVehicleForm.patchValue({ totalAmtPaid: fleetRtr.totalAmtPaid });
      this.trackVehicleForm.patchValue({ emiPaid: fleetRtr.emiPaid });
      this.trackVehicleForm.patchValue({ emiAmount: fleetRtr.emiAmount });
      this.trackVehicleForm.patchValue({ emiOverdue: fleetRtr.emiOverdue });
      
      // this.trackVehicleForm = this.fb.group({
      ////  loanMaturityDate: new FormControl(this.getDateFormat(fleetRtr.loanMaturityDate),Validators.required ),
      //   thirtyDpdCount: new FormControl({ value: fleetRtr.thirtyDpdCount ? fleetRtr.thirtyDpdCount : 0, disabled: true }),
      //   ninetyDpdCount: new FormControl({ value: fleetRtr.ninetyDpdCount ? fleetRtr.ninetyDpdCount : 0, disabled: true }),
      //   noOfEmi: new FormControl(fleetRtr.noOfEmi,Validators.required ),
      //   emisPaid: new FormControl(fleetRtr.emisPaid,Validators.required ),
      //   balanceTenor: new FormControl({ value: fleetRtr.balanceTenor ? fleetRtr.balanceTenor : 0, disabled: true }),
      //   totalDelay: new FormControl({ value: fleetRtr.totalDelay ? fleetRtr.totalDelay : 0, disabled: true }),
      //   peakDelay: new FormControl({ value: fleetRtr.peakDelay ? fleetRtr.peakDelay : 0, disabled: true }),
      //   avgDelay: new FormControl({ value: fleetRtr.avgDelay ? fleetRtr.avgDelay : 0, disabled: true }),
      //   trackStatus: new FormControl({ value: fleetRtr.trackStatus ? fleetRtr.trackStatus : 0, disabled: true }),
      //   totalAmtPaid: new FormControl({ value: fleetRtr.totalAmtPaid ? fleetRtr.totalAmtPaid : 0, disabled: true }),
      //   emiPaid: new FormControl(fleetRtr.emiPaid),
      //   // emiAmount: new FormControl(1000),
      //   installment: this.fb.array([])
      // });
      this.noOfEmi = this.trackVehicleForm.controls['emisPaid'].value;

    } else {
      this.trackVehicleForm = this.fb.group({
        clientName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
        financierName: new FormControl({ value: '', disabled: true }, Validators.required),
        assetFinancied: new FormControl({ value: '', disabled: true }, Validators.required),
        repaymentMode: new FormControl('', Validators.required),
        financeAmount: new FormControl('', Validators.required),
        financeCharges: new FormControl('', Validators.required),
        contractValue: new FormControl('', Validators.required),
        contNo: new FormControl({ value: '', disabled: true }, Validators.required),
        vehicleNo: new FormControl({ value: '', disabled: true }, Validators.required),
        financeType: new FormControl('', Validators.required),
        accountStatus: new FormControl('', Validators.required),
        loanStartDate: new FormControl('', Validators.required),
        emiStartDate: new FormControl('', Validators.required),
        loanMaturityDate: new FormControl('', Validators.required),
        thirtyDpdCount: new FormControl({ value: 0, disabled: true }),
        ninetyDpdCount: new FormControl({ value: 0, disabled: true }),
        noOfEmi: new FormControl({ value: '', disabled: true }, Validators.required),
        emisPaid: new FormControl({ value: '', disabled: false }, Validators.required),
        balanceTenor: new FormControl({ value: 0, disabled: true }),
        totalDelay: new FormControl({ value: 0, disabled: true }),
        peakDelay: new FormControl({ value: 0, disabled: true }),
        avgDelay: new FormControl({ value: 0, disabled: true }),
        minDelay: new FormControl({ value: 0, disabled: true }),
        trackStatus: new FormControl({ value: 0, disabled: true }),
        totalAmtPaid: new FormControl({ value: 0, disabled: true }),
        emiOverdue: new FormControl({ value: '' }, Validators.required),
        // emiPaid: new FormControl(3254),
        emiAmount: new FormControl(''),
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

    this.labelsData.getLabelsData().subscribe(

      data => {
        this.labels = data;
        this.validationData = data.validationData;

      }, error => {
        console.log(error);

      });
    //  this.addRows(null);
    //  this.emiAmount = this.trackVehicleForm.controls['emiAmount'].value;
    // this.loanEmiDate = this.trackVehicleForm.controls['loanStartDate'].value;
    this.noOfEmi = this.trackVehicleForm.controls['emisPaid'].value;


  }
  checkFinanceCharge() {
    let financeCharges = parseInt(this.trackVehicleForm.controls['financeCharges'].value);
    let financeAmount = parseInt(this.trackVehicleForm.controls['financeAmount'].value);
    if (financeCharges > financeAmount) {
      this.trackVehicleForm.controls['financeCharges'].setErrors({ 'incorrect': true })

    } else { }
  }
  openEmiAmountModal($event){
    if(this.fleetDetails['emiAmount']){
      this.showEmiAmountModal = true;
    }else{
      this.changeEmiAmount();
    }
   
  }
  openNoOfEmisAccruedModal($event){
    this.showNoOfEmisAccruedModal = true;
  }
  openEmiStartDateModal(event){
    if(this.trackVehicleForm.controls['loanStartDate'].value){
      if(this.fleetDetails['emiStartDate']){
        this.showEmiStartDateModal = true;
      }else{
        this.loanStartDate(event);
      }
    }else{
      this.trackVehicleForm.controls['emiStartDate'].patchValue('')
      this.toasterService.showError("please enter loan start date" , '')
    }
    
   
  }
  hideModal(data){
    switch(data) {
      case 'emiAmountModal':
        {
          this.showEmiAmountModal = false;
          this.trackVehicleForm.controls['emiAmount'].patchValue(this.fleetDetails['emiAmount'])
        }
        break;
      case 'noOfEmisAccruedModal':
      {
        this.showNoOfEmisAccruedModal = false;
        this.trackVehicleForm.controls['emisPaid'].patchValue(this.fleetDetails['emisPaid'])
      
      }
      break;
      case 'emiStartDateModal': {
        this.showEmiStartDateModal = false;
        this.trackVehicleForm.controls['emiStartDate'].patchValue(this.fleetDetails['emiStartDate'])
       }
      default: {}
    
  }
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
    const formattedDate = new Date(year + '/' + month1 + '/' + day);
    this.focusedDate.push(formattedDate);
    return formattedDate;
  }
  loanStartDate(event) {
    //  const confirmed = confirm("Are you sure to loan start date");
    // if (confirmed) {
      this.showEmiStartDateModal = false;
    const startDate = this.trackVehicleForm.value['emiStartDate'];
    this.fleetDetails['emiStartDate'] = startDate;
    this.focusedDate = []
    // this.loanEmiDate = this.dateDbFormat(startDate);
    this.focusedDate.push(startDate)
    this.formArr.controls = [];
    let addDueDate = this.dateDbFormat(startDate);
    this.maturedDate = startDate
    //if (this.fleetRtrDetails && this.fleetRtrDetails.length != 0) {
    for (let i = 0; i < (Number(this.fleetDetails['emisPaid'])); i++) {
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
          this.focusedDate.push(addDueDate2)
          this.addNewRow(this.fleetRtrDetails[i]);
        }
      }

      else {
        let dueDate1 = this.dateDbFormat(this.trackVehicleForm.value['emiStartDate'])

        let rowData = {
          installmentAmt: this.trackVehicleForm.value['emiAmount'],
          dueDate: this.dateDbFormat(this.trackVehicleForm.value['emiStartDate'])
        }
        if (this.fleetRtrDetails.length == 0) {
          this.fleetRtrDetails.push({
            installmentAmt: this.trackVehicleForm.value['emiAmount'],
            dueDate: dueDate1
          })
        } else {
          let addDueDate2 = this.addMonth(dueDate1, i)
          this.fleetRtrDetails.push({
            installmentAmt: this.trackVehicleForm.value['emiAmount'],
            dueDate: addDueDate2
          })
          rowData = {
            installmentAmt: this.trackVehicleForm.value['emiAmount'],
            'dueDate': addDueDate2
          }
        }
        this.formArr.push(this.initRows(rowData));
      }
    }
    // }


    // else {

    //   let rowData = {
    //     // installmentAmt: this.trackVehicleForm.value['emiAmount'],
    //     dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
    //   }
    //   this.fleetRtrDetails.push({
    //     //  installmentAmt: this.trackVehicleForm.value['emiAmount'],
    //     dueDate: this.dateDbFormat(this.trackVehicleForm.value['loanStartDate'])
    //   })
    //   this.formArr.push(this.initRows(rowData));
    // }

    // } else {
    //   this.trackVehicleForm.controls['loanStartDate'].setValue(this.loanEmiDate);
    // }

  }
  changeEmiAmount() {
   this.showEmiAmountModal = false;
    this.emiAmount = this.trackVehicleForm.value['emiAmount'];
    this.formArr.controls = [];
    this.fleetDetails['emiAmount'] = this.trackVehicleForm.value['emiAmount'];
    for (let i = 0; i < (Number(this.fleetDetails['emisPaid'])); i++) {
      if (i < this.fleetRtrDetails.length) {
        let dueDate1 = this.trackVehicleForm.value['emiStartDate'] ? this.dateDbFormat(this.trackVehicleForm.value['emiStartDate']): null; 
        if(dueDate1 && i==0){
          this.fleetRtrDetails[i]['installmentAmt'] = this.trackVehicleForm.value['emiAmount'] 
          this.fleetRtrDetails[i]['dueDate'] = dueDate1
        }else if(dueDate1 && i>0){
          let addDueDate2 = this.addMonth(dueDate1, i)
          this.fleetRtrDetails[i]['installmentAmt'] = this.trackVehicleForm.value['emiAmount'] 
          this.fleetRtrDetails[i]['dueDate'] = addDueDate2       
        }else{
          this.fleetRtrDetails[i]['installmentAmt'] = this.trackVehicleForm.value['emiAmount'] 
        }
          this.addNewRow(this.fleetRtrDetails[i]);
      }
      // else{
      //   let dueDate1 = this.dateDbFormat(this.trackVehicleForm.value['emiStartDate'])

      //   let rowData = {
      //     installmentAmt: this.trackVehicleForm.value['emiAmount'],
      //     dueDate: dueDate1 ? dueDate1 : null
      //   }
      //   if (this.fleetRtrDetails.length == 0) {
      //     this.fleetRtrDetails.push({
      //       installmentAmt: this.trackVehicleForm.value['emiAmount'],
      //       dueDate: dueDate1 ? dueDate1 : null
      //     })
      //   } else {
      //     let addDueDate2 = this.addMonth(dueDate1, i)
      //     this.fleetRtrDetails.push({
      //       installmentAmt: this.trackVehicleForm.value['emiAmount'],
      //       dueDate: addDueDate2 ? addDueDate2 : ''
      //     })
      //     rowData = {
      //       installmentAmt: this.trackVehicleForm.value['emiAmount'],
      //       'dueDate': addDueDate2 ? addDueDate2 : null
      //     }
      //   }
      //   this.formArr.push(this.initRows(rowData));
      // }
     

    }
    this.paymentExcessOrShort(null, 0)
  }
  changeAccrued(event){

    this.showNoOfEmisAccruedModal = false;
    this.fleetDetails['emisPaid'] =  this.trackVehicleForm.value['emisPaid'] ? Number(this.trackVehicleForm.value['emisPaid']) : '';
   if(this.formArr['controls'].length > Number(this.trackVehicleForm.value['emisPaid']) ){
    let removedIndex = this.formArr['controls'].length -  Number(this.trackVehicleForm.value['emisPaid']);
    // let removiedElements = this.fleetRtrDetails;
    // let removiedData;
    // if(Number(this.trackVehicleForm.value['emisPaid']) > 1){
    //    removiedData = removiedElements.slice(Number(this.trackVehicleForm.value['emisPaid']) , removiedElements.length )

    // }else {
    //   removiedData = removiedElements.slice(Number(this.trackVehicleForm.value['emisPaid']) , removiedElements.length )

    // }
    // console.log(removiedData);
    // for(let i=0 ; i< removiedData.length ; i++){
    //   this.deleteRow(removiedData[i])
    // }
    this.formArr['controls'].splice(Number(this.trackVehicleForm.value['emisPaid']) ,removedIndex)
    this.fleetRtrDetails.splice(Number(this.trackVehicleForm.value['emisPaid']) ,removedIndex);
    console.log(this.fleetRtrDetails);
   }else{
    let addIndex = Number(this.trackVehicleForm.value['emisPaid']) - this.formArr['controls'].length;
    for(let i=0 ; i<addIndex; i++){
      let addDueDate2 = this.trackVehicleForm.value['emiStartDate'] ? this.addMonth(this.fleetRtrDetails[(this.formArr['controls'].length -1)]['dueDate'], 1) : null
      this.fleetRtrDetails.push({
        installmentAmt: this.trackVehicleForm.controls['emiAmount'].value,
        'dueDate': addDueDate2,
      })
      this.addNewRow(this.fleetRtrDetails[this.fleetRtrDetails.length -1]);
      
    }
   }
   this.paymentExcessOrShort(null, 0)
   this.delayDaysCalc();
  }
  
  get formArr() {
    return this.trackVehicleForm.get('installment') as
      FormArray;
  }
  get f() { return this.trackVehicleForm.controls; }
  setMinEmiStartDate(event){
    this.minEmiStartDate = event;
  }
  getFleetRtr(fleetId) {
    this.trackVechileService.getFleetRtr(fleetId).subscribe((res) => {

      if (res['Status'] == "Execution Completed") {
        const installments = res['ProcessVariables'].installment;
        let noOfEmi = parseInt(this.trackVehicleForm.controls['emisPaid'].value)
        const fleetRtr = res['ProcessVariables'].fleetRtr;
        if (fleetRtr) {
          this.fleetRtrForm(fleetRtr)
          // this.loanEmiDate = this.getDateFormat(fleetRtr['loanStartDate'])
          this.minEmiStartDate = this.getDateFormat(fleetRtr['loanStartDate']);
          this.fleetDetails = fleetRtr;
        }
        if (installments) {

          this.fleetRtrDetails = res['ProcessVariables'].installment;
          this.focusedDate = []
          for (let i = 0; i < Number(fleetRtr['emisPaid']); i++) {

            if (i < installments.length) {
              if (i == 0) {
                installments[i]['dueDate'] = this.getDateFormat(installments[i]['dueDate'])
                installments[i]['receivedDate'] = this.getDateFormat(installments[i]['receivedDate'])
                this.focusedDate.push(installments[i]['receivedDate']);
                // console.log(this.focusedDate);
                this.formArr.push(this.initRows(installments[i]));
              }
              else {
                installments[i]['dueDate'] = this.getDateFormat(installments[i]['dueDate'])
                installments[i]['receivedDate'] = this.getDateFormat(installments[i]['receivedDate'])
                this.focusedDate.push(installments[i]['receivedDate']);
                this.addNewRow(installments[i]);
              }
              
            } else {
              let rowData = {
                installmentAmt: this.trackVehicleForm.value['emiAmount'],
                dueDate: this.addMonth(this.trackVehicleForm.value['emiStartDate'] , i) 
              }
              this.formArr.push(this.initRows(rowData));
            }
          }
        } else {
          // noOfEmi = installments.length;
          for (let i = 0; i < (Number(fleetRtr['emisPaid'])); i++) {
            this.formArr.push(this.initRows(null));
            
          }
          this.fleetRtrDetails = this.formArr.getRawValue();
        }
      } else {
        this.formArr.push(this.initRows(null));
      }
      this.fleetRtrDetails = this.formArr.getRawValue();
      const operationType = this.toggleDdeService.getOperationType();
      if (operationType === '1') {
        this.trackVehicleForm.disable();
        this.disableActionBtn = true;
      }
    })
  }

  receiptNumber(event, i) {
    this.fleetRtrDetails[i]['receiptNo'] = event.target.value ;
  }
  delayDays(event, i, rowData) {
  //  console.log(rowData['receivedDate'])
    if (rowData['controls']['receivedDate'] && rowData['controls']['receivedDate'].status != "INVALID") {
      console.log(rowData.value['receivedDate']);
      this.dateExceeded = false;
      const dueDate = new Date(this.trackVehicleForm.value['installment'][i]['dueDate']);
      const recDate = new Date(rowData.value['receivedDate']);
      let delayedDays = (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
      this.trackVehicleForm.value['installment'][i]['delayDays'] = delayedDays;
      rowData.value['payment'] = this.formArr.controls[i]['controls']['payment'].value
      rowData.value['dueDate'] = this.formArr.controls[i]['controls']['dueDate'].value

      rowData.value['delayDays'] = delayedDays;
      this.fleetRtrDetails[i]['receivedDate'] = event ;
      // this.fleetRtrDetails[i] = {
      //   'receivedDate': this.dateDbFormat(rowData.value['receivedDate']),
      //   "delayDays": delayedDays
      // }
      //  this.fleetRtrDetails[i]['delayDays'] = delayedDays

      this.formArr['controls'].splice(i, 1, this.initRows(rowData.value))
      // totaldelay days
      this.delayDaysCalc();

    } else {
      console.log(rowData['receivedDate'])
      this.dateExceeded = true;
    }

    //  this.fleetRtrForm(this.fleetDetails);
  }
  dateDiff(d1, d2) {
    const dueDate = new Date(d1);
    const recDate = new Date(d2);
    return (recDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
  }
  delayDaysCalc() {
    this.totalDelayDays = 0;
    let allDelayDays = []
    for (let i = 0; i < this.formArr.length; i++) {
      let delayDay = this.formArr.controls[i]['controls']['delayDays'].value ? parseInt(this.formArr.controls[i]['controls']['delayDays'].value ) : 0;
      this.totalDelayDays = this.totalDelayDays + delayDay;
      allDelayDays.push(parseInt(this.formArr.controls[i]['controls']['delayDays'].value))
    }
    if(this.trackVehicleForm.value['emiStartDate']){
      let avgDelay = Number(this.totalDelayDays / this.formArr.length).toFixed(4);
      let peakDelay = Math.max(...allDelayDays);
      let mindelay = Math.min(...allDelayDays);
      if(mindelay < 0){
        mindelay = 0
      }
      //  this.trackVehicleForm.get('totalDelay').setValue(this.totalDelayDays);
      this.trackVehicleForm.get("peakDelay").setValue(peakDelay)
      this.trackVehicleForm.get("avgDelay").setValue(avgDelay)
      this.trackVehicleForm.get("totalDelay").setValue(this.totalDelayDays)
      this.trackVehicleForm.get("minDelay").setValue(mindelay)
    }
  }

  paymentExcessOrShort(event, index) {
   // console.log(event.target.value)
    let toalExcess = 0;
    let installmentAmount = 0;
    let receivedAmt = 0;
    // if (this.formArr.controls[index]['controls']['receivedAmt'].value && this.formArr.controls[index]['controls']['receivedAmt'].value != '') {
      if (this.fleetRtrDetails) {
        if (this.formArr.controls[index]['controls']['receivedAmt'].value != null && index <= this.fleetRtrDetails.length) {
          this.fleetRtrDetails[index].installmentAmt = parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value);
          this.fleetRtrDetails[index].dueDate = this.formArr.controls[index]['controls']['dueDate'].value ? this.dateDbFormat(this.formArr.controls[index]['controls']['dueDate'].value) : null
          this.fleetRtrDetails[index].receivedDate = this.formArr.controls[index]['controls']['receivedDate'].value ? this.dateDbFormat(this.formArr.controls[index]['controls']['receivedDate'].value) : null
          this.fleetRtrDetails[index].delayDays = this.formArr.controls[index]['controls']['delayDays'].value ? this.formArr.controls[index]['controls']['delayDays'].value : 0

          this.fleetRtrDetails[index].receiptNo = this.formArr.controls[index]['controls']['receiptNo'].value
          this.fleetRtrDetails[index].receivedAmt = parseInt(this.formArr.controls[index]['controls']['receivedAmt'].value);
        } 
        // else if (this.formArr.controls[index]['controls']['receivedAmt'].value != null && index >= this.fleetRtrDetails.length) {
        //   this.fleetRtrDetails.push({
        //     'receivedAmt': parseInt(this.formArr.controls[index]['controls']['receivedAmt'].value),
        //     'installmentAmt': parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value),
        //   })
        // }
      // } 
      // else {
      //   receivedAmt = parseInt(this.formArr.controls[index]['controls']['receivedAmt'].value);
      //   installmentAmount = parseInt(this.formArr.controls[index]['controls']['installmentAmt'].value)
      //   this.fleetRtrDetails.push({
      //     'receivedAmt': parseInt(this.formArr.controls[0].value['receivedAmt']),
      //     'installmentAmt': parseInt(this.formArr.controls[0].value['installmentAmt']),
      //     'receiptNo': this.formArr.controls[0].value['receiptNo'],
      //     'dueDate': this.formArr.controls[0].value['dueDate'],
      //     'receivedDate': this.formArr.controls[0].value['receivedDate'],
      //     'payment': receivedAmt - installmentAmount
      //   });
      //   //     this.fleetRtrDetails[0]['paymentExcess'] = receivedAmt - installmentAmount;
      //   this.formArr.push(this.initRows(this.fleetRtrDetails[0]));
      // }
      this.paymentCalc(installmentAmount, receivedAmt);
    }
    else { }
  }
  paymentCalc(installmentAmount, receivedAmt) {

    this.formArr.controls = [];
    let totalAmount = 0;
    let toalExcess = 0;
    for (let i = 0; i < this.fleetRtrDetails.length; i++) {
      if (i < this.fleetRtrDetails.length) {
        installmentAmount = installmentAmount + parseInt(this.fleetRtrDetails[i].installmentAmt);
        if (this.fleetRtrDetails[i].receivedAmt) {
          receivedAmt = receivedAmt + parseInt(this.fleetRtrDetails[i].receivedAmt);
          toalExcess = receivedAmt - installmentAmount;
          this.fleetRtrDetails[i].payment = toalExcess;
          totalAmount = receivedAmt;
        } else if (this.fleetRtrDetails[i].receivedAmt == 0 || this.fleetRtrDetails[i].receivedAmt == null) {
          receivedAmt = receivedAmt + (this.fleetRtrDetails[i].receivedAmt ? parseInt(this.fleetRtrDetails[i].receivedAmt) : 0);
          toalExcess = receivedAmt - installmentAmount;
          this.fleetRtrDetails[i].payment = toalExcess;
          totalAmount = receivedAmt;
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
    if (date) {
      var datePart = date.match(/\d+/g);
      var month = datePart[1];
      var day = datePart[0];
      var year = datePart[2];
      const dateFormat: Date = new Date(year + '/' + month + '/' + day);
      return dateFormat;
    }else{
      return
    }

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
 //   console.log(rowData);
    if (rowData) {
      return this.fb.group({
        id: [rowData.id],
        installmentAmt: [rowData.installmentAmt],
        dueDate: [rowData.dueDate ? rowData.dueDate : ''],
        receiptNo: [rowData.receiptNo ? rowData.receiptNo : ''],
        receivedDate: [rowData.receivedDate ? rowData.receivedDate : '', Validators.required],
        receivedAmt: [rowData.receivedAmt ? rowData.receivedAmt : 0],
        delayDays: [{ value: rowData.delayDays ? rowData.delayDays : 0, disabled: true }],
        payment: [{ value: rowData.payment ? rowData.payment : 0, disabled: true }]

      });
    } else {
      return this.fb.group({
        id: [],
        installmentAmt: [],
        dueDate: [''],
        receiptNo: [''],
        receivedDate: ['', Validators.required],
        receivedAmt: [],
        delayDays: [{ value: '', disabled: true }],
        payment: [{ value: '', disabled: true }]

      });
    }
  }

  addNewRow(rowData) {
    if (rowData) {
      this.formArr.push(this.initRows(rowData));
    } else {
      console.log(this.formArr['controls'][this.formArr.length - 1]['controls']['dueDate'].value)
      let intialDate = this.dateDbFormat(this.formArr['controls'][this.formArr.length - 1]['controls']['dueDate'].value);
      let duedate = this.addMonth(intialDate, 1);
      rowData = {
        'dueDate': duedate
      }
      this.formArr.push(this.initRows(rowData));

    }
  }

  deleteRow( item) {

   // console.log(item)
    if (this.trackVehicleForm.get('installment')['controls'].length > 1) {
      if (item['id'] != null || item['id'] != undefined) {
        //   console.log(item.value);
        this.trackVechileService.deleteFleetRtr(item['id']).subscribe((res) => {
          console.log(res);
          // this.formArr.removeAt(index);
          // this.fleetRtrDetails.splice(index, 1)
          // this.paymentCalc(0, 0);
          // this.delayDaysCalc();
          this.toasterService.showSuccess('Record deleted successfully!', '');

        })
        // this.formArr.removeAt(index);
      } else {
        // this.formArr.removeAt(index);
        // this.fleetRtrDetails.splice(index, 1)
        // this.paymentCalc(0, 0);
        // this.delayDaysCalc();

      }
    } else {
      this.toasterService.showError("At least one record required !", '')
    }



  }

  onFormSubmit() {
    this.submitted = true;
    this.isDirty = true;

    // stop here if form is invalid
    if (this.trackVehicleForm.invalid) {
      this.toasterService.showError("Please Enter Required Fields" , '')
      return;
    } else {

     // console.log(this.trackVehicleForm.getRawValue());
      let formDetails = this.trackVehicleForm.getRawValue();
      formDetails['assetFinancied'] = this.fleetDetails['assetFinancied'];

      formDetails['loanStartDate'] = this.sendDate(this.trackVehicleForm.controls['loanStartDate'].value);
      formDetails['emiStartDate'] = this.sendDate(this.trackVehicleForm.controls['emiStartDate'].value);
      formDetails['loanMaturityDate'] = this.sendDate(this.trackVehicleForm.controls['loanMaturityDate'].value);
      // formDetails['minDelay'] = this.trackVehicleForm.controls['minDelay'].value;
      
      // formDetails['financeCharges'] = parseInt(this.trackVehicleForm.controls['financeCharges'].value);
      //  formDetails['contractValue'] = parseInt(this.trackVehicleForm.controls['contractValue'].value);
      //  formDetails['financeAmount'] = parseInt(this.trackVehicleForm.controls['financeAmount'].value);
    // formDetails['emiOverdue'] = "YES"
      //  formDetails['totalEmi']  = parseInt(this.trackVehicleForm.controls['totalEmi'].value);
      // formDetails['noOfEmi'] = parseInt(this.trackVehicleForm.controls['noOfEmi'].value);
      // formDetails['emisPaid'] = parseInt(this.trackVehicleForm.controls['emisPaid'].value);
     // formDetails['contNo'] = this.trackVehicleForm.controls['contNo'].value.toString();
      for (let i = 0; i < this.formArr.length; i++) {
        formDetails['installment'][i]['dueDate'] = this.sendDate(this.formArr.controls[i]['controls']['dueDate'].value);
        //  formDetails['installment'][i]['receivedAmt'] = Number(this.formArr.value[i].receivedAmt);
        // formDetails['installment'][i]['installmentAmt'] = Number(this.formArr.value[i].installmentAmt);
        // formDetails['installment'][i]['payment'] = this.formArr.controls[i]['controls']['payment'].value.toString();

        // formDetails['installment'][i]['delayDays'] = this.formArr.controls[i]['controls']['delayDays'].value.toString();

        // if(this.formArr.value[i].receivedAmt == "0"){
        //   formDetails['installment'][i]['receivedAmt'] = 0
        // }
    // console.log(this.formArr.controls[i]['controls']['receivedAmt']);
        formDetails['installment'][i]['receivedDate'] = this.sendDate(this.formArr.controls[i]['controls']['receivedDate'].value);
      }
      this.trackVechileService.saveUpdateFleetRtr(formDetails, this.fleetId, this.leadId).subscribe((res: any) => {
        console.log(res);
        if (res['ProcessVariables'] && res['ProcessVariables']['error'].code == "0") {
          this.toasterService.showSuccess('Record saved successfully!', '');
          this.router.navigate(['/pages/dde/' + this.leadId + '/fleet-details']);
        }else if(res['ProcessVariables'] && res['ProcessVariables']['error'].code == "1"){
          this.toasterService.showError(res['ProcessVariables']['error'].message, '');
        }else if(res['Error'] == "1"){
          this.toasterService.showError(res['ErrorMessage'], '');

        }
      });
    }
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

  nextToFleet() {
    this.router.navigate(['/pages/dde/' + this.leadId + '/fleet-details']);
  }

}