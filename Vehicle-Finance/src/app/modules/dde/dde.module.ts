import { NgModule } from '@angular/core';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { DdeRoutingModule } from './dde.routing.module';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductDdeComponent } from './product-dde/product-dde.component';
import { LoanDdeComponent } from './loan-dde/loan-dde.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DdeComponent, ApplicantDetailsComponent, SourcingDdeComponent, ProductDdeComponent, LoanDdeComponent],
    imports: [DdeRoutingModule, ReactiveFormsModule, FormsModule, SharedModule, CommonModule]
})
export class DdeModule {}
