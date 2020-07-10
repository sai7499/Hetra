import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { VehicleDetailsRoutingModule } from './vehicle-details-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DdeSharedModule } from '../shared/shared.module';
import { RtoDeclarationDetailsComponent } from './rto-declaration-details/rto-declaration-details.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [VehicleDetailsComponent, BasicVehicleDetailsComponent, RtoDeclarationDetailsComponent],
  imports: [
    CommonModule,
    VehicleDetailsRoutingModule,
    DdeSharedModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class VehicleDetailsModule { }
