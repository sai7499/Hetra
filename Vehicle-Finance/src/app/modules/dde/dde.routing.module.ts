import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DdeComponent  } from './dde.component';
// import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { SourcingDdeComponent } from './sourcing-dde/sourcing-dde.component';
import { IncomeDetailsComponent } from './income-details/income-details.component';
import { ExposureDetailsComponent } from './exposure-details/exposure-details.component';

import { VehicleValuationComponent } from './vehicle-valuation/vehicle-valuation.component';
import { ValuationComponent } from './valuation/valuation.component';
import { PslDataComponent } from './psl-data/psl-data.component';
import { FlReportComponent } from './fl-report/fl-report.component';
import { PdReportComponent } from './pd-report/pd-report.component';
import { ApplicantDetailsComponent } from './fl-and-pd-report/applicant-details/applicant-details.component';

const routes: Routes = [{
    path: '',
    component: DdeComponent,
    children: [
        {
            path: 'applicant-details',
            component: ApplicantDetailsComponent
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
        },
        {
            path: 'fl-report',
            component: FlReportComponent,
        },
        {
            path: 'pd-report',
            component: PdReportComponent,
        },
        {
            path: 'vehicle-valuation',
            component: VehicleValuationComponent,
        },
        {
            path: 'valuation',
            component: ValuationComponent
        },
        {
            path: 'psl-data',
            component: PslDataComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DdeRoutingModule {}
