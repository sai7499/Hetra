import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DdeComponent } from './dde.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { FleetDetailsComponent } from './fleet-details/fleet-details.component';
import { TrackVehicleComponent } from './track-vehicle/track-vehicle.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { CamComponent } from './cam/cam.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { DeviationsComponent } from './deviations/deviations.component';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { SourcingDetailsComponent } from '@modules/lead-section/sourcing-details/sourcing-details.component';
import { ViabilityListComponent } from './viability-list/viability-list.component';
// import { ViabilityDetailsComponent } from './vehicle-details/viability-details/viability-details.component';
import { CibilOdComponent } from './cibil-od/cibil-od.component';
import { CibilOdListComponent } from './cibil-od-list/cibil-od-list.component';
import { FiListComponent } from './fi-list/fi-list.component';
import { PdListComponent } from './pd-list/pd-list.component';
import { PddDetailsComponent } from './pdd-details/pdd-details.component';
import { ChequeTrackingComponent } from './cheque-tracking/cheque-tracking.component';
import { LoanStatusComponent } from './loan-status/loan-status.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: DdeComponent,
    // canActivate: [CanActivateService],
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: '',
        // component: SourcingDetailsComponent,
        redirectTo: 'lead-details',
        pathMatch: 'full',
      },

      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
      {
        path: 'vehicle-list',
        component: VehicleListComponent,
      },
      {
        path: 'fleet-details',
        component: FleetDetailsComponent,
      },
      {
        path: 'track-vehicle/:id',
        component: TrackVehicleComponent,
      },
      {
        path: 'lead-details',
        component: SourcingDetailsComponent,
      },
      {
        path: 'income-details',
        component: IncomeDetailsComponent,
      },
      {
        path: 'exposure',
        component: ExposureDetailsComponent,
      },
      {
        path: 'insurance-details',
        component: InsuranceDetailsComponent,
      },
      {
        path: 'fi-list',
        component: FiListComponent,
      },
      {
        path: 'pd-list',
        component: PdListComponent,
      },
      {
        path: 'vehicle-valuation',
        component: VehicleValuationComponent,
      },
      {
        path: 'psl-data',
        component: PslDataComponent,
      },
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
      {
        path: 'tvr-details',
        component: TvrDetailsComponent,
      },
      {
        path: 'cam',
        component: CamComponent,
      },
      {
        path: 'score-card',
        component: ScoreCardComponent,
      },
      {
        path: 'viability-list',
        component: ViabilityListComponent,
      },
      {
        path: 'deviations',
        component: DeviationsComponent,
      },
      {
        path: 'cibil-od',
        component: CibilOdComponent,
      },
      {
        path: 'cibil-od-list/:applicantId',
        component: CibilOdListComponent,
      },
      {
        path: 'pdd-details',
        component: PddDetailsComponent,
      },
      {
        path: 'cheque-tracking',
        component: ChequeTrackingComponent,
      },
      {
        path: 'loan-status',
        component: LoanStatusComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DdeRoutingModule {}
