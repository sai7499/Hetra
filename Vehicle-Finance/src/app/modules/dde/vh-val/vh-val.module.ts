import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VhValRoutingModule } from './vh-val-routing';
import { ValuationComponent } from './valuation/valuation.component';
import { DdeSharedModule } from '../shared/shared.module';
import { SharedModule } from '@shared/shared.module';
import { VhValComponent } from './vh-val.component';

@NgModule({
  declarations: [VhValComponent, ValuationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DdeSharedModule,
    SharedModule,
    VhValRoutingModule
  ]
})
export class VhValModule { }
