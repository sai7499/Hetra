import value from '*.json';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoanViewService } from '@services/loan-view.service';

@Component({
    templateUrl: './loan-view.component.html',
    styleUrls: ['./loan-view.component.css']
})
export class LoanViewComponent {

    leadId: number;

    constructor(private loanViewService: LoanViewService, private router: Router) {}

    viewLoan360() {
        this.leadId = 2689;
        this.loanViewService.isLoan360(true);
        this.loanViewService.getLoanDetails(this.leadId)
            .subscribe((value) => {
                console.log('loan 360', value);
                this.router.navigateByUrl(`/pages/dde/${this.leadId}`);
            });
    }

}
