import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LeadSectionComponent } from "./lead-section.component";
import { VehicleDetailComponent } from "./vehicle-details/vehicle-details.component";
import { ApplicantDetailsComponent } from "./applicant-details/applicant-details.component";
import { CoApplicantComponent } from "./co-applicant/co-applicant.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { LeadCreationRouterModule } from "./lead-section.router";
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LeadSectionComponent,
    VehicleDetailComponent,
    ApplicantDetailsComponent,
    CoApplicantComponent,
    ProductDetailsComponent,
    SourcingDetailsComponent,
    LoanDetailsComponent
  ],
  imports: [CommonModule, LeadCreationRouterModule, SharedModule]
})
export class LeadSectionModule {}
