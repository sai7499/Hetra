import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms'
import { CommonModule } from "@angular/common";
import { CustomSelectComponent } from "./custom-select/custom-select.component";
import { TextOnlyModalComponent } from './Modals/text-only-modal/text-only-modal.component';
import { StyledPaginationDirective } from './pagination/styled-pagination.directive';

@NgModule({
  declarations: [CustomSelectComponent, TextOnlyModalComponent, StyledPaginationDirective],
  imports: [CommonModule, FormsModule],
  exports: [CustomSelectComponent ,StyledPaginationDirective]
})
export class SharedModule {}
