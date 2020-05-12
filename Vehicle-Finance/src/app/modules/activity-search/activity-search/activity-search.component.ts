import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoginStoreService } from '../../../services/login-store.service';
import { ActivatedRoute } from '@angular/router';
import {CommomLovService} from '../../../services/commom-lov-service';


@Component({
  selector: "app-dashboard",
  templateUrl: "./activity-search.component.html",
  styleUrls: ["./activity-search.component.css"]
})
export class ActivitySearchComponent implements OnInit, OnDestroy {
  openProfile: boolean;
  seletedRoute: string;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];

  bodyClickEvent = event => {
    if (event.target.id === "profileDropDown") {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  };

  constructor(
    private loginStoreService: LoginStoreService,
    private route: ActivatedRoute,
    private commomLovService: CommomLovService) {

      const error = this.route.snapshot.data.getLOV.Error;
      if(error === '0'){
        const LOVs = JSON.parse(this.route.snapshot.data.getLOV.ProcessVariables.response);
        this.commomLovService.setLovData(LOVs)
      }
     
      // console.log('LOV',JSON.parse(this.route.snapshot.data.getLOV.ProcessVariables.response).LOVS.applicantRelationshipWithLead);
     }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;

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
