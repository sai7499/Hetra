import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {

  public labels: any = {};
  public errorMsg: any = '';
  public isDirty: boolean;
  public applicantLov: any = [];
  leadId: any;

  constructor(private labelsData: LabelsService,
    private _fb: FormBuilder, private router: Router,
    private lovDataService: LovDataService,
    private activatedRoute: ActivatedRoute,
    private commomLovService: CommomLovService) { }
  async ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
      this.initForm();

      this.leadId = (await this.getLeadId()) as number;
  
      this.getLOV();
      this.lovDataService.getLovData().subscribe((value: any) => {
        this.applicantLov = value ? value[0].applicantDetails[0] : {};
      });
  }

  initForm() {

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

  getLOV() {

  }

}
