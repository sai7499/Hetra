import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryDataResolverService } from '@modules/lead-section/services/queryDataResolver.service';
import { QueryModelComponent } from './query-model.component';

const routes: Routes = [
  {
    path: '',
    component: QueryModelComponent,
    resolve: { data : QueryDataResolverService },
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryModelRouterModule {
  
}
