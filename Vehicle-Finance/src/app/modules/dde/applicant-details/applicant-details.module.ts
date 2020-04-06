import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { DdeSharedModule } from '../shared/shared.module';
import { ApplicantRouterModule } from './applicant-details.routing';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';

@NgModule({
    declarations: [
        ApplicantDetailsComponent,
        BasicDetailsComponent,
        BankDetailsComponent,
        IdentityDetailsComponent,
        AddressDetailsComponent
    ],
    imports: [
        ApplicantRouterModule,
        DdeSharedModule,
        CommonModule
    ]
})
export class ApplicantDetailsModule {}
