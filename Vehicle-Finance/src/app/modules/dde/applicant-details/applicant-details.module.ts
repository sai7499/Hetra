import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { DdeSharedModule } from '../shared/shared.module';
import { ApplicantRouterModule } from './applicant-details.routing';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
// import { SharedModule } from '@shared/shared.module';
// import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ApplicantDetailsComponent,
        BasicDetailsComponent,
        BankDetailsComponent,
        IdentityDetailsComponent,
        AddressDetailsComponent,
        EmploymentDetailsComponent,
        DocumentUploadComponent
    ],
    imports: [
        ApplicantRouterModule,
        DdeSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule.forRoot()
    ]
})
export class ApplicantDetailsModule { }
