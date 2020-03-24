import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LeadCreationComponent } from "./lead-creation/lead-creation.component";
import { LeadDedupeComponent } from "./lead-dedupe/lead-dedupe.component";
import { LeadComponent } from "./lead.component";

const routes: Routes = [
  {
    path: "",
    component: LeadComponent,
    children: [
      {
        path: "",
        component: LeadCreationComponent
      },
      {
        path: "lead-dedupe",
        component: LeadDedupeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadCreationRouterModule { }
