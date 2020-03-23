import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LovDataService } from 'src/app/services/lov-data.service';

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

  constructor( private lovData: LovDataService) {
    console.log('inside lead-creation', );
    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res[0]);
      this.lovLabels = res[0].leadCreation[0];
      console.log(this.values);
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
  }
  gotValue(e) {
    console.log(e.target.value);
  }

}
