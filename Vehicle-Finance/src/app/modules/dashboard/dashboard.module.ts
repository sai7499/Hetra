import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewLeadsComponent } from './new-leads/new-leads.component';
import { LeadsComponent } from './leads/leads.component';
import { SanctionedLeadsPendingWithMeComponent } from './sanctioned-leads-pending-with-me/sanctioned-leads-pending-with-me.component';
// tslint:disable-next-line: max-line-length
import { SanctionedLeadsPendingWithBranchComponent } from './sanctioned-leads-pending-with-branch/sanctioned-leads-pending-with-branch.component';
import { DeclinedLeadsWithMeComponent } from './declined-leads-with-me/declined-leads-with-me.component';
import { DeclinedLeadsWithBranchComponent } from './declined-leads-with-branch/declined-leads-with-branch.component';
import { PersonalDiscussionComponent } from './personal-discussion/personal-discussion.component';
import { MyTasksComponent } from './personal-discussion/my-tasks/my-tasks.component';
import { BranchTasksComponent } from './personal-discussion/branch-tasks/branch-tasks.component';
import { VehicleViabilityComponent } from './vehicle-viability/vehicle-viability.component';
import { ViabilityChecksComponent } from './vehicle-viability/viability-checks/viability-checks.component';
import { ViabilityChecksBranchComponent } from './vehicle-viability/viability-checks-branch/viability-checks-branch.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [DashboardComponent, NewLeadsComponent, LeadsComponent, SanctionedLeadsPendingWithMeComponent, SanctionedLeadsPendingWithBranchComponent, DeclinedLeadsWithMeComponent, DeclinedLeadsWithBranchComponent, PersonalDiscussionComponent, MyTasksComponent, BranchTasksComponent, VehicleViabilityComponent, ViabilityChecksComponent, ViabilityChecksBranchComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
