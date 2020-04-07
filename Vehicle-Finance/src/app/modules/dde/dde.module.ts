import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { DdeRoutingModule } from './dde.routing.module';
import { DdeSharedModule } from './shared/shared.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';

@NgModule({
    declarations: [DdeComponent, ApplicantListComponent, VehicleListComponent],
    imports: [DdeRoutingModule, DdeSharedModule],
})
export class DdeModule {}
