import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule} from '@angular/forms';
import { ActivitySearchComponent } from "./activity-search/activity-search.component";

import { ActivitySearchRouterModule } from "./activity-search.router";


@NgModule({
  declarations: [ActivitySearchComponent],
  imports: [CommonModule, ActivitySearchRouterModule, FormsModule]
})
export class ActivitySearchModule {}
