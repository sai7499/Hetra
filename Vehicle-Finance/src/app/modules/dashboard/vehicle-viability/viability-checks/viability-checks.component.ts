import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viability-checks',
  templateUrl: './viability-checks.component.html',
  styleUrls: ['./viability-checks.component.css']
})
export class ViabilityChecksComponent implements OnInit {

  leadDetails;
  constructor() {
    this.leadDetails = [
      {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Declined', history: 'test'},
      {leadId: 1000002, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Declined', history: 'test'},
      {leadId: 1000003, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Declined', history: 'test'},
      {leadId: 1000004, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Declined', history: 'test'},
      {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Declined', history: 'test'}
    ];
  }

  ngOnInit() {
  }

}
