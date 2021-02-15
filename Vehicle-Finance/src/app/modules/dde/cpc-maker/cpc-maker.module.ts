import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpcMakerRoutingModule } from './cpc-maker-routing.module';
import { CreditConditionsComponent } from '../credit-conditions/credit-conditions.component';
import { TermSheetComponent } from '../credit-decisions/term-sheet/term-sheet.component';
import { SanctionDetailsComponent } from '../credit-decisions/sanction-details/sanction-details.component';
import { CustomerFeedbackComponent } from '../credit-decisions/customer-feedback/customer-feedback.component';
import { CheckListComponent } from '../credit-decisions/check-list/check-list.component';
import { CpcMakerDdeComponent } from './cpc-maker-dde/cpc-maker-dde.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { CreditConditionModule } from '../credit-decisions/credit-decisions.module';
import { PdcDetailsComponent } from './pdc-details/pdc-details.component';
import { NegotiationModule } from '@modules/negotiation/negotiation.module';
import { DisbursementSectionModule } from '@modules/disbursement-section/disbursement-section.module';
import { WelomceLetterComponent } from './welomce-letter/welomce-letter.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { SearchPipe } from '@services/search.pipe';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
// import { RemarksComponent } from './remarks/remarks.component';

@NgModule({
  declarations: [
    CpcMakerDdeComponent,
    PdcDetailsComponent,
    // RemarksComponent,
    // WelomceLetterComponent,
    // DeliveryOrderComponent
    // CreditConditionsComponent,
    // TermSheetComponent,
    // SanctionDetailsComponent,
    // CheckListComponent,
    // CustomerFeedbackComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    CpcMakerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DdeSharedModule,
    CreditConditionModule,
    NegotiationModule,
    DisbursementSectionModule,
    AutocompleteLibModule
  ],
  exports: [
    CpcMakerDdeComponent,
    PdcDetailsComponent,
    // RemarksComponent
  ]
})
export class CpcMakerModule { }
