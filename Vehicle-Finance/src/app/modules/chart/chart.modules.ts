import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { ChartComponent } from './chart.component';
import { ChartRouterModule } from './chart-routing.module';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartRouterModule
  ]
})
export class ChartModule { }
