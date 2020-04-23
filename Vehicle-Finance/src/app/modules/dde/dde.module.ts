import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { DdeRoutingModule } from './dde.routing.module';
import { DdeSharedModule } from './shared/shared.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { FleetDetailsComponent } from './fleet-details/fleet-details.component';
import { TrackVehicleComponent } from './track-vehicle/track-vehicle.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';









@NgModule({
    declarations: [DdeComponent, ApplicantListComponent, VehicleListComponent, FleetDetailsComponent, TrackVehicleComponent],
    imports: [DdeRoutingModule, DdeSharedModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class DdeModule { }
