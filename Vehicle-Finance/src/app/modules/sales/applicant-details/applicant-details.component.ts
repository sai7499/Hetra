import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { Router} from '@angular/router'

@Component({
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit {
  locationIndex: number;
  applicantId ='';
  constructor(private location: Location,
              private applicantDataStoreservice : ApplicantDataStoreService,
              private router : Router) {}

  ngOnInit() {
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });
  }

  onNavigate(url : string){
    this.applicantId= this.applicantDataStoreservice.getApplicantId();
     this.router.navigate([url, this.applicantId])
  }

  getLocationIndex(url: string) {
    if (url.includes('basic-details')) {
      return 0;
    } else if (url.includes('identity-details')) {
      return 1;
    } else if (url.includes('address-details')) {
      return 2;
    } else if (url.includes('document-upload')) {
      return 3;
    }
  }
}
