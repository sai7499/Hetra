import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursementSectionRouterModule } from './disbursement-section.router';
import { DisbursementSectionComponent } from './disbursement-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DisbursementFormComponent } from './disbursement-form/disbursement-form.component';
import { MatSelectModule } from '@angular/material';
@NgModule({
  declarations: [
    DisbursementSectionComponent,
    DisbursementFormComponent,
  ],
  imports: [
    CommonModule,
    DisbursementSectionRouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    MatSelectModule
  ],
  exports: [MatSelectModule],
})
export class DisbursementSectionModule { }
