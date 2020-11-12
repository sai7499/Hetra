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
import { LeadDataResolverService } from './services/leadDataResolver.service';
import { SalesExactMatchComponent } from '@shared/sales-exact-match/sales-exact-match.component';
import { CanActivateService } from '@services/can-activate.service';

const routes: Routes = [
  {
    path: ':leadId/co-applicant/:applicantId',
    component: CoApplicantComponent,
    resolve: { leadData: LeadDataResolverService },
  },
  {
    path: ':leadId/co-applicant',
    component: CoApplicantComponent,
    resolve: { leadData: LeadDataResolverService },
  },
  {
    path: ':leadId/sales-exact-match',
    component: SalesExactMatchComponent,
    resolve: { leadData: LeadDataResolverService },
  },
  {
    path: ':leadId',
    component: LeadSectionComponent,
    // canActivate: [CanActivateService],
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: '',
        component: SourcingDetailsComponent,
      },

      {
        path: 'vehicle-list',
        component: VehicleDetailComponent,
      },

      {
        path: 'applicant-details',
        component: ApplicantDetailsComponent,
      },

      // {
      //   path: 'co-applicant',
      //   component: CoApplicantComponent,
      // },
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
        path: 'otp-section/:id',
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
