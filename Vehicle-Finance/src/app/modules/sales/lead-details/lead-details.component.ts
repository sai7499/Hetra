import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.css'],
})
export class LeadDetailsComponent implements OnInit {
  ngOnInit() {
    console.log('LeadDetailsComponent');
  }
  nextToApplicant() {
    console.log('nextToApplicant');
  }
}
