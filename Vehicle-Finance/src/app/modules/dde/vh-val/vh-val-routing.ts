import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VhValComponent } from './vh-val.component';
import { ValuationComponent } from './valuation/valuation.component';

const routes: Routes = [
  {
    path: '',
    component: VhValComponent,
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
export class VhValRoutingModule { }
