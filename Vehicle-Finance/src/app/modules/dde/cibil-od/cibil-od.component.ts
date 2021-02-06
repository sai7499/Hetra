import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { OdDetailsService } from '@services/od-details.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
@Component({
  selector: 'app-cibil-od',
  templateUrl: './cibil-od.component.html',
  styleUrls: ['./cibil-od.component.css']
})
export class CibilOdComponent implements OnInit {
  labels: any;
  leadId: number;
  userId: string;
  odApplicantList: any;
  applicantUrl: string;
  isLoan360: boolean;
  udfScreenId: any;
  tabName: any;
  leadData: {};
  productCatCode: any;

  constructor(
    private router: Router,
    private labelService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private odDetailsService: OdDetailsService,
    private sharedService: SharedService,
    private loanViewService: LoanViewService,
    private createLeadDataService: CreateLeadDataService,
  ) { }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.tabName = this.sharedService.getTabName();
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.getLeadId();
    this.getLeadSectionData();
    this.applicantUrl = `/pages/dde/${this.leadId}/cibil-od-list`
    this.userId = localStorage.getItem('userId');
    this.getParentOdDetails();
    this.labelService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.bureauListDDE ;

    })
  }
  getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadData = { ...leadSectionData };
    this.productCatCode = this.leadData['leadDetails'].productCatCode;

  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }

  getParentOdDetails() {
    const body = {
      leadId: this.leadId

    };
    this.odDetailsService.getOdApplicantList(body).subscribe((res: any) => {
      this.odApplicantList = res.ProcessVariables.applicantList
    });
  }

  navigatePage(data) {
    console.log(data, 'navigate data')
    this.router.navigate([`${this.applicantUrl}/${data.applicantId}`]);
    // { queryParams: data, skipLocationChange: true }

    this.sharedService.getBureauDetail(data);
  }

  onBack() {
  if (this.tabName['isVV']) {
      this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);
    }else if (this.tabName['isFiCumPD']) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    }else if (this.tabName['isPD']) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
    }else if (this.tabName['isFI']) {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
    }else if (this.productCatCode == 'UC') {
      this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);
    }
    else {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/tvr-details`);
    }
    //this.router.navigateByUrl(`/pages/dde/${this.leadId}/viability-list`);
  }
  

  onNext() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/score-card`);
  }

}
