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
  userType: number;
  creditConditions: any;
  roleAndUserDetails: any;
  userId;
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
    // this.formArr.push(this.getcreditConditionControls())addRowControl
    this.formArr.push(this.addRowControl());
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
        })
      }
      this.formArr.removeAt(index);
      this.toasterService.showSuccess("Record deleted successfully!", '')

    

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
  dateCheck(event, i) {
    // alert(event.target.value)
    if (event.target.value == "defferedTillDate") {
      this.differDateField = true
    } else {
      this.differDateField = false
    }
  }
  // 
  getcreditConditionControls(data?:dataObject) {
    if(data){}
    if (this.userType == 2) {
      return this.formBuilder.group({
        creditId: new FormControl(data.creditId ? data.creditId:''),
        creditCondition: new FormControl({ value: data.creditCondition?data.creditCondition:'', disabled: false }),
        salesResponse: new FormControl({ value: data.salesResponse?data.salesResponse:'', disabled: true }),
        isDocReq: new FormControl(data.isDocReq?data.isDocReq:''),
        creditAction: new FormControl(data.creditAction?data.creditAction:''),
        defferedDate: new FormControl(data.defferedDate?data.defferedDate:null)
      });
    } else {
      return this.formBuilder.group({
        creditId: new FormControl(data.creditId?data.creditId:''),
        creditCondition: new FormControl({ value: data.creditCondition?data.creditCondition:'', disabled: true }),
        salesResponse: new FormControl({ value: data.salesResponse?data.salesResponse:'', disabled: false }),
        isDocReq: new FormControl(data.isDocReq?data.isDocReq:''),
        creditAction: new FormControl(data.creditAction?data.creditAction:''),
        defferedDate: new FormControl(data.defferedDate?data.defferedDate:null)
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
  addRowControl(){
    if (this.userType == 2) {
    return this.formBuilder.group({
      creditId: new FormControl(''),
      creditCondition: new FormControl({ value: 
        '', disabled: false }),
      salesResponse: new FormControl({ value: 
        '', disabled: true }),
      isDocReq: new FormControl(''),
      creditAction: new FormControl(''),
      defferedDate: new FormControl(null)
    });
  }else {
    return this.formBuilder.group({
      creditId: new FormControl(''),
      creditCondition: new FormControl({ value: 
        '', disabled: true }),
      salesResponse: new FormControl({ value:'', disabled: false }),
      isDocReq: new FormControl(''),
      creditAction: new FormControl(''),
      defferedDate: new FormControl(null)
    });

  }
}
  get formArr() {
    return this.creditConditionForm.get('Rows') as
      FormArray;
  }
  initRows() {

  }
  getCreditConditions() {
    const data = {
      "userId":this.userId,
      "leadId":this.leadId,
    }
    this.creditConditionService.getCreditConditions(data).subscribe(res => {
      console.log(res);
      if (res['ProcessVariables'].error['code'] == "0" && res['ProcessVariables'].creditConditions != null) {
        const creditConditions:Array<dataObject> = res['ProcessVariables'].creditConditions;
        this.creditConditions = res['ProcessVariables'].creditConditions;
        for (let i = 0; i < creditConditions.length; i++) {

          
          creditConditions[i]['defferedDate'] = creditConditions[i]['defferedDate'] ? this.getDateFormat(creditConditions[i]['defferedDate']) : null;
          this.formArr.push(this.getcreditConditionControls(creditConditions[i]))
          // if (!creditConditions[i]['salesResponseDoc']) {
          //   creditConditions[i]['salesResponseDoc'] = '';

          // }
          // creditConditions[i]['creditAction']  = creditConditions[i]['creditAction'] ? creditConditions[i]['creditAction'] : '2';
        }
        // this.formArr.setValue(creditConditions);
      } else {
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
        if(this.formArr.controls[i]['controls']['defferedDate'].value != ''){
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
        creditConditionDetails[i].isDocReq = parseInt(creditConditionDetails[i].isDocReq);
        
      }
      let ProcessVariables = {
        "userId":this.userId,
        "leadId":this.leadId,
        "creditConditionDetails": creditConditionDetails
      }
      this.creditConditionService.saveUpdateCreditConditions(ProcessVariables).subscribe(res=> {
        console.log(res);
        if(res['ProcessVariables'].error['code'] == 0){
          this.toasterService.showSuccess("Record Saved successfully!", '');
          if(data == 'save' ){
          }else if(data == 'next'){
            this.router.navigateByUrl('/pages/credit-decisions/' +this.leadId +'/term-sheet')
          }else{
            if(this.userType == 2){
              this.router.navigateByUrl('/pages/dashboard/credit-decision/decision-with-me')
            }else{
              this.router.navigateByUrl('/pages/dashboard/leads-section/sanction-leads')
            }
          }
  
        }
  
      })
    }
   
  }
  approveRejectDeclineCreditCondition(data){
    let reject;
    let approve;
    switch(data) {
      case 'approved':
        {
          approve = true;
          reject= false;
        }
        break;
      case 'rejected':
        {
          approve = false;
          reject= true;
        }
        break;
      case 'declined':
      {
        approve = false;
        reject= false;
      }
      break;
      default:
        // code block
    }
    let processData = {
      "userId":this.userId,
      "leadId":this.leadId,
      "isReject" : reject,
      "isApprove" : approve
    }
      this.creditConditionService.approveRejectDeclineCreditConditions(processData).subscribe(res=> {
      console.log(res);
      if(res['ProcessVariables'].error['code'] == 0){
        this.toasterService.showSuccess("Record" + data + " successfully!", '')
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
    this.getCreditConditions();

  }

}
