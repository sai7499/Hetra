import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import {CreditDecisionRouterModule} from './credit-decision.routing';
import {CreditDecisionComponent} from './credit-decision.component';
import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component'
@NgModule({
  declarations: [
    CreditDecisionComponent,
    CreditConditionsComponent
  ],
  imports: [
    CommonModule,CreditDecisionRouterModule, ReactiveFormsModule, FormsModule, SharedModule, DdeSharedModule
  ]
})
export class CreditConditionModule { }
