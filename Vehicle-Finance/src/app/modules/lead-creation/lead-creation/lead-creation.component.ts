import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];

  constructor() {
    console.log('inside lead-creation')

  }

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.values = [
      { key: 1, value: 'Vechicle Finance' }, 
      { key: 2, value: 'Housing Finance' }, 
      { key: 3, value: 'Loan Against Property' }
    ]
  }
  gotValue(e) {
    console.log(e.target.value);
  }

}
