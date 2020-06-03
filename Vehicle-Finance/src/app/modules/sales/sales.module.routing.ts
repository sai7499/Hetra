import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleDetailComponent } from '../lead-section/vehicle-details/vehicle-details.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
      {
        path: 'vehicle-details',
        component: VehicleDetailComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
