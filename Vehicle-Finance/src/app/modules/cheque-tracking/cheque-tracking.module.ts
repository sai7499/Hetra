import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ChequeComponent } from './cheque.component';
import { ChequeTrackingComponent } from './cheque-tracking.component';
// import { WelomceLetterComponent } from '@modules/dde/cpc-maker/welomce-letter/welomce-letter.component';
import { ChequeTrackingRouterModule } from './cheque-tracking.routing';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [ 
        ChequeTrackingComponent, 
        // WelomceLetterComponent,
        ChequeComponent
     ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        ChequeTrackingRouterModule, 
        SharedModule,
        CommonModule
    ]
})
export class ChequeTrackingModule {

}
