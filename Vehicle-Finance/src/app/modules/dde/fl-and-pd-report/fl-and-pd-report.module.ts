import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FlAndPdReportComponent } from './fl-and-pd-report.component';
import { FlAndPdReportRouterModule } from './fl-and-pd-report.routing';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReferenceCheckComponent } from './reference-check/reference-check.component';

@NgModule({
  declarations: [
    FlAndPdReportComponent, 
    ApplicantDetailComponent, 
    CustomerProfileDetailsComponent, 
    LoanDetailsComponent, ReferenceCheckComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, FlAndPdReportRouterModule, SharedModule, DdeSharedModule
  ]
})
export class FlAndPdReportModule { }
