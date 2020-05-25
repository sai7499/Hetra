import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AddOrUpdateApplicantComponent } from './add-update-applicant/add-update-applicant.component';

@NgModule({
  declarations: [
    CustomSelectComponent,
    TextOnlyModalComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    AddOrUpdateApplicantComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    AddOrUpdateApplicantComponent,
  ],
})
export class SharedModule {}
