import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html',
  styleUrls: ['./new-leads.component.css']
})
export class NewLeadsComponent implements OnInit {

  newArray;
  newLeads;
  itemsPerPage = '5';
  totalItems;
  labels: any = {};
  // q;
  isCredit;
  lovData: any;
  count: any;
  currentPage: any;
  limit;
  pageNumber;
  from;

  constructor(
    private labelsData: LabelsService,
    private dashboardService: DashboardService,
    private VehicleDataStoreService: VehicleDataStoreService
  ) {
    // this.newLeads =  [
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

  getMyLeads(perPageCount, pageNumber?) {

    const data = {
      userId: localStorage.getItem('userId'),
      perPage: parseInt(perPageCount),
      currentPage: parseInt(pageNumber)
      // perPage: perPageCount,
      // currentPage: pageNumber
    };

    this.dashboardService.myLeads(data).subscribe((res: any) => {
      const response = res.ProcessVariables.loanLead;
      console.log(response, 'response');
      this.newArray = response;
      this.limit = res.ProcessVariables.perPage;
      this.pageNumber = res.ProcessVariables.from;
      this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);

      this.currentPage = res.ProcessVariables.currentPage;
      this.totalItems = res.ProcessVariables.totalPages;
      this.from = res.ProcessVariables.from;

    });
  }

  setPage(event) {
    this.getMyLeads(this.itemsPerPage, event);

  }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );

    this.isCredit = localStorage.getItem('roleType');
    // if (this.isCredit === '2') {
    //   this.getMyLeads();
    // } else {
    //   this.newArray = this.newLeads;
    // }
    this.getMyLeads(this.itemsPerPage);


  }

  getLeadIdSales(Id) {
    this.VehicleDataStoreService.setSalesLeadID(Id)
  }

  getLeadId(id) {
    console.log(id, 'Id')
    this.VehicleDataStoreService.setCreditLeadId(id)
  }

}
