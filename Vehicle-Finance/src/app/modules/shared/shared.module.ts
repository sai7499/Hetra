import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { ProfileComponent } from './profile/profile.component';
import {  } from './applicant-list/applicant-list.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { AddOrUpdateApplicantComponent } from './add-update-applicant/add-update-applicant.component';
import { DdeSharedModule } from '../dde/shared/shared.module';
import {ApplicantListComponent} from './applicant-list/applicant-list.component'
import { SharedBasicVehicleDetailsComponent } from './shared-basic-vehicle-details/shared-basic-vehicle-details.component';
import { SharedVehicleDetailsComponent } from './shared-vehicle-details/shared-vehicle-details.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { setTheme } from 'ngx-bootstrap/utils';

setTheme('bs4'); 

@NgModule({
  declarations: [
    CustomSelectComponent,
    TextOnlyModalComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    IdentityDetailsComponent,
    AddressDetailsComponent,
    AddOrUpdateApplicantComponent,
    ApplicantListComponent,
    SharedBasicVehicleDetailsComponent,
    SharedVehicleDetailsComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    DdeSharedModule,
    NgxPaginationModule
  ],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    ApplicantListComponent,
    AddressDetailsComponent,
    IdentityDetailsComponent,
    AddOrUpdateApplicantComponent,
    SharedBasicVehicleDetailsComponent,
    SharedVehicleDetailsComponent,
    SearchBarComponent
  ],
})
export class SharedModule { }
