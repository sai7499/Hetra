import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlAndPdReportComponent } from './fl-and-pd-report.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

const routes: Routes = [
    {
        path: '',
        component: FlAndPdReportComponent,
        children: [
          {
              path: 'applicant-details',
              component: ApplicantDetailsComponent
          },
          {
            path: 'customer-profile',
            component: CustomerProfileDetailsComponent
        },
        {
            path: 'loan-details',
            component: LoanDetailsComponent
        }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlAndPdReportRouterModule { }
