import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FiCumPdReportComponent } from './fi-cum-pd-report.component';
import { FiCumPdReportRouterModule } from './fi-cum-pd-report.routing';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReferenceCheckComponent } from './reference-check/reference-check.component';
import { PdDashboardComponent } from './pd-dashboard/pd-dashboard.component';
import { PdReportModule } from '../pd-report/pd-report.module';

@NgModule({
  declarations: [
    // FlAndPdReportComponent,
    ApplicantDetailComponent,
    CustomerProfileDetailsComponent,
    LoanDetailsComponent,
    ReferenceCheckComponent,
    PdDashboardComponent,
    FiCumPdReportComponent,
    ApplicantDetailComponent,
    CustomerProfileDetailsComponent,
    LoanDetailsComponent, ReferenceCheckComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, FiCumPdReportRouterModule, SharedModule, DdeSharedModule, PdReportModule
  ],
})
export class FiCumPdReportModule { }
