import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fi-list',
  templateUrl: './fi-list.component.html',
  styleUrls: ['./fi-list.component.css']
})
export class FiListComponent implements OnInit {

  labels: any;

  constructor(
    private labelDetails: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

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

  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
  }

  async onClick() {

    const leadId = (await this.getLeadId()) as number;
    this.router.navigateByUrl(`pages/fi-list/${leadId}/fi-report`);
  }
}
