import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales.module.routing';
import { DdeSharedModule } from '../dde/shared/shared.module';


@NgModule({
  imports: [
    SalesRoutingModule,
    DdeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [SalesComponent],
})
export class SalesModule {}
