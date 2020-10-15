import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { PersonalDiscussionService } from '@services/personal-discussion.service';

import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-loan-booking',
  templateUrl: './loan-booking.component.html',
  styleUrls: ['./loan-booking.component.css']
})
export class LoanBookingComponent implements OnInit {
  locationIndex = 0;
  pdDetail: any;
  leadId: any;
  applicantId: any;
  version: any;
  userId: any;
  roleName: any;
  roles: any = [];
  roleId: any;
  roleType: any;
  productCatCode;
  productCode:string;
  hideProgress = true;
  constructor(
    private router: Router,
    private location: Location,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private sharedService: SharedService
  ) {
  }

   ngOnInit() {
     
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    console.log('currentUrl', currentUrl);
    console.log(this.locationIndex);
    this.toggleProgress(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
      console.log(this.locationIndex);
      this.toggleProgress(url);
    });
    this.activatedRoute.params.subscribe((value: any) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
    });
    this.sharedService.productCatCode$.subscribe((value)=> {

      this.productCode = value;
      console.log('pdtcat',this.productCode)
    })
  }

  toggleProgress(url) {
    if (url.includes('dedupe')) {
      this.hideProgress = false;
    } else {
      this.hideProgress = true;
    }
  }

  onNavigate(url: string) {
    // tslint:disable-next-line: triple-equals
     this.router.navigate([`/pages/loanbooking/${this.leadId}/${url}`]);
    // tslint:disable-next-line: triple-equals
  }
  getLocationIndex(url: string) {
    
    if (url.includes('loan-booking-status')) {
      return 0;
    }  else if (url.includes('welomce-letter')) {
      return 1;
    } else if (url.includes('delivery-order')) {
      return 2;
    }

}

getLeadSectiondata() {
  const leadData = this.createLeadDataService.getLeadSectionData();  
  this.productCatCode = leadData['leadDetails']? leadData['leadDetails'].productCatCode: null;
  console.log("PRODUCT_CODE::", this.productCatCode);
 
}

}

