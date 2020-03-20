import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ActivitySearchComponent } from "./activity-search/activity-search.component";

const routes: Routes = [
  {
    path: "",
    component: ActivitySearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitySearchRouterModule {}
