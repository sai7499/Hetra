import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { RtoDeclarationDetailsComponent } from './rto-declaration-details/rto-declaration-details.component';
import { VehicleDetailsRoutingModule } from './vehicle-details-routing.module';

@NgModule({
  declarations: [VehicleDetailsComponent, BasicVehicleDetailsComponent, InsuranceDetailsComponent, RtoDeclarationDetailsComponent],
  imports: [
    CommonModule,
    VehicleDetailsRoutingModule
  ]
})
export class VehicleDetailsModule { }
