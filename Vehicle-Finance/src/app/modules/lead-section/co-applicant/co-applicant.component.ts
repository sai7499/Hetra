import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-co-applicant',
  templateUrl: './co-applicant.component.html',
  styleUrls: ['./co-applicant.component.css']
})
export class CoApplicantComponent implements OnInit {

  applicantType : string = 'individual'

  selectApplicantType(event:any){

    this.applicantType = event.target.value;

    // console.log(this.applicantType)


  }

  constructor() {
   }

  ngOnInit() {


  }

}
