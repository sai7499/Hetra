import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { UploadService } from '@services/upload.service';
import { DraggableContainerService } from '@services/draggable.service';
import { UtilityService } from '@services/utility.service';
import { DisbursementService } from '../services/disbursement.service';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { Constant } from '../../../../assets/constants/constant';
import { SharedService } from '@shared/shared-service/shared-service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-tranche-disburse',
  templateUrl: './tranche-disburse.component.html',
  styleUrls: ['./tranche-disburse.component.css']
})
export class TrancheDisburseComponent implements OnInit {
  reqTask:any;
  trancheDisbJson: any;
  taskId:any;
  labels: any = {};
  leadId: number;
  userId: string;
  pendingTDForm: any;
  earlierTDForm: any;
  isDirty = false;
  applicantResponse: any;
  pendingChildgroups = [];
  earlierChildgroups = [];
  documentArr: DocumentDetails[] = [];
  public toDayDate: Date = new Date();
  public disbursementDate: Date = new Date();
  showDisburseModal: boolean;
  disburseToLov: any;
  financierLov: any;
  paymentLov: any;
  trancheDisbLov: any;
  instrumentTypeLov: any;
  selectedDocDetails: DocRequest;
  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;
  showModal: boolean;
  SELFIE_IMAGE: string;
  LoanDetails: Object = {};
  loanNumber: number;
  loanAccountNumber: any;
  TDDisbursedTranches: any;
  TDPendingTranches: any;
  disbursementDetailsdata = [];
  disburseDetaile: any;
  disbursementData: Object = {};
  modeOfPayment: any;
  tranchDisburseIDJSON: any;
  branchId: any;
  roleId: any;
  roleType: any;
  branchName: any;
  showInitiatedTranche: any;
  newTrancheData: any[];
  submitReqData: any[];
  reqData: any;
  remarks:any;
  isReversed: any;
  reversedtranceJson: any;
  documentListModal = false;
  statusModal = false;
  statusFlag = '';
  reverseFlag: boolean;
  DisbursementLog: any;
  isFailed: boolean;
  payableToData: any;
  message:any;
  udfScreenId: any;
  constructor(
    private labelsData: LabelsService,
    public router: Router,
    private aRoute: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private uploadService: UploadService,
    private draggableContainerService: DraggableContainerService,
    private utilityService: UtilityService,
    private disbursementService: DisbursementService,
    private sharedService: SharedService,
    private loginStoreService: LoginStoreService,
  ) {
    // this.aRoute.parent.params.subscribe(value => this.leadId = Number(value.leadId))
    this.leadId = this.aRoute.snapshot.params['leadId'];
    this.sharedService.taskId$.subscribe((value) => {
      this.taskId = value;
      console.log('in ref check task id', this.taskId);
    });
  }

  ngOnInit() {
    this.sharedService.taskId$.subscribe(
      (value) => (this.taskId = value)
    );
    this.sharedService.loanNumber$.subscribe(
      (value) => (this.loanAccountNumber = value)
    );
    this.getLoanNumber();
    this.disbLOV();
    this.getLabels();
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.branchId = value.branchId;
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    this.branchId = roleAndUserDetails.userDetails.branchId;
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.userId = localStorage.getItem('userId');
    this.pendingTDForm = this.formBuilder.group({
      PendingTranches: this.formBuilder.array(this.pendingChildgroups),
    })
    this.earlierTDForm = this.formBuilder.group({
      DisbursedTranches: this.formBuilder.array(this.earlierChildgroups),
    })

    
    this.getTDDetails();
    if (this.roleType != '1'){
      this.pendingTDForm.disable();
      this.earlierTDForm.disable();
      }

      this.labelsData.getScreenId().subscribe((data) => {
        let udfScreenId = data.ScreenIDS;
  
        this.udfScreenId = this.roleType != '1' ? udfScreenId.sales.trancheDisbursementSales : udfScreenId.CPCChecker.trancheDisbursementCPCChecker ;
  
      })  
  }
  
  //getting leadID from Tranche Disburse Dashboard 
  getLoanNumber() {
    return new Promise((resolve, reject) => {
      this.aRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          let routePram = value.leadId.split('-');
          this.loanAccountNumber = Number(routePram[0]);
          if(routePram[1]){
             this.taskId = routePram[1]; 
          }
        }
        resolve(null);
      });
    });
  }
  disbLOV() {
    this.disbursementService
      .getDisbLOV()
      .subscribe((res: any) => {
        if (res.Error == '0') {
          var resData = res.ProcessVariables;
          console.log('LOVDATA', resData)
          this.disburseToLov = resData.DisburseTo;
          this.financierLov = resData.FinancierLOV;
          this.paymentLov = resData.PaymentMethod;
          this.trancheDisbLov = resData.TrancheDisbType;
          this.instrumentTypeLov = resData.InstrumentType;
        }

      });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      (error) => console.log(error)
    );
  }

  getDocumentList(tranche_id) {
    this.documentArr = [];
    this.uploadService
    .getDocumentDetails(parseInt(tranche_id), 3)
    .subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
       this.documentArr = processVariables.documentDetails;
     })

        if(this.documentArr){
          this.documentListModal = true;
        }else{
        }
  }

  private getPendingDocumentDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        isReversed:[''],
        isSubmitted: [''],
        payable_to: [''],
        applicant_name: [''],
        tranche_disbursement_type: [''],
        tranche_disbursement_amount: [''],
        paymentMode: [''],
        instrument_number: [''],
        serialno : [''],
        tranche_id: [''],
        chequeHandOverDate: [''],
        isInitiated: [''],
        alreadyInitiated: [''],
        disbursement_id: [''],
        tranche_disbursement_id: ['']
      });
    } else {
      return this.formBuilder.group({
        isReversed: data.isReversed ? data.isReversed : false,
        isSubmitted: data.isSubmitted ? data.isSubmitted : false,
        payable_to: data.payable_to ? data.payable_to : null,
        applicant_name: (data.applicant_name ? data.applicant_name : null),
        tranche_disbursement_type: [data.tranche_disbursement_type ? data.tranche_disbursement_type : null, [Validators.required]],
        tranche_disbursement_amount: data.tranche_disbursement_amount ? data.tranche_disbursement_amount : null,
        paymentMode: data.paymentMode ? data.paymentMode : null,
        instrument_number: data.instrument_number ? data.instrument_number : null,
        serialno: data.serialno ? data.serialno : null,
        tranche_id: data.tranche_id ? data.tranche_id : null,
        chequeHandOverDate: [{ value: data.chequeHandOverDate ? this.utilityService.getDateFromString(data.chequeHandOverDate) : null, disabled: (data.paymentMode != '1MODEOFPAYMENT' || this.roleType == '4' || this.roleType == '5') }],
        isInitiated: data.isInitiated ? data.isInitiated : false,
        alreadyInitiated: data.alreadyInitiated ? data.alreadyInitiated : false,
        disbursement_id: data.disbursement_id ? data.disbursement_id : null,
        tranche_disbursement_id: data.tranche_disbursement_id ? data.tranche_disbursement_id : null
      });
    }
  }

  private getEarlierTDDocumentDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        payable_to: [''],
        applicant_name: [''],
        tranche_disbursement_type: [''],
        tranche_disbursement_amount: [''],
        actual_disbursement_date: [''],
        actual_disbursement_status: [''],
        tranche_id: [''],
        initiated_by: [''],
        authorized_by: ['']
      });
    } else {
      return this.formBuilder.group({
        payable_to: data.payable_to ? data.payable_to : null,
        applicant_name: (data.applicant_name ? data.applicant_name : null),
        tranche_disbursement_type: data.tranche_disbursement_type ? data.tranche_disbursement_type : null,
        tranche_disbursement_amount: data.tranche_disbursement_amount ? data.tranche_disbursement_amount : null,
        tranche_id: data.tranche_id ? data.tranche_id : null,
        actual_disbursement_status: data.actual_disbursement_status ? data.actual_disbursement_status : null,
        actual_disbursement_date: [data.actual_disbursement_date ? new Date(this.utilityService.getNewDateFormat(data.actual_disbursement_date)) : null, { disabled: true }],
        initiated_by: data.initiated_by ? data.initiated_by : null,
        authorized_by: data.authorized_by ? data.authorized_by : null,
      });
    }
  }

  getTDDetails() {
    if(this.taskId){
      this.reqTask = '2';
      this.reqData = {
        "taskId": this.taskId
      }
    } else {
      this.reqTask = '1';
      this.reqData = {
        "loanAccountNumber": this.loanAccountNumber
      }
    }
    this.disbursementService.getTDDetails(this.reqData,this.reqTask).subscribe((res: any) => {
      this.LoanDetails = res.ProcessVariables.LoanDetails;
      this.TDDisbursedTranches = res.ProcessVariables.DisbursedTranches;
      this.TDPendingTranches = res.ProcessVariables.PendingTranches;
      this.trancheDisbJson = res.ProcessVariables.trancheDisbJson;
      this.reversedtranceJson = [];
      if(this.TDPendingTranches){
        this.TDPendingTranches.forEach(ele => {
          if(ele.isReversed == true){
           this.reversedtranceJson.push(ele)
          }
         });
      }
      this.isReversed = this.reversedtranceJson.length > 0 ? true : false;
      let pendingChildgroups = [];
      if (this.TDPendingTranches && this.TDPendingTranches.length > 0) {
        for (let i = 0; i < this.TDPendingTranches.length; i++) {
          pendingChildgroups.push(this.getPendingDocumentDetails(this.TDPendingTranches[i]));
        }
        this.pendingTDForm = this.formBuilder.group({
          PendingTranches: this.formBuilder.array(pendingChildgroups),
        })
      }

      let earlierChildgroups = []
      if (this.TDDisbursedTranches && this.TDDisbursedTranches.length > 0) {
        for (let i = 0; i < this.TDDisbursedTranches.length; i++) {
          earlierChildgroups.push(this.getEarlierTDDocumentDetails(this.TDDisbursedTranches[i]));
        }
        this.earlierTDForm = this.formBuilder.group({
          DisbursedTranches: this.formBuilder.array(earlierChildgroups),
        })
      }
    })

  }

  onUpdate() {
    // stop here if form is invalid
    if (this.pendingTDForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'Tranche Disbursement Details'
      );
      return;
    } else {
      //Converte Date 
      this.pendingTDForm.value.PendingTranches.forEach(ele => {
        if (ele.chequeHandOverDate != null) {
          ele.chequeHandOverDate = this.utilityService.convertDateTimeTOUTC(
            ele.chequeHandOverDate,
            'DD/MM/YYYY'
          );
        }
      });
      //Validating for send Req Only Selected trnacDisbursements
      this.newTrancheData = []
      this.pendingTDForm.value.PendingTranches.forEach(ele => {
       // if (!ele.alreadyInitiated) {
          if (ele.isInitiated == true) {
            this.newTrancheData.push(ele)
          }
       // }
      });
      this.submitReqData = this.newTrancheData;
      //Start Constructing Tranche disburse Request
      const reqTranchJSON = []
      this.pendingTDForm.value.PendingTranches.forEach(ele => {
        //if (!ele.alreadyInitiated) {
          if (ele.isInitiated == true) {
            reqTranchJSON.push({
              disbursementID: ele.disbursement_id,
              trancheDisbIDs: ele.tranche_disbursement_id
            })
          }
       // }
      });
      this.tranchDisburseIDJSON = reqTranchJSON;
      var seen = {};
      this.tranchDisburseIDJSON = this.tranchDisburseIDJSON.filter(function (entry) {
        var previous;
        if (seen.hasOwnProperty(entry.disbursementID)) {
          previous = seen[entry.disbursementID];
          previous.trancheDisbIDs.push(entry.trancheDisbIDs);
          return false;
        }
        if (!Array.isArray(entry.trancheDisbIDs)) {
          entry.trancheDisbIDs = [entry.trancheDisbIDs];
        }
        seen[entry.disbursementID] = entry;
        return true;
      });
      //console.log(JSON.stringify(this.tranchDisburseIDJSON, null, 2), "pre");
      //End Constructing Tranche disburse Request

      const body = {
        "LoanDetails": {
          "applicantName": this.LoanDetails['applicantName'],
          "loanAmount": this.LoanDetails['loanAmount'],
          "productCatCode": this.LoanDetails['productCatCode'],
          "productName": this.LoanDetails['productName']
        },
        "SubmitedTranches": this.submitReqData,
        "TrancheDisbDetails": {
          "leadID": this.LoanDetails['leadID'],
          "loanAccountNumber": this.LoanDetails['loanAccountNumber'],
          "branchID": this.branchId,
          "branchName": this.branchName,
          "trancheDisbDetails": this.tranchDisburseIDJSON ? JSON.stringify(this.tranchDisburseIDJSON) : ''
        },
        "trancheDisbJson": this.isReversed && this.roleType == '1' ? this.trancheDisbJson : '',
        "taskId": this.roleType == '1' && this.taskId ? this.taskId : ''
      }
      console.log(body)
      this.disbursementService.submitToMaker(body).subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        if (appiyoError === '0') {
          if (res && res.ProcessVariables.error.code == '0') {
            if(this.roleType == '1' && this.taskId){
              this.callStartAndComplete(this.taskId,this.remarks,'Resubmit')
            }
            if (!res.ProcessVariables.InitiatedTranches) {
              this.toasterService.showSuccess(
                'Submited Successfully',
                'Tranche Disbursement Details'
              );
              // this.getTDDetails()
              this.navigateToDashboard();
            }
          } else if (res && res.ProcessVariables.error.code == '1') {
            this.toasterService.showError(res.ProcessVariables.error.message, '');
            this.showInitiatedTranche = res.ProcessVariables.InitiatedTranches;
          }
        }

      });
    }
  }

  deleteDocument(documentId) {
    this.uploadService
    .softDeleteDocument(documentId)
    .subscribe((value: any) => {
      if (value.Error !== '0') {
        return;
      }})
      this.toasterService.showSuccess('Document deleted successfully', '');
      for (var i = this.documentArr.length - 1; i >= 0; --i) {
        if (this.documentArr[i].documentId == documentId) {
          this.documentArr.splice(i,1);
        }
       }
    }

  uploadDocument(tranche_id,event) {
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
      docsTypeForString: "selfie",
      docRefId: [
        {
          idTp: 'LEDID',
          id: this.LoanDetails['leadID']
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
      associatedId:tranche_id,
      associatedWith:'3'
      
    };
  }

  navigateToDashboard(){
    this.router.navigate([`/pages/dashboard`]);
  }

  async onUploadSuccess(i, event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    const data = {
      inputValue: event.imageUrl,
      isPhoto: true,
      applicantId: "8bfa8dba945b11eabdcaf2fa9bec3d63",
    };
    // this.uploadPhotoOrSignature(data);

    event.imageUrl = '';

    // let index = 0;
    // if (this.documentArr.length === 0) {
    //   this.documentArr.push(event);
    //   index = 0;
    // }
    console.log('documentArr', this.documentArr);
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
        // this.pendingTDForm.get('PendingTranches')['controls'][index]['controls']['dmsDocumentId'].setValue(documentId);
        console.log("documentId******", documentId);
        // this.documentArr[index].documentId = documentId;
        // const subCategoryCode = this.documentArr[index].subCategoryCode;
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

  doAction(action,actionFlag){
    if(action != 'Reverse'){
      this.remarks = '';
      this.trancheDisbJson = '';
    }
    this.trancheDisbJson = this.roleType == '5' ? this.trancheDisbJson : '';
    this.disbursementService.tdReverseToMaker(this.taskId,this.remarks,this.roleId,actionFlag,this.trancheDisbJson)
    .subscribe((res: any) => {
      if (res.Error == '0'){
        const apiError = res.ProcessVariables.error;
        if (apiError.code == '0') {
          if(action == 'Reverse'){
            this.toasterService.showSuccess('Reversed Successfully', 'Reversed');
            this.callStartAndComplete(this.taskId,this.remarks,'Reverse');
            // this.navigateToDashboard();
          }else if(action == 'SubToChecker'){
            this.toasterService.showSuccess('Submitted Successfully', '');
            this.callStartAndComplete(this.taskId,this.remarks,'SubToChecker');
          }
        } else {
          this.toasterService.showError(apiError.message,'')
        } 
      }
    })
  }

  onApprove(){
    this.remarks = ''
    this.disbursementService.tdApprove(this.taskId,this.LoanDetails['leadID'],this.loanAccountNumber)
    .subscribe((res: any) => {
      if (res.Error == '0'){
        const apiError = res.ProcessVariables.error;
        if (apiError.code == '0') {
          //this.toasterService.showSuccess('Approved Successfully', 'Approved');
          this.DisbursementLog = res.ProcessVariables.DisbursementLog;
          this.isFailed = res.ProcessVariables.isFailed;
          if(this.isFailed){
            this.getTDDetails();
            this.statusModal = true;
            this.statusFlag = 'Unable to Approve';
          } else {
            this.message = apiError.message;
            this.callStartAndComplete(this.taskId,this.remarks,'Approve');
          }
        } else {
          this.statusModal = true;
          this.message = apiError.message;
          this.statusFlag = 'Unable to Approve';
          this.toasterService.showError(apiError.message,'')
        } 
      }
    })
  }

  callStartAndComplete(taskId,remarks,action){
    this.disbursementService.startTask(taskId).subscribe((res: any) => {
        this.disbursementService.completeTask(taskId,remarks).subscribe((res: any) => {
          if (res.ErrorCode == 0) {
            if(action == 'Approve'){
              this.statusModal = true;
              this.statusFlag == 'Approved Successfully'
            }else{
               this.navigateToDashboard();
            }
          } else {
            if(action == 'Approve'){
              this.statusModal = true;
              this.statusFlag == 'Unable to Approve';
            } else {
              this.toasterService.showError(res.ErrorCode, '');
            } 
          }
        });
    });
  }

  showAppDetails(val, mop) {
    this.showDisburseModal = true
    this.disbursementData = {};
    this.TDPendingTranches.forEach(element => {
      if (val == element.payable_to && mop == element.tranche_disbursement_id) {
        this.disbursementDetailsdata = []
        this.disbursementDetailsdata.push(element)
      }
    });
    this.disbursementData = this.disbursementDetailsdata[0];
    if (this.disbursementData) {
      this.modeOfPayment = this.paymentLov.find(({ key }) => key == this.disbursementData['paymentMode']).value;
      this.payableToData = this.disburseToLov.find(({ key }) => key == this.disbursementData['payable_to']).value;
    } else {
      this.modeOfPayment = '';
      this.payableToData = '';
    }

  }

  saveCurrentUrl() {
    const currentUrl = this.location.path();
    localStorage.setItem('currentUrl', currentUrl);
  }

  onBack() {
    this.router.navigate([`pages/dashboard`]);
  // if (this.roleType == '1') {
  //   this.router.navigate([`/pages/dashboard`]);
  // } else if (this.roleType == '4') {
  //   this.router.navigate([`/pages/cpc-maker`]);
  // } else if (this.roleType == '5') {
  //   this.router.navigate([`/pages/cpc-checker`]);
  // }
  }

  ngAfterViewInit() {
    setTimeout(() => this.earlierTDForm.disable(), 2000);
  }
}

