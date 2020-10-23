import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { TermsConditionsComponent } from "./terms-conditions.component";
import { TermsConditionsRouter } from './terms-condtions.router';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [FormsModule, CommonModule, TermsConditionsRouter,SharedModule]
})
export class TermsConditionsModule {}
