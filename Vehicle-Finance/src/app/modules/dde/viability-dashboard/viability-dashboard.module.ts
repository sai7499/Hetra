import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ViabilityListComponent } from '../viability-list/viability-list.component';
import { ViabilityDashboardRoutingModule } from './viability-dashboard-routing.module';
import { ViabilityDetailsComponent } from '../vehicle-details/viability-details/viability-details.component';

@NgModule({
  declarations: [ViabilityListComponent , ViabilityDetailsComponent],
  imports: [
    CommonModule,
    ViabilityDashboardRoutingModule
  ]
})
export class ViabilityDashboardModule { }
