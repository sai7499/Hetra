import { NgModule } from '@angular/core';

import { LoanViewComponent } from './loan-view.component';
import { LoanViewRoutingModule } from './loan-view.module.routing';

@NgModule({
    declarations: [
        LoanViewComponent
    ],
    imports: [ LoanViewRoutingModule]
})
export class LoanViewModule {

}
