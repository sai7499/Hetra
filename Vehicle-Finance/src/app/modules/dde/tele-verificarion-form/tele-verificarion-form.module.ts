import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';
import { TeleVerificationFormRoutingModule } from './tele-verification-form.routing';
import { SharedModule } from '@shared/shared.module';
import { DdeSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TeleVerificationFormComponent],
  imports: [
    CommonModule,
    TeleVerificationFormRoutingModule,
    SharedModule,
    DdeSharedModule,
    ReactiveFormsModule
  ]
})
export class TeleVerificarionFormModule { }
