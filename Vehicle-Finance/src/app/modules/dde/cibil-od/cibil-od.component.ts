import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-cibil-od',
  templateUrl: './cibil-od.component.html',
  styleUrls: ['./cibil-od.component.css']
})
export class CibilOdComponent implements OnInit {
  labels: any;
  leadId: number;

  constructor(private location: Location,
    private route: Router,
    private labelService: LabelsService,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.getLeadId()
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
  navigatePage(){
    this.route.navigateByUrl(`/pages/dde/${this.leadId}/cibil-od-list`);
  }
  onBack() {
    this.location.back();
  }
  onNext() {
    this.route.navigateByUrl(`/pages/dde/${this.leadId}/score-card`);
  }
}
