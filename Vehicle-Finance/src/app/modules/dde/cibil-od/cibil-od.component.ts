import { Component, OnInit, Output, EventEmitter,  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { OdDetailsService } from '@services/od-details.service';

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

  constructor(private location: Location,
    private router: Router,
    private labelService: LabelsService,
    private activatedRoute: ActivatedRoute,
    private odDetailsService:OdDetailsService,
  ) { }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.getLeadId()
    this.applicantUrl = `/pages/dde/${this.leadId}/cibil-od-list`
    this.userId = localStorage.getItem('userId');
    this.getParentOdDetails();
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
  getParentOdDetails(){
    const body = {
     leadId : this.leadId

    };
    this.odDetailsService.getOdApplicantList(body).subscribe((res: any) => {
        console.log('get od details by applicnat id........>',res)
        this.odApplicantList = res.ProcessVariables.applicantList
        console.log(this.odApplicantList);
        
      });
  }
  navigatePage(applicantId){
  console.log(
          'applicantId', 
          `${this.applicantUrl}/${applicantId}`
        );
  this.router.navigate([`${this.applicantUrl}/${applicantId}`]);
  }
  onBack() {
    this.location.back();
  }
  onNext() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/score-card`);
  }
}
