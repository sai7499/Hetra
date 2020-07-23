import { Component, OnInit } from '@angular/core';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FieldInvestigationService } from '@services/Fi/field-investigation.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';

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
  userId: any;
  applicantId: number;

  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fieldInvestigation: FieldInvestigationService,
    private loginStoreService: LoginStoreService,
    private toasterService: ToasterService, // service for accessing the toaster

  ) {
    this.getLOV();
    this.isDirty = true;
    this.leadId = this.activatedRoute.snapshot.params.leadId;
    console.log(this.leadId);
  }

  async ngOnInit() {
    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    console.log('user id ==>', this.userId);

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.activatedRoute.params.subscribe((value) => { // calling get lead section data function in line 174
        if (!value && !value.applicantId) {
          return;
        }
        this.applicantId = Number(value.applicantId);
        console.log('Applicant Id In Fi Report Details Component', this.applicantId);

      });

    });
    this.getFiReportDetails();
  }


  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
  }


  initForm() {

    // fun that initilalizes the form group

  }

  getFiReportDetails() {
    const data = {
      // applicantId: this.applicantId,
      applicantId: 1177,
      userId: this.userId
    };
    this.fieldInvestigation.getFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('get fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {

      } else {
        this.toasterService.showError('', 'message');

      }
    });

  }

  // saveOrUpdateFiReportDetails() {

  //   const data = {
  //     // applicantId: this.applicantId,
  //     userId: this.userId
  //   };
  //   this.fieldInvestigation.getFiReportDetails(data).subscribe((res: any) => {
  //     const processVariables = res.ProcessVariables;
  //     console.log('get fi report response', processVariables);
  //     const message = processVariables.error.message;
  //     if (processVariables.error.code === '0') {

  //     } else {
  //       this.toasterService.showError('', 'message');

  //     }
  //   });

  // }

  onBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);

  }

  onSave() {

  }

  onNext() {
    this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

  }
}
