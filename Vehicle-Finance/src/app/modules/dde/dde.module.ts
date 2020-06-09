import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DdeSharedModule } from './shared/shared.module';
import { SharedModule } from '../shared/shared.module';
import { DdeComponent } from './dde.component';
import { DdeRoutingModule } from './dde.routing.module';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { FlReportComponent } from './fl-report/fl-report.component';
import { PdReportComponent } from './pd-report/pd-report.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { FleetDetailsComponent } from './fleet-details/fleet-details.component';
import { TrackVehicleComponent } from './track-vehicle/track-vehicle.component';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { CamComponent } from './cam/cam.component';

// import { DdeRoutingModule } from './dde.routing.module';
// import { DdeSharedModule } from './shared/shared.module';
import { ScoreCardComponent } from './score-card/score-card.component';
import {CreditConditionsComponent} from './credit-conditions/credit-conditions.component';
import { DeviationsComponent } from './deviations/deviations.component';
import { ViabilityListComponent } from './viability-list/viability-list.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { LeadSectionModule } from '@modules/lead-section/lead-section.module';

@NgModule({
  declarations: [
    DdeComponent,
    FlReportComponent,
    PdReportComponent,
    ViabilityListComponent,
    InsuranceDetailsComponent,
    PslDataComponent,
    SourcingDdeComponent,
    ExposureDetailsComponent,
    IncomeDetailsComponent,
    VehicleListComponent,
    FleetDetailsComponent,
    TrackVehicleComponent,
    InsuranceDetailsComponent,
    TvrDetailsComponent,
    CamComponent,
    ScoreCardComponent,
    CreditConditionsComponent,
    DeviationsComponent,
    VehicleValuationComponent,

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
    TypeaheadModule.forRoot()
  ],
})
export class DdeModule {}
