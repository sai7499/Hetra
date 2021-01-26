import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TermSheetComponent} from './term-sheet/term-sheet.component';
import {CreditDecisionComponent} from './credit-decision.component';
import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { SanctionDetailsComponent } from './sanction-details/sanction-details.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { CheckListComponent } from './check-list/check-list.component';
import { NegotiationComponent } from '@modules/negotiation/negotiation.component';
import {TermSheetFromDashboardComponent} from './term-sheet-from-dashboard/term-sheet-from-dashboard.component';
import { DisbursementFormComponent } from '@modules/disbursement-section/disbursement-form/disbursement-form.component';
import { CamComponent } from '../cam/cam.component';
import { DeviationComponent } from '@modules/dashboard/deviation/deviation.component';
import { DeviationsComponent } from '../deviations/deviations.component';
import { RemarksComponent } from '../cpc-maker/remarks/remarks.component';

const routes: Routes = [
    {
        path: ':leadId',
        component: CreditDecisionComponent,
        resolve: { leadData: LeadDataResolverService },
        children: [
            // {
            //     path: '',
            //     component: CreditConditionsComponent
            // },
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
                path: 'negotiation',
                component : NegotiationComponent
            },
            {
                path: 'new-term-sheet',
                component : TermSheetFromDashboardComponent
            },
            {
                path: 'disbursement',
                component: DisbursementFormComponent
            },
            {
                path: 'cam',
                component: CamComponent
            },
            {
                path: 'deviations',
                component: DeviationsComponent
            },
            {
                path: 'remarks',
                component: RemarksComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditDecisionRouterModule { }
