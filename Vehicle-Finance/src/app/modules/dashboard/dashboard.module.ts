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
import { DeviationWithMeComponent } from './deviation/deviation-with-me/deviation-with-me.component';
import { DeviationWithBranchComponent } from './deviation/deviation-with-branch/deviation-with-branch.component';
import { CreditDecisionComponent } from './credit-decision/credit-decision.component';
import { DecisionWithMeComponent } from './credit-decision/decision-with-me/decision-with-me.component';
import { DecisionWithBranchComponent } from './credit-decision/decision-with-branch/decision-with-branch.component';
import { CpcMakerComponent } from './cpc-maker/cpc-maker.component';
import { CpcCheckerComponent } from './cpc-checker/cpc-checker.component';
import { CheckerLeadsWithMeComponent } from './cpc-checker/checker-leads-with-me/checker-leads-with-me.component';
import { CheckerLeadsWithCpcComponent } from './cpc-checker/checker-leads-with-cpc/checker-leads-with-cpc.component';
import { MakerLeadsWithMeComponent } from './cpc-maker/maker-leads-with-me/maker-leads-with-me.component';
import { MakerLeadsWithCpcComponent } from './cpc-maker/maker-leads-with-cpc/maker-leads-with-cpc.component';
import { DdeBranchLeadsComponent } from './leads/dde-branch-leads/dde-branch-leads.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [DashboardComponent, NewLeadsComponent, LeadsComponent, SanctionedLeadsPendingWithMeComponent, SanctionedLeadsPendingWithBranchComponent, DeclinedLeadsWithMeComponent, DeclinedLeadsWithBranchComponent, PersonalDiscussionComponent, MyTasksComponent, BranchTasksComponent, VehicleViabilityComponent, ViabilityChecksComponent, ViabilityChecksBranchComponent, DeviationComponent, DeviationWithMeComponent, DeviationWithBranchComponent, CreditDecisionComponent, DecisionWithMeComponent, DecisionWithBranchComponent, CpcMakerComponent, CpcCheckerComponent, CheckerLeadsWithMeComponent, CheckerLeadsWithCpcComponent, MakerLeadsWithMeComponent, MakerLeadsWithCpcComponent, DdeBranchLeadsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxPaginationModule,
    FormsModule
    ]
})
export class DashboardModule { }
