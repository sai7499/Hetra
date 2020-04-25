import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HeaderComponent } from "./modules/header/header.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadChildren: () => import("./modules/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "activity-search",
    loadChildren: () => import("./modules/activity-search/activity-search.module").then(m => m.ActivitySearchModule)
  },
  {
    path: "pages",
    component: HeaderComponent,
    children: [
      {
        path: "lead-creation",
        loadChildren: () => import("./modules/lead-creation/lead-creation.module").then(m => m.LeadCreationModule)
      },
      {
        path: "lead-section",
        loadChildren: () => import("./modules/lead-section/lead-section.module").then(m => m.LeadSectionModule)
      },
      {
        path: "terms-condition",
        loadChildren: () => import("./modules/terms-conditions/terms-conditions.module").then(m => m.TermsConditionsModule)
      },
      {
        path: "dde",
        loadChildren: () => import("./modules/dde/dde.module").then(m => m.DdeModule)
      },
      {
        path: "fl-and-pd-report",
        loadChildren: () => import("./modules/dde/fl-and-pd-report/fl-and-pd-report.module").then(m => m.FlAndPdReportModule)
      },
      {
        path: "applicant-details",
        loadChildren: () =>
          import("./modules/dde/applicant-details/applicant-details.module").then(m => m.ApplicantDetailsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
