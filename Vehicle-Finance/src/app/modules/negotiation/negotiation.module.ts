import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NegotiationComponent } from './negotiation.component';
import { NegotiationRouterModule } from './negotiation.router';

@NgModule({
  declarations: [NegotiationComponent],
  imports: [
    CommonModule,
    NegotiationRouterModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    DateInputsModule,
    AutocompleteLibModule,
    SharedModule
  ],
  exports:  [ NegotiationComponent]
})
export class NegotiationModule { }
