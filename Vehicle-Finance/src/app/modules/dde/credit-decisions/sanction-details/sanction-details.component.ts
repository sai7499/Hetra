import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sanction-details',
  templateUrl: './sanction-details.component.html',
  styleUrls: ['./sanction-details.component.css']
})
export class SanctionDetailsComponent implements OnInit {
leadId;

labels: any = {};

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      // (error) => console.log("Sanction-Details Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log("LEADID::::", this.leadId);
  }

  onNext() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
  }

  onBack() {
    this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
  }

}
