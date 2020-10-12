import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanStatusComponent} from './loan-status.component'
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { LoanBookingComponent } from './loan-booking/loan-booking.component';
import { LoanTestComponent } from './loan-test/loan-test.component';
const routes: Routes = [
  {
    path: ':leadId',
    component: LoanBookingComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
        {
            path: '',
            component: LoanStatusComponent
        },
        {
            path: 'loan',
            component: LoanTestComponent
        },
        // {
        //     path: 'loan-status',
        //     component: LoanStatusComponent
        // }
        //{
        //     path: 'term-sheet',
        //     component: TermSheetComponent
        // },
		// {
        //     path: 'welomce-letter',
        //     component: WelomceLetterComponent
        // },
        // {
        //     path: 'delivery-order',
        //     component: DeliveryOrderComponent
        // }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanStatusRoutingModule { }
