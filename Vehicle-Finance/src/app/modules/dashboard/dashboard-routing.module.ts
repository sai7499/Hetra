import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewLeadsComponent } from './leads/new-leads/new-leads.component';
import { LeadsComponent } from './leads/leads.component';
import { DeclinedLeadsWithBranchComponent } from './leads/declined-leads-with-branch/declined-leads-with-branch.component';
import { SanctionedLeadsPendingWithMeComponent } from './leads/sanctioned-leads-pending-with-me/sanctioned-leads-pending-with-me.component';

import { SanctionedLeadsPendingWithBranchComponent } from './leads/sanctioned-leads-pending-with-branch/sanctioned-leads-pending-with-branch.component';
import { DeclinedLeadsWithMeComponent } from './leads/declined-leads-with-me/declined-leads-with-me.component';
import { PersonalDiscussionComponent } from './personal-discussion/personal-discussion.component';
import { MyTasksComponent } from './personal-discussion/my-tasks/my-tasks.component';
import { BranchTasksComponent } from './personal-discussion/branch-tasks/branch-tasks.component';
import { VehicleViabilityComponent } from './vehicle-viability/vehicle-viability.component';
import { ViabilityChecksComponent } from './vehicle-viability/viability-checks/viability-checks.component';
import { ViabilityChecksBranchComponent } from './vehicle-viability/viability-checks-branch/viability-checks-branch.component';
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
import { MakerLeadsWithCpcComponent } from './cpc-maker/maker-leads-with-cpc/maker-leads-with-cpc.component';
import { MakerLeadsWithMeComponent } from './cpc-maker/maker-leads-with-me/maker-leads-with-me.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'leads-section/leads',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'leads-section',
        redirectTo: 'leads-section/leads',
        pathMatch: 'full'
      },
      {
        path: 'leads-section',
        component: LeadsComponent,
        children: [
          {
            path: 'leads',
            component: NewLeadsComponent
          },
          {
            path: 'sanction-leads',
            component: SanctionedLeadsPendingWithMeComponent
          },
          {
            path: 'sanction-leads-branch',
            component: SanctionedLeadsPendingWithBranchComponent
          },
          {
            path: 'declined-leads',
            component: DeclinedLeadsWithMeComponent
          },
          {
            path: 'declined-branch',
            component: DeclinedLeadsWithBranchComponent
          }
        ]
      },
      {
        path: 'personal-discussion',
        redirectTo: 'personal-discussion/my-pd-tasks',
        pathMatch: 'full'
      },
      {
        path: 'personal-discussion',
        component: PersonalDiscussionComponent,
        children: [
          {
            path: 'my-pd-tasks',
            component: MyTasksComponent
          },
          {
            path: 'branch-pd-tasks',
            component: BranchTasksComponent
          }
        ]
      },
      {
        path: 'vehicle-viability',
        redirectTo: 'vehicle-viability/viability-checks',
        pathMatch: 'full'
      },
      {
        path: 'vehicle-viability',
        component: VehicleViabilityComponent,
        children: [
          {
            path: 'viability-checks',
            component: ViabilityChecksComponent
          },
          {
            path: 'viability-checks-branch',
            component: ViabilityChecksBranchComponent
          }
        ]
      },
      {
        path: 'deviation',
        redirectTo: 'deviation/deviation-with-me',
        pathMatch: 'full'
      },
      {
        path: 'deviation',
        component: DeviationComponent,
        children: [
          {
            path: 'deviation-with-me',
            component: DeviationWithMeComponent
          },
          {
            path: 'deviation-with-branch',
            component: DeviationWithBranchComponent
          }
        ]
      },
      {
        path: 'credit-decision',
        redirectTo: 'credit-decision/decision-with-me',
        pathMatch: 'full'
      },
      {
        path: 'credit-decision',
        component: CreditDecisionComponent,
        children: [
          {
            path: 'decision-with-me',
            component: DecisionWithMeComponent
          },
          {
            path: 'decision-with-branch',
            component: DecisionWithBranchComponent
          }
        ]
      },
      {
        path: 'cpc-checker',
        redirectTo: 'cpc-checker/checker-leads-with-me',
        pathMatch: 'full'
      },
      {
        path: 'cpc-checker',
        component: CpcCheckerComponent,
        children: [
          {
            path: 'checker-leads-with-me',
            component: CheckerLeadsWithMeComponent
          },
          {
            path: 'checker-leads-with-cpc',
            component: CheckerLeadsWithCpcComponent
          }
        ]
      },
      {
        path: 'cpc-maker',
        redirectTo: 'cpc-maker/maker-leads-with-me',
        pathMatch: 'full'
      },
      {
        path: 'cpc-maker',
        component: CpcMakerComponent,
        children: [
          {
            path: 'maker-leads-with-me',
            component: MakerLeadsWithMeComponent
          },
          {
            path: 'maker-leads-with-cpc',
            component: MakerLeadsWithCpcComponent
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
