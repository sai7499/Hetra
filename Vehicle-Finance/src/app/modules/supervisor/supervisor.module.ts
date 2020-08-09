import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SupervisorComponent } from './supervisor.component';
import { SupervisorDashboardComponent } from './supervisor-dashboard/supervisor-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { SupervisorRouterModule } from './supervisor.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



@NgModule({
  declarations: [
    SupervisorComponent,
    SupervisorDashboardComponent
  ],
  imports: [
    // CommonModule,
    // SupervisorRouterModule,
    // FormsModule,
    // ReactiveFormsModule,
    // SharedModule,
    // HttpClientModule,   

    CommonModule,
    SupervisorRouterModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    DateInputsModule,
    AutocompleteLibModule,
  ],
})
export class SupervisorModule { }
