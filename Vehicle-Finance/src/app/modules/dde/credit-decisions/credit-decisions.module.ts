import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component';
import {CreditDecisionRouterModule} from './credit-decision.routing';
import {CreditDecisionComponent} from './credit-decision.component';
import {TermSheetComponent} from './term-sheet/term-sheet.component';
import { SanctionDetailsComponent } from './sanction-details/sanction-details.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { CheckListComponent } from './check-list/check-list.component';

@NgModule({
  declarations: [
    CreditDecisionComponent,
    TermSheetComponent,
    CreditConditionsComponent,
    SanctionDetailsComponent,
    CustomerFeedbackComponent,
    CheckListComponent,
  ],
  imports: [
    CommonModule,
    CreditDecisionRouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DdeSharedModule
  ],
  exports: [
    TermSheetComponent ,
    CreditConditionsComponent,
    SanctionDetailsComponent,
    CustomerFeedbackComponent,
    CheckListComponent,
    CreditConditionsComponent
  ]
})
export class CreditConditionModule { }
