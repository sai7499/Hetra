import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {PreDisbursementComponent} from './pre-disbursement.component';
import{PreDisbursementRouterModule} from './pre-disbursement.routing';
import {CreditConditionModule} from '../credit-decisions/credit-decisions.module';
@NgModule({
  declarations: [
    PreDisbursementComponent
    // NegotiationComponent
  ],
  imports: [
    ReactiveFormsModule,CommonModule,SharedModule,FormsModule,PreDisbursementRouterModule,CreditConditionModule
  ],
  exports: [
    PreDisbursementComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PreDisbursementModule { }
