import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.css']
})
export class NewLeadsComponent implements OnInit {

  newArray;
  itemsPerPage = 5;
  labels: any = {};
  q;
  isCredit: boolean;
  lovData: any;

  constructor(
    private labelsData: LabelsService,
    private dashboardSevice: DashboardService,
    private commonLovService: CommomLovService
    ) {
    // this.newArray =  [
    //   {leadId: 1000001, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000002, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000003, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000004, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000005, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000006, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000007, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000008, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000009, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000010, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000011, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000012, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000013, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000014, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000015, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000016, product: 'Used CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    //   {leadId: 1000017, product: 'New CV	', loanAmount: 500000, applicants: 2, createdOn: '26-Feb-2020	', createdBy: 'Aravind Kumar',
    //   priority: 'Yes', promoCode: 'PROMO001', status: 'Lead Created	', history: 'test'},
    // ];
   }

   ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );

    this.dashboardSevice.isCreditShow.subscribe(value => {
      this.isCredit = value;
    });
    this.getMyLeads();

  }

   getMyLeads() {
    this.dashboardSevice.myLeads().subscribe( (res: any) => {
    const response = res.ProcessVariables.loanLead;
    console.log('dash', response);
    console.log('res', res);

    this.newArray = response;
    });
  }

}
