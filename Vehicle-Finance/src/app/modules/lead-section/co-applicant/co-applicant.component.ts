import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-co-applicant',
  templateUrl: './co-applicant.component.html',
  styleUrls: ['./co-applicant.component.css']
})
export class CoApplicantComponent implements OnInit {

  labels:any;

  applicantType : string = 'individual'

  selectApplicantType(event:any){

    this.applicantType = event.target.value;

    // console.log(this.applicantType)


  }

  constructor( private labelsData:LabelsService) {
   }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe( 
      data => {
        
        this.labels = data
        // console.log(this.labels.leadCreationTitle,this.labels.subventionApplied)
      },
      error => {

        console.log(error);
        

      }
      
    ) 




  }

}
