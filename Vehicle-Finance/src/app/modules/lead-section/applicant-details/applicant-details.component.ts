import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { LovDataService } from '@services/lov-data.service';
import { element } from 'protractor';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  labels: any = {};
  applicantDetails = [];
  isAlert : boolean = true
  values : any

  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService,private lovData: LovDataService,) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log('test', this.labels);
      },
      error => {
        console.log(error);
      });
      this.lovData.getLovData().subscribe((res: any) => {
        console.log(res, 'res');
        this.values = res[0].addApplicant[0];
        console.log(this.values, 'values');
        this.values.entity= res[0].addApplicant[0].entity
        console.log('value Entity', this.values.entity)
        
      });
    this.getData();
  }

  getData() {
    this.applicantDetails = this.leadStoreService.getApplicantList();
    console.log('applicant Details', this.applicantDetails);
    // console.log(this.applicantDetails[0].entity)

    // this.applicantDetails.findIndex(x => x.entity === this.values.entity.forEach(element=>{
    //   if(parseInt(x.entity)=== element.key){
    //     x.entity = element;
    //     console.log(x.entity)
    //   }
    // }))
    
  }
  onSubmit(){
    this.isAlert= false
    setTimeout(() => {
      this.isAlert=true
    },1000);
  }
  onChange() {
    this.route.navigateByUrl('pages/lead-section/co-applicant');
  }

  editApplicant(index: number) {
    console.log(index);
    this.route.navigate(['pages/lead-section/co-applicant', {id: index}]);
  }

  deleteApplicant(index: number){
console.log(index);
this.leadStoreService.deleteApplicant(index);
  }
}
