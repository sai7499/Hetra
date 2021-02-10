import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-tvr-details',
  templateUrl: './tvr-details.component.html',
  styleUrls: ['./tvr-details.component.css']
})
export class TvrDetailsComponent implements OnInit {

  labels: any = {};
  leadId;
  tvrData;
  tableData: any;
  tvrList: any;
  applicantId;
  fiCumPdStatusString: string;
  fiCumPdStatus: boolean;
  productCatCode: string;
  isLoan360: boolean;
  tabName : any = {};

  isChildLoan: any;
  productId: any;

  constructor(
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tvrService: TvrDetailsService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private loanViewService: LoanViewService
  ) { }

  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.tabName = this.sharedService.getTabName();
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId();
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId);
    this.getTvrDetailsList();
    this.getLeadSectiondata();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  // getting TVR applicant details method
  getTvrDetailsList() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId')
    };
    this.tvrService.getTvrDetailsList(data).subscribe((res: any) => {
      this.tvrList = res.ProcessVariables.tvrApplicantsList;
      console.log('TVR-Dashboard_list', this.tvrList);
    });

  }

  async onViewClick(applicantId: string, applicantType: string) {

    const leadId = (await this.getLeadId()) as number;
    this.router.navigateByUrl(`pages/tvr-details/${leadId}/tele-verification-form/${applicantType}/${applicantId}`);
  }

  //GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    if (leadData['leadDetails']) {
      this.isChildLoan = leadData['leadDetails'].isChildLoan;
      this.productId = leadData['leadDetails'].productId;
    }
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);
  }

  onBack() {
    // if (this.productCatCode != 'NCV') {
    //   this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-valuation']);
    //   // this.sharedService.getTvrDetailsPrevious(true);
    //   this.sharedService.getPslDataNext(false);
    // } else if (this.productCatCode == 'NCV' || this.productCatCode == 'UC') {
    //   this.router.navigate(['pages/dde/' + this.leadId + '/psl-data']);
    //   // this.sharedService.getTvrDetailsPrevious(true);
    //   this.sharedService.getPslDataNext(false);
    // }

    if (this.isChildLoan === '1') {
      if ((this.productId === '1078') || (this.productId === '1079') || (this.productId === '1080')) {
        this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
      } else {
        this.router.navigate(['pages/dde/' + this.leadId + '/psl-data']);
      }
    } else if ((this.isChildLoan === '0')) {
   
    if (this.productCatCode == 'UCV' || this.productCatCode == 'UC') {
      this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-valuation']);
      // this.sharedService.getTvrDetailsPrevious(true);
      
    }else{
      this.router.navigate(['pages/dde/' + this.leadId + '/psl-data']);
    }
  }
    this.sharedService.getPslDataNext(false);


  }

  onNext() {
    // if (this.isLoan360) {
    //   return this.router.navigateByUrl(`pages/dde/${this.leadId}/viability-list`)
    // }
    if (this.productCatCode == 'UC') {
      this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);
    } else {
      if (this.tabName['isFI']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
      } else if (this.tabName['isPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isFiCumPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isVV']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);
      }else {
        this.router.navigate(['pages/dde/' + this.leadId + '/cibil-od']);
      }
    }

  }

}
