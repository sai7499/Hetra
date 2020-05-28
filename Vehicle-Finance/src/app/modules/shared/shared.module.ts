import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SharedVehicleDetailsComponent } from './shared-vehicle-details/shared-vehicle-details.component';
import { SharedBasicVehicleDetailsComponent } from './shared-basic-vehicle-details/shared-basic-vehicle-details.component';

@NgModule({
  declarations: [CustomSelectComponent, TextOnlyModalComponent, LeadSectionHeaderComponent, ProfileComponent, SharedVehicleDetailsComponent, SharedBasicVehicleDetailsComponent],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    SharedVehicleDetailsComponent,
    SharedBasicVehicleDetailsComponent
  ]
})
export class SharedModule { }
