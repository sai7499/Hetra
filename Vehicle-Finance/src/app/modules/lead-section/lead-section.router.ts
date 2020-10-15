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
import { DetectBrowserActivityService } from '@services/detect-browser-activity.service'


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
    canActivate: [DetectBrowserActivityService],
    children: [
      {
        path: '',
        component: SourcingDetailsComponent,
        canActivate: [DetectBrowserActivityService],
      },

      {
        path: 'vehicle-details',
        component: VehicleDetailComponent,
        canActivate: [DetectBrowserActivityService],
      },

      {
        path: 'applicant-details',
        component: ApplicantDetailsComponent,
        canActivate: [DetectBrowserActivityService],
      },

      // {
      //   path: 'co-applicant',
      //   component: CoApplicantComponent,
      // },
      {
        path: 'add-vehicle',
        component: AddvehicleComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'credit-score',
        component: CreditScoreComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'exact-match',
        component: ExactMatchComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'otp-section/:id',
        component: OtpSectionComponent,
        canActivate: [DetectBrowserActivityService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadCreationRouterModule {}
