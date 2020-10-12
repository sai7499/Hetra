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
    console.log(this.locationIndex);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
      console.log(this.locationIndex);
    });
    this.activatedRoute.params.subscribe((value: any) => {
      console.log('params', value);
      this.leadId = Number(value.leadId);
      alert(value)
    });
    // this.activatedRoute.firstChild.params.subscribe((value: any) => {
    //   this.applicantId = value.applicantId;
    //   this.version = value.version;
    //   console.log('applicant ID', value.applicantId);
    //   console.log('version in fi and pd report', this.version);
    // });
    // this.getLeadSectiondata();  
   //pages/dde/1178/loan-status
    
  }

  onNavigate(url: string) {
    // tslint:disable-next-line: triple-equals
      this.router.navigate([`/pages/dde/${this.leadId}/loan`]);
    // tslint:disable-next-line: triple-equals
  }
  getLocationIndex(url: string) {
    
    if (url.includes('loan')) {
      return 0;
    }  else if (url.includes('sanction-details')) {
      return 1;
    } else if (url.includes('pdc-details')) {
      return 2;
    }

}

getLeadSectiondata() {
  const leadData = this.createLeadDataService.getLeadSectionData();  
  this.productCatCode = leadData['leadDetails']? leadData['leadDetails'].productCatCode: null;
  console.log("PRODUCT_CODE::", this.productCatCode);
 
}

}

