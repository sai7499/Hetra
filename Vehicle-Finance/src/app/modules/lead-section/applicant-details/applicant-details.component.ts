import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  onChange(){
    this.route.navigateByUrl('pages/lead-section/co-applicant')
  }
}
