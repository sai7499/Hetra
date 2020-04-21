import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HeaderComponent } from "./modules/header/header.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/login/login.module").then(m => m.LoginModule)
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
        path: "document-viewupload",
        loadChildren: () => import("./modules/document-viewupload/document-viewupload.module").then(m => m.DocumentViewuploadModule)
      },
      {
        path: 'terms-condition',
        loadChildren: () => import('./modules/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsModule)
      },
      {
        path: 'dde',
        loadChildren: () => import('./modules/dde/dde.module').then(m => m.DdeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
