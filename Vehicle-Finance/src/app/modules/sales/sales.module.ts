import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales.module.routing';
import { DdeSharedModule } from '../dde/shared/shared.module';
import { SharedModule } from '@shared/shared.module';

import { LeadSectionModule } from '../lead-section/lead-section.module';

@NgModule({
  imports: [
    SalesRoutingModule,
    DdeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    LeadSectionModule,
  ],
  declarations: [SalesComponent],
})
export class SalesModule {}
