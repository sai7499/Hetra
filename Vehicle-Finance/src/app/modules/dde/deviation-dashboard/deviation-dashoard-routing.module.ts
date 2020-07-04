import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviationDashboardComponent } from './deviation-dashboard.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { DashboardDeviationDetailsComponent } from './dashboard-deviation-details/dashboard-deviation-details.component';
import { CaseSummaryComponent } from './case-summary/case-summary.component';

const routes: Routes = [
  {
    path: ":leadId",
    component: DeviationDashboardComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: "dashboard-deviation-details",
        component: DashboardDeviationDetailsComponent
      },
      {
        path: "case-summary",
        component: CaseSummaryComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard-deviation-details',
        pathMatch: 'full'
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviationDashoardRoutingModule { }
