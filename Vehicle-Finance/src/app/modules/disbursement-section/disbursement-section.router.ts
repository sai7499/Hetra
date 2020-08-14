import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisbursementSectionComponent } from './disbursement-section.component';
import { DisbursementFormComponent } from './disbursement-form/disbursement-form.component';

const routes: Routes = [
  
  {
    path: ':leadId',
    component: DisbursementSectionComponent,
    //resolve: { leadData: LeadDataResolverService },
    children: [
      {
        path: '',
        component: DisbursementFormComponent,
      },
     ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisbursementSectionRouterModule {}
