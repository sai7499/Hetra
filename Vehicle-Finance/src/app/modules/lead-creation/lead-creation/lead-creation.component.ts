import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';


@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];
  lovLabels = [];
  public labels:any = [];

  constructor( private lovData: LovDataService , private labelsData :LabelsService) {

    this.lovData.getLovData().subscribe((res: any) => {
      this.lovLabels = res[0].leadCreation[0];
    });

  }

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    // this.values = [
    //   { key: 1, value: 'Vechicle Finance' },
    //   { key: 2, value: 'Housing Finance' },
    //   { key: 3, value: 'Loan Against Property' }
    // ];

    this.labelsData.getLabelsData().subscribe( 
      data => {
        
        this.labels = data
        // console.log(this.labels.leadCreationTitle,this.labels.subventionApplied)
        // console.log(this.labels.businessDivision)
      }
      
    ) 
  }
  gotValue(e) {
    console.log(e.target.value);
  }

}
