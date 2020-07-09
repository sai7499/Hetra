import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViabilityListComponent } from '../viability-list/viability-list.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { ViabilityDetailsComponent } from '../vehicle-details/viability-details/viability-details.component';

const routes: Routes = [
  {
    path: ':leadId',
    component : ViabilityListComponent,
    resolve: { leadData: LeadDataResolverService },
    children : [
      {
        path: 'viability-details',
        component: ViabilityDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViabilityDashboardRoutingModule { }
