import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { QueryModelComponent } from './query-model.component';

const routes: Routes = [
  {
    path: '',
    component: QueryModelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryModelRouterModule {
  
}
