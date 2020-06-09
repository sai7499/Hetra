import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TermsConditionsComponent } from "./terms-conditions.component";

const routes: Routes = [
  {
    path: ":leadId",
    component: TermsConditionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsConditionsRouter {}
