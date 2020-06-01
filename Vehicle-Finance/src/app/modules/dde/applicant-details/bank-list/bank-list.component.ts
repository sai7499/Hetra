import { Component } from '@angular/core';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './bank-list.component.html',
    styleUrls: ['./bank-list.component.css']
})

export class BankListComponent {
    bankDetails: any;
    constructor( private bankService: BankTransactionsService, private route: Router) {}
    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
        this.bankService.getBankList({leadId: 3}).subscribe((res: any) => {
            this.bankDetails = res.ProcessVariables.applicantBankDetails;
            console.log(this.bankDetails);
        });
    }
    routeDetails(data: any) {
        const id = {
            applicantId : Number(data),
            formType: 'edit'
        };
        this.route.navigate(['pages/applicant-details/bank-details'], {queryParams: id, skipLocationChange: true, });
        console.log(id);
    }

}
