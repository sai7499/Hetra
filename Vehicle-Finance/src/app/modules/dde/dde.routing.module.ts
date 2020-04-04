import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent  } from './dde.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { FlAndPDComponent } from './fl-and-pd/fl-and-pd.component';
import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-details',
            component: ApplicantDetailsComponent
        },
        {
            path: 'fl-and-pd',
            component: FlAndPDComponent
        },
        {
            path: 'vehicle-valuation',
            component: VehicleValuationComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule {}
