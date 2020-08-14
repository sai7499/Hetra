import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DdeSharedModule } from './shared/shared.module';
import { SharedModule } from '../shared/shared.module';
import { DdeComponent } from './dde.component';
import { DdeRoutingModule } from './dde.routing.module';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { FleetDetailsComponent } from './fleet-details/fleet-details.component';
import { TrackVehicleComponent } from './track-vehicle/track-vehicle.component';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { CamComponent } from './cam/cam.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
// import { ViabilityDetailsComponent } from './vehicle-details/viability-details/viability-details.component';

import { ScoreCardComponent } from './score-card/score-card.component';
// import {CreditConditionsComponent} from './credit-conditions/credit-conditions.component';
import { DeviationsComponent } from './deviations/deviations.component';
// import { ViabilityListComponent } from './viability-list/viability-list.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { LeadSectionModule } from '@modules/lead-section/lead-section.module';
import { NumberOnlyDirective } from '@services/directives/number-only.directive';
import { CibilOdComponent } from './cibil-od/cibil-od.component';
import { CibilOdListComponent } from './cibil-od-list/cibil-od-list.component';
import { FiCumPdReportModule } from './fi-cum-pd-report/fi-cum-pd-report.module';
import { ViabilityDashboardModule } from './viability-dashboard/viability-dashboard.module';
import { FiListComponent } from './fi-list/fi-list.component';
import { CreditConditionModule } from './credit-decisions/credit-decisions.module';
import { PdReportModule } from './pd-report/pd-report.module';
import { PdListComponent } from './pd-list/pd-list.component';
import { FiReportModule } from './fi-report/fi-report.module';
import { ChequeTrackingComponent} from './cheque-tracking/cheque-tracking.component'
// import { PdReportComponent } from './pd-report/pd-report.component';

@NgModule({
  declarations: [
    DdeComponent,
    // PdReportComponent,
    // ViabilityListComponent,
    // ViabilityListComponent,
    InsuranceDetailsComponent,
    PslDataComponent,
    ExposureDetailsComponent,
    IncomeDetailsComponent,
    VehicleListComponent,
    FleetDetailsComponent,
    TrackVehicleComponent,
    InsuranceDetailsComponent,
    TvrDetailsComponent,
    CamComponent,
    ScoreCardComponent,
    // CreditConditionsComponent,
    DeviationsComponent,
    VehicleValuationComponent,
    // ViabilityDetailsComponent,
    CibilOdComponent,
    CibilOdListComponent,
    FiListComponent,
    PdListComponent,
    ChequeTrackingComponent


  ],
  imports: [
    DdeRoutingModule,
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DdeSharedModule,
    LeadSectionModule,
    DateInputsModule,
    FiCumPdReportModule,
    PdReportModule,
    CreditConditionModule,
    ViabilityDashboardModule,
    FiReportModule
  ],
  exports: [ViabilityDashboardModule, CreditConditionModule, ChequeTrackingComponent]
})
export class DdeModule { }
