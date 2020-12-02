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

    constructor( private loanViewService: LoanViewService,
                 private router: Router,
                 private activatedRoute: ActivatedRoute,
                 private leadService: CreateLeadDataService
               ) {}

    ngOnInit() {
      const leadSectionData: any = this.leadService.getLeadSectionData();
      const applicantList = leadSectionData.applicantDetails;
      this.customerDetails = applicantList.find((value) => {
        return value.applicantTypeKey === 'APPAPPRELLEAD';
      });

      if (this.customerDetails.dob) {
        const date = new Date(this.customerDetails.dob);
        const day = date.getDate();
        const month  = date.getMonth() + 1;
        const year = date.getFullYear();
        this.customerDetails.dob = `${day}/${month}/${year}`
      }
      
      console.log('applicantList', applicantList);
      this.activatedRoute.parent.params.subscribe((value) => {
              this.leadId = value.leadId;
      });
      this.loanAccountDetails = this.loanViewService.getLoanAccountDetails();
      console.log('this.loanAccountDetails', this.loanAccountDetails);
    }

    onNext() {

        this.router.navigateByUrl(`/pages/dde/${this.leadId}`);

    }
}
