import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LeadSectionComponent } from "./lead-section.component";

import { LeadCreationRouterModule } from "./lead-section.router";
import { VehicleDetailComponent } from "./vehicle-details/vehicle-details.component";
import { ApplicantDetailsComponent } from "./applicant-details/applicant-details.component";
import { CoApplicantComponent } from "./co-applicant/co-applicant.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule } from '@angular/forms';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';


@NgModule({
  declarations: [
    LeadSectionComponent,
    VehicleDetailComponent,
    ApplicantDetailsComponent,
    CoApplicantComponent,
  
    ProductDetailsComponent,
  
    SourcingDetailsComponent,
  
    LoanDetailsComponent,
  
   
    
  ],
  imports: [CommonModule, LeadCreationRouterModule,FormsModule]
})
export class LeadSectionModule {}
