import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];
  public labels: any = {};
  sourcingDetailsForm: FormGroup;
  SourcingChange : any;
  createLeadForm : any;
  ProfessionList : any= [];
  text:string ='';
  



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
      this.values.loanAccountBranch = res[0].leadCreation[0].loanAccountBranch;
      this.setFormValue();
    });
  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({value: '125468', disabled: true}),
      leadCreatedDate: new FormControl({value: '23/03/2020', disabled: true}),
      leadCreatedBy: new FormControl({value: 'Mr. Racheal', disabled: true}),
      leadHandledBy: new FormControl(''),
      priority: new FormControl(''),
      product: new FormControl ('11'),
      businessDivision: new FormControl ({value:'1', disabled: true }),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
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

  setFormValue() {
    const sourcingValue = this.leadStoreService.getSourcingDetails() || {};
    this.sourcingDetailsForm.patchValue({
      leadHandledBy: sourcingValue.leadHandledBy || '',
      sourcingChannel: sourcingValue.sourcingChannel || '',
      sourcingType: sourcingValue.sourcingType || '',
      sourcingCode: sourcingValue.sourcingCode || '',
      spokeCodeLocation: sourcingValue.spokeCodeLocation || ''
    });
    const leadData = this.leadStoreService.getLeadCreation() || {};
    this.sourcingDetailsForm.patchValue({
      loanAccountBranch: leadData.loanAccountBranch || ''
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  sourcingChannelChange(event: any){
    
    this.SourcingChange = event.target.value;

    // if ( this.SourcingChange["Campaign"]==this.values.Campaign){
    //   console.log(this.SourcingChange);
    //   this.sourcingDetailsForm.patchValue({sourcingCode : 'Campaign Code'})
    
    // }
    // else{
    //   this.sourcingDetailsForm.patchValue({sourcingCode : 'Employee Code'})
    // }
    // else  if ( this.SourcingChange["Campaign"]==this.values.Campaign){
    //   console.log(this.SourcingChange);
    //   this.sourcingDetailsForm.patchValue({sourcingCode : 'Campaign Code'})
    
    // }

    
    // else if(this.labels.sourcingChannel['Employee Code']==this.SourcingChange.value){
    //   this.sourcingDetailsForm.patchValue({sourcingCode : 'Employee Code'})
    // }
    
    // if(this.SourcingChange== "Campaign"){
    //   // this.sourcingDetailsForm.controls['sourcingCode'].setValue("Campaign Code");
    //   //  console.log(this.SourcingChange.value)
    //   this.sourcingDetailsForm.patchValue({sourcingCode : 'C'})
    // }
    this.sourcingDetailsForm.controls['sourcingChannel'].valueChanges.subscribe((value) => {
   

      setTimeout(()=>{
        switch(this.SourcingChange){
  
      case '1': this.ProfessionList = [{key: 1,value: 'DSA'},{key: 2,value: 'Dealers'},{key: 3,value: 'Connectors'},{key: 4,value: 'Direct/Employee/DSE'},{key: 5,value: 'Manufacturers'}];
                   break;
      case '2': this.ProfessionList = [{key: 1,value: 'Liability Branch Code'}];
                   break; 
      case '3': this.ProfessionList = [{key: 1,value: 'Corporate Website'},{key: 2,value: 'Internet Banking'},{key: 3,value: 'Mobile Banking'}];
                   break;
                 
      default: this.ProfessionList = [{key: 1,value: 'Not Applicable'}];
                   break;                                      
    }
      },10);
    });
  
    if(this.SourcingChange==4){
      this.text="Campaign Code"
    }
    else{
      this.text="Employee Code"
    }
    

  }




  onFormSubmit() {
    this.router.navigate(['/pages/lead-section/applicant-details']);
    console.log('sourcing form', this.sourcingDetailsForm.value);
    const formValue = this.sourcingDetailsForm.value;
    const sourcingModel = {...formValue};
    this.leadStoreService.setSourcingDetails(sourcingModel);
    
  }

}
