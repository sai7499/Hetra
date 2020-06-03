import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { LovDataService } from '@services/lov-data.service';
import { element } from 'protractor';
import {ApplicantService} from '@services/applicant.service';
import {ApplicantList} from '@model/applicant.model';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  labels: any = {};
  applicantDetails = [];
  isAlert: boolean = true;
  values: any;
  applicantList: ApplicantList [] = [];
  p = 1;
  selectedApplicant: number;
  index: number;

  constructor(
    private route: Router,
    private location: Location,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService, private lovData: LovDataService,
    private applicantService: ApplicantService ) { }

  ngOnInit() {

    const currentUrl = this.location.path();

    console.log('currentUrl', currentUrl);

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
        this.values.entity = res[0].addApplicant[0].entity;
        console.log('value Entity', this.values.entity);

      });
    // this.getData();
    this.getApplicantList();
  }

  // getData() {
  //   this.applicantDetails = this.leadStoreService.getApplicantList();
  //   console.log('applicant Details', this.applicantDetails);
  //   // console.log(this.applicantDetails[0].entity)

  //   // this.applicantDetails.findIndex(x => x.entity === this.values.entity.forEach(element=>{
  //   //   if(parseInt(x.entity)=== element.key){
  //   //     x.entity = element;
  //   //     console.log(x.entity)
  //   //   }
  //   // }))
    
  // }

  getApplicantList() {
    const data = {
      leadId: 3,
    };
    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      console.log('Applicantlist', value);
      const processVariables = value.ProcessVariables;
      console.log('ProcessVariables', processVariables);
      this.applicantList = processVariables.applicantListForLead;
      console.log('applicantList', this.applicantList);
    });
  }
  
  onSubmit() {
    this.isAlert = false;
    setTimeout(() => {
      this.isAlert = true;
    }, 1500);
  }
  onChange() {
    this.route.navigateByUrl('pages/lead-section/co-applicant');
  }

  editApplicant(index: number) {
    console.log(index);
    this.route.navigate(['pages/lead-section/co-applicant', {id: index}]);
  }

  deleteApplicant(index: number) {
console.log(index);
this.leadStoreService.deleteApplicant(index);
  }

  softDeleteApplicant(index: number, applicantId: number) {
    const findIndex = this.p === 1 ? index : (this.p - 1) * 5 + index;
    this.index = findIndex;
    this.selectedApplicant = applicantId;
  }

  callDeleteApplicant() {
    const data = {
      applicantId: this.selectedApplicant,
    };
    this.applicantService.softDeleteApplicant(data).subscribe((res) => {
      console.log('res', this.selectedApplicant);
      this.applicantList.splice(this.index, 1);
    });
  }

}

