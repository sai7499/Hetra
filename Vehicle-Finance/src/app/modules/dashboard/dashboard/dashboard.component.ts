import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  filterForm: FormGroup;
  showFilter;
  roleType;
  labels;
  validationData;
  isDirty: boolean;
  filterFormDetails: any;
  businessDivision: any;
  productCategoryList = [];
  productCategoryData: any;
  stageList = [];
  stageData: any;
  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private labelService: LabelsService,
    private utilityService: UtilityService
     ) { }

  ngOnInit() {
     this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
       this.roleType = value.roleType;
       this.businessDivision = value.businessDivision;
       console.log(value);
      });

     this.labelService.getLabelsData().subscribe(res => {
        this.labels = res;
        this.validationData = res.validationData;
      });

     this.filterForm = this.fb.group({
      leadId: [''],
      product: [''],
      leadStage: [''],
      fromDate: [''],
      toDate: [''],
      loanMinAmt: [''],
      loanMaxAmt: ['']
      });

     this.dashboardFilter();
  }

  dateToFormate(date) {
    return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
  }

  filteredData() {
    const data = {
      userId: localStorage.getItem('userId'),
      // tslint:disable-next-line: radix
      // perPage: parseInt(perPageCount),
      // tslint:disable-next-line: radix
      // currentPage: parseInt(pageNumber),
      leadId: this.filterFormDetails.leadId,
      fromDate: this.filterFormDetails.fromDate,
      toDate: this.filterFormDetails.toDate,
      product: this.filterFormDetails.product,
      sortByProduct: true
    };

    this.dashboardService.myLeads(data).subscribe((res: any) => {
      console.log('dashboard', res);
    });
  }

  // for getting productCatagory and leadStage
  dashboardFilter() {
    const data = {
      bizDiv: this.businessDivision
    };
    this.dashboardService.dashboardFilter(data).subscribe((res: any) => {
      console.log('get product catagory', res);
      this.productCategoryList = res.ProcessVariables.productCategory;
      this.productCategoryData = this.utilityService.getValueFromJSON(
        this.productCategoryList,
        'categoryCode',
        'categoryName'
      );

      this.stageList = res.ProcessVariables.stageList;
      this.stageData = this.utilityService.getValueFromJSON(
        this.stageList,
        'stageCode',
        'stageValue'
      );

    });
  }

  onClear() {
    this.filterForm.reset();
    this.dashboardService.filterData('');
  }

  onApply() {
    this.filterFormDetails = this.filterForm.value;
    this.filterFormDetails.fromDate = this.dateToFormate(this.filterFormDetails.fromDate);
    this.filterFormDetails.toDate = this.dateToFormate(this.filterFormDetails.toDate);
    console.log('filter form details', this.filterFormDetails);
    // this.filteredData();
    this.dashboardService.filterData(this.filterFormDetails);
  }

}
