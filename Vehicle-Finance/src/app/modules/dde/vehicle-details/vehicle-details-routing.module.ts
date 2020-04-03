import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details.component';
// import { VehicleDetailComponent } from '../../lead-section/vehicle-details/vehicle-details.component';

const routes: Routes = [
  {
    path: "",
    component: VehicleDetailsComponent
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleDetailsRoutingModule { }
