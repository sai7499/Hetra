import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { DashboardPdcDetailsComponent } from './dashboard-pdc-details.component';

const routes: Routes = [
  {
    path: ":leadId",
    component: DashboardPdcDetailsComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: "dashboard-deviation-details",
        component: DashboardPdcDetailsComponent
      }
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPdcDetailsRoutingModule { }
