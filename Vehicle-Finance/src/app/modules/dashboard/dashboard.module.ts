import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewLeadsComponent } from './leads/new-leads/new-leads.component';
import { LeadsComponent } from './leads/leads.component';
import { SanctionedLeadsPendingWithMeComponent } from './leads/sanctioned-leads-pending-with-me/sanctioned-leads-pending-with-me.component';
// tslint:disable-next-line: max-line-length
import { SanctionedLeadsPendingWithBranchComponent } from './leads/sanctioned-leads-pending-with-branch/sanctioned-leads-pending-with-branch.component';
import { DeclinedLeadsWithMeComponent } from './leads/declined-leads-with-me/declined-leads-with-me.component';
import { DeclinedLeadsWithBranchComponent } from './leads/declined-leads-with-branch/declined-leads-with-branch.component';
import { PersonalDiscussionComponent } from './personal-discussion/personal-discussion.component';
import { MyTasksComponent } from './personal-discussion/my-tasks/my-tasks.component';
import { BranchTasksComponent } from './personal-discussion/branch-tasks/branch-tasks.component';
import { VehicleViabilityComponent } from './vehicle-viability/vehicle-viability.component';
import { ViabilityChecksComponent } from './vehicle-viability/viability-checks/viability-checks.component';
import { ViabilityChecksBranchComponent } from './vehicle-viability/viability-checks-branch/viability-checks-branch.component';
import { FormsModule } from '@angular/forms';
import { DeviationComponent } from './deviation/deviation.component';
import { DeviationDashboardComponent } from './deviation/deviation-dashboard/deviation-dashboard.component';
import { CaseSummaryComponent } from './deviation/case-summary/case-summary.component';
import { SharedModule } from '@modules/shared/shared.module';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [DashboardComponent, NewLeadsComponent, LeadsComponent, SanctionedLeadsPendingWithMeComponent, SanctionedLeadsPendingWithBranchComponent, DeclinedLeadsWithMeComponent, DeclinedLeadsWithBranchComponent, PersonalDiscussionComponent, MyTasksComponent, BranchTasksComponent, VehicleViabilityComponent, ViabilityChecksComponent, ViabilityChecksBranchComponent, DeviationComponent, DeviationDashboardComponent, CaseSummaryComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxPaginationModule,
    FormsModule,
    SharedModule
  ]
})
export class DashboardModule { }
