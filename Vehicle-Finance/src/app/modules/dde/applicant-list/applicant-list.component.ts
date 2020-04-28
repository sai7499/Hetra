import { Component ,OnInit} from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";

@Component({
    templateUrl: './applicant-list.component.html',
    styleUrls: ['./applicant-list.component.css']
})
export class ApplicantListComponent implements OnInit{
    labels: any = {};
 
  
    constructor( private labelsData: LabelsService) {}
  
    ngOnInit() {
      this.labelsData.getLabelsData().subscribe(
        data => {
          this.labels = data;
          // console.log(this.labels)
        },
        error => {
          console.log(error);
        }
      );
    }
}
