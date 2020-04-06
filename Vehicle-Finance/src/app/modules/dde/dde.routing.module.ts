import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent } from './dde.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-list',
            component: ApplicantListComponent
        },
        {
            path: 'vehicle-list',
            loadChildren: () => import('./vehicle-details/vehicle-details.module').then(m => m.VehicleDetailsModule)
        },
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule { }
