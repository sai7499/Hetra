import { Component, OnInit } from '@angular/core';
import { LabelsService } from '../../../services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { CreditConditionService } from '../services/credit-condition.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LoanViewService } from '@services/loan-view.service';


interface dataObject{ 
      creditId: string;
      creditCondition: string;
      salesResponse: string;
      isDocReq:string;
      creditAction: string;
      defferedDate:Date;
    
}
@Component({
  selector: 'app-credit-conditions',
  templateUrl: './credit-conditions.component.html',
  styleUrls: ['./credit-conditions.component.css']
})
export class CreditConditionsComponent implements OnInit {
  labels: any = {};
  differDateField: boolean = true;
  creditConditionForm: FormGroup;
  leadId;
  submitRefer :boolean = false;
  userType: number;
  creditConditions: any;
  roleAndUserDetails: any;
  submitReject:boolean = false;
  leadDetails: any;
  userId;
  errorGenerated: boolean = false;
  errorMessage : any = [];
  roleList : any = [];
  formData = {
    'creditId' : '',
    creditCondition: '',
        salesResponse: '',
        isDocReq: '',
        creditAction:'',
        defferedDate: null
  }
  disableControl: boolean;
  alertMsg;
  isApproveEnable: boolean;
  isDeclineEnable: boolean;
  submitReferLov : any = [];
  isRejectEnable: boolean;
  selectAction;
  roleType: any;
  productCatCode;
  salesResponse = 'false';

  rejectData: {
    title: string,
    product: any;
    flowStage: string;
    productCode: any;
   
  }

  showModal: boolean;

  isLoan360: boolean;
  isDeclinedFlow: boolean = false;
  taskId: any;

  constructor(
    public labelsService: LabelsService,
    private loginStoreService: LoginStoreService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private creditConditionService: CreditConditionService,
    private loanViewService: LoanViewService
  ) { 
    this.sharedService.productCatCode$.subscribe((value) => {
      this.productCatCode = value;
    });
    this.sharedService.isDeclinedFlow.subscribe((res: any) => {
      console.log(res, ' declined flow');
      if (res) {
          this.isDeclinedFlow = res;
      }
  });
  }

  addOtherUnit() {
    this.formArr.push(this.getcreditConditionControls(this.formData))
  }
  removeOtherIndex(index, credit) {
      // console.log("inside del fun", fleets)

      // console.log("vehicleId", fleets[index].id)
      if (credit.length >= 1 && this.creditConditions && credit[index].creditId != '') {
        const data = {
          creditId: this.creditConditions[index].creditId,
          "userId": this.userId
        }
        this.creditConditionService.deleteCreditConditions(data).subscribe(res => {
          console.log(res)
          this.formArr.removeAt(index);
          this.toasterService.showSuccess("Record deleted successfully!", '')
        })       

        return;
      } else{
      this.formArr.removeAt(index);
      this.toasterService.showSuccess("Record deleted successfully!", '')
      }   

  }
  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }
  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData;
      console.log(this.labels.creditCondition);
    })
  }
  alertMessage(data){
    if(data == "Reject"){
     // this.getLeadRejectReason();
    }
    this.alertMsg =  data
  }
  dateCheck(event, i) {
    // alert(event.target.value)
    if (event.target.value == "defferedTillDate") {
      this.differDateField = true
    } else {
      this.differDateField = false
    }
  }
  getcreditConditionControls(data?) {
    if (this.userType == 2) {
      return this.formBuilder.group({
        creditId: new FormControl(data.creditId ? data.creditId : ''),
        creditCondition: new FormControl({ value: data.creditCondition ? data.creditCondition : '', disabled: false }),
        salesResponse: new FormControl({ value: data.salesResponse ? data.salesResponse : '', disabled: true }),
        isDocReq: new FormControl({value:data.isDocReq ? data.isDocReq : null, disabled: false}),
        creditAction: new FormControl({value:data.creditAction ? 
          data.creditAction : null,disabled:!data.is_sales_response_completed}),
        defferedDate: new FormControl(data.defferedDate ? data.defferedDate : null)
      });
    } else {
      return this.formBuilder.group({
        creditCondition: new FormControl({ value: data.creditCondition ? data.creditCondition : '', disabled: true }),
        salesResponse: new FormControl({ value:data.salesResponse ? data.salesResponse : '', disabled: false }),
        creditId: new FormControl(data.creditId ? data.creditId : ''),
        isDocReq: new FormControl({value:data.isDocReq ? data.isDocReq : null, disabled: true}),
        creditAction: new FormControl({value:data.creditAction ? 
          data.creditAction : null,disabled:true}),
        defferedDate: new FormControl(data.defferedDate ? data.defferedDate : null)
      });
      // return this.formBuilder.group({
      //   creditCondition: new FormControl({ value: "", disabled: true }),
      //   salesResponse: new FormControl({ value: "", disabled: false }),
      //   creditId: new FormControl(''),
      //   isDocReq: new FormControl(),
      //   creditAction: new FormControl(""),
      //   defferedDate: new FormControl()
      // });
    }

  }
  referForm = new FormGroup({
    roleId: new FormControl( '' , [Validators.required]),
  });
  rejectReasonForm = new FormGroup({
    rejectReason: new FormControl( '' , [Validators.required]),
  });
  get formArr() {
    return this.creditConditionForm.get('Rows') as
      FormArray;
  }
  get f() { return this.referForm.controls; }
  get rejectReasonF() { return this.rejectReasonForm.controls; }

  initRows() {

  }
  getCreditConditions() {
    const data = {
      "userId":this.userId,
      "leadId":this.leadId,
    }
    this.creditConditionService.getCreditConditions(data).subscribe(res => {
      console.log(res);
      this.isApproveEnable = res['ProcessVariables']['isApproveEnable'];
      this.isDeclineEnable = res['ProcessVariables']['isDeclineEnable'];
      this.isRejectEnable = res['ProcessVariables']['isRejectEnable'];
      this.roleList = res['ProcessVariables']['roleList'];
      if (res['ProcessVariables'].error['code'] == "0" && res['ProcessVariables'].creditConditions != null) {
        const creditConditions:Array<dataObject> = res['ProcessVariables'].creditConditions;
        this.creditConditions = res['ProcessVariables'].creditConditions;
       
          this.disableControl = false;
        for (let i = 0; i < creditConditions.length; i++) {
      //    this.formArr.push(this.getcreditConditionControls())
          creditConditions[i]['defferedDate'] = creditConditions[i]['defferedDate'] ? this.getDateFormat(creditConditions[i]['defferedDate']) : null;
          this.formArr.push(this.getcreditConditionControls(creditConditions[i]))

          // if (!creditConditions[i]['salesResponseDoc']) {
          //   creditConditions[i]['salesResponseDoc'] = '';

          // }
          // creditConditions[i]['creditAction']  = creditConditions[i]['creditAction'] ? creditConditions[i]['creditAction'] : '2';
        }
      //  this.formArr.setValue(creditConditions);
      } else if(res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
        this.disableControl = true;
      }else if(res['Error'] == "1"){
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
  }
  getDateFormat(date) {

    // console.log("in getDateFormat", date)

    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
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
  saveUpdate(data) {
    if(this.formArr.length >= 1){
      let creditConditionDetails = this.creditConditionForm.value['Rows'];
      for(let i=0 ; i< creditConditionDetails.length ; i++){
        if(this.formArr.controls[i]['controls']['defferedDate'].value != '' && this.formArr.controls[i]['controls']['defferedDate'].value != null){
          creditConditionDetails[i].defferedDate = this.sendDate(this.formArr.controls[i]['controls']['defferedDate'].value)
        }
        // if(creditConditionDetails[i]['creditAction'] == '2'){
        //   creditConditionDetails[i]['creditAction'] = null;
        // }
        if(!creditConditionDetails[i]['salesResponse']){
         creditConditionDetails[i]['salesResponse'] = '';
        }
        if(creditConditionDetails[i]['creditId'] == ""){
          creditConditionDetails[i]['creditId'] = null;
        }
        console.log(this.formArr)
        creditConditionDetails[i].isDocReq = creditConditionDetails[i].isDocReq ? parseInt(creditConditionDetails[i].isDocReq) : null;
        
      }
      let ProcessVariables = {
        "userId":this.userId,
        "leadId":this.leadId,
        "creditConditionDetails": creditConditionDetails
      }
      this.creditConditionService.
        saveUpdateCreditConditions(ProcessVariables).
          subscribe(res=> {
          console.log(res);
          if(res['ProcessVariables'].error['code'] == 0){
            this.toasterService.showSuccess("Record Saved successfully!", '');
            if(data == 'save' ){
              this.creditConditions = [];
              this.creditConditionForm = this.formBuilder.group({
                Rows: this.formBuilder.array([])
              });
              this.getCreditConditions();
            }
          }else if(res['ProcessVariables'].error['code'] == "1") {
            this.toasterService.showError(res['ProcessVariables'].error['message'], '');
           
          }else if(res['Error'] == "1"){
            this.toasterService.showError(res['ErrorMessage'], '');
          }
        
        })
    }else{
      this.toasterService.showError("Please Enter atleast one record" , '');
      // if(data == 'next' && this.userType == 2 && this.salesResponse == 'true' ){
      //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
      // } else if(data == 'next' && this.userType == 2 && this.salesResponse == 'false' ){
      //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
      // }else if(data == 'next' && this.userType == 1  ){
      //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet');
      // }
      // else if(data == 'back' && this.userType == 2 ){
      //   this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
      // }
      // else if(data == 'back' ){
      //   this.router.navigateByUrl('/pages/dashboard')
      //   }
    }
   
  }
  assignCDTaskFromSales(){
    let ProcessVariables = {
      "userId":this.userId,
      "leadId":this.leadId,
      "taskId": this.taskId
    }
    this.creditConditionService.assignCDTaskFromSales(ProcessVariables).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
        this.toasterService.showSuccess("Record Submitted successfully!", '')
      }else if(res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
      }else if(res['Error'] == "1"){
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
  }
  // selectedEvent(data){
  //   this.selectAction = data;
  // }
  rejectCreditiCondition(reasonCode?: string){
    this.submitReject = true;
       // if(this.rejectReasonForm.valid){
          // processData["isRefer"]= true;
          let processData = {};
       //   processData['rejectReason'] =this.rejectReasonForm.value['rejectReason'];
          
  
      // processData["roleId"] =this.referForm.value['roleId'];
      processData["userId"]= this.userId;
      processData["leadId"]= this.leadId;
      processData["rejectReason"] = reasonCode;
      processData["taskId"]= this.taskId;
        this.creditConditionService.rejectCreditCondition(processData).subscribe(res=> {
      //  console.log(res);

        if(res['ProcessVariables'].error['code'] == 0){
          this.toasterService.showSuccess("Record Rejected successfully!", '');
          this.router.navigate([`pages/dashboard`]);
        }else if(res['ProcessVariables'].error['code'] == "1") {
          this.toasterService.showError(res['ProcessVariables'].error['message'], '');
         
        }else if(res['Error'] == "1"){
          this.toasterService.showError(res['ErrorMessage'], '');
        }
      })
        // }else{
        //   return
        // }
    
    
  }
  // getLeadRejectReason(){
  //   let data = {
  //     "flowStage": this.leadDetails['stage'],
  //     "productCode": this.leadDetails['productCatCode']
  //     // flowStage:'12',
  //     // "productCode" : "UC"
  //   }
  //   this.creditConditionService.getLeadRejectReason(data).subscribe(res=> {
  //     console.log(res);
  //     if(res['ProcessVariables'].error['code'] == 0){
  //       console.log(res);
  //       if(res['ProcessVariables']['assetRejectReason']){
  //         let assetRejectReason = res['ProcessVariables']['assetRejectReason'];
  //          for(let i=0 ; i< assetRejectReason.length ;i++){
  //            this.submitReferLov.push({
  //              key : assetRejectReason[i]['reasonCode'],
  //              value : assetRejectReason[i]['reasonDesc']
  //            })
  //          }
  //       }
  //     }else if(res['ProcessVariables'].error['code'] == "1") {
  //       this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
  //     }else if(res['Error'] == "1"){
  //       this.toasterService.showError(res['ErrorMessage'], '');
  //     }
  //   })
  // }
  creditConditionActions(data){
    let processData = {};
    switch(data) {
      case 'submited':
        {
          processData["onSubmit"]= true;
        }
        break;
      case 'declined':
      {
        processData["isDecline"]= true;
      }
      break;
      case 'Send Back to DDE':{
        processData["sendBackToCredit"]= true;
      }
      break;
      case 'refered': {
      //  console.log(this.referForm);
        this.submitRefer = true;
        if(this.referForm.valid){
          processData["isRefer"]= true;
          processData["roleId"] =this.referForm.value['roleId'];
        }else{
          return
        }
      }
      break;
      default:{
        return;
      }
        // code block

    }
    processData["userId"]= this.userId;
    processData["leadId"]= this.leadId;
    processData["taskId"] = this.taskId;
      this.creditConditionService.submitReferDeclineCreditConditions(processData).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
        this.toasterService.showSuccess("Record " + data + " successfully!", '');
        this.router.navigate([`pages/dashboard`]);
      }else if(res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
      }else if(res['Error'] == "1"){
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
  }
  approveCreditCondition(){
   let processData = {};
    processData["isApprove"]= true;
    processData["userId"]= this.userId;
    processData["leadId"]= this.leadId;
    this.creditConditionService.approveCreditConditions(processData).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
          if(res['ProcessVariables'].rctaAlert == true){
            this.errorGenerated = true;
            // const message = res['ProcessVariables'].rctaMessage;
            this.errorMessage = res['ProcessVariables'].rctaMessage;
          }else{
             this.toasterService.showSuccess("Record Approved successfully!", '')

          }
        // this.toasterService.showSuccess("Record Approved successfully!", '')
      }else if(res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');
       
      }else if(res['Error'] == "1"){
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
  }
  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.getLabelData();
    this.roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log(this.roleAndUserDetails)
    // this.leadDetails = this.activatedRoute.snapshot.data.leadData;
    this.activatedRoute.parent.data
    .subscribe((data) => {
      if(data['leadData']['ProcessVariables']){
        this.leadDetails = data['leadData']['ProcessVariables']['leadDetails'];
      }
    });


    if (this.roleAndUserDetails) {
      this.userId = this.roleAndUserDetails['userDetails'].userId;
      this.userType = this.roleAndUserDetails['roles'][0].roleType;
    }
    this.leadId = (await this.getLeadId()) as number;
    this.creditConditionForm = this.formBuilder.group({
      Rows: this.formBuilder.array([])
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
    //  console.log('role Type', this.roleType);
    });
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    this.getCreditConditions();
    this.salesResponse = localStorage.getItem('salesResponse')

  }
  onNext()  {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/sanction-letter`);
    }
    // this.onSave();
    // tslint:disable-next-line: triple-equals
    if(this.roleType == 1 && localStorage.getItem('isPreDisbursement') == 'true' && this.isDeclinedFlow == false){
      this.router.navigate([`pages/pre-disbursement/${this.leadId}/term-sheet`]);
    } else if( this.userType == 1 && this.isDeclinedFlow == true  ){
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/remarks`]); 
    } else if( this.userType == 2 && this.salesResponse == 'false' ){
      this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
    } else if( this.userType == 1 && localStorage.getItem('isPreDisbursement') != 'true' && this.isDeclinedFlow == false ){
      this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
    }
     if (this.roleType == '2' || this.roleType == '1' && localStorage.getItem('isPreDisbursement') != 'true'  && this.isDeclinedFlow == false) {
    this.router.navigate([`pages/credit-decisions/${this.leadId}/term-sheet`]);
    
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/term-sheet`]);
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/term-sheet`]);
    }
  }
  
  onBack() {
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/negotiation`);
    }

    if(this.roleType == '1' && localStorage.getItem('isPreDisbursement') == 'true' && this.isDeclinedFlow == false){
      this.router.navigate([`pages/dashboard`]);
    } else if( this.userType == 1 && this.isDeclinedFlow == false && localStorage.getItem('isPreDisbursement') == 'false' ){
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/deviations`]); 
    } else  if( this.userType == 2 && this.salesResponse == 'true' ){
      this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
    }else if(this.userType == 2 && this.salesResponse == 'false' ){
      this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
    }else if(this.userType == 1){
      this.router.navigate([`pages/dashboard`]);
    }else if (this.roleType == '2' || this.roleType == '1') {
      this.router.navigate([`pages/dashboard`]);
      // tslint:disable-next-line: triple-equals
      } 
    }


    reject() {

      let productCode = ''
      this.sharedService.productCatCode$.subscribe((value)=> {
        productCode = value;
      })
      const productId = productCode || '';
      this.showModal = true;
      this.rejectData = {
        title: 'Select Reject Reason',
        product:'',
        productCode: productId,
        flowStage: '105'
      }
      
    }
  
    onOkay(reasonData) {
      
      this.rejectCreditiCondition(reasonData['reason'].reasonCode)
    }
  
    onCancel() {
      this.showModal = false;
    }

}
