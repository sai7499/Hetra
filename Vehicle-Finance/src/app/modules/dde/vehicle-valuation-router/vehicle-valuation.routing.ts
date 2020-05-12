import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleValuationRouterComponent } from './vehicle-valuation-router.component';
import { ValuationComponent } from './valuation/valuation.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleValuationRouterComponent,
    children: [
      {
        path: 'valuation',
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
