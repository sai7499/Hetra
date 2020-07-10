import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { PdReportComponent } from './pd-report.component';
import { ApplicantDetailComponent } from './applicant-details/applicant-details.component';
import { CustomerProfileDetailsComponent } from './customer-profile-details/customer-profile-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { ReferenceCheckComponent } from './reference-check/reference-check.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { PdDashboardComponent } from './pd-dashboard/pd-dashboard.component';

const routes: Routes = [
    {
        path: ':leadId',
        component: PdReportComponent,
        resolve: { leadData: LeadDataResolverService },
        children: [
            {
                path: ':applicantId/applicant-details',
                component: ApplicantDetailComponent
            },
            {
                path: ':applicantId/applicant-details/:version',
                component: ApplicantDetailComponent
            },
            {
                path: ':applicantId/customer-profile',
                component: CustomerProfileDetailsComponent
            },
            {
                path: ':applicantId/customer-profile/:version',
                component: CustomerProfileDetailsComponent
            },
            {
                path: ':applicantId/loan-details',
                component: LoanDetailsComponent
            },
            {
                path: ':applicantId/loan-details/:version',
                component: LoanDetailsComponent
            },
            {
                path: ':applicantId/reference-check',
                component: ReferenceCheckComponent
            },
            {
                path: ':applicantId/reference-check/:version',
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
