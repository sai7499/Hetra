import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicantDetailsComponent,
    children: [
      {
        path: 'basic-details',
        component: BasicDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantDetailsRoutingModule {}
