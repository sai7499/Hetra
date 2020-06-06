import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleDetailComponent } from '../lead-section/vehicle-details/vehicle-details.component';
import { LeadDataResolverService } from '../lead-section/services/leadDataResolver.service';

const routes: Routes = [
  {
    path: ':leadId',
    component: SalesComponent,
    children: [
      {
        path: 'lead-details',
        component: LeadDetailsComponent,
      },
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
      {
        path: 'vehicle-details',
        component: VehicleDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
