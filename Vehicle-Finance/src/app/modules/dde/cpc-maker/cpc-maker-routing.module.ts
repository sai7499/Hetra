import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditDecisionComponent } from '@modules/dashboard/credit-decision/credit-decision.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { CreditConditionsComponent } from '../credit-conditions/credit-conditions.component';
import { TermSheetComponent } from '../credit-decisions/term-sheet/term-sheet.component';
import { SanctionDetailsComponent } from '../credit-decisions/sanction-details/sanction-details.component';
import { CustomerFeedbackComponent } from '../credit-decisions/customer-feedback/customer-feedback.component';
import { CheckListComponent } from '../credit-decisions/check-list/check-list.component';
import { CpcMakerDdeComponent } from './cpc-maker-dde/cpc-maker-dde.component';
import { PdcDetailsComponent } from './pdc-details/pdc-details.component';
import { NegotiationComponent } from '@modules/negotiation/negotiation.component';
import { DisbursementFormComponent } from '@modules/disbursement-section/disbursement-form/disbursement-form.component';
import { WelomceLetterComponent } from './welomce-letter/welomce-letter.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { RemarksComponent } from './remarks/remarks.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: CpcMakerDdeComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
        {
            path: '',
            component: TermSheetComponent
        },
        // {
        //     path: 'credit-condition',
        //     component: CreditConditionsComponent
        // },
        {
            path: 'term-sheet',
            component: TermSheetComponent
        },
        {
            path: 'sanction-details',
            component: SanctionDetailsComponent
        },
        {
            path: 'customer-feedback',
            component: CustomerFeedbackComponent
        },
        {
            path: 'check-list',
            component: CheckListComponent
        } ,
        {
            path: 'pdc-details',
            component: PdcDetailsComponent
        },
        {
            path: 'negotiation',
            component: NegotiationComponent
        },
        {
            path: 'disbursement',
            component: DisbursementFormComponent
        },
		{
            path: 'remarks',
            component: RemarksComponent
        },
        // {
        //     path: 'delivery-order',
        //     component: DeliveryOrderComponent
        // }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpcMakerRoutingModule { }
