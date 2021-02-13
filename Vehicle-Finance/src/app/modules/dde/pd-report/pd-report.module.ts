import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { PdReportComponent } from './pd-report.component';
import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PdReportRoutingModule } from './pd-report-routing';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [PersonalDetailsComponent, OtherDetailsComponent, ReferenceDetailsComponent, PdReportComponent, IncomeDetailsComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, PdReportRoutingModule, SharedModule, DdeSharedModule, AutocompleteLibModule
  ]
})
export class PdReportModule { }
