import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiReportRoutingModule } from './fi-report-routing.module';
import { FiReportComponent } from './fi-report/fi-report.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DdeSharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FiReportComponent],
  imports: [
    CommonModule,
    FiReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DdeSharedModule

  ]
})
export class FiReportModule { }
