import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildLoanComponent } from './child-loan/child-loan.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildLoanRouterModule } from "./child-loan.router";
import { SharedModule } from '@modules/shared/shared.module';

@NgModule({
  declarations: [ChildLoanComponent],
  imports: [
    CommonModule,
    ChildLoanRouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ChildLoanModule { }
