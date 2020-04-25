import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { DdeSharedModule } from './shared/shared.module';
import { SharedModule } from '../shared/shared.module';
import { DdeComponent } from './dde.component';

import { ApplicantListComponent } from './applicant-list/applicant-list.component';

import { DdeRoutingModule } from './dde.routing.module';

import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { SharedModule } from '../shared/shared.module';
// import { CommonModule } from '@angular/common';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { ValuationComponent } from './valuation/valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { FlReportComponent } from './fl-report/fl-report.component';
import { PdReportComponent } from './pd-report/pd-report.component';


@NgModule({
    declarations: [ DdeComponent, ApplicantListComponent, FlReportComponent, PdReportComponent,
                    VehicleValuationComponent, ValuationComponent, PslDataComponent ,
                     SourcingDdeComponent, ExposureDetailsComponent, IncomeDetailsComponent],
    imports: [ DdeRoutingModule, CommonModule, NgxPaginationModule,  FormsModule,
               ReactiveFormsModule, SharedModule, DdeSharedModule ]
})
export class DdeModule {}
