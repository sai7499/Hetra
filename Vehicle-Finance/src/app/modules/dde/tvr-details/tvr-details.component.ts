import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';

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
  constructor(
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tvrService: TvrDetailsService
  ) { }

  async ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId();
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId);
    // this.getTvrDetails();
    this.getTvrDetailsList();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          // console.log(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getTvrDetailsList() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId')
    };
    this.tvrService.getTvrDetailsList(data).subscribe((res: any) => {
      this.tvrList = res.ProcessVariables.tvrApplicantsList;
      // this.applicantId = res.ProcessVariables.tvrApplicantsList[0].applicantId;
      console.log('TVR-Dashboard_list', this.tvrList);
    });

  }

  // getTvrDetails() {
  //   this.tvrService.getTvrDetails().subscribe((res: any) => {
  //     this.tvrData = res.ProcessVariables.tvr;
  //     console.log(this.tvrData);
  //     this.tableData = this.tvrData;
  //   });
  // }

  async onViewClick(applicantId: string, applicantType: string) {
    // console.log('on view click',event);

    const leadId = (await this.getLeadId()) as number;
    this.router.navigateByUrl(`pages/tvr-details/${leadId}/tele-verification-form/${applicantType}/${applicantId}`);
  }


}
