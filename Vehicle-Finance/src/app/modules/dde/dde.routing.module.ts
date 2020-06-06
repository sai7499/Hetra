import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DdeComponent } from './dde.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { FleetDetailsComponent } from './fleet-details/fleet-details.component';
import { TrackVehicleComponent } from './track-vehicle/track-vehicle.component';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { FlReportComponent } from './fl-report/fl-report.component';
import { PdReportComponent } from './pd-report/pd-report.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { CamComponent } from './cam/cam.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { CreditConditionsComponent } from './credit-conditions/credit-conditions.component';
import { DeviationsComponent } from './deviations/deviations.component';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';

const routes: Routes = [
  {
    path: ':leadId',
    component: DdeComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: '',
        component: SourcingDdeComponent,
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
        path: 'track-vehicle',
        component: TrackVehicleComponent,
      },
      {
        path: 'lead-details',
        component: SourcingDdeComponent,
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
        path: 'fl-report',
        component: FlReportComponent,
      },
      {
        path: 'insurance-details',
        component: InsuranceDetailsComponent,
      },
      {
        path: 'pd-report',
        component: PdReportComponent,
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
        path: 'credit-conditions',
        component: CreditConditionsComponent,
      },
      {
        path: 'deviations',
        component: DeviationsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DdeRoutingModule {}
