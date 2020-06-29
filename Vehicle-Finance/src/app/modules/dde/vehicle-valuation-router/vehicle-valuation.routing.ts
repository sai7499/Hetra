import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleValuationRouterComponent } from './vehicle-valuation-router.component';
import { ValuationComponent } from './valuation/valuation.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';

const routes: Routes = [
  {
    path: ':leadId',
    component: VehicleValuationRouterComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: 'valuation/:colleteralId',
        component: ValuationComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleValuationRoutingModule { }
