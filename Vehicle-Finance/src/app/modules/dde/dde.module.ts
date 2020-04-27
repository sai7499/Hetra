import { NgModule } from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { FlAndPDComponent } from './fl-and-pd/fl-and-pd.component';

import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent, FlAndPDComponent],
    imports: [DdeRoutingModule,CommonModule, NgxPaginationModule ]
})
export class DdeModule {}
