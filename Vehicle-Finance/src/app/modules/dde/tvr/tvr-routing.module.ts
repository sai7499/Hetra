import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TvrDetailsComponent } from './tvr-details/tvr-details.component';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';

const routes: Routes = [
  {
    path: '',
    component: TvrDetailsComponent
  },
  {
    path: 'tele-verification-form',
    component: TeleVerificationFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TvrRoutingModule { }
