import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TvrRoutingModule } from './tvr-routing.module';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';

@NgModule({
  declarations: [TvrDetailsComponent],
  imports: [
    CommonModule,
    TvrRoutingModule
  ]
})
export class TvrModule { }
