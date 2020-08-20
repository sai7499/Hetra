import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LabelsService } from '@services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { DisbursementService } from '../services/disbursement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
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
  coApp1Form: FormGroup;
  coApp2Form: FormGroup;
  coApp3Form: FormGroup;
  bankerDetailsForm:FormGroup;
  financierDetailsForm:FormGroup;
  thirdPartyDetailsForm:FormGroup;
  ibtDetailsForm:FormGroup;
  trancheDealerForm: FormGroup;
  trancheAppForm:FormGroup;
  trancheBankerForm:FormGroup;
  trancheFinancierForm:FormGroup;
  trancheTPForm:FormGroup;
  trancheCoApp1Form:FormGroup;
  trancheCoApp2Form:FormGroup;
  trancheCoApp3Form:FormGroup;
  disburseTo: Array<any> = [];


  LOV: any;
  isAlert: boolean;
  alertTimeOut: any;
  keyword: string;
  placeholder = [];
  dealerCodeData: Array<any> = [];
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);
  isDirty: boolean;


  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed'
    },
    ifsc:{
      rule: '^[A-Za-z][A-Za-z0-9]+$',
     // msg: "Special Characters not allowed"
    }
  }

  amountLength: number;

  trancheDealerList: Array<{}> = [];
  trancheAppList:Array<{}>=[];
  trancheBankerList:Array<{}>=[];
  trancheFinancierList:Array<{}>=[];
  trancheTpList:Array<{}>=[];
  trancheCoApp1List:Array<{}>=[];
  trancheCoApp2List:Array<{}>=[];
  trancheCoApp3List:Array<{}>=[];
  
 
  disburseToDealer: boolean=false;
  disburseToApp: boolean=false;
  disburseToCoApp: boolean=false;
  disburseToBanker: boolean=false;
  disburseToFinancier: boolean=false;
  disburseToThirdParty: boolean=false;
  disburseToIBT:boolean= false;
  coApp1: boolean=false;
  coApp2: boolean=false;
  coApp3: boolean=false;
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
  showBankerTrancheTable:boolean;
  showFinancierTrancheTable:boolean;
  showThirdPartyTrancheTable:boolean;
  showCoAppTrancheTable:boolean;
  showCoApp1TrancheTable:boolean;
  showCoApp2TrancheTable:boolean;
  showCoApp3TrancheTable:boolean;
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
  showCoApp1BankDetails: boolean;
  showCoApp1DDDetails: boolean;
  showCoApp1CASADetails: boolean;
  showCoApp2BankDetails: boolean;
  showCoApp2DDDetails: boolean;
  showCoApp2CASADetails: boolean;
  showCoApp3BankDetails: boolean;
  showCoApp3DDDetails: boolean;
  showCoApp3CASADetails: boolean;
  
  dealerObjInfo: Object = {};
  applicantObjInfo: Object = {};
  bankerObjInfo: Object = {};
  financierObjInfo: Object = {};
  thirdPartyObjInfo: Object = {};
  internalBTObjInfo: Object = {};
  coApplicantObjInfo: any = [];
  coApplicant1: Object = {};
  coApplicant2: Object = {};
  coApplicant3: Object = {};
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
  disbLeadId// ryt now static lead given , get the lead id from dashboard dynamically
  disuserID = localStorage.getItem("userId");// ryt now static userId given , get the userId from dashboard dynamically
  dealerDetailsData: any;
  applicantDetailsData: any;
  dealerCode: any;
  duplicateDealerDetails: any;
  disbursementDetailsData: any;
  leadID: any;
  //disburseTo: any;
  loanDetailsData : Object = {};
  ReqDealerDetails: { leadID: any;disbursementID: any; payableTo:String; favouring:String; dealerCode: String; beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String};
  ReqApplicantDetails: { leadID: any;disbursementID: any; payableTo:String; favouring:String;  beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqBankerDetails: { leadID: any;disbursementID: any; payableTo:String; favouring:String; bankerId: String;  beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqFinancierDetails: { leadID: any;disbursementID: any; payableTo:String; favouring:String; financierId: String;  beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqTPDetails:     { leadID: any;disbursementID: any; payableTo:String; favouring:String;  beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String};
  ReqCoApp1Details: { leadID: any;disbursementID: any; payableTo:String; favouring:String; applicantId:String;  beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqCoApp2Details: { leadID: any;disbursementID: any; payableTo:String; favouring:String; applicantId:String; beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqCoApp3Details: { leadID: any;disbursementID: any; payableTo:String; favouring:String; applicantId:String; beneficiaryName: String; applicantName:String; favouringName:String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String; loanNumber: String; beneficiaryAddress1: String;beneficiaryAddress2: String;beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; trancheDisbursementFlag: String;trancheDisbursementJson: any ;active:String };
  ReqCoAppDetailsArray: any = [];
  roleId: any;
  roleType: any;
  salesResponse: string;
  showSaveButton: boolean;
  applicantID: any;
  coAppName: any;
 
  
  constructor(
    private fb: FormBuilder,
    private labelsData: LabelsService,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private disbursementService:DisbursementService,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }

  async ngOnInit() {
   
    this.initForm();
    this.getLabels();
    this.disbLOV();
    this.disbLeadId = (await this.getLeadId()) as number;
    //this.disbLeadId = '1252';
    this.getCoAppDetails();
    // this.getApplicantDetails();
    this.fetchLoanDetails();
    //this.fetchDisbursementDetails();//enable this to fetch data,redirects fro dashboard
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });   
    this.routerUrlIdentifier();
    this.salesResponse = localStorage.getItem('salesResponse');
  }

 
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }


  get dealerTrancheDetail(): FormArray {
    return <FormArray>this.trancheDealerForm.get('trancheDealerArray')
  }
  get appTrancheDetail(): FormArray {
    return <FormArray>this.trancheAppForm.get('trancheAppArray')
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
  get coApp1TrancheDetail(): FormArray {
    return <FormArray>this.trancheCoApp1Form.get('trancheCoApp1Array')
  }
  get coApp2TrancheDetail(): FormArray {
    return <FormArray>this.trancheCoApp2Form.get('trancheCoApp2Array')
  }
  get coApp3TrancheDetail(): FormArray {
    return <FormArray>this.trancheCoApp3Form.get('trancheCoApp3Array')
  }
  
  
  
  
  
  addEmptyTrancheRow(container,trancheId) {
    let object={
      'tranche_disbursement_type': '',
      'disbursement_percentage': '',
      'tranche_disbursement_amount': '',
      'trancheDisburseDate': '',
      'disbursement_id':'',
      'tranche_disbursement_id':(trancheId==0?1:trancheId)+'',
    }
    if(container=='1') {
      this.trancheDealerList.push(object)
    } else if(container=='2') {
      this.trancheAppList.push(object)
    }else if(container=='4') {
      this.trancheBankerList.push(object)
    }else if(container=='5') {
      this.trancheFinancierList.push(object)
    }else if(container=='6') {
      this.trancheTpList.push(object)
    }else if(container=='8'){
      this.trancheCoApp1List.push(object)
    }else if(container=='9'){
      this.trancheCoApp2List.push(object)
    }else if(container=='10'){
      this.trancheCoApp3List.push(object)
    }
  }
  addRow(container) {
    if(container=='1'){
      if(this.trancheDealerList.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheDealerList.length+1);
        this.dealerTrancheDetail.push(this.initTranche());
        }
    } else if(container=='2') {
      if(this.trancheAppList.length!=10) {// max 10 rows
        this.addEmptyTrancheRow(container,this.trancheAppList.length+1);
        this.appTrancheDetail.push(this.initTranche());
        }
    } else if(container=='4') {
      if(this.trancheBankerList.length!=10) {// max 10 rows
        this.addEmptyTrancheRow(container,this.trancheBankerList.length+1);
        this.bankerTrancheDetail.push(this.initTranche());
        }
    } else if(container=='5') {
      if(this.trancheFinancierList.length!=10) {// max 10 rows
        this.addEmptyTrancheRow(container,this.trancheFinancierList.length+1);
        this.financierTrancheDetail.push(this.initTranche());
        }
    } else if(container=='6') {
      if(this.trancheTpList.length!=10) {// max 10 rows
        this.addEmptyTrancheRow(container,this.trancheTpList.length+1);
        this.tpTrancheDetail.push(this.initTranche());
        }     
    }else if(container=='8'){
      if(this.trancheCoApp1List.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheCoApp1List.length+1);
        this.coApp1TrancheDetail.push(this.initTranche());
        }     
    }else if(container=='9'){
      if(this.trancheCoApp2List.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheCoApp2List.length+1);
        this.coApp2TrancheDetail.push(this.initTranche());
        }     
    }else if(container=='10'){
      if(this.trancheCoApp3List.length!=10){//max 10 rows
        this.addEmptyTrancheRow(container,this.trancheCoApp3List.length+1);
        this.coApp3TrancheDetail.push(this.initTranche());
        }     
    }
  }
  deleteRow(index,container) {
    if(container=='1') {
      this.trancheDealerList.splice(index, 1);
      let formArray = <FormArray>this.trancheDealerForm.get('trancheDealerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('1');// dealer
      } else {
        for (let i = 0; i < this.trancheDealerList.length; i++) {
          this.trancheDealerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    } else if(container=='2') {
      this.trancheAppList.splice(index, 1);
      let formArray = <FormArray>this.trancheAppForm.get('trancheAppArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('2');// dealer
      } else {
        for (let i = 0; i < this.trancheAppList.length; i++) {
          this.trancheAppList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    } else if(container=='4') {
      this.trancheBankerList.splice(index, 1);
      let formArray = <FormArray>this.trancheBankerForm.get('trancheBankerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('4');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    } else if(container=='5') {
      this.trancheFinancierList.splice(index, 1);
      let formArray = <FormArray>this.trancheFinancierForm.get('trancheFinancierArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('5');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheFinancierList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    } else if(container=='6') {
      this.trancheTpList.splice(index, 1);
      let formArray = <FormArray>this.trancheTPForm.get('trancheTpArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('6');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }else if(container=='8'){
      this.trancheCoApp1List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp1Form.get('trancheCoApp1Array');
      formArray.removeAt(index);
      if(formArray.length == 0) {
        this.addRow('8');
      }else{
        for (let i = 0; i < this.trancheCoApp1List.length; i++) {
          this.trancheCoApp1List[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }else if(container=='9'){
      this.trancheCoApp2List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp2Form.get('trancheCoApp2Array');
      formArray.removeAt(index);
      if(formArray.length == 0) {
        this.addRow('9');
      }else{
        for (let i = 0; i < this.trancheCoApp2List.length; i++) {
          this.trancheCoApp2List[i]['tranche_disbursement_id']=(i+1)+''
        }
      }    
    }else if(container=='10'){
      this.trancheCoApp3List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp3Form.get('trancheCoApp3Array');
      formArray.removeAt(index);
      if(formArray.length == 0) {
        this.addRow('10');
      }else{
        for (let i = 0; i < this.trancheCoApp3List.length; i++) {
          this.trancheCoApp3List[i]['tranche_disbursement_id']=(i+1)+''
        }
      }
    }
  }
  initTranche(): FormGroup {
    let groupObject={
      tranche_disbursement_type: ['', Validators.required],
      disbursement_percentage: [null, Validators.required],
      tranche_disbursement_amount: [''],
      trancheDisburseDate: [null],
      disbursement_id:[''],
      tranche_disbursement_id:['']
    }
    return this.fb.group(groupObject);
  }



  getCumulativeDisbAmnt(event : any,container) { // disbursement Calculation part

    if(this.dealerObjInfo['disbursementAmount'] && container=='1') {
      this.dealerObjInfo['disbursementAmount'] = (event.target.value)?event.target.value:null;
      if(this.dealerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheDealerList,'1')
      }
    } else if(this.applicantObjInfo['disbursementAmount'] && container=='2') {
      this.applicantObjInfo['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.applicantObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAppList,'1')
      }
    } else if(this.bankerObjInfo['disbursementAmount'] && container=='4') {
      this.bankerObjInfo['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.bankerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheBankerList,'1')
      }
    } else if(this.financierObjInfo['disbursementAmount'] && container=='5') {
      this.financierObjInfo['disbursementAmount'] = (event.target.value)?event.target.value:null;
      if(this.financierObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheFinancierList,'1')
      }
    } else if(this.thirdPartyObjInfo['disbursementAmount'] && container=='6') {
      this.thirdPartyObjInfo['disbursementAmount']=(event.target.value)?event.target.value:null;
      if(this.thirdPartyObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheTpList,'1')
      }
    }else if(this.coApplicant1['disbursementAmount'] && container=='8'){
      this.coApplicant1['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.coApplicant1['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheCoApp1List,'8')
      }
    }else if(this.coApplicant2['disbursementAmount'] && container=='9'){
      this.coApplicant2['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.coApplicant2['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheCoApp2List,'9')
      }
    }else if(this.coApplicant3['disbursementAmount'] && container=='10'){
      this.coApplicant3['disbursementAmount']= (event.target.value)?event.target.value:null;
      if(this.coApplicant3['trancheDisbursementFlag']){
        this.validatePercentage(this.trancheCoApp3List,'10')
      }
    }
   // console.log(this.dealerObjInfo['disbursementAmount']);
    // tslint:disable-next-line: no-string-literal
    let a = this.dealerObjInfo['disbursementAmount']?parseInt(this.dealerObjInfo['disbursementAmount']):0;
    let b = this.applicantObjInfo['disbursementAmount']?parseInt(this.applicantObjInfo['disbursementAmount']):0;
    let d = this.bankerObjInfo['disbursementAmount']?parseInt(this.bankerObjInfo['disbursementAmount']):0;
    let e = this.financierObjInfo['disbursementAmount']?parseInt(this.financierObjInfo['disbursementAmount']):0;
    let f = this.thirdPartyObjInfo['disbursementAmount']?parseInt(this.thirdPartyObjInfo['disbursementAmount']):0;
    let g = this.coApplicant1['disbursementAmount']?parseInt(this.coApplicant1['disbursementAmount']):0;
    let h = this.coApplicant2['disbursementAmount']?parseInt(this.coApplicant2['disbursementAmount']):0;
    let i = this.coApplicant3['disbursementAmount']?parseInt(this.coApplicant3['disbursementAmount']):0;

    let cumulativeDisAmnt = a+b+d+e+f+g+h+i;
    //console.log(cumulativeDisAmnt)   
    if(!this.dealerObjInfo['disbursementAmount'] && container=='1' && this.dealerObjInfo['trancheDisbursementFlag']){
      this.dealerObjInfo['trancheDisbursementFlag']=false;
      this.showTrancheTable = false;
      this.trancheDealerList=[];
    } else if(!this.applicantObjInfo['disbursementAmount'] && container=='2' && this.applicantObjInfo['trancheDisbursementFlag']) {
      this.applicantObjInfo['trancheDisbursementFlag']=false;
      this.showAppTrancheTable = false;
      this.trancheAppList=[];
    } else if(!this.bankerObjInfo['disbursementAmount'] && container=='4' && this.bankerObjInfo['trancheDisbursementFlag']) {
      this.bankerObjInfo['trancheDisbursementFlag']=false;
      this.showBankerTrancheTable = false;
      this.trancheBankerList=[];
    } else if(!this.financierObjInfo['disbursementAmount'] && container=='5' && this.financierObjInfo['trancheDisbursementFlag']) {
      this.financierObjInfo['trancheDisbursementFlag']=false;
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList=[];
    } else if(!this.thirdPartyObjInfo['disbursementAmount'] && container=='6' && this.thirdPartyObjInfo['trancheDisbursementFlag']) {
      this.thirdPartyObjInfo['trancheDisbursementFlag']=false;
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList=[];
    }else if(!this.coApplicant1['disbursementAmount'] && container=='8' && this.coApplicant1['trancheDisbursementFlag']){
      this.coApplicant1['trancheDisbursementFlag']=false;
      this.showCoApp1TrancheTable = false;
      this.trancheCoApp1List=[];
    }else if(!this.coApplicant2['disbursementAmount'] && container=='9' && this.coApplicant2['trancheDisbursementFlag']){
      this.coApplicant2['trancheDisbursementFlag']=false;
      this.showCoApp2TrancheTable = false;
      this.trancheCoApp2List=[];
    }else if(!this.coApplicant3['disbursementAmount'] && container=='10' && this.coApplicant3['trancheDisbursementFlag']){
      this.coApplicant3['trancheDisbursementFlag']=false;
      this.showCoApp3TrancheTable = false;
      this.trancheCoApp3List=[];
    } 
    
    if(cumulativeDisAmnt>this.totalDisbursementAmount){
      if(container=='1'){
        this.dealerObjInfo['disbursementAmount']=null;
        if(this.dealerObjInfo['trancheDisbursementFlag']) {
          this.dealerObjInfo['trancheDisbursementFlag']=false;
          this.showTrancheTable = false;
          this.trancheDealerList=[];
        }
        return;
      } else if(container=='2') {
        this.applicantObjInfo['disbursementAmount']=null;
        if(this.applicantObjInfo['trancheDisbursementFlag']) {
          this.applicantObjInfo['trancheDisbursementFlag']=false;
          this.showAppTrancheTable = false;
          this.trancheAppList=[];
        }
        return;
      } else if(container=='4') {
        this.bankerObjInfo['disbursementAmount']=null;
        if(this.bankerObjInfo['trancheDisbursementFlag']) {
          this.bankerObjInfo['trancheDisbursementFlag']=false;
          this.showBankerTrancheTable = false;
          this.trancheBankerList=[];
        }
        return;
      } else if(container=='5') {
        this.financierObjInfo['disbursementAmount']=null;
        if(this.financierObjInfo['trancheDisbursementFlag']) {
          this.financierObjInfo['trancheDisbursementFlag']=false;
          this.showFinancierTrancheTable = false;
          this.trancheFinancierList=[];
        }
        return;
      } else if(container=='6') {
        this.thirdPartyObjInfo['disbursementAmount']=null;
        if(this.thirdPartyObjInfo['trancheDisbursementFlag']) {
          this.thirdPartyObjInfo['trancheDisbursementFlag']=false;
          this.showThirdPartyTrancheTable = false;
          this.trancheTpList=[];
        }
        return;
      }
      else if(container=='8'){
        this.coApplicant1['disbursementAmount']=null;
        if(this.coApplicant1['trancheDisbursementFlag']){
          this.coApplicant1['trancheDisbursementFlag']=false;
          this.showCoApp1TrancheTable = false;
          this.trancheCoApp1List=[];
        }
        return;
      }
      else if(container=='9'){
        this.coApplicant2['disbursementAmount']=null;
        if(this.coApplicant2['trancheDisbursementFlag']){
          this.coApplicant2['trancheDisbursementFlag']=false;
          this.showCoApp2TrancheTable = false;
          this.trancheCoApp2List=[];
        }
        return;
      }
      else if(container=='10'){
        this.coApplicant3['disbursementAmount']=null;
        if(this.coApplicant3['trancheDisbursementFlag']){
          this.coApplicant3['trancheDisbursementFlag']=false;
          this.showCoApp3TrancheTable = false;
          this.trancheCoApp3List=[];
        }
        return;
      }
     
    }
  }

  validatePercentage(trancheList,container) {
    this.dealerObjInfo['disbursementAmount']=this.dealerObjInfo['disbursementAmount']?parseInt(this.dealerObjInfo['disbursementAmount']):null;
    this.applicantObjInfo['disbursementAmount']=this.applicantObjInfo['disbursementAmount'] ? parseInt(this.applicantObjInfo['disbursementAmount']):null;
    this.bankerObjInfo['disbursementAmount']=this.bankerObjInfo['disbursementAmount']?parseInt(this.bankerObjInfo['disbursementAmount']):null;
    this.financierObjInfo['disbursementAmount']=this.financierObjInfo['disbursementAmount']?parseInt(this.financierObjInfo['disbursementAmount']):null;
    this.thirdPartyObjInfo['disbursementAmount']=this.thirdPartyObjInfo['disbursementAmount']?parseInt(this.thirdPartyObjInfo['disbursementAmount']):null;
    this.coApplicant1['disbursementAmount']=this.coApplicant1['disbursementAmount']?parseInt(this.coApplicant1['disbursementAmount']):null;
    this.coApplicant2['disbursementAmount']=this.coApplicant2['disbursementAmount']?parseInt(this.coApplicant2['disbursementAmount']):null;
    this.coApplicant3['disbursementAmount']=this.coApplicant3['disbursementAmount']?parseInt(this.coApplicant3['disbursementAmount']):null;

    var totalPercentage;
    for (let i = 0; i < trancheList.length; i++) {
        // trancheList['i'].tranche_disbursement_id=i;
        let tranchePercentage = parseInt(trancheList[i].disbursement_percentage);
        tranchePercentage=tranchePercentage?tranchePercentage:null
        totalPercentage = totalPercentage?parseInt(totalPercentage)+tranchePercentage:tranchePercentage;
        if(totalPercentage>100) {// total percentage should not exceed more than 100
          trancheList[i].disbursement_percentage=null;
          trancheList[i].tranche_disbursement_amount=null;
          return;
        }
        if(container=='1') {
          trancheList[i].tranche_disbursement_amount=(this.dealerObjInfo['disbursementAmount']/100)*tranchePercentage;
       } else if(container=='2') {
        trancheList[i].tranche_disbursement_amount=(this.applicantObjInfo['disbursementAmount']/100)*tranchePercentage;
       } else if(container=='4') {
        trancheList[i].tranche_disbursement_amount=(this.bankerObjInfo['disbursementAmount']/100)*tranchePercentage;
       } else if(container=='5') {
        trancheList[i].tranche_disbursement_amount=(this.bankerObjInfo['disbursementAmount']/100)*tranchePercentage;
       } else if(container=='6') {
        trancheList[i].tranche_disbursement_amount=(this.thirdPartyObjInfo['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='8'){
        trancheList[i].tranche_disbursement_amount=(this.coApplicant1['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='9'){
        trancheList[i].tranche_disbursement_amount=(this.coApplicant2['disbursementAmount']/100)*tranchePercentage;
       }else if(container=='10'){
        trancheList[i].tranche_disbursement_amount=(this.coApplicant3['disbursementAmount']/100)*tranchePercentage;
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
        if(res.Error=='0') {
          var resData = res.ProcessVariables;
          console.log('LOVDATA',resData)
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

  getCoAppDetails() {
    const data ={
      "LeadID":this.disbLeadId
    }
    // 1372
    this.disbursementService
      .getCoAppNames(data)
      .subscribe((res: any) => {
        if(res.Error=='0') {
          var resData = res.ProcessVariables;
          //console.log(resData)
          this.coAppNamesLov=resData.coApplicantName;
        }

      });
  }
  onDealerCodeSearch(event: any) {
    let inputString = event;
    //console.log('inputStringDelr', event);
    this.disbursementService.getDealerDetails(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('dealerCodeData',response)
        const dealerDetailsData=response.ProcessVariables.DealerDetails;
        if(dealerDetailsData) {
          this.duplicateDealerDetails = dealerDetailsData
          this.dealerObjInfo = this.duplicateDealerDetails;
          //this.dealerDetailsForm.patchValue({ address: (this.duplicateDealerDetails)? this.duplicateDealerDetails.beneficiaryAddress1 +','+  this.duplicateDealerDetails.beneficiaryAddress2 + ',' + this.duplicateDealerDetails.beneficiaryAddress3: null });
        } else {
          this.dealerObjInfo = {};
          this.showTrancheTable = false;
          this.trancheDealerList=[];
        }

      }
    });
  }
  // selectDealerEvent(event) {
  //   this.isNgAutoCompleteDealer = event ? true : false;
  //   const dealerData = event;
  //   this.dealerDetailsForm.patchValue({ rcLimit: dealerData.rcLimit });
  // }
  getApplicantDetails(applicantID) {
    this.disbursementService.getApplicantDetails(applicantID).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('applicantData',response)
        this.applicantDetailsData=response.ProcessVariables.ApplicantDetails;
        const duplicateAppDetails: any = { ...this.applicantDetailsData };
        this.applicantObjInfo = duplicateAppDetails;
        this.dealerDetailsForm.patchValue({ address: (this.dealerDetailsData)? this.dealerDetailsData.addressLine1 +','+  this.dealerDetailsData.addressLine2 + ',' + this.dealerDetailsData.addressLine3: null });
      }
    });
  }
  fetchLoanDetails() {
    this.disbursementService.fetchLoanDetails(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        console.log('LoanDetails',response)
        this.loanDetailsData= (response.ProcessVariables.LoanDetails) ? response.ProcessVariables.LoanDetails : {};
        this.totalDisbursementAmount=this.loanDetailsData?parseInt(this.loanDetailsData['approvedAmount']):0;
      }
    });
  }

  setModeOfPayment(event: any, val) {
    if(val == 'dealer') {
    this.showBankDetails = false;
    console.log(this.duplicateDealerDetails);
    if(!this.showBankDetails) {
        this.bankdetailsformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset();
      });
        this.bankdetailsformArray.forEach(key => {
          this.dealerDetailsForm.get(key).clearValidators()
          this.dealerDetailsForm.get(key).setErrors(null) ;
      });
    }
    this.showDDDetails = false;
    if(!this.showDDDetails) {
      this.chequeDDformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset() ;
      });
      this.chequeDDformArray.forEach(key => {
        this.dealerDetailsForm.get(key).clearValidators()
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });

    }
    this.showCASADetails = false;
    if(!this.showCASADetails) {
      this.casaformArray.forEach(key => {
        this.dealerDetailsForm.get(key).reset() ;
      });
      this.casaformArray.forEach(key => {
        this.dealerDetailsForm.get(key).clearValidators()
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });
    }
    }
    if(val == 'applicant') {
    this.showAppBankDetails = false;
    if(!this.showAppBankDetails) {
      this.bankdetailsformArray.forEach(key => {
        this.appDetailsForm.get(key).reset() ;
      });
      this.bankdetailsformArray.forEach(key => {
        this.appDetailsForm.get(key).clearValidators()
        this.appDetailsForm.get(key).setErrors(null) ;
      });

    }
    this.showAppDDDetails = false;
    if(!this.showAppDDDetails) {
      this.chequeDDformArray.forEach(key => {
        this.appDetailsForm.get(key).reset();
      });
      this.chequeDDformArray.forEach(key => {
        this.appDetailsForm.get(key).clearValidators();
        this.appDetailsForm.get(key).setErrors(null);
      });

    }
    this.showAppCASADetails = false;
    if(!this.showAppCASADetails) {
      this.casaformArray.forEach(key => {
        this.appDetailsForm.get(key).reset() ;
      });
      this.casaformArray.forEach(key => {
        this.appDetailsForm.get(key).clearValidators();
        this.appDetailsForm.get(key).setErrors(null);
      });

    }

    }
    if(val == 'banker') {
      this.showBankerBankDetails = false;
      if(!this.showBankerBankDetails) {
        this.bankdetailsformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset() ;
        });
        this.bankdetailsformArray.forEach(key => {
          this.bankerDetailsForm.get(key).clearValidators();
          this.bankerDetailsForm.get(key).setErrors(null);
        });

      }
      this.showBankerDDDetails = false;
      if(!this.showBankerDDDetails) {
          this.chequeDDformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset() ;
        });
          this.chequeDDformArray.forEach(key => {
          this.bankerDetailsForm.get(key).clearValidators();
          this.bankerDetailsForm.get(key).setErrors(null);
        });
      }
      this.showBankerCASADetails = false;
      if(!this.showBankerCASADetails) {
          this.casaformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset();
        });
          this.casaformArray.forEach(key => {
          this.bankerDetailsForm.get(key).clearValidators();
          this.bankerDetailsForm.get(key).setErrors(null);
        });
      }
      }
    if(val == 'financier') {
      this.showFinBankDetails = false;
      if(!this.showFinBankDetails) {
        this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
        this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).clearValidators();
          this.financierDetailsForm.get(key).setErrors(null);
        });

      }
      this.showFinDDDetails = false;
      if(!this.showFinDDDetails) {
          this.chequeDDformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
          this.chequeDDformArray.forEach(key => {
          this.financierDetailsForm.get(key).clearValidators();
          this.financierDetailsForm.get(key).setErrors(null);
        });
      }
      this.showFinCASADetails = false;
      if(!this.showFinCASADetails) {
          this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset() ;
        });
          this.casaformArray.forEach(key => {
          this.financierDetailsForm.get(key).clearValidators();
          this.financierDetailsForm.get(key).setErrors(null);
        });
      }
      }
    if(val == 'thirdParty') {
    this.showTPBankDetails = false;
    if(!this.showTPBankDetails) {
      this.bankdetailsformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
      this.bankdetailsformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).clearValidators();
        this.thirdPartyDetailsForm.get(key).setErrors(null);
      });

    }
    this.showTPDDDetails = false;
    if(!this.showTPDDDetails) {
        this.chequeDDformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).clearValidators() ;
        this.thirdPartyDetailsForm.get(key).setErrors(null);
      });
    }
    this.showTPCASADetails = false;
    if(!this.showTPCASADetails) {
        this.casaformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).clearValidators() ;
        this.thirdPartyDetailsForm.get(key).setErrors(null);
      });
    }
    }

    this.mopVal = event.target.value;
    if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT') {// NEFT &  RTGS
      if(val == 'dealer') {
      this.showBankDetails = true;
      }
      if(val == 'applicant') {
      this.showAppBankDetails = true;
      }
      if(val == 'banker') {
      this.showBankerBankDetails = true;
      }
      if(val == 'financier') {
      this.showFinBankDetails = true;
      }
      if(val == 'thirdParty') {
      this.showTPBankDetails = true;
      }
    } else if(this.mopVal == '1MODEOFPAYMENT') {// cheque or dd
      if(val == 'dealer') {
      this.showDDDetails = true;
      }
      if(val == 'applicant') {
      this.showAppDDDetails = true;
      }
      if(val == 'banker') {
      this.showBankerDDDetails = true;
      }
      if(val == 'financier') {
      this.showFinDDDetails = true;
      }
      if(val == 'thirdParty') {
      this.showTPDDDetails = true;
      }
    } else if(this.mopVal == '2MODEOFPAYMENT') {// casa
      if(val == 'dealer') {
      this.showCASADetails = true;
      }
      if(val == 'applicant') {
      this.showAppCASADetails = true;
      }
      if(val == 'banker'){
      this.showBankerCASADetails = true;
      }
      if(val == 'financier'){
      this.showFinCASADetails = true;
      }
      if(val == 'thirdParty'){
      this.showTPCASADetails = true;
      }
    }
  }
  
  setCoAppMOP(event: any, val){
    if(val == 'coApp1'){
    this.showCoApp1BankDetails = false;
    //console.log(this.duplicateDealerDetails);
    if(!this.showCoApp1BankDetails){
        this.bankdetailsformArray.forEach(key => {
        this.coApp1Form.get(key).reset();
      });
        this.bankdetailsformArray.forEach(key => {
        this.coApp1Form.get(key).clearValidators() ;
        this.coApp1Form.get(key).setErrors(null) ;
      });
    }
    this.showCoApp1DDDetails = false;
    if(!this.showCoApp1DDDetails){
      this.chequeDDformArray.forEach(key => {
        this.coApp1Form.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.coApp1Form.get(key).clearValidators() ;
        this.coApp1Form.get(key).setErrors(null) ;
      });
        
    }
    this.showCoApp1CASADetails = false;
    if(!this.showCoApp1CASADetails){
      this.casaformArray.forEach(key => {
        this.coApp1Form.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.coApp1Form.get(key).clearValidators() ;
        this.coApp1Form.get(key).setErrors(null) ;
      });
    }
    }
    if(val == 'coApp2'){
    this.showCoApp2BankDetails = false;
    if(!this.showCoApp2BankDetails){
      this.bankdetailsformArray.forEach(key => {
        this.coApp2Form.get(key).reset() ;
      });
        this.bankdetailsformArray.forEach(key => {
        this.coApp2Form.get(key).clearValidators() ;
        this.coApp2Form.get(key).setErrors(null) ;
      });
      
    }
    this.showCoApp2DDDetails = false;
    if(!this.showCoApp2DDDetails){
      this.chequeDDformArray.forEach(key => {
        this.coApp2Form.get(key).reset() ;
      });
        this.chequeDDformArray.forEach(key => {
        this.coApp2Form.get(key).clearValidators() ;
        this.coApp2Form.get(key).setErrors(null) ;
      });
        
    }
    this.showCoApp2CASADetails = false;
    if(!this.showCoApp2CASADetails){
      this.casaformArray.forEach(key => {
        this.coApp2Form.get(key).reset() ;
      });
        this.casaformArray.forEach(key => {
        this.coApp2Form.get(key).clearValidators();
        this.coApp2Form.get(key).setErrors(null);
      });
        
    }

    }
    if(val == 'coApp3'){
      this.showCoApp3BankDetails = false;
      if(!this.showCoApp3BankDetails){
        this.bankdetailsformArray.forEach(key => {
          this.coApp3Form.get(key).reset() ;
        });
        this.bankdetailsformArray.forEach(key => {
          this.coApp3Form.get(key).clearValidators();
          this.coApp3Form.get(key).setErrors(null);
        });
        
      }
      this.showCoApp3DDDetails = false;
      if(!this.showCoApp3DDDetails){
          this.chequeDDformArray.forEach(key => {
          this.coApp3Form.get(key).reset() ;
        });
          this.chequeDDformArray.forEach(key => {
          this.coApp3Form.get(key).clearValidators();
          this.coApp3Form.get(key).setErrors(null);
        });
      }
      this.showCoApp3CASADetails = false;
      if(!this.showCoApp3CASADetails){
          this.casaformArray.forEach(key => {
          this.coApp3Form.get(key).reset() ;
        });
          this.casaformArray.forEach(key => {
          this.coApp3Form.get(key).clearValidators();
          this.coApp3Form.get(key).setErrors(null);
        });
      }
      }


     let coAppMopValue = event.target.value;
    if(coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){// NEFT &  RTGS
      if(val == 'coApp1')
      this.showCoApp1BankDetails = true;
      if(val == 'coApp2')
      this.showCoApp2BankDetails = true;
      if(val == 'coApp3')
      this.showCoApp3BankDetails = true;
    }else if(coAppMopValue == '1MODEOFPAYMENT'){//cheque or dd
      if(val == 'coApp1')
      this.showCoApp1DDDetails = true;
      if(val == 'coApp2')
      this.showCoApp2DDDetails = true;
      if(val == 'coApp3')
      this.showCoApp3DDDetails = true;
    }else if(coAppMopValue == '2MODEOFPAYMENT'){//casa
      if(val == 'coApp1')
      this.showCoApp1CASADetails = true;
      if(val == 'coApp2')
      this.showCoApp2CASADetails = true;
      if(val == 'coApp3')
      this.showCoApp3CASADetails = true;
    }
  }

  disburseToVal(val) {
    console.log('diburseToValues',this.disburseTo)
    // console.log(val,val.length)
    this.disburseToDealer=false;
    this.disburseToApp=false;
    this.disburseToCoApp=false;
    this.disburseToBanker=false;
    this.disburseToFinancier=false;
    this.disburseToThirdParty=false;
    this.disburseToIBT=false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.disburseToLov.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < val.length; j++) {
           if(this.disburseToLov[i]['key']==(val)[j]) {
             if(val[j]=='1DISBURSETO') {
              this.disburseToDealer=true;
             }
             if(val[j]=='2DISBURSETO') {
              this.disburseToApp=true;
             }
             if(val[j]=='3DISBURSETO') {
              this.disburseToCoApp=true;
            }
             if(val[j]=='4DISBURSETO') {
              this.disburseToBanker=true;
            }
             if(val[j]=='5DISBURSETO') {
              this.disburseToFinancier=true;
              // this.getBasicFiancierLov();
            }
             if(val[j]=='6DISBURSETO') {
              this.disburseToThirdParty=true;
              // this.getBasicThirdPartyLov();
            }
             if(val[j]=='7DISBURSETO') {
              this.disburseToIBT=true;
              // this.getBasicIBTLov();
            }
           }

        }
    }
    if(!this.disburseToDealer) {
      this.dealerDetailsForm.reset();
      this.showTrancheTable = false;
      this.showBankDetails = false;
      this.showDDDetails = false;
      this.showCASADetails = false;
      this.trancheDealerList=[];
      this.dealerformArray.forEach(key => {
        this.dealerDetailsForm.get(key).clearValidators();
        this.dealerDetailsForm.get(key).setErrors(null) ;
      });

    }
    if(!this.disburseToApp) {
      this.appDetailsForm.reset();
      this.showAppTrancheTable = false;
      this.showAppBankDetails = false;
      this.showAppDDDetails = false;
      this.showAppCASADetails = false;
      this.trancheAppList=[];
      this.commonFormArray.forEach(key => {
        this.appDetailsForm.get(key).clearValidators();
        this.appDetailsForm.get(key).setErrors(null) ;
      });

    }
     if(!this.disburseToCoApp){
       this.coAppDetailsForm.controls['coAppName'].reset();
       this.coAppDetailsForm.controls['coAppName'].clearValidators();
       this.coAppDetailsForm.controls['coAppName'].setErrors(null);
       this.selectCoApplicant('');   
    }
    if(!this.disburseToBanker) {
      this.bankerDetailsForm.reset();
      this.showBankerTrancheTable = false;
      this.showBankerBankDetails = false;
      this.showBankerDDDetails = false;
      this.showBankerCASADetails = false;
      this.trancheBankerList=[];
      this.bankerformArray.forEach(key => {
        this.bankerDetailsForm.get(key).clearValidators();
        this.bankerDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToFinancier) {
      this.financierDetailsForm.reset();
      this.showFinancierTrancheTable = false;
      this.showFinBankDetails = false;
      this.showFinDDDetails = false;
      this.showFinCASADetails = false;
      this.trancheFinancierList=[];
      this.finformArray.forEach(key => {
        this.financierDetailsForm.get(key).clearValidators();
        this.financierDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToThirdParty) {
      this.thirdPartyDetailsForm.reset();
      this.showThirdPartyTrancheTable = false;
      this.showTPBankDetails = false;
      this.showTPDDDetails = false;
      this.showTPCASADetails = false;
      this.trancheTpList=[];
      this.commonFormArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).clearValidators();
        this.thirdPartyDetailsForm.get(key).setErrors(null) ;
      });
    }
    if(!this.disburseToIBT) {
      this.ibtDetailsForm.reset();
      this.ibtDetailsForm.controls['ibtFavoringName'].clearValidators();
      this.ibtDetailsForm.controls['ibtLoanAccNumber'].clearValidators();
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

  selectCoApplicant(sNo){
    //console.log('selectedCoAppLists', this.coAppNamesLov)
    this.coApp1 = false;
    this.coApp2 = false;
    this.coApp3 = false;
    for (let i = 0; i < this.coAppNamesLov.length; i++) {
        for (let j = 0; j < sNo.length; j++) {
            if (this.coAppNamesLov[i]['serialNo'] == (sNo)[j]) {
                if (sNo[j] == "1") {
                    this.coAppNamesLov.forEach(element => {
                        if (element['serialNo'] == '1') {
                            this.coApplicant1['beneficiaryName'] = element['value'];
                            this.coApplicant1['applicantId'] = element['key'];
                            this.coApp1 = true;
                        }
                    })
                }
                if (sNo[j] == "2") {
                    this.coAppNamesLov.forEach(element => {
                        if (element['serialNo'] == '2') {
                            this.coApplicant2['beneficiaryName'] = element['value'];
                            this.coApplicant2['applicantId'] = element['key'];
                            this.coApp2 = true;
                        }
                    })
                }
                if (sNo[j] == "3") {
                    this.coAppNamesLov.forEach(element => {
                        if (element['serialNo'] == '3') {
                            this.coApplicant3['beneficiaryName'] = element['value'];
                            this.coApplicant3['applicantId'] = element['key'];
                            this.coApp3 = true;
                        }
                    })
                }
            }
        }
    }
    if (!this.coApp1) {
        this.coApp1Form.reset();
        this.showCoApp1TrancheTable = false;
        this.showCoApp1BankDetails = false;
        this.showCoApp1DDDetails = false;
        this.showCoApp1CASADetails = false;
        this.trancheCoApp1List = [];
        this.commonFormArray.forEach(key => {
          this.coApp1Form.get(key).clearValidators();
          this.coApp1Form.get(key).setErrors(null);
        });

    }
    if (!this.coApp2) {
        this.coApp2Form.reset();
        this.showCoApp2TrancheTable = false;
        this.showCoApp2BankDetails = false;
        this.showCoApp2DDDetails = false;
        this.showCoApp2CASADetails = false;
        this.trancheCoApp2List = [];
        this.commonFormArray.forEach(key => {
          this.coApp2Form.get(key).clearValidators();
          this.coApp2Form.get(key).setErrors(null);
        });

    }
    if (!this.coApp3) {
        this.coApp3Form.reset();
        this.showCoApp3TrancheTable = false;
        this.showCoApp3BankDetails = false;
        this.showCoApp3DDDetails = false;
        this.showCoApp3CASADetails = false;
        this.trancheCoApp3List = [];
        this.commonFormArray.forEach(key => {
          this.coApp3Form.get(key).clearValidators();
          this.coApp3Form.get(key).setErrors(null);
        });
    }
}

selectTranche(val,container,fetchList) {
  let pushListObject={
    'tranche_disbursement_type': '',
    'disbursement_percentage': '',
    'tranche_disbursement_amount': '',
    'trancheDisburseDate': '',
    'disbursement_id':'',
    'tranche_disbursement_id':'1',
  }
  if(fetchList) {
     pushListObject={
      'tranche_disbursement_type': '',
      'disbursement_percentage': '',
      'tranche_disbursement_amount': '',
      'trancheDisburseDate': '',
      'disbursement_id':'',
      'tranche_disbursement_id':'',
    }
  }
  if(container=='1' && val == true) {
    this.showTrancheTable = true;
    this.trancheDealerForm = this.fb.group({
      trancheDealerArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
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
  } else if (container=='2' && val == true) {
    this.showAppTrancheTable = true;
    this.trancheAppForm = this.fb.group({
      trancheAppArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
    });
    (this.trancheAppForm.get('trancheAppArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheAppForm.get('trancheAppArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheAppList.push(pushListObject);
  } else if (container=='4' && val == true) {
    this.showBankerTrancheTable = true;
    this.trancheBankerForm = this.fb.group({
      trancheBankerArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
    });
    (this.trancheBankerForm.get('trancheBankerArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheBankerForm.get('trancheBankerArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheBankerList.push(pushListObject);
  } else if (container=='5' && val == true) {
    this.showFinancierTrancheTable = true;
    this.trancheFinancierForm = this.fb.group({
      trancheFinancierArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
    });
    (this.trancheFinancierForm.get('trancheFinancierArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheFinancierForm.get('trancheFinancierArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheFinancierList.push(pushListObject);
  } else if (container=='6' && val == true) {
    this.showThirdPartyTrancheTable = true;
    this.trancheTPForm = this.fb.group({
      trancheTpArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
    });
    (this.trancheTPForm.get('trancheTpArray') as FormArray).valueChanges.subscribe(() => {
      (this.trancheTPForm.get('trancheTpArray') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheTpList.push(pushListObject);
  }else if (container=='8' && val == true){//coApp1
    this.showCoApp1TrancheTable = true;
    this.trancheCoApp1Form = this.fb.group({
      trancheCoApp1Array: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheCoApp1Form.get('trancheCoApp1Array') as FormArray).valueChanges.subscribe(() => {
      (this.trancheCoApp1Form.get('trancheCoApp1Array') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheCoApp1List.push(pushListObject);
  }else if (container=='9' && val == true){//coApp1
    this.showCoApp2TrancheTable = true;
    this.trancheCoApp2Form = this.fb.group({
      trancheCoApp2Array: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheCoApp2Form.get('trancheCoApp2Array') as FormArray).valueChanges.subscribe(() => {
      (this.trancheCoApp2Form.get('trancheCoApp2Array') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheCoApp2List.push(pushListObject);
  }else if (container=='10' && val == true){//coApp3
    this.showCoApp3TrancheTable = true;
    this.trancheCoApp3Form = this.fb.group({
      trancheCoApp3Array: this.fb.array([this.initTranche()]) //Validating the whole table Array(formArrayName)
    });
    (this.trancheCoApp3Form.get('trancheCoApp3Array') as FormArray).valueChanges.subscribe(() => {
      (this.trancheCoApp3Form.get('trancheCoApp3Array') as FormArray).controls.forEach((formGroup) => {
        if (formGroup['errors'] && formGroup['errors']['invalid']) {
          return;
        }
      });
    });
    this.trancheCoApp3List.push(pushListObject);
  }else {
    if(container=='1'){
      this.showTrancheTable = false;
      this.trancheDealerList=[];
    } else if(container=='2') {
      this.showAppTrancheTable = false;
      this.trancheAppList=[];
    } else if(container=='4') {
      this.showBankerTrancheTable = false;
      this.trancheBankerList=[];
    } else if(container=='5') {
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList=[];
    } else if(container=='6') {
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList=[];
    }else if(container=='8'){
      this.showCoApp1TrancheTable = false;
      this.trancheCoApp1List=[];
    }else if(container=='9'){
      this.showCoApp2TrancheTable = false;
      this.trancheCoApp2List=[];
    }else if(container=='10'){
      this.showCoApp3TrancheTable = false;
      this.trancheCoApp3List=[];
    }

  }
  }

selectCheckBox(flag,val) {
  this.dealerObjInfo['deductChargesFlag']=false;
  this.applicantObjInfo['deductChargesFlag']=false;
  this.coApplicant1['deductChargesFlag'] = false;
  this.coApplicant2['deductChargesFlag'] = false;
  this.coApplicant3['deductChargesFlag'] = false;
  this.bankerObjInfo['deductChargesFlag']=false;
  this.financierObjInfo['deductChargesFlag']=false;
  this.thirdPartyObjInfo['deductChargesFlag']=false;
  this.internalBTObjInfo['deductChargesFlag']=false


  if(val==1 && flag) {
    this.dealerObjInfo['deductChargesFlag']=true;
  } else if (val ==2 && flag) {
    this.applicantObjInfo['deductChargesFlag']=true;
  }else if (val ==4 && flag){
    this.bankerObjInfo['deductChargesFlag']=true;
  } else if (val ==5 && flag) {
    this.financierObjInfo['deductChargesFlag']=true;
  } else if (val ==6 && flag) {
    this.thirdPartyObjInfo['deductChargesFlag']=true;
  } else if(val ==7 && flag) {
    this.internalBTObjInfo['deductChargesFlag']=true
  }else if (val ==8 && flag){
    this.coApplicant1['deductChargesFlag']=true;
  }else if (val ==9 && flag){
    this.coApplicant2['deductChargesFlag']=true;
  }else if (val ==10 && flag){
    this.coApplicant3['deductChargesFlag']=true;
  }
}
  initForm() {
    //console.log(this.disburseToDealer)
    this.dealerDetailsForm = this.fb.group({
      dealerCode:new FormControl({value:this.dealerCode}, Validators.required),
      beneficiaryName: new FormControl({value:this.dealerObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.dealerObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.dealerObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.dealerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.dealerObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.dealerObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.dealerObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.dealerObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.dealerObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.dealerObjInfo['loanNumber']}, Validators.required),
      //address:new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
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
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.applicantObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.applicantObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.applicantObjInfo['loanNumber']}, Validators.required),
     //appAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
      paymentMethod: new FormControl({value:this.applicantObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.applicantObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),

    })
    this.coAppDetailsForm = this.fb.group({
      coAppName: new FormControl({value:this.coAppName}, Validators.required),
    })

    this.coApp1Form = this.fb.group({
      beneficiaryName: new FormControl({value:this.coApplicant1['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.coApplicant1['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.coApplicant1['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.coApplicant1['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.coApplicant1['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.coApplicant1['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.coApplicant1['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.coApplicant1['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.coApplicant1['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.coApplicant1['loanNumber']}, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
      paymentMethod: new FormControl({value:this.coApplicant1['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.coApplicant1['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })

    this.coApp2Form = this.fb.group({
      beneficiaryName: new FormControl({value:this.coApplicant2['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.coApplicant2['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.coApplicant2['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.coApplicant2['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.coApplicant2['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.coApplicant2['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.coApplicant2['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.coApplicant2['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.coApplicant2['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.coApplicant2['loanNumber']}, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
      paymentMethod: new FormControl({value:this.coApplicant2['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.coApplicant2['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })

    this.coApp3Form = this.fb.group({
      beneficiaryName: new FormControl({value:this.coApplicant3['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.coApplicant3['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.coApplicant3['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.coApplicant3['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.coApplicant3['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.coApplicant3['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.coApplicant3['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.coApplicant3['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.coApplicant3['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.coApplicant3['loanNumber']}, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
      paymentMethod: new FormControl({value:this.coApplicant3['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.coApplicant3['disbursementAmount']}, Validators.required),
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
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.bankerObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.bankerObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.bankerObjInfo['loanNumber']}, Validators.required),
      //bankerAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
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
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.financierObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.financierObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.financierObjInfo['loanNumber']}, Validators.required),
      //financierAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
      paymentMethod: new FormControl({value:this.financierObjInfo['paymentMethod']}, Validators.required),
      disbursementAmount:new FormControl({value:this.financierObjInfo['disbursementAmount']}, Validators.required),
      deductChargesFlag:new FormControl(''),
      trancheDisbursementFlag:new FormControl(''),
    })
    this.thirdPartyDetailsForm = this.fb.group({
      // beneficiaryName:new FormControl(''),
      beneficiaryName: new FormControl({value:this.thirdPartyObjInfo['beneficiaryName']}, Validators.required),
      beneficiaryAccountNo:new FormControl({value:this.thirdPartyObjInfo['beneficiaryAccountNo']}, Validators.required),
      beneficiaryBank:new FormControl({value:this.thirdPartyObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode:new FormControl({value:this.thirdPartyObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch:new FormControl({value:this.thirdPartyObjInfo['beneficiaryBranch']}, Validators.required),
      instrumentType:new FormControl({value:this.thirdPartyObjInfo['instrumentType']}, Validators.required),
      instrumentNumber:new FormControl({value:this.thirdPartyObjInfo['instrumentNumber']}, Validators.required),
      instrumentDate:new FormControl('', Validators.required),
      favouringBankOfDraw:new FormControl({value:this.thirdPartyObjInfo['favouringBankOfDraw']}, Validators.required),
      favouringBankBranch:new FormControl({value:this.thirdPartyObjInfo['favouringBankBranch']}, Validators.required),
      loanNumber:new FormControl({value:this.thirdPartyObjInfo['loanNumber']}, Validators.required),
      //thirdPartyAddress: new FormControl(''),
      beneficiaryAddress1:new FormControl(''),
      beneficiaryAddress2:new FormControl(''),
      beneficiaryAddress3:new FormControl(''),
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
      // disburseTo:new FormControl(''),
      toDeductCharges:[''],
    })
  }

  saveAndUpdate() {
    // console.log(this.disburseTo)
    // console.log('1', this.dealerDetailsForm.valid);
    // console.log('2', this.appDetailsForm.valid);
    // console.log('3', this.coAppDetailsForm.valid);
    // console.log('4', this.bankerDetailsForm.valid);
    // console.log('5', this.financierDetailsForm.valid);
    // console.log('6', this.thirdPartyDetailsForm.valid);
    // console.log('7', this.ibtDetailsForm.valid);
    // console.log('8', this.coApp1Form.valid);
    // console.log('9', this.coApp2Form.valid);
    // console.log('10', this.coApp3Form.valid);
    const dealerFormValue = this.dealerDetailsForm.getRawValue();
    if(this.trancheDealerList.length!=0){
      dealerFormValue.trancheDisbursementJson = this.trancheDealerForm?JSON.stringify(this.trancheDealerForm.value.trancheDealerArray):'';
    }else{
     dealerFormValue.trancheDisbursementJson="";
    }
    this.ReqDealerDetails = {
      leadID: this.disbLeadId,
      disbursementID: this.dealerObjInfo['disbursementID'] ? this.dealerObjInfo['disbursementID'] : null,
      payableTo:'1DISBURSETO',
      favouring:'Dealer',
      dealerCode: this.dealerObjInfo['dealerCode'],
      beneficiaryName:this.dealerObjInfo['beneficiaryName'],
      applicantName: this.dealerObjInfo['beneficiaryName'],
      favouringName : this.dealerObjInfo['beneficiaryName'],
      beneficiaryAccountNo:this.dealerObjInfo['beneficiaryAccountNo'],
      beneficiaryBank:this.dealerObjInfo['beneficiaryBank'],
      ifscCode:this.dealerObjInfo['ifscCode'],
      beneficiaryBranch:this.dealerObjInfo['beneficiaryBranch'],
      instrumentType:this.dealerObjInfo['instrumentType'],
      instrumentNumber: this.dealerObjInfo['instrumentNumber'],
      instrumentDate: dealerFormValue.instrumentDate ? this.utilityService.getDateFormat(dealerFormValue.instrumentDate) : '',
      favouringBankOfDraw: this.dealerObjInfo['favouringBankOfDraw'],
      favouringBankBranch: this.dealerObjInfo['favouringBankBranch'],
      loanNumber: this.dealerObjInfo['loanNumber'],
      beneficiaryAddress1 : this.dealerObjInfo['beneficiaryAddress1'],
      beneficiaryAddress2 : this.dealerObjInfo['beneficiaryAddress2'],
      beneficiaryAddress3 : this.dealerObjInfo['beneficiaryAddress3'],
      paymentMethod:this.dealerObjInfo['paymentMethod'],
      disbursementAmount:''+this.dealerObjInfo['disbursementAmount'],
      deductChargesFlag: (this.dealerObjInfo['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.dealerObjInfo['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:dealerFormValue.trancheDisbursementJson,
      active:'1'
    };

    const appFormValue = this.appDetailsForm.getRawValue();
    if(this.trancheAppList.length!=0){
      appFormValue.trancheDisbursementJson = this.trancheAppForm?JSON.stringify(this.trancheAppForm.value.trancheAppArray):'';
    }else{
      appFormValue.trancheDisbursementJson="";
    }
    this.ReqApplicantDetails = {
      leadID: this.disbLeadId,
      disbursementID: this.applicantObjInfo['disbursementID'] ? this.applicantObjInfo['disbursementID'] : null,
      payableTo:'2DISBURSETO',
      favouring:'Applicant',
      beneficiaryName:this.applicantObjInfo['beneficiaryName'],
      applicantName: this.applicantObjInfo['beneficiaryName'],
      favouringName : this.applicantObjInfo['beneficiaryName'],
      beneficiaryAccountNo:this.applicantObjInfo['beneficiaryAccountNo'],
      beneficiaryBank:this.applicantObjInfo['beneficiaryBank'],
      ifscCode:this.applicantObjInfo['ifscCode'],
      beneficiaryBranch:this.applicantObjInfo['beneficiaryBranch'],
      instrumentType:this.applicantObjInfo['instrumentType'],
      instrumentNumber: this.applicantObjInfo['instrumentNumber'],
      instrumentDate: appFormValue.instrumentDate ? this.utilityService.getDateFormat(appFormValue.instrumentDate) : '',
      favouringBankOfDraw: this.applicantObjInfo['favouringBankOfDraw'],
      favouringBankBranch: this.applicantObjInfo['favouringBankBranch'],
      loanNumber: this.applicantObjInfo['loanNumber'],
      beneficiaryAddress1 : this.applicantObjInfo['beneficiaryAddress1'],
      beneficiaryAddress2 : this.applicantObjInfo['beneficiaryAddress2'],
      beneficiaryAddress3 : this.applicantObjInfo['beneficiaryAddress3'],
      paymentMethod:this.applicantObjInfo['paymentMethod'],
      disbursementAmount:this.applicantObjInfo['disbursementAmount'],
      deductChargesFlag: (this.applicantObjInfo['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.applicantObjInfo['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:appFormValue.trancheDisbursementJson,
      active:'1'
    };

    const coApp1FormValue = this.coApp1Form.getRawValue();
    if(this.trancheCoApp1List.length!=0){
      coApp1FormValue.trancheDisbursementJson = this.trancheCoApp1Form?JSON.stringify(this.trancheCoApp1Form.value.trancheCoApp1Array):'';
    }else{
      coApp1FormValue.trancheDisbursementJson="";
    }
    this.ReqCoApp1Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApplicant1['disbursementID'] ? this.coApplicant1['disbursementID'] : null,
      payableTo:'3DISBURSETO',
      favouring:'Co Applicant',
      applicantId:this.coApplicant1['applicantId'],
      beneficiaryName:this.coApplicant1['beneficiaryName'],
      applicantName: this.coApplicant1['beneficiaryName'],
      favouringName : this.coApplicant1['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant1['beneficiaryAccountNo'],
      beneficiaryBank:this.coApplicant1['beneficiaryBank'],
      ifscCode:this.coApplicant1['ifscCode'],
      beneficiaryBranch:this.coApplicant1['beneficiaryBranch'],
      instrumentType:this.coApplicant1['instrumentType'],
      instrumentNumber: this.coApplicant1['instrumentNumber'],
      instrumentDate: coApp1FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp1FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant1['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant1['favouringBankBranch'],
      loanNumber: this.coApplicant1['loanNumber'],
      beneficiaryAddress1 : this.coApplicant1['beneficiaryAddress1'],
      beneficiaryAddress2 : this.coApplicant1['beneficiaryAddress2'],
      beneficiaryAddress3 : this.coApplicant1['beneficiaryAddress3'],
      paymentMethod: this.coApplicant1['paymentMethod'],
      disbursementAmount:this.coApplicant1['disbursementAmount'],
      deductChargesFlag: (this.coApplicant1['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant1['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:coApp1FormValue.trancheDisbursementJson,
      active:'1'
    };
    const coApp2FormValue = this.coApp2Form.getRawValue();
    coApp2FormValue.trancheDisbursementJson = this.trancheCoApp2Form?JSON.stringify(this.trancheCoApp2Form.value.trancheCoApp2Array):'';
    this.ReqCoApp2Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApplicant2['disbursementID'] ? this.coApplicant2['disbursementID'] : null,
      payableTo:"3DISBURSETO",
      favouring:"Co Applicant",
      applicantId:this.coApplicant2['applicantId'],
      beneficiaryName:this.coApplicant2['beneficiaryName'],
      applicantName: this.coApplicant2['beneficiaryName'],
      favouringName : this.coApplicant2['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant2['beneficiaryAccountNo'],
      beneficiaryBank:this.coApplicant2['beneficiaryBank'],
      ifscCode:this.coApplicant2['ifscCode'],
      beneficiaryBranch:this.coApplicant2['beneficiaryBranch'],
      instrumentType:this.coApplicant2['instrumentType'],
      instrumentNumber: this.coApplicant2['instrumentNumber'],
      instrumentDate: coApp2FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp2FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant2['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant2['favouringBankBranch'],
      loanNumber: this.coApplicant2['loanNumber'],
      beneficiaryAddress1 : this.coApplicant2['beneficiaryAddress1'],
      beneficiaryAddress2 : this.coApplicant2['beneficiaryAddress2'],
      beneficiaryAddress3 : this.coApplicant2['beneficiaryAddress3'],
      paymentMethod: this.coApplicant2['paymentMethod'],
      disbursementAmount:this.coApplicant2['disbursementAmount'],
      deductChargesFlag: (this.coApplicant2['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant2['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:coApp2FormValue.trancheDisbursementJson,
      active:'1'
    };
    const coApp3FormValue = this.coApp3Form.getRawValue();
    coApp3FormValue.trancheDisbursementJson = this.trancheCoApp3Form?JSON.stringify(this.trancheCoApp3Form.value.trancheCoApp3Array):'';
    this.ReqCoApp3Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApplicant3['disbursementID'] ? this.coApplicant3['disbursementID'] : null,
      payableTo:"3DISBURSETO",
      favouring:"Co Applicant",
      applicantId:this.coApplicant3['applicantId'],
      beneficiaryName:this.coApplicant3['beneficiaryName'],
      applicantName: this.coApplicant3['beneficiaryName'],
      favouringName : this.coApplicant3['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant3['beneficiaryAccountNo'],
      beneficiaryBank:this.coApplicant3['beneficiaryBank'],
      ifscCode:this.coApplicant3['ifscCode'],
      beneficiaryBranch:this.coApplicant3['beneficiaryBranch'],
      instrumentType:this.coApplicant3['instrumentType'],
      instrumentNumber: this.coApplicant3['instrumentNumber'],
      instrumentDate: coApp3FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp3FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant3['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant3['favouringBankBranch'],
      loanNumber: this.coApplicant3['loanNumber'],
      beneficiaryAddress1 : this.coApplicant3['beneficiaryAddress1'],
      beneficiaryAddress2 : this.coApplicant3['beneficiaryAddress2'],
      beneficiaryAddress3 : this.coApplicant3['beneficiaryAddress3'],
      paymentMethod: this.coApplicant3['paymentMethod'],
      disbursementAmount:this.coApplicant3['disbursementAmount'],
      deductChargesFlag: (this.coApplicant3['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant3['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:coApp3FormValue.trancheDisbursementJson,
      active:'1'
    };

    const bankerFormValue = this.bankerDetailsForm.getRawValue();
    bankerFormValue.trancheDisbursementJson = this.trancheBankerForm?JSON.stringify(this.trancheBankerForm.value.trancheBankerArray):'';
    this.ReqBankerDetails = {
      leadID: this.disbLeadId,
      disbursementID: this.bankerObjInfo['disbursementID'] ? this.bankerObjInfo['disbursementID'] : null,
      payableTo:'4DISBURSETO',
      favouring:'Banker',
      bankerId:this.bankerObjInfo['bankerId'],
      beneficiaryName:this.bankerObjInfo['beneficiaryName'],
      applicantName: this.bankerObjInfo['beneficiaryName'],
      favouringName : this.bankerObjInfo['beneficiaryName'],
      beneficiaryAccountNo:this.bankerObjInfo['beneficiaryAccountNo'],
      beneficiaryBank:this.bankerObjInfo['beneficiaryBank'],
      ifscCode:this.bankerObjInfo['ifscCode'],
      beneficiaryBranch:this.bankerObjInfo['beneficiaryBranch'],
      instrumentType:this.bankerObjInfo['instrumentType'],
      instrumentNumber: this.bankerObjInfo['instrumentNumber'],
      instrumentDate: bankerFormValue.instrumentDate ? this.utilityService.getDateFormat(bankerFormValue.instrumentDate) : '',
      favouringBankOfDraw: this.bankerObjInfo['favouringBankOfDraw'],
      favouringBankBranch: this.bankerObjInfo['favouringBankBranch'],
      loanNumber: this.bankerObjInfo['loanNumber'],
      beneficiaryAddress1 : this.bankerObjInfo['beneficiaryAddress1'],
      beneficiaryAddress2 : this.bankerObjInfo['beneficiaryAddress2'],
      beneficiaryAddress3 : this.bankerObjInfo['beneficiaryAddress3'],
      paymentMethod:this.bankerObjInfo['paymentMethod'],
      disbursementAmount:this.bankerObjInfo['disbursementAmount'],
      deductChargesFlag: (this.bankerObjInfo['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.bankerObjInfo['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:bankerFormValue.trancheDisbursementJson,
      active:'1'
    };

    const financierFormValue = this.financierDetailsForm.getRawValue();
    financierFormValue.trancheDisbursementJson = this.trancheFinancierForm?JSON.stringify(this.trancheFinancierForm.value.trancheFinancierArray):'';
    this.ReqFinancierDetails = {
      leadID: this.disbLeadId,
      disbursementID: this.financierObjInfo['disbursementID'] ? this.financierObjInfo['disbursementID'] : null,
      payableTo:'5DISBURSETO',
      favouring:'Financier',
      financierId:this.financierObjInfo['financierId'],
      beneficiaryName:this.financierObjInfo['beneficiaryName'],
      applicantName: this.financierObjInfo['beneficiaryName'],
      favouringName : this.financierObjInfo['beneficiaryName'],
      beneficiaryAccountNo:this.financierObjInfo['beneficiaryAccountNo'],
      beneficiaryBank:this.financierObjInfo['beneficiaryBank'],
      ifscCode:this.financierObjInfo['ifscCode'],
      beneficiaryBranch:this.financierObjInfo['beneficiaryBranch'],
      instrumentType:this.financierObjInfo['instrumentType'],
      instrumentNumber: this.financierObjInfo['instrumentNumber'],
      instrumentDate: financierFormValue.instrumentDate ? this.utilityService.getDateFormat(financierFormValue.instrumentDate) : '',
      favouringBankOfDraw: this.financierObjInfo['favouringBankOfDraw'],
      favouringBankBranch: this.financierObjInfo['favouringBankBranch'],
      loanNumber: this.financierObjInfo['loanNumber'],
      beneficiaryAddress1 : this.financierObjInfo['beneficiaryAddress1'],
      beneficiaryAddress2 : this.financierObjInfo['beneficiaryAddress2'],
      beneficiaryAddress3 : this.financierObjInfo['beneficiaryAddress3'],
      paymentMethod:this.financierObjInfo['paymentMethod'],
      disbursementAmount:this.financierObjInfo['disbursementAmount'],
      deductChargesFlag: (this.financierObjInfo['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.financierObjInfo['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:financierFormValue.trancheDisbursementJson,
      active:'1'
    };

    const thirdPartyFormValue = this.thirdPartyDetailsForm.getRawValue();
    thirdPartyFormValue.trancheDisbursementJson = this.trancheTPForm?JSON.stringify(this.trancheTPForm.value.trancheTpArray):'';
    this.ReqTPDetails = {
      leadID: this.disbLeadId,
      disbursementID: this.thirdPartyObjInfo['disbursementID'] ? this.thirdPartyObjInfo['disbursementID'] : null,
      payableTo:'6DISBURSETO',
      favouring:'Third Party',
      beneficiaryName:this.thirdPartyObjInfo['beneficiaryName'],
      applicantName: this.thirdPartyObjInfo['beneficiaryName'],
      favouringName : this.thirdPartyObjInfo['beneficiaryName'],
      beneficiaryAccountNo:this.thirdPartyObjInfo['beneficiaryAccountNo'],
      beneficiaryBank:this.thirdPartyObjInfo['beneficiaryBank'],
      ifscCode:this.thirdPartyObjInfo['ifscCode'],
      beneficiaryBranch:this.thirdPartyObjInfo['beneficiaryBranch'],
      instrumentType:this.thirdPartyObjInfo['instrumentType'],
      instrumentNumber: this.thirdPartyObjInfo['instrumentNumber'],
      instrumentDate: thirdPartyFormValue.instrumentDate ? this.utilityService.getDateFormat(thirdPartyFormValue.instrumentDate) : '',
      favouringBankOfDraw: this.thirdPartyObjInfo['favouringBankOfDraw'],
      favouringBankBranch: this.thirdPartyObjInfo['favouringBankBranch'],
      loanNumber: this.thirdPartyObjInfo['loanNumber'],
      beneficiaryAddress1 : this.thirdPartyObjInfo['beneficiaryAddress1'],
      beneficiaryAddress2 : this.thirdPartyObjInfo['beneficiaryAddress2'],
      beneficiaryAddress3 : this.thirdPartyObjInfo['beneficiaryAddress3'],
      paymentMethod:this.thirdPartyObjInfo['paymentMethod'],
      disbursementAmount:this.thirdPartyObjInfo['disbursementAmount'],
      deductChargesFlag: (this.thirdPartyObjInfo['deductChargesFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.thirdPartyObjInfo['trancheDisbursementFlag'] == true) ? 'Y':'N',
      trancheDisbursementJson:thirdPartyFormValue.trancheDisbursementJson,
      active:'1'
    };

    // let  dealerData: any = { ...dealerFormValue };
    // console.log(dealerData)
    //let trancheDisbursementJson = this.trancheDealerForm.value.trancheDealerArray;
    this.ReqCoAppDetailsArray = [];
    if(this.coApp1)
    this.ReqCoAppDetailsArray.push(this.ReqCoApp1Details)
    if(this.coApp2)
    this.ReqCoAppDetailsArray.push(this.ReqCoApp2Details)
    if(this.coApp3)
    this.ReqCoAppDetailsArray.push(this.ReqCoApp3Details)

    let inputData = {
              'LeadID':this.disbLeadId,
              'UserID': this.disuserID,
              'DealerDetails': this.disburseToDealer ? this.ReqDealerDetails : null,
              'ApplicantDetails': this.disburseToApp ? this.ReqApplicantDetails : null,
              'CoApplicantDetails': this.disburseToCoApp ? this.ReqCoAppDetailsArray : null,
              'BankerDetails': this.disburseToBanker ? this.ReqBankerDetails : null,
              'FinancierDetails': this.disburseToFinancier ? this.ReqFinancierDetails : null,
              'ThirdPartyDetails': this.disburseToThirdParty ? this.ReqTPDetails : null,
          }

    this.isDirty = true;
    if(this.disburseTo.length!=0){
    if(this.dealerObjInfo['deductChargesFlag'] || this.applicantObjInfo['deductChargesFlag'] || this.coApplicant1['deductChargesFlag'] ||
    this.coApplicant2['deductChargesFlag'] ||this.coApplicant3['deductChargesFlag'] || this.bankerObjInfo['deductChargesFlag']
     || this.financierObjInfo['deductChargesFlag'] || this.thirdPartyObjInfo['deductChargesFlag'] || this.internalBTObjInfo['deductChargesFlag']) {// deduct charges related
        if (this.dealerDetailsForm.valid=== true && this.appDetailsForm.valid=== true  &&
          this.coApp1Form.valid=== true && this.coApp2Form.valid=== true && this.coApp3Form.valid=== true &&
           this.bankerDetailsForm.valid=== true && this.financierDetailsForm.valid=== true && this.thirdPartyDetailsForm.valid=== true) { // all containers check

            if(this.dealerObjInfo['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheDealerForm.valid)
              if(!this.trancheDealerForm.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in Dealer Tranche & check other tranche tables too', '');
                return;
              }
            }
            if(this.applicantObjInfo['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheAppForm.valid)
              if(!this.trancheAppForm.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in Applicant Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.coApplicant1['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheCoApp1Form.valid)
              if(!this.trancheCoApp1Form.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in coApplicant1 Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.coApplicant2['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheCoApp2Form.valid)
              if(!this.trancheCoApp2Form.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in coApplicant2 Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.coApplicant3['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheCoApp3Form.valid)
              if(!this.trancheCoApp3Form.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in coApplicant3 Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.bankerObjInfo['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheBankerForm.valid)
              if(!this.trancheBankerForm.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in Banker Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.financierObjInfo['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheFinancierForm.valid)
              if(!this.trancheFinancierForm.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in Financier Tranche & check other tranche tables too', '');
                return;}
            }
            if(this.thirdPartyObjInfo['trancheDisbursementFlag']) {
              //console.log('tranche',this.trancheTPForm.valid)
              if(!this.trancheTPForm.valid) {
                this.toasterService.showError('Kindly fill mandatory fields in Tranche third party table & check other tranche tables too', '');
                return;}
            }
            console.log('Req:',inputData);
            this.disbursementService.saveUpdateDisbursement(inputData).subscribe((res: any) => {
              const response = res;
              const appiyoError = response.Error;
              if (appiyoError === '0') {
                const apiError = response.ProcessVariables.error;
                if(apiError.code=='0'){
                  this.toasterService.showSuccess('saved successfully', '');
                }else{
                  this.toasterService.showError(apiError.message, '');
                }
                console.log('saveUpdate',response.ProcessVariables)
              }
            });

        } else {
          this.toasterService.showError('Please fill all mandatory fields', '');
        }
   } else {
      this.toasterService.showError('Select Atleast one deduct charges to proceed save','');
   }
   }else{
    this.toasterService.showError('Kindly Select to whom to disburse the loan amount','');
   }

  }
  fetchDisbursementDetails() {
    this.disbursementService.fetchDisbursement(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('fetchDisburseDetails',response)
        this.disbursementDetailsData=response.ProcessVariables;
        this.leadID = this.disbursementDetailsData.LeadID;
        if(this.disbursementDetailsData.payableTo) {
        this.disburseTo = this.disbursementDetailsData.payableTo.split(',');
        }
        if(this.disburseTo) {
          this.disburseToVal(this.disburseTo);
        }
        if(this.disbursementDetailsData.DealerDetails) {
        this.dealerObjInfo = this.disbursementDetailsData.DealerDetails;
        this.dealerCode = this.disbursementDetailsData.DealerDetails.dealerCode;
        this.dealerObjInfo['instrumentDate'] = this.disbursementDetailsData.DealerDetails.instrumentDate;
        this.dealerDetailsForm.patchValue({ instrumentDate: (this.dealerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.dealerObjInfo['instrumentDate'])) : '' });
        this.dealerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.DealerDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.dealerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.DealerDetails.deductChargesFlag == 'Y') ? true : false;
        this.dealerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.DealerDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.DealerDetails.disbursementAmount):null;
        //this.dealerDetailsForm.patchValue({ address: (this.disbursementDetailsData.DealerDetails)? this.disbursementDetailsData.DealerDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.DealerDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.DealerDetails.beneficiaryAddress3: null });

        this.dealerObjInfo['paymentMethod'] = this.disbursementDetailsData.DealerDetails.paymentMethod;
        if(this.dealerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.dealerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showBankDetails = true;
        } else if (this.dealerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showDDDetails = true;
        } else if(this.dealerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showCASADetails = true;
        }
        if(this.dealerObjInfo['instrumentDate']){
          this.dealerDetailsForm.patchValue({ instrumentDate: (this.dealerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.dealerObjInfo['instrumentDate'])) : '' });
        } else {
          this.dealerDetailsForm.controls['instrumentDate'].clearValidators();
          this.dealerDetailsForm.controls['instrumentDate'].setErrors(null);
        }
        if(this.dealerObjInfo['trancheDisbursementFlag']) {
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


        if(this.disbursementDetailsData.ApplicantDetails) {
        this.applicantObjInfo = this.disbursementDetailsData.ApplicantDetails;
        this.applicantObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ApplicantDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.applicantObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ApplicantDetails.deductChargesFlag == 'Y') ? true : false;
        this.applicantObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ApplicantDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.ApplicantDetails.disbursementAmount):null;
        //this.appDetailsForm.patchValue({ appAddress: (this.disbursementDetailsData.ApplicantDetails)? this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress3: null });

        this.applicantObjInfo['paymentMethod'] = this.disbursementDetailsData.ApplicantDetails.paymentMethod;
        if(this.applicantObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.applicantObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showAppBankDetails = true;
        } else if (this.applicantObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showAppDDDetails = true;
        } else if(this.applicantObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showAppCASADetails = true;
        }
        if(this.applicantObjInfo['instrumentDate']){
          this.appDetailsForm.patchValue({ instrumentDate: (this.applicantObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.applicantObjInfo['instrumentDate'])) : '' });
        } else {
          this.appDetailsForm.controls['instrumentDate'].clearValidators();
          this.appDetailsForm.controls['instrumentDate'].setErrors(null);
        }
        if(this.applicantObjInfo['trancheDisbursementFlag']) {
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


        if(this.disbursementDetailsData.CoApplicantDetails) {
          var fetchCoAppList = this.disbursementDetailsData.CoApplicantDetails;
          var fetchedCoApplicantList=[]
          for (let i = 0; i < this.coAppNamesLov.length; i++) {
            for (let j = 0; j < fetchCoAppList.length; j++) {
              if(this.coAppNamesLov[i]['key']==(fetchCoAppList)[j]['applicantId']){
                fetchedCoApplicantList.push(this.coAppNamesLov[i]['serialNo'])
              }
            }
        }
        //console.log('test',fetchedCoApplicantList)        

        if(fetchedCoApplicantList.length!=0){
          this.disbursementDetailsData.CoApplicantDetails.length
          var index=0
          fetchedCoApplicantList.forEach(element => {
           // console.log(index)
            if(element=='1'){
              this.coApp1=true;
              this.coApplicant1 = this.disbursementDetailsData.CoApplicantDetails[index];
              index++
            }
            else if(element=='2'){
              this.coApp2=true;
              this.coApplicant2 = this.disbursementDetailsData.CoApplicantDetails[index];
              index++
            }
            else if(element=='3'){
              this.coApp3=true;
              this.coApplicant3 = this.disbursementDetailsData.CoApplicantDetails[index];
              index++
            }
            
          });
          var setList=fetchedCoApplicantList.toString();
          this.coAppName=setList.split(",");
        }
        //console.log('fetchedCoApp',this.coAppName)  
        }
        if(this.coApplicant1){
          this.coApplicant1['trancheDisbursementFlag'] = (this.coApplicant1['trancheDisbursementFlag'] == 'Y') ? true : false; 
          this.coApplicant1['deductChargesFlag'] = (this.coApplicant1['deductChargesFlag'] == 'Y') ? true : false;
        if(this.coApplicant1['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant1['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showCoApp1BankDetails = true;
        } else if (this.coApplicant1['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showCoApp1DDDetails = true;
        } else if(this.coApplicant1['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showCoApp1CASADetails = true;
        }
        if(this.coApplicant1['instrumentDate']){
          this.coApp1Form.patchValue({ instrumentDate: (this.coApplicant1['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant1['instrumentDate'])) : null });
        } else {
          this.coApp1Form.controls['instrumentDate'].clearValidators();
          this.coApp1Form.controls['instrumentDate'].setErrors(null);
        } 
        if(this.coApplicant1['trancheDisbursementFlag']) {
        this.selectTranche(this.coApplicant1['trancheDisbursementFlag'],8,true);
        let formArray = <FormArray>this.trancheCoApp1Form.get('trancheCoApp1Array');
        formArray.clear();
        this.trancheCoApp1List = [];
        this.trancheCoApp1List = JSON.parse(this.coApplicant1['trancheDisbursementJson']);
        this.trancheCoApp1List.forEach(() => {
          this.coApp1TrancheDetail.push(this.initTranche());
        });
        }
        }
        if(this.coApplicant2){
          this.coApplicant2['trancheDisbursementFlag'] = (this.coApplicant2['trancheDisbursementFlag'] == 'Y') ? true : false; 
          this.coApplicant2['deductChargesFlag'] = (this.coApplicant2['deductChargesFlag'] == 'Y') ? true : false;
        if(this.coApplicant2['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant2['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showCoApp2BankDetails = true;
        } else if (this.coApplicant2['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showCoApp2DDDetails = true;
        } else if(this.coApplicant2['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showCoApp2CASADetails = true;
        }
        if(this.coApplicant2['instrumentDate']){
          this.coApp2Form.patchValue({ instrumentDate: (this.coApplicant2['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant2['instrumentDate'])) : null });
        } else {
          this.coApp2Form.controls['instrumentDate'].clearValidators();
          this.coApp2Form.controls['instrumentDate'].setErrors(null);
        }
          
        if(this.coApplicant2['trancheDisbursementFlag']) {
        this.selectTranche(this.coApplicant2['trancheDisbursementFlag'],9,true);
        let formArray = <FormArray>this.trancheCoApp2Form.get('trancheCoApp2Array');
        formArray.clear();
        this.trancheCoApp2List = [];
        this.trancheCoApp2List = JSON.parse(this.coApplicant2['trancheDisbursementJson']);
        this.trancheCoApp2List.forEach(() => {
          this.coApp2TrancheDetail.push(this.initTranche());
        });
        }
        }
        if(this.coApplicant3){
          this.coApplicant3['trancheDisbursementFlag'] = (this.coApplicant3['trancheDisbursementFlag'] == 'Y') ? true : false; 
          this.coApplicant3['deductChargesFlag'] = (this.coApplicant3['deductChargesFlag'] == 'Y') ? true : false;
        if(this.coApplicant3['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant3['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showCoApp3BankDetails = true;
        } else if (this.coApplicant3['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showCoApp3DDDetails = true;
        } else if(this.coApplicant3['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showCoApp3CASADetails = true;
        }
        if(this.coApplicant3['instrumentDate']){
          this.coApp3Form.patchValue({ instrumentDate: (this.coApplicant3['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant3['instrumentDate'])) : null });
        } else {
          this.coApp3Form.controls['instrumentDate'].clearValidators();
          this.coApp3Form.controls['instrumentDate'].setErrors(null);
        }
        if(this.coApplicant3['trancheDisbursementFlag']) {
        this.selectTranche(this.coApplicant3['trancheDisbursementFlag'],10,true);
        let formArray = <FormArray>this.trancheCoApp3Form.get('trancheCoApp3Array');
        formArray.clear();
        this.trancheCoApp3List = [];
        this.trancheCoApp3List = JSON.parse(this.coApplicant3['trancheDisbursementJson']);
        this.trancheCoApp3List.forEach(() => {
          this.coApp3TrancheDetail.push(this.initTranche());
        });
        }
        }

        if(this.disbursementDetailsData.BankerDetails) {
        this.bankerObjInfo = this.disbursementDetailsData.BankerDetails;
        this.bankerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.BankerDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.bankerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.BankerDetails.deductChargesFlag == 'Y') ? true : false;
        this.bankerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.BankerDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.BankerDetails.disbursementAmount):null;

        this.bankerObjInfo['paymentMethod'] = this.disbursementDetailsData.BankerDetails.paymentMethod;
        if(this.bankerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.bankerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showBankerBankDetails = true;
        } else if (this.bankerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showBankerDDDetails = true;
        } else if(this.bankerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showBankerCASADetails = true;
        }
        if(this.bankerObjInfo['instrumentDate']){
          this.bankerDetailsForm.patchValue({ instrumentDate: (this.bankerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.bankerObjInfo['instrumentDate'])) : '' });
        } else {
          this.bankerDetailsForm.controls['instrumentDate'].clearValidators();
          this.bankerDetailsForm.controls['instrumentDate'].setErrors(null);
        }
        if(this.bankerObjInfo['trancheDisbursementFlag']) {
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

        if(this.disbursementDetailsData.FinancierDetails) {
        this.financierObjInfo = this.disbursementDetailsData.FinancierDetails;
        this.financierObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.FinancierDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.financierObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.FinancierDetails.deductChargesFlag == 'Y') ? true : false;     
        this.financierObjInfo['disbursementAmount'] = (this.disbursementDetailsData.FinancierDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.FinancierDetails.disbursementAmount):null;

        this.financierObjInfo['paymentMethod'] = this.disbursementDetailsData.FinancierDetails.paymentMethod;
        if(this.financierObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.financierObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showFinBankDetails = true;
        } else if (this.financierObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showFinDDDetails = true;
        } else if(this.financierObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showFinCASADetails = true;
        }
        if(this.financierObjInfo['instrumentDate']){
          this.financierDetailsForm.patchValue({ instrumentDate: (this.financierObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.financierObjInfo['instrumentDate'])) : '' });
        } else {
          this.financierDetailsForm.controls['instrumentDate'].clearValidators();
          this.financierDetailsForm.controls['instrumentDate'].setErrors(null);
        }
        if(this.financierObjInfo['trancheDisbursementFlag']) {
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

        if(this.disbursementDetailsData.ThirdPartyDetails) {
        this.thirdPartyObjInfo = this.disbursementDetailsData.ThirdPartyDetails;
        this.thirdPartyObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.trancheDisbursementFlag == 'Y') ? true : false; 
        this.thirdPartyObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.deductChargesFlag == 'Y') ? true : false;
        this.thirdPartyObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount)?parseInt(this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount):null;

        this.thirdPartyObjInfo['paymentMethod'] = this.disbursementDetailsData.ThirdPartyDetails.paymentMethod;
        if(this.thirdPartyObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.thirdPartyObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
          this.showTPBankDetails = true;
        } else if (this.thirdPartyObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
          this.showTPDDDetails = true;
        } else if(this.thirdPartyObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
          this.showTPCASADetails = true;
        }
        if(this.thirdPartyObjInfo['instrumentDate']){
          this.thirdPartyDetailsForm.patchValue({ instrumentDate: (this.thirdPartyObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.thirdPartyObjInfo['instrumentDate'])) : '' });
        } else {
          this.thirdPartyDetailsForm.controls['instrumentDate'].clearValidators();
          this.thirdPartyDetailsForm.controls['instrumentDate'].setErrors(null);
        }
        if(this.thirdPartyObjInfo['trancheDisbursementFlag']) {
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
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
 onNext() {
  if(this.roleType == '1') {
    this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/sanction-details`]);
  } else if (this.roleType == '2' ) {
    this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/term-sheet`]);
  } else if( this.roleType == '4' ) {
    this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/sanction-details`]);
  } else if(  this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.disbLeadId}/sanction-details`]);
  }
  }
routerUrlIdentifier() {
  if(this.router.url.includes('disbursement')) {
    this.showSaveButton = true;
  }
}
onBack() {
// this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/negotiation`]);
if(this.roleType == '1' || this.roleType == '2') {
  this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/negotiation`]);
}  else if( this.roleType == '4' ) {
  this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/negotiation`]);
} else if(  this.roleType == '5') {
  this.router.navigate([`pages/cpc-checker/${this.disbLeadId}/negotiation`]);
}
}

}
