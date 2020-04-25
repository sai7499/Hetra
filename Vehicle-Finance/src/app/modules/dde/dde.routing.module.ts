import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent  } from './dde.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-list',
            component: ApplicantListComponent
        },
        {
            path: 'lead-details',
            component: SourcingDdeComponent
        },
        {
            path: 'income-details',
            component: IncomeDetailsComponent
        },
        {
            path: 'exposure',
            component: ExposureDetailsComponent

        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule {}
