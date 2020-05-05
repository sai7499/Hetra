import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { Lead } from '@model/lead.model';

@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];
  lovLabels: any = [];
  labels: any = {};

  applicantType = '51';
  SourcingChange: any;
  ProfessionList = [];
  text: string;

  selectApplicantType(event: any) {
    console.log(this.applicantType)
    this.applicantType = event.target.value;
  }

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService) {
    this.lovData.getLovData().subscribe((res: any) => {
      this.lovLabels = res[0].leadCreation[0];
      console.log(this.lovLabels);
    });

  }
  
  ngOnChanges() {
    console.log(this.test);
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      businessDivision: new FormControl({value: "1", disabled: true}),
      productCategory: new FormControl(''),
      childLoan: new FormControl(''),
      fundingProgram: new FormControl(''),
      priority: new FormControl(''),
      subventionApplied: new FormControl(''),
      subvention: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
      loanAccountBranch: new FormControl(''),
      leadHandledBy: new FormControl(''),
      entity: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl('')
    });
  }

  ngOnInit() {
    // this.values = [
    //   { key: 1, value: 'Vechicle Finance' },
    //   { key: 2, value: 'Housing Finance' },
    //   { key: 3, value: 'Loan Against Property' }
    // ];
    
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        //console.log(this.labels.leadCreationTitle,this.labels.subventionApplied)
        console.log(this.labels.fundingProgram);
      }    );
    this.onChangeLanguage('English');
    this.initForm();
  }

  sourcingChannelChange(event: any){
    
    this.SourcingChange = event.target.value;
    // console.log(this.SourcingChange);
    
    // this.createLeadForm.controls['sourcingChannel'].valueChanges.subscribe((value) => {


    //   setTimeout(()=>{
    //     switch(this.SourcingChange){
  
    //   case '61': this.ProfessionList = [{key: 1,value: 'DSA'},{key: 2,value: 'Dealers'},{key: 3,value: 'Connectors'},{key: 4,value: 'Direct/Employee/DSE'},{key: 5,value: 'Manufacturers'}];
    //                break;
    //   case '62':  [{key: 1,value: 'DSA'},{key: 2,value: 'Dealers'},{key: 3,value: 'Connectors'},{key: 4,value: 'Direct/Employee/DSE'},{key: 5,value: 'Manufacturers'}];lity Branch Code'}];
    //                break; 
    //   case '63': this.ProfessionList = [{key: 1,value: 'Corporate Website'},{key: 2,value: 'Internet Banking'},{key: 3,value: 'Mobile Banking'}];
    //                break;
    //   default: this.ProfessionList = [{key: 1,value: 'Not Applicable'}];
    //                break;                                      
    // }
    //   },10);
    // });
   if(this.SourcingChange == 61){
     this.ProfessionList= [{key: 1,value: 'DSA'},{key: 2,value: 'Dealers'},{key: 3,value: 'Connectors'},{key: 4,value: 'Direct/Employee/DSE'},{key: 5,value: 'Manufacturers'}];
     this.text="Employee Code"
   }
   else if(this.SourcingChange== 62){
        this.ProfessionList=[{key: 1, value: "Liability Branch Code" }];
              this.text= "Employee Code"
   }
   else if(this.SourcingChange== 63){
     this.ProfessionList= [{key: 1,value: 'Corporate Website'},{key: 2,value: 'Internet Banking'},{key: 3,value: 'Mobile Banking'}];
     this.text="Employee Code"
   }
   else if(this.SourcingChange==64)
    {
      this.ProfessionList = [{key: 1,value: 'Not Applicable'}];
      this.text = "Campaign Code";
      
    }
    else{
      this.ProfessionList= [{key: 1,value: 'Not Applicable'}];
      this.text = "Employee Code";
    }
  }

  


  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelsData.getLanguageLabelData().subscribe(
        data => {
          this.labels = data[0];
        });
    } else {
      this.labelsData.getLabelsData().subscribe(
        data => {
          this.labels = data;
        });
    }
  }

  gotValue(e) {
    console.log(e.target.value);
  }


  onSubmit() {
    const formValue = this.createLeadForm.value;
    const leadModel: Lead = { ...formValue, professionList : this.ProfessionList };
    console.log(leadModel)
    this.leadStoreService.setLeadCreation(leadModel);
    const applicantModel = {
      first_name: leadModel.firstName,
      middle_name: leadModel.middleName,
      last_name: leadModel.lastName,
      mobile: leadModel.mobile,
      dateOfBirth : leadModel.dateOfBirth
    };
    this.leadStoreService.setCoApplicantDetails(applicantModel);
    this.router.navigate(['/pages/lead-creation/lead-dedupe']);
  }

}
