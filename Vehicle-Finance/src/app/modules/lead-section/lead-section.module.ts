import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadSectionComponent } from './lead-section.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeadCreationRouterModule } from './lead-section.router';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { CoApplicantComponent } from './co-applicant/co-applicant.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SourcingDetailsComponent } from './sourcing-details/sourcing-details.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { SharedModule } from '../shared/shared.module';
import { AddvehicleComponent } from './addvehicle/addvehicle.component';
import { CreditScoreComponent } from './credit-score/credit-score.component';
import { ExactMatchComponent } from './exact-match/exact-match.component';
import { OtpSectionComponent } from './otp-section/otp-section.component';
import { VehicleDetailComponent } from './vehicle-details/vehicle-details.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
    LeadSectionComponent,
    ApplicantDetailsComponent,
    CoApplicantComponent,
    ProductDetailsComponent,
    VehicleDetailComponent,
    SourcingDetailsComponent,
    LoanDetailsComponent,
    AddvehicleComponent,
    CreditScoreComponent,
    ExactMatchComponent,
    OtpSectionComponent,
  ],
  imports: [
    CommonModule,
    LeadCreationRouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    AutocompleteLibModule,
  ],
  exports: [VehicleDetailComponent, SourcingDetailsComponent],
})
export class LeadSectionModule {}
