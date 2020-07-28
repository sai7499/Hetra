import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentViewuploadComponent } from './document-viewupload.component';
import { ApplicantDocumentComponent } from './applicant-document/applicant-document.component';
import { CollateraldocumentComponent } from './collateraldocument/collateraldocument.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: DocumentViewuploadComponent,
    children: [
      {
        path: '',
        redirectTo: 'applicant-documents',
        pathMatch: 'full',
      },
      {
        path: 'applicant-documents',
        component: ApplicantDocumentComponent,
      },
      {
        path: 'collateral-documents',
        component: CollateraldocumentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentViewUploadRouterModule {}
