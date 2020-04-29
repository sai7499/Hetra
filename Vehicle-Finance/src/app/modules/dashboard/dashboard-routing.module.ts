import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewLeadsComponent } from './new-leads/new-leads.component';
import { LeadsComponent } from './leads/leads.component';
import { DeclinedLeadsWithBranchComponent } from './declined-leads-with-branch/declined-leads-with-branch.component';
import { SanctionedLeadsPendingWithMeComponent } from './sanctioned-leads-pending-with-me/sanctioned-leads-pending-with-me.component';
// tslint:disable-next-line: max-line-length
import { SanctionedLeadsPendingWithBranchComponent } from './sanctioned-leads-pending-with-branch/sanctioned-leads-pending-with-branch.component';
import { DeclinedLeadsWithMeComponent } from './declined-leads-with-me/declined-leads-with-me.component';
import { PersonalDiscussionComponent } from './personal-discussion/personal-discussion.component';
import { MyTasksComponent } from './personal-discussion/my-tasks/my-tasks.component';
import { BranchTasksComponent } from './personal-discussion/branch-tasks/branch-tasks.component';
import { VehicleDetailComponent } from '../lead-section/vehicle-details/vehicle-details.component';
import { VehicleViabilityComponent } from './vehicle-viability/vehicle-viability.component';
import { ViabilityChecksComponent } from './vehicle-viability/viability-checks/viability-checks.component';
import { ViabilityChecksBranchComponent } from './vehicle-viability/viability-checks-branch/viability-checks-branch.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'leads/new-leads',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'leads',
        redirectTo: 'leads/new-leads',
        pathMatch: 'full'
      },
      {
        path: 'leads',
        component: LeadsComponent,
        children: [
          {
            path: 'new-leads',
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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
