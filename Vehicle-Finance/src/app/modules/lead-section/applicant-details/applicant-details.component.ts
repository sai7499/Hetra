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

  labels: any;
  applicantDetails = [];

  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data
        console.log('test', this.labels)
      },
      error => {
        console.log(error);
      })
    this.getData();
  }

  getData() {
    const applicants = this.leadStoreService.getCoApplicantDetails() || {}
    console.log('applicant array', applicants)
    this.applicantDetails.push(applicants)
  }

  onChange() {
    this.route.navigateByUrl('pages/lead-section/co-applicant')
  }
}
