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
  constructor(
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tvrService: TvrDetailsService
    ) { }

  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId();
    this.getTvrDetails();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          console.log(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getTvrDetails() {
    this.tvrService.getTvrDetails().subscribe((res: any) => {
      this.tvrData = res.ProcessVariables.tvr;
      // console.log(this.tvrData);
      this.tableData = this.tvrData;
    });
  }

  async onViewClick() {
    const leadId = (await this.getLeadId()) as number;
    this.router.navigateByUrl(`pages/tele-verification-form/${leadId}`);
  }

}
