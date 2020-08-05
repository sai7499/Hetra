import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiReportRoutingModule } from './fi-report-routing.module';
import { FiReportComponent } from './fi-report/fi-report.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DdeSharedModule } from '../shared/shared.module';
import { FiReportResidenceComponent } from './fi-residence/fi-report-residence.component';
import { FiReportOfficeComponent } from './fi-business/fi-report-office.component';
import { TimePickerModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  declarations: [FiReportComponent, FiReportResidenceComponent, FiReportOfficeComponent],
  imports: [
    CommonModule,
    FiReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DdeSharedModule,
    TimePickerModule

  ]
})
export class FiReportModule { }
