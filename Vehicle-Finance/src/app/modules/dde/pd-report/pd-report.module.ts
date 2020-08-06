import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { PdReportComponent } from './pd-report/pd-report.component';
import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PdReportRoutingModule } from './pd-report-routing';
import { IncomeDetailsComponent } from './income-details/income-details.component';

@NgModule({
  declarations: [PersonalDetailsComponent, OtherDetailsComponent, ReferenceDetailsComponent, PdReportComponent, IncomeDetailsComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, PdReportRoutingModule, SharedModule, DdeSharedModule
  ]
})
export class PdReportModule { }
