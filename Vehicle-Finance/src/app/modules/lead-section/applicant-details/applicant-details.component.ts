import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  labels: any = {};
  applicantDetails = [];
  isAlert : boolean = true

  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log('test', this.labels);
      },
      error => {
        console.log(error);
      });
    this.getData();
  }

  getData() {
    this.applicantDetails = this.leadStoreService.getApplicantList();
    // console.log('applicant array', applicants)
    // this.applicantDetails.push(applicants)
    console.log('applicant Details', this.applicantDetails);
    
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
    this.route.navigate(['pages/lead-section/co-applicant', {id: index}]);
  }
}
