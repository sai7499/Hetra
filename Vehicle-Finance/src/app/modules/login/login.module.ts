import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";

import { LoginRouterModule } from "./login.router";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRouterModule]
})
export class LoginModule {}
