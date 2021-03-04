import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LabelsService } from '@services/labels.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { DisbursementService } from '../services/disbursement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { LoanCreationService } from '@services/loan-creation.service';
import { retry } from 'rxjs/operators';
import { LoanViewService } from '@services/loan-view.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { Constant } from '../../../../assets/constants/constant';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { UploadService } from '@services/upload.service';
import { DraggableContainerService } from '@services/draggable.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-disbursement-form',
  templateUrl: './disbursement-form.component.html',
  styleUrls: ['./disbursement-form.component.css']
})
export class DisbursementFormComponent implements OnInit {
  
tvrStatusLOV =[
  { key: 'yes', value: 'Yes' },
  { key: 'no', value: 'No' }
]

  labels: any = {};
  disbursementDetailsForm: FormGroup;
  dealerDetailsForm: FormGroup;
  appDetailsForm: FormGroup;
  sellerDetailsForm: FormGroup;
  buyerDetailsForm: FormGroup;
  additionalTab1DetailsForm: FormGroup;
  additionalTab2DetailsForm: FormGroup;
  additionalTab3DetailsForm: FormGroup;
  additionalTab4DetailsForm: FormGroup;
  additionalTab5DetailsForm: FormGroup;

  coAppDetailsForm: FormGroup;
  coApp1Form: FormGroup;
  coApp2Form: FormGroup;
  coApp3Form: FormGroup;
  bankerDetailsForm: FormGroup;
  financierDetailsForm: FormGroup;
  thirdPartyDetailsForm: FormGroup;
  ibtDetailsForm: FormGroup;
  trancheDealerForm: FormGroup;
  trancheAppForm: FormGroup;
  trancheSellerForm: FormGroup;
  trancheBuyerForm: FormGroup;
  trancheAdditionalTab1Form: FormGroup;
  trancheAdditionalTab2Form: FormGroup;
  trancheAdditionalTab3Form: FormGroup;
  trancheAdditionalTab4Form: FormGroup;
  trancheAdditionalTab5Form: FormGroup;

  
  trancheBankerForm: FormGroup;
  trancheFinancierForm: FormGroup;
  trancheTPForm: FormGroup;
  trancheCoApp1Form: FormGroup;
  trancheCoApp2Form: FormGroup;
  trancheCoApp3Form: FormGroup;
  disburseTo: Array<any> = [];
  todayDateNew: any = new Date();

  LOV: any;
  isAlert: boolean;
  alertTimeOut: any;
  keyword: string;
  dealerkeyword: string;
  placeholder = [];
  dealerCodeData: Array<any> = [];
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);
  isDirty: boolean;


  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed'
    },
    ifsc: {
      rule: '^[A-Za-z][A-Za-z0-9]+$',
      // msg: "Special Characters not allowed"
    }
  }

  amountLength: number;

  trancheDealerList: Array<{}> = [];
  trancheAppList: Array<{}> = [];
  trancheBankerList: Array<{}> = [];
  trancheSellerList: Array<{}> = [];
  trancheBuyerList: Array<{}> = [];
  trancheAdditionalTab1List: Array<{}> = [];
  trancheAdditionalTab2List: Array<{}> = [];
  trancheAdditionalTab3List: Array<{}> = [];
  trancheAdditionalTab4List: Array<{}> = [];
  trancheAdditionalTab5List: Array<{}> = [];

  trancheFinancierList: Array<{}> = [];
  trancheTpList: Array<{}> = [];
  trancheCoApp1List: Array<{}> = [];
  trancheCoApp2List: Array<{}> = [];
  trancheCoApp3List: Array<{}> = [];


  disburseToDealer: boolean = false;
  disburseToApp: boolean = false;
  disburseToSeller: boolean = false;
  disburseToBuyer: boolean = false;
  disburseToAdditionalTab1: boolean = false;
  disburseToAdditionalTab2: boolean = false;
  disburseToAdditionalTab3: boolean = false;
  disburseToAdditionalTab4: boolean = false;
  disburseToAdditionalTab5: boolean = false;

  disburseToCoApp: boolean = false;
  disburseToBanker: boolean = false;
  disburseToFinancier: boolean = false;
  disburseToThirdParty: boolean = false;
  disburseToIBT: boolean = false;
  coApp1: boolean = false;
  coApp2: boolean = false;
  coApp3: boolean = false;
  numOfTranch: any;
  nameErrorMessage: string;
  ShowDisburseFields: boolean;
  TDTErrorMessage: string;
  checkDeferDisbValue: any;
  TDDErrorMessage: string;
  totalDisbursementAmount: any;
  financierLaonAccNo: any;
  ifscLength: any;
  bnfBranchLength: any;
  showTrancheTable: boolean;
  showAppTrancheTable: boolean;
  showBankerTrancheTable: boolean;
  showSellerTrancheTable: boolean;
  showBuyerTrancheTable: boolean;
  showAdditionalTab1TrancheTable: boolean;
  showAdditionalTab2TrancheTable: boolean;
  showAdditionalTab3TrancheTable: boolean;
  showAdditionalTab4TrancheTable: boolean;
  showAdditionalTab5TrancheTable: boolean;

  showFinancierTrancheTable: boolean;
  showThirdPartyTrancheTable: boolean;
  showCoAppTrancheTable: boolean;
  showCoApp1TrancheTable: boolean;
  showCoApp2TrancheTable: boolean;
  showCoApp3TrancheTable: boolean;
  mopVal: any;
  showDDDetails: boolean;
  showBankDetails: boolean;
  showCASADetails: boolean;
  showAppCASADetails: boolean;
  showSellerCASADetails:boolean;
  showBuyerCASADetails:boolean;
  showAdditionalTab1CASADetails:boolean;
  showAdditionalTab2CASADetails:boolean;
  showAdditionalTab3CASADetails:boolean;
  showAdditionalTab4CASADetails:boolean;
  showAdditionalTab5CASADetails:boolean;
  showAppBankDetails: boolean;
  showSellerBankDetails: boolean;
  showBuyerBankDetails: boolean;
  showAdditionalTab1BankDetails: boolean;
  showAdditionalTab2BankDetails: boolean;
  showAdditionalTab3BankDetails: boolean;
  showAdditionalTab4BankDetails: boolean;
  showAdditionalTab5BankDetails: boolean;
  showAppDDDetails: boolean;
  showSellerDDDetails: boolean;
  showBuyerDDDetails: boolean;
  showAdditionalTab1DDDetails: boolean;
  showAdditionalTab2DDDetails: boolean;
  showAdditionalTab3DDDetails: boolean;
  showAdditionalTab4DDDetails: boolean;
  showAdditionalTab5DDDetails: boolean;
  showCoAppBankDetails: boolean;
  showCoAppDDDetails: boolean;
  showBankerBankDetails: boolean;
  showBankerDDDetails: boolean;
  showFinBankDetails: boolean;
  showFinDDDetails: boolean;
  showTPBankDetails: boolean;
  showTPDDDetails: boolean;
  showCoAppCASADetails: boolean;
  showBankerCASADetails: boolean;
  showFinCASADetails: boolean;
  showTPCASADetails: boolean;
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
  sellerObjInfo: Object = {};
  buyerObjInfo: Object = {};
  additionalTab1ObjInfo: Object = {};
  additionalTab2ObjInfo: Object = {};
  additionalTab3ObjInfo: Object = {};
  additionalTab4ObjInfo: Object = {};
  additionalTab5ObjInfo: Object = {};
  bankerObjInfo: Object = {};
  financierObjInfo: Object = {};
  thirdPartyObjInfo: Object = {};
  internalBTObjInfo: Object = {};
  coApplicantObjInfo: any = [];
  coApplicant1: Object = {};
  coApplicant2: Object = {};
  coApplicant3: Object = {};
  bankdetailsformArray = ['beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch']
  chequeDDformArray = ['beneficiaryAccountNo', 'instrumentType']
  //casaformArray = ['beneficiaryAccountNo']
  intTypeformArray = ['instrumentNumber', 'instrumentDate']
  bankcasaformArray = ['beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch']

  commonFormArray = ['beneficiaryName', 'beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch', 'instrumentType', 'instrumentNumber', 'instrumentDate', 'paymentMethod', 'disbursementAmount']
  thirdPartyFormArray = ['beneficiaryName', 'beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch', 'instrumentType', 'instrumentNumber', 'instrumentDate', 'paymentMethod', 'disbursementAmount', 'tvrStatus', 'kycIDNumber','kycIDType']
  dealerformArray = ['dealerCode', 'beneficiaryName', 'beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch', 'instrumentType', 'instrumentNumber', 'instrumentDate', 'paymentMethod', 'disbursementAmount']
  bankerformArray = ['bankerId', 'beneficiaryName', 'beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch', 'instrumentType', 'instrumentNumber', 'instrumentDate', 'paymentMethod', 'disbursementAmount']
  finformArray = ['financierId', 'beneficiaryName', 'beneficiaryAccountNo', 'beneficiaryBank', 'ifscCode', 'mobilePhone', 'beneficiaryBranch', 'instrumentType', 'instrumentNumber', 'instrumentDate', 'paymentMethod', 'disbursementAmount']

  accountTypeLov = [];
  bankerLov = [];
  disburseToLov = [];
  financierLov = [];
  paymentLov = [];
  trancheDisbLov = [];
  instrumentTypeLov = [];
  coAppNamesLov = [];
  disbLeadId// ryt now static lead given , get the lead id from dashboard dynamically
  disuserID = localStorage.getItem("userId");// ryt now static userId given , get the userId from dashboard dynamically
  dealerDetailsData: any;
  applicantDetailsData: any;
  dealerCode: any;
  disbursementDetailsData: any;
  leadID: any;
  //disburseTo: any;
  loanDetailsData: Object = {};
  ReqDealerDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; dealerCode: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqApplicantDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqSellerDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqBuyerDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqAdditionalTab1Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqAdditionalTab2Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqAdditionalTab3Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqAdditionalTab4Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqAdditionalTab5Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqBankerDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; bankerId: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqFinancierDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; financierId: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqTPDetails: { leadID: any; disbursementID: any; payableTo: String; favouring: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; instrumentType: String; mobilePhone: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqCoApp1Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; applicantId: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqCoApp2Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; applicantId: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  ReqCoApp3Details: { leadID: any; disbursementID: any; payableTo: String; favouring: String; applicantId: String; beneficiaryName: String; applicantName: String; favouringName: String; beneficiaryAccountNo: String; beneficiaryBank: String; ifscCode: String; beneficiaryBranch: String; mobilePhone: String; instrumentType: String; instrumentNumber: String; instrumentDate: String; favouringBankOfDraw: String; favouringBankBranch: String;  beneficiaryAddress1: String; beneficiaryAddress2: String; beneficiaryAddress3: String; paymentMethod: String; disbursementAmount: String; deductChargesFlag: String; deferredDisbursementFlag: String; trancheDisbursementFlag: String; trancheDisbursementJson: any; active: String };
  roleId: any;
  roleType: any;
  salesResponse: string;
  showSaveButton: boolean;
  applicantID: any;
  coAppName: any;
  showAppIntDetails: boolean;
  showSellerIntDetails: boolean;
  showBuyerIntDetails: boolean;
  showAdditionalTab1IntDetails: boolean;
  showAdditionalTab2IntDetails: boolean;
  showAdditionalTab3IntDetails: boolean;
  showAdditionalTab4IntDetails: boolean;
  showAdditionalTab5IntDetails: boolean;  
  showDealerIntDetails: boolean;
  showBankerIntDetails: boolean;
  showFinIntDetails: boolean;
  showTpIntDetails: boolean;
  intTypeVal: any;
  showcoApp1IntDetails: boolean;
  showcoApp2IntDetails: boolean;
  showcoApp3IntDetails: boolean;
  flag: boolean;
  dealerDisbursementID: any;
  applicantDisbursementID: any;
  sellerDisbursementID: any;
  buyerDisbursementID: any;
  additionalTab1DisbursementID: any;
  additionalTab2DisbursementID: any;
  additionalTab3DisbursementID: any;
  additionalTab4DisbursementID: any;
  additionalTab5DisbursementID: any;  
  coApp1DisbursementID: any;
  coApp2DisbursementID: any;
  coApp3DisbursementID: any;
  bankerDisbursementID: any;
  finDisbursementID: any;
  tpDisbursementID: any;
  dealerBankListData: Array<any> = [];
  bankDealerDetailsData: Array<any> = [];
  bankAppDetailsData: any[];
  bankSellerDetailsData: any[];
  bankBuyerDetailsData: any[];
  bankAdditionalTab1DetailsData: any[];
  bankAdditionalTab2DetailsData: any[];
  bankAdditionalTab3DetailsData: any[];
  bankAdditionalTab4DetailsData: any[];
  bankAdditionalTab5DetailsData: any[];  
  bankCoApp1DetailsData: any[];
  bankCoApp2DetailsData: any[];
  bankCoApp3DetailsData: any[];
  bankBankerDetailsData: any[];
  bankFinDetailsData: any[];
  bankTPDetailsData: any[];
  bankDetailsData: any;
  appBankListData: any;
  sellerBankListData: any;
  buyerBankListData: any;
  additionalTab1BankListData: any;
  additionalTab2BankListData: any;
  additionalTab3BankListData: any;
  additionalTab4BankListData: any;
  additionalTab5BankListData: any;
  
  appkeyword: string;
  sellerkeyword: any;
  buyerkeyword: any;
  additionalTab1keyword: any;
  additionalTab2keyword: any;
  additionalTab3keyword: any;
  additionalTab4keyword: any;
  additionalTab5keyword: any;

  coApp1BankListData: any;
  coApp1keyword: string;
  coApp2BankListData: any;
  coApp2keyword: string;
  coApp3BankListData: any;
  coApp3keyword: string;
  bankerBankListData: any;
  bankerkeyword: string;
  finBankListData: any;
  finkeyword: string;
  thirdPartyBankListData: any;
  thirdPartykeyword: string;
  selectBankerListData: any;
  selectBankerkeyword: string;
  dealerfavBODListData: any;
  dealerFavkeyword: string;
  dealerfavBODListDatadealerfavBODListData: any[];
  bankDealerFavBODDetailsData: any[];
  appfavBODListData: any;
  sellerfavBODListData:any;
  buyerfavBODListData:any;
  additionalTab1favBODListData:any;
  additionalTab2favBODListData:any;
  additionalTab3favBODListData:any;
  additionalTab4favBODListData:any;
  additionalTab5favBODListData:any;

  appFavFavkeyword: string;
  sellerFavFavkeyword: string;
  buyerFavFavkeyword: string;
  additionalTab1FavFavkeyword: string;
  additionalTab2FavFavkeyword: string;
  additionalTab3FavFavkeyword: string;
  additionalTab4FavFavkeyword: string;
  additionalTab5FavFavkeyword: string;

  bankAppFavBODDetailsData: any[];
  bankSellerFavBODDetailsData: any[];
  bankBuyerFavBODDetailsData: any[];
  bankAdditionalTab1FavBODDetailsData: any[];
  bankAdditionalTab2FavBODDetailsData: any[];
  bankAdditionalTab3FavBODDetailsData: any[];
  bankAdditionalTab4FavBODDetailsData: any[];
  bankAdditionalTab5FavBODDetailsData: any[];

  coApp1favBODListData: any;
  coApp1Favkeyword: string;
  bankCoApp1FavBODDetailsData: any[];
  coApp2favBODListData: any;
  coApp2Favkeyword: string;
  bankCoApp2FavBODDetailsData: any[];
  coApp3favBODListData: any;
  coApp3Favkeyword: string;
  bankCoApp3FavBODDetailsData: any[];
  bankerfavBODListData: any;
  bankerFavkeyword: string;
  bankBankerFavBODDetailsData: any[];
  finfavBODListData: any;
  finFavkeyword: string;
  bankFinFavBODDetailsData: any[];
  thirdPartyfavBODListData: any;
  thirdPartyFavkeyword: string;
  bankTPFavBODDetailsData: any[];
  mobileLength : number;
  fetchedCoApp1Data: boolean=false;
  fetchedCoApp2Data: boolean=false;
  fetchedCoApp3Data: boolean=false;
  cumulativeAmount: any;
  flagBank : boolean;
  flagFinance: boolean;
  isLoan360: boolean;

  udfScreenId: string = '';
  udfGroupId: string = 'DIG001';
  udfDetails: any = [];
  userDefineForm: any;
  vehicleProductCatCode: boolean=false;
  fetchedDealerCode: string;
  flagDealor: boolean;
  isIBTApplicable: boolean;
  fetchDisburedFlag: boolean = false;
  loanDetailsList: any;
  ///dealerLoanDetails: any;
  DisbursementDetails: any;
  payableToValue: any;
  DisburseIndex: any;
  UniqueSubLeadReferenceID: any;
  leadLists: boolean;
  navigationFlag:number;
  dealercnfAccShow: boolean = false;
  applicantcnfAccShow: boolean = false;
  typeDeclare1: string;
  typeDeclare2: string;
  typeDeclare3: string;
  typeDeclare4: string;
  typeDeclare5: string;
  typeDeclare6: string;
  typeDeclare7: string;
  typeDeclare8: string;
  typeDeclare9: string;
  typeDeclare10: string;
  typeDeclare11: string;
  typeDeclare12: string;
  typeDeclare13: string;
  typeDeclare14: string;
  typeDeclare15: string;
  coApp1cnfAccShow: boolean = false;
  coApp2cnfAccShow: boolean = false;
  coApp3cnfAccShow: boolean = false;
  bankercnfAccShow: boolean = false;
  fincnfAccShow: boolean = false;
  tpcnfAccShow: boolean = false;
  sellercnfAccShow: boolean = false;
  buyercnfAccShow: boolean = false;
  add1cnfAccShow: boolean = false;
  add2cnfAccShow: boolean = false;
  add3cnfAccShow: boolean = false;
  add4cnfAccShow: boolean = false;
  add5cnfAccShow: boolean = false;
  showModal: boolean;
  selectedDocDetails: DocRequest;
  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;
  KYC_IMAGE: string;
  documentArr: DocumentDetails[] = [];
  KYCIdentityLOV: any;
  TPdocumentJson=[];


  constructor(
    private fb: FormBuilder,
    private labelsData: LabelsService,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private disbursementService: DisbursementService,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loanCreationService: LoanCreationService,
    private loanViewService: LoanViewService,
    private createLeadDataService: CreateLeadDataService,
    private uploadService: UploadService,
    private draggableContainerService: DraggableContainerService
  ) {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
  }

  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.flag = true;
    this.flagDealor = true;
    this.flagBank = true;
    this.flagFinance = true;
    this.initForm();
    this.getLabels();
    this.disbLeadId = (await this.getLeadId()) as number;
    this.getLoanDetailList();  //DisburseEnhancement
    this.routerUrlIdentifier();
    this.salesResponse = localStorage.getItem('salesResponse');
    console.log('this.roleType',this.roleType )
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;
      if (this.roleType == '1') {
        this.udfScreenId = udfScreenId.Negotiations.disbursementDetailsNegotiations;
      } else if (this.roleType == '2') {
        this.udfScreenId = udfScreenId.creditDecision.disbursementDetailsCreditDecision;
      } else if (this.roleType == '4') {
        this.udfScreenId = udfScreenId.CPCMaker.disbursementCPCMaker;
      } else if (this.roleType == '5') {
        this.udfScreenId = udfScreenId.CPCChecker.disbursementCPCChecker;
      } else if (this.roleType == '7') {
        this.udfScreenId = udfScreenId.CAD.disbursementCAD;
      }
      

    })
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
  get sellerTrancheDetail(): FormArray {
    return <FormArray>this.trancheSellerForm.get('trancheSellerArray')
  }
  get buyerTrancheDetail(): FormArray {
    return <FormArray>this.trancheBuyerForm.get('trancheBuyerArray')
  }
  get additionalTab1TrancheDetail(): FormArray {
    return <FormArray>this.trancheAdditionalTab1Form.get('trancheAdditionalTab1Array')
  }
  get additionalTab2TrancheDetail(): FormArray {
    return <FormArray>this.trancheAdditionalTab2Form.get('trancheAdditionalTab2Array')
  }
  get additionalTab3TrancheDetail(): FormArray {
    return <FormArray>this.trancheAdditionalTab3Form.get('trancheAdditionalTab3Array')
  }
  get additionalTab4TrancheDetail(): FormArray {
    return <FormArray>this.trancheAdditionalTab4Form.get('trancheAdditionalTab4Array')
  }
  get additionalTab5TrancheDetail(): FormArray {
    return <FormArray>this.trancheAdditionalTab5Form.get('trancheAdditionalTab5Array')
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
  uploadDocument() {
    this.selectedDocDetails = {
      docsType: this.PROFILE_TYPE,
      docSize: this.OTHER_DOCUMENTS_SIZE,
      docTp: "LEAD",
      docSbCtgry: "VF GENERATED DOCS" ,
      docNm: "TERM_SHEET",
      docCtgryCd: 102,
      docCatg: "VF LOAN DOCS",
      docTypCd: 150,
      flLoc: "",
      docCmnts: "Addition of document for Applicant Creation",
      bsPyld: "Base64 data of the image",
      docSbCtgryCd: 42,
      docsTypeForString: "kyc",
      docRefId: [
        {
          idTp: 'LEDID',
          id: this.disbLeadId
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
      associatedId:'',
      associatedWith:'4'
      
    };
  }
  deleteDocument(documentId) {
    this.uploadService
    .disbursesoftDeleteDocument(documentId)
    .subscribe((value: any) => {
      if (value.Error !== '0') {
        return;
      }})
      //this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].value = [];
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].dmsDocumentId.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].documentType.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].categoryCode.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].subCategoryCode.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].associatedId.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].associatedWith.patchValue(null)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].documentId.patchValue(null)
      this.toasterService.showSuccess('Document deleted successfully', '');
      // for (var i = this.documentArr.length - 1; i >= 0; --i) {
      //   if (this.documentArr[i].documentId == documentId) {
      //     this.documentArr.splice(i,1);
      //   }
      //  }
    }
  async onUploadSuccess(i, event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');
    this.showModal = false;
    this.KYC_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    const data = {
      inputValue: event.imageUrl,
      isPhoto: true,
      applicantId: "8bfa8dba945b11eabdcaf2fa9bec3d63",
    };
    event.imageUrl = '';

    this.individualImageUpload(event, i);
  }

  // to upload document 
  individualImageUpload(request: DocumentDetails, index: number) {
    const documentId = request.dmsDocumentId;
    this.uploadService
      .saveOrUpdateDocument([request])
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.toasterService.showSuccess('Document uploaded successfully', '');
        console.log('saveOrUpdateDocument', value);
        const processVariables = value.ProcessVariables;
        const documentId = processVariables.documentIds[0];
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].dmsDocumentId.patchValue(request.dmsDocumentId)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].documentType.patchValue(request.documentType)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].categoryCode.patchValue(request.categoryCode)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].subCategoryCode.patchValue(request.subCategoryCode)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].associatedId.patchValue(request.associatedId)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].associatedWith.patchValue(request.associatedWith)
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].documentId.patchValue(documentId)
          console.log("documentId******", documentId);
      });
  }

  //to View uploaded Document
  getBase64String(dmsDocumentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(dmsDocumentId)
        .subscribe((value) => {

          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
          });
          console.log('downloadDocs', value);
        });
    });
  }
  //for document 
  async downloadDocs(event) {
    // let el = event.srcElement;
    const dmsDocumentID: any = await this.getBase64String(event)
    const showDraggableContainer = {
      imageUrl: dmsDocumentID.imageUrl,
      imageType: dmsDocumentID.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: showDraggableContainer,
    });
  }

  addEmptyTrancheRow(container, trancheId) {
    let object = {
      'tranche_disbursement_type': '',
      'disbursement_percentage': '',
      'tranche_disbursement_amount': '',
      'trancheDisburseDate': '',
      'disbursement_id': '',
      'tranche_disbursement_id': (trancheId == 0 ? 1 : trancheId) + '',
    }
    if (container == '1') {
      this.trancheDealerList.push(object)
    } else if (container == '2') {
      this.trancheAppList.push(object)
    } else if (container == '4') {
      this.trancheBankerList.push(object)
    } else if (container == '5') {
      this.trancheFinancierList.push(object)
    } else if (container == '6') {
      this.trancheTpList.push(object)
    } else if (container == '8') {
      this.trancheCoApp1List.push(object)
    } else if (container == '9') {
      this.trancheCoApp2List.push(object)
    } else if (container == '10') {
      this.trancheCoApp3List.push(object)
    }else if (container == '11') {
      this.trancheSellerList.push(object)
    }else if (container == '12') {
      this.trancheBuyerList.push(object)
    }else if (container == '13') {
      this.trancheAdditionalTab1List.push(object)
    }else if (container == '14') {
      this.trancheAdditionalTab2List.push(object)
    }else if (container == '15') {
      this.trancheAdditionalTab3List.push(object)
    }else if (container == '16') {
      this.trancheAdditionalTab4List.push(object)
    }else if (container == '17') {
      this.trancheAdditionalTab5List.push(object)
    }
    
  }
  addRow(container) {
    if (container == '1') {
      if (this.trancheDealerList.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheDealerList.length + 1);
        this.dealerTrancheDetail.push(this.initTranche());
      }
    } else if (container == '2') {
      if (this.trancheAppList.length != 10) {// max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAppList.length + 1);
        this.appTrancheDetail.push(this.initTranche());
      }
    } else if (container == '4') {
      if (this.trancheBankerList.length != 10) {// max 10 rows
        this.addEmptyTrancheRow(container, this.trancheBankerList.length + 1);
        this.bankerTrancheDetail.push(this.initTranche());
      }
    } else if (container == '5') {
      if (this.trancheFinancierList.length != 10) {// max 10 rows
        this.addEmptyTrancheRow(container, this.trancheFinancierList.length + 1);
        this.financierTrancheDetail.push(this.initTranche());
      }
    } else if (container == '6') {
      if (this.trancheTpList.length != 10) {// max 10 rows
        this.addEmptyTrancheRow(container, this.trancheTpList.length + 1);
        this.tpTrancheDetail.push(this.initTranche());
      }
    } else if (container == '8') {
      if (this.trancheCoApp1List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheCoApp1List.length + 1);
        this.coApp1TrancheDetail.push(this.initTranche());
      }
    } else if (container == '9') {
      if (this.trancheCoApp2List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheCoApp2List.length + 1);
        this.coApp2TrancheDetail.push(this.initTranche());
      }
    } else if (container == '10') {
      if (this.trancheCoApp3List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheCoApp3List.length + 1);
        this.coApp3TrancheDetail.push(this.initTranche());
      }
    } else if (container == '11') {
      if (this.trancheSellerList.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheSellerList.length + 1);
        this.sellerTrancheDetail.push(this.initTranche());
      }
    } else if (container == '12') {
      if (this.trancheBuyerList.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheBuyerList.length + 1);
        this.buyerTrancheDetail.push(this.initTranche());
      }
    } else if (container == '13') {
      if (this.trancheAdditionalTab1List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAdditionalTab1List.length + 1);
        this.additionalTab1TrancheDetail.push(this.initTranche());
      }
    } else if (container == '14') {
      if (this.trancheAdditionalTab2List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAdditionalTab2List.length + 1);
        this.additionalTab2TrancheDetail.push(this.initTranche());
      }
    } else if (container == '15') {
      if (this.trancheAdditionalTab3List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAdditionalTab3List.length + 1);
        this.additionalTab3TrancheDetail.push(this.initTranche());
      }
    } else if (container == '16') {
      if (this.trancheAdditionalTab4List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAdditionalTab4List.length + 1);
        this.additionalTab4TrancheDetail.push(this.initTranche());
      }
    } else if (container == '17') {
      if (this.trancheAdditionalTab5List.length != 10) {//max 10 rows
        this.addEmptyTrancheRow(container, this.trancheAdditionalTab5List.length + 1);
        this.additionalTab5TrancheDetail.push(this.initTranche());
      }
    }
  }
  deleteRow(index, container) {
    if (container == '1') {
      this.trancheDealerList.splice(index, 1);
      let formArray = <FormArray>this.trancheDealerForm.get('trancheDealerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('1');// dealer
      } else {
        for (let i = 0; i < this.trancheDealerList.length; i++) {
          this.trancheDealerList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '2') {
      this.trancheAppList.splice(index, 1);
      let formArray = <FormArray>this.trancheAppForm.get('trancheAppArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('2');// dealer
      } else {
        for (let i = 0; i < this.trancheAppList.length; i++) {
          this.trancheAppList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '4') {
      this.trancheBankerList.splice(index, 1);
      let formArray = <FormArray>this.trancheBankerForm.get('trancheBankerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('4');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '5') {
      this.trancheFinancierList.splice(index, 1);
      let formArray = <FormArray>this.trancheFinancierForm.get('trancheFinancierArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('5');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheFinancierList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '6') {
      this.trancheTpList.splice(index, 1);
      let formArray = <FormArray>this.trancheTPForm.get('trancheTpArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('6');// dealer
      } else {
        for (let i = 0; i < this.trancheBankerList.length; i++) {
          this.trancheBankerList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '8') {
      this.trancheCoApp1List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp1Form.get('trancheCoApp1Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('8');
      } else {
        for (let i = 0; i < this.trancheCoApp1List.length; i++) {
          this.trancheCoApp1List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '9') {
      this.trancheCoApp2List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp2Form.get('trancheCoApp2Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('9');
      } else {
        for (let i = 0; i < this.trancheCoApp2List.length; i++) {
          this.trancheCoApp2List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '10') {
      this.trancheCoApp3List.splice(index, 1);
      let formArray = <FormArray>this.trancheCoApp3Form.get('trancheCoApp3Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('10');
      } else {
        for (let i = 0; i < this.trancheCoApp3List.length; i++) {
          this.trancheCoApp3List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '11') {
      this.trancheSellerList.splice(index, 1);
      let formArray = <FormArray>this.trancheSellerForm.get('trancheSellerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('11');// dealer
      } else {
        for (let i = 0; i < this.trancheSellerList.length; i++) {
          this.trancheSellerList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '12') {
      this.trancheBuyerList.splice(index, 1);
      let formArray = <FormArray>this.trancheBuyerForm.get('trancheBuyerArray');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('12');// dealer
      } else {
        for (let i = 0; i < this.trancheBuyerList.length; i++) {
          this.trancheBuyerList[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '13') {
      this.trancheAdditionalTab1List.splice(index, 1);
      let formArray = <FormArray>this.trancheAdditionalTab1Form.get('trancheAdditionalTab1Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('13');// dealer
      } else {
        for (let i = 0; i < this.trancheAdditionalTab1List.length; i++) {
          this.trancheAdditionalTab1List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '14') {
      this.trancheAdditionalTab2List.splice(index, 1);
      let formArray = <FormArray>this.trancheAdditionalTab2Form.get('trancheAdditionalTab2Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('14');// dealer
      } else {
        for (let i = 0; i < this.trancheAdditionalTab2List.length; i++) {
          this.trancheAdditionalTab2List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '15') {
      this.trancheAdditionalTab3List.splice(index, 1);
      let formArray = <FormArray>this.trancheAdditionalTab3Form.get('trancheAdditionalTab3Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('15');// dealer
      } else {
        for (let i = 0; i < this.trancheAdditionalTab3List.length; i++) {
          this.trancheAdditionalTab3List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '16') {
      this.trancheAdditionalTab4List.splice(index, 1);
      let formArray = <FormArray>this.trancheAdditionalTab4Form.get('trancheAdditionalTab4Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('16');// dealer
      } else {
        for (let i = 0; i < this.trancheAdditionalTab4List.length; i++) {
          this.trancheAdditionalTab4List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    } else if (container == '17') {
      this.trancheAdditionalTab5List.splice(index, 1);
      let formArray = <FormArray>this.trancheAdditionalTab5Form.get('trancheAdditionalTab5Array');
      formArray.removeAt(index);
      if (formArray.length == 0) {
        this.addRow('17');// dealer
      } else {
        for (let i = 0; i < this.trancheAdditionalTab5List.length; i++) {
          this.trancheAdditionalTab5List[i]['tranche_disbursement_id'] = (i + 1) + ''
        }
      }
    }
  }
  initTranche(): FormGroup {
    let groupObject = {
      tranche_disbursement_type: ['', Validators.required],
      disbursement_percentage: [null, Validators.required],
      tranche_disbursement_amount: [''],
      trancheDisburseDate: [null],
      disbursement_id: [''],
      tranche_disbursement_id: ['']
    }
    return this.fb.group(groupObject);
  }
  getCumulativeDisbAmnt(event: any, container) { // disbursement Calculation part

    if (this.dealerObjInfo['disbursementAmount'] && container == '1') {
      this.dealerObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.dealerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheDealerList, '1', '')//no need to pass to index , it will calculate auto
      }
    } else if (this.applicantObjInfo['disbursementAmount'] && container == '2') {
      this.applicantObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.applicantObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAppList, '2', '')
      }
    } else if (this.bankerObjInfo['disbursementAmount'] && container == '4') {
      this.bankerObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.bankerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheBankerList, '4', '')
      }
    } else if (this.financierObjInfo['disbursementAmount'] && container == '5') {
      this.financierObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.financierObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheFinancierList, '5', '')
      }
    } else if (this.thirdPartyObjInfo['disbursementAmount'] && container == '6') {
      this.thirdPartyObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.thirdPartyObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheTpList, '6', '')
      }
    } else if (this.coApplicant1['disbursementAmount'] && container == '8') {
      this.coApplicant1['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.coApplicant1['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheCoApp1List, '8', '')
      }
    } else if (this.coApplicant2['disbursementAmount'] && container == '9') {
      this.coApplicant2['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.coApplicant2['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheCoApp2List, '9', '')
      }
    } else if (this.coApplicant3['disbursementAmount'] && container == '10') {
      this.coApplicant3['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.coApplicant3['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheCoApp3List, '10', '')
      } 
    } else if (this.sellerObjInfo['disbursementAmount'] && container == '11') {
      this.sellerObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.sellerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheSellerList, '11', '')
      }
    } else if (this.buyerObjInfo['disbursementAmount'] && container == '12') {
      this.buyerObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.buyerObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheBuyerList, '12', '')
      }
    } else if (this.additionalTab1ObjInfo['disbursementAmount'] && container == '13') {
      this.additionalTab1ObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.additionalTab1ObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAdditionalTab1List, '13', '')
      }
    } else if (this.additionalTab2ObjInfo['disbursementAmount'] && container == '14') {
      this.additionalTab2ObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.additionalTab2ObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAdditionalTab2List, '14', '')
      }
    } else if (this.additionalTab3ObjInfo['disbursementAmount'] && container == '15') {
      this.additionalTab3ObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.additionalTab3ObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAdditionalTab3List, '15', '')
      }
    } else if (this.additionalTab4ObjInfo['disbursementAmount'] && container == '16') {
      this.additionalTab4ObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.additionalTab4ObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAdditionalTab4List, '16', '')
      }
    } else if (this.additionalTab5ObjInfo['disbursementAmount'] && container == '17') {
      this.additionalTab5ObjInfo['disbursementAmount'] = (event.target.value) ? event.target.value : null;
      if (this.additionalTab5ObjInfo['trancheDisbursementFlag']) {
        this.validatePercentage(this.trancheAdditionalTab5List, '17', '')
      }
    }
    // tslint:disable-next-line: no-string-literal
    let a = this.dealerObjInfo['disbursementAmount'] ? parseInt(this.dealerObjInfo['disbursementAmount']) : 0;
    let b = this.applicantObjInfo['disbursementAmount'] ? parseInt(this.applicantObjInfo['disbursementAmount']) : 0;
    let d = this.bankerObjInfo['disbursementAmount'] ? parseInt(this.bankerObjInfo['disbursementAmount']) : 0;
    let e = this.financierObjInfo['disbursementAmount'] ? parseInt(this.financierObjInfo['disbursementAmount']) : 0;
    let f = this.thirdPartyObjInfo['disbursementAmount'] ? parseInt(this.thirdPartyObjInfo['disbursementAmount']) : 0;
    let g = this.coApplicant1['disbursementAmount'] ? parseInt(this.coApplicant1['disbursementAmount']) : 0;
    let h = this.coApplicant2['disbursementAmount'] ? parseInt(this.coApplicant2['disbursementAmount']) : 0;
    let i = this.coApplicant3['disbursementAmount'] ? parseInt(this.coApplicant3['disbursementAmount']) : 0;
    let j = this.sellerObjInfo['disbursementAmount'] ? parseInt(this.sellerObjInfo['disbursementAmount']) : 0;
    let k = this.buyerObjInfo['disbursementAmount'] ? parseInt(this.buyerObjInfo['disbursementAmount']) : 0;
    let l = this.internalBTObjInfo['principleOutstanding'] ? parseInt(this.internalBTObjInfo['principleOutstanding']) : 0;
    let m = this.additionalTab1ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab1ObjInfo['disbursementAmount']) : 0;
    let n = this.additionalTab2ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab2ObjInfo['disbursementAmount']) : 0;
    let o = this.additionalTab3ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab3ObjInfo['disbursementAmount']) : 0;
    let p = this.additionalTab4ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab4ObjInfo['disbursementAmount']) : 0;
    let q = this.additionalTab5ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab5ObjInfo['disbursementAmount']) : 0;

    let cumulativeDisAmnt = a + b + d + e + f + g + h + i + j + k + l + m + n + o + p + q;
    if (!this.dealerObjInfo['disbursementAmount'] && container == '1' && this.dealerObjInfo['trancheDisbursementFlag']) {
      this.dealerObjInfo['trancheDisbursementFlag'] = false;
      this.showTrancheTable = false;
      this.trancheDealerList = [];
    } else if (!this.applicantObjInfo['disbursementAmount'] && container == '2' && this.applicantObjInfo['trancheDisbursementFlag']) {
      this.applicantObjInfo['trancheDisbursementFlag'] = false;
      this.showAppTrancheTable = false;
      this.trancheAppList = [];
    } else if (!this.bankerObjInfo['disbursementAmount'] && container == '4' && this.bankerObjInfo['trancheDisbursementFlag']) {
      this.bankerObjInfo['trancheDisbursementFlag'] = false;
      this.showBankerTrancheTable = false;
      this.trancheBankerList = [];
    } else if (!this.financierObjInfo['disbursementAmount'] && container == '5' && this.financierObjInfo['trancheDisbursementFlag']) {
      this.financierObjInfo['trancheDisbursementFlag'] = false;
      this.showFinancierTrancheTable = false;
      this.trancheFinancierList = [];
    } else if (!this.thirdPartyObjInfo['disbursementAmount'] && container == '6' && this.thirdPartyObjInfo['trancheDisbursementFlag']) {
      this.thirdPartyObjInfo['trancheDisbursementFlag'] = false;
      this.showThirdPartyTrancheTable = false;
      this.trancheTpList = [];
    } else if (!this.coApplicant1['disbursementAmount'] && container == '8' && this.coApplicant1['trancheDisbursementFlag']) {
      this.coApplicant1['trancheDisbursementFlag'] = false;
      this.showCoApp1TrancheTable = false;
      this.trancheCoApp1List = [];
    } else if (!this.coApplicant2['disbursementAmount'] && container == '9' && this.coApplicant2['trancheDisbursementFlag']) {
      this.coApplicant2['trancheDisbursementFlag'] = false;
      this.showCoApp2TrancheTable = false;
      this.trancheCoApp2List = [];
    } else if (!this.coApplicant3['disbursementAmount'] && container == '10' && this.coApplicant3['trancheDisbursementFlag']) {
      this.coApplicant3['trancheDisbursementFlag'] = false;
      this.showCoApp3TrancheTable = false;
      this.trancheCoApp3List = [];
    }else if (!this.sellerObjInfo['disbursementAmount'] && container == '11' && this.sellerObjInfo['trancheDisbursementFlag']) {
      this.sellerObjInfo['trancheDisbursementFlag'] = false;
      this.showSellerTrancheTable = false;
      this.trancheSellerList = [];
    }else if (!this.buyerObjInfo['disbursementAmount'] && container == '12' && this.buyerObjInfo['trancheDisbursementFlag']) {
      this.buyerObjInfo['trancheDisbursementFlag'] = false;
      this.showBuyerTrancheTable = false;
      this.trancheBuyerList = [];
    }else if (!this.additionalTab1ObjInfo['disbursementAmount'] && container == '13' && this.additionalTab1ObjInfo['trancheDisbursementFlag']) {
      this.additionalTab1ObjInfo['trancheDisbursementFlag'] = false;
      this.showAdditionalTab1TrancheTable = false;
      this.trancheAdditionalTab1List = [];
    }else if (!this.additionalTab2ObjInfo['disbursementAmount'] && container == '14' && this.additionalTab2ObjInfo['trancheDisbursementFlag']) {
      this.additionalTab2ObjInfo['trancheDisbursementFlag'] = false;
      this.showAdditionalTab2TrancheTable = false;
      this.trancheAdditionalTab2List = [];
    }else if (!this.additionalTab3ObjInfo['disbursementAmount'] && container == '15' && this.additionalTab3ObjInfo['trancheDisbursementFlag']) {
      this.additionalTab3ObjInfo['trancheDisbursementFlag'] = false;
      this.showAdditionalTab3TrancheTable = false;
      this.trancheAdditionalTab3List = [];
    }else if (!this.additionalTab4ObjInfo['disbursementAmount'] && container == '16' && this.additionalTab4ObjInfo['trancheDisbursementFlag']) {
      this.additionalTab4ObjInfo['trancheDisbursementFlag'] = false;
      this.showAdditionalTab4TrancheTable = false;
      this.trancheAdditionalTab4List = [];
    }else if (!this.additionalTab5ObjInfo['disbursementAmount'] && container == '17' && this.additionalTab5ObjInfo['trancheDisbursementFlag']) {
      this.additionalTab5ObjInfo['trancheDisbursementFlag'] = false;
      this.showAdditionalTab5TrancheTable = false;
      this.trancheAdditionalTab5List = [];
    }

    if (cumulativeDisAmnt > this.totalDisbursementAmount) {
      this.toasterService.showError('Disbursement amount should not exceed loan amount', '');
      if (container == '1') {
        this.dealerObjInfo['disbursementAmount'] = null;
        if (this.dealerObjInfo['trancheDisbursementFlag']) {
          this.dealerObjInfo['trancheDisbursementFlag'] = false;
          this.showTrancheTable = false;
          this.trancheDealerList = [];
        }
        return;
      } else if (container == '2') {
        this.applicantObjInfo['disbursementAmount'] = null;
        if (this.applicantObjInfo['trancheDisbursementFlag']) {
          this.applicantObjInfo['trancheDisbursementFlag'] = false;
          this.showAppTrancheTable = false;
          this.trancheAppList = [];
        }
        return;
      } else if (container == '4') {
        this.bankerObjInfo['disbursementAmount'] = null;
        if (this.bankerObjInfo['trancheDisbursementFlag']) {
          this.bankerObjInfo['trancheDisbursementFlag'] = false;
          this.showBankerTrancheTable = false;
          this.trancheBankerList = [];
        }
        return;
      } else if (container == '5') {
        this.financierObjInfo['disbursementAmount'] = null;
        if (this.financierObjInfo['trancheDisbursementFlag']) {
          this.financierObjInfo['trancheDisbursementFlag'] = false;
          this.showFinancierTrancheTable = false;
          this.trancheFinancierList = [];
        }
        return;
      } else if (container == '6') {
        this.thirdPartyObjInfo['disbursementAmount'] = null;
        if (this.thirdPartyObjInfo['trancheDisbursementFlag']) {
          this.thirdPartyObjInfo['trancheDisbursementFlag'] = false;
          this.showThirdPartyTrancheTable = false;
          this.trancheTpList = [];
        }
        return;
      }
      else if (container == '8') {
        this.coApplicant1['disbursementAmount'] = null;
        if (this.coApplicant1['trancheDisbursementFlag']) {
          this.coApplicant1['trancheDisbursementFlag'] = false;
          this.showCoApp1TrancheTable = false;
          this.trancheCoApp1List = [];
        }
        return;
      }
      else if (container == '9') {
        this.coApplicant2['disbursementAmount'] = null;
        if (this.coApplicant2['trancheDisbursementFlag']) {
          this.coApplicant2['trancheDisbursementFlag'] = false;
          this.showCoApp2TrancheTable = false;
          this.trancheCoApp2List = [];
        }
        return;
      }
      else if (container == '10') {
        this.coApplicant3['disbursementAmount'] = null;
        if (this.coApplicant3['trancheDisbursementFlag']) {
          this.coApplicant3['trancheDisbursementFlag'] = false;
          this.showCoApp3TrancheTable = false;
          this.trancheCoApp3List = [];
        }
        return;
      }
      else if (container == '11') {
        this.sellerObjInfo['disbursementAmount'] = null;
        if (this.sellerObjInfo['trancheDisbursementFlag']) {
          this.sellerObjInfo['trancheDisbursementFlag'] = false;
          this.showSellerTrancheTable = false;
          this.trancheSellerList = [];
        }
        return;
      }
      else if (container == '12') {
        this.buyerObjInfo['disbursementAmount'] = null;
        if (this.buyerObjInfo['trancheDisbursementFlag']) {
          this.buyerObjInfo['trancheDisbursementFlag'] = false;
          this.showBuyerTrancheTable = false;
          this.trancheBuyerList = [];
        }
        return;
      }
      else if (container == '13') {
        this.additionalTab1ObjInfo['disbursementAmount'] = null;
        if (this.additionalTab1ObjInfo['trancheDisbursementFlag']) {
          this.additionalTab1ObjInfo['trancheDisbursementFlag'] = false;
          this.showAdditionalTab1TrancheTable = false;
          this.trancheAdditionalTab1List = [];
        }
        return;
      }
      else if (container == '14') {
        this.additionalTab2ObjInfo['disbursementAmount'] = null;
        if (this.additionalTab2ObjInfo['trancheDisbursementFlag']) {
          this.additionalTab2ObjInfo['trancheDisbursementFlag'] = false;
          this.showAdditionalTab2TrancheTable = false;
          this.trancheAdditionalTab2List = [];
        }
        return;
      }
      else if (container == '15') {
        this.additionalTab3ObjInfo['disbursementAmount'] = null;
        if (this.additionalTab3ObjInfo['trancheDisbursementFlag']) {
          this.additionalTab3ObjInfo['trancheDisbursementFlag'] = false;
          this.showAdditionalTab3TrancheTable = false;
          this.trancheAdditionalTab3List = [];
        }
        return;
      }
      else if (container == '16') {
        this.additionalTab4ObjInfo['disbursementAmount'] = null;
        if (this.additionalTab4ObjInfo['trancheDisbursementFlag']) {
          this.additionalTab4ObjInfo['trancheDisbursementFlag'] = false;
          this.showAdditionalTab4TrancheTable = false;
          this.trancheAdditionalTab4List = [];
        }
        return;
      }
      else if (container == '17') {
        this.additionalTab5ObjInfo['disbursementAmount'] = null;
        if (this.additionalTab5ObjInfo['trancheDisbursementFlag']) {
          this.additionalTab5ObjInfo['trancheDisbursementFlag'] = false;
          this.showAdditionalTab5TrancheTable = false;
          this.trancheAdditionalTab5List = [];
        }
        return;
      }

    }
  }

  validatePercentage(trancheList, container, index) {
    this.dealerObjInfo['disbursementAmount'] = this.dealerObjInfo['disbursementAmount'] ? parseInt(this.dealerObjInfo['disbursementAmount']) : null;
    this.applicantObjInfo['disbursementAmount'] = this.applicantObjInfo['disbursementAmount'] ? parseInt(this.applicantObjInfo['disbursementAmount']) : null;
    this.bankerObjInfo['disbursementAmount'] = this.bankerObjInfo['disbursementAmount'] ? parseInt(this.bankerObjInfo['disbursementAmount']) : null;
    this.sellerObjInfo['disbursementAmount'] = this.sellerObjInfo['disbursementAmount'] ? parseInt(this.sellerObjInfo['disbursementAmount']) : null;
    this.buyerObjInfo['disbursementAmount'] = this.buyerObjInfo['disbursementAmount'] ? parseInt(this.buyerObjInfo['disbursementAmount']) : null;
    this.additionalTab1ObjInfo['disbursementAmount'] = this.additionalTab1ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab1ObjInfo['disbursementAmount']) : null;
    this.additionalTab2ObjInfo['disbursementAmount'] = this.additionalTab2ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab2ObjInfo['disbursementAmount']) : null;
    this.additionalTab3ObjInfo['disbursementAmount'] = this.additionalTab3ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab3ObjInfo['disbursementAmount']) : null;
    this.additionalTab4ObjInfo['disbursementAmount'] = this.additionalTab4ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab4ObjInfo['disbursementAmount']) : null;
    this.additionalTab5ObjInfo['disbursementAmount'] = this.additionalTab5ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab5ObjInfo['disbursementAmount']) : null;

    this.financierObjInfo['disbursementAmount'] = this.financierObjInfo['disbursementAmount'] ? parseInt(this.financierObjInfo['disbursementAmount']) : null;
    this.thirdPartyObjInfo['disbursementAmount'] = this.thirdPartyObjInfo['disbursementAmount'] ? parseInt(this.thirdPartyObjInfo['disbursementAmount']) : null;
    this.coApplicant1['disbursementAmount'] = this.coApplicant1['disbursementAmount'] ? parseInt(this.coApplicant1['disbursementAmount']) : null;
    this.coApplicant2['disbursementAmount'] = this.coApplicant2['disbursementAmount'] ? parseInt(this.coApplicant2['disbursementAmount']) : null;
    this.coApplicant3['disbursementAmount'] = this.coApplicant3['disbursementAmount'] ? parseInt(this.coApplicant3['disbursementAmount']) : null;

    var totalPercentage;
    for (let i = 0; i < trancheList.length; i++) {
      // trancheList['i'].tranche_disbursement_id=i;
      let tranchePercentage = parseFloat(trancheList[i].disbursement_percentage);
      tranchePercentage = tranchePercentage ? tranchePercentage : null
      totalPercentage = totalPercentage ? parseFloat(totalPercentage) + tranchePercentage : tranchePercentage;
      if (totalPercentage > 100) {// total percentage should not exceed more than 100
        trancheList[index].disbursement_percentage = null;
        trancheList[index].tranche_disbursement_amount = null;
        return;
      }
      if (container == '1') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.dealerObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '2') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.applicantObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '4') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.bankerObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '5') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.financierObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '6') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.thirdPartyObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '8') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.coApplicant1['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '9') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.coApplicant2['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '10') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.coApplicant3['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '11') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.sellerObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '12') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.buyerObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '13') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.additionalTab1ObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '14') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.additionalTab2ObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '15') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.additionalTab3ObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '16') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.additionalTab4ObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      } else if (container == '17') {
        trancheList[i].tranche_disbursement_amount = Math.round((this.additionalTab5ObjInfo['disbursementAmount'] / 100) * tranchePercentage);
      }

    }

  }


  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.amountLength = this.labels.validationData.disburseAmountType.maxLength;
        this.ifscLength = this.labels.validationData.disburseIfsc.maxLength;
        this.bnfBranchLength = this.labels.validationData.beneficiaryBranch.maxLength;
        this.mobileLength = this.labels.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Sourcing details Label Error', error)
    );
  }

  getProductCatCode(){
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.vehicleProductCatCode = (leadData["leadDetails"].productCatCode=="UC")?false:true;
  }

  disbLOV() {
    this.disbursementService
      .getDisbLOV()
      .subscribe((res: any) => {
        if (res.Error == '0') {
          var resData = res.ProcessVariables;
          console.log('LOVDATA', resData)
          this.accountTypeLov = resData.AccountType;
          this.bankerLov = resData.BankerLOV;
          this.disburseToLov = resData.DisburseTo;
          this.financierLov = resData.FinancierLOV;
          this.paymentLov = resData.PaymentMethod;
          this.trancheDisbLov = resData.TrancheDisbType;
          this.instrumentTypeLov = resData.InstrumentType;
          this.KYCIdentityLOV = resData.KYCIdentityLOV;
          if(!this.leadLists){ // if loan details is 1
            this.fetchLoanDetails(this.UniqueSubLeadReferenceID,false);
          }          
        }
      });
  }
  getLoanDetailList() {
    this.disbursementService.getLoanDetailList(this.disbLeadId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        console.log('loanDetailsList', response)
        if (response.ProcessVariables.error.code == '1') {        
          this.toasterService.showError(response.ProcessVariables.error.message, '');
        } else {
          this.loanDetailsList = response.ProcessVariables.LoanDetails;
          //need to handle length error
          if(this.loanDetailsList && this.loanDetailsList.length==1){ // length more than two ,flag will be true
            this.leadLists = false; 
            this.navigationFlag = 1
            this.UniqueSubLeadReferenceID= this.loanDetailsList[0]['uniqueSubLeadReferenceID'];        
          }else if(this.loanDetailsList){
            this.leadLists = true; 
            this.navigationFlag = 2;
          }
          this.getProductCatCode();
          this.disbLOV();
          this.getCoAppDetails();
         
        }   
      }
    });
  }
  fetchLoanDetails(URID,flag) {
    this.disbursementService.getLoanDetailListDisburse(this.disbLeadId,URID).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        console.log('LoanDetail', response)
        if (response.ProcessVariables.error.code == '1') {
          this.fetchedDealerCode='';
          this.loanDetailsData = {};
          this.totalDisbursementAmount = 0;
          this.toasterService.showError(response.ProcessVariables.error.message, '');
        } else {
          this.leadLists = false;//enabling disb form
          if(flag){
            this.navigationFlag = 3
          };
          this.loanDetailsData = (response.ProcessVariables.LoanDetail) ? response.ProcessVariables.LoanDetail : {};
          this.totalDisbursementAmount = this.loanDetailsData['approvedAmount'] ? parseInt(this.loanDetailsData['approvedAmount']) : 0;
          this.fetchedDealerCode=response.ProcessVariables.dealerCode;
          //this.fetchedDealerCode='DSA00448';         
          this.isIBTApplicable=response.ProcessVariables.isIBTApplicable;
          if(this.isIBTApplicable){
            this.internalBTObjInfo=response.ProcessVariables.InternalBT;
            if(!this.fetchDisburedFlag){
              this.disburseTo =['7DISBURSETO'];
            }
          }
          this.fetchDisbursementDetails(this.UniqueSubLeadReferenceID);  //Need to Include new fun
        }   
      }
    });
  }

  getCoAppDetails() {
    const data = {
      "LeadID": this.disbLeadId
    }
    // 1372
    this.disbursementService
      .getCoAppNames(data)
      .subscribe((res: any) => {
        if (res.Error == '0') {
          var resData = res.ProcessVariables;
          //console.log(resData)
          this.coAppNamesLov = resData.coApplicantName;
        }

      });
  }
  onDealerCodeSearch(event,flag,selectDealerEventFlag) {
    let inputString = event;
    const leadData = this.createLeadDataService.getLeadSectionData();
   const  productCatCode = leadData["leadDetails"].productId;
    console.log('inputStringDelr', event);
    this.disbursementService.dealerCode(inputString,productCatCode).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.dealerCodeData = response.ProcessVariables.dealorDetails;
        this.flagDealor= false;
        if(this.dealerCodeData && flag){ // dealerCodeData must to fetch Data
          if(this.fetchedDealerCode && !this.dealerCode){
            this.dealerCode  = this.dealerCodeData.find(({ dealorCode }) => dealorCode == this.fetchedDealerCode).dealorName;  
            if(selectDealerEventFlag){ // while feching this not required to call
              this.selectDealerEvent(this.fetchedDealerCode,false);
            }
            this.dealerDetailsForm.controls.dealerCode.disable();
            this.dealerDetailsForm.controls.beneficiaryName.disable();
          }else{
            this.dealerCode  = this.dealerCodeData.find(({ dealorCode }) => dealorCode == this.dealerCode).dealorName;
          }
        }
        this.keyword = 'dealorName';
        console.log('this.dealerCodeData', this.dealerCodeData);
        if(!this.dealerCodeData && !flag){
          this.dealerObjInfo = {};
        }
        this.dealerObjInfo['dealerCode'] = event;
      }
    });
  }
  selectDealerEvent(event: any,flag) {
    let inputString = '';
    if(this.fetchedDealerCode && !flag){
      inputString=this.fetchedDealerCode;
    }else{
      inputString=event.dealorCode;
    }
    const leadData = this.createLeadDataService.getLeadSectionData();
    const  productCatCode = leadData["leadDetails"].productCatCode;
    //console.log('inputStringDelr', event);
    this.disbursementService.getDealerDetails(inputString,productCatCode).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('dealerCodeData', response)
        const dealerDetailsData = response.ProcessVariables.DealerDetails;
        if (dealerDetailsData) {
          this.dealerObjInfo = dealerDetailsData;
          this.dealerObjInfo['mobilePhone'] = dealerDetailsData.mobilePhone ? dealerDetailsData.mobilePhone.slice(2) : '';
          if(this.dealerObjInfo['beneficiaryBank']){
            this.onBankNameSearch(this.dealerObjInfo['beneficiaryBank'],'1');
            if(this.dealerObjInfo['beneficiaryBranch']){
            this.setIFSC(this.dealerObjInfo['beneficiaryBranch'],'dealer');
            } else{
              this.setIFSC('','dealer');
            }
          }
        } else {
          this.dealerObjInfo = {};
          this.showTrancheTable = false;
          this.trancheDealerList = [];
        }

      }
    });
  }
  onIFSCSearch(event,val,flag){
    let inputString = event;
    if(inputString.length == '11'){
      this.disbursementService.ifscCodeSearch(inputString).subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        let fetchData = (response.ProcessVariables.BankDetails) ? response.ProcessVariables.BankDetails : [];
        if (appiyoError === '0') {
          if(val == '1'){
            this.bankDealerDetailsData = fetchData;
            if(flag){
              this.dealerDetailsForm.patchValue({ beneficiaryBank: this.bankDealerDetailsData.length>0 ? this.bankDealerDetailsData[0].externalBankName : null });
                if(this.bankDealerDetailsData.length == 1){
                  this.dealerDetailsForm.patchValue({ beneficiaryBranch: this.bankDealerDetailsData.length>0 ? this.bankDealerDetailsData[0].externalBankCode : null });
                }
            }
          }
          if(val == '2'){
            this.bankAppDetailsData = fetchData;
            if(flag){
              this.appDetailsForm.patchValue({ beneficiaryBank: this.bankAppDetailsData.length>0 ? this.bankAppDetailsData[0].externalBankName : null });
              if(this.bankAppDetailsData.length == 1){
                this.appDetailsForm.patchValue({ beneficiaryBranch: this.bankAppDetailsData.length>0 ? this.bankAppDetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '3'){
            this.bankCoApp1DetailsData = fetchData;
            if(flag){
              this.coApp1Form.patchValue({ beneficiaryBank: this.bankCoApp1DetailsData.length>0 ? this.bankCoApp1DetailsData[0].externalBankName : null });
              if(this.bankCoApp1DetailsData.length == 1){
                this.coApp1Form.patchValue({ beneficiaryBranch: this.bankCoApp1DetailsData.length>0 ? this.bankCoApp1DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '4'){
            this.bankCoApp2DetailsData = fetchData;
            if(flag){
              this.coApp2Form.patchValue({ beneficiaryBank: this.bankCoApp2DetailsData.length>0 ? this.bankCoApp2DetailsData[0].externalBankName : null });
              if(this.bankCoApp2DetailsData.length == 1){
                this.coApp2Form.patchValue({ beneficiaryBranch: this.bankCoApp2DetailsData.length>0 ? this.bankCoApp2DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '5'){
            this.bankCoApp3DetailsData = fetchData;
            if(flag){
              this.coApp3Form.patchValue({ beneficiaryBank: this.bankCoApp3DetailsData.length>0 ? this.bankCoApp3DetailsData[0].externalBankName : null });
              if(this.bankCoApp3DetailsData.length == 1){
                this.coApp3Form.patchValue({ beneficiaryBranch: this.bankCoApp3DetailsData.length>0 ? this.bankCoApp3DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '6'){
            this.bankBankerDetailsData = fetchData;
            if(flag){
              this.bankerDetailsForm.patchValue({ beneficiaryBank: this.bankBankerDetailsData.length>0 ? this.bankBankerDetailsData[0].externalBankName : null });
              if(this.bankBankerDetailsData.length == 1){
                this.bankerDetailsForm.patchValue({ beneficiaryBranch: this.bankBankerDetailsData.length>0 ? this.bankBankerDetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '7'){
            this.bankFinDetailsData = fetchData;
            if(flag){
              this.financierDetailsForm.patchValue({ beneficiaryBank: this.bankFinDetailsData.length>0 ? this.bankFinDetailsData[0].externalBankName : null });
                if(this.bankFinDetailsData.length == 1){
                  this.financierDetailsForm.patchValue({ beneficiaryBranch: this.bankFinDetailsData.length>0 ? this.bankFinDetailsData[0].externalBankCode : null });
                }
            }
          }
          if(val == '8'){
            this.bankTPDetailsData = fetchData;
            if(flag){
              this.thirdPartyDetailsForm.patchValue({ beneficiaryBank: this.bankTPDetailsData.length>0 ? this.bankTPDetailsData[0].externalBankName : null });
              if(this.bankTPDetailsData.length == 1){
                this.thirdPartyDetailsForm.patchValue({ beneficiaryBranch: this.bankTPDetailsData.length>0 ? this.bankTPDetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '9'){
            this.bankSellerDetailsData = fetchData;
            if(flag){
              this.sellerDetailsForm.patchValue({ beneficiaryBank: this.bankSellerDetailsData.length>0 ? this.bankSellerDetailsData[0].externalBankName : null });
              if(this.bankSellerDetailsData.length == 1){
                this.sellerDetailsForm.patchValue({ beneficiaryBranch: this.bankSellerDetailsData.length>0 ? this.bankSellerDetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '10'){
            this.bankBuyerDetailsData = fetchData;
            if(flag){
              this.buyerDetailsForm.patchValue({ beneficiaryBank: this.bankBuyerDetailsData.length>0 ? this.bankBuyerDetailsData[0].externalBankName : null });
              if(this.bankBuyerDetailsData.length == 1){
                this.buyerDetailsForm.patchValue({ beneficiaryBranch: this.bankBuyerDetailsData.length>0 ? this.bankBuyerDetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '11'){
            this.bankAdditionalTab1DetailsData = fetchData;
            if(flag){
              this.additionalTab1DetailsForm.patchValue({ beneficiaryBank: this.bankAdditionalTab1DetailsData.length>0 ? this.bankAdditionalTab1DetailsData[0].externalBankName : null });
              if(this.bankAdditionalTab1DetailsData.length == 1){
                this.additionalTab1DetailsForm.patchValue({ beneficiaryBranch: this.bankAdditionalTab1DetailsData.length>0 ? this.bankAdditionalTab1DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '12'){
            this.bankAdditionalTab2DetailsData = fetchData;
            if(flag){
              this.additionalTab2DetailsForm.patchValue({ beneficiaryBank: this.bankAdditionalTab2DetailsData.length>0 ? this.bankAdditionalTab2DetailsData[0].externalBankName : null });
              if(this.bankAdditionalTab2DetailsData.length == 1){
                this.additionalTab2DetailsForm.patchValue({ beneficiaryBranch: this.bankAdditionalTab2DetailsData.length>0 ? this.bankAdditionalTab2DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '13'){
            this.bankAdditionalTab3DetailsData = fetchData;
            if(flag){
              this.additionalTab3DetailsForm.patchValue({ beneficiaryBank: this.bankAdditionalTab3DetailsData.length>0 ? this.bankAdditionalTab3DetailsData[0].externalBankName : null });
              if(this.bankAdditionalTab3DetailsData.length == 1){
                this.additionalTab3DetailsForm.patchValue({ beneficiaryBranch: this.bankAdditionalTab3DetailsData.length>0 ? this.bankAdditionalTab3DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '14'){
            this.bankAdditionalTab4DetailsData = fetchData;
            if(flag){
              this.additionalTab4DetailsForm.patchValue({ beneficiaryBank: this.bankAdditionalTab4DetailsData.length>0 ? this.bankAdditionalTab4DetailsData[0].externalBankName : null });
              if(this.bankAdditionalTab4DetailsData.length == 1){
                this.additionalTab4DetailsForm.patchValue({ beneficiaryBranch: this.bankAdditionalTab4DetailsData.length>0 ? this.bankAdditionalTab4DetailsData[0].externalBankCode : null });
              }
            }
          }
          if(val == '15'){
            this.additionalTab5DetailsForm = fetchData;
            if(flag){
              this.additionalTab5DetailsForm.patchValue({ beneficiaryBank: this.bankAdditionalTab5DetailsData.length>0 ? this.bankAdditionalTab5DetailsData[0].externalBankName : null });
              if(this.bankAdditionalTab2DetailsData.length == 1){
                this.additionalTab5DetailsForm.patchValue({ beneficiaryBranch: this.bankAdditionalTab5DetailsData.length>0 ? this.bankAdditionalTab5DetailsData[0].externalBankCode : null });
              }
            }
          }
        }
      })
    }
  }
  onBankNameSearch(event,val) {
    let inputString = event;
    console.log('inputStringBank', event);
    this.disbursementService.BnfBankName(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      //const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0') {
        if(val == '1'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.dealerBankListData = response.ProcessVariables.bankList;
            this.dealerkeyword = 'dealerBankListData';
          } else {
            this.dealerBankListData = [];
            this.bankDealerDetailsData = [];
            this.dealerDetailsForm.controls['ifscCode'].reset();
            this.dealerDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '2'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.appBankListData = response.ProcessVariables.bankList;
            this.appkeyword = 'appBankListData';
          } else {
            this.appBankListData = [];
            this.bankAppDetailsData = [];
            this.appDetailsForm.controls['ifscCode'].reset();
            this.appDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '18'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.sellerBankListData = response.ProcessVariables.bankList;
            this.sellerkeyword = 'sellerBankListData';
          } else {
            this.sellerBankListData = [];
            this.bankSellerDetailsData = [];
            this.sellerDetailsForm.controls['ifscCode'].reset();
            this.sellerDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '20'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.buyerBankListData = response.ProcessVariables.bankList;
            this.buyerkeyword = 'buyerBankListData';
          } else {
            this.buyerBankListData = [];
            this.bankBuyerDetailsData = [];
            this.buyerDetailsForm.controls['ifscCode'].reset();
            this.buyerDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '3'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp1BankListData = response.ProcessVariables.bankList;
            this.coApp1keyword = 'coApp1BankListData';
          } else {
            this.coApp1BankListData = [];
            this.bankCoApp1DetailsData = [];
            this.coApp1Form.controls['ifscCode'].reset();
            this.coApp1Form.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '4'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp2BankListData = response.ProcessVariables.bankList;
            this.coApp2keyword = 'coApp2BankListData';
          } else {
            this.coApp2BankListData = [];
            this.bankCoApp2DetailsData = [];
            this.coApp2Form.controls['ifscCode'].reset();
            this.coApp2Form.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '5'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp3BankListData = response.ProcessVariables.bankList;
            this.coApp3keyword = 'coApp3BankListData';
          } else {
            this.coApp3BankListData = [];
            this.bankCoApp3DetailsData = [];
            this.coApp3Form.controls['ifscCode'].reset();
            this.coApp3Form.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '6'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.bankerBankListData = response.ProcessVariables.bankList;
            this.bankerkeyword = 'bankerBankListData';
          } else {
            this.bankerBankListData = [];
            this.bankBankerDetailsData = [];
            this.bankerDetailsForm.controls['ifscCode'].reset();
            this.bankerDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '7'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.finBankListData = response.ProcessVariables.bankList;
            this.finkeyword = 'finBankListData';
          } else {
            this.finBankListData = [];
            this.bankFinDetailsData = [];
            this.financierDetailsForm.controls['ifscCode'].reset();
            this.financierDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '8'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.thirdPartyBankListData = response.ProcessVariables.bankList;
            this.thirdPartykeyword = 'thirdPartyBankListData';
          } else {
            this.thirdPartyBankListData = [];
            this.bankTPDetailsData = [];
            this.thirdPartyDetailsForm.controls['ifscCode'].reset();
            this.thirdPartyDetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '9'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.selectBankerListData = response.ProcessVariables.bankList;
            this.selectBankerkeyword = 'selectBankerListData';
          } else {
            this.selectBankerListData = [];
          }
        }
        if(val == '10'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.dealerfavBODListData = response.ProcessVariables.bankList;
            this.dealerFavkeyword = 'dealerfavBODListData';
          } else {
            this.dealerfavBODListDatadealerfavBODListData = [];
            this.bankDealerFavBODDetailsData = [];
            this.dealerDetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '11'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.appfavBODListData = response.ProcessVariables.bankList;
            this.appFavFavkeyword = 'appfavBODListData';
          } else {
            this.appfavBODListData = [];
            this.bankAppFavBODDetailsData = [];
            this.appDetailsForm.controls['favouringBankBranch'].reset();
          }
        }                 
        if(val == '12'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp1favBODListData = response.ProcessVariables.bankList;
            this.coApp1Favkeyword = 'coApp1favBODListData';
          } else {
            this.coApp1favBODListData = [];
            this.bankCoApp1FavBODDetailsData = [];
            this.coApp1Form.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '13'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp2favBODListData = response.ProcessVariables.bankList;
            this.coApp2Favkeyword = 'coApp2favBODListData';
          } else {
            this.coApp2favBODListData = [];
            this.bankCoApp2FavBODDetailsData = [];
            this.coApp2Form.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '14'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.coApp3favBODListData = response.ProcessVariables.bankList;
            this.coApp3Favkeyword = 'coApp3favBODListData';
          } else {
            this.coApp3favBODListData = [];
            this.bankCoApp3FavBODDetailsData = [];
            this.coApp3Form.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '15'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.bankerfavBODListData = response.ProcessVariables.bankList;
            this.bankerFavkeyword = 'bankerfavBODListData';
          } else {
            this.bankerfavBODListData = [];
            this.bankBankerFavBODDetailsData = [];
            this.bankerDetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '16'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.finfavBODListData = response.ProcessVariables.bankList;
            this.finFavkeyword = 'finfavBODListData';
          } else {
            this.finfavBODListData = [];
            this.bankFinFavBODDetailsData = [];
            this.financierDetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '17'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.thirdPartyfavBODListData = response.ProcessVariables.bankList;
            this.thirdPartyFavkeyword = 'thirdPartyfavBODListData';
          } else {
            this.thirdPartyfavBODListData = [];
            this.bankTPFavBODDetailsData = [];
            this.thirdPartyDetailsForm.controls['favouringBankBranch'].reset();
          }
        }  
        if(val == '19'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.sellerfavBODListData = response.ProcessVariables.bankList;
            this.sellerFavFavkeyword = 'sellerfavBODListData';
          } else {
            this.sellerfavBODListData = [];
            this.bankSellerFavBODDetailsData = [];
            this.sellerDetailsForm.controls['favouringBankBranch'].reset();
          }
        }   
        if(val == '21'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.buyerfavBODListData = response.ProcessVariables.bankList;
            this.buyerFavFavkeyword = 'buyerfavBODListData';
          } else {
            this.buyerfavBODListData = [];
            this.bankBuyerFavBODDetailsData = [];
            this.buyerDetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '22'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab1BankListData = response.ProcessVariables.bankList;
            this.additionalTab1keyword = 'additionalTab1BankListData';
          } else {
            this.additionalTab1BankListData = [];
            this.bankAdditionalTab1DetailsData = [];
            this.additionalTab1DetailsForm.controls['ifscCode'].reset();
            this.additionalTab1DetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '24'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab2BankListData = response.ProcessVariables.bankList;
            this.additionalTab2keyword = 'additionalTab2BankListData';
          } else {
            this.additionalTab2BankListData = [];
            this.bankAdditionalTab2DetailsData = [];
            this.additionalTab2DetailsForm.controls['ifscCode'].reset();
            this.additionalTab2DetailsForm.controls['beneficiaryBranch'].reset();
          }
        }   
        if(val == '26'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab3BankListData = response.ProcessVariables.bankList;
            this.additionalTab3keyword = 'additionalTab3BankListData';
          } else {
            this.additionalTab3BankListData = [];
            this.bankAdditionalTab3DetailsData = [];
            this.additionalTab3DetailsForm.controls['ifscCode'].reset();
            this.additionalTab3DetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '28'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab4BankListData = response.ProcessVariables.bankList;
            this.additionalTab4keyword = 'additionalTab4BankListData';
          } else {
            this.additionalTab4BankListData = [];
            this.bankAdditionalTab4DetailsData = [];
            this.additionalTab4DetailsForm.controls['ifscCode'].reset();
            this.additionalTab4DetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '30'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab5BankListData = response.ProcessVariables.bankList;
            this.additionalTab5keyword = 'additionalTab5BankListData';
          } else {
            this.additionalTab5BankListData = [];
            this.bankAdditionalTab5DetailsData = [];
            this.additionalTab5DetailsForm.controls['ifscCode'].reset();
            this.additionalTab5DetailsForm.controls['beneficiaryBranch'].reset();
          }
        }
        if(val == '23'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab1favBODListData = response.ProcessVariables.bankList;
            this.additionalTab1FavFavkeyword = 'additionalTab1favBODListData';
          } else {
            this.additionalTab1favBODListData = [];
            this.bankAdditionalTab1FavBODDetailsData = [];
            this.additionalTab1DetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '25'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab2favBODListData = response.ProcessVariables.bankList;
            this.additionalTab2FavFavkeyword = 'additionalTab2favBODListData';
          } else {
            this.additionalTab2favBODListData = [];
            this.bankAdditionalTab2FavBODDetailsData = [];
            this.additionalTab2DetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '27'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab3favBODListData = response.ProcessVariables.bankList;
            this.additionalTab3FavFavkeyword = 'additionalTab3favBODListData';
          } else {
            this.additionalTab3favBODListData = [];
            this.bankAdditionalTab3FavBODDetailsData = [];
            this.additionalTab3DetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '29'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab4favBODListData = response.ProcessVariables.bankList;
            this.additionalTab4FavFavkeyword = 'additionalTab4favBODListData';
          } else {
            this.additionalTab4favBODListData = [];
            this.bankAdditionalTab4FavBODDetailsData = [];
            this.additionalTab4DetailsForm.controls['favouringBankBranch'].reset();
          }
        }
        if(val == '31'){
          if(inputString.length >= 3 && response.ProcessVariables.bankList){
            this.additionalTab5favBODListData = response.ProcessVariables.bankList;
            this.additionalTab5FavFavkeyword = 'additionalTab5favBODListData';
          } else {
            this.additionalTab5favBODListData = [];
            this.bankAdditionalTab5FavBODDetailsData = [];
            this.additionalTab5DetailsForm.controls['favouringBankBranch'].reset();
          }
        }
      }
    });
  }
  selectBankNameEvent(event: any,val) {
    let inputString = event;
    this.disbursementService.getBankNameDetails(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        if(val == '1'){
          this.bankDealerDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '2') {
          this.bankAppDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '3'){
          this.bankCoApp1DetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '4'){
          this.bankCoApp2DetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '5'){
          this.bankCoApp3DetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '6'){
          this.bankBankerDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '7'){
          this.bankFinDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '8'){
          this.bankTPDetailsData = response.ProcessVariables.BankDetails;
        } 
        if(val == '10'){
          this.bankDealerFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '11') {
          this.bankAppFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '12'){
          this.bankCoApp1FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '13'){
          this.bankCoApp2FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '14'){
          this.bankCoApp3FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '15'){
          this.bankBankerFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '16'){
          this.bankFinFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '17'){
          this.bankTPFavBODDetailsData = response.ProcessVariables.BankDetails;
        } 
        if(val == '18') {
          this.bankSellerDetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '19') {
          this.bankSellerFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '20') {
          this.bankBuyerDetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '21') {
          this.bankBuyerFavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '22') {
          this.bankAdditionalTab1DetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '23') {
          this.bankAdditionalTab1FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '24') {
          this.bankAdditionalTab2DetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '25') {
          this.bankAdditionalTab2FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '26') {
          this.bankAdditionalTab3DetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '27') {
          this.bankAdditionalTab3FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '28') {
          this.bankAdditionalTab4DetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '29') {
          this.bankAdditionalTab4FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
        if(val == '30') {
          this.bankAdditionalTab5DetailsData = response.ProcessVariables.BankDetails;
        }   
        if(val == '31') {
          this.bankAdditionalTab5FavBODDetailsData = response.ProcessVariables.BankDetails;
        }
      }
    });
  }
  setIFSC(event,val){
    if(val == 'dealer'){
      let dealerIFSCCode  = event ? this.bankDealerDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.dealerDetailsForm.patchValue({ ifscCode: dealerIFSCCode ? dealerIFSCCode : null });
      if(!dealerIFSCCode)
      this.dealerObjInfo['ifscCode'] = '';
    } else if(val == 'applicant'){
      let appIFSCCode  = event ? this.bankAppDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.appDetailsForm.patchValue({ ifscCode: appIFSCCode ? appIFSCCode : null });
      if(!appIFSCCode)
      this.applicantObjInfo['ifscCode'] = '';
    } else if(val == 'seller'){
      let sellerIFSCCode  = event ? this.bankSellerDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.sellerDetailsForm.patchValue({ ifscCode: sellerIFSCCode ? sellerIFSCCode : null });
      if(!sellerIFSCCode)
      this.sellerObjInfo['ifscCode'] = '';
    } else if(val == 'buyer'){
      let buyerIFSCCode  = event ? this.bankBuyerDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.buyerDetailsForm.patchValue({ ifscCode: buyerIFSCCode ? buyerIFSCCode : null });
      if(!buyerIFSCCode)
      this.buyerObjInfo['ifscCode'] = '';
    } else if(val == 'additionalTab1'){
      let additionalTab1IFSCCode  = event ? this.bankAdditionalTab1DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.additionalTab1DetailsForm.patchValue({ ifscCode: additionalTab1IFSCCode ? additionalTab1IFSCCode : null });
      if(!additionalTab1IFSCCode)
      this.additionalTab1ObjInfo['ifscCode'] = '';
    } else if(val == 'additionalTab2'){
      let additionalTab2IFSCCode  = event ? this.bankAdditionalTab2DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.additionalTab2DetailsForm.patchValue({ ifscCode: additionalTab2IFSCCode ? additionalTab2IFSCCode : null });
      if(!additionalTab2IFSCCode)
      this.additionalTab2ObjInfo['ifscCode'] = '';
    } else if(val == 'additionalTab3'){
      let additionalTab3IFSCCode  = event ? this.bankAdditionalTab3DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.additionalTab3DetailsForm.patchValue({ ifscCode: additionalTab3IFSCCode ? additionalTab3IFSCCode : null });
      if(!additionalTab3IFSCCode)
      this.additionalTab3ObjInfo['ifscCode'] = '';
    } else if(val == 'additionalTab4'){
      let additionalTab4IFSCCode  = event ? this.bankAdditionalTab4DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.additionalTab4DetailsForm.patchValue({ ifscCode: additionalTab4IFSCCode ? additionalTab4IFSCCode : null });
      if(!additionalTab4IFSCCode)
      this.additionalTab4ObjInfo['ifscCode'] = '';
    } else if(val == 'additionalTab5'){
      let additionalTab5IFSCCode  = event ? this.bankAdditionalTab5DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.additionalTab5DetailsForm.patchValue({ ifscCode: additionalTab5IFSCCode ? additionalTab5IFSCCode : null });
      if(!additionalTab5IFSCCode)
      this.additionalTab5ObjInfo['ifscCode'] = '';
    } else if(val == 'coApp1'){
      let coApp1IFSCCode  = event ? this.bankCoApp1DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.coApp1Form.patchValue({ ifscCode: coApp1IFSCCode ? coApp1IFSCCode : null });
      if(!coApp1IFSCCode)
      this.coApp1Form['ifscCode'] = '';
    } else if(val == 'coApp2'){
      let coApp2IFSCCode  = event ? this.bankCoApp2DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.coApp2Form.patchValue({ ifscCode: coApp2IFSCCode ? coApp2IFSCCode : null });
      if(!coApp2IFSCCode)
      this.coApp2Form['ifscCode'] = '';
    } else if(val == 'coApp3'){
      let coApp3IFSCCode  = event ? this.bankCoApp3DetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.coApp3Form.patchValue({ ifscCode: coApp3IFSCCode ? coApp3IFSCCode : null });
      if(!coApp3IFSCCode)
      this.coApp3Form['ifscCode'] = '';
    } else if(val == 'banker'){
      let bankerIFSCCode  = event ? this.bankBankerDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.bankerDetailsForm.patchValue({ ifscCode: bankerIFSCCode ? bankerIFSCCode : null });
    } else if(val == 'financier'){
      let finIFSCCode  = event ? this.bankFinDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.financierDetailsForm.patchValue({ ifscCode: finIFSCCode ? finIFSCCode : null });
    } else if(val == 'thirdParty'){
      let thirdPartyIFSCCode  = event ? this.bankTPDetailsData.find(({ externalBankCode }) => externalBankCode == event).ifscCode : '';
      this.thirdPartyDetailsForm.patchValue({ ifscCode: thirdPartyIFSCCode ? thirdPartyIFSCCode : null });
    }
  }
  getCoApplicantDetails(appID,val) {
    let ReqCoAppData = {
      "LeadID":this.disbLeadId,
      "ApplicantID": appID
      }
    this.disbursementService.getApplicantDetails(ReqCoAppData).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        if(val == 'coApp1'){
          this.coApplicant1 = response.ProcessVariables.ApplicantDetails;
          this.coApplicant1['mobilePhone'] = this.coApplicant1['mobilePhone'] ? this.coApplicant1['mobilePhone'].slice(2) : '';
          this.fetchedCoApp1Data=this.coApplicant1?true:false;
            if(this.coApplicant1['beneficiaryBank']){
            this.onBankNameSearch(this.coApplicant1['beneficiaryBank'],'3');
            if(this.coApplicant1['beneficiaryBranch']){
            this.setIFSC(this.coApplicant1['beneficiaryBranch'],'coApp1');
            } else {
              this.setIFSC('','coApp1');
            }
          }
        }
        if(val == 'coApp2'){
          this.coApplicant2 = response.ProcessVariables.ApplicantDetails;
          this.coApplicant2['mobilePhone'] = this.coApplicant2['mobilePhone'] ? this.coApplicant2['mobilePhone'].slice(2) : '';
          this.fetchedCoApp2Data=this.coApplicant2?true:false;
          if(this.coApplicant2['beneficiaryBank']){
            this.onBankNameSearch(this.coApplicant2['beneficiaryBank'],'4');
            if(this.coApplicant2['beneficiaryBranch']){
            this.setIFSC(this.coApplicant2['beneficiaryBranch'],'coApp2');
            } else {
              this.setIFSC('','coApp2');
            }
          }
        }
        if(val == 'coApp3'){
          this.coApplicant3 = response.ProcessVariables.ApplicantDetails;
          this.coApplicant3['mobilePhone'] = this.coApplicant3['mobilePhone'] ? this.coApplicant3['mobilePhone'].slice(2) : '';
          this.fetchedCoApp3Data=this.coApplicant3?true:false;
          if(this.coApplicant3['beneficiaryBank']){
            this.onBankNameSearch(this.coApplicant3['beneficiaryBank'],'5');
            if(this.coApplicant3['beneficiaryBranch']){
            this.setIFSC(this.coApplicant3['beneficiaryBranch'],'coApp3');
            } else {
              this.setIFSC('','coApp3');
            }
          }
        }   
        }
    });
  }
  getApplicantDetails() {
      let ReqAppData = {
      "LeadID":this.disbLeadId          
      }
      this.disbursementService.getApplicantDetails(ReqAppData).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('applicantData', response)
        this.flag = false;
        this.applicantDetailsData = response.ProcessVariables.ApplicantDetails;
        const duplicateAppDetails: any = { ...this.applicantDetailsData };
        this.applicantObjInfo = duplicateAppDetails;
        this.applicantObjInfo['mobilePhone'] = this.applicantDetailsData['mobilePhone'] ? this.applicantDetailsData['mobilePhone'].slice(2) : '';
        if(this.applicantObjInfo['beneficiaryBank']){
          this.onBankNameSearch(this.applicantObjInfo['beneficiaryBank'],'2');
          if(this.applicantObjInfo['beneficiaryBranch']){
          this.setIFSC(this.applicantObjInfo['beneficiaryBranch'],'applicant');
          } else {
            this.setIFSC('','applicant');
          }
        }
        //this.dealerDetailsForm.patchValue({ address: (this.dealerDetailsData)? this.dealerDetailsData.addressLine1 +','+  this.dealerDetailsData.addressLine2 + ',' + this.dealerDetailsData.addressLine3: null });
      }
    });
  }

  getBankerApplicantDetails(){
    let ReqAppData = {
      "LeadID":this.disbLeadId          
      }
      this.disbursementService.getApplicantDetails(ReqAppData).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('applicantData', response)
        this.flagBank = false;
        const bankerDetailsData = response.ProcessVariables.ApplicantDetails;
        const duplicateAppDetails: any = { ...bankerDetailsData };
        this.bankerObjInfo['beneficiaryName'] = duplicateAppDetails.applicantName;
        this.bankerObjInfo['mobilePhone'] = bankerDetailsData.mobilePhone ? bankerDetailsData.mobilePhone.slice(2) : '';
      }
    });
  }

  getFinanceApplicantDetails(){
    let ReqAppData = {
      "LeadID":this.disbLeadId          
      }
      this.disbursementService.getApplicantDetails(ReqAppData).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // appiyoError === '0' && apiError === '0'
      if (appiyoError === '0') {
        console.log('applicantData', response)
        this.flagFinance = false;
        const financeDetails = response.ProcessVariables.ApplicantDetails;
        const duplicateAppDetails: any = { ...financeDetails };
        this.financierObjInfo['beneficiaryName'] = duplicateAppDetails.applicantName;
        this.financierObjInfo['mobilePhone'] = financeDetails.mobilePhone ? financeDetails.mobilePhone.slice(2) : '';
      }
    });
  }

  setIntType(event: any, val) {
    if (val == 'dealer') {
      this.showDealerIntDetails = false;
      if (!this.showDealerIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.dealerDetailsForm.get(key).reset();
          this.dealerDetailsForm.get(key).clearValidators();
          this.dealerDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'applicant') {
      this.showAppIntDetails = false;
      if (!this.showAppIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.appDetailsForm.get(key).reset();
          this.appDetailsForm.get(key).clearValidators();
          this.appDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'seller') {
      this.showSellerIntDetails = false;
      if (!this.showSellerIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.sellerDetailsForm.get(key).reset();
          this.sellerDetailsForm.get(key).clearValidators();
          this.sellerDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'buyer') {
      this.showBuyerIntDetails = false;
      if (!this.showBuyerIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.buyerDetailsForm.get(key).reset();
          this.buyerDetailsForm.get(key).clearValidators();
          this.buyerDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'additionalTab1') {
      this.showAdditionalTab1IntDetails = false;
      if (!this.showAdditionalTab1IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.additionalTab1DetailsForm.get(key).reset();
          this.additionalTab1DetailsForm.get(key).clearValidators();
          this.additionalTab1DetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'additionalTab2') {
      this.showAdditionalTab2IntDetails = false;
      if (!this.showAdditionalTab2IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.additionalTab2DetailsForm.get(key).reset();
          this.additionalTab2DetailsForm.get(key).clearValidators();
          this.additionalTab2DetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'additionalTab3') {
      this.showAdditionalTab3IntDetails = false;
      if (!this.showAdditionalTab3IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.additionalTab3DetailsForm.get(key).reset();
          this.additionalTab3DetailsForm.get(key).clearValidators();
          this.additionalTab3DetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'additionalTab4') {
      this.showAdditionalTab4IntDetails = false;
      if (!this.showAdditionalTab4IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.additionalTab4DetailsForm.get(key).reset();
          this.additionalTab4DetailsForm.get(key).clearValidators();
          this.additionalTab4DetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'additionalTab5') {
      this.showAdditionalTab5IntDetails = false;
      if (!this.showAdditionalTab5IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.additionalTab5DetailsForm.get(key).reset();
          this.additionalTab5DetailsForm.get(key).clearValidators();
          this.additionalTab5DetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'banker') {
      this.showBankerIntDetails = false;
      if (!this.showBankerIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.bankerDetailsForm.get(key).reset();
          this.bankerDetailsForm.get(key).clearValidators();
          this.bankerDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'financier') {
      this.showFinIntDetails = false;
      if (!this.showFinIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.financierDetailsForm.get(key).reset();
          this.financierDetailsForm.get(key).clearValidators();
          this.financierDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'thirdParty') {
      this.showTpIntDetails = false;
      if (!this.showTpIntDetails) {
        this.intTypeformArray.forEach(key => {
          this.thirdPartyDetailsForm.get(key).reset();
          this.thirdPartyDetailsForm.get(key).clearValidators();
          this.thirdPartyDetailsForm.get(key).setErrors(null);
        });
      }
    }
    if (val == 'coApp1') {
      this.showcoApp1IntDetails = false;
      if (!this.showcoApp1IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.coApp1Form.get(key).reset();
          this.coApp1Form.get(key).clearValidators();
          this.coApp1Form.get(key).setErrors(null);
        });
      }
    }
    if (val == 'coApp2') {
      this.showcoApp2IntDetails = false;
      if (!this.showcoApp2IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.coApp2Form.get(key).reset();
          this.coApp2Form.get(key).clearValidators();
          this.coApp2Form.get(key).setErrors(null);
        });
      }
    }
    if (val == 'coApp3') {
      this.showcoApp3IntDetails = false;
      if (!this.showcoApp3IntDetails) {
        this.intTypeformArray.forEach(key => {
          this.coApp3Form.get(key).reset();
          this.coApp3Form.get(key).clearValidators();
          this.coApp3Form.get(key).setErrors(null);
        });
      }
    }
    this.intTypeVal = event;
    if (this.intTypeVal == '1INSTYPE') {
      if (val == 'dealer') {
        this.showDealerIntDetails = true;
      }
      if (val == 'applicant') {
        this.showAppIntDetails = true;
      }
      if (val == 'banker') {
        this.showBankerIntDetails = true;
      }
      if (val == 'financier') {
        this.showFinIntDetails = true;
      }
      if (val == 'thirdParty') {
        this.showTpIntDetails = true;
      }
      if (val == 'coApp1') {
        this.showcoApp1IntDetails = true;
      }
      if (val == 'coApp2') {
        this.showcoApp2IntDetails = true;
      }
      if (val == 'coApp3') {
        this.showcoApp3IntDetails = true;
      }
    }
  }
  setModeOfPayment(event: any, val) {
    this.mopVal = event.target.value;
    if (val == 'dealer') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankDealerDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showBankDetails = false;
        if (!this.showBankDetails) {
          this.bankcasaformArray.forEach(key => {
            this.dealerDetailsForm.get(key).reset();
          });
          this.bankcasaformArray.forEach(key => {
            this.dealerDetailsForm.get(key).clearValidators()
            this.dealerDetailsForm.get(key).setErrors(null);
          });
        }
        } else {
          this.showBankDetails = false;
          this.showCASADetails = false; 
          if (!this.showBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.dealerDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.dealerDetailsForm.get(key).clearValidators()
              this.dealerDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'dealer');
          this.chequeDDformArray.forEach(key => {
            this.dealerDetailsForm.get(key).setValidators([Validators.required])
            this.dealerDetailsForm.get(key).updateValueAndValidity();
          });
        } 
      }
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showDDDetails = false;
        if (!this.showDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.dealerDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.dealerDetailsForm.get(key).clearValidators()
            this.dealerDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'dealer');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.dealerDetailsForm.get(key).setValidators([Validators.required]);
            this.dealerDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.dealerDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.dealerDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
      
    }
    if (val == 'applicant') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAppDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAppBankDetails = false;
          if (!this.showAppBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.appDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.appDetailsForm.get(key).clearValidators()
              this.appDetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAppBankDetails = false;
          this.showAppCASADetails = false; 
          if (!this.showAppBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.appDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.appDetailsForm.get(key).clearValidators()
              this.appDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'applicant');
          this.chequeDDformArray.forEach(key => {
            this.appDetailsForm.get(key).setValidators([Validators.required]);
            this.appDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAppDDDetails = false;
        if (!this.showAppDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.appDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.appDetailsForm.get(key).clearValidators();
            this.appDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'applicant');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.appDetailsForm.get(key).setValidators([Validators.required]);
            this.appDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.appDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.appDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'seller') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankSellerDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showSellerBankDetails = false;
          if (!this.showSellerBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.sellerDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.sellerDetailsForm.get(key).clearValidators()
              this.sellerDetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showSellerBankDetails = false;
          this.showSellerCASADetails = false; 
          if (!this.showSellerBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.sellerDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.sellerDetailsForm.get(key).clearValidators()
              this.sellerDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'seller');
          this.chequeDDformArray.forEach(key => {
            this.sellerDetailsForm.get(key).setValidators([Validators.required]);
            this.sellerDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showSellerDDDetails = false;
        if (!this.showSellerDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.sellerDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.sellerDetailsForm.get(key).clearValidators();
            this.sellerDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'seller');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.sellerDetailsForm.get(key).setValidators([Validators.required]);
            this.sellerDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.sellerDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.sellerDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }

    if (val == 'buyer') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankBuyerDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showBuyerBankDetails = false;
          if (!this.showBuyerBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.buyerDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.buyerDetailsForm.get(key).clearValidators()
              this.buyerDetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showBuyerBankDetails = false;
          this.showBuyerCASADetails = false; 
          if (!this.showBuyerBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.buyerDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.buyerDetailsForm.get(key).clearValidators()
              this.buyerDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'buyer');
          this.chequeDDformArray.forEach(key => {
            this.buyerDetailsForm.get(key).setValidators([Validators.required]);
            this.buyerDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showBuyerDDDetails = false;
        if (!this.showBuyerDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.buyerDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.buyerDetailsForm.get(key).clearValidators();
            this.buyerDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'buyer');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.buyerDetailsForm.get(key).setValidators([Validators.required]);
            this.buyerDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.buyerDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.buyerDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'additionalTab1') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAdditionalTab1DetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAdditionalTab1BankDetails = false;
          if (!this.showAdditionalTab1BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.additionalTab1DetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.additionalTab1DetailsForm.get(key).clearValidators()
              this.additionalTab1DetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAdditionalTab1BankDetails = false;
          this.showAdditionalTab1CASADetails = false; 
          if (!this.showAdditionalTab1BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab1DetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab1DetailsForm.get(key).clearValidators()
              this.additionalTab1DetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'additionalTab1');
          this.chequeDDformArray.forEach(key => {
            this.additionalTab1DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab1DetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAdditionalTab1DDDetails = false;
        if (!this.showAdditionalTab1DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.additionalTab1DetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.additionalTab1DetailsForm.get(key).clearValidators();
            this.additionalTab1DetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'additionalTab1');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.additionalTab1DetailsForm.get(key).setValidators([Validators.required])
	    this.additionalTab1DetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.additionalTab1DetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.additionalTab1DetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }

    if (val == 'additionalTab2') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAdditionalTab2DetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAdditionalTab2BankDetails = false;
          if (!this.showAdditionalTab2BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.additionalTab2DetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.additionalTab2DetailsForm.get(key).clearValidators()
              this.additionalTab2DetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAdditionalTab2BankDetails = false;
          this.showAdditionalTab2CASADetails = false; 
          if (!this.showAdditionalTab2BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab2DetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab2DetailsForm.get(key).clearValidators()
              this.additionalTab2DetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'additionalTab2');
          this.chequeDDformArray.forEach(key => {
            this.additionalTab2DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab2DetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAdditionalTab2DDDetails = false;
        if (!this.showAdditionalTab2DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.additionalTab2DetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.additionalTab2DetailsForm.get(key).clearValidators();
            this.additionalTab2DetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'additionalTab2');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.additionalTab2DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab2DetailsForm.get(key).updateValueAndValidity();
	  });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.additionalTab2DetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.additionalTab2DetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'additionalTab3') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAdditionalTab3DetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAdditionalTab3BankDetails = false;
          if (!this.showAdditionalTab3BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.additionalTab3DetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.additionalTab3DetailsForm.get(key).clearValidators()
              this.additionalTab3DetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAdditionalTab3BankDetails = false;
          this.showAdditionalTab3CASADetails = false; 
          if (!this.showAdditionalTab3BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab3DetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab3DetailsForm.get(key).clearValidators()
              this.additionalTab3DetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'additionalTab3');
          this.chequeDDformArray.forEach(key => {
            this.additionalTab3DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab3DetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAdditionalTab3DDDetails = false;
        if (!this.showAdditionalTab3DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.additionalTab3DetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.additionalTab3DetailsForm.get(key).clearValidators();
            this.additionalTab3DetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'additionalTab3');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.additionalTab3DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab3DetailsForm.get(key).updateValueAndValidity();
	  });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.additionalTab3DetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.additionalTab3DetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'additionalTab4') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAdditionalTab4DetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAdditionalTab4BankDetails = false;
          if (!this.showAdditionalTab4BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.additionalTab4DetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.additionalTab4DetailsForm.get(key).clearValidators()
              this.additionalTab4DetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAdditionalTab4BankDetails = false;
          this.showAdditionalTab4CASADetails = false; 
          if (!this.showAdditionalTab4BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab4DetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab4DetailsForm.get(key).clearValidators()
              this.additionalTab4DetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'additionalTab4');
          this.chequeDDformArray.forEach(key => {
            this.additionalTab4DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab4DetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAdditionalTab4DDDetails = false;
        if (!this.showAdditionalTab4DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.additionalTab4DetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.additionalTab4DetailsForm.get(key).clearValidators();
            this.additionalTab4DetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'additionalTab4');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.additionalTab4DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab4DetailsForm.get(key).updateValueAndValidity();
	  });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.additionalTab4DetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.additionalTab4DetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'additionalTab5') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankAdditionalTab5DetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showAdditionalTab5BankDetails = false;
          if (!this.showAdditionalTab5BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.additionalTab5DetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.additionalTab5DetailsForm.get(key).clearValidators()
              this.additionalTab5DetailsForm.get(key).setErrors(null);
            });
          }
        }else{
          this.showAdditionalTab5BankDetails = false;
          this.showAdditionalTab5CASADetails = false; 
          if (!this.showAdditionalTab5BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab5DetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.additionalTab5DetailsForm.get(key).clearValidators()
              this.additionalTab5DetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'additionalTab5');
          this.chequeDDformArray.forEach(key => {
            this.additionalTab5DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab5DetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showAdditionalTab5DDDetails = false;
        if (!this.showAdditionalTab5DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.additionalTab5DetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.additionalTab5DetailsForm.get(key).clearValidators();
            this.additionalTab5DetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'additionalTab5');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.additionalTab5DetailsForm.get(key).setValidators([Validators.required])
            this.additionalTab5DetailsForm.get(key).updateValueAndValidity();
	  });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.additionalTab5DetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.additionalTab5DetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }

    if (val == 'banker') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankBankerDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showBankerBankDetails = false;
          if (!this.showBankerBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.bankerDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.bankerDetailsForm.get(key).clearValidators();
              this.bankerDetailsForm.get(key).setErrors(null);
            });
          }
        }else {
          this.showBankerBankDetails = false;
          this.showBankerCASADetails = false;
          if (!this.showBankerBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.bankerDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.bankerDetailsForm.get(key).clearValidators();
              this.bankerDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'banker');
          this.chequeDDformArray.forEach(key => {
            this.bankerDetailsForm.get(key).setValidators([Validators.required]);
            this.bankerDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showBankerDDDetails = false;
        if (!this.showBankerDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.bankerDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.bankerDetailsForm.get(key).clearValidators();
            this.bankerDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'banker');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.bankerDetailsForm.get(key).setValidators([Validators.required]);
            this.bankerDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.bankerDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.bankerDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
      
    }
    if (val == 'financier') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankFinDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showFinBankDetails = false;
          if (!this.showFinBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.financierDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.financierDetailsForm.get(key).clearValidators();
              this.financierDetailsForm.get(key).setErrors(null);
            });
          }
        }else {
          this.showFinBankDetails = false;
          this.showFinCASADetails = false;
          if (!this.showFinBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.financierDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.financierDetailsForm.get(key).clearValidators();
              this.financierDetailsForm.get(key).setErrors(null);
            }); 
          }
          this.setIntType(null, 'financier');
          this.chequeDDformArray.forEach(key => {
            this.financierDetailsForm.get(key).setValidators([Validators.required]);
            this.financierDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showFinDDDetails = false;
        if (!this.showFinDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.financierDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.financierDetailsForm.get(key).clearValidators();
            this.financierDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'financier');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.financierDetailsForm.get(key).setValidators([Validators.required]);
            this.financierDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.financierDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.financierDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
      
    }
    if (val == 'thirdParty') {
      if(this.mopVal == '1MODEOFPAYMENT' || this.mopVal == '2MODEOFPAYMENT'){
        this.bankTPDetailsData = [];
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.showTPBankDetails = false;
          if (!this.showTPBankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.thirdPartyDetailsForm.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.thirdPartyDetailsForm.get(key).clearValidators();
              this.thirdPartyDetailsForm.get(key).setErrors(null);
            });
          }
        }else {
          this.showTPBankDetails = false;
          this.showTPCASADetails = false;
          if (!this.showTPBankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.thirdPartyDetailsForm.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.thirdPartyDetailsForm.get(key).clearValidators();
              this.thirdPartyDetailsForm.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'thirdParty');
          this.chequeDDformArray.forEach(key => {
            this.thirdPartyDetailsForm.get(key).setValidators([Validators.required]);
            this.thirdPartyDetailsForm.get(key).updateValueAndValidity();
          });
        }
      }
      if(this.mopVal == '2MODEOFPAYMENT' || this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
        this.showTPDDDetails = false;
        if (!this.showTPDDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.thirdPartyDetailsForm.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.thirdPartyDetailsForm.get(key).clearValidators();
            this.thirdPartyDetailsForm.get(key).setErrors(null);
          });
          this.setIntType(null, 'thirdParty');
        }
        if(this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.thirdPartyDetailsForm.get(key).setValidators([Validators.required]);
            this.thirdPartyDetailsForm.get(key).updateValueAndValidity();
          });
        }
        if(this.mopVal == '2MODEOFPAYMENT'){
          this.thirdPartyDetailsForm.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.thirdPartyDetailsForm.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }

    if (this.mopVal == '7MODEOFPAYMENT' || this.mopVal == '8MODEOFPAYMENT') {// NEFT &  RTGS
      if (val == 'dealer') {
        this.showBankDetails = true;
      }
      if (val == 'applicant') {
        this.showAppBankDetails = true;
      }
      if (val == 'seller') {
        this.showSellerBankDetails = true;
      }
      if (val == 'buyer') {
        this.showBuyerBankDetails = true;
      }
      if (val == 'additionalTab1') {
        this.showAdditionalTab1BankDetails = true;
      }
      if (val == 'additionalTab2') {
        this.showAdditionalTab2BankDetails = true;
      }
      if (val == 'additionalTab3') {
        this.showAdditionalTab3BankDetails = true;
      }
      if (val == 'additionalTab4') {
        this.showAdditionalTab4BankDetails = true;
      }
      if (val == 'additionalTab5') {
        this.showAdditionalTab5BankDetails = true;
      }
      if (val == 'banker') {
        this.showBankerBankDetails = true;
      }
      if (val == 'financier') {
        this.showFinBankDetails = true;
      }
      if (val == 'thirdParty') {
        this.showTPBankDetails = true;
      }
    } else if (this.mopVal == '1MODEOFPAYMENT') {// cheque or dd
      if (val == 'dealer') {
        this.showDDDetails = true;
        this.dealerObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'applicant') {
        this.showAppDDDetails = true;
        this.applicantObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'seller') {
        this.showSellerDDDetails = true;
        this.sellerObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'buyer') {
        this.showBuyerDDDetails = true;
        this.buyerObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'additionalTab1') {
        this.showAdditionalTab1DDDetails = true;
        this.additionalTab1ObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'additionalTab2') {
        this.showAdditionalTab2DDDetails = true;
        this.additionalTab2ObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'additionalTab3') {
        this.showAdditionalTab3DDDetails = true;
        this.additionalTab3ObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'additionalTab4') {
        this.showAdditionalTab4DDDetails = true;
        this.additionalTab4ObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'additionalTab5') {
        this.showAdditionalTab5DDDetails = true;
        this.additionalTab5ObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'banker') {
        this.showBankerDDDetails = true;
        this.bankerObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'financier') {
        this.showFinDDDetails = true;
        this.financierObjInfo['instrumentType'] = '2INSTYPE';
      }
      if (val == 'thirdParty') {
        this.showTPDDDetails = true;
        this.thirdPartyObjInfo['instrumentType'] = '2INSTYPE';
      }
    } else if (this.mopVal == '2MODEOFPAYMENT') {// casa
      if (val == 'dealer') {
        this.showCASADetails = true;
      }
      if (val == 'applicant') {
        this.showAppCASADetails = true;
      }
      if (val == 'seller') {
        this.showSellerCASADetails = true;
      }
      if (val == 'buyer') {
        this.showBuyerCASADetails = true;
      }
      if (val == 'additionalTab1') {
        this.showAdditionalTab1CASADetails = true;
      }
      if (val == 'additionalTab2') {
        this.showAdditionalTab2CASADetails = true;
      }
      if (val == 'additionalTab3') {
        this.showAdditionalTab3CASADetails = true;
      }
      if (val == 'additionalTab4') {
        this.showAdditionalTab4CASADetails = true;
      }
      if (val == 'additionalTab5') {
        this.showAdditionalTab5CASADetails = true;
      }
      if (val == 'banker') {
        this.showBankerCASADetails = true;
      }
      if (val == 'financier') {
        this.showFinCASADetails = true;
      }
      if (val == 'thirdParty') {
        this.showTPCASADetails = true;
      }
    }
  }

  setCoAppMOP(event: any, val) {
    let coAppMopValue = event.target.value;
    if (val == 'coApp1') {
      if(coAppMopValue == '1MODEOFPAYMENT' || coAppMopValue == '2MODEOFPAYMENT'){
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.showCoApp1BankDetails = false;
          if (!this.showCoApp1BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.coApp1Form.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.coApp1Form.get(key).clearValidators();
              this.coApp1Form.get(key).setErrors(null);
            });
          }
        }else {
          this.showCoApp1BankDetails = false;
          this.showCoApp1CASADetails = false;
          if (!this.showCoApp1BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.coApp1Form.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.coApp1Form.get(key).clearValidators();
              this.coApp1Form.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'coApp1');
          this.chequeDDformArray.forEach(key => {
            this.coApp1Form.get(key).setValidators([Validators.required]);
            this.coApp1Form.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(coAppMopValue == '2MODEOFPAYMENT' || coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
        this.showCoApp1DDDetails = false;
        if (!this.showCoApp1DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.coApp1Form.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.coApp1Form.get(key).clearValidators();
            this.coApp1Form.get(key).setErrors(null);
          });
          this.setIntType(null, 'coApp1');
        }
        if(coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.coApp1Form.get(key).setValidators([Validators.required]);
            this.coApp1Form.get(key).updateValueAndValidity();
          });
        }
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.coApp1Form.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.coApp1Form.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
        
      }
    }
    if (val == 'coApp2') {
      if(coAppMopValue == '1MODEOFPAYMENT' || coAppMopValue == '2MODEOFPAYMENT'){
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.showCoApp2BankDetails = false;
          if (!this.showCoApp2BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.coApp2Form.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.coApp2Form.get(key).clearValidators();
              this.coApp2Form.get(key).setErrors(null);
            });
          }
        }else {
          this.showCoApp2BankDetails = false;
          this.showCoApp2CASADetails = false;
          if (!this.showCoApp2BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.coApp2Form.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.coApp2Form.get(key).clearValidators();
              this.coApp2Form.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'coApp2');
          this.chequeDDformArray.forEach(key => {
            this.coApp2Form.get(key).setValidators([Validators.required]);
            this.coApp2Form.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(coAppMopValue == '2MODEOFPAYMENT' || coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
        this.showCoApp2DDDetails = false;
        if (!this.showCoApp2DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.coApp2Form.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.coApp2Form.get(key).clearValidators();
            this.coApp2Form.get(key).setErrors(null);
          });
          this.setIntType(null, 'coApp2');
        }
        if(coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.coApp2Form.get(key).setValidators([Validators.required]);
            this.coApp2Form.get(key).updateValueAndValidity();
          });
        }
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.coApp2Form.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.coApp2Form.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    if (val == 'coApp3') {
      if(coAppMopValue == '1MODEOFPAYMENT' || coAppMopValue == '2MODEOFPAYMENT'){
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.showCoApp3BankDetails = false;
          if (!this.showCoApp3BankDetails) {
            this.bankcasaformArray.forEach(key => {
              this.coApp3Form.get(key).reset();
            });
            this.bankcasaformArray.forEach(key => {
              this.coApp3Form.get(key).clearValidators();
              this.coApp3Form.get(key).setErrors(null);
            });
          }
        }else {
          this.showCoApp3BankDetails = false;
          this.showCoApp3CASADetails = false;
          if (!this.showCoApp3BankDetails) {
            this.bankdetailsformArray.forEach(key => {
              this.coApp3Form.get(key).reset();
            });
            this.bankdetailsformArray.forEach(key => {
              this.coApp3Form.get(key).clearValidators();
              this.coApp3Form.get(key).setErrors(null);
            });
          }
          this.setIntType(null, 'coApp3');
          this.chequeDDformArray.forEach(key => {
            this.coApp3Form.get(key).setValidators([Validators.required]);
            this.coApp3Form.get(key).updateValueAndValidity();
          });
        }
      }
      
      if(coAppMopValue == '2MODEOFPAYMENT' || coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
        this.showCoApp3DDDetails = false;
        if (!this.showCoApp3DDDetails) {
          this.chequeDDformArray.forEach(key => {
            this.coApp3Form.get(key).reset();
          });
          this.chequeDDformArray.forEach(key => {
            this.coApp3Form.get(key).clearValidators();
            this.coApp3Form.get(key).setErrors(null);
          });
          this.setIntType(null, 'coApp3');
        }
        if(coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT'){
          this.bankdetailsformArray.forEach(key => {
            this.coApp3Form.get(key).setValidators([Validators.required]);
            this.coApp3Form.get(key).updateValueAndValidity();
          });
        }
        if(coAppMopValue == '2MODEOFPAYMENT'){
          this.coApp3Form.controls.beneficiaryAccountNo.setValidators([Validators.required]);
          this.coApp3Form.controls.beneficiaryAccountNo.updateValueAndValidity();
        }
      }
    }
    
    if (coAppMopValue == '7MODEOFPAYMENT' || coAppMopValue == '8MODEOFPAYMENT') {// NEFT &  RTGS
      if (val == 'coApp1')
        this.showCoApp1BankDetails = true;
      if (val == 'coApp2')
        this.showCoApp2BankDetails = true;
      if (val == 'coApp3')
        this.showCoApp3BankDetails = true;
    } else if (coAppMopValue == '1MODEOFPAYMENT') {//cheque or dd
      if (val == 'coApp1')
        this.showCoApp1DDDetails = true;
        this.coApplicant1['instrumentType'] = '2INSTYPE';
      if (val == 'coApp2')
        this.showCoApp2DDDetails = true;
        this.coApplicant2['instrumentType'] = '2INSTYPE';
      if (val == 'coApp3')
        this.showCoApp3DDDetails = true;
        this.coApplicant3['instrumentType'] = '2INSTYPE';
    } else if (coAppMopValue == '2MODEOFPAYMENT') {//casa
      if (val == 'coApp1')
        this.showCoApp1CASADetails = true;
      if (val == 'coApp2')
        this.showCoApp2CASADetails = true;
      if (val == 'coApp3')
        this.showCoApp3CASADetails = true;
    }
  }

  disburseToVal(val,fetchflag,event) {
    //newly added for 8581 starts
    let lengthExceeds= false;
    if(val && val.length>3 && fetchflag){
      this.disburseTo =[];
      val=event['source']['ngControl']['model'];
      lengthExceeds= true;
      this.toasterService.showError('Disburse To should not be more than three parties', '');     
      val.forEach(ele => {
        this.disburseTo.push(ele) // in event already Internal BT Pushed
      });    
      this.disburseToVal(val,false,'');  
    }
    ////newly added for 8581 ends
    console.log('diburseToValues', this.disburseTo)
    // console.log(val,val.length)
    this.disburseToDealer = false;
    this.disburseToApp = false;
    this.disburseToSeller = false;
    this.disburseToBuyer = false;
    this.disburseToAdditionalTab1 = false;
    this.disburseToAdditionalTab2 = false;
    this.disburseToAdditionalTab3 = false;
    this.disburseToAdditionalTab4 = false;
    this.disburseToAdditionalTab5 = false;

    this.disburseToCoApp = false;
    this.disburseToBanker = false;
    this.disburseToFinancier = false;
    this.disburseToThirdParty = false;
    this.disburseToIBT = false;
    // if(!this.isIBTApplicable){
    //   this.disburseToIBT = true;
    //   console.log(this.disburseToLov)
    // }else{
    //   this.disburseToIBT = false;
    // }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.disburseToLov.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < val.length; j++) {
        if (this.disburseToLov[i]['key'] == (val)[j]) {
          if (val[j] == '1DISBURSETO') {
            this.disburseToDealer = true;
            if(this.fetchedDealerCode && this.flagDealor && fetchflag){
              this.onDealerCodeSearch(this.fetchedDealerCode,true,true);
            }
          }
          if (val[j] == '2DISBURSETO') {
            if (this.flag) {
              this.getApplicantDetails();
            }
            this.disburseToApp = true;
          }
          if (val[j] == '3DISBURSETO') {
            this.disburseToCoApp = true;
          }
          if (val[j] == '4DISBURSETO') {
            
            if (this.flagBank) {
              this.getBankerApplicantDetails();
            }

            this.disburseToBanker = true;
          }
          if (val[j] == '5DISBURSETO') {
            if (this.flagFinance) {
              this.getFinanceApplicantDetails();
            }
            this.disburseToFinancier = true;
            // this.getBasicFiancierLov();
          }
          if (val[j] == '6DISBURSETO') {
            this.disburseToThirdParty = true;
            // this.getBasicThirdPartyLov();
          }
          if (val[j] == '7DISBURSETO') {
            this.disburseToIBT = true;
            // this.getBasicIBTLov();
          }
          if (val[j] == '9DISBURSETO') {            
            this.disburseToSeller = true;
          }
          if (val[j] == '8DISBURSETO') {            
            this.disburseToBuyer = true;
          }
          if (val[j] == '10DISBURSETO') {            
            this.disburseToAdditionalTab1 = true;
          }
          if (val[j] == '11DISBURSETO') {            
            this.disburseToAdditionalTab2 = true;
          }
          if (val[j] == '12DISBURSETO') {            
            this.disburseToAdditionalTab3 = true;
          }
          if (val[j] == '13DISBURSETO') {            
            this.disburseToAdditionalTab4 = true;
          }
          if (val[j] == '14DISBURSETO') {            
            this.disburseToAdditionalTab5 = true;
          }
        }

      }
    }
    if (!this.disburseToDealer) {
      this.dealerDetailsForm.reset();
      this.showTrancheTable = false;
      this.showBankDetails = false;
      this.showDDDetails = false;
      this.showCASADetails = false;
      this.flagDealor = true;
      this.trancheDealerList = [];
      this.dealerObjInfo['dealerCode'] = '';
      this.dealerformArray.forEach(key => {
        this.dealerDetailsForm.get(key).clearValidators();
        this.dealerDetailsForm.get(key).setErrors(null);
      });

    } else {
      this.dealerformArray.forEach(key => {
        this.dealerDetailsForm.get(key).setValidators([Validators.required]);
        //this.dealerDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'dealer');
      //this.dealerDetailsForm.get('dealerCode').setValidators([Validators.required]);
    }
    if (!this.disburseToApp) {
      this.appDetailsForm.reset();
      this.showAppTrancheTable = false;
      this.showAppBankDetails = false;
      this.showAppDDDetails = false;
      this.showAppCASADetails = false;
      this.flag = true;
      this.trancheAppList = [];
      this.commonFormArray.forEach(key => {
        this.appDetailsForm.get(key).clearValidators();
        this.appDetailsForm.get(key).setErrors(null);
      });

    } else {
      this.commonFormArray.forEach(key => {
        this.appDetailsForm.get(key).setValidators([Validators.required]);
        //this.appDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'applicant');
    }
    if (!this.disburseToSeller) {
      this.sellerDetailsForm.reset();
      this.showSellerTrancheTable = false;
      this.showSellerBankDetails = false;
      this.showSellerDDDetails = false;
      this.showSellerCASADetails = false;
      this.trancheSellerList = [];
      this.commonFormArray.forEach(key => {
        this.sellerDetailsForm.get(key).clearValidators();
        this.sellerDetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.sellerDetailsForm.get(key).setValidators([Validators.required]);
        //this.sellerDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'seller');
    }

    if (!this.disburseToBuyer) {
      this.buyerDetailsForm.reset();
      this.showBuyerTrancheTable = false;
      this.showBuyerBankDetails = false;
      this.showBuyerDDDetails = false;
      this.showBuyerCASADetails = false;
      this.trancheBuyerList = [];
      this.commonFormArray.forEach(key => {
        this.buyerDetailsForm.get(key).clearValidators();
        this.buyerDetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.buyerDetailsForm.get(key).setValidators([Validators.required]);
        //this.buyerDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'buyer');
    }
    if (!this.disburseToAdditionalTab1) {
      this.additionalTab1DetailsForm.reset();
      this.showAdditionalTab1TrancheTable = false;
      this.showAdditionalTab1BankDetails = false;
      this.showAdditionalTab1DDDetails = false;
      this.showAdditionalTab1CASADetails = false;
      this.trancheAdditionalTab1List = [];
      this.commonFormArray.forEach(key => {
        this.additionalTab1DetailsForm.get(key).clearValidators();
        this.additionalTab1DetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.additionalTab1DetailsForm.get(key).setValidators([Validators.required]);
      });
      this.setIntType(null,'additionalTab1'); 
    }
    if (!this.disburseToAdditionalTab2) {
      this.additionalTab2DetailsForm.reset();
      this.showAdditionalTab2TrancheTable = false;
      this.showAdditionalTab2BankDetails = false;
      this.showAdditionalTab2DDDetails = false;
      this.showAdditionalTab2CASADetails = false;
      this.trancheAdditionalTab2List = [];
      this.commonFormArray.forEach(key => {
        this.additionalTab2DetailsForm.get(key).clearValidators();
        this.additionalTab2DetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.additionalTab2DetailsForm.get(key).setValidators([Validators.required]);
      });
      this.setIntType(null,'additionalTab2'); 
    }
    if (!this.disburseToAdditionalTab3) {
      this.additionalTab3DetailsForm.reset();
      this.showAdditionalTab3TrancheTable = false;
      this.showAdditionalTab3BankDetails = false;
      this.showAdditionalTab3DDDetails = false;
      this.showAdditionalTab3CASADetails = false;
      this.trancheAdditionalTab3List = [];
      this.commonFormArray.forEach(key => {
        this.additionalTab3DetailsForm.get(key).clearValidators();
        this.additionalTab3DetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.additionalTab3DetailsForm.get(key).setValidators([Validators.required]);
      });
      this.setIntType(null,'additionalTab3'); 
    }
    if (!this.disburseToAdditionalTab4) {
      this.additionalTab4DetailsForm.reset();
      this.showAdditionalTab4TrancheTable = false;
      this.showAdditionalTab4BankDetails = false;
      this.showAdditionalTab4DDDetails = false;
      this.showAdditionalTab4CASADetails = false;
      this.trancheAdditionalTab4List = [];
      this.commonFormArray.forEach(key => {
        this.additionalTab4DetailsForm.get(key).clearValidators();
        this.additionalTab4DetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.additionalTab4DetailsForm.get(key).setValidators([Validators.required]);
      });
      this.setIntType(null,'additionalTab4'); 
    }
    if (!this.disburseToAdditionalTab5) {
      this.additionalTab5DetailsForm.reset();
      this.showAdditionalTab5TrancheTable = false;
      this.showAdditionalTab5BankDetails = false;
      this.showAdditionalTab5DDDetails = false;
      this.showAdditionalTab5CASADetails = false;
      this.trancheAdditionalTab5List = [];
      this.commonFormArray.forEach(key => {
        this.additionalTab5DetailsForm.get(key).clearValidators();
        this.additionalTab5DetailsForm.get(key).setErrors(null);
      });
  
    } else {
      this.commonFormArray.forEach(key => {
        this.additionalTab5DetailsForm.get(key).setValidators([Validators.required]);
      });
      this.setIntType(null,'additionalTab5'); 
    }

    if (!this.disburseToCoApp) {
      this.coAppDetailsForm.controls['coAppName'].reset();
      this.coAppDetailsForm.controls['coAppName'].clearValidators();
      this.coAppDetailsForm.controls['coAppName'].setErrors(null);
      this.selectCoApplicant('');
    }
    if (!this.disburseToBanker) {
      this.bankerDetailsForm.reset();
      this.showBankerTrancheTable = false;
      this.showBankerBankDetails = false;
      this.showBankerDDDetails = false;
      this.showBankerCASADetails = false;
      this.flagBank = true;
      this.trancheBankerList = [];
      this.bankerformArray.forEach(key => {
        this.bankerDetailsForm.get(key).clearValidators();
        this.bankerDetailsForm.get(key).setErrors(null);
      });
    } else {
      this.bankerformArray.forEach(key => {
        this.bankerDetailsForm.get(key).setValidators([Validators.required]);
        //this.bankerDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'banker');
    }
    if (!this.disburseToFinancier) {
      this.financierDetailsForm.reset();
      this.showFinancierTrancheTable = false;
      this.showFinBankDetails = false;
      this.showFinDDDetails = false;
      this.showFinCASADetails = false;
      this.flagFinance = true;
      this.trancheFinancierList = [];
      this.finformArray.forEach(key => {
        this.financierDetailsForm.get(key).clearValidators();
        this.financierDetailsForm.get(key).setErrors(null);
      });
    } else {
      this.finformArray.forEach(key => {
        this.financierDetailsForm.get(key).setValidators([Validators.required]);
        //this.financierDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'financier');
    }
    if (!this.disburseToThirdParty) {
      this.thirdPartyDetailsForm.reset();
      this.showThirdPartyTrancheTable = false;
      this.showTPBankDetails = false;
      this.showTPDDDetails = false;
      this.showTPCASADetails = false;
      this.trancheTpList = [];
      this.thirdPartyFormArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).clearValidators();
        this.thirdPartyDetailsForm.get(key).setErrors(null);
      });
    } else {
      this.thirdPartyFormArray.forEach(key => {
        this.thirdPartyDetailsForm.get(key).setValidators([Validators.required]);
        //this.thirdPartyDetailsForm.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'thirdParty');
    }
  }

  selectCoApplicant(sNo) {
    this.coApp1 = false;
    this.coApp2 = false;
    this.coApp3 = false;
    this.fetchedCoApp1Data = this.fetchedCoApp1Data?true:false;
    this.fetchedCoApp2Data = this.fetchedCoApp2Data?true:false;
    this.fetchedCoApp3Data = this.fetchedCoApp3Data?true:false;
    if (this.coAppNamesLov) {
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
    }
    
    if (!this.coApp1) {
      this.coApp1Form.reset();
      this.showCoApp1TrancheTable = false;
      this.showCoApp1BankDetails = false;
      this.showCoApp1DDDetails = false;
      this.showCoApp1CASADetails = false;
      this.fetchedCoApp1Data = false;
      this.trancheCoApp1List = [];
      this.commonFormArray.forEach(key => {
        this.coApp1Form.get(key).clearValidators();
        this.coApp1Form.get(key).setErrors(null);
      });

    } else {
      this.commonFormArray.forEach(key => {
        this.coApp1Form.get(key).setValidators([Validators.required]);
        //this.coApp1Form.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'coApp1');
    }
    if (!this.coApp2) {
      this.coApp2Form.reset();
      this.showCoApp2TrancheTable = false;
      this.showCoApp2BankDetails = false;
      this.showCoApp2DDDetails = false;
      this.showCoApp2CASADetails = false;
      this.fetchedCoApp2Data = false;
      this.trancheCoApp2List = [];
      this.commonFormArray.forEach(key => {
        this.coApp2Form.get(key).clearValidators();
        this.coApp2Form.get(key).setErrors(null);
      });

    } else {
      this.commonFormArray.forEach(key => {
        this.coApp2Form.get(key).setValidators([Validators.required]);
        //this.coApp2Form.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'coApp2');
    }
    if (!this.coApp3) {
      this.coApp3Form.reset();
      this.showCoApp3TrancheTable = false;
      this.showCoApp3BankDetails = false;
      this.showCoApp3DDDetails = false;
      this.showCoApp3CASADetails = false;
      this.fetchedCoApp3Data = false;
      this.trancheCoApp3List = [];
      this.commonFormArray.forEach(key => {
        this.coApp3Form.get(key).clearValidators();
        this.coApp3Form.get(key).setErrors(null);
      });
    } else {
      this.commonFormArray.forEach(key => {
        this.coApp3Form.get(key).setValidators([Validators.required]);
        //this.coApp3Form.get(key).updateValueAndValidity();
      });
      this.setIntType(null,'coApp3');
    }
   if(this.coApp1){
      if(!this.fetchedCoApp1Data)
      this.getCoApplicantDetails(this.coApplicant1['applicantId'],'coApp1');
    }
    if(this.coApp2){
      if(!this.fetchedCoApp2Data)
      this.getCoApplicantDetails(this.coApplicant2['applicantId'],'coApp2');
    }
    if(this.coApp3){
      if(!this.fetchedCoApp3Data)
      this.getCoApplicantDetails(this.coApplicant3['applicantId'],'coApp3');
    }
  }

  selectTranche(val, container, fetchList) {
    let pushListObject = {
      'tranche_disbursement_type': '',
      'disbursement_percentage': '',
      'tranche_disbursement_amount': '',
      'trancheDisburseDate': '',
      'disbursement_id': '',
      'tranche_disbursement_id': '1',
    }
    if (fetchList) {
      pushListObject = {
        'tranche_disbursement_type': '',
        'disbursement_percentage': '',
        'tranche_disbursement_amount': '',
        'trancheDisburseDate': '',
        'disbursement_id': '',
        'tranche_disbursement_id': '',
      }
    }
    if (container == '1' && val == true) {
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
    } else if (container == '2' && val == true) {
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
    } else if (container == '11' && val == true) {
      this.showSellerTrancheTable = true;
      this.trancheSellerForm = this.fb.group({
        trancheSellerArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheSellerForm.get('trancheSellerArray') as FormArray).valueChanges.subscribe(() => {
        (this.trancheSellerForm.get('trancheSellerArray') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheSellerList.push(pushListObject);
    }else if (container == '12' && val == true) {
      this.showBuyerTrancheTable = true;
      this.trancheBuyerForm = this.fb.group({
        trancheBuyerArray: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheBuyerForm.get('trancheBuyerArray') as FormArray).valueChanges.subscribe(() => {
        (this.trancheBuyerForm.get('trancheBuyerArray') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheBuyerList.push(pushListObject);
    } else if (container == '13' && val == true) {
      this.showAdditionalTab1TrancheTable = true;
      this.trancheAdditionalTab1Form = this.fb.group({
        trancheAdditionalTab1Array: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheAdditionalTab1Form.get('trancheAdditionalTab1Array') as FormArray).valueChanges.subscribe(() => {
        (this.trancheAdditionalTab1Form.get('trancheAdditionalTab1Array') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheAdditionalTab1List.push(pushListObject);
    } else if (container == '14' && val == true) {
      this.showAdditionalTab2TrancheTable = true;
      this.trancheAdditionalTab2Form = this.fb.group({
        trancheAdditionalTab2Array: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheAdditionalTab2Form.get('trancheAdditionalTab2Array') as FormArray).valueChanges.subscribe(() => {
        (this.trancheAdditionalTab2Form.get('trancheAdditionalTab2Array') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheAdditionalTab2List.push(pushListObject);
    }else if (container == '15' && val == true) {
      this.showAdditionalTab3TrancheTable = true;
      this.trancheAdditionalTab3Form = this.fb.group({
        trancheAdditionalTab3Array: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheAdditionalTab3Form.get('trancheAdditionalTab3Array') as FormArray).valueChanges.subscribe(() => {
        (this.trancheAdditionalTab3Form.get('trancheAdditionalTab3Array') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheAdditionalTab3List.push(pushListObject);
    }else if (container == '16' && val == true) {
      this.showAdditionalTab4TrancheTable = true;
      this.trancheAdditionalTab4Form = this.fb.group({
        trancheAdditionalTab4Array: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheAdditionalTab4Form.get('trancheAdditionalTab4Array') as FormArray).valueChanges.subscribe(() => {
        (this.trancheAdditionalTab4Form.get('trancheAdditionalTab4Array') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheAdditionalTab4List.push(pushListObject);
    }else if (container == '17' && val == true) {
      this.showAdditionalTab5TrancheTable = true;
      this.trancheAdditionalTab5Form = this.fb.group({
        trancheAdditionalTab5Array: this.fb.array([this.initTranche()]) // Validating the whole table Array(formArrayName)
      });
      (this.trancheAdditionalTab5Form.get('trancheAdditionalTab5Array') as FormArray).valueChanges.subscribe(() => {
        (this.trancheAdditionalTab5Form.get('trancheAdditionalTab5Array') as FormArray).controls.forEach((formGroup) => {
          if (formGroup['errors'] && formGroup['errors']['invalid']) {
            return;
          }
        });
      });
      this.trancheAdditionalTab5List.push(pushListObject);
    }else if (container == '4' && val == true) {
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
    } else if (container == '5' && val == true) {
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
    } else if (container == '6' && val == true) {
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
    } else if (container == '8' && val == true) {//coApp1
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
    } else if (container == '9' && val == true) {//coApp1
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
    } else if (container == '10' && val == true) {//coApp3
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
    } else {
      if (container == '1') {
        this.showTrancheTable = false;
        this.trancheDealerList = [];
      } else if (container == '2') {
        this.showAppTrancheTable = false;
        this.trancheAppList = [];
      } else if (container == '11') {
        this.showSellerTrancheTable = false;
        this.trancheSellerList = [];
      } else if (container == '12') {
        this.showBuyerTrancheTable = false;
        this.trancheBuyerList = [];
      } else if (container == '13') {
        this.showAdditionalTab1TrancheTable = false;
        this.trancheAdditionalTab1List = [];
      } else if (container == '14') {
        this.showAdditionalTab2TrancheTable = false;
        this.trancheAdditionalTab2List = [];
      } else if (container == '15') {
        this.showAdditionalTab3TrancheTable = false;
        this.trancheAdditionalTab3List = [];
      } else if (container == '16') {
        this.showAdditionalTab4TrancheTable = false;
        this.trancheAdditionalTab4List = [];
      } else if (container == '17') {
        this.showAdditionalTab5TrancheTable = false;
        this.trancheAdditionalTab5List = [];
      }else if (container == '4') {
        this.showBankerTrancheTable = false;
        this.trancheBankerList = [];
      } else if (container == '5') {
        this.showFinancierTrancheTable = false;
        this.trancheFinancierList = [];
      } else if (container == '6') {
        this.showThirdPartyTrancheTable = false;
        this.trancheTpList = [];
      } else if (container == '8') {
        this.showCoApp1TrancheTable = false;
        this.trancheCoApp1List = [];
      } else if (container == '9') {
        this.showCoApp2TrancheTable = false;
        this.trancheCoApp2List = [];
      } else if (container == '10') {
        this.showCoApp3TrancheTable = false;
        this.trancheCoApp3List = [];
      }

    }
  }

  selectCheckBox(flag, val) {
    this.dealerObjInfo['deductChargesFlag'] = false;
    this.applicantObjInfo['deductChargesFlag'] = false;
    this.sellerObjInfo['deductChargesFlag'] = false;
    this.buyerObjInfo['deductChargesFlag'] = false;
    this.additionalTab1ObjInfo['deductChargesFlag'] = false;
    this.additionalTab2ObjInfo['deductChargesFlag'] = false;
    this.additionalTab3ObjInfo['deductChargesFlag'] = false;
    this.additionalTab4ObjInfo['deductChargesFlag'] = false;
    this.additionalTab5ObjInfo['deductChargesFlag'] = false;
    this.coApplicant1['deductChargesFlag'] = false;
    this.coApplicant2['deductChargesFlag'] = false;
    this.coApplicant3['deductChargesFlag'] = false;
    this.bankerObjInfo['deductChargesFlag'] = false;
    this.financierObjInfo['deductChargesFlag'] = false;
    this.thirdPartyObjInfo['deductChargesFlag'] = false;


    if (val == 1 && flag) {
      this.dealerObjInfo['deductChargesFlag'] = true;
    } else if (val == 2 && flag) {
      this.applicantObjInfo['deductChargesFlag'] = true;
    } else if (val == 4 && flag) {
      this.bankerObjInfo['deductChargesFlag'] = true;
    } else if (val == 5 && flag) {
      this.financierObjInfo['deductChargesFlag'] = true;
    } else if (val == 6 && flag) {
      this.thirdPartyObjInfo['deductChargesFlag'] = true;
    } else if (val == 8 && flag) {
      this.coApplicant1['deductChargesFlag'] = true;
    } else if (val == 9 && flag) {
      this.coApplicant2['deductChargesFlag'] = true;
    } else if (val == 10 && flag) {
      this.coApplicant3['deductChargesFlag'] = true;
    } else if (val == 11 && flag) {
      this.sellerObjInfo['deductChargesFlag'] = true;
    } else if (val == 12 && flag) {
      this.buyerObjInfo['deductChargesFlag'] = true;
    } else if (val == 13 && flag) {
      this.additionalTab1ObjInfo['deductChargesFlag'] = true;
    } else if (val == 14 && flag) {
      this.additionalTab2ObjInfo['deductChargesFlag'] = true;
    } else if (val == 15 && flag) {
      this.additionalTab3ObjInfo['deductChargesFlag'] = true;
    } else if (val == 16 && flag) {
      this.additionalTab4ObjInfo['deductChargesFlag'] = true;
    } else if (val == 17 && flag) {
      this.additionalTab5ObjInfo['deductChargesFlag'] = true;
    }
    // else if (val == 7 && flag) {
    //   this.internalBTObjInfo['deductChargesFlag'] = true
    // }
  }

  selectDeferredCheckBox(flag, val) {
    if (val == 1 && flag) {
      this.dealerObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 2 && flag) {
      this.applicantObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 4 && flag) {
      this.bankerObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 5 && flag) {
      this.financierObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 6 && flag) {
      this.thirdPartyObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 8 && flag) {
      this.coApplicant1['deferredDisbursementFlag'] = true;
    } else if (val == 9 && flag) {
      this.coApplicant2['deferredDisbursementFlag'] = true;
    } else if (val == 10 && flag) {
      this.coApplicant3['deferredDisbursementFlag'] = true;
    } else if (val == 11 && flag) {
      this.sellerObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 12 && flag) {
      this.buyerObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 13 && flag) {
      this.additionalTab1ObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 14 && flag) {
      this.additionalTab2ObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 15 && flag) {
      this.additionalTab3ObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 16 && flag) {
      this.additionalTab4ObjInfo['deferredDisbursementFlag'] = true;
    } else if (val == 17 && flag) {
      this.additionalTab5ObjInfo['deferredDisbursementFlag'] = true;
    }
  }
  
  initForm() {
    //console.log(this.disburseToDealer)
    this.dealerDetailsForm = this.fb.group({
      dealerCode: new FormControl({ value: this.dealerCode }, Validators.required),
      beneficiaryName: new FormControl({ value: this.dealerObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.dealerObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.dealerObjInfo['beneficiaryBank']}, Validators.required),
      ifscCode: new FormControl({ value: this.dealerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.dealerObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.dealerObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.dealerObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.dealerObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.dealerObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.dealerObjInfo['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.dealerObjInfo['loanNumber'] }, Validators.required),
      //address:new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.dealerObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.dealerObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.appDetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.applicantObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.applicantObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.applicantObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.applicantObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.applicantObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.applicantObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.applicantObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.applicantObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.applicantObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.applicantObjInfo['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.applicantObjInfo['loanNumber'] }, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.applicantObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.applicantObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.sellerDetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.sellerObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.sellerObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.sellerObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.sellerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.sellerObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.sellerObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.sellerObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.sellerObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.sellerObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.sellerObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.sellerObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.sellerObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
  
    })
    this.buyerDetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.buyerObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.buyerObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.buyerObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.buyerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.buyerObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.buyerObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.buyerObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.buyerObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.buyerObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.buyerObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.buyerObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.buyerObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.additionalTab1DetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.additionalTab1ObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.additionalTab1ObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.additionalTab1ObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.additionalTab1ObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.additionalTab1ObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.additionalTab1ObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.additionalTab1ObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.additionalTab1ObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.additionalTab1ObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.additionalTab1ObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.additionalTab1ObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.additionalTab1ObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.additionalTab2DetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.additionalTab2ObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.additionalTab2ObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.additionalTab2ObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.additionalTab2ObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.additionalTab2ObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.additionalTab2ObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.additionalTab2ObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.additionalTab2ObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.additionalTab2ObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.additionalTab2ObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.additionalTab2ObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.additionalTab2ObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.additionalTab3DetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.additionalTab3ObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.additionalTab3ObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.additionalTab3ObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.additionalTab3ObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.additionalTab3ObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.additionalTab3ObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.additionalTab3ObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.additionalTab3ObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.additionalTab3ObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.additionalTab3ObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.additionalTab3ObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.additionalTab3ObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.additionalTab4DetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.additionalTab4ObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.additionalTab4ObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.additionalTab4ObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.additionalTab4ObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.additionalTab4ObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.additionalTab4ObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.additionalTab4ObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.additionalTab4ObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.additionalTab4ObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.additionalTab4ObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.additionalTab4ObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.additionalTab4ObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.additionalTab5DetailsForm = this.fb.group({
      beneficiaryName: new FormControl({ value: this.additionalTab5ObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.additionalTab5ObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.additionalTab5ObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.additionalTab5ObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.additionalTab5ObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.additionalTab5ObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.additionalTab5ObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.additionalTab5ObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.additionalTab5ObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.additionalTab5ObjInfo['favouringBankBranch'] }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.additionalTab5ObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.additionalTab5ObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.coAppDetailsForm = this.fb.group({
      coAppName: new FormControl({ value: this.coAppName }, Validators.required),
    })

    this.coApp1Form = this.fb.group({
      beneficiaryName: new FormControl({ value: this.coApplicant1['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.coApplicant1['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.coApplicant1['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.coApplicant1['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.coApplicant1['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.coApplicant1['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.coApplicant1['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.coApplicant1['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.coApplicant1['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.coApplicant1['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.coApplicant1['loanNumber'] }, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.coApplicant1['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.coApplicant1['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })

    this.coApp2Form = this.fb.group({
      beneficiaryName: new FormControl({ value: this.coApplicant2['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.coApplicant2['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.coApplicant2['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.coApplicant2['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.coApplicant2['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.coApplicant2['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.coApplicant2['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.coApplicant2['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.coApplicant2['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.coApplicant2['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.coApplicant2['loanNumber'] }, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.coApplicant2['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.coApplicant2['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })

    this.coApp3Form = this.fb.group({
      beneficiaryName: new FormControl({ value: this.coApplicant3['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.coApplicant3['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.coApplicant3['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.coApplicant3['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.coApplicant3['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.coApplicant3['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.coApplicant3['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.coApplicant3['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.coApplicant3['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.coApplicant3['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.coApplicant3['loanNumber'] }, Validators.required),
      //appAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.coApplicant3['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.coApplicant3['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })

    this.bankerDetailsForm = this.fb.group({
      bankerId: new FormControl({ value: this.bankerObjInfo['bankerId'] }, Validators.required),
      beneficiaryName: new FormControl({ value: this.bankerObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.bankerObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.bankerObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.bankerObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.bankerObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.bankerObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.bankerObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.bankerObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.bankerObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.bankerObjInfo['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.bankerObjInfo['loanNumber'] }, Validators.required),
      //bankerAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.bankerObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.bankerObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.financierDetailsForm = this.fb.group({
      financierId: new FormControl({ value: this.financierObjInfo['financierId'] }, Validators.required),
      beneficiaryName: new FormControl({ value: this.financierObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.financierObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.financierObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.financierObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.financierObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.financierObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.financierObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.financierObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.financierObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.financierObjInfo['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.financierObjInfo['loanNumber'] }, Validators.required),
      //financierAddress: new FormControl(''),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.financierObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.financierObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
    })
    this.thirdPartyDetailsForm = this.fb.group({
      // beneficiaryName:new FormControl(''),
      beneficiaryName: new FormControl({ value: this.thirdPartyObjInfo['beneficiaryName'] }, Validators.required),
      beneficiaryAccountNo: new FormControl({ value: this.thirdPartyObjInfo['beneficiaryAccountNo'] }, Validators.required),
      beneficiaryCNFAccountNo: new FormControl(''),
      beneficiaryBank: new FormControl({ value: this.thirdPartyObjInfo['beneficiaryBank'] }, Validators.required),
      ifscCode: new FormControl({ value: this.thirdPartyObjInfo['ifscCode']}, Validators.required),
      beneficiaryBranch: new FormControl({ value: this.thirdPartyObjInfo['beneficiaryBranch'] }, Validators.required),
      mobilePhone: new FormControl({ value: this.thirdPartyObjInfo['mobilePhone']}, Validators.required),
      instrumentType: new FormControl({ value: this.thirdPartyObjInfo['instrumentType'] }, Validators.required),
      instrumentNumber: new FormControl({ value: this.thirdPartyObjInfo['instrumentNumber'] }, Validators.required),
      instrumentDate: new FormControl('', Validators.required),
      favouringBankOfDraw: new FormControl({ value: this.thirdPartyObjInfo['favouringBankOfDraw'] }),
      favouringBankBranch: new FormControl({ value: this.thirdPartyObjInfo['favouringBankBranch'] }),
      //loanNumber: new FormControl({ value: this.thirdPartyObjInfo['loanNumber'] }, Validators.required),
      //thirdPartyAddress: new FormControl(''),
      TPdocumentJson : this.fb.group({
        documentType: [''],
        dmsDocumentId: [''],
        categoryCode: [''],
        subCategoryCode: [''] ,
        associatedId: [''],
        associatedWith: [''],
        documentId:['']
      }),
      beneficiaryAddress1: new FormControl(''),
      beneficiaryAddress2: new FormControl(''),
      beneficiaryAddress3: new FormControl(''),
      paymentMethod: new FormControl({ value: this.thirdPartyObjInfo['paymentMethod'] }, Validators.required),
      disbursementAmount: new FormControl({ value: this.thirdPartyObjInfo['disbursementAmount'] }, Validators.required),
      deductChargesFlag: new FormControl(''),
      trancheDisbursementFlag: new FormControl(''),
      deferredDisbursementFlag: new FormControl(''),
      tvrStatus: new FormControl({ value: this.thirdPartyObjInfo['tvrStatus'] }, Validators.required),
      kycIDNumber : new FormControl({ value: this.thirdPartyObjInfo['kycIDNumber'] }, Validators.required),
      kycIDType : new FormControl({ value: this.thirdPartyObjInfo['kycIDType'] }, Validators.required),
    })
    this.ibtDetailsForm = this.fb.group({
      ibtFavoringName: new FormControl({ value:'Equitas Small Finance Bank',disabled:true}),
      loanAccountNumber: new FormControl({ value: this.internalBTObjInfo['loanAccountNumber'],disabled:true }),
      principleOutstanding:new FormControl({ value: this.internalBTObjInfo['principleOutstanding'],disabled:true }),
   

    })
    this.disbursementDetailsForm = this.fb.group({
      disburseTo: new FormControl({ value: this.disburseTo }, Validators.required),
      // disburseTo:new FormControl(''),
      toDeductCharges: [''],
    })
    
    if ((this.roleType != '1' && this.roleType != '2') || this.isLoan360){
      this.disbursementDetailsForm.disable();
      this.dealerDetailsForm.disable();
      this.appDetailsForm.disable();
      this.sellerDetailsForm.disable();
      this.buyerDetailsForm.disable();
      this.additionalTab1DetailsForm.disable();
      this.additionalTab2DetailsForm.disable();
      this.additionalTab3DetailsForm.disable();
      this.additionalTab4DetailsForm.disable();
      this.additionalTab5DetailsForm.disable();
      this.coAppDetailsForm.disable();
      this.bankerDetailsForm.disable();
      this.financierDetailsForm.disable();
      this.thirdPartyDetailsForm.disable();
      this.ibtDetailsForm.disable();
      this.coApp1Form.disable();
      this.coApp2Form.disable();
      this.coApp3Form.disable();    
    }
  }
  //Enhance
  beneficiaryAccountNo(formGroup:FormGroup){
   const {value:beneficiaryAccountNo} = formGroup.get('beneficiaryAccountNo')
   const {value:beneficiaryCNFAccountNo} = formGroup.get('beneficiaryCNFAccountNo')
   return beneficiaryAccountNo === beneficiaryCNFAccountNo ? null : {accountmismatch : true}

  }
  cnfAccountNumber(formGroup:FormGroup,val,flag){
    if(val == '1'){
      if(flag){
        this.typeDeclare1 = 'text';
      }else{
        this.dealercnfAccShow = true;
        this.typeDeclare1 = 'password';
      }
    }
    if(val == '2'){
      if(flag){
        this.typeDeclare2 = 'text';
      }else{
        this.applicantcnfAccShow = true;
        this.typeDeclare2 = 'password';
      }
    }
    if(val == '3'){
      if(flag){
        this.typeDeclare3 = 'text';
      }else{
        this.coApp1cnfAccShow = true;
        this.typeDeclare3 = 'password';
      }
    }
    if(val == '4'){
      if(flag){
        this.typeDeclare4 = 'text';
      }else{
        this.coApp2cnfAccShow = true;
        this.typeDeclare4 = 'password';
      }
    }
    if(val == '5'){
      if(flag){
        this.typeDeclare5 = 'text';
      }else{
        this.coApp3cnfAccShow = true;
        this.typeDeclare5 = 'password';
      }
    }
    if(val == '6'){
      if(flag){
        this.typeDeclare6 = 'text';
      }else{
        this.bankercnfAccShow = true;
        this.typeDeclare6 = 'password';
      }
    }
    if(val == '7'){
      if(flag){
        this.typeDeclare7 = 'text';
      }else{
        this.fincnfAccShow = true;
        this.typeDeclare7 = 'password';
      }
    }
    if(val == '8'){
      if(flag){
        this.typeDeclare8 = 'text';
      }else{
        this.tpcnfAccShow = true;
        this.typeDeclare8 = 'password';
      }
    }
    if(val == '9'){
      if(flag){
        this.typeDeclare9 = 'text';
      }else{
        this.sellercnfAccShow = true;
        this.typeDeclare9 = 'password';
      }
    }
    if(val == '10'){
      if(flag){
        this.typeDeclare10 = 'text';
      }else{
        this.buyercnfAccShow = true;
        this.typeDeclare10 = 'password';
      }
    }
    if(val == '11'){
      if(flag){
        this.typeDeclare11 = 'text';
      }else{
        this.add1cnfAccShow = true;
        this.typeDeclare11 = 'password';
      }
    }
    if(val == '12'){
      if(flag){
        this.typeDeclare12 = 'text';
      }else{
        this.add2cnfAccShow = true;
        this.typeDeclare12 = 'password';
      }
    }
    if(val == '13'){
      if(flag){
        this.typeDeclare13 = 'text';
      }else{
        this.add3cnfAccShow = true;
        this.typeDeclare13 = 'password';
      }
    }
    if(val == '14'){
      if(flag){
        this.typeDeclare14 = 'text';
      }else{
        this.add4cnfAccShow = true;
        this.typeDeclare14 = 'password';
      }
    }
    if(val == '15'){
      if(flag){
        this.typeDeclare15 = 'text';
      }else{
        this.add5cnfAccShow = true;
        this.typeDeclare15 = 'password';
      }
    }
    formGroup.setValidators(this.beneficiaryAccountNo.bind(this))
  }

  saveAndUpdate(fromButton?:string) {
    console.log('roletype', this.roleType);
    let objForm={};
    let setfavouring='';
    let trancheDisbursementJson='';
    let instrumentDate = '';
    let disbursementID = '';
    this.DisbursementDetails = [];
    this.TPdocumentJson = [];
    for (let x = 0; x < this.disburseTo.length; x++) {
      if(this.disburseTo[x]=='7DISBURSETO' || this.disburseTo[x]=='3DISBURSETO'){
        continue
      }
        if(this.disburseTo[x] == '1DISBURSETO'){
            objForm = this.dealerObjInfo;
            setfavouring='Dealer';
            const dealerFormValue = this.dealerDetailsForm.getRawValue();
                if (this.trancheDealerList.length != 0) {
                dealerFormValue.trancheDisbursementJson = this.trancheDealerForm ? JSON.stringify(this.trancheDealerForm.value.trancheDealerArray) : '';
                } else {
                dealerFormValue.trancheDisbursementJson = "";
                }
                trancheDisbursementJson=dealerFormValue.trancheDisbursementJson;
                instrumentDate = dealerFormValue.instrumentDate ? this.utilityService.getDateFormat(dealerFormValue.instrumentDate) : '';
                disbursementID = this.dealerDisbursementID ? this.dealerDisbursementID : null
        }
        if(this.disburseTo[x] == '2DISBURSETO')
        {
            objForm = this.applicantObjInfo;
            setfavouring='Applicant';
            const appFormValue = this.appDetailsForm.getRawValue();
                if (this.trancheAppList.length != 0) {
                appFormValue.trancheDisbursementJson = this.trancheAppForm ? JSON.stringify(this.trancheAppForm.value.trancheAppArray) : '';
                } else {
                appFormValue.trancheDisbursementJson = "";
                }
                trancheDisbursementJson=appFormValue.trancheDisbursementJson;
                instrumentDate = appFormValue.instrumentDate ? this.utilityService.getDateFormat(appFormValue.instrumentDate) : '';
                disbursementID = this.applicantDisbursementID ? this.applicantDisbursementID : null
        }
        if(this.disburseTo[x] == '4DISBURSETO')
        {
            objForm = this.bankerObjInfo;
            setfavouring='Banker';
            const bankerFormValue = this.bankerDetailsForm.getRawValue();
                bankerFormValue.trancheDisbursementJson = this.trancheBankerForm ? JSON.stringify(this.trancheBankerForm.value.trancheBankerArray) : '';
                trancheDisbursementJson=bankerFormValue.trancheDisbursementJson;
                instrumentDate = bankerFormValue.instrumentDate ? this.utilityService.getDateFormat(bankerFormValue.instrumentDate) : '';
                disbursementID = this.bankerDisbursementID ? this.bankerDisbursementID : null
        }
        if(this.disburseTo[x] == '5DISBURSETO')
        {
            objForm = this.financierObjInfo;
            setfavouring='Financier';
            const financierFormValue = this.financierDetailsForm.getRawValue();
            financierFormValue.trancheDisbursementJson = this.trancheFinancierForm ? JSON.stringify(this.trancheFinancierForm.value.trancheFinancierArray) : '';
            trancheDisbursementJson=financierFormValue.trancheDisbursementJson;
            instrumentDate = financierFormValue.instrumentDate ? this.utilityService.getDateFormat(financierFormValue.instrumentDate) : '';
            disbursementID = this.finDisbursementID ? this.finDisbursementID : null
        }
        if(this.disburseTo[x] == '6DISBURSETO')
        {
            objForm = this.thirdPartyObjInfo;
            setfavouring='Third Party';
            const thirdPartyFormValue = this.thirdPartyDetailsForm.getRawValue();
                thirdPartyFormValue.trancheDisbursementJson = this.trancheTPForm ? JSON.stringify(this.trancheTPForm.value.trancheTpArray) : '';
                trancheDisbursementJson=thirdPartyFormValue.trancheDisbursementJson;
                instrumentDate = thirdPartyFormValue.instrumentDate ? this.utilityService.getDateFormat(thirdPartyFormValue.instrumentDate) : '';
                disbursementID = this.tpDisbursementID ? this.tpDisbursementID : null;
                
                this.TPdocumentJson.push(this.thirdPartyDetailsForm.controls.TPdocumentJson.value)
        }
        if(this.disburseTo[x] == '9DISBURSETO')
        {
            objForm = this.sellerObjInfo;
            setfavouring='Seller';
            const sellerFormValue = this.sellerDetailsForm.getRawValue();
                if (this.trancheSellerList.length != 0) {
                sellerFormValue.trancheDisbursementJson = this.trancheSellerForm ? JSON.stringify(this.trancheSellerForm.value.trancheSellerArray) : '';
                } else {
                sellerFormValue.trancheDisbursementJson = "";
                }
                trancheDisbursementJson=sellerFormValue.trancheDisbursementJson;
                instrumentDate = sellerFormValue.instrumentDate ? this.utilityService.getDateFormat(sellerFormValue.instrumentDate) : '';
                disbursementID = this.sellerDisbursementID ? this.sellerDisbursementID : null
        }
        if(this.disburseTo[x] == '8DISBURSETO')
        {
            objForm = this.buyerObjInfo;
            setfavouring='Applicant';
            const buyerFormValue = this.buyerDetailsForm.getRawValue();
                if (this.trancheBuyerList.length != 0) {
                buyerFormValue.trancheDisbursementJson = this.trancheBuyerForm ? JSON.stringify(this.trancheBuyerForm.value.trancheBuyerArray) : '';
                } else {
                buyerFormValue.trancheDisbursementJson = "";
                }
                trancheDisbursementJson=buyerFormValue.trancheDisbursementJson;
                instrumentDate = buyerFormValue.instrumentDate ? this.utilityService.getDateFormat(buyerFormValue.instrumentDate) : '';
                disbursementID = this.buyerDisbursementID ? this.buyerDisbursementID : null
        }
        if(this.disburseTo[x] == '10DISBURSETO'){
          objForm = this.additionalTab1ObjInfo;
          setfavouring='Applicant';
          const additionalTab1FormValue = this.additionalTab1DetailsForm.getRawValue();
            if (this.trancheAdditionalTab1List.length != 0) {
              additionalTab1FormValue.trancheDisbursementJson = this.trancheAdditionalTab1Form ? JSON.stringify(this.trancheAdditionalTab1Form.value.trancheAdditionalTab1Array) : '';
            } else {
              additionalTab1FormValue.trancheDisbursementJson = "";
            }
            trancheDisbursementJson=additionalTab1FormValue.trancheDisbursementJson;
            instrumentDate = additionalTab1FormValue.instrumentDate ? this.utilityService.getDateFormat(additionalTab1FormValue.instrumentDate) : '';
            disbursementID = this.additionalTab1DisbursementID ? this.additionalTab1DisbursementID : null
        }
        if(this.disburseTo[x] == '11DISBURSETO'){
          objForm = this.additionalTab2ObjInfo;
          setfavouring='Applicant';
          const additionalTab2FormValue = this.additionalTab2DetailsForm.getRawValue();
            if (this.trancheAdditionalTab2List.length != 0) {
              additionalTab2FormValue.trancheDisbursementJson = this.trancheAdditionalTab2Form ? JSON.stringify(this.trancheAdditionalTab2Form.value.trancheAdditionalTab2Array) : '';
            } else {
              additionalTab2FormValue.trancheDisbursementJson = "";
            }
            trancheDisbursementJson=additionalTab2FormValue.trancheDisbursementJson;
            instrumentDate = additionalTab2FormValue.instrumentDate ? this.utilityService.getDateFormat(additionalTab2FormValue.instrumentDate) : '';
            disbursementID = this.additionalTab2DisbursementID ? this.additionalTab2DisbursementID : null
        }
        if(this.disburseTo[x] == '12DISBURSETO'){
          objForm = this.additionalTab3ObjInfo;
          setfavouring='Applicant';
          const additionalTab3FormValue = this.additionalTab3DetailsForm.getRawValue();
            if (this.trancheAdditionalTab3List.length != 0) {
              additionalTab3FormValue.trancheDisbursementJson = this.trancheAdditionalTab3Form ? JSON.stringify(this.trancheAdditionalTab3Form.value.trancheAdditionalTab3Array) : '';
            } else {
              additionalTab3FormValue.trancheDisbursementJson = "";
            }
            trancheDisbursementJson=additionalTab3FormValue.trancheDisbursementJson;
            instrumentDate = additionalTab3FormValue.instrumentDate ? this.utilityService.getDateFormat(additionalTab3FormValue.instrumentDate) : '';
            disbursementID = this.additionalTab3DisbursementID ? this.additionalTab3DisbursementID : null
        }
        if(this.disburseTo[x] == '13DISBURSETO'){
          objForm = this.additionalTab4ObjInfo;
          setfavouring='Applicant';
          const additionalTab4FormValue = this.additionalTab4DetailsForm.getRawValue();
            if (this.trancheAdditionalTab4List.length != 0) {
              additionalTab4FormValue.trancheDisbursementJson = this.trancheAdditionalTab4Form ? JSON.stringify(this.trancheAdditionalTab4Form.value.trancheAdditionalTab4Array) : '';
            } else {
              additionalTab4FormValue.trancheDisbursementJson = "";
            }
            trancheDisbursementJson=additionalTab4FormValue.trancheDisbursementJson;
            instrumentDate = additionalTab4FormValue.instrumentDate ? this.utilityService.getDateFormat(additionalTab4FormValue.instrumentDate) : '';
            disbursementID = this.additionalTab4DisbursementID ? this.additionalTab4DisbursementID : null
        }
        if(this.disburseTo[x] == '14DISBURSETO'){
          objForm = this.additionalTab5ObjInfo;
          setfavouring='Applicant';
          const additionalTab5FormValue = this.additionalTab5DetailsForm.getRawValue();
            if (this.trancheAdditionalTab5List.length != 0) {
              additionalTab5FormValue.trancheDisbursementJson = this.trancheAdditionalTab5Form ? JSON.stringify(this.trancheAdditionalTab5Form.value.trancheAdditionalTab3Array) : '';
            } else {
              additionalTab5FormValue.trancheDisbursementJson = "";
            }
            trancheDisbursementJson=additionalTab5FormValue.trancheDisbursementJson;
            instrumentDate = additionalTab5FormValue.instrumentDate ? this.utilityService.getDateFormat(additionalTab5FormValue.instrumentDate) : '';
            disbursementID = this.additionalTab5DisbursementID ? this.additionalTab5DisbursementID : null
        }
        this.DisburseIndex = {
          leadID: this.disbLeadId,
          disbursementID: disbursementID,
          payableTo: this.disburseTo[x],
          favouring: setfavouring,
          dealerCode: this.disburseTo[x] == '1DISBURSETO' ? objForm['dealerCode'] : null,
          bankerId: this.disburseTo[x] == '4DISBURSETO' ? objForm['bankerId'] : null,
          financierId: this.disburseTo[x] == '5DISBURSETO' ? objForm['financierId'] : null,
          tvrStatus: this.disburseTo[x] == '6DISBURSETO' ? objForm['tvrStatus'] : null,
          kycIDNumber: this.disburseTo[x] == '6DISBURSETO' ? objForm['kycIDNumber'] : null,
          kycIDType: this.disburseTo[x] == '6DISBURSETO' ? objForm['kycIDType'] : null,
          beneficiaryName: objForm['beneficiaryName'],
          applicantName: objForm['beneficiaryName'],
          favouringName: objForm['beneficiaryName'],
          beneficiaryAccountNo: objForm['beneficiaryAccountNo'],
          beneficiaryBank: objForm['beneficiaryBank'],
          ifscCode: objForm['ifscCode'],
          beneficiaryBranch: objForm['beneficiaryBranch'],
          mobilePhone: objForm['mobilePhone'] ? '91' + objForm['mobilePhone'] : '',
          instrumentType: objForm['instrumentType'],
          instrumentNumber: objForm['instrumentNumber'],
          instrumentDate: instrumentDate,
          favouringBankOfDraw: objForm['favouringBankOfDraw'],
          favouringBankBranch: objForm['favouringBankBranch'],
          beneficiaryAddress1: objForm['beneficiaryAddress1'],
          beneficiaryAddress2: objForm['beneficiaryAddress2'],
          beneficiaryAddress3: objForm['beneficiaryAddress3'],
          paymentMethod: objForm['paymentMethod'],
          disbursementAmount: '' + objForm['disbursementAmount'],
          deductChargesFlag: (objForm['deductChargesFlag'] == true) ? 'Y' : 'N',
          deferredDisbursementFlag: (objForm['deferredDisbursementFlag'] == true) ? 'Y' : 'N',
          trancheDisbursementFlag: (objForm['trancheDisbursementFlag'] == true) ? 'Y' : 'N',
          trancheDisbursementJson: trancheDisbursementJson,
          documentJson: this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].dmsDocumentId.value ?  JSON.stringify(this.TPdocumentJson) : '',
          active: '1'
          }
      this.DisbursementDetails.push(this.DisburseIndex)
    }
    
    const coApp1FormValue = this.coApp1Form.getRawValue();
    if (this.trancheCoApp1List.length != 0) {
      coApp1FormValue.trancheDisbursementJson = this.trancheCoApp1Form ? JSON.stringify(this.trancheCoApp1Form.value.trancheCoApp1Array) : '';
    } else {
      coApp1FormValue.trancheDisbursementJson = "";
    }
    this.ReqCoApp1Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApp1DisbursementID ? this.coApp1DisbursementID : null,
      payableTo: '3DISBURSETO',
      favouring: 'Co Applicant',
      applicantId: this.coApplicant1['applicantId'],
      beneficiaryName: this.coApplicant1['beneficiaryName'],
      applicantName: this.coApplicant1['beneficiaryName'],
      favouringName: this.coApplicant1['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant1['beneficiaryAccountNo'],
      beneficiaryBank: this.coApplicant1['beneficiaryBank'],
      ifscCode: this.coApplicant1['ifscCode'],
      beneficiaryBranch: this.coApplicant1['beneficiaryBranch'],
      mobilePhone: this.coApplicant1['mobilePhone'] ? '91' + this.coApplicant1['mobilePhone'] : '',
      instrumentType: this.coApplicant1['instrumentType'],
      instrumentNumber: this.coApplicant1['instrumentNumber'],
      instrumentDate: coApp1FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp1FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant1['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant1['favouringBankBranch'],
      beneficiaryAddress1: this.coApplicant1['beneficiaryAddress1'],
      beneficiaryAddress2: this.coApplicant1['beneficiaryAddress2'],
      beneficiaryAddress3: this.coApplicant1['beneficiaryAddress3'],
      paymentMethod: this.coApplicant1['paymentMethod'],
      disbursementAmount: this.coApplicant1['disbursementAmount'],
      deductChargesFlag: (this.coApplicant1['deductChargesFlag'] == true) ? 'Y' : 'N',
      deferredDisbursementFlag: (this.coApplicant1['deferredDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant1['trancheDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementJson: coApp1FormValue.trancheDisbursementJson,
      active: '1'
    };
    const coApp2FormValue = this.coApp2Form.getRawValue();
    coApp2FormValue.trancheDisbursementJson = this.trancheCoApp2Form ? JSON.stringify(this.trancheCoApp2Form.value.trancheCoApp2Array) : '';
    this.ReqCoApp2Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApp2DisbursementID ? this.coApp2DisbursementID : null,
      payableTo: "3DISBURSETO",
      favouring: "Co Applicant",
      applicantId: this.coApplicant2['applicantId'],
      beneficiaryName: this.coApplicant2['beneficiaryName'],
      applicantName: this.coApplicant2['beneficiaryName'],
      favouringName: this.coApplicant2['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant2['beneficiaryAccountNo'],
      beneficiaryBank: this.coApplicant2['beneficiaryBank'],
      ifscCode: this.coApplicant2['ifscCode'],
      beneficiaryBranch: this.coApplicant2['beneficiaryBranch'],
      mobilePhone: this.coApplicant2['mobilePhone'] ? '91' + this.coApplicant2['mobilePhone'] : '',
      instrumentType: this.coApplicant2['instrumentType'],
      instrumentNumber: this.coApplicant2['instrumentNumber'],
      instrumentDate: coApp2FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp2FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant2['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant2['favouringBankBranch'],
      beneficiaryAddress1: this.coApplicant2['beneficiaryAddress1'],
      beneficiaryAddress2: this.coApplicant2['beneficiaryAddress2'],
      beneficiaryAddress3: this.coApplicant2['beneficiaryAddress3'],
      paymentMethod: this.coApplicant2['paymentMethod'],
      disbursementAmount: this.coApplicant2['disbursementAmount'],
      deductChargesFlag: (this.coApplicant2['deductChargesFlag'] == true) ? 'Y' : 'N',
      deferredDisbursementFlag: (this.coApplicant2['deferredDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant2['trancheDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementJson: coApp2FormValue.trancheDisbursementJson,
      active: '1'
    };
    const coApp3FormValue = this.coApp3Form.getRawValue();
    coApp3FormValue.trancheDisbursementJson = this.trancheCoApp3Form ? JSON.stringify(this.trancheCoApp3Form.value.trancheCoApp3Array) : '';
    this.ReqCoApp3Details = {
      leadID: this.disbLeadId,
      disbursementID: this.coApp3DisbursementID ? this.coApp3DisbursementID : null,
      payableTo: "3DISBURSETO",
      favouring: "Co Applicant",
      applicantId: this.coApplicant3['applicantId'],
      beneficiaryName: this.coApplicant3['beneficiaryName'],
      applicantName: this.coApplicant3['beneficiaryName'],
      favouringName: this.coApplicant3['beneficiaryName'],
      beneficiaryAccountNo: this.coApplicant3['beneficiaryAccountNo'],
      beneficiaryBank: this.coApplicant3['beneficiaryBank'],
      ifscCode: this.coApplicant3['ifscCode'],
      beneficiaryBranch: this.coApplicant3['beneficiaryBranch'],
      mobilePhone: this.coApplicant3['mobilePhone'] ? '91' + this.coApplicant3['mobilePhone'] : '',
      instrumentType: this.coApplicant3['instrumentType'],
      instrumentNumber: this.coApplicant3['instrumentNumber'],
      instrumentDate: coApp3FormValue.instrumentDate ? this.utilityService.getDateFormat(coApp3FormValue.instrumentDate) : '',
      favouringBankOfDraw: this.coApplicant3['favouringBankOfDraw'],
      favouringBankBranch: this.coApplicant3['favouringBankBranch'],
      beneficiaryAddress1: this.coApplicant3['beneficiaryAddress1'],
      beneficiaryAddress2: this.coApplicant3['beneficiaryAddress2'],
      beneficiaryAddress3: this.coApplicant3['beneficiaryAddress3'],
      paymentMethod: this.coApplicant3['paymentMethod'],
      disbursementAmount: this.coApplicant3['disbursementAmount'],
      deductChargesFlag: (this.coApplicant3['deductChargesFlag'] == true) ? 'Y' : 'N',
      deferredDisbursementFlag: (this.coApplicant3['deferredDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementFlag: (this.coApplicant3['trancheDisbursementFlag'] == true) ? 'Y' : 'N',
      trancheDisbursementJson: coApp3FormValue.trancheDisbursementJson,
      active: '1'
    };

    if (this.coApp1)
      this.DisbursementDetails.push(this.ReqCoApp1Details)
    if (this.coApp2)
      this.DisbursementDetails.push(this.ReqCoApp2Details)
    if (this.coApp3)
      this.DisbursementDetails.push(this.ReqCoApp3Details)

    let inputData = {
      'LeadID': this.disbLeadId,
      'UniqueSubLeadReferenceID' : this.UniqueSubLeadReferenceID,
      'DisbursementDetails' : this.DisbursementDetails
    }

    this.isDirty = true;
    if (this.disburseTo.length != 0) {
      if (this.dealerObjInfo['deductChargesFlag'] || this.applicantObjInfo['deductChargesFlag'] || this.coApplicant1['deductChargesFlag'] ||
        this.coApplicant2['deductChargesFlag'] || this.coApplicant3['deductChargesFlag'] || this.bankerObjInfo['deductChargesFlag']
        || this.financierObjInfo['deductChargesFlag'] || this.thirdPartyObjInfo['deductChargesFlag']
        || this.sellerObjInfo['deductChargesFlag'] || this.buyerObjInfo['deductChargesFlag'] || this.additionalTab1ObjInfo['deductChargesFlag']
        || this.additionalTab2ObjInfo['deductChargesFlag'] || this.additionalTab3ObjInfo['deductChargesFlag'] || this.additionalTab4ObjInfo['deductChargesFlag']
        || this.additionalTab5ObjInfo['deductChargesFlag']) {// deduct charges related // || this.internalBTObjInfo['deductChargesFlag']
        if (this.dealerDetailsForm.valid === true && this.appDetailsForm.valid === true && this.sellerDetailsForm.valid && this.buyerDetailsForm.valid &&
          this.additionalTab1DetailsForm.valid && this.additionalTab2DetailsForm.valid && this.additionalTab3DetailsForm.valid && this.additionalTab4DetailsForm.valid
           && this.additionalTab5DetailsForm.valid && this.coApp1Form.valid === true && this.coApp2Form.valid === true && this.coApp3Form.valid === true &&          
          this.bankerDetailsForm.valid === true && this.financierDetailsForm.valid === true && this.thirdPartyDetailsForm.valid === true) { // all containers check
          let trancheFlag = true;
          if (this.dealerObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheDealerForm.valid) {
              trancheFlag = false
            }
          }
          if (this.applicantObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAppForm.valid) {
              trancheFlag = false
            }
          }

          if (this.sellerObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheSellerForm.valid) {
              trancheFlag = false
            }
          }

          if (this.buyerObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheBuyerForm.valid) {
              trancheFlag = false
            }
          }
          if (this.additionalTab1ObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAdditionalTab1Form.valid) {
              trancheFlag = false
            }
          }
          if (this.additionalTab2ObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAdditionalTab2Form.valid) {
              trancheFlag = false
            }
          }
          if (this.additionalTab3ObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAdditionalTab3Form.valid) {
              trancheFlag = false
            }
          }
          if (this.additionalTab4ObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAdditionalTab4Form.valid) {
              trancheFlag = false
            }
          }
          if (this.additionalTab5ObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheAdditionalTab5Form.valid) {
              trancheFlag = false
            }
          }
          if (this.coApplicant1['trancheDisbursementFlag'] && trancheFlag) {
            //console.log('tranche',this.trancheCoApp1Form.valid)
            if (!this.trancheCoApp1Form.valid) {
              trancheFlag = false
              // this.toasterService.showError('Kindly fill mandatory fields in coApplicant1 Tranche & check other tranche tables too', '');
              // return;
            }
          }
          if (this.coApplicant2['trancheDisbursementFlag'] && trancheFlag) {
            //console.log('tranche',this.trancheCoApp2Form.valid)
            if (!this.trancheCoApp2Form.valid) {
              trancheFlag = false
              // this.toasterService.showError('Kindly fill mandatory fields in coApplicant2 Tranche & check other tranche tables too', '');
              // return;
            }
          }
          if (this.coApplicant3['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheCoApp3Form.valid) {
              trancheFlag = false
            }
          }
          if (this.bankerObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheBankerForm.valid) {
              trancheFlag = false
            }
          }
          if (this.financierObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheFinancierForm.valid) {
              trancheFlag = false
            }
          }
          if (this.thirdPartyObjInfo['trancheDisbursementFlag'] && trancheFlag) {
            if (!this.trancheTPForm.valid) {
              trancheFlag = false
            }
          }

          if (!trancheFlag) {
            this.toasterService.showError('Please fill mandatory fields in Tranche Disbursement grid', '');
            return;
          }
          let a = this.dealerObjInfo['disbursementAmount'] ? parseInt(this.dealerObjInfo['disbursementAmount']) : 0;
          let b = this.applicantObjInfo['disbursementAmount'] ? parseInt(this.applicantObjInfo['disbursementAmount']) : 0;
          let d = this.bankerObjInfo['disbursementAmount'] ? parseInt(this.bankerObjInfo['disbursementAmount']) : 0;
          let e = this.financierObjInfo['disbursementAmount'] ? parseInt(this.financierObjInfo['disbursementAmount']) : 0;
          let f = this.thirdPartyObjInfo['disbursementAmount'] ? parseInt(this.thirdPartyObjInfo['disbursementAmount']) : 0;
          let g = this.coApplicant1['disbursementAmount'] ? parseInt(this.coApplicant1['disbursementAmount']) : 0;
          let h = this.coApplicant2['disbursementAmount'] ? parseInt(this.coApplicant2['disbursementAmount']) : 0;
          let i = this.coApplicant3['disbursementAmount'] ? parseInt(this.coApplicant3['disbursementAmount']) : 0;
          let j = this.sellerObjInfo['disbursementAmount'] ? parseInt(this.sellerObjInfo['disbursementAmount']) : 0;
          let k = this.buyerObjInfo['disbursementAmount'] ? parseInt(this.buyerObjInfo['disbursementAmount']) : 0;
          let l = this.internalBTObjInfo['principleOutstanding'] ? parseInt(this.internalBTObjInfo['principleOutstanding']) : 0;
	        let m = this.additionalTab1ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab1ObjInfo['disbursementAmount']) : 0;
          let n = this.additionalTab2ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab2ObjInfo['disbursementAmount']) : 0;
          let o = this.additionalTab3ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab3ObjInfo['disbursementAmount']) : 0;
          let p = this.additionalTab4ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab4ObjInfo['disbursementAmount']) : 0;
          let q = this.additionalTab5ObjInfo['disbursementAmount'] ? parseInt(this.additionalTab5ObjInfo['disbursementAmount']) : 0;

          
          this.cumulativeAmount = a + b + d + e + f + g + h + i + j + k + l + m + n + o + p + q;
          if (this.totalDisbursementAmount != this.cumulativeAmount ) { 
            this.toasterService.showError('Total Disbursement Amount should be equal to Approved Loan Amount', '');
            return;
          }
          console.log('Req:', inputData);
          this.disbursementService.saveUpdateDisbursement(inputData).subscribe((res: any) => {
            const response = res;
            const appiyoError = response.Error;
            if (appiyoError === '0') {
              const apiError = response.ProcessVariables.error;
              if (apiError.code == '0') {
                this.toasterService.showSuccess('saved successfully', '');
                this.fetchDisbursementDetails(this.UniqueSubLeadReferenceID);  //Need to include new fun
                if (fromButton == 'next')     {
                  this.onNext(true);
                }          
                
              } else {
                this.toasterService.showError(apiError.message, '');                
              }
              console.log('saveUpdate', response.ProcessVariables)
            }
          });

        } else {
          this.toasterService.showError('Please fill all mandatory fields', '');         
        }
      } else {
        if((this.disburseTo.length == 1) && (this.disburseTo[0] == '7DISBURSETO')){
          this.toasterService.showError('Total Disbursement Amount should be equal to Approved Loan Amount', '');
        }else{
          this.toasterService.showError('Please select "from whom" deductions to be levied', '');        
        }
      }
    } else {
      this.toasterService.showError('Please select "to whom" disbursement to be done', '');     
    }

  }
  //fetchDisbursementDetails() //Neeed to include change fun
  fetchDisbursementDetails(URID) {
    this.UniqueSubLeadReferenceID = URID;
    this.disbursementService.getDisbursementDetails(this.disbLeadId,URID).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      if (appiyoError === '0') {
        console.log('fetchDisburseDetails', response)
        this.disbursementDetailsData = response.ProcessVariables;
        this.leadID = this.disbursementDetailsData.LeadID;
  this.disbursementDetailsData = response.ProcessVariables.DisbursementDetails;
  if(this.disbursementDetailsData){
        this.disburseTo = []
        if(this.disbursementDetailsData){
          this.disbursementDetailsData.CoApplicantDetails =[];
          this.disbursementDetailsData.forEach((ele) => {
            if(ele.payableTo)
            this.disburseTo.push(ele.payableTo);
            if(ele.payableTo == '1DISBURSETO')
            this.disbursementDetailsData.DealerDetails = ele
            if(ele.payableTo == '2DISBURSETO')
            this.disbursementDetailsData.ApplicantDetails = ele
            if(ele.payableTo == '3DISBURSETO')
            this.disbursementDetailsData.CoApplicantDetails.push(ele) 
            if(ele.payableTo == '4DISBURSETO')
            this.disbursementDetailsData.BankerDetails = ele
            if(ele.payableTo == '5DISBURSETO')
            this.disbursementDetailsData.FinancierDetails = ele
            if(ele.payableTo == '6DISBURSETO')
            this.disbursementDetailsData.ThirdPartyDetails = ele
            if(ele.payableTo == '9DISBURSETO')
            this.disbursementDetailsData.SellerDetails = ele
            if(ele.payableTo == '8DISBURSETO')
            this.disbursementDetailsData.BuyerDetails = ele
          });
        }
        console.log(this.disburseTo);
        console.log(this.isIBTApplicable);
        console.log(this.disbursementDetailsData);        

        if(this.isIBTApplicable){
          this.fetchDisburedFlag = true;
          this.disburseTo.push('7DISBURSETO');
        }
	      // End
        if (this.disburseTo) {
          this.flag = (this.disbursementDetailsData.ApplicantDetails) ? false : true;
          this.flagBank = (this.disbursementDetailsData.BankerDetails) ? false : true;
          this.flagFinance = (this.disbursementDetailsData.FinancierDetails) ? false : true;
          this.disburseToVal(this.disburseTo,false,'');
        }
        if (this.disbursementDetailsData.DealerDetails) {
          this.dealerObjInfo = this.disbursementDetailsData.DealerDetails;
          this.dealerDisbursementID = this.dealerObjInfo['disbursementID'];
          this.dealerCode = this.disbursementDetailsData.DealerDetails.dealerCode;
          if(this.dealerCode){
          this.onDealerCodeSearch(this.dealerCode,true,false);
          }
          this.dealerObjInfo['mobilePhone'] = this.disbursementDetailsData.DealerDetails.mobilePhone ? this.disbursementDetailsData.DealerDetails.mobilePhone.slice(2) : '';
          this.dealerObjInfo['instrumentDate'] = this.disbursementDetailsData.DealerDetails.instrumentDate;
          this.dealerDetailsForm.patchValue({ instrumentDate: (this.dealerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.dealerObjInfo['instrumentDate'])) : '' });
          this.dealerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.DealerDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.dealerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.DealerDetails.deductChargesFlag == 'Y') ? true : false;
          this.dealerObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.DealerDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.dealerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.DealerDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.DealerDetails.disbursementAmount) : null;
          //this.dealerDetailsForm.patchValue({ address: (this.disbursementDetailsData.DealerDetails)? this.disbursementDetailsData.DealerDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.DealerDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.DealerDetails.beneficiaryAddress3: null });

          this.dealerObjInfo['paymentMethod'] = this.disbursementDetailsData.DealerDetails.paymentMethod;
          if (this.dealerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.dealerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showBankDetails = true;
            //this.selectBankNameEvent(this.dealerObjInfo['beneficiaryBank'],'1')
            this.onIFSCSearch(this.dealerObjInfo['ifscCode'],'1',false);
          } else if (this.dealerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showDDDetails = true;
            this.selectBankNameEvent(this.dealerObjInfo['favouringBankOfDraw'],'10')
          } else if (this.dealerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showCASADetails = true;
          }
          if (this.dealerObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.dealerObjInfo['instrumentType'], 'dealer');
          }
          if (this.dealerObjInfo['instrumentDate']) {
            this.dealerDetailsForm.patchValue({ instrumentDate: (this.dealerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.dealerObjInfo['instrumentDate'])) : '' });
          } else {
            this.dealerDetailsForm.controls['instrumentDate'].clearValidators();
            this.dealerDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          if (this.dealerObjInfo['trancheDisbursementFlag']) {
            this.showTrancheTable = true;
            this.selectTranche(this.dealerObjInfo['trancheDisbursementFlag'], 1, true);
            let formArray = <FormArray>this.trancheDealerForm.get('trancheDealerArray');
            formArray.clear();
            this.trancheDealerList = [];
            this.trancheDealerList = JSON.parse(this.disbursementDetailsData.DealerDetails['trancheDisbursementJson']);
            this.trancheDealerList.forEach(() => {
              this.dealerTrancheDetail.push(this.initTranche());
            });
          }

        }

        if (this.disbursementDetailsData.ApplicantDetails) {
          this.applicantObjInfo = this.disbursementDetailsData.ApplicantDetails;
          this.applicantDisbursementID = this.applicantObjInfo['disbursementID'];
          this.applicantObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ApplicantDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.applicantObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ApplicantDetails.deductChargesFlag == 'Y') ? true : false;
          this.applicantObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.ApplicantDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.applicantObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ApplicantDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.ApplicantDetails.disbursementAmount) : null;
          //this.appDetailsForm.patchValue({ appAddress: (this.disbursementDetailsData.ApplicantDetails)? this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress1 +','+ this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress2 + ',' + this.disbursementDetailsData.ApplicantDetails.beneficiaryAddress3: null });

          this.applicantObjInfo['paymentMethod'] = this.disbursementDetailsData.ApplicantDetails.paymentMethod;
          if (this.applicantObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.applicantObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAppBankDetails = true;
            //this.selectBankNameEvent(this.applicantObjInfo['beneficiaryBank'],'2')
            this.onIFSCSearch(this.applicantObjInfo['ifscCode'],'2',false);
          } else if (this.applicantObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAppDDDetails = true;
            this.selectBankNameEvent(this.applicantObjInfo['favouringBankOfDraw'],'11')
          } else if (this.applicantObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAppCASADetails = true;
          }
          if (this.applicantObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.applicantObjInfo['instrumentType'], 'applicant');
          }
          if (this.applicantObjInfo['instrumentDate']) {
            this.appDetailsForm.patchValue({ instrumentDate: (this.applicantObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.applicantObjInfo['instrumentDate'])) : '' });
          } else {
            this.appDetailsForm.controls['instrumentDate'].clearValidators();
            this.appDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.applicantObjInfo['mobilePhone'] = this.disbursementDetailsData.ApplicantDetails.mobilePhone ? this.disbursementDetailsData.ApplicantDetails.mobilePhone.slice(2) : '';
          if (this.applicantObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.applicantObjInfo['trancheDisbursementFlag'], 2, true);
            let formArray = <FormArray>this.trancheAppForm.get('trancheAppArray');
            formArray.clear();
            this.trancheAppList = [];
            this.trancheAppList = JSON.parse(this.disbursementDetailsData.ApplicantDetails['trancheDisbursementJson']);
            this.trancheAppList.forEach(() => {
              this.appTrancheDetail.push(this.initTranche());
            });
          }
        }

        if (this.disbursementDetailsData.SellerDetails) {
          this.sellerObjInfo = this.disbursementDetailsData.SellerDetails;
          this.sellerDisbursementID = this.sellerObjInfo['disbursementID'];
          this.sellerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.SellerDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.sellerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.SellerDetails.deductChargesFlag == 'Y') ? true : false;
          this.sellerObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.SellerDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.sellerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.SellerDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.SellerDetails.disbursementAmount) : null;
      
          this.sellerObjInfo['paymentMethod'] = this.disbursementDetailsData.SellerDetails.paymentMethod;
          if (this.sellerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.sellerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showSellerBankDetails = true;
            //this.selectBankNameEvent(this.sellerObjInfo['beneficiaryBank'],'18')
            this.onIFSCSearch(this.sellerObjInfo['ifscCode'],'9',false);
          } else if (this.sellerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showSellerDDDetails = true;
            this.selectBankNameEvent(this.sellerObjInfo['favouringBankOfDraw'],'19')
          } else if (this.sellerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showSellerCASADetails = true;
          }
          if (this.sellerObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.sellerObjInfo['instrumentType'], 'seller');
          }
          if (this.sellerObjInfo['instrumentDate']) {
            this.sellerDetailsForm.patchValue({ instrumentDate: (this.sellerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.sellerObjInfo['instrumentDate'])) : '' });
          } else {
            this.sellerDetailsForm.controls['instrumentDate'].clearValidators();
            this.sellerDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.sellerObjInfo['mobilePhone'] = this.disbursementDetailsData.SellerDetails.mobilePhone ? this.disbursementDetailsData.SellerDetails.mobilePhone.slice(2) : '';
          if (this.sellerObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.sellerObjInfo['trancheDisbursementFlag'], 11, true);
            let formArray = <FormArray>this.trancheSellerForm.get('trancheSellerArray');
            formArray.clear();
            this.trancheSellerList = [];
            this.trancheSellerList = JSON.parse(this.disbursementDetailsData.SellerDetails['trancheDisbursementJson']);
            this.trancheSellerList.forEach(() => {
              this.sellerTrancheDetail.push(this.initTranche());
            });
          }
        }

        if (this.disbursementDetailsData.BuyerDetails) {
          this.buyerObjInfo = this.disbursementDetailsData.BuyerDetails;
          this.buyerDisbursementID = this.buyerObjInfo['disbursementID'];
          this.buyerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.BuyerDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.buyerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.BuyerDetails.deductChargesFlag == 'Y') ? true : false;
          this.buyerObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.BuyerDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.buyerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.BuyerDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.BuyerDetails.disbursementAmount) : null;
      
          this.buyerObjInfo['paymentMethod'] = this.disbursementDetailsData.BuyerDetails.paymentMethod;
          if (this.buyerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.buyerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showBuyerBankDetails = true;
            //this.selectBankNameEvent(this.buyerObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.buyerObjInfo['ifscCode'],'10',false);
          } else if (this.buyerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showBuyerDDDetails = true;
            this.selectBankNameEvent(this.buyerObjInfo['favouringBankOfDraw'],'21')
          } else if (this.buyerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showBuyerCASADetails = true;
          }
          if (this.buyerObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.buyerObjInfo['instrumentType'], 'buyer');
          }
          if (this.buyerObjInfo['instrumentDate']) {
            this.buyerDetailsForm.patchValue({ instrumentDate: (this.buyerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.buyerObjInfo['instrumentDate'])) : '' });
          } else {
            this.buyerDetailsForm.controls['instrumentDate'].clearValidators();
            this.buyerDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.buyerObjInfo['mobilePhone'] = this.disbursementDetailsData.BuyerDetails.mobilePhone ? this.disbursementDetailsData.BuyerDetails.mobilePhone.slice(2) : '';
          if (this.buyerObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.buyerObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheBuyerForm.get('trancheBuyerArray');
            formArray.clear();
            this.trancheBuyerList = [];
            this.trancheBuyerList = JSON.parse(this.disbursementDetailsData.BuyerDetails['trancheDisbursementJson']);
            this.trancheBuyerList.forEach(() => {
              this.buyerTrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.additionalTab1Details) {
          this.additionalTab1ObjInfo = this.disbursementDetailsData.additionalTab1Details;
          this.additionalTab1DisbursementID = this.additionalTab1ObjInfo['disbursementID'];
          this.additionalTab1ObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.additionalTab1Details.trancheDisbursementFlag == 'Y') ? true : false;
          this.additionalTab1ObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.additionalTab1Details.deductChargesFlag == 'Y') ? true : false;
          this.additionalTab1ObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.additionalTab1Details.deferredDisbursementFlag == 'Y') ? true : false;
          this.additionalTab1ObjInfo['disbursementAmount'] = (this.disbursementDetailsData.additionalTab1Details.disbursementAmount) ? parseInt(this.disbursementDetailsData.additionalTab1Details.disbursementAmount) : null;
      
          this.additionalTab1ObjInfo['paymentMethod'] = this.disbursementDetailsData.additionalTab1Details.paymentMethod;
          if (this.additionalTab1ObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.additionalTab1ObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAdditionalTab1BankDetails = true;
            //this.selectBankNameEvent(this.additionalTab1ObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.additionalTab1ObjInfo['ifscCode'],'11',false);
          } else if (this.additionalTab1ObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAdditionalTab1DDDetails = true;
            this.selectBankNameEvent(this.additionalTab1ObjInfo['favouringBankOfDraw'],'21')
          } else if (this.additionalTab1ObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAdditionalTab1CASADetails = true;
          }
          if (this.additionalTab1ObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.additionalTab1ObjInfo['instrumentType'], 'additionalTab1');
          }
          if (this.additionalTab1ObjInfo['instrumentDate']) {
            this.additionalTab1DetailsForm.patchValue({ instrumentDate: (this.additionalTab1ObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.additionalTab1ObjInfo['instrumentDate'])) : '' });
          } else {
            this.additionalTab1DetailsForm.controls['instrumentDate'].clearValidators();
            this.additionalTab1DetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.additionalTab1ObjInfo['mobilePhone'] = this.disbursementDetailsData.additionalTab1Details.mobilePhone ? this.disbursementDetailsData.additionalTab1Details.mobilePhone.slice(2) : '';
          if (this.additionalTab1ObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.additionalTab1ObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheAdditionalTab1Form.get('trancheAdditionalTab1Array');
            formArray.clear();
            this.trancheAdditionalTab1List = [];
            this.trancheAdditionalTab1List = JSON.parse(this.disbursementDetailsData.additionalTab1Details['trancheDisbursementJson']);
            this.trancheAdditionalTab1List.forEach(() => {
              this.additionalTab1TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.additionalTab2Details) {
          this.additionalTab2ObjInfo = this.disbursementDetailsData.additionalTab2Details;
          this.additionalTab2DisbursementID = this.additionalTab2ObjInfo['disbursementID'];
          this.additionalTab2ObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.additionalTab2Details.trancheDisbursementFlag == 'Y') ? true : false;
          this.additionalTab2ObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.additionalTab2Details.deductChargesFlag == 'Y') ? true : false;
          this.additionalTab2ObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.additionalTab2Details.deferredDisbursementFlag == 'Y') ? true : false;
          this.additionalTab2ObjInfo['disbursementAmount'] = (this.disbursementDetailsData.additionalTab2Details.disbursementAmount) ? parseInt(this.disbursementDetailsData.additionalTab2Details.disbursementAmount) : null;
      
          this.additionalTab2ObjInfo['paymentMethod'] = this.disbursementDetailsData.additionalTab2Details.paymentMethod;
          if (this.additionalTab2ObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.additionalTab2ObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAdditionalTab2BankDetails = true;
            //this.selectBankNameEvent(this.additionalTab2ObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.additionalTab2ObjInfo['ifscCode'],'12',false);
          } else if (this.additionalTab2ObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAdditionalTab2DDDetails = true;
            this.selectBankNameEvent(this.additionalTab2ObjInfo['favouringBankOfDraw'],'21')
          } else if (this.additionalTab2ObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAdditionalTab2CASADetails = true;
          }
          if (this.additionalTab2ObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.additionalTab2ObjInfo['instrumentType'], 'additionalTab2');
          }
          if (this.additionalTab2ObjInfo['instrumentDate']) {
            this.additionalTab2DetailsForm.patchValue({ instrumentDate: (this.additionalTab2ObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.additionalTab2ObjInfo['instrumentDate'])) : '' });
          } else {
            this.additionalTab2DetailsForm.controls['instrumentDate'].clearValidators();
            this.additionalTab2DetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.additionalTab2ObjInfo['mobilePhone'] = this.disbursementDetailsData.additionalTab2Details.mobilePhone ? this.disbursementDetailsData.additionalTab2Details.mobilePhone.slice(2) : '';
          if (this.additionalTab2ObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.additionalTab2ObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheAdditionalTab2Form.get('trancheAdditionalTab2Array');
            formArray.clear();
            this.trancheAdditionalTab2List = [];
            this.trancheAdditionalTab2List = JSON.parse(this.disbursementDetailsData.additionalTab2Details['trancheDisbursementJson']);
            this.trancheAdditionalTab2List.forEach(() => {
              this.additionalTab2TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.additionalTab3Details) {
          this.additionalTab3ObjInfo = this.disbursementDetailsData.additionalTab3Details;
          this.additionalTab3DisbursementID = this.additionalTab3ObjInfo['disbursementID'];
          this.additionalTab3ObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.additionalTab3Details.trancheDisbursementFlag == 'Y') ? true : false;
          this.additionalTab3ObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.additionalTab3Details.deductChargesFlag == 'Y') ? true : false;
          this.additionalTab3ObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.additionalTab3Details.deferredDisbursementFlag == 'Y') ? true : false;
          this.additionalTab3ObjInfo['disbursementAmount'] = (this.disbursementDetailsData.additionalTab3Details.disbursementAmount) ? parseInt(this.disbursementDetailsData.additionalTab3Details.disbursementAmount) : null;
      
          this.additionalTab3ObjInfo['paymentMethod'] = this.disbursementDetailsData.additionalTab3Details.paymentMethod;
          if (this.additionalTab3ObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.additionalTab3ObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAdditionalTab3BankDetails = true;
            //this.selectBankNameEvent(this.additionalTab3ObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.additionalTab3ObjInfo['ifscCode'],'13',false);
          } else if (this.additionalTab3ObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAdditionalTab3DDDetails = true;
            this.selectBankNameEvent(this.additionalTab3ObjInfo['favouringBankOfDraw'],'21')
          } else if (this.additionalTab3ObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAdditionalTab3CASADetails = true;
          }
          if (this.additionalTab3ObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.additionalTab3ObjInfo['instrumentType'], 'additionalTab3');
          }
          if (this.additionalTab3ObjInfo['instrumentDate']) {
            this.additionalTab3DetailsForm.patchValue({ instrumentDate: (this.additionalTab3ObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.additionalTab3ObjInfo['instrumentDate'])) : '' });
          } else {
            this.additionalTab3DetailsForm.controls['instrumentDate'].clearValidators();
            this.additionalTab3DetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.additionalTab3ObjInfo['mobilePhone'] = this.disbursementDetailsData.additionalTab3Details.mobilePhone ? this.disbursementDetailsData.additionalTab3Details.mobilePhone.slice(2) : '';
          if (this.additionalTab3ObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.additionalTab3ObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheAdditionalTab3Form.get('trancheAdditionalTab3Array');
            formArray.clear();
            this.trancheAdditionalTab3List = [];
            this.trancheAdditionalTab3List = JSON.parse(this.disbursementDetailsData.additionalTab3Details['trancheDisbursementJson']);
            this.trancheAdditionalTab3List.forEach(() => {
              this.additionalTab3TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.additionalTab4Details) {
          this.additionalTab4ObjInfo = this.disbursementDetailsData.additionalTab4Details;
          this.additionalTab4DisbursementID = this.additionalTab4ObjInfo['disbursementID'];
          this.additionalTab4ObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.additionalTab4Details.trancheDisbursementFlag == 'Y') ? true : false;
          this.additionalTab4ObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.additionalTab4Details.deductChargesFlag == 'Y') ? true : false;
          this.additionalTab4ObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.additionalTab4Details.deferredDisbursementFlag == 'Y') ? true : false;
          this.additionalTab4ObjInfo['disbursementAmount'] = (this.disbursementDetailsData.additionalTab4Details.disbursementAmount) ? parseInt(this.disbursementDetailsData.additionalTab4Details.disbursementAmount) : null;
      
          this.additionalTab4ObjInfo['paymentMethod'] = this.disbursementDetailsData.additionalTab4Details.paymentMethod;
          if (this.additionalTab4ObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.additionalTab4ObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAdditionalTab4BankDetails = true;
            //this.selectBankNameEvent(this.additionalTab4ObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.additionalTab4ObjInfo['ifscCode'],'14',false);
          } else if (this.additionalTab4ObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAdditionalTab4DDDetails = true;
            this.selectBankNameEvent(this.additionalTab4ObjInfo['favouringBankOfDraw'],'21')
          } else if (this.additionalTab4ObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAdditionalTab4CASADetails = true;
          }
          if (this.additionalTab4ObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.additionalTab4ObjInfo['instrumentType'], 'additionalTab4');
          }
          if (this.additionalTab4ObjInfo['instrumentDate']) {
            this.additionalTab4DetailsForm.patchValue({ instrumentDate: (this.additionalTab4ObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.additionalTab4ObjInfo['instrumentDate'])) : '' });
          } else {
            this.additionalTab4DetailsForm.controls['instrumentDate'].clearValidators();
            this.additionalTab4DetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.additionalTab4ObjInfo['mobilePhone'] = this.disbursementDetailsData.additionalTab4Details.mobilePhone ? this.disbursementDetailsData.additionalTab4Details.mobilePhone.slice(2) : '';
          if (this.additionalTab4ObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.additionalTab4ObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheAdditionalTab4Form.get('trancheAdditionalTab4Array');
            formArray.clear();
            this.trancheAdditionalTab4List = [];
            this.trancheAdditionalTab4List = JSON.parse(this.disbursementDetailsData.additionalTab4Details['trancheDisbursementJson']);
            this.trancheAdditionalTab4List.forEach(() => {
              this.additionalTab4TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.additionalTab5Details) {
          this.additionalTab5ObjInfo = this.disbursementDetailsData.additionalTab5Details;
          this.additionalTab5DisbursementID = this.additionalTab5ObjInfo['disbursementID'];
          this.additionalTab5ObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.additionalTab5Details.trancheDisbursementFlag == 'Y') ? true : false;
          this.additionalTab5ObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.additionalTab5Details.deductChargesFlag == 'Y') ? true : false;
          this.additionalTab5ObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.additionalTab5Details.deferredDisbursementFlag == 'Y') ? true : false;
          this.additionalTab5ObjInfo['disbursementAmount'] = (this.disbursementDetailsData.additionalTab5Details.disbursementAmount) ? parseInt(this.disbursementDetailsData.additionalTab5Details.disbursementAmount) : null;
      
          this.additionalTab5ObjInfo['paymentMethod'] = this.disbursementDetailsData.additionalTab5Details.paymentMethod;
          if (this.additionalTab5ObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.additionalTab5ObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showAdditionalTab5BankDetails = true;
            //this.selectBankNameEvent(this.additionalTab5ObjInfo['beneficiaryBank'],'20')
            this.onIFSCSearch(this.additionalTab5ObjInfo['ifscCode'],'15',false);
          } else if (this.additionalTab5ObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showAdditionalTab5DDDetails = true;
            this.selectBankNameEvent(this.additionalTab5ObjInfo['favouringBankOfDraw'],'21')
          } else if (this.additionalTab5ObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showAdditionalTab5CASADetails = true;
          }
          if (this.additionalTab5ObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.additionalTab5ObjInfo['instrumentType'], 'additionalTab5');
          }
          if (this.additionalTab5ObjInfo['instrumentDate']) {
            this.additionalTab5DetailsForm.patchValue({ instrumentDate: (this.additionalTab5ObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.additionalTab5ObjInfo['instrumentDate'])) : '' });
          } else {
            this.additionalTab5DetailsForm.controls['instrumentDate'].clearValidators();
            this.additionalTab5DetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.additionalTab5ObjInfo['mobilePhone'] = this.disbursementDetailsData.additionalTab5Details.mobilePhone ? this.disbursementDetailsData.additionalTab5Details.mobilePhone.slice(2) : '';
          if (this.additionalTab5ObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.additionalTab5ObjInfo['trancheDisbursementFlag'], 12, true);
            let formArray = <FormArray>this.trancheAdditionalTab5Form.get('trancheAdditionalTab5Array');
            formArray.clear();
            this.trancheAdditionalTab5List = [];
            this.trancheAdditionalTab5List = JSON.parse(this.disbursementDetailsData.additionalTab5Details['trancheDisbursementJson']);
            this.trancheAdditionalTab5List.forEach(() => {
              this.additionalTab5TrancheDetail.push(this.initTranche());
            });
          }
        }

        if (this.disbursementDetailsData.CoApplicantDetails.length != 0) {
          var fetchCoAppList = this.disbursementDetailsData.CoApplicantDetails;
          var fetchedCoApplicantList = []
          for (let i = 0; i < this.coAppNamesLov.length; i++) {
            for (let j = 0; j < fetchCoAppList.length; j++) {
              if (this.coAppNamesLov[i]['key'] == (fetchCoAppList)[j]['applicantId']) {
                fetchedCoApplicantList.push(this.coAppNamesLov[i]['serialNo'])
              }
            }
          }
          //console.log('test',fetchedCoApplicantList)        

          if (fetchedCoApplicantList.length != 0) {
            this.disbursementDetailsData.CoApplicantDetails.length
            var index = 0
            fetchedCoApplicantList.forEach(element => {
              // console.log(index)
              if (element == '1') {
                this.coApp1 = true;
                this.coApplicant1 = this.disbursementDetailsData.CoApplicantDetails[index];
                index++
              }
              else if (element == '2') {
                this.coApp2 = true;
                this.coApplicant2 = this.disbursementDetailsData.CoApplicantDetails[index];
                index++
              }
              else if (element == '3') {
                this.coApp3 = true;
                this.coApplicant3 = this.disbursementDetailsData.CoApplicantDetails[index];
                index++
              }

            });
            var setList = fetchedCoApplicantList.toString();
            this.coAppName = setList.split(",");
          }
          //console.log('fetchedCoApp',this.coAppName)  
        }
        if (this.coApp1 && this.coApplicant1) {     
          this.coApp1DisbursementID = this.coApplicant1['disbursementID'];
          this.fetchedCoApp1Data = this.coApp1DisbursementID ? true : false;
          this.coApplicant1['trancheDisbursementFlag'] = (this.coApplicant1['trancheDisbursementFlag'] == 'Y') ? true : false;
          this.coApplicant1['deductChargesFlag'] = (this.coApplicant1['deductChargesFlag'] == 'Y') ? true : false;
          this.coApplicant1['deferredDisbursementFlag'] = (this.coApplicant1['deferredDisbursementFlag'] == 'Y') ? true : false;
          if (this.coApplicant1['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant1['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showCoApp1BankDetails = true;
           //this.selectBankNameEvent(this.coApplicant1['beneficiaryBank'],'3')
           this.onIFSCSearch(this.coApplicant1['ifscCode'],'3',false);
          } else if (this.coApplicant1['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showCoApp1DDDetails = true;
            this.selectBankNameEvent(this.coApplicant1['favouringBankOfDraw'],'12')
          } else if (this.coApplicant1['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showCoApp1CASADetails = true;
          }
          if (this.coApplicant1['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.coApplicant1['instrumentType'], 'coApp1');
          }
          if (this.coApplicant1['instrumentDate']) {
            this.coApp1Form.patchValue({ instrumentDate: (this.coApplicant1['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant1['instrumentDate'])) : null });
          } else {
            this.coApp1Form.controls['instrumentDate'].clearValidators();
            this.coApp1Form.controls['instrumentDate'].setErrors(null);
          }
          this.coApplicant1['mobilePhone'] = this.coApplicant1['mobilePhone'] ? this.coApplicant1['mobilePhone'].slice(2) : '';
          if (this.coApplicant1['trancheDisbursementFlag']) {
            this.selectTranche(this.coApplicant1['trancheDisbursementFlag'], 8, true);
            let formArray = <FormArray>this.trancheCoApp1Form.get('trancheCoApp1Array');
            formArray.clear();
            this.trancheCoApp1List = [];
            this.trancheCoApp1List = JSON.parse(this.coApplicant1['trancheDisbursementJson']);
            this.trancheCoApp1List.forEach(() => {
              this.coApp1TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.coApp2 && this.coApplicant2) {
          this.coApp2DisbursementID = this.coApplicant2['disbursementID'];
          this.fetchedCoApp2Data = this.coApp2DisbursementID ? true : false;
          this.coApplicant2['trancheDisbursementFlag'] = (this.coApplicant2['trancheDisbursementFlag'] == 'Y') ? true : false;
          this.coApplicant2['deductChargesFlag'] = (this.coApplicant2['deductChargesFlag'] == 'Y') ? true : false;
          this.coApplicant2['deferredDisbursementFlag'] = (this.coApplicant2['deferredDisbursementFlag'] == 'Y') ? true : false;
          if (this.coApplicant2['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant2['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showCoApp2BankDetails = true;
            //this.selectBankNameEvent(this.coApplicant2['beneficiaryBank'],'4')
            this.onIFSCSearch(this.coApplicant2['ifscCode'],'4',false);
          } else if (this.coApplicant2['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showCoApp2DDDetails = true;
            this.selectBankNameEvent(this.coApplicant2['favouringBankOfDraw'],'13')
          } else if (this.coApplicant2['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showCoApp2CASADetails = true;
          }
          if (this.coApplicant2['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.coApplicant2['instrumentType'], 'coApp2');
          }
          if (this.coApplicant2['instrumentDate']) {
            this.coApp2Form.patchValue({ instrumentDate: (this.coApplicant2['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant2['instrumentDate'])) : null });
          } else {
            this.coApp2Form.controls['instrumentDate'].clearValidators();
            this.coApp2Form.controls['instrumentDate'].setErrors(null);
          }
          this.coApplicant2['mobilePhone'] = this.coApplicant2['mobilePhone'] ? this.coApplicant2['mobilePhone'].slice(2) : '';
          if (this.coApplicant2['trancheDisbursementFlag']) {
            this.selectTranche(this.coApplicant2['trancheDisbursementFlag'], 9, true);
            let formArray = <FormArray>this.trancheCoApp2Form.get('trancheCoApp2Array');
            formArray.clear();
            this.trancheCoApp2List = [];
            this.trancheCoApp2List = JSON.parse(this.coApplicant2['trancheDisbursementJson']);
            this.trancheCoApp2List.forEach(() => {
              this.coApp2TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.coApp3 && this.coApplicant3) { 
          this.coApp3DisbursementID = this.coApplicant3['disbursementID'];
          this.fetchedCoApp3Data = this.coApp3DisbursementID ? true : false;
          this.coApplicant3['trancheDisbursementFlag'] = (this.coApplicant3['trancheDisbursementFlag'] == 'Y') ? true : false;
          this.coApplicant3['deductChargesFlag'] = (this.coApplicant3['deductChargesFlag'] == 'Y') ? true : false;
          this.coApplicant3['deferredDisbursementFlag'] = (this.coApplicant3['deferredDisbursementFlag'] == 'Y') ? true : false;
          if (this.coApplicant3['paymentMethod'] == '7MODEOFPAYMENT' || this.coApplicant3['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showCoApp3BankDetails = true;
            //this.selectBankNameEvent(this.coApplicant3['beneficiaryBank'],'5')
            this.onIFSCSearch(this.coApplicant3['ifscCode'],'5',false);
          } else if (this.coApplicant3['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showCoApp3DDDetails = true;
            this.selectBankNameEvent(this.coApplicant3['favouringBankOfDraw'],'14')
          } else if (this.coApplicant3['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showCoApp3CASADetails = true;
          }
          if (this.coApplicant3['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.coApplicant3['instrumentType'], 'coApp3');
          }
          if (this.coApplicant3['instrumentDate']) {
            this.coApp3Form.patchValue({ instrumentDate: (this.coApplicant3['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.coApplicant3['instrumentDate'])) : null });
          } else {
            this.coApp3Form.controls['instrumentDate'].clearValidators();
            this.coApp3Form.controls['instrumentDate'].setErrors(null);
          }
          this.coApplicant3['mobilePhone'] = this.coApplicant3['mobilePhone'] ? this.coApplicant3['mobilePhone'].slice(2) : '';
          if (this.coApplicant3['trancheDisbursementFlag']) {
            this.selectTranche(this.coApplicant3['trancheDisbursementFlag'], 10, true);
            let formArray = <FormArray>this.trancheCoApp3Form.get('trancheCoApp3Array');
            formArray.clear();
            this.trancheCoApp3List = [];
            this.trancheCoApp3List = JSON.parse(this.coApplicant3['trancheDisbursementJson']);
            this.trancheCoApp3List.forEach(() => {
              this.coApp3TrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.BankerDetails) {
          this.bankerObjInfo = this.disbursementDetailsData.BankerDetails;
          this.bankerDisbursementID = this.bankerObjInfo['disbursementID'];
          this.bankerObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.BankerDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.bankerObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.BankerDetails.deductChargesFlag == 'Y') ? true : false;
          this.bankerObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.BankerDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.bankerObjInfo['disbursementAmount'] = (this.disbursementDetailsData.BankerDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.BankerDetails.disbursementAmount) : null;

          this.bankerObjInfo['paymentMethod'] = this.disbursementDetailsData.BankerDetails.paymentMethod;
          if (this.bankerObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.bankerObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showBankerBankDetails = true;
            //this.selectBankNameEvent(this.bankerObjInfo['beneficiaryBank'],'6')
            this.onIFSCSearch(this.bankerObjInfo['ifscCode'],'6',false);
          } else if (this.bankerObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showBankerDDDetails = true;
            this.selectBankNameEvent(this.bankerObjInfo['favouringBankOfDraw'],'15')
          } else if (this.bankerObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showBankerCASADetails = true;
          }
          if (this.bankerObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.bankerObjInfo['instrumentType'], 'banker');
          }
          if (this.bankerObjInfo['instrumentDate']) {
            this.bankerDetailsForm.patchValue({ instrumentDate: (this.bankerObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.bankerObjInfo['instrumentDate'])) : '' });
          } else {
            this.bankerDetailsForm.controls['instrumentDate'].clearValidators();
            this.bankerDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.bankerObjInfo['mobilePhone'] = this.disbursementDetailsData.BankerDetails.mobilePhone ? this.disbursementDetailsData.BankerDetails.mobilePhone.slice(2) : '';
          if (this.bankerObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.bankerObjInfo['trancheDisbursementFlag'], 4, true);
            let formArray = <FormArray>this.trancheBankerForm.get('trancheBankerArray');
            formArray.clear();
            this.trancheBankerList = [];
            this.trancheBankerList = JSON.parse(this.disbursementDetailsData.BankerDetails['trancheDisbursementJson']);
            this.trancheBankerList.forEach(() => {
              this.bankerTrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.FinancierDetails) {
          this.financierObjInfo = this.disbursementDetailsData.FinancierDetails;
          this.finDisbursementID = this.financierObjInfo['disbursementID'];
          this.financierObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.FinancierDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.financierObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.FinancierDetails.deductChargesFlag == 'Y') ? true : false;
          this.financierObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.FinancierDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.financierObjInfo['disbursementAmount'] = (this.disbursementDetailsData.FinancierDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.FinancierDetails.disbursementAmount) : null;

          this.financierObjInfo['paymentMethod'] = this.disbursementDetailsData.FinancierDetails.paymentMethod;
          if (this.financierObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.financierObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showFinBankDetails = true;
            //this.selectBankNameEvent(this.financierObjInfo['beneficiaryBank'],'7')
            this.onIFSCSearch(this.financierObjInfo['ifscCode'],'7',false);
          } else if (this.financierObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showFinDDDetails = true;
            this.selectBankNameEvent(this.financierObjInfo['favouringBankOfDraw'],'16')
          } else if (this.financierObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showFinCASADetails = true;
          }
          if (this.financierObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.financierObjInfo['instrumentType'], 'financier');
          }
          if (this.financierObjInfo['instrumentDate']) {
            this.financierDetailsForm.patchValue({ instrumentDate: (this.financierObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.financierObjInfo['instrumentDate'])) : '' });
          } else {
            this.financierDetailsForm.controls['instrumentDate'].clearValidators();
            this.financierDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.financierObjInfo['mobilePhone'] = this.disbursementDetailsData.FinancierDetails.mobilePhone ? this.disbursementDetailsData.FinancierDetails.mobilePhone.slice(2) : '';
          if (this.financierObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.financierObjInfo['trancheDisbursementFlag'], 5, true);
            let formArray = <FormArray>this.trancheFinancierForm.get('trancheFinancierArray');
            formArray.clear();
            this.trancheFinancierList = [];
            this.trancheFinancierList = JSON.parse(this.disbursementDetailsData.FinancierDetails['trancheDisbursementJson']);
            this.trancheFinancierList.forEach(() => {
              this.financierTrancheDetail.push(this.initTranche());
            });
          }
        }
        if (this.disbursementDetailsData.ThirdPartyDetails) {
          this.thirdPartyObjInfo = this.disbursementDetailsData.ThirdPartyDetails;
          this.tpDisbursementID = this.thirdPartyObjInfo['disbursementID'];
          this.thirdPartyObjInfo['trancheDisbursementFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.trancheDisbursementFlag == 'Y') ? true : false;
          this.thirdPartyObjInfo['deductChargesFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.deductChargesFlag == 'Y') ? true : false;
          this.thirdPartyObjInfo['deferredDisbursementFlag'] = (this.disbursementDetailsData.ThirdPartyDetails.deferredDisbursementFlag == 'Y') ? true : false;
          this.thirdPartyObjInfo['disbursementAmount'] = (this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount) ? parseInt(this.disbursementDetailsData.ThirdPartyDetails.disbursementAmount) : null;

          this.thirdPartyObjInfo['paymentMethod'] = this.disbursementDetailsData.ThirdPartyDetails.paymentMethod;
          if (this.thirdPartyObjInfo['paymentMethod'] == '7MODEOFPAYMENT' || this.thirdPartyObjInfo['paymentMethod'] == '8MODEOFPAYMENT') {
            this.showTPBankDetails = true;
            //this.selectBankNameEvent(this.thirdPartyObjInfo['beneficiaryBank'],'8')
            this.onIFSCSearch(this.thirdPartyObjInfo['ifscCode'],'8',false);
          } else if (this.thirdPartyObjInfo['paymentMethod'] == '1MODEOFPAYMENT') {
            this.showTPDDDetails = true;
            this.selectBankNameEvent(this.thirdPartyObjInfo['favouringBankOfDraw'],'17')
          } else if (this.thirdPartyObjInfo['paymentMethod'] == '2MODEOFPAYMENT') {
            this.showTPCASADetails = true;
          }
          if (this.thirdPartyObjInfo['instrumentType'] == '1INSTYPE') {
            this.setIntType(this.thirdPartyObjInfo['instrumentType'], 'thirdParty');
          }
          if (this.thirdPartyObjInfo['instrumentDate']) {
            this.thirdPartyDetailsForm.patchValue({ instrumentDate: (this.thirdPartyObjInfo['instrumentDate']) ? new Date(this.utilityService.getDateFromString(this.thirdPartyObjInfo['instrumentDate'])) : '' });
          } else {
            this.thirdPartyDetailsForm.controls['instrumentDate'].clearValidators();
            this.thirdPartyDetailsForm.controls['instrumentDate'].setErrors(null);
          }
          this.thirdPartyObjInfo['mobilePhone'] = this.disbursementDetailsData.ThirdPartyDetails.mobilePhone ? this.disbursementDetailsData.ThirdPartyDetails.mobilePhone.slice(2) : '';
          if (this.thirdPartyObjInfo['trancheDisbursementFlag']) {
            this.selectTranche(this.thirdPartyObjInfo['trancheDisbursementFlag'], 6, true);
            let formArray = <FormArray>this.trancheTPForm.get('trancheTpArray');
            formArray.clear();
            this.trancheTpList = [];
            this.trancheTpList = JSON.parse(this.disbursementDetailsData.ThirdPartyDetails['trancheDisbursementJson']);
            this.trancheTpList.forEach(() => {
              this.tpTrancheDetail.push(this.initTranche());
            });
          }
          let x = this.disbursementDetailsData.ThirdPartyDetails['documentJson'];
          this.TPdocumentJson = x ? JSON.parse(this.disbursementDetailsData.ThirdPartyDetails['documentJson']) : '';
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].dmsDocumentId.patchValue(x ? this.TPdocumentJson[0].dmsDocumentId : null);
          this.thirdPartyDetailsForm['controls']['TPdocumentJson']['controls'].documentId.patchValue(x ? this.TPdocumentJson[0].documentId : null)
        }
      }else{
        this.disburseToVal(this.disburseTo,false,'');
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
 onNext(status?:boolean) {   
  if (this.isLoan360) {
    return this.router.navigateByUrl(`pages/dde/${this.disbLeadId}/negotiation`);
  }
  if(this.roleType == '1' && status == true) {    
    this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/sanction-details`]);
  } else if (this.roleType == '2' && status == true) {
    // this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/term-sheet`]);
    this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/cam`]);
  } else if( this.roleType == '4' ) {
    this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/check-list`]);
  } else if(  this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.disbLeadId}/welomce-letter`]);
  }
  else if( this.roleType == '7') {
    this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/check-list`]);
  }
}
  routerUrlIdentifier() {
    if (this.router.url.includes('disbursement')) {
      this.showSaveButton = true;
    }
  }
  onBack() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.disbLeadId}/deviations`);
    }
    // this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/negotiation`]);
    if (this.roleType == '1' || this.roleType == '2') {
      this.router.navigate([`pages/credit-decisions/${this.disbLeadId}/negotiation`]);
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/negotiation`]);
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.disbLeadId}/check-list`]);
    }
    else if (this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.disbLeadId}/negotiation`]);
    }
  }

sendLoanCreationWrapper() {
  const body = {
    leadId: this.disbLeadId
  }
  this.loanCreationService.setLoanCreation(body).subscribe((res: any) => {
    
    // tslint:disable-next-line: triple-equals
    if (res.ProcessVariables.error.code == '0') {
      this.toasterService.showSuccess('Lead submitted For Loan Creation', '');
      this.router.navigate([`pages/dashboard`]);
    } else {
      this.toasterService.showError(res.ProcessVariables.error.message, '');
    }
  });
}
}
