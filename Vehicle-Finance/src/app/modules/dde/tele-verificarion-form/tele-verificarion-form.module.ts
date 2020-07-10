import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';
import { TeleVerificationFormRoutingModule } from './tele-verification-form.routing';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeadSectionModule } from '@modules/lead-section/lead-section.module';

@NgModule({
  declarations: [TeleVerificationFormComponent],
  imports: [
    CommonModule,
    TeleVerificationFormRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LeadSectionModule,

  ]
})
export class TeleVerificarionFormModule { }
