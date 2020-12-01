import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoanViewComponent } from './loan-view.component';

const routes: Routes = [
    {
        path: '',
        component: LoanViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanViewRoutingModule {}

