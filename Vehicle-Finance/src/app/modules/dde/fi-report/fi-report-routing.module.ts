import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { FiReportOfficeComponent } from './fi-business/fi-report-office.component';
import { FiReportComponent } from './fi-report/fi-report.component';
import { FiReportResidenceComponent } from './fi-residence/fi-report-residence.component';

const routes: Routes = [
  {
    path: ':leadId/fi-report',
    component: FiReportComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: ':applicantId/fi-residence',
        component: FiReportResidenceComponent
      },
      {
        path: ':applicantId/fi-residence/:version',
        component: FiReportResidenceComponent
      },
      {
        path: ':applicantId/fi-business',
        component: FiReportOfficeComponent
      },
      {
        path: ':applicantId/fi-business/:version',
        component: FiReportOfficeComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiReportRoutingModule { }
