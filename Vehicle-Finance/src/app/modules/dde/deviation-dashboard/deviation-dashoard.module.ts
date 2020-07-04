import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviationDashoardRoutingModule } from './deviation-dashoard-routing.module';
import { DeviationDashboardComponent } from './deviation-dashboard.component';
import { DashboardDeviationDetailsComponent } from './dashboard-deviation-details/dashboard-deviation-details.component';
import { CaseSummaryComponent } from './case-summary/case-summary.component';
import { DdeSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';

@NgModule({
  declarations: [
    DeviationDashboardComponent,
    DashboardDeviationDetailsComponent,
    CaseSummaryComponent,
  ],
  imports: [
    CommonModule,
    DeviationDashoardRoutingModule,
    DdeSharedModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class DeviationDashoardModule { }
