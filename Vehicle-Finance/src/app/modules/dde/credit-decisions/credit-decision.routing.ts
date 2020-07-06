import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreditDecisionComponent} from './credit-decision.component';
import {CreditConditionsComponent} from '../credit-conditions/credit-conditions.component';
// import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';

const routes: Routes = [
    {
        path: ':leadId',
        component: CreditDecisionComponent,
        // resolve: { leadData: LeadDataResolverService },
        children: [
          {
               path: '',
               component: CreditConditionsComponent
          },
          {
            path: 'credit-condition',
            component: CreditConditionsComponent
       },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreditDecisionRouterModule { }
