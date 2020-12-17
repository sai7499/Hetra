import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { ProfileComponent } from './profile/profile.component';
import { } from './applicant-list/applicant-list.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { AddOrUpdateApplicantComponent } from './add-update-applicant/add-update-applicant.component';
import { DdeSharedModule } from '../dde/shared/shared.module';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { SharedBasicVehicleDetailsComponent } from './shared-basic-vehicle-details/shared-basic-vehicle-details.component';
import { SharedVehicleDetailsComponent } from './shared-vehicle-details/shared-vehicle-details.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { SalesExactMatchComponent } from './sales-exact-match/sales-exact-match.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { CommonDocsUploadComponent } from './common-docs-upload/common-docs-upload.component';
import { DocsUploadPipe } from './pipes/docs-upload.pipe';
import { DraggableComponent } from './draggable-container/draggable-container.component';
import { ApplicantDocsUploadComponent } from './applicant-docs-upload/applicant-docs-upload.component';
import { ApplicantKycDetailsComponent } from './applicant-kyc-details/applicant-kyc-details.component';
import { PddComponent } from './pdd-screen/pdd.component';
import { UploadDiscussionComponent } from './upload-discussion/upload-discussion.component';
import { CustomTextAreaComponent } from './custom-textarea/custom-textarea.component';

import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { setTheme } from 'ngx-bootstrap/utils';
import { SharedDeviationComponent } from './shared-deviation/shared-deviation.component';
import { NegativeListModalComponent } from './negative-list-modal/negative-list.modal.component';
import { MatTreeModule, MatIconModule } from '@angular/material';
import { RejectReasonModalComponent } from './reject-reason-modal/reject-reason-modal.component';
import { PageRedirectModalComponent } from './page-redirect-modal/page-redirect-modal.component';
import { ReferenceComponent } from './reference/reference.component';
import { WelomceLetterComponent } from '@modules/dde/cpc-maker/welomce-letter/welomce-letter.component';
import { InAppcameraComponent } from './in-appcamera/in-appcamera.component';

import { ImageCropperModule } from 'ngx-image-cropper';

setTheme('bs4');

@NgModule({
  declarations: [
    CustomSelectComponent,
    TextOnlyModalComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    IdentityDetailsComponent,
    AddressDetailsComponent,
    AddOrUpdateApplicantComponent,
    ApplicantListComponent,
    SharedBasicVehicleDetailsComponent,
    SharedVehicleDetailsComponent,
    SearchBarComponent,
    CustomInputComponent,
    SalesExactMatchComponent,
    SharedDeviationComponent,
    NegativeListModalComponent,
    UploadModalComponent,
    CommonDocsUploadComponent,
    DocsUploadPipe,
    DraggableComponent,
    ApplicantDocsUploadComponent,
    RejectReasonModalComponent,
    ApplicantKycDetailsComponent,
    PageRedirectModalComponent,
    ReferenceComponent,
    PddComponent,
    UploadDiscussionComponent,
    WelomceLetterComponent,
    InAppcameraComponent,
    CustomTextAreaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    DdeSharedModule,
    NgxPaginationModule,
    DatePickerModule,
    MatTreeModule,
    MatIconModule,
    ImageCropperModule
  ],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    ApplicantListComponent,
    AddressDetailsComponent,
    IdentityDetailsComponent,
    AddOrUpdateApplicantComponent,
    SharedBasicVehicleDetailsComponent,
    SharedVehicleDetailsComponent,
    SharedDeviationComponent,
    SearchBarComponent,
    CustomInputComponent,
    SalesExactMatchComponent,
    DatePickerModule,
    UploadModalComponent,
    CommonDocsUploadComponent,
    DocsUploadPipe,
    DraggableComponent,
    ApplicantDocsUploadComponent,
    MatTreeModule,
    MatIconModule,
    RejectReasonModalComponent,
    PageRedirectModalComponent,
    ReferenceComponent,
    PddComponent,
    UploadDiscussionComponent,
    WelomceLetterComponent,
    CustomTextAreaComponent
  ]
})
export class SharedModule { }
