import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./activity-search.component.html",
  styleUrls: ["./activity-search.component.css"]
})
export class ActivitySearchComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;

  bodyClickEvent = event => {
    if (event.target.id === "profileDropDown") {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  };

  constructor() {}

  ngOnInit() {
    document
      .querySelector("body")
      .addEventListener("click", this.bodyClickEvent);
  }

  ngOnDestroy() {
    document
      .querySelector("body")
      .removeEventListener("click", this.bodyClickEvent);
  }
}
