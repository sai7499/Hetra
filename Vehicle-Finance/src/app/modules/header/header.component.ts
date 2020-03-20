import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  openProfile: boolean;

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
