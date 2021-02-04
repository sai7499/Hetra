import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ExposureService } from '@services/exposure.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { ToasterService } from '@services/toaster.service';
import { element } from 'protractor';
import { ToggleDdeService } from '@services/toggle-dde.service';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
  leadId: number;
  userId: string;
  getExposureDetails: any;
  liveloanArray = [];
  proposedArray = [];  
  isAlert: boolean;
  currentYear = new Date().getFullYear(); 
  yearCheck = [];
  isDirty: boolean;
  rowIndex;
  isModelShow: boolean;
  errorMessage;
  isLoan360: boolean;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId= '';
  udfGroupId= 'EXG001';
  liveloanControl: FormArray;
  isProposed: any;
  constructor(private formBuilder: FormBuilder, private labelService: LabelsService,
              private exposureservice: ExposureService,
              private commonservice: CommomLovService,
              private route: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private toStarService: ToasterService,
              private toggleDdeService: ToggleDdeService,
              private loanViewService: LoanViewService ) {
                this.yearCheck = [{rule: val => val>this.currentYear,
                                   msg:'Future year not accepted'}];
                this.labelService.getLabelsData().subscribe(res => {
                  this.labels = res;
                });
                this.commonservice.getLovData().subscribe((res: any) => {
                  console.log(res.LOVS);
                  this.lovData = res.LOVS['loanType-Exposure'];
                });
                this.userId = localStorage.getItem('userId');
              }
  exposureLiveLoan: FormGroup;
  // exposureProposedLoan: FormGroup;
  labels: any = {};
  lovData: any;
 productCategory = [
   {
    key: 'UCV',
    value: 'Used CV'
   },
   {
    key: 'NCV',
    value: 'New CV'
   },
   {
    key: 'UC',
    value: 'Used Car'
   },
   {
    key: 'NC',
    value: 'New Car'
   }
  ];
   ngOnInit() {
     this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.exposureLiveLoan = this.formBuilder.group({
      loanTable: this.formBuilder.array([]),      
    });
    this.getExposure();
    this.labelService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.exposureDDE ;

    })
    }

  async getExposure() {
    this.leadId = (await this.getLeadId()) as number;
    const body = {
      leadId : this.leadId,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
        }
      ]
    }
    this.exposureservice.getExposureDetails(body).subscribe((res: any) => {
      this.getExposureDetails = res.ProcessVariables.exposure;
      this.udfDetails= res.ProcessVariables.udfDetails;
      console.log(this.getExposureDetails);
      if (this.getExposureDetails && this.getExposureDetails.length > 0 ) {        
        for (let i = 0; i < this.getExposureDetails.length; i++) {         
            this.liveloanArray.push(this.getExposureDetails[i]);          
        }
        this.addUnit(this.liveloanArray);
        // this.addProposedUnit(this.proposedArray);
      } else {
        this.addUnit(null);
        // this.addProposedUnit(null);
       }
       const operationType = this.toggleDdeService.getOperationType();
       if (operationType) {
           this.exposureLiveLoan.disable();
           this.disableSaveBtn  = true;
         }

        if (this.loanViewService.checkIsLoan360()) {
          this.exposureLiveLoan.disable();
           this.disableSaveBtn  = true;
        } 
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  get exposureArray() {
    return this.exposureLiveLoan.get('loanTable') as FormArray;
  }
  public getProposedLoan(data?: any) {
    if (!data || data === null || undefined) {
      return this.formBuilder.group({
        loanType: ['',[Validators.required]],
        loanNo: ['', [Validators.minLength(0)] ],
        assetType: [''],
        yom: ['' ,[Validators.minLength(4),Validators.maxLength(4),
                    Validators.max(this.currentYear)]],
        gridValue: ['',[Validators.required] ],
        loanAmount: ['', Validators.required],
        ltv: [{value: '', disabled: true}],
        currentPos: ['',[Validators.required] ],
        tenure: ['',[Validators.required] ],
        emiPaid: ['',[Validators.required]]
      });
    } else {
    return this.formBuilder.group({
      id: [data.id ? data.id : null],
      loanType: [data.loanType ? data.loanType : ''],
      loanNo: [data.loanNo ? data.loanNo  : '' ],
      assetType: [data.assetType ? data.assetType : ''],
      yom: [data.yom ? data.yom : '' ],
      gridValue: [data.gridValue ? data.gridValue : '' ],
      loanAmount: [data.loanAmount ? data.loanAmount : '' ],
      ltv: [{value: data.ltv ? data.ltv : '', disabled: true} ],
      currentPos: [data.currentPos ? data.currentPos : '' ],
      tenure: [data.tenure ? data.tenure : '' ],
      emiPaid: [data.emiPaid ? data.emiPaid : '']
    });
    }
  }
  private getLiveLoan(data?: any) {
    if (!data || data === null || undefined) {
      return this.formBuilder.group({
        loanType: [''],
        loanNo: ['',[Validators.required] ],
        assetType: ['',[Validators.required]],
        yom: ['',[Validators.minLength(4),Validators.maxLength(4),Validators.max(this.currentYear)] ],
        gridValue: ['',[Validators.required] ],
        loanAmount: ['', Validators.required],
        ltv: [{value: '', disabled: true}],
        currentPos: ['',[Validators.required] ],
        tenure: ['',[Validators.required] ],
        emiPaid: ['',[Validators.required] ]
      });
    } else {
    return this.formBuilder.group({
      id: [data.id ? data.id : null],
      loanType: [data.loanType ? data.loanType : ''],
      loanNo: [data.loanNo ? data.loanNo  : '' ],
      assetType: [data.assetType ? data.assetType : ''],
      yom: [data.yom ? data.yom : '' ],
      gridValue: [data.gridValue ? data.gridValue : '' ],
      loanAmount: [data.loanAmount ? data.loanAmount : '' ],
      ltv: [{value: data.ltv ? data.ltv : '', disabled: true}],
      currentPos: [data.currentPos ? data.currentPos : '', Validators.required],
      tenure: [data.tenure ? data.tenure : '' ],
      emiPaid: [data.emiPaid ? data.emiPaid : '', Validators.required]
    });
    }
  }
  addUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    if (data && data.length > 0 ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.length; i++) {
        control.push(this.getLiveLoan(data[i]));
        
      }
      for (let i = 0 ; i < data.length; i++) {
        this.onLoanTypeChange(this.getExposureDetails[i].loanType, i );
      }
    } else {
      control.push(this.getLiveLoan(null));
    }
  }

  removeIndex(i?: any,rowId?:any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    console.log(control.controls.length,rowId);
    const  id = control.controls[i].value.id;
    const body = {
        id,
        userId: this.userId
      };
      if(id){
        this.exposureservice.deleteExposureDetails(body).subscribe((res: any) => {
            console.log(res);
            control.removeAt(i);            
            this.toStarService.showInfo(res.ProcessVariables.error.message,"Exposure Details")
            this.isModelShow = false;
          });
        } else{
          control.removeAt(i);
          this.toStarService.showInfo("Row is Removed","Exposure Details")
          this.isModelShow = false;
        }  
  }


addProposedUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    if (data && data.length > 0 ) {    
      for (let i = 0 ; i < data.length; i++) {
        
      }
    } else {
      // control.push(this.getLiveLoan(null));
    }
  }
  
removeProposedIndex(i?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    const id = this.proposedArray[i].id;
    console.log(id, ' id for delete');
    const body = {
        id,
        userId: this.userId
      };
    this.exposureservice.deleteExposureDetails(body).subscribe((res: any) => {
        console.log(res);
        control.removeAt(i);
        alert(res.ProcessVariables.error.message);
      });
    if (control.controls.length === 1) {
        this.addProposedUnit(null);
      }
    }
  // }

onSubmit() {
    // tslint:disable-next-line: prefer-const
    this.isDirty = true;
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false
    if (this.exposureLiveLoan.valid && !this.validYom && !isUDFInvalid){
      let arrayData = [];
      const exposureForm = this.exposureLiveLoan.getRawValue();
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i <  exposureForm.loanTable.length; i++ ) {
      arrayData.push(exposureForm.loanTable[i]);
      
      }     
      arrayData.forEach(ele =>
        {ele.loanNo = (ele.loanNo).toString();
        ele.yom = (ele.yom).toString();
        ele.gridValue = ele.gridValue;
        ele.ltv = ele.ltv;
        ele.currentPos = ele.currentPos;
        ele.tenure = ele.tenure;
        ele.emiPaid = ele.emiPaid;
        })

      const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
      const body = {
        leadId: this.leadId,
        userId: this.userId,
        exposures : arrayData,
        udfDetails : [{
          "udfGroupId": this.udfGroupId,
          //"udfScreenId": this.udfScreenId,
          "udfData": udfData
        }]
      };
     
      if (this.exposureLiveLoan.invalid ) {
      return;
      }
      this.exposureservice.setExposureDetails(body).subscribe((res: any) => {
        console.log(res, ' response in exposure');
        if (res.ProcessVariables.error.code === '0') {
          const liveloanControl = this.exposureLiveLoan.controls.loanTable as FormArray;
          const proposedControl = this.exposureLiveLoan.controls.proposedTable as FormArray;
          for (let i = 0; i < this.exposureArray.length; i++) {
            if(this.exposureArray.controls[i].value.loanType == '1LONTYPEXP') {
              this.exposureArray.controls[i]['controls']['currentPos'].clearValidators();
              this.exposureArray.controls[i]['controls']['emiPaid'].clearValidators();
              this.exposureArray.controls[i]['controls']['currentPos'].updateValueAndValidity();
              this.exposureArray.controls[i]['controls']['emiPaid'].updateValueAndValidity();
      
            }
            
          }
          
          liveloanControl.controls = [];
          // proposedControl.controls = [];
          this.liveloanArray = [];
          this.proposedArray = [];
          this.getExposure();
        this.toStarService.showSuccess("Record Saved Successfully","Exposure Details")
        }else{
          this.toStarService.showError(res.ProcessVariables.error.message,"Exposure Details")
        }

      });
    } else {
      this.toStarService.showError("Please Enter Mandatory Data","Exposure Details")
    }
  }

  onLoanTypeChange(event?, i?) {
    const loanType = event;
    
    console.log(event, i, "loantype");
    // console.log(this.exposureLiveLoan.get('loanTable')['controls'])
    // console.log(this.exposureLiveLoan.controls.loanTable);
  
    if(loanType && loanType == '1LONTYPEXP') {
      this.isDirty = false;
        this.exposureArray.controls[i]['controls']['currentPos'].clearValidators();
        this.exposureArray.controls[i]['controls']['emiPaid'].clearValidators();
        this.exposureArray.controls[i]['controls']['currentPos'].updateValueAndValidity();
        this.exposureArray.controls[i]['controls']['emiPaid'].updateValueAndValidity();
        
        const currentPos = this.exposureArray.controls[i]['controls']['currentPos'].value;
        this.exposureArray.controls[i]['controls']['currentPos'].setValue(currentPos || null);
        
        const emiPaid = this.exposureArray.controls[i]['controls']['emiPaid'].value;
        this.exposureArray.controls[i]['controls']['emiPaid'].setValue(emiPaid || null);
        
      } else {
      this.isDirty = true;
      // const liveloanControl = this.exposureLiveLoan.controls.loanTable as FormArray;
        this.exposureArray.controls[i]['controls']['currentPos'].setValidators(Validators.required);
        this.exposureArray.controls[i]['controls']['emiPaid'].setValidators(Validators.required);
        this.exposureArray.controls[i]['controls']['currentPos'].updateValueAndValidity();
        this.exposureArray.controls[i]['controls']['emiPaid'].updateValueAndValidity();
        const currentPos = this.exposureArray.controls[i]['controls']['currentPos'].value;
        this.exposureArray.controls[i]['controls']['currentPos'].setValue(currentPos || null);
        
        const emiPaid = this.exposureArray.controls[i]['controls']['emiPaid'].value;
        this.exposureArray.controls[i]['controls']['emiPaid'].setValue(emiPaid || null);
    }
  
    
  }

  calcLTV(i) {
    
    for(let i = 0; i < this.exposureArray.length; i++ ) {
      const gridValue = this.exposureArray.controls[i]['controls']['gridValue'].value;
      const loanAmount = this.exposureArray.controls[i]['controls']['loanAmount'].value;

      if(!loanAmount || !gridValue) {
        this.exposureArray.controls[i]['controls']['ltv'].patchValue(null);
        return;
      }
       this.exposureArray.controls[i]['controls']['ltv'].patchValue(((loanAmount / gridValue)*100).toFixed(2));
      
    }
  }


  onBack() {
  // this.location.back();
  this.route.navigateByUrl(`/pages/dde/${this.leadId}/fleet-details`);
  }
  onNext() {
    this.route.navigateByUrl(`/pages/dde/${this.leadId}/income-details`);
  }
  validYom:boolean ;
  checkYear(event){
    const getYom = event.target.value;
    console.log("yom",getYom)
    if(getYom > this.currentYear){
      this.toStarService.showError("given year should lessthan or equtal to current year", "Income Details")
      this.validYom = true;
    }else{
      this.validYom = false;
    }

  }
  showModel(i){
  this.rowIndex=i;
  this.isModelShow = true;
  this.errorMessage = "Are sure to remove row";
  }
  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value)
  }
}
