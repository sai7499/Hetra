import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { VehicleDetailsRoutingModule } from './vehicle-details-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DdeSharedModule } from '../shared/shared.module';
import { ViabilityDetailsComponent } from './viability-details/viability-details.component';

@NgModule({
  declarations: [VehicleDetailsComponent, BasicVehicleDetailsComponent, ViabilityDetailsComponent],
  imports: [
    CommonModule,
    VehicleDetailsRoutingModule,
    DdeSharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VehicleDetailsModule { }
