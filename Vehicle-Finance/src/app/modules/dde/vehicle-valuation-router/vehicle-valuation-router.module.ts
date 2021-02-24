import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VehicleValuationRoutingModule } from './vehicle-valuation.routing';
import { ValuationComponent } from './valuation/valuation.component';
import { DdeSharedModule } from '../shared/shared.module';
import { SharedModule } from '@shared/shared.module';
import { VehicleValuationRouterComponent } from './vehicle-valuation-router.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  declarations: [VehicleValuationRouterComponent, ValuationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DdeSharedModule,
    SharedModule,
    VehicleValuationRoutingModule,
    AutocompleteLibModule

  ]
})
export class VehicleValuationRouterModule { }
