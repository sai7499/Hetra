import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-viability-checks-branch',
  templateUrl: './viability-checks-branch.component.html',
  styleUrls: ['./viability-checks-branch.component.css']
})
export class ViabilityChecksBranchComponent implements OnInit {

  leadDetails;
  itemsPerPage = 5;
  labels: any = {};
  q;

  constructor(private labelsData: LabelsService) {
    this.leadDetails = [
      {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000002, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000003, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000004, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'},
      {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'PD', history: 'test'}
    ];
  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
  }

}
