import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PdReportComponent } from './pd-report.component';
import { PdReportRouterModule } from './pd-report.routing';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReferenceCheckComponent } from './reference-check/reference-check.component';
import { PdListComponent } from '../pd-list/pd-list.component';

@NgModule({
  declarations: [
    // FlAndPdReportComponent,
    ApplicantDetailComponent,
    CustomerProfileDetailsComponent,
    LoanDetailsComponent,
    ReferenceCheckComponent,
    // PdDashboardComponent,
    PdReportComponent,
    ApplicantDetailComponent,
    CustomerProfileDetailsComponent,
    LoanDetailsComponent, ReferenceCheckComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, PdReportRouterModule, SharedModule, DdeSharedModule
  ],
  // exports: [PdListComponent]
})
export class PdReportModule { }
