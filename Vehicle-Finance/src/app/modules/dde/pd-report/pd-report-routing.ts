import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { PdReportComponent } from './pd-report.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';

const routes: Routes = [
  {
    path: ':leadId/pd-list',
    component: PdReportComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: ':applicantId/personal-details',
        component: PersonalDetailsComponent
      },
      {
        path: ':applicantId/personal-details/:version',
        component: PersonalDetailsComponent
      },
      {
        path: ':applicantId/income-details',
        component: IncomeDetailsComponent
      },
      {
        path: ':applicantId/income-details/:version',
        component: IncomeDetailsComponent
      },
      {
        path: ':applicantId/other-details',
        component: OtherDetailsComponent
      },
      {
        path: ':applicantId/other-details/:version',
        component: OtherDetailsComponent
      },
      {
        path: ':applicantId/reference-details',
        component: ReferenceDetailsComponent
      },
      {
        path: ':applicantId/reference-details/:version',
        component: ReferenceDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdReportRoutingModule { }
