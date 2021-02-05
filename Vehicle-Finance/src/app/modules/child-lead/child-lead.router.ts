import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildLeadComponent } from './child-lead/child-lead.component';

const routes: Routes = [
  {
    path: '',
    component: ChildLeadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildLeadRouterModule {}