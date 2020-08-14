import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LabelsService } from '@services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { DisbursementService } from '../services/disbursement.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-disbursement-form',
  templateUrl: './disbursement-form.component.html',
  styleUrls: ['./disbursement-form.component.css']
})
export class DisbursementFormComponent implements OnInit {
 

  labels: any = {};
  disbursementDetailsForm: FormGroup;
  dealerDetailsForm:FormGroup;
  appDetailsForm:FormGroup;
  coAppDetailsForm:FormGroup;
  bankerDetailsForm:FormGroup;
  financierDetailsForm:FormGroup;
  thirdPartyDetailsForm:FormGroup;
  ibtDetailsForm:FormGroup;
  trancheDealerForm: FormGroup;
  trancheAppForm:FormGroup;
  trancheCoAppForm:FormGroup;
  trancheBankerForm:FormGroup;
  trancheFinancierForm:FormGroup;
  trancheTPForm:FormGroup;

  LOV: any;
  isAlert: boolean;
  alertTimeOut: any;
  keyword: string;
  placeholder = [];
  dealerCodeData: Array<any> = [];
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);
  isDirty: boolean;
  public toDayDate: Date = new Date();


  regexPattern = {
    amount: {
      rule: "^[1-9][0-9]*$",
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed'
    },
    ifsc:{
      rule: "^[A-Za-z][A-Za-z0-9]+$",
     // msg: "Special Characters not allowed"
    }
  }

  amountLength: number;
  
  trancheDealerList: Array<{}> = [];
  trancheAppList:Array<{}>=[];
  trancheCoAppList:Array<{}>=[];
  trancheBankerList:Array<{}>=[];
  trancheFinancierList:Array<{}>=[];
  trancheTpList:Array<{}>=[];
  
 
  disburseToDealer: boolean=false;
  disburseToApp: boolean=false;
  disburseToCoApp: boolean=false;
  disburseToBanker: boolean=false;
  disburseToFinancier: boolean=false;
  disburseToThirdParty: boolean=false;
  disburseToIBT:boolean= false;
  numOfTranch: any;
  nameErrorMessage: string;
  ShowDisburseFields: boolean;
  TDTErrorMessage: string;
  checkDeferDisbValue: any;
  TDDErrorMessage: string;
  totalDisbursementAmount: any;
  financierLaonAccNo: any;
  ifscLength: any;
  showTrancheTable: boolean;
  showAppTrancheTable:boolean;
  showCoAppTrancheTable:boolean;
  showBankerTrancheTable:boolean;
  showFinancierTrancheTable:boolean;
  showThirdPartyTrancheTable:boolean;
  mopVal: any;
  showDDDetails: boolean;
  showBankDetails: boolean;
  showCASADetails:boolean;
  showAppCASADetails:boolean;
  showAppBankDetails: boolean;
  showAppDDDetails: boolean;
  showCoAppBankDetails: boolean;
  showCoAppDDDetails: boolean;
  showBankerBankDetails: boolean;
  showBankerDDDetails: boolean;
  showFinBankDetails: boolean;
  showFinDDDetails: boolean;
  showTPBankDetails: boolean;
  showTPDDDetails: boolean;
  showCoAppCASADetails:boolean;
  showBankerCASADetails:boolean;
  showFinCASADetails:boolean;
  showTPCASADetails:boolean;
  
  dealerObjInfo: Object = {};
  applicantObjInfo: Object = {};
  coApplicantObjInfo: Object = {};
  bankerObjInfo: Object = {};
  financierObjInfo: Object = {};
  thirdPartyObjInfo: Object = {};
  internalBTObjInfo: Object = {};
  bankdetailsformArray= ['beneficiaryAccountNo','beneficiaryBank','ifscCode','beneficiaryBranch']
  chequeDDformArray= ['instrumentType','instrumentNumber','instrumentDate','favouringBankOfDraw','favouringBankBranch']
  casaformArray= ['loanNumber']
  
  commonFormArray = ['beneficiaryName','beneficiaryAccountNo','beneficiaryBank','ifscCode','beneficiaryBranch','instrumentType','instrumentNumber','instrumentDate','favouringBankOfDraw','favouringBankBranch','loanNumber','paymentMethod','disbursementAmount']
  dealerformArray=['dealerCode','beneficiaryName','beneficiaryAccountNo','beneficiaryBank','ifscCode','beneficiaryBranch','instrumentType','instrumentNumber','instrumentDate','favouringBankOfDraw','favouringBankBranch','loanNumber','paymentMethod','disbursementAmount']
  bankerformArray=['bankerId','beneficiaryName','beneficiaryAccountNo','beneficiaryBank','ifscCode','beneficiaryBranch','instrumentType','instrumentNumber','instrumentDate','favouringBankOfDraw','favouringBankBranch','loanNumber','paymentMethod','disbursementAmount']
  finformArray=['financierId','beneficiaryName','beneficiaryAccountNo','beneficiaryBank','ifscCode','beneficiaryBranch','instrumentType','instrumentNumber','instrumentDate','favouringBankOfDraw','favouringBankBranch','loanNumber','paymentMethod','disbursementAmount']
  
  accountTypeLov=[];
  bankerLov=[];
  disburseToLov=[];
  financierLov=[];
  paymentLov=[];
  trancheDisbLov=[];
  instrumentTypeLov=[];
  coAppNamesLov=[];
  disbLeadId="1234"//ryt now static lead given , get the lead id from dashboard dynamically
  disuserID="Anand"//ryt now static userId given , get the userId from dashboard dynamically
  dealerDetailsData: any;
  applicantDetailsData: any;
  dealerCode: any;
  duplicateDealerDetails: any;
  disbursementDetailsData: any;
  leadID: any;
  disburseTo: any;
  loanDetailsData : Object = {};
  ReqDealerDetails: { leadID:any;disbursementID:any; payableTo:String; favouring:String; dealerCode: any; beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: String; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: any; trancheDisbursementFlag: any;trancheDisbursementJson: any ;active:any};
  ReqApplicantDetails: { leadID: any; disbursementID: any; payableTo:String; favouring:String; beneficiaryName: any; applicantName: any; favouringName: any; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: string; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: string; trancheDisbursementFlag: string; trancheDisbursementJson: any;active:any };
  ReqBankerDetails: { leadID: any; disbursementID: any; payableTo:String; favouring:String; bankerId: any; beneficiaryName: any; applicantName: any; favouringName: any; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: string; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: string; trancheDisbursementFlag: string; trancheDisbursementJson: any;active:any };
  ReqFinancierDetails: { leadID: any; disbursementID: any; payableTo:String; favouring:String; financierId: any; beneficiaryName: any; applicantName: any; favouringName: any; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: string; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: string; trancheDisbursementFlag: string; trancheDisbursementJson: any;active:any };
  ReqTPDetails: { leadID: any; disbursementID: any; payableTo:String; favouring:String; bankerId: any; beneficiaryName: any; applicantName: any; favouringName: any; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: string; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: string; trancheDisbursementFlag: string; trancheDisbursementJson: any;active:any };
  ReqCoAppDetails: { leadID: any; disbursementID: any; payableTo:String; favouring:String; beneficiaryName: any; applicantName: any; favouringName: any; beneficiaryAccountNo: any; beneficiaryBank: any; ifscCode: any; beneficiaryBranch: any; instrumentType: any; instrumentNumber: any; instrumentDate: string; favouringBankOfDraw: any; favouringBankBranch: any; loanNumber: any; beneficiaryAddress1: any; paymentMethod: any; disbursementAmount: any; deductChargesFlag: string; trancheDisbursementFlag: string; trancheDisbursementJson: any;active:any };
  
  constructor(
    private fb: FormBuilder,
    private labelsData: LabelsService,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private disbursementService:DisbursementService
  ) {

  }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.disbLOV();
    this.getCoAppDetails();
    this.getApplicantDetails()
    //this.fetchDisbursementDetails();//enable this to fetch data,redirects fro dashboard
    this.fetchLoanDetails();
  }

  get dealerTrancheDetail(): FormArray {
    return <FormArray>this.trancheDealerForm.get('trancheDealerArray')
  }
  get appTrancheDetail(): FormArray {
    return <FormArray>this.trancheAppForm.get('trancheAppArray')
  }
  get coAppTrancheDetail(): FormArray {
    return <FormArray>this.trancheCoAppForm.get('trancheCoAppArray')
  }
  get bankerTrancheDetail(): FormArray {
    return <FormArray>this.trancheBankerForm.get('trancheBankerArray')
  }
  get financierTrancheDetail(): FormArray {
    return <FormArray>this.trancheFinancierForm.get('trancheFinancierArray')
  }
  get tpTrancheDetail(): FormArray {
    return <FormArray>this.trancheTPForm.get('trancheTpArray')
  }
  
  
  
  
  
  addEmptyTrancheRow(container,trancheId) {
    let object={
      "tranche_disbursement_type": "",
      "trancheDisbursePercentage": "",
      "tranche_disbursement_amount": "",
      "trancheDisburseDate": "",
      "disbursement_id":"",
      "tranche_disbursement_id":(trancheId==0?1:trancheId)+'',
    }
    if(container=='1'){
      this.trancheDealerList.push(object)
    }else if(container=='2'){
      this.trancheAppList.push(object)
    }if(container=='3'){
      this.trancheCoAppList.push(object)
    }if(container=='4'){
      this.trancheBankerList.push(object)
    }if(container=='5'){
      this.trancheFinancierList.push(object)
    }if(container=='6'){
      this.trancheTpList.push(object)
    }
  }
  addRow(container) {
    console.log(this.trancheDealerList.length)
    if(container=='1'){
      if(this.trancheDealerList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheDealerList.length+1);
        this.dealerTrancheDetail.push(this.initTranche());
        }
    }else if(container=='2'){
      if(this.trancheAppList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheAppList.length);
        this.appTrancheDetail.push(this.initTranche());
        }
    }else if(container=='3'){
      if(this.trancheCoAppList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheCoAppList.length);
        this.coAppTrancheDetail.push(this.initTranche());
        }     
    }else if(container=='4'){
      if(this.trancheBankerList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheBankerList.length);
        this.bankerTrancheDetail.push(this.initTranche());
        }     
    }else if(container=='5'){
      if(this.trancheFinancierList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheFinancierList.length);
        this.financierTrancheDetail.push(this.initTranche());
        }      
    }else if(container=='6'){
      if(this.trancheTpList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheTpList.length);
        this.tpTrancheDetail.push(this.initTranche());
        }     
    }
  }
  deleteRow(index,container) {
    if(container=='1'){
      this.trancheDealerList.splice(index, 1);
      let formArray = <FormArray>this.trancheDealerForm.get('trancheDealerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('1');//dealer
      }else{
        for (let i = 0; i < this.trancheDealerList.length; i++) {
          this.trancheDealerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    }else if(container=='2'){
      this.trancheAppList.splice(index, 1);
      let formArray = <FormArray>this.trancheAppForm.get('trancheAppArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('2');//dealer
      }else{
        for (let i = 0; i < this.trancheAppList.length; i++) {
          this.trancheAppList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    }else if(container=='3'){
      this.trancheCoAppList.splice(index, 1);
      let formArray = <FormArray>this.trancheCoAppForm.get('trancheCoAppArray');
      formArray.removeAt(index);
      if(formArray.length == 0) {
        this.addRow('3');//dealer
      }else{
        for (let i = 0; i < this.trancheCoAppList.length; i++) {
          this.trancheCoAppList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }else if(container=='4'){
      this.trancheBankerList.splice(index, 1);
      let formArray = <FormArray>this.trancheBankerForm.get('trancheBankerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('4');//dealer
      }else{
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }else if(container=='5'){
      this.trancheFinancierList.splice(index, 1);
      let formArray = <FormArray>this.trancheFinancierForm.get('trancheFinancierArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('5');//dealer
      }else{
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }  
    }else if(container=='6'){
      this.trancheTpList.splice(index, 1);
      let formArray = <FormArray>this.trancheTPForm.get('trancheTpArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('6');//dealer
      }else{
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }
  }
  initTranche(): FormGroup {
    let groupObject={
      tranche_disbursement_type: ['', Validators.required],
      trancheDisbursePercentage: [null, Validators.required],      
      tranche_disbursement_amount: [''],
      trancheDisburseDate: [null],
      disbursement_id:[''],
      tranche_disbursement_id:['']
    }
    return this.fb.group(groupObject);
  }



  getCumulativeDisbAmnt(event : any,container){ //disbursement Calculation part
   
    if(this.dealerObjInfo['disbursementAmount'] && container=='1'){
      this.dealerObjInfo['disbursementAmount'] = (event.target.value)?event.target.value:null;
      if(this.dealerObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheDealerList,'1')
      }
    }else if(this.applicantObjInfo['disbursementAmount'] && container=='2'){
      this.applicantObjInfo['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.applicantObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheAppList,'1')
      }
    }else if(this.coApplicantObjInfo['disbursementAmount'] && container=='3'){
      this.coApplicantObjInfo['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.coApplicantObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheCoAppList,'1')
      }
    }else if(this.bankerObjInfo['disbursementAmount'] && container=='4'){
      this.bankerObjInfo['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.bankerObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheBankerList,'1')
      }
    }else if(this.financierObjInfo['disbursementAmount'] && container=='5'){
      this.financierObjInfo['disbursementAmount'] = (event.target.value)?event.target.value:null;
      if(this.financierObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheFinancierList,'1')
      }
    }else if(this.thirdPartyObjInfo['disbursementAmount'] && container=='6'){
      this.thirdPartyObjInfo['disbursementAmount']=(event.target.value)?event.target.value:null;
      if(this.thirdPartyObjInfo['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheTpList,'1')
      }
    }
   // console.log(this.dealerObjInfo['disbursementAmount']);
    let a = this.dealerObjInfo['disbursementAmount']?parseInt(this.dealerObjInfo['disbursementAmount']):0;
    let b = this.applicantObjInfo['disbursementAmount']?parseInt(this.applicantObjInfo['disbursementAmount']):0;
    let c = this.coApplicantObjInfo['disbursementAmount']?parseInt(this.coApplicantObjInfo['disbursementAmount']):0;
    let d = this.bankerObjInfo['disbursementAmount']?parseInt(this.bankerObjInfo['disbursementAmount']):0;
    let e = this.financierObjInfo['disbursementAmount']?parseInt(this.financierObjInfo['disbursementAmount']):0;
    let f = this.thirdPartyObjInfo['disbursementAmount']?parseInt(this.thirdPartyObjInfo['disbursementAmount']):0;
    let cumulativeDisAmnt = a+b+c+d+e+f;
    //console.log(cumulativeDisAmnt)   
    if(!this.dealerObjInfo['disbursementAmount'] && container=='1' && this.dealerObjInfo['trancheDisbursementFlag']){
      this.dealerObjInfo['trancheDisbursementFlag']=false;
      this.showTrancheTable = false;
      this.trancheDealerList=[];
    }else if(!this.applicantObjInfo['disbursementAmount'] && container=='2' && this.applicantObjInfo['trancheDisbursementFlag']){
      this.applicantObjInfo['trancheDisbursementFlag']=false;
      this.showAppTrancheTable = false;
      this.trancheAppList=[];
    }else if(!this.coApplicantObjInfo['disbursementAmount'] && container=='3' && this.coApplicantObjInfo['trancheDisbursementFlag']){
      this.coApplicantObjInfo['trancheDisbursementFlag']=false;
      this.showCoAppTrancheTable = false;
      this.trancheCoAppList=[];
    }else if(!this.bankerObjInfo['disbursementAmount'] && container=='4' && this.bankerObjInfo['trancheDisbursementFlag']){
      this.bankerObjInfo['trancheDisbursementFlag']=false;
      this.showBankerTrancheTable = false;
      this.trancheBankerList=[];
    }else if(!this.financierObjInfo['disbursementAmount'] && container=='5' && this.financierObjInfo['trancheDisbursementFlag']){
      this.financierObjInfo['trancheDisbursementFlag']=false;
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList=[];
    }else if(!this.thirdPartyObjInfo['disbursementAmount'] && container=='6' && this.thirdPartyObjInfo['trancheDisbursementFlag']){
      this.thirdPartyObjInfo['trancheDisbursementFlag']=false;
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList=[];
    } 
    
    if(cumulativeDisAmnt>this.totalDisbursementAmount){
      if(container=='1'){
        this.dealerObjInfo['disbursementAmount']=null;
        if(this.dealerObjInfo['trancheDisbursementFlag']){
          this.dealerObjInfo['trancheDisbursementFlag']=false;
          this.showTrancheTable = false;
          this.trancheDealerList=[];
        }
        return;
      }else if(container=='2'){
        this.applicantObjInfo['disbursementAmount']=null;
        if(this.applicantObjInfo['trancheDisbursementFlag']){
          this.applicantObjInfo['trancheDisbursementFlag']=false;
          this.showAppTrancheTable = false;
          this.trancheAppList=[];
        }
        return;
      }else if(container=='3'){
        this.coApplicantObjInfo['disbursementAmount']=null;
        if(this.coApplicantObjInfo['trancheDisbursementFlag']){
          this.coApplicantObjInfo['trancheDisbursementFlag']=false;
          this.showCoAppTrancheTable = false;
          this.trancheCoAppList=[];
        }
        return;
      }else if(container=='4'){
        this.bankerObjInfo['disbursementAmount']=null;
        if(this.bankerObjInfo['trancheDisbursementFlag']){
          this.bankerObjInfo['trancheDisbursementFlag']=false;
          this.showBankerTrancheTable = false;
          this.trancheBankerList=[];
        }
        return;
      }else if(container=='5'){
        this.financierObjInfo['disbursementAmount']=null;
        if(this.financierObjInfo['trancheDisbursementFlag']){
          this.financierObjInfo['trancheDisbursementFlag']=false;
          this.showFinancierTrancheTable = false;
          this.trancheFinancierList=[];
        }
        return;
      }else if(container=='6'){
        this.thirdPartyObjInfo['disbursementAmount']=null;
        if(this.thirdPartyObjInfo['trancheDisbursementFlag']){
          this.thirdPartyObjInfo['trancheDisbursementFlag']=false;
          this.showThirdPartyTrancheTable = false;
          this.trancheTpList=[];
        }
        return;
      }
     
    }
  }

  validatePercentage(trancheList,container){
    this.dealerObjInfo['disbursementAmount']=this.dealerObjInfo['disbursementAmount']?parseInt(this.dealerObjInfo['disbursementAmount']):null;
    this.applicantObjInfo['disbursementAmount']=this.applicantObjInfo['disbursementAmount'] ? parseInt(this.applicantObjInfo['disbursementAmount']):null;
    this.coApplicantObjInfo['disbursementAmount']=this.coApplicantObjInfo['disbursementAmount']?parseInt(this.coApplicantObjInfo['disbursementAmount']):null;
    this.bankerObjInfo['disbursementAmount']=this.bankerObjInfo['disbursementAmount']?parseInt(this.bankerObjInfo['disbursementAmount']):null;
    this.financierObjInfo['disbursementAmount']=this.financierObjInfo['disbursementAmount']?parseInt(this.financierObjInfo['disbursementAmount']):null;
    this.thirdPartyObjInfo['disbursementAmount']=this.thirdPartyObjInfo['disbursementAmount']?parseInt(this.thirdPartyObjInfo['disbursementAmount']):null;

      var totalPercentage;
      for (let i = 0; i < trancheList.length; i++) {
        //trancheList['i'].tranche_disbursement_id=i;
        let tranchePercentage = parseInt(trancheList[i].trancheDisbursePercentage);
        tranchePercentage=tranchePercentage?tranchePercentage:null
        totalPercentage = totalPercentage?parseInt(totalPercentage)+tranchePercentage:tranchePercentage;
        if(totalPercentage>100){//total percentage should not exceed more than 100
          trancheList[i].trancheDisbursePercentage=null;
          trancheList[i].tranche_disbursement_amount=null;
          return;
        }
       if(container=='1'){
          trancheList[i].tranche_disbursement_amount=(this.dealerObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='2'){
        trancheList[i].tranche_disbursement_amount=(this.applicantObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='3'){
        trancheList[i].tranche_disbursement_amount=(this.coApplicantObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='4'){
        trancheList[i].tranche_disbursement_amount=(this.bankerObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='5'){
        trancheList[i].tranche_disbursement_amount=(this.bankerObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='6'){
        trancheList[i].tranche_disbursement_amount=(this.thirdPartyObjInfo['disbursementAmount']/100)*tranchePercentage;
       }
    
      }
  
  }
 

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.amountLength = this.labels.validationData.disburseAmountType.maxLength;
        this.ifscLength = this.labels.validationData.disburseAmountType.maxLength;

      },
      (error) => console.log('Sourcing details Label Error', error)
    );
  }

  disbLOV() {
    this.disbursementService
      .getDisbLOV()
      .subscribe((res: any) => {
        if(res.Error=='0'){
          var resData = res.ProcessVariables;
          console.log("LOVDATA",resData)
          this.accountTypeLov=resData.AccountType;
          this.bankerLov=resData.BankerLOV;
          this.disburseToLov=resData.DisburseTo;
          this.financierLov=resData.FinancierLOV;
          this.paymentLov=resData.PaymentMethod;
          this.trancheDisbLov=resData.TrancheDisbType;
          this.instrumentTypeLov=resData.InstrumentType;
        }
      
      });
  }

  getCoAppDetails(){
    this.disbursementService
      .getCoAppNames(this.disbLeadId)
      .subscribe((res: any) => {
        if(res.Error=='0'){
          var resData = res.ProcessVariables;
          console.log(resData)
          this.coAppNamesLov=resData.coApplicantName;
        }
      
      });
  }
  onDealerCodeSearch(event: any){
    let inputString = event;
    console.log('inputStringDelr', event);
    this.disbursementService.getDealerDetails(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      //const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log("dealerCodeData",response)
        const dealerDetailsData=response.ProcessVariables.DealerDetails;
        if(dealerDetailsData){
          this.duplicateDealerDetails = dealerDetailsData
        this.dealerObjInfo = this.duplicateDealerDetails;
        this.dealerDetailsForm.patchValue({ address: (this.duplicateDealerDetails)? this.duplicateDealerDetails.beneficiaryAddress1 +','+  this.duplicateDealerDetails.beneficiaryAddress2 + ',' + this.duplicateDealerDetails.beneficiaryAddress3: null });
        }else {
          this.dealerObjInfo = {};
          this.showTrancheTable = false;
          this.trancheDealerList=[];
        }
        
      }
    });
  }
  getApplicantDetails(){
    this.disbursementService.getApplicantDetails(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      //const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log("dealerCodeData",response)
        this.applicantDetailsData=response.ProcessVariables.ApplicantDetails;
        const duplicateAppDetails: any = { ...this.applicantDetailsData };
        this.applicantObjInfo = duplicateAppDetails;
        this.dealerDetailsForm.patchValue({ address: (this.dealerDetailsData)? this.dealerDetailsData.addressLine1 +','+  this.dealerDetailsData.addressLine2 + ',' + this.dealerDetailsData.addressLine3: null });
      }
    });
  }
  fetchLoanDetails(){
    this.disbursementService.fetchLoanDetails(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        console.log("LoanDetails",response)
        this.loanDetailsData= (response.ProcessVariables.LoanDetails) ? response.ProcessVariables.LoanDetails : {};
        this.totalDisbursementAmount=this.loanDetailsData?parseInt(this.loanDetailsData['approvedAmount']):0;
      }
    });
  }

  setModeOfPayment(event: any, val){
    if(val == 'dealer'){
    this.showBankDetails = false;
    console.log(this.duplicateDealerDetails);
    if(!this.showBankDetails){
        this.bankdetailsformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset();
      });
        this.bankdetailsformArray.forEach(key => {
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });
    }
    this.showDDDetails = false;
    if(!this.showDDDetails){
      this.chequeDDformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });
        
    }
    this.showCASADetails = false;
    if(!this.showCASADetails){
      this.casaformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });
    }
    }
    if(val == 'applicant'){
    this.showAppBankDetails = false;
    if(!this.showAppBankDetails){
      this.bankdetailsformArray.forEach(key => {
        this.appDetailsForm.get(key).reset() ;
      });
        this.bankdetailsformArray.forEach(key => {
        this.appDetailsForm.get(key).setErrors(null) ;
      });
      
    }
    this.showAppDDDetails = false;
    if(!this.showAppDDDetails){
      this.chequeDDformArray.forEach(key => {
        this.appDetailsForm.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.appDetailsForm.get(key).setErrors(null) ;
      });
        
    }
    this.showAppCASADetails = false;
    if(!this.showAppCASADetails){
      this.casaformArray.forEach(key => {
        this.appDetailsForm.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.appDetailsForm.get(key).setErrors(null) ;
      });
        
    }

    }
    if(val == 'coApplicant'){
    this.showCoAppBankDetails = false;
    if(!this.showCoAppBankDetails){
        this.bankdetailsformArray.forEach(key => {
        this.coAppDetailsForm.get(key).reset() ;
        });
        this.bankdetailsformArray.forEach(key => {
        this.coAppDetailsForm.get(key).setErrors(null) ;
      });
        
    }
    this.showCoAppDDDetails = false;
    if(!this.showCoAppDDDetails){
      
      this.chequeDDformArray.forEach(key => {
        this.coAppDetailsForm.get(key).reset() ;
      });
      this.chequeDDformArray.forEach(key => {
        this.coAppDetailsForm.get(key).setErrors(null) ;
      });
    }
    this.showCoAppCASADetails = false;
    if(!this.showCoAppCASADetails){
        this.casaformArray.forEach(key => {
        this.coAppDetailsForm.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.coAppDetailsForm.get(key).setErrors(null) ;
      });
    }
    }
    if(val == 'banker'){
      this.showBankerBankDetails = false;
      if(!this.showBankerBankDetails){
        this.bankdetailsformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset() ;
        });
        this.bankdetailsformArray.forEach(key => {
          this.bankerDetailsForm.get(key).setErrors(null) ;
        });
        
      }
      this.showBankerDDDetails = false;
      if(!this.showBankerDDDetails){
          this.chequeDDformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset() ;
        });
          this.chequeDDformArray.forEach(key => {
          this.bankerDetailsForm.get(key).setErrors(null) ;
        });
      }
      this.showBankerCASADetails = false;
      if(!this.showBankerCASADetails){
          this.casaformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset() ;
        });
          this.casaformArray.forEach(key => {
          this.bankerDetailsForm.get(key).setErrors(null) ;
        });
      }
      }
    if(val == 'financier'){
      this.showFinBankDetails = false;
      if(!this.showFinBankDetails){
        this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
        this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).setErrors(null) ;
        });
        
      }
      this.showFinDDDetails = false;
      if(!this.showFinDDDetails){
          this.chequeDDformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
          this.chequeDDformArray.forEach(key => {
          this.financierDetailsForm.get(key).setErrors(null) ;
        });
      }
      this.showFinCASADetails = false;
      if(!this.showFinCASADetails){
          this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
          this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).setErrors(null) ;
        });
      }
      }
    if(val == 'thirdParty'){
    this.showTPBankDetails = false;
    if(!this.showTPBankDetails){
      this.bankdetailsformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
      this.bankdetailsformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).setErrors(null) ;
      });
      
    }
    this.showTPDDDetails = false;
    if(!this.showTPDDDetails){
        this.chequeDDformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).setErrors(null) ;
      });
    }
    this.showTPCASADetails = false;
    if(!this.showTPCASADetails){
        this.casaformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).setErrors(null) ;
      });
    }
    }

    this.mopVal = event.target.value;
    if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){// NEFT &  RTGS
      if(val == 'dealer')
      this.showBankDetails = true;
      if(val == 'applicant')
      this.showAppBankDetails = true;
      if(val == 'coApplicant')
      this.showCoAppBankDetails = true;
      if(val == 'banker')
      this.showBankerBankDetails = true;
      if(val == 'financier')
      this.showFinBankDetails = true;
      if(val == 'thirdParty')
      this.showTPBankDetails = true;
    }else if(this.mopVal == '1MODEOFPAYMENT'){//cheque or dd
      if(val == 'dealer')
      this.showDDDetails = true;
      if(val == 'applicant')
      this.showAppDDDetails = true;
      if(val == 'coApplicant')
      this.showCoAppDDDetails = true;
      if(val == 'banker')
      this.showBankerDDDetails = true;
      if(val == 'financier')
      this.showFinDDDetails = true;
      if(val == 'thirdParty')
      this.showTPDDDetails = true;
    }else if(this.mopVal == '2MODEOFPAYMENT'){//casa
      if(val == 'dealer')
      this.showCASADetails = true;
      if(val == 'applicant')
      this.showAppCASADetails = true;
      if(val == 'coApplicant')
      this.showCoAppCASADetails = true;
      if(val == 'banker')
      this.showBankerCASADetails = true;
      if(val == 'financier')
      this.showFinCASADetails = true;
      if(val == 'thirdParty')
      this.showTPCASADetails = true;
    }
  }

  disburseToVal(val){
    console.log('diburseToValues',this.disburseTo)
    // console.log(val,val.length)
    this.disburseToDealer=false;
    this.disburseToApp=false;
    this.disburseToCoApp=false;
    this.disburseToBanker=false;
    this.disburseToFinancier=false;
    this.disburseToThirdParty=false;
    this.disburseToIBT=false;
    for (let i = 0; i < this.disburseToLov.length; i++) {
        for (let j = 0; j < val.length; j++) {
           if(this.disburseToLov[i]['key']==(val)[j]){
             if(val[j]=="1DISBURSETO"){
              this.disburseToDealer=true;
             }
             if(val[j]=="2DISBURSETO"){
              this.disburseToApp=true;
             }
             if(val[j]=="3DISBURSETO"){
              this.disburseToCoApp=true;
            }
            if(val[j]=="4DISBURSETO"){
              this.disburseToBanker=true;
            }
            if(val[j]=="5DISBURSETO"){
              this.disburseToFinancier=true;
              //this.getBasicFiancierLov();
            }
            if(val[j]=="6DISBURSETO"){
              this.disburseToThirdParty=true;
              //this.getBasicThirdPartyLov();
            }
            if(val[j]=="7DISBURSETO"){
              this.disburseToIBT=true;
              //this.getBasicIBTLov();
            }
           }
        
        }
    }
    if(!this.disburseToDealer){
      this.dealerDetailsForm.reset();
      this.showTrancheTable = false;
      this.trancheDealerList=[];
      this.dealerformArray.forEach(key => {
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });
      
    }
    if(!this.disburseToApp){
      this.appDetailsForm.reset();
      this.showAppTrancheTable = false;
      this.trancheAppList=[];
      this.commonFormArray.forEach(key => {
        this.appDetailsForm.get(key).setErrors(null) ;
      });
      
    }
     if(!this.disburseToCoApp){
       this.coAppDetailsForm.reset();
       this.showCoAppTrancheTable = false;
       this.trancheCoAppList=[];
       this.commonFormArray.forEach(key => {
        this.coAppDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToBanker){
      this.bankerDetailsForm.reset();
      this.showBankerTrancheTable = false;
      this.trancheBankerList=[];
       this.bankerformArray.forEach(key => {
        this.bankerDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToFinancier){
      this.financierDetailsForm.reset();
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList=[];
      this.finformArray.forEach(key => {
        this.financierDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToThirdParty){
      this.thirdPartyDetailsForm.reset();
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList=[];
      this.commonFormArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToIBT){
      this.ibtDetailsForm.reset();
      this.ibtDetailsForm.controls['ibtFavoringName'].setErrors(null);
      this.ibtDetailsForm.controls['ibtLoanAccNumber'].setErrors(null);
      // this.dealerformArray.forEach(key => {
      //   this.ibtDetailsForm.get(key).setErrors(null) ;
      // });
    }
    // this.disburseToArray.forEach(element => {
    //   if(element==)
      
    // });
  }
  // this.qualityCriteriaForm.controls.avgAMBval.reset();


  setPatchData(data) {
   // this.disbursementDetailsForm.patchValue({ bizDivision: 'EBBIZDIV' });
  }
selectTranche(val,container,fetchList){
  let pushListObject={
    "tranche_disbursement_type": "",
    "trancheDisbursePercentage": "",
    "tranche_disbursement_amount": '',
    "trancheDisburseDate": "",
    "disbursement_id":"",
    "tranche_disbursement_id":'1',
  }
  if(fetchList){
     pushListObject={
      "tranche_disbursement_type": "",
      "trancheDisbursePercentage": "",
      "tranche_disbursement_amount": '',
      "trancheDisburseDate": "",
      "disbursement_id":"",
      "tranche_disbursement_id":'',
    }
  }
  if(container=='1' && val == true){
    this.showTrancheTable = true;
    this.trancheDealerForm = this.fb.group({
      trancheDealerArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheDealerForm.get('trancheDealerArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheDealerForm.get('trancheDealerArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
        //  this.snackBar.open(formGroup['errors']['errorMsg'], '', { duration: 3000 });
          return;
        }
      });
    });
    this.trancheDealerList.push(pushListObject);
  }else if (container=='2' && val == true){
    this.showAppTrancheTable = true;
    this.trancheAppForm = this.fb.group({
      trancheAppArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheAppForm.get('trancheAppArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheAppForm.get('trancheAppArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheAppList.push(pushListObject);
  }else if (container=='3' && val == true){
    this.showCoAppTrancheTable = true;
    this.trancheCoAppForm = this.fb.group({
      trancheCoAppArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheCoAppForm.get('trancheCoAppArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheCoAppForm.get('trancheCoAppArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheCoAppList.push(pushListObject);
  }else if (container=='4' && val == true){
    this.showBankerTrancheTable = true;
    this.trancheBankerForm = this.fb.group({
      trancheBankerArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheBankerForm.get('trancheBankerArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheBankerForm.get('trancheBankerArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheBankerList.push(pushListObject);
  }else if (container=='5' && val == true){
    this.showFinancierTrancheTable = true;
    this.trancheFinancierForm = this.fb.group({
      trancheFinancierArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheFinancierForm.get('trancheFinancierArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheFinancierForm.get('trancheFinancierArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheFinancierList.push(pushListObject);
  }else if (container=='6' && val == true){
    this.showThirdPartyTrancheTable = true;
    this.trancheTPForm = this.fb.group({
      trancheTpArray: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheTPForm.get('trancheTpArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheTPForm.get('trancheTpArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheTpList.push(pushListObject);
  }else {
    if(container=='1'){
      this.showTrancheTable = false;
      this.trancheDealerList=[];
    }else if(container=='2'){
      this.showAppTrancheTable = false;
      this.trancheAppList=[];
    }else if(container=='3'){
      this.showCoAppTrancheTable = false;
      this.trancheCoAppList=[];
    }else if(container=='4'){
      this.showBankerTrancheTable = false;
      this.trancheBankerList=[];
    }else if(container=='5'){
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList=[];
    }else if(container=='6'){
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList=[];
    }
        
  }
  }

selectCheckBox(flag,val){
  this.dealerObjInfo['deductChargesFlag']=false;
  this.applicantObjInfo['deductChargesFlag']=false;
  this.coApplicantObjInfo['deductChargesFlag']=false;
  this.bankerObjInfo['deductChargesFlag']=false;
  this.financierObjInfo['deductChargesFlag']=false;
  this.thirdPartyObjInfo['deductChargesFlag']=false;
  this.internalBTObjInfo['deductChargesFlag']=false

  
  if(val==1 && flag){
    this.dealerObjInfo['deductChargesFlag']=true;
  }else if (val ==2 && flag){
    this.applicantObjInfo['deductChargesFlag']=true;
  }else if (val ==3 && flag){
    this.coApplicantObjInfo['deductChargesFlag']=true;
  }else if (val ==4 && flag){
    this.bankerObjInfo['deductChargesFlag']=true;
  }else if (val ==5 && flag){
    this.financierObjInfo['deductChargesFlag']=true;
  }else if (val ==6 && flag){
    this.thirdPartyObjInfo['deductChargesFlag']=true;
  }else if(val ==7 && flag){
    this.internalBTObjInfo['deductChargesFlag']=true
  }
}
  initForm() {
    console.log(this.disburseToDealer)
    this.dealerDetailsForm = this.fb.group({
      dealerCode:new FormControl({value:this.dealerCode}, Validators.required),
      beneficiaryName: new FormControl({value:this.dealerObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.dealerObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.dealerObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.dealerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.dealerObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.dealerObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.dealerObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.dealerObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.dealerObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.dealerObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.dealerObjInfo['loanNumber']}, Validators.required),
      address:new FormControl(''),
      paymentMethod:new FormControl({value:this.dealerObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.dealerObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.appDetailsForm = this.fb.group({
      beneficiaryName: new FormControl({value:this.applicantObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.applicantObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.applicantObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.applicantObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.applicantObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.applicantObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.applicantObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.applicantObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.applicantObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.applicantObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.applicantObjInfo['loanNumber']}, Validators.required),
      appAddress: new FormControl(''),
      paymentMethod: new FormControl({value:this.applicantObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.applicantObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),

    })
    this.coAppDetailsForm = this.fb.group({
      beneficiaryName: new FormControl({value:this.coApplicantObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.coApplicantObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.coApplicantObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.coApplicantObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.coApplicantObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.coApplicantObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.coApplicantObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.coApplicantObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.coApplicantObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.coApplicantObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.coApplicantObjInfo['loanNumber']}, Validators.required),
      coAppAddress: new FormControl(''),
      paymentMethod: new FormControl({value:this.coApplicantObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.coApplicantObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.bankerDetailsForm = this.fb.group({
      bankerId: new FormControl({value:this.bankerObjInfo['bankerId']}, Validators.required),
      beneficiaryName:new FormControl({value:this.bankerObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.bankerObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.bankerObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.bankerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.bankerObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.bankerObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.bankerObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.bankerObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.bankerObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.bankerObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.bankerObjInfo['loanNumber']}, Validators.required),
      bankerAddress: new FormControl(''),
      paymentMethod: new FormControl({value:this.bankerObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.bankerObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.financierDetailsForm = this.fb.group({
      financierId: new FormControl({value:this.financierObjInfo['financierId']}, Validators.required),
      beneficiaryName:new FormControl({value:this.financierObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.financierObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.financierObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.financierObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.financierObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.financierObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.financierObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.financierObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.financierObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.financierObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.financierObjInfo['loanNumber']}, Validators.required),
      financierAddress: new FormControl(''),
      paymentMethod: new FormControl({value:this.financierObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.financierObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.thirdPartyDetailsForm = this.fb.group({
      //beneficiaryName:new FormControl(''),
      beneficiaryName: new FormControl({value:this.thirdPartyObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.thirdPartyObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.thirdPartyObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.thirdPartyObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.thirdPartyObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.thirdPartyObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.thirdPartyObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl({value:this.thirdPartyObjInfo['instrumentDate']}, Validators.required),
      favouringBankOfDraw:new FormControl({value:this.thirdPartyObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.thirdPartyObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.thirdPartyObjInfo['loanNumber']}, Validators.required),
      thirdPartyAddress: new FormControl(''),
      paymentMethod: new FormControl({value:this.thirdPartyObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.thirdPartyObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.ibtDetailsForm = this.fb.group({
      ibtFavoringName:new FormControl({value:this.internalBTObjInfo['ibtFavoringName']}, Validators.required),
      ibtLoanAccNumber:new FormControl({value:this.internalBTObjInfo['ibtLoanAccNumber']}, Validators.required),
      deductChargesFlag:new FormControl(''),

    })
    this.disbursementDetailsForm = this.fb.group({
      disburseTo:new FormControl({value:this.disburseTo}, Validators.required),
      //disburseTo:new FormControl(''),
      toDeductCharges:[''],
    })
  }

  saveAndUpdate(){
    // console.log('1', this.dealerDetailsForm.valid);
    // console.log('2', this.appDetailsForm.valid);
    // console.log('3', this.coAppDetailsForm.valid);
    // console.log('4', this.bankerDetailsForm.valid);
    // console.log('5', this.financierDetailsForm.valid);
    // console.log('6', this.thirdPartyDetailsForm.valid);
    // console.log('7', this.ibtDetailsForm.valid);
    const dealerFormValue = this.dealerDetailsForm.getRawValue();
    dealerFormValue.trancheDisbursementJson = this.trancheDealerForm?JSON.stringify(this.trancheDealerForm.value.trancheDealerArray):'';
    this.ReqDealerDetails = {
      leadID: this.dealerObjInfo['leadID'],
      disbursementID: this.dealerObjInfo['disbursementID'] ? this.dealerObjInfo['disbursementID'] : null,
      payableTo:"1DISBURSETO",
      favouring:"Dealer",
      dealerCode: dealerFormValue.dealerCode,
      beneficiaryName:dealerFormValue.beneficiaryName,
      applicantName: dealerFormValue.beneficiaryName,
      favouringName : dealerFormValue.beneficiaryName,
      beneficiaryAccountNo:dealerFormValue.beneficiaryAccountNo,
      beneficiaryBank:dealerFormValue.beneficiaryBank,
      ifscCode:dealerFormValue.ifscCode,
      beneficiaryBranch:dealerFormValue.beneficiaryBranch,
      instrumentType:dealerFormValue.instrumentType ? dealerFormValue.instrumentType.value : '',
      instrumentNumber: dealerFormValue.instrumentNumber ? dealerFormValue.instrumentNumber.value : null,
      instrumentDate: dealerFormValue.instrumentDate ? (dealerFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(dealerFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: dealerFormValue.favouringBankOfDraw ? dealerFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: dealerFormValue.favouringBankBranch ? dealerFormValue.favouringBankBranch.value : '',
      loanNumber: dealerFormValue.loanNumber ? dealerFormValue.loanNumber.value : '',
      beneficiaryAddress1 : dealerFormValue.address,
      paymentMethod:dealerFormValue.paymentMethod,
      disbursementAmount:dealerFormValue.disbursementAmount,
      deductChargesFlag: (dealerFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (dealerFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:dealerFormValue.trancheDisbursementJson,
      active:'1'
    };

    const appFormValue = this.appDetailsForm.getRawValue();
    appFormValue.trancheDisbursementJson = this.trancheAppForm?JSON.stringify(this.trancheAppForm.value.trancheAppArray):'';
    this.ReqApplicantDetails = {
      leadID: this.applicantObjInfo['leadID'],
      disbursementID: this.applicantObjInfo['disbursementID'] ? this.applicantObjInfo['disbursementID'] : null,
      payableTo:"2DISBURSETO",
      favouring:"Applicant",
      beneficiaryName:appFormValue.beneficiaryName,
      applicantName: appFormValue.beneficiaryName,
      favouringName : appFormValue.beneficiaryName,
      beneficiaryAccountNo:appFormValue.beneficiaryAccountNo,
      beneficiaryBank:appFormValue.beneficiaryBank,
      ifscCode:appFormValue.ifscCode,
      beneficiaryBranch:appFormValue.beneficiaryBranch,
      instrumentType:appFormValue.instrumentType ? appFormValue.instrumentType.value : '',
      instrumentNumber: appFormValue.instrumentNumber ? appFormValue.instrumentNumber.value : null,
      instrumentDate: appFormValue.instrumentDate ? (appFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(appFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: appFormValue.favouringBankOfDraw ? appFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: (appFormValue.favouringBankBranch) ? appFormValue.favouringBankBranch.value : '',
      loanNumber: appFormValue.loanNumber ? appFormValue.loanNumber.value : '',
      beneficiaryAddress1 : appFormValue.address,
      paymentMethod:appFormValue.paymentMethod,
      disbursementAmount:appFormValue.disbursementAmount,
      deductChargesFlag: (appFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (appFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:appFormValue.trancheDisbursementJson,
      active:'1'
    };

    const coAppFormValue = this.coAppDetailsForm.getRawValue();
    coAppFormValue.trancheDisbursementJson = this.trancheCoAppForm?JSON.stringify(this.trancheCoAppForm.value.trancheCoAppArray):'';
    this.ReqCoAppDetails = {
      leadID: this.bankerObjInfo['leadID'],
      disbursementID: this.bankerObjInfo['disbursementID'] ? this.bankerObjInfo['disbursementID'] : null,
      payableTo:"3DISBURSETO",
      favouring:"Co Applicant",
      beneficiaryName:coAppFormValue.beneficiaryName,
      applicantName: coAppFormValue.beneficiaryName,
      favouringName : coAppFormValue.beneficiaryName,
      beneficiaryAccountNo:coAppFormValue.beneficiaryAccountNo,
      beneficiaryBank:coAppFormValue.beneficiaryBank,
      ifscCode:coAppFormValue.ifscCode,
      beneficiaryBranch:coAppFormValue.beneficiaryBranch,
      instrumentType:coAppFormValue.instrumentType ? coAppFormValue.instrumentType.value : '',
      instrumentNumber: coAppFormValue.instrumentNumber ? coAppFormValue.instrumentNumber.value : null,
      instrumentDate: coAppFormValue.instrumentDate ? (coAppFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(coAppFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: coAppFormValue.favouringBankOfDraw ? coAppFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: (coAppFormValue.favouringBankBranch) ? coAppFormValue.favouringBankBranch.value : '',
      loanNumber: coAppFormValue.loanNumber ? coAppFormValue.loanNumber.value : '',
      beneficiaryAddress1 : coAppFormValue.address,
      paymentMethod:coAppFormValue.paymentMethod,
      disbursementAmount:coAppFormValue.disbursementAmount,
      deductChargesFlag: (coAppFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (coAppFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:coAppFormValue.trancheDisbursementJson,
      active:'1'
    };

    const bankerFormValue = this.bankerDetailsForm.getRawValue();
    bankerFormValue.trancheDisbursementJson = this.trancheBankerForm?JSON.stringify(this.trancheBankerForm.value.trancheBankerArray):'';
    this.ReqBankerDetails = {
      leadID: this.bankerObjInfo['leadID'],
      disbursementID: this.bankerObjInfo['disbursementID'] ? this.bankerObjInfo['disbursementID'] : null,
      payableTo:"4DISBURSETO",
      favouring:"Banker",
      bankerId:bankerFormValue.bankerId,
      beneficiaryName:bankerFormValue.beneficiaryName,
      applicantName: bankerFormValue.beneficiaryName,
      favouringName : bankerFormValue.beneficiaryName,
      beneficiaryAccountNo:bankerFormValue.beneficiaryAccountNo,
      beneficiaryBank:bankerFormValue.beneficiaryBank,
      ifscCode:bankerFormValue.ifscCode,
      beneficiaryBranch:bankerFormValue.beneficiaryBranch,
      instrumentType:bankerFormValue.instrumentType ? bankerFormValue.instrumentType.value : '',
      instrumentNumber: bankerFormValue.instrumentNumber ? bankerFormValue.instrumentNumber.value : null,
      instrumentDate: bankerFormValue.instrumentDate ? (bankerFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(bankerFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: bankerFormValue.favouringBankOfDraw ? bankerFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: (bankerFormValue.favouringBankBranch) ? bankerFormValue.favouringBankBranch.value : '',
      loanNumber: bankerFormValue.loanNumber ? bankerFormValue.loanNumber.value : '',
      beneficiaryAddress1 : bankerFormValue.address,
      paymentMethod:bankerFormValue.paymentMethod,
      disbursementAmount:bankerFormValue.disbursementAmount,
      deductChargesFlag: (bankerFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (bankerFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:bankerFormValue.trancheDisbursementJson,
      active:'1'
    };

    const financierFormValue = this.financierDetailsForm.getRawValue();
    financierFormValue.trancheDisbursementJson = this.trancheFinancierForm?JSON.stringify(this.trancheFinancierForm.value.trancheFinancierArray):'';
    this.ReqFinancierDetails = {
      leadID: this.financierObjInfo['leadID'],
      disbursementID: this.financierObjInfo['disbursementID'] ? this.financierObjInfo['disbursementID'] : null,
      payableTo:"5DISBURSETO",
      favouring:"Financier",
      financierId:financierFormValue.financierId,
      beneficiaryName:financierFormValue.beneficiaryName,
      applicantName: financierFormValue.beneficiaryName,
      favouringName : financierFormValue.beneficiaryName,
      beneficiaryAccountNo:financierFormValue.beneficiaryAccountNo,
      beneficiaryBank:financierFormValue.beneficiaryBank,
      ifscCode:financierFormValue.ifscCode,
      beneficiaryBranch:financierFormValue.beneficiaryBranch,
      instrumentType:financierFormValue.instrumentType ? financierFormValue.instrumentType.value : '',
      instrumentNumber: financierFormValue.instrumentNumber ? financierFormValue.instrumentNumber.value : null,
      instrumentDate: financierFormValue.instrumentDate ? (financierFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(financierFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: financierFormValue.favouringBankOfDraw ? financierFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: (financierFormValue.favouringBankBranch) ? financierFormValue.favouringBankBranch.value : '',
      loanNumber: financierFormValue.loanNumber ? financierFormValue.loanNumber.value : '',
      beneficiaryAddress1 : financierFormValue.address,
      paymentMethod:financierFormValue.paymentMethod,
      disbursementAmount:financierFormValue.disbursementAmount,
      deductChargesFlag: (financierFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (financierFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:financierFormValue.trancheDisbursementJson,
      active:'1'
    };

    const thirdPartyFormValue = this.thirdPartyDetailsForm.getRawValue();
    thirdPartyFormValue.trancheDisbursementJson = this.trancheTPForm?JSON.stringify(this.trancheTPForm.value.trancheTpArray):'';
    this.ReqTPDetails = {
      leadID: this.thirdPartyObjInfo['leadID'],
      disbursementID: this.thirdPartyObjInfo['disbursementID'] ? this.thirdPartyObjInfo['disbursementID'] : null,
      payableTo:"6DISBURSETO",
      favouring:"Third Party",
      bankerId:thirdPartyFormValue.bankerId,
      beneficiaryName:thirdPartyFormValue.beneficiaryName,
      applicantName: thirdPartyFormValue.beneficiaryName,
      favouringName : thirdPartyFormValue.beneficiaryName,
      beneficiaryAccountNo:thirdPartyFormValue.beneficiaryAccountNo,
      beneficiaryBank:thirdPartyFormValue.beneficiaryBank,
      ifscCode:thirdPartyFormValue.ifscCode,
      beneficiaryBranch:thirdPartyFormValue.beneficiaryBranch,
      instrumentType:thirdPartyFormValue.instrumentType ? thirdPartyFormValue.instrumentType.value : '',
      instrumentNumber: thirdPartyFormValue.instrumentNumber ? thirdPartyFormValue.instrumentNumber.value : null,
      instrumentDate: thirdPartyFormValue.instrumentDate ? (thirdPartyFormValue.instrumentDate.value ? this.utilityService.getNewDateFormat(thirdPartyFormValue.instrumentDate) : '') : '',
      favouringBankOfDraw: thirdPartyFormValue.favouringBankOfDraw ? thirdPartyFormValue.favouringBankOfDraw.value : '',
      favouringBankBranch: (thirdPartyFormValue.favouringBankBranch) ? thirdPartyFormValue.favouringBankBranch.value : '',
      loanNumber: thirdPartyFormValue.loanNumber ? thirdPartyFormValue.loanNumber.value : '',
      beneficiaryAddress1 : thirdPartyFormValue.address,
      paymentMethod:thirdPartyFormValue.paymentMethod,
      disbursementAmount:thirdPartyFormValue.disbursementAmount,
      deductChargesFlag: (thirdPartyFormValue.deductChargesFlag == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (thirdPartyFormValue.trancheDisbursementFlag == true) ? 'Y':'N',
      trancheDisbursementJson:thirdPartyFormValue.trancheDisbursementJson,
      active:'1'
    };

    // let  dealerData: any = { ...dealerFormValue };
    // console.log(dealerData)
    //let trancheDisbursementJson = this.trancheDealerForm.value.trancheDealerArray;

    let inputData = {
              //"LeadID": this.disbLeadId,
              "LeadID":this.disbLeadId,
              "UserID": "Anand",
              "DealerDetails": this.disburseToDealer ? this.ReqDealerDetails : null,
              "ApplicantDetails": this.disburseToApp ? this.ReqApplicantDetails : null,
              "CoApplicantDetails": this.disburseToCoApp ? this.ReqCoAppDetails : null,
              "BankerDetails": this.disburseToBanker ? this.ReqBankerDetails : null,
              "FinancierDetails": this.disburseToFinancier ? this.ReqFinancierDetails : null,
              "ThirdPartyDetails": this.disburseToThirdParty ? this.ReqTPDetails : null,
          }

    this.isDirty = true;
   if(this.dealerObjInfo['deductChargesFlag'] || this.applicantObjInfo['deductChargesFlag'] || this.coApplicantObjInfo['deductChargesFlag'] ||
        this.bankerObjInfo['deductChargesFlag'] || this.financierObjInfo['deductChargesFlag'] || this.thirdPartyObjInfo['deductChargesFlag'] || this.internalBTObjInfo['deductChargesFlag']){//deduct charges related
        if (this.dealerDetailsForm.valid=== true && this.appDetailsForm.valid=== true && this.coAppDetailsForm.valid=== true &&
          this.bankerDetailsForm.valid=== true && this.financierDetailsForm.valid=== true && this.thirdPartyDetailsForm.valid=== true) { // all containers check
            
            if(this.dealerObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheDealerForm.valid)
              if(!this.trancheDealerForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche Dealer table & check other tranche tables too', '');
                return;
              }
            }
            if(this.applicantObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheAppForm.valid)
              if(!this.trancheAppForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche App table & check other tranche tables too', '');
                return;}
            }
            if(this.coApplicantObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheCoAppForm.valid)
              if(!this.trancheCoAppForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche coApp table & check other tranche tables too', '');
                return;}
            }
            if(this.bankerObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheBankerForm.valid)
              if(!this.trancheBankerForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche Banker table & check other tranche tables too', '');
                return;}
            }
            if(this.financierObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheFinancierForm.valid)
              if(!this.trancheFinancierForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche Financier table & check other tranche tables too', '');
                return;}
            }
            if(this.thirdPartyObjInfo['trancheDisbursementFlag']){
              console.log('tranche',this.trancheTPForm.valid)
              if(!this.trancheTPForm.valid){
                this.toasterService.showError('Kindly fill mandatory fields in Tranche third party table & check other tranche tables too', '');
                return;}
            }
            this.toasterService.showError('saved successfully.', '');
            console.log('Req:',inputData);
            this.disbursementService.saveUpdateDisbursement(inputData).subscribe((res: any) => {
              const response = res;
              const appiyoError = response.Error;
              //const apiError = response.ProcessVariables.error.code;
              if (appiyoError === '0') {
                console.log("saveUpdate",response.ProcessVariables)
              }
            });
           
            
         
        } else {
          this.toasterService.showError('Please fill all mandatory fields.', 'Lead Details');
        }
   }else{
      this.toasterService.showError('Select Atleast one deduct charges to proceed save','');
   }
    
  }
  fetchDisbursementDetails(){
    this.disbursementService.fetchDisbursement(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      //const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log("fetchDisburseDetails",response)
        this.disbursementDetailsData=response.ProcessVariables;
        this.leadID = this.disbursementDetailsData.LeadID;
        if(this.disbursementDetailsData.payableTo)
        this.disburseTo = this.disbursementDetailsData.payableTo.split(',');
        if(this.disburseTo){
          this.disburseToVal(this.disburseTo);
        }
        if(this.disbursementDetailsData.DealerDetails){
        this.dealerObjInfo = this.disbursementDetailsData.DealerDetails;
        this.dealerCode = this.disbursementDetailsData.DealerDetails.dealerCode;
        this.dealerObjInfo['instrumentDate'] = String(this.disbursementDetailsData.DealerDetails.instrumentDate).slice(0, 10)
        this.dealerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.DealerDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.dealerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.DealerDetails.deductChargesFlag == 'Y') ? true : false;
        this.dealerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.DealerDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.DealerDetails.disbursementAmount):null;
        this.dealerDetailsForm.patchValue({ address: (this.disbursementDetailsData.DealerDetails)? this.disbursementDetailsData.DealerDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.DealerDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.DealerDetails.beneficiaryAddress3: null });
        
        this.dealerDetailsForm['paymentMethod'] = this.disbursementDetailsData.DealerDetails.paymentMethod;
        if(this.dealerDetailsForm['paymentMethod'] == '7MODEOFPAYMENT' || this.dealerDetailsForm['paymentMethod'] == '8MODEOFPAYMENT'){
          this.showBankDetails = true;
        }else if (this.dealerDetailsForm['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showDDDetails = true;
        }else if(this.dealerDetailsForm['paymentMethod'] == '2MODEOFPAYMENT'){
          this.showCASADetails = true;
        }
        if(this.dealerObjInfo['trancheDisbursementFlag']){
        this.showTrancheTable=true;
        this.selectTranche(this.dealerObjInfo['trancheDisbursementFlag'],1,true);
        let formArray = <FormArray>this.trancheDealerForm.get('trancheDealerArray');
        formArray.clear();
        this.trancheDealerList = [];
        this.trancheDealerList = JSON.parse(this.disbursementDetailsData.DealerDetails['trancheDisbursementJson']);
        this.trancheDealerList.forEach(() => {
          this.dealerTrancheDetail.push(this.initTranche());
        });
        }
        
        }
        
        
        if(this.disbursementDetailsData.ApplicantDetails){
        this.applicantObjInfo = this.disbursementDetailsData.ApplicantDetails;
        this.applicantObjInfo['instrumentDate'] = String(this.disbursementDetailsData.ApplicantDetails.instrumentDate).slice(0, 10)
        this.applicantObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ApplicantDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.applicantObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ApplicantDetails.deductChargesFlag == 'Y') ? true : false;
        this.applicantObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ApplicantDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.ApplicantDetails.disbursementAmount):null;
        this.appDetailsForm.patchValue({ appAddress: (this.disbursementDetailsData.ApplicantDetails)? this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress3: null });

        this.applicantObjInfo['paymentMethod'] = this.disbursementDetailsData.ApplicantDetails.paymentMethod;
        if(this.applicantObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.applicantObjInfo['paymentMethod'] == '8MODEOFPAYMENT'){
          this.showAppBankDetails = true;
        }else if (this.applicantObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showAppDDDetails = true;
        }else if(this.applicantObjInfo['paymentMethod'] == '2MODEOFPAYMENT'){
          this.showAppCASADetails = true;
        }
        if(this.applicantObjInfo['trancheDisbursementFlag']){
        this.selectTranche(this.applicantObjInfo['trancheDisbursementFlag'],2,true);        
        let formArray = <FormArray>this.trancheAppForm.get('trancheAppArray');
        formArray.clear();
        this.trancheAppList = [];
        this.trancheAppList = JSON.parse(this.disbursementDetailsData.ApplicantDetails['trancheDisbursementJson']);
        this.trancheAppList.forEach(() => {
          this.appTrancheDetail.push(this.initTranche());
        });
        }
        }
        
        
        if(this.disbursementDetailsData.CoApplicantDetails)
        this.coApplicantObjInfo = this.disbursementDetailsData.CoApplicantDetails;

        if(this.disbursementDetailsData.BankerDetails){
        this.bankerObjInfo = this.disbursementDetailsData.BankerDetails;
        this.bankerObjInfo['instrumentDate'] = String(this.disbursementDetailsData.BankerDetails.instrumentDate).slice(0, 10)
        this.bankerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.BankerDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.bankerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.BankerDetails.deductChargesFlag == 'Y') ? true : false;
        this.bankerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.BankerDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.BankerDetails.disbursementAmount):null;

        this.bankerDetailsForm.patchValue({ bankerAddress: (this.disbursementDetailsData.BankerDetails)? this.disbursementDetailsData.BankerDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.BankerDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.BankerDetails.beneficiaryAddress3: null });

        this.bankerObjInfo['paymentMethod'] = this.disbursementDetailsData.BankerDetails.paymentMethod;
        if(this.bankerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.bankerObjInfo['paymentMethod'] == '8MODEOFPAYMENT'){
          this.showBankerBankDetails = true;
        }else if (this.bankerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showBankerDDDetails = true;
        }else if(this.bankerObjInfo['paymentMethod'] == '2MODEOFPAYMENT'){
          this.showBankerCASADetails = true;
        }
        if(this.bankerObjInfo['trancheDisbursementFlag']){
        this.selectTranche(this.bankerObjInfo['trancheDisbursementFlag'],4,true);
        let formArray = <FormArray>this.trancheBankerForm.get('trancheBankerArray');
        formArray.clear();
        this.trancheBankerList = [];
        this.trancheBankerList = JSON.parse(this.disbursementDetailsData.BankerDetails['trancheDisbursementJson']);
        this.trancheBankerList.forEach(() => {
          this.bankerTrancheDetail.push(this.initTranche());
        });
        }
        }
        
        if(this.disbursementDetailsData.FinancierDetails){
        this.financierObjInfo = this.disbursementDetailsData.FinancierDetails;
        this.financierObjInfo['instrumentDate'] = String(this.disbursementDetailsData.FinancierDetails.instrumentDate).slice(0, 10)
        this.financierObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.FinancierDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.financierObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.FinancierDetails.deductChargesFlag == 'Y') ? true : false;     
        this.financierObjInfo['disbursementAmount'] = (this.disbursementDetailsData.FinancierDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.FinancierDetails.disbursementAmount):null;
        this.financierDetailsForm.patchValue({ financierAddress: (this.disbursementDetailsData.FinancierDetails)? this.disbursementDetailsData.FinancierDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.FinancierDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.FinancierDetails.beneficiaryAddress3: null });
     
        this.financierObjInfo['paymentMethod'] = this.disbursementDetailsData.FinancierDetails.paymentMethod;
        if(this.financierObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.financierObjInfo['paymentMethod'] == '8MODEOFPAYMENT'){
          this.showFinBankDetails = true;
        }else if (this.financierObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showFinDDDetails = true;
        }else if(this.financierObjInfo['paymentMethod'] == '2MODEOFPAYMENT'){
          this.showFinCASADetails = true;
        }
        if(this.financierObjInfo['trancheDisbursementFlag']){
        this.selectTranche(this.financierObjInfo['trancheDisbursementFlag'],5,true);
        let formArray = <FormArray>this.trancheFinancierForm.get('trancheFinancierArray');
        formArray.clear();
        this.trancheFinancierList = [];
        this.trancheFinancierList = JSON.parse(this.disbursementDetailsData.FinancierDetails['trancheDisbursementJson']);
        this.trancheFinancierList.forEach(() => {
          this.financierTrancheDetail.push(this.initTranche());
        });
        }
        }
        
        if(this.disbursementDetailsData.ThirdPartyDetails){
        this.thirdPartyObjInfo = this.disbursementDetailsData.ThirdPartyDetails;
        this.thirdPartyObjInfo['instrumentDate'] = String(this.disbursementDetailsData.ThirdPartyDetails.instrumentDate).slice(0, 10)
        this.thirdPartyObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.thirdPartyObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.deductChargesFlag == 'Y') ? true : false;
        this.thirdPartyObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount):null;
        this.thirdPartyDetailsForm.patchValue({ thirdPartyAddress: (this.disbursementDetailsData.ThirdPartyDetails)? this.disbursementDetailsData.ThirdPartyDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.ThirdPartyDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.ThirdPartyDetails.beneficiaryAddress3: null });
       
        this.thirdPartyObjInfo['paymentMethod'] = this.disbursementDetailsData.ThirdPartyDetails.paymentMethod;
        if(this.thirdPartyObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.thirdPartyObjInfo['paymentMethod'] == '8MODEOFPAYMENT'){
          this.showTPBankDetails = true;
        }else if (this.thirdPartyObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showTPDDDetails = true;
        }else if(this.thirdPartyObjInfo['paymentMethod'] == '2MODEOFPAYMENT'){
          this.showTPCASADetails = true;
        }

        if(this.thirdPartyObjInfo['trancheDisbursementFlag']){
        this.selectTranche(this.thirdPartyObjInfo['trancheDisbursementFlag'],6,true);
        let formArray = <FormArray>this.trancheTPForm.get('trancheTpArray');
        formArray.clear();
        this.trancheTpList = [];
        this.trancheTpList = JSON.parse(this.disbursementDetailsData.ThirdPartyDetails['trancheDisbursementJson']);
        this.trancheTpList.forEach(() => {
          this.tpTrancheDetail.push(this.initTranche());
        });
        }
        }
      }
    });
  }

}