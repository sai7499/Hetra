import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { OdDetailsService } from '@services/od-details.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
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

  constructor(
    private router: Router,
    private labelService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private odDetailsService: OdDetailsService,
    private sharedService: SharedService,
    private loanViewService: LoanViewService
  ) { }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.getLeadId()
    this.applicantUrl = `/pages/dde/${this.leadId}/cibil-od-list`
    this.userId = localStorage.getItem('userId');
    this.getParentOdDetails();
    this.labelService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.bureauListDDE ;

    })
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
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/viability-list`);
  }

  onNext() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/score-card`);
  }

}
