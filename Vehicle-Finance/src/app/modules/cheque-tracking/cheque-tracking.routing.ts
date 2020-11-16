import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChequeTrackingComponent } from './cheque-tracking.component';
import { WelomceLetterComponent } from '@modules/dde/cpc-maker/welomce-letter/welomce-letter.component';

import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { ChequeComponent } from './cheque.component';

const routes: Routes = [
   {
       path: ':leadId',
       component: ChequeComponent,
       children: [ {
        path: '',
        component: ChequeTrackingComponent
       },
    {
        path: 'welcome-letter',
        component: WelomceLetterComponent
    }]
   }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChequeTrackingRouterModule {}


