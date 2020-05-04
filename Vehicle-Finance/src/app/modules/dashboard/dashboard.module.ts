import { NgModule , CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '../../material-module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {DashboardRouterModule  } from "./dashboard.router";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NewLeadComponent } from './leads/new-lead/new-lead.component';
import { SecsanctionedLeadsPendingWithMeComponent } from './leads/secsanctioned-leads-pending-with-me/secsanctioned-leads-pending-with-me.component';
import { SecsanctionedLeadsPendingWithBranchComponent } from './leads/secsanctioned-leads-pending-with-branch/secsanctioned-leads-pending-with-branch.component';
import { DeclinedLeadsWithMeComponent } from './leads/declined-leads-with-me/declined-leads-with-me.component';
import { DeclinedLeadsWithBranchComponent } from './leads/declined-leads-with-branch/declined-leads-with-branch.component';
import { MyPdTasksComponent } from './personal-discussion/my-pd-tasks/my-pd-tasks.component';
import { BranchPdTasksComponent } from './personal-discussion/branch-pd-tasks/branch-pd-tasks.component';
import {SharedModule} from '../shared/shared.module';
import { ViabilityChecksPendingWithMeComponent } from './vechile-viability/viability-checks-pending-with-me/viability-checks-pending-with-me.component';
import { ViabilityChecksPendingWithBranchComponent } from './vechile-viability/viability-checks-pending-with-branch/viability-checks-pending-with-branch.component';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [ DashboardComponent, NewLeadComponent, SecsanctionedLeadsPendingWithMeComponent, SecsanctionedLeadsPendingWithBranchComponent, DeclinedLeadsWithMeComponent, DeclinedLeadsWithBranchComponent, MyPdTasksComponent, BranchPdTasksComponent, ViabilityChecksPendingWithMeComponent, ViabilityChecksPendingWithBranchComponent],
  imports: [
    CommonModule ,DashboardRouterModule,MaterialModule,SharedModule, NgxPaginationModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class DashboardModule { }
