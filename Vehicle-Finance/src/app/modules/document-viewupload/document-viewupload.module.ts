import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicantdocumentComponent } from './applicantdocument/applicantdocument.component';
import { CollateraldocumentComponent } from './collateraldocument/collateraldocument.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DocumentViewuploadComponent } from './document-viewupload.component';
import { DocumentViewUploadRouterModule } from './document-viewupload.router';

@NgModule({
  declarations: [
    ApplicantdocumentComponent,
    CollateraldocumentComponent,
    DocumentViewuploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DocumentViewUploadRouterModule
  ]
})
export class DocumentViewuploadModule { }

