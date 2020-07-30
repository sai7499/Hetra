import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicantDocumentComponent } from './applicant-document/applicant-document.component';
import { CollateraldocumentComponent } from './collateraldocument/collateraldocument.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DocumentViewuploadComponent } from './document-viewupload.component';
import { DocumentViewUploadRouterModule } from './document-viewupload.router';

@NgModule({
  declarations: [
    ApplicantDocumentComponent,
    CollateraldocumentComponent,
    DocumentViewuploadComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DocumentViewUploadRouterModule,
  ],
})
export class DocumentViewuploadModule {}
