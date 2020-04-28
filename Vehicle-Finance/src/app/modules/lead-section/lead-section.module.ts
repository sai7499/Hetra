import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LeadSectionComponent } from "./lead-section.component";

import { LeadCreationRouterModule } from "./lead-section.router";
import { ApplicantDetailsComponent } from "./applicant-details/applicant-details.component";
import { CoApplicantComponent } from "./co-applicant/co-applicant.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SharedModule } from '../shared/shared.module';
import { VehicleDetailComponent } from './vehicle-details/vehicle-details.component';


@NgModule({
  declarations: [
    LeadSectionComponent,
    ApplicantDetailsComponent,
    CoApplicantComponent,
    ProductDetailsComponent,
    VehicleDetailComponent,
    SourcingDetailsComponent,
    LoanDetailsComponent,
  ],
  imports: [
    CommonModule,
    LeadCreationRouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LeadSectionModule {}
