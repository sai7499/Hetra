import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-secsanctioned-leads-pending-with-me',
  templateUrl: './secsanctioned-leads-pending-with-me.component.html',
  styleUrls: ['./secsanctioned-leads-pending-with-me.component.css']
})
export class SecsanctionedLeadsPendingWithMeComponent implements OnInit {

  constructor() { }
  ELEMENT_DATA: any[] = [
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: "26-Feb-2020	", createdBy: "Aravind Kumar", 
   priority: "Yes", promoCode: "PROMO001", status: "Lead Created	", history: "test"},
 
 ];
 displayedColumns: string[] = ['action','leadId', 'product', 'loanAmount', 'applicants',
 'createdOn','createdBy','priority', 'promoCode','status','history'];
 dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 
 
 
   ngOnInit() {
     this.dataSource.paginator = this.paginator;
 
   }

}
