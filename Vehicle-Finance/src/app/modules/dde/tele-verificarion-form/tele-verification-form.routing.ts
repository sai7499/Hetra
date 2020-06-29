import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';

const routes: Routes = [
    {
        path: ':leadId/tele-verification-form/:applicantId',
        component: TeleVerificationFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeleVerificationFormRoutingModule { }
