import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DdeSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { DashboardPdcDetailsRoutingModule } from './deviation-dashoard-routing.module';
import { DashboardPdcDetailsComponent } from './dashboard-pdc-details.component';
import { CpcMakerModule } from '../cpc-maker/cpc-maker.module';

@NgModule({
  declarations: [
    DashboardPdcDetailsComponent
  ],
  imports: [
    CommonModule,
    DdeSharedModule,
    DashboardPdcDetailsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CpcMakerModule
  ]
})
export class DashboardPdcDetailsModule { }
