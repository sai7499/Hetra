import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildLeadComponent } from './child-lead/child-lead.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildLeadRouterModule } from "./child-lead.router";
import { SharedModule } from '@modules/shared/shared.module';

@NgModule({
  declarations: [ChildLeadComponent],
  imports: [
    CommonModule,
    ChildLeadRouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ChildLeadModule { }
