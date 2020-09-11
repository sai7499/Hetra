import { Component, OnInit } from '@angular/core';
import { LabelsService } from '../../../services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { CreditConditionService } from '../services/credit-condition.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';

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
  userId;
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
  isRejectEnable: boolean;
  roleType: any;
  salesResponse = 'false';
  constructor(
    public labelsService: LabelsService,
    private loginStoreService: LoginStoreService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private creditConditionService: CreditConditionService
  ) { }

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
  get formArr() {
    return this.creditConditionForm.get('Rows') as
      FormArray;
  }
  get f() { return this.referForm.controls; }

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
     
      if (res['ProcessVariables'].error['code'] == "0" && res['ProcessVariables'].creditConditions != null) {
        const creditConditions:Array<dataObject> = res['ProcessVariables'].creditConditions;
        this.creditConditions = res['ProcessVariables'].creditConditions;
        this.roleList = res['ProcessVariables']['roleList'];
       
          this.disableControl = false;
       console.log("disable control",this.disableControl)

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
      } else {
        
          this.disableControl = true;
          
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
            }else if(data == 'next' && this.userType == 2 && this.salesResponse == 'true' ){
              this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
            } else if(data == 'next' && this.userType == 2 && this.salesResponse == 'false' ){
              this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
            } else if(data == 'next' && this.userType == 1){
              this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
            }else if(data == 'back' && this.userType == 2 && this.salesResponse == 'true' ){
              this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
            }else if(data == 'back' && this.userType == 2 && this.salesResponse == 'false' ){
              this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
            }else if(data == 'back' && this.userType == 1){
              this.router.navigate([`pages/dashboard`]);
            }
          }else {
            this.toasterService.showError(res['ProcessVariables'].error['message'], '');
          }
        
        })
    }else{
      if(data == 'next' && this.userType == 2 && this.salesResponse == 'true' ){
        this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
      } else if(data == 'next' && this.userType == 2 && this.salesResponse == 'false' ){
        this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
      }else if(data == 'next' && this.userType == 1  ){
        this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet');
      }
      else if(data == 'back' && this.userType == 2 ){
        this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/deviations')
      }
      else if(data == 'back' ){
        this.router.navigateByUrl('/pages/dashboard')
        }
    }
   
  }
  assignCDTaskFromSales(){
    let ProcessVariables = {
      "userId":this.userId,
      "leadId":this.leadId
    }
    this.creditConditionService.assignCDTaskFromSales(ProcessVariables).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
        this.toasterService.showSuccess("Record Submitted successfully!", '')
      }
    })
  }
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
      this.creditConditionService.submitReferDeclineCreditConditions(processData).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
        this.toasterService.showSuccess("Record " + data + " successfully!", '');
        this.router.navigate([`pages/dashboard`]);
      }else{
        this.toasterService.showError(res['ProcessVariables'].error['message'], '')

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
        this.toasterService.showSuccess("Record Approved successfully!", '')
      }else{
        this.toasterService.showError(res['ProcessVariables'].error['message'], '')
      }
    })
  }
  async ngOnInit() {
    this.getLabelData();
    this.roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    console.log(this.roleAndUserDetails)
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
    this.getCreditConditions();
    this.salesResponse = localStorage.getItem('salesResponse')

  }
  onNext()  {
    // this.onSave();
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '2' || this.roleType == '1') {
    this.router.navigate([`pages/credit-decisions/${this.leadId}/term-sheet`]);
    // tslint:disable-next-line: triple-equals
    // tslint:disable-next-line: align
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/term-sheet`]);
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/term-sheet`]);
    }
  }
  
  onBack() {
    if (this.roleType == '2' || this.roleType == '1') {
      this.router.navigate([`pages/dashboard`]);
      // tslint:disable-next-line: triple-equals
      } 
    }

}
