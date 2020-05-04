import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-declined-leads-with-me',
  templateUrl: './declined-leads-with-me.component.html',
  styleUrls: ['./declined-leads-with-me.component.css']
})
export class DeclinedLeadsWithMeComponent implements OnInit {
  constructor() {}

  data = [
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000101, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000021, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000020, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000018, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },
    {
      leadId: 1000017, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
      priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'
    },

  ];
  displayedColumns: string[] = ['action', 'leadId', 'product', 'loanAmount', 'applicants',
    'createdOn', 'createdBy', 'priority', 'promoCode', 'status', 'history'];
  size = 5;
  pageIndex = 0;
  dataSource: any;

  ngOnInit() {
    this.dataSource = this.data.slice(0, 5);
  }

  paginate(event: any) {
    console.log(this.dataSource);
    if (event === 0) {
      event = 1;
    }
    this.pageIndex = event;
    this.dataSource = this.data.slice(event * this.size - this.size, event * this.size);
  }

}
