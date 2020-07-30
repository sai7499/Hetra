import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiReportComponent } from './fi-report/fi-report.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';

const routes: Routes = [
  {
    path: ':leadId/:applicantId/fi-report',
    component: FiReportComponent,
    resolve: { leadData: LeadDataResolverService },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiReportRoutingModule { }
