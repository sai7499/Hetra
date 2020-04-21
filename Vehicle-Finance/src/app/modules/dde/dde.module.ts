import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent, SourcingDdeComponent, ExposureDetailsComponent, IncomeDetailsComponent],
    imports: [DdeRoutingModule, ReactiveFormsModule, FormsModule, SharedModule, CommonModule]
})
export class DdeModule {}
