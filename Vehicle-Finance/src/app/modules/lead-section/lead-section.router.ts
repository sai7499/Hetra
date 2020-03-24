import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LeadSectionComponent } from "./lead-section.component";
import { VehicleDetailComponent } from "./vehicle-details/vehicle-details.component";
import { ApplicantDetailsComponent } from "./applicant-details/applicant-details.component";
import { CoApplicantComponent } from "./co-applicant/co-applicant.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';

const routes: Routes = [
  {
    path: "",
    component: LeadSectionComponent,
    children: [

      {
        path: "",
        component: SourcingDetailsComponent
      },

      {
        path: "product-details",
        component: ProductDetailsComponent
      },

      {
        path: "vehicle-details",
        component: VehicleDetailComponent
      },

      {
        path: "applicant-details",
        component: ApplicantDetailsComponent
      },

      {
        path: "co-applicant",
        component: CoApplicantComponent
      },

      {
        path: "loan-details",
        component: LoanDetailsComponent
      },
        
     
  
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadCreationRouterModule {}
