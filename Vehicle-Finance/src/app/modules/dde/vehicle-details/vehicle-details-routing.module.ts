import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { ViabilityDetailsComponent } from './viability-details/viability-details.component';

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
