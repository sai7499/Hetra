import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { BankListComponent } from './bank-list/bank-list.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: ApplicantDetailsComponent,
    children: [
      {
        path: 'basic-data/:applicantId',
        component: BasicDetailsComponent,
      },
      {
        path: 'bank-list',
        component: BankListComponent,
      },
      {
        path: 'bank-details',
        component: BankDetailsComponent,
      },
      {
        path: 'identity-details/:applicantId',
        component: IdentityDetailsComponent,
      },
      {
        path: 'address-details/:applicantId',
        component: AddressDetailsComponent,
      },
      {
        path: 'employment-details',
        component: EmploymentDetailsComponent,
      },
      {
        path: 'document-upload',
        component: DocumentUploadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantRouterModule {}
