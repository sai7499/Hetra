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

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {
  leadId: number;
  userId: string;
  getExposureDetails: any;
  liveloanArray = [];
  proposedArray = [];
  isAlert: boolean;
  currentYear = new Date().getFullYear();
  regexPattern = {
    maxLength4: {
      rule: '4',
      msg: 'Maximum Length 4 digits',     
    },
    maxLength15: {
      rule: '15',     
    },
    nameLength: {
      rule: '30',
      msg: '',
    },
    mobile: {
      rule: '^[1-9][0-9]*$',
      msg: 'Numbers only allowed !',
    },
  };
  yearCheck = [];
  isDirty: boolean;
  constructor(private formBuilder: FormBuilder, private labelService: LabelsService,
              private exposureservice: ExposureService,
              private commonservice: CommomLovService,
              private route: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private toStarService: ToasterService ) {
                this.yearCheck = [{rule: val => val>this.currentYear,msg:'Feature year not accepted'}]
              }
  exposureLiveLoan: FormGroup;
  exposureProposedLoan: FormGroup;
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
    this.exposureLiveLoan = this.formBuilder.group({
      loanTable: this.formBuilder.array([]),
      // proposedTable: this.formBuilder.array([])
    });
    // this.exposureProposedLoan = this.formBuilder.group({
    //   proposedTable: this.formBuilder.array([this.getProposedLoan()])
    // });
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.commonservice.getLovData().subscribe((res: any) => {
      console.log(res.LOVS);
      this.lovData = res.LOVS['loanType-Exposure'];
    });
    this.userId = localStorage.getItem('userId');
    this.getExposure();

  }
  async getExposure() {
    this.leadId = (await this.getLeadId()) as number;
    this.exposureservice.getExposureDetails({leadId : this.leadId}).subscribe((res: any) => {
      this.getExposureDetails = res.ProcessVariables.exposure;
      console.log(this.getExposureDetails);
      if (this.getExposureDetails && this.getExposureDetails.length > 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.getExposureDetails.length; i++) {
          // if (this.getExposureDetails[i].loanDesc === 'Proposed') {
          // this.proposedArray.push(this.getExposureDetails[i]);
          // // } else {
            this.liveloanArray.push(this.getExposureDetails[i]);
          // }
        }
        this.addUnit(this.liveloanArray);
        this.addProposedUnit(this.proposedArray);
      } else {
        this.addUnit(null);
        this.addProposedUnit(null);
       }
    });
    console.log(this.liveloanArray, 'live loan');
    console.log(this.proposedArray, 'proposed');

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
  public getProposedLoan(data?: any) {
    if (!data || data === null || undefined) {
      return this.formBuilder.group({
        loanType: ['',[Validators.required]],
        loanNo: ['', [Validators.minLength(0)] ],
        assetType: [''],
        yom: ['' ,[Validators.minLength(4),Validators.maxLength(4),
                    Validators.max(this.currentYear)]],
        gridValue: ['',[Validators.required] ],
        ltv: ['',[Validators.required] ],
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
      ltv: [data.ltv ? data.ltv : '' ],
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
        ltv: ['',[Validators.required] ],
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
      ltv: [data.ltv ? data.ltv : '' ],
      currentPos: [data.currentPos ? data.currentPos : '' ],
      tenure: [data.tenure ? data.tenure : '' ],
      emiPaid: [data.emiPaid ? data.emiPaid : '']
    });
    }
  }
  addUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    if (data && data.length > 0 ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.length; i++) {
        control.push(this.getProposedLoan(data[i]));
      }
    } else {
      control.push(this.getProposedLoan(null));
    }
  }

  removeIndex(i?: any,rowId?:any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    console.log(control.controls.length,rowId);
    
    // if (this.liveloanArray.length >0 ){
      // const  id = this.proposedArray[i].id ? this.proposedArray[i].id : null;
      const  id = control.controls[i].value.id;
      const body = {
        id,
        userId: this.userId
      };
      if(id){
        this.exposureservice.deleteExposureDetails(body).subscribe((res: any) => {
            console.log(res);
            control.removeAt(i);
            // alert(res.ProcessVariables.error.message);
            this.toStarService.showInfo(res.ProcessVariables.error.message,"Exposure Details")
          });
        } else{
          control.removeAt(i);
          this.toStarService.showInfo("Row is Removed","Exposure Details")
        }
      // }
    // if (control.controls.length === 1) {
    //     this.addUnit(null);
    //   }
  }
addProposedUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    if (data && data.length > 0 ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.length; i++) {
        // control.push(this.getLiveLoan(data[i]));
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
    if (this.exposureLiveLoan.valid && !this.validYom){
      let arrayData = [];

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i <  this.exposureLiveLoan.value.loanTable.length; i++ ) {
      arrayData.push(this.exposureLiveLoan.value.loanTable[i]);
      
      }
      // tslint:disable-next-line: prefer-for-of
      // for (let i = 0; i <  this.exposureLiveLoan.value.proposedTable.length; i++ ) {
      //   arrayData.push(this.exposureLiveLoan.value.proposedTable[i]);
      //  }
      arrayData.forEach(ele =>
        {ele.loanNo = (ele.loanNo).toString();
        ele.yom = (ele.yom).toString();
        ele.gridValue = Number(ele.gridValue);
        ele.ltv = Number(ele.ltv);
        ele.currentPos = Number(ele.currentPos);
        ele.tenure = Number(ele.tenure);
        ele.emiPaid = Number(ele.emiPaid);
        })


      const body = {
        leadId: this.leadId,
        userId: this.userId,
        exposures : arrayData
      };
      if (this.exposureLiveLoan.invalid) {
      return;
      }
      this.exposureservice.setExposureDetails(body).subscribe((res: any) => {
        console.log(res, ' response in exposure');
        if (res.ProcessVariables.error.code === '0') {
          const liveloanControl = this.exposureLiveLoan.controls.loanTable as FormArray;
          const proposedControl = this.exposureLiveLoan.controls.proposedTable as FormArray;
          liveloanControl.controls = [];
          // proposedControl.controls = [];
          this.liveloanArray = [];
          this.proposedArray = [];
          this.getExposure();
        this.toStarService.showSuccess("Exposure Saved Successfuly","Exposuer Details")
        }else{
          this.toStarService.showError(res.ProcessVariables.error.message,"Exposuer Details")
        }

      });
    } else {
      this.toStarService.showError("Please Enter Mandatory Data","Exposuer Details")
    }
  }


  onBack() {
  this.location.back();
  }
  onNext() {
    this.route.navigateByUrl(`/pages/dde/${this.leadId}/income-details`);
  }
  validYom:boolean ;
  checkYear(event){
    const getYom = event.target.value;
    console.log("yom",getYom)
    if(getYom > this.currentYear){
      this.toStarService.showError("given year should lessthan or equtal to current year",
                                    "Income Details")
      this.validYom = true;
    }else{
      this.validYom = false;
    }

  }
}
