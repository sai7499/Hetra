import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { CommonFieldsComponent } from './common-fields.component';

const routes: Routes = [
  {
    path: '',
    // :leadId
    component: CommonFieldsComponent,
    // resolve: { leadData: LeadDataResolverService }
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonFieldsRouterModule {
  
}