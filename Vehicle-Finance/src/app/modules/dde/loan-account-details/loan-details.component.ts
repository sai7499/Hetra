import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoanViewService } from '@services/loan-view.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

  loanAccountDetails: any;
  leadId: string;
  customerDetails: any;
  addressDetails: any;
  address: any;

  constructor(private loanViewService: LoanViewService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leadService: CreateLeadDataService
  ) { }

  ngOnInit() {
    const leadSectionData: any = this.leadService.getLeadSectionData();
    const applicantList = leadSectionData.applicantDetails;
    if (applicantList) {
      this.customerDetails = applicantList.find((value) => {
        return value.applicantTypeKey === 'APPAPPRELLEAD';
      });
    }


    // if (this.customerDetails && this.customerDetails.dob) {
    //   const date = new Date(this.customerDetails.dob);
    //   const day = date.getDate();
    //   const month = date.getMonth() + 1;
    //   const year = date.getFullYear();
    //   this.customerDetails.dob = `${day}/${month}/${year}`
    //   console.log('this.customerDetails.dob', this.customerDetails.dob)

    // }

    console.log('applicantList', applicantList);
    this.activatedRoute.parent.params.subscribe((value) => {
      this.leadId = value.leadId;
    });
    this.loanAccountDetails = this.loanViewService.getLoanAccountDetails();
    this.address = this.loanViewService.getLoanAccountAddress();
    if (this.address) {
      this.addressDetails = this.address[0];
      //       {{addressDetails?.line1 || 'NA'}}
      // {{addressDetails?.line2}}
      // {{addressDetails?.line3}}
      // {{addressDetails?.city}}
      // {{addressDetails?.state}} - {{addressDetails?.zip}}
      // {{addressDetails?.country}}
    }
    console.log('this.loanAccountDetails', this.loanAccountDetails);
    console.log('this.addressDetails', this.addressDetails);
  }

  onNext() {

    this.router.navigateByUrl(`/pages/dde/${this.leadId}`);

  }
}
