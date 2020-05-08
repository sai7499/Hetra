import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { element } from 'protractor';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];
  tenorValue= []
  public labels: any = {};
  sourcingDetailsForm: FormGroup;
  SourcingChange: any;
  text:any;
  id: any;


  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private router: Router,
    private labelsData: LabelsService) { }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].sourcingDetails[0];
      console.log("values", this.values)
      


      this.values.loanAccountBranch = res[0].leadCreation[0].loanAccountBranch;
      // console.log(this.values.loanAccountBranch);
     this.values.businessDivision= res[0].leadCreation[0].businessDivision;
      this.values.productCategory = res[0].leadCreation[0].productCategory;
      this.values.priority = res[0].leadCreation[0].priority;
      this.values.leadHandledBY = res[0].leadCreation[0].leadHandledBY;
      this.values.soucringChannel= res[0].leadCreation[0].soucringChannel;
      this.values.spokenCodeLocation = res[0].leadCreation[0].spokenCodeLocation;
      this.values.sourcingType = res[0].sourcingDetails[0].sourcingType;
      console.log(this.values.sourcingType)
      // this.setFormValue();
      this.getdata()
      
    });
  }

  sourcingChannelChange(event: any){
    
    this.SourcingChange = event.target.value;
    console.log(this.SourcingChange);
    
  
    if(this.SourcingChange == 61){
     this.id.professionList= [{key: 1,value: 'DSA'},{key: 2,value: 'Dealers'},{key: 3,value: 'Connectors'},{key: 4,value: 'Direct/Employee/DSE'},{key: 5,value: 'Manufacturers'}];
     this.text="Employee Code"
   }
   else if(this.SourcingChange== 62){
        this.id.professionList=[{key: 1, value: "Liability Branch Code" }];
              this.text= "Employee Code"
   }
   else if(this.SourcingChange== 63){
     this.id.professionList= [{key: 1,value: 'Corporate Website'},{key: 2,value: 'Internet Banking'},{key: 3,value: 'Mobile Banking'}];
     this.text="Employee Code"
   }
   else if(this.SourcingChange==64)
    {
      this.id.professionList = [{key: 1,value: 'Not Applicable'}];
      this.text = "Campaign Code";
      
    }
    else{
      this.id.professionList= [{key: 1,value: 'Not Applicable'}];
      this.text = "Employee Code";
    }

  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({value: '', disabled: true}),
      leadCreatedDate: new FormControl({value: '', disabled: true}),
      leadCreatedBy: new FormControl({value: '', disabled: true}),
      leadHandledBy: new FormControl(''),
      priority: new FormControl(''),
      product: new FormControl (''),
      businessDivision: new FormControl ({value:'1', disabled: true }),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl({value:'',disabled:true}),
      loanAccountBranch: new FormControl({value: '', disabled: true}),
      requestedAmount : new FormControl(''),
      requestedTenor : new FormControl('')
    });

    this.labelsData.getLabelsData().subscribe(
      data => {

        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      });

      
  }


  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  getdata(){
   this.id= this.leadStoreService.getLeadCreation();
   console.log(this.id)
   


   this.sourcingDetailsForm.controls["product"].setValue(this.id.productCategory)
   this.sourcingDetailsForm.controls["priority"].setValue(this.id.priority)
   this.sourcingDetailsForm.controls["spokeCodeLocation"].setValue(this.id.spokeCodeLocation)
   this.sourcingDetailsForm.controls["loanAccountBranch"].setValue(this.id.loanBranch)
   this.sourcingDetailsForm.controls["leadHandledBy"].setValue(this.id.leadHandeledBy)
   this.sourcingDetailsForm.controls["sourcingChannel"].setValue(this.id.sourcingChannel)
   this.sourcingDetailsForm.controls["sourcingType"].setValue(this.id.sourcingType)
   this.sourcingDetailsForm.controls["sourcingCode"].setValue(this.id.sourcingCode)

  };


  onFormSubmit() {
    this.router.navigate(['/pages/lead-section/applicant-details']);
    console.log('sourcing form', this.sourcingDetailsForm.value);
    const formValue = this.sourcingDetailsForm.value;
    const sourcingModel = {...formValue};
    this.leadStoreService.setSourcingDetails(sourcingModel);
    
  }

}
