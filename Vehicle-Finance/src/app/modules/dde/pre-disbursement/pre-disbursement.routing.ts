import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TermSheetComponent} from '../credit-decisions/term-sheet/term-sheet.component';
 import {PreDisbursementComponent} from './pre-disbursement.component';
// import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { SanctionDetailsComponent } from '../credit-decisions/sanction-details/sanction-details.component';
import { CreditConditionsComponent } from '../credit-conditions/credit-conditions.component';

const routes: Routes = [
    {
        path: ':leadId',
        component: PreDisbursementComponent,
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

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreDisbursementRouterModule { }
