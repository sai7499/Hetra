import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildLoanComponent } from './child-loan/child-loan.component';

const routes: Routes = [
  {
    path: '',
    component: ChildLoanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildLoanRouterModule {}