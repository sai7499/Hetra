import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { FlAndPdReportComponent } from './fl-and-pd-report.component';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { ReferenceCheckComponent } from './reference-check/reference-check.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { PdDashboardComponent } from './pd-dashboard/pd-dashboard.component';

const routes: Routes = [
    {
        path: ':leadId',
        component: FlAndPdReportComponent,
        resolve: { leadData: LeadDataResolverService },
        children: [
            {
                path: 'applicant-detail/:applicantId',
                component: ApplicantDetailComponent
            },
            {
                path: 'applicant-detail/:applicantId/:version',
                component: ApplicantDetailComponent
            },
            {
                path: 'customer-profile/:applicantId',
                component: CustomerProfileDetailsComponent
            },
            {
                path: 'customer-profile/:applicantId/:version',
                component: CustomerProfileDetailsComponent
            },
            {
                path: 'loan-details/:applicantId',
                component: LoanDetailsComponent
            },
            {
                path: 'loan-details/:applicantId/:version',
                component: LoanDetailsComponent
            },
            {
                path: 'reference-check/:applicantId',
                component: ReferenceCheckComponent
            },
            {
                path: 'pd-dashboard',
                component: PdDashboardComponent
            },
            {
                path: 'pd-report',
                component: PdDashboardComponent

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlAndPdReportRouterModule { }
