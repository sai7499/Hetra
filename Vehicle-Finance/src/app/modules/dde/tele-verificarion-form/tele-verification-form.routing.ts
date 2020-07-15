import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeleVerificationFormComponent } from './tele-verification-form/tele-verification-form.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';


const routes: Routes = [
    {
        path: ':leadId/tele-verification-form/:applicantType/:applicantId',
        component: TeleVerificationFormComponent,
        resolve: { leadData: LeadDataResolverService },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeleVerificationFormRoutingModule { }
