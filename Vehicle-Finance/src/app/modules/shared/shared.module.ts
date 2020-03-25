import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms'
import { CommonModule } from "@angular/common";
import { CustomSelectComponent } from "./custom-select/custom-select.component";
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';

@NgModule({
  declarations: [CustomSelectComponent, TextOnlyModalComponent],
  imports: [CommonModule, FormsModule],
  exports: [CustomSelectComponent]
})
export class SharedModule {}
