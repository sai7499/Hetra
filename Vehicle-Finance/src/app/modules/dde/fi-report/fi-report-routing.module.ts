import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { FiBusinessComponent } from './fi-business/fi-business.component';
import { FiReportComponent } from './fi-report/fi-report.component';
import { FiResidenceComponent } from './fi-residence/fi-residence.component';

const routes: Routes = [
  {
    path: ':leadId/fi-report',
    component: FiReportComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: ':applicantId/fi-residence',
        component: FiResidenceComponent
      },
      {
        path: ':applicantId/fi-residence/:version',
        component: FiResidenceComponent
      },
      {
        path: ':applicantId/fi-business',
        component: FiBusinessComponent
      },
      {
        path: ':applicantId/fi-business/:version',
        component: FiBusinessComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiReportRoutingModule { }
