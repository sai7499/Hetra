import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { LeadDataResolverService } from '../lead-section/services/leadDataResolver.service';

const routes: Routes = [
  {
    path: ':leadId',
    component: SalesComponent,
    children: [
      {
        path: '',
        component: ApplicantListComponent,
      },
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
