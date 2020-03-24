import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  labels:any;

  constructor(private route: Router , private labelsData:LabelsService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data =>{
        this.labels = data
        // console.log(this.labels)
      },
      error =>{
        console.log(error);
        
      }
      
    )
  }

  onChange(){
    this.route.navigateByUrl('pages/lead-section/co-applicant')
  }
}
