import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SupervisorDashboardComponent } from './supervisor-dashboard/supervisor-dashboard.component';
import { SupervisorComponent } from './supervisor.component';

const routes: Routes = [
  {
    path: "",
    component: SupervisorComponent,
    children: [
      {
        path: "",
        component: SupervisorDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRouterModule { }
