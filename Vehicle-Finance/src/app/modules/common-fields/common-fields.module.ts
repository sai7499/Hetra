import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { CommonFieldsComponent } from './common-fields.component';
import { CommonFieldsRouterModule } from './common-fields.router';

@NgModule({
    declarations: [CommonFieldsComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      CommonFieldsRouterModule
    ]
  })
  export class CommonFieldsModule { }