import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent, VehicleDetailsComponent],
    imports: [DdeRoutingModule, FormsModule, ReactiveFormsModule]
})
export class DdeModule {}
