import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-lead-dedupe',
  templateUrl: './lead-dedupe.component.html',
  styleUrls: ['./lead-dedupe.component.css']
})
export class LeadDedupeComponent implements OnInit {
  labels: any = {};

  isReason: boolean;
  isSubmit: boolean;
  isChecked: boolean;
  isModal: boolean;
  count = 0;

  p: number = 1;
  perPage: number = 5;

  dummmyArray = [];

  constructor( private labelsData: LabelsService) {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log('labels',this.labels)
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
    this.dummy();
  }

  OnProceed() {
    this.isReason = false;
    this.isSubmit = false;
  }

  OnReject() {
    this.isReason = true;
    this.isSubmit = true;
  }

  OnCreateNew(){

  }

  OnChecked(e) {    
   const seleted = e.target.checked;
   if(seleted){
     this.count++;
   }
   else{
     this.count--;
   }
   this.isChecked = this.count !=0 ? true : false;
   console.log(this.isChecked);   
  }

  OnItemPerPage(e) {
    this.perPage = e.target.value;
    console.log(this.perPage)
  }

  OnSubmit(){
    this.isModal = true;   
  }

  dummy() {
    for (let i = 0; i <= 500; i++) {
      this.dummmyArray.push({
        applicantId: `${i}`,
        loanCreatedBy: " person",
        createdDate: "05-03-2020",
        leadId: "11257009",
        branch: "chennai",
        businessDivision: "Vehicle Finance",
        product: "New CV",
        loanAmount: "500000",
        stage: "Lead Creation",
        status: "rej or App",
        reason: "Not Submitted",
        applicantName: "Mathew",
        mobile: "8282828145"
      })
    }
  }

  closeModal(){
    this.isModal = false
  }
}
