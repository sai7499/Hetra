import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { FlAndPdReportComponent } from './fl-and-pd-report.component';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

const routes: Routes = [
    {
        path: ':leadId',
        component: FlAndPdReportComponent,
        children: [
          {
              path: 'applicant-detail/:applicantId/:version',
              component: ApplicantDetailComponent
          },
          {
            path: 'customer-profile/:applicantId/:version',
            component: CustomerProfileDetailsComponent
        },
        {
            path: 'loan-details/:applicantId/:version',
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
