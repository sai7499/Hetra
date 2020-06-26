import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';

@Component({
  selector: 'app-pd-report',
  templateUrl: './pd-report.component.html',
  styleUrls: ['./pd-report.component.css']
})
export class PdReportComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;
  pdList: [];
  leadId: number;

  constructor(private labelsData: LabelsService,
    private router: Router,
    private personalDiscussionService: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    console.log('Lead ID', this.leadId);
    this.getLabels = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.labels = data;
      },
        error => {
          this.errorMsg = error;
        });
    console.log("in pd report")
    this.getPdList();
  }

  getPdList() {
    const data = {
      leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      // leadId: this.leadId
      userId: '1002'
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processveriables = value.ProcessVariables;
      this.pdList = processveriables.finalPDList;
      console.log('PD List', this.pdList);
    });
  }

  navigatePage(applicantId: string) {
    console.log(
      'applicantId',
      applicantId,
    );
    const URL = `/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${applicantId}`;
    console.log('URL', URL);
    this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${applicantId}`]);
    // routerLink="/pages/fl-and-pd-report/applicant-detail"
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

  onFormSubmit() {
    this.router.navigate(['/pages/dde/pd-report']);
  }

}
