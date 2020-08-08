import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TermSheetComponent} from './term-sheet/term-sheet.component';
import {CreditDecisionComponent} from './credit-decision.component';
import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { SanctionDetailsComponent } from './sanction-details/sanction-details.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { CheckListComponent } from './check-list/check-list.component';
import {TermSheetFromDashboardComponent} from './term-sheet-from-dashboard/term-sheet-from-dashboard.component'
const routes: Routes = [
    {
        path: ':leadId',
        component: CreditDecisionComponent,
        resolve: { leadData: LeadDataResolverService },
        children: [
            {
                path: '',
                component: CreditConditionsComponent
            },
            {
                path: 'credit-condition',
                component: CreditConditionsComponent
            },
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
            },
            {
                path: 'new-term-sheet',
                component : TermSheetFromDashboardComponent
              },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditDecisionRouterModule { }
