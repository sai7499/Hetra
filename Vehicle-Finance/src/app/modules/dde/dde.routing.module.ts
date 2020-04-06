import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-details',
            component: ApplicantDetailsComponent
        },
        { path: 'vehicle-details', loadChildren: () => import(`./vehicle-details/vehicle-details.module`).then(m => m.VehicleDetailsModule) },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule { }
