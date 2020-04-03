import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent  } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { ProductDdeComponent } from './product-dde/product-dde.component';
import { LoanDdeComponent } from './loan-dde/loan-dde.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-details',
            component: ApplicantDetailsComponent
        },
        {
            path: 'sourcing-details',
            component: SourcingDdeComponent
        },
        {
            path: 'product-details',
            component: ProductDdeComponent
        },
        {
            path: 'loan-details',
            component: LoanDdeComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule {}
