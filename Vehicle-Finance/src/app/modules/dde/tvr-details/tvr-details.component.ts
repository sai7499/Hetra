import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

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
  constructor(
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tvrService: TvrDetailsService,
    private sharedService: SharedService
  ) { }

  async ngOnInit() {
    this.fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true
    }
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId();
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId);
    this.getTvrDetailsList();
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

  onBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-valuation']);
    this.sharedService.getTvrDetailsPrevious(true);
  }

  onNext() {
    if (this.fiCumPdStatus == false) {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
    } else if (this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

    }
  }

}
