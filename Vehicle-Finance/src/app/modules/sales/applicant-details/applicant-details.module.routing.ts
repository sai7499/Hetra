import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: ApplicantDetailsComponent,
    children: [
      {
        path: 'basic-details',
        component: BasicDetailsComponent,
      },
      {
        path: 'basic-details/:applicantId',
        component: BasicDetailsComponent,
      },
      {
        path: 'identity-details',
        component: IdentityDetailsComponent,
      },
      {
        path: 'identity-details/:applicantId',
        component: IdentityDetailsComponent,
      },
      {
        path: 'address-details',
        component: AddressDetailsComponent,
      },
      {
        path: 'address-details/:applicantId',
        component: AddressDetailsComponent,
      },
      {
        path: 'document-upload',
        component: DocumentUploadComponent,
      },
      {
        path: 'document-upload/:applicantId',
        component: DocumentUploadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantDetailsRoutingModule {}
