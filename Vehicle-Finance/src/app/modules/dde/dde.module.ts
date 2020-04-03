import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent],
    imports: [DdeRoutingModule]
})
export class DdeModule {}
