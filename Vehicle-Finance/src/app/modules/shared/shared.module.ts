import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { LeadSectionHeaderComponent } from './lead-section-header/lead-section-header.component';
import { Routes,RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IdentityDetailsComponent } from './identity-details/identity-details.component';
import { ReactiveFormsModule} from '@angular/forms';
import { AddressDetailsComponent } from './address-details/address-details.component'


@NgModule({
  declarations: [CustomSelectComponent, 
                 TextOnlyModalComponent, 
                 LeadSectionHeaderComponent, 
                 ProfileComponent, 
                 IdentityDetailsComponent, 
                 AddressDetailsComponent],
  imports: [CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  exports: [
    CustomSelectComponent,
    LeadSectionHeaderComponent,
    ProfileComponent,
    AddressDetailsComponent
    ]
})
export class SharedModule {}
