import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { ApplicantDetailsRoutingModule } from './applicant-details.module.routing';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

import { DdeSharedModule } from '../../dde/shared/shared.module';
import { SharedModule } from '@shared/shared.module';
import { DatePickerModule} from '@progress/kendo-angular-dateinputs'

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ApplicantDetailsRoutingModule,
    DdeSharedModule,
    SharedModule,
    DatePickerModule
  ],
  declarations: [
    ApplicantDetailsComponent,
    BasicDetailsComponent,
    AddressDetailsComponent,
    IdentityDetailsComponent,
    DocumentUploadComponent,
  ],
})
export class ApplicantDetailsModule {}
