import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { TermsConditionsComponent } from "./terms-conditions.component";
import { TermsConditionsRouter } from './terms-condtions.router';

@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [FormsModule, CommonModule, TermsConditionsRouter]
})
export class TermsConditionsModule {}
