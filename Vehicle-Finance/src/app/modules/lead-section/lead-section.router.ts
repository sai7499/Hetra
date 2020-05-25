import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadSectionComponent } from './lead-section.component';
import { VehicleDetailComponent } from './vehicle-details/vehicle-details.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { CoApplicantComponent } from './co-applicant/co-applicant.component';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';
import { AddvehicleComponent } from './addvehicle/addvehicle.component';
import { CreditScoreComponent } from './credit-score/credit-score.component';
import { ExactMatchComponent } from './exact-match/exact-match.component';
import { OtpSectionComponent } from './otp-section/otp-section.component';

const routes: Routes = [
  {
    path: 'co-applicant',
    component: CoApplicantComponent,
  },
  {
    path: '',
    component: LeadSectionComponent,
    children: [
      {
        path: '',
        component: SourcingDetailsComponent,
      },

      {
        path: 'vehicle-details',
        component: VehicleDetailComponent,
      },

      {
        path: 'applicant-details',
        component: ApplicantDetailsComponent,
      },

      {
        path: 'co-applicant',
        component: CoApplicantComponent,
      },

      {
        path: 'add-vehicle',
        component: AddvehicleComponent,
      },
      {
        path: 'credit-score',
        component: CreditScoreComponent,
      },
      {
        path: 'exact-match',
        component: ExactMatchComponent,
      },
      {
        path: 'otp-section',
        component: OtpSectionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadCreationRouterModule {}
