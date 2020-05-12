import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { Routes,RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [CustomSelectComponent, TextOnlyModalComponent, LeadSectionHeaderComponent, ProfileComponent],
  imports: [CommonModule, FormsModule,RouterModule],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent]
})
export class SharedModule {}
