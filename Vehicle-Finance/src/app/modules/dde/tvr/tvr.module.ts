import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TvrRoutingModule } from './tvr-routing.module';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';

@NgModule({
  declarations: [TvrDetailsComponent, TeleVerificationFormComponent],
  imports: [
    CommonModule,
    TvrRoutingModule
  ]
})
export class TvrModule { }
