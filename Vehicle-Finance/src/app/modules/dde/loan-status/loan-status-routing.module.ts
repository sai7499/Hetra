import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanStatusComponent} from './loan-status.component'
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { LoanBookingComponent } from './loan-booking/loan-booking.component';
import { WelomceLetterComponent } from '../cpc-maker/welomce-letter/welomce-letter.component';
import { DeliveryOrderComponent } from '../cpc-maker/delivery-order/delivery-order.component';
const routes: Routes = [
  {
    path: ':leadId',
    component: LoanBookingComponent,
    resolve: { leadData: LeadDataResolverService },
    children: [
        {
            path: 'loan-booking-status',
            component: LoanStatusComponent
        },
        {
            path: 'welomce-letter',
            component: WelomceLetterComponent
        },
        {
            path: 'delivery-order',
            component: DeliveryOrderComponent
        }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanStatusRoutingModule { }
