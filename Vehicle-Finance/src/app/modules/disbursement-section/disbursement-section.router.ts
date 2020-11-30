import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisbursementSectionComponent } from './disbursement-section.component';
import { DisbursementFormComponent } from './disbursement-form/disbursement-form.component';
import { TrancheDisburseComponent } from '@modules/disbursement-section/tranche-disburse/tranche-disburse.component';

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
      {
        path: 'tranche-disburse',
        component: TrancheDisburseComponent,
      },
     ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisbursementSectionRouterModule {}
