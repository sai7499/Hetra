import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonFieldsComponent } from './common-fields.component';

const routes: Routes = [
  {
    path: '',
    component: CommonFieldsComponent,
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonFieldsRouterModule {
  
}