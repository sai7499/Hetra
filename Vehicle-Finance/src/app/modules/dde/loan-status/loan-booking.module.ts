import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { LoanStatusComponent } from './loan-status.component';
import { LoanBookingComponent } from './loan-booking/loan-booking.component';
import { LoanStatusRoutingModule } from './loan-status-routing.module';
// import { WelomceLetterComponent } from '../cpc-maker/welomce-letter/welomce-letter.component';
import { DeliveryOrderComponent } from '../cpc-maker/delivery-order/delivery-order.component';
import { DedupeCheckComponent } from './dedupe-check/dedupe-check.component';


@NgModule({
  declarations: [
    LoanStatusComponent,
    LoanBookingComponent,
    // WelomceLetterComponent,
    DeliveryOrderComponent,
    DedupeCheckComponent
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
    LoanBookingComponent,
    DeliveryOrderComponent
  ]
})
export class LoanBookingModule { }
