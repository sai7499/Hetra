import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import {TermSheetFromDashboardComponent} from './term-sheet-from-dashboard/term-sheet-from-dashboard.component';
import { NegotiationComponent } from '@modules/negotiation/negotiation.component';
import { NegotiationModule } from '@modules/negotiation/negotiation.module';
import { DisbursementSectionModule } from '@modules/disbursement-section/disbursement-section.module';
import { DdeModule } from '../dde.module';
import { CamComponent } from '../cam/cam.component';
import { DeviationsComponent } from '../deviations/deviations.component';
// import { CpcMakerModule } from '../cpc-maker/cpc-maker.module';
import { RemarksComponent } from '../../dde/cpc-maker/remarks/remarks.component';

@NgModule({
  declarations: [
    CreditDecisionComponent,
    TermSheetComponent,
    CreditConditionsComponent,
    SanctionDetailsComponent,
    CustomerFeedbackComponent,
    CheckListComponent,
    TermSheetFromDashboardComponent,
    // NegotiationComponent
    CamComponent,
    DeviationsComponent,
    RemarksComponent
  ],
  imports: [
    CommonModule,
    CreditDecisionRouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DdeSharedModule,
    NegotiationModule,
    DisbursementSectionModule,

  ],
  exports: [
    TermSheetComponent ,
    CreditConditionsComponent,
    SanctionDetailsComponent,
    CustomerFeedbackComponent,
    CheckListComponent,
    TermSheetFromDashboardComponent,
    CreditConditionsComponent,
    RemarksComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CreditConditionModule { }
