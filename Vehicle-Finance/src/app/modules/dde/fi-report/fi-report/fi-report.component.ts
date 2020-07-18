import { Component, OnInit } from '@angular/core';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fi-report',
  templateUrl: './fi-report.component.html',
  styleUrls: ['./fi-report.component.css']
})
export class FiReportComponent implements OnInit {

  labels: any = {};
  LOV: any = [];
  isDirty: boolean;
  leadId: number;

  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.getLOV();
    this.leadId = this.activatedRoute.snapshot.params.leadId;
    console.log(this.leadId);
  }

  async ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
  }


  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
  }

  onBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/fi-list'])

  }

  onSave() {

  }

  onNext() {
    this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

  }
}
