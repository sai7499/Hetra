import { LoginService } from './login/login.service';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRouterModule } from "./login.router";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRouterModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[LoginService]
})
export class LoginModule {}
