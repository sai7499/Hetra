import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViabilityListComponent } from '../viability-list/viability-list.component';
import { ViabilityDashboardRoutingModule } from './viability-dashboard-routing.module';
import { ViabilityDetailsComponent } from '../vehicle-details/viability-details/viability-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { ViabilityDashboardComponent } from './viability-dashboard.component';

@NgModule({
  declarations: [ViabilityListComponent , ViabilityDetailsComponent, ViabilityDashboardComponent],
  imports: [
    CommonModule,
    ViabilityDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [ViabilityListComponent, ViabilityDetailsComponent]
})
export class ViabilityDashboardModule { }
