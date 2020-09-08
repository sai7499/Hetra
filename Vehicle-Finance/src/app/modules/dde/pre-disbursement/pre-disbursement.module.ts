import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {PreDisbursementComponent} from './pre-disbursement.component';
import{PreDisbursementRouterModule} from './pre-disbursement.routing';
@NgModule({
  declarations: [
    PreDisbursementComponent
    // NegotiationComponent
  ],
  imports: [
    ReactiveFormsModule,FormsModule,PreDisbursementRouterModule
  ],
  exports: [
    PreDisbursementComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PreDisbursementModule { }
