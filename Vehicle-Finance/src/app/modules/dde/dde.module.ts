import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent, SourcingDdeComponent],
    imports: [DdeRoutingModule, ReactiveFormsModule, FormsModule, SharedModule]
})
export class DdeModule {}
