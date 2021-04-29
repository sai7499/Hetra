import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomSelectComponent } from './custom-select/custom-select.component';
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
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

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
import { SharedUserDefinedFieldsComponent } from './shared-user-defined-fields/shared-user-defined-fields.component';

import { WindowModule } from '@progress/kendo-angular-dialog';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { DeferralDocumentsComponent } from './deferral-documents/deferral-documents.component';
import { CustomTextareaComponent } from './custom-textarea/custom-textarea.component';
import { AuthorizeKycComponent } from './authorize-kyc/authorize-kyc.component';
import { AuthorizeComponent } from '@modules/dde/cpc-maker/authorize/authorize.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
setTheme('bs4');

@NgModule({
  declarations: [
    CustomSelectComponent,
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
    SharedUserDefinedFieldsComponent,
    CustomModalComponent,
    CustomTextareaComponent,
    DeferralDocumentsComponent,
    AuthorizeKycComponent,
    AuthorizeComponent,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent
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
    WindowModule,
    ImageCropperModule,
    AutocompleteLibModule
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
    SharedUserDefinedFieldsComponent,
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
    CustomTextareaComponent,
    CustomModalComponent,
    AuthorizeComponent,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent
  ]
})
export class SharedModule { }
