import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';

const routes: Routes = [
  {
    path: 'tvr-details',
    component: TvrDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TvrRoutingModule { }
