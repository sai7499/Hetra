import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoanViewService } from '@services/loan-view.service';

@Component({
    templateUrl: './loan-details.component.html',
    styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

    loanAccountDetails: any;
    leadId: string;

    constructor( private loanViewService: LoanViewService,
                 private router: Router,
                 private activatedRoute: ActivatedRoute
               ) {}

    ngOnInit() {
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
