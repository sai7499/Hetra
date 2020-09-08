import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details.component';
import { BasicVehicleDetailsComponent } from './basic-vehicle-details/basic-vehicle-details.component';
import { RtoDeclarationDetailsComponent } from './rto-declaration-details/rto-declaration-details.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { AdditionalCollateralComponent } from './additional-collateral-details/additional-collateral-details.component';

const routes: Routes = [
  {
    path: ":leadId",
    component: VehicleDetailsComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: "basic-vehicle-details",
        component: BasicVehicleDetailsComponent
      },
      {
        path: "additional-collateral-details",
        component: AdditionalCollateralComponent,
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
