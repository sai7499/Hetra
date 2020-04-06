import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent],
    imports: [DdeRoutingModule, FormsModule, ReactiveFormsModule]
})
export class DdeModule {}
