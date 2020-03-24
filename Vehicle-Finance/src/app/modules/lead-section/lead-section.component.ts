import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { LeadSectionService } from 'src/app/services/lead-section.service';

@Component({
  selector: "app-lead-section",
  templateUrl: "./lead-section.component.html",
  styleUrls: ["./lead-section.component.css"]
})
export class LeadSectionComponent implements OnInit {
  currentPage = 0;

  constructor(
    private leadSectionService: LeadSectionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.location.onUrlChange((url, state) => {
      console.log("url", url, "state", state);
      if (url.includes("product-details")) {
        this.currentPage = 1;
      } else if (url.includes("vehicle-details")) {
        this.currentPage = 2;
      } else if (url.includes("applicant-details")) {
        this.currentPage = 3;
      } else if (url.includes("loan-details")) {
        this.currentPage = 4;
      } else {
        this.currentPage = 0;
      }
    });
  }

}
