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
import { LoanBookingComponent } from './loan-status/loan-booking/loan-booking.component';
import { ReferenceComponent } from '@modules/shared/reference/reference.component';
import { RcuComponent } from './rcu/rcu.component';
import { PSLdataComponent } from './psldata/psldata.component';

import { CreditConditionsComponent } from '@modules/dde/credit-conditions/credit-conditions.component';
import { SanctionDetailsComponent } from '@modules/dde/credit-decisions/sanction-details/sanction-details.component';
import { TermSheetComponent } from './credit-decisions/term-sheet/term-sheet.component';
import { WelomceLetterComponent } from './cpc-maker/welomce-letter/welomce-letter.component';
import { DeliveryOrderComponent } from './cpc-maker/delivery-order/delivery-order.component';
import { LoanDetailsComponent } from './loan-account-details/loan-details.component';

import { PddComponent } from '@shared/pdd-screen/pdd.component';
import { FipdPdfComponent } from './pdf-generate/fipd-pdf/fipd-pdf.component';
import { AdditionalCollateralListComponent } from './additional-collateral-list/additional-collateral-list.component';
import { ChartComponent } from '@modules/dashboard/chart/chart.component';

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
        path: 'additional-collateral-list',
        component: AdditionalCollateralListComponent
       },
      {
        path: 'reference',
        component: ReferenceComponent,
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
        component: PSLdataComponent,
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
        path: 'rcu-initiate',
        component: RcuComponent,
      },
      {
        path: 'rcu',
        component: RcuComponent,
      },
      {
        path: 'cam',
        component: CamComponent,
      },
      {
        path: 'chart',
        component: ChartComponent,
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
        path: 'loanbooking',
        component: LoanBookingComponent,
      },
      {
        path: 'negotiation',
        loadChildren: () =>
          import(
            '@modules/negotiation/negotiation.module'
          ).then((m) => m.NegotiationModule),
      },
      {
        path: 'credit-conditions',
        component: CreditConditionsComponent
      },
      {
        path: 'disbursement',
        loadChildren: () => import('@modules/disbursement-section/disbursement-section.module').then(m => m.DisbursementSectionModule)
      },
      {
        path: 'sanction-letter',
        component: SanctionDetailsComponent
      },
      {
        path: 'term-sheet',
        component: TermSheetComponent
      },
      {
        path: 'welcome-letter',
        component: WelomceLetterComponent
      },
      {
        path: 'delivery-order',
        component: DeliveryOrderComponent
      },
      {
        path: 'loan-details',
        component: LoanDetailsComponent
      },
      {
        path: 'pdd',
        component: PddComponent
      },
      {
        path: 'fiCumPd-pd-Pdf',
        component: FipdPdfComponent,
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DdeRoutingModule {}
