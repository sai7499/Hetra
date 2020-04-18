import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { ViabilityDetailsComponent } from './viability-details/viability-details.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { RtoDeclarationDetailsComponent } from './rto-declaration-details/rto-declaration-details.component';

const routes: Routes = [
  {
    path: "",
    component: VehicleDetailsComponent,
    children: [
      {
        path: "basic-vehicle-details",
        component: BasicVehicleDetailsComponent
      },
      {
        path: "viability-details",
        component: ViabilityDetailsComponent,
      },
      {
        path: "insurance-details",
        component: InsuranceDetailsComponent,
      },
      {
        path: "rto-details",
        component: RtoDeclarationDetailsComponent,
      },
      {
        path: '',
        redirectTo: 'basic-vehicle-details',
        pathMatch: 'full'
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleDetailsRoutingModule { }
