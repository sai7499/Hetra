import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tvr-details',
  templateUrl: './tvr-details.component.html',
  styleUrls: ['./tvr-details.component.css']
})
export class TvrDetailsComponent implements OnInit {

  labels: any = {};
  leadId;
  constructor(
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId();
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

  async onViewClick() {
    const leadId = (await this.getLeadId()) as number;
    this.router.navigateByUrl(`pages/tele-verification-form/${leadId}`);
  }

}
