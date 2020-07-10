import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViabilityListComponent } from '../viability-list/viability-list.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { ViabilityDetailsComponent } from '../vehicle-details/viability-details/viability-details.component';
import { ViabilityDashboardComponent } from './viability-dashboard.component';

const routes: Routes = [
  {
    path: ':leadId',
    component : ViabilityDashboardComponent,
    resolve: { leadData: LeadDataResolverService },
    children : [
      {
        path: 'viability-details/:collateralId',
        component: ViabilityDetailsComponent
      },
      {

          path: 'viability-list',
          component: ViabilityListComponent
        }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViabilityDashboardRoutingModule { }
