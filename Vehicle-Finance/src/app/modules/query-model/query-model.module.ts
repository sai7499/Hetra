import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryModelComponent } from './query-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { QueryModelRouterModule } from './query-model.router';

@NgModule({
  declarations: [QueryModelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    QueryModelRouterModule
  ]
})
export class QueryModelModule { }
