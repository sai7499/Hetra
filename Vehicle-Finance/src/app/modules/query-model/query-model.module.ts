import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QueryModelComponent } from './query-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { QueryModelRouterModule } from './query-model.router';
import { SearchPipe } from '@services/search.pipe';
// import { ScrollToBottomDirective } from './scroll-to-bottom.directive';

@NgModule({
  declarations: [QueryModelComponent, SearchPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // ScrollToBottomDirective,
    QueryModelRouterModule
  ]
})
export class QueryModelModule { }
