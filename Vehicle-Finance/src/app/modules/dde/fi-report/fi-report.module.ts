import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiReportRoutingModule } from './fi-report-routing.module';
import { FiReportComponent } from './fi-report/fi-report.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DdeSharedModule } from '../shared/shared.module';

import { TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { FiResidenceComponent } from './fi-residence/fi-residence.component';
import { FiBusinessComponent } from './fi-business/fi-business.component';

@NgModule({
  declarations: [FiReportComponent, FiResidenceComponent, FiBusinessComponent],
  imports: [
    CommonModule,
    FiReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DdeSharedModule,
    TimePickerModule

  ],
  exports: [FiReportComponent, FiResidenceComponent, FiBusinessComponent]
})
export class FiReportModule { }
