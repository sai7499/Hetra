import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from "ngx-pagination";

import { SharedModule } from '../shared/shared.module';
import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { FlAndPDComponent } from './fl-and-pd/fl-and-pd.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';


@NgModule({
    declarations: [ DdeComponent, ApplicantDetailsComponent, 
                    FlAndPDComponent, VehicleValuationComponent,
                    PslDataComponent ],
    imports: [ DdeRoutingModule, CommonModule, NgxPaginationModule,  FormsModule,
               ReactiveFormsModule, SharedModule ]
})
export class DdeModule {}
