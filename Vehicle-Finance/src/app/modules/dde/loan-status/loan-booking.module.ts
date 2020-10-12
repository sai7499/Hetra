import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { LoanStatusComponent } from './loan-status.component';
import { LoanBookingComponent } from './loan-booking/loan-booking.component';
import { LoanStatusRoutingModule } from './loan-status-routing.module';
import { LoanTestComponent } from './loan-test/loan-test.component';

@NgModule({
  declarations: [
    LoanStatusComponent,
    LoanBookingComponent,
    LoanTestComponent,
  ],
  imports: [
    CommonModule,
    LoanStatusRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DdeSharedModule,
  ],
  exports: [
    LoanBookingComponent
  ]
})
export class LoanBookingModule { }
