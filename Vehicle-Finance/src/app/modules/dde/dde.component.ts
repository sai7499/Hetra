import { Component, OnInit, Renderer2, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CommonDataService } from '@services/common-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoginStoreService } from '@services/login-store.service';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  templateUrl: './dde.component.html',
  styleUrls: ['./dde.component.css'],
})
export class DdeComponent implements OnInit, OnChanges {
  locationIndex: number;
  leadId: number;
  show: number ;
  showNav: boolean = false;
  fiCumPdStatusString: any;
  fiCumPdStatus: boolean;
  productCatCode: string;
  roleId: any;
  roleType: any;
  role: boolean;

  isLoan360: boolean;

  showLoan360Components: boolean;
  isChildLoan: any;
  productId: any;
  ShowChildValuationScreen: boolean;
  showValuationScreen: boolean;

  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService,
    private cds: CommonDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService,
    private loginStoreService: LoginStoreService,
    private loanViewService: LoanViewService

  ) {
    this.leadId = this.route.snapshot.params['leadId'];
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
    });
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.fiCumPdStatusString = localStorage.getItem('isFiCumPd');
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false;
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true;
    }

    console.log('ficumpd status', this.fiCumPdStatus);

    if (this.leadId) {
      const gotLeadData = this.route.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        console.log('LEAD_SECTION_DATA::', leadData);
        if(leadData.leadDetails){
          this.productCatCode = leadData.leadDetails.productCatCode;
        }
        
        console.log('ProductCODE::', this.productCatCode);
        this.createLeadDataService.setLeadSectionData(leadData);
        this.leadStoreService.setLeadCreation(leadData);
        if(leadData.leadDetails){
          this.isChildLoan = leadData.leadDetails.isChildLoan;
          this.productId = leadData.leadDetails.productId;
        }
      }
      if ((this.isChildLoan === '1') && ((this.productId === '1078') || (this.productId === '1079') || (this.productId === '1080'))) {
        this.ShowChildValuationScreen = true;
      }
      if ((this.isChildLoan === '0') && (this.productCatCode !== 'NCV')) {
        this.showValuationScreen = true;
      }

     this.show= (await this.getbandvalue()) as number;
     console.log('this.show', this.show)
      
      // this.sharedService.vehicleValuationNext$.subscribe((val) => {
      //   if (val === true) {
      //     this.onNext();
      //   }
      // });
      // this.sharedService.tvrDetailsPrevious$.subscribe((val) => {
      //   if (val === true) {
      //     this.onPrevious();
      //   }
      // });
    }
    const currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);
    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
      if (this.locationIndex >= 20) {
        this.show = 3;
      } else if (this.locationIndex >= 10) {
        this.show = 2;
      } else {
        this.show = 1;
      }
    });


    // if (this.locationIndex >= 8) {

    //   this.show = 2;
    // } else {
    //   this.show = 1;
    // }

    if (
      this.router.url.includes('/fi-cum-pd-dashboard') ||
      this.router.url.includes('/fi-dashboard') ||
      this.router.url.includes('/cheque-tracking') ||
      this.router.url.includes('/pdd-details') ||
      this.router.url.includes('/loan-status') ||
      this.router.url.includes('/valuation-dashboard') 

    ) {
      this.showNav = false;
    } else {
      this.showNav = true;
    }
    if (this.router.url.includes('/rcu') && this.roleType == '6') {
      this.showNav = false;
    } else if (this.router.url.includes('/rcu') && this.roleType == '2') {
      this.showNav = true;
    }

    console.log(this.productId, 'on change', this.isChildLoan);

  }


  getbandvalue(){
    return new Promise((resolve, rejecet)=>{
      this.sharedService.pslDataNext$.subscribe((val) => {
        if (val === true) {
          // this.onNext();
          resolve( 2)
          
          // this.location.onUrlChange((url: string) => {
          //   this.locationIndex = this.getLocationIndex(url);
          // });
        } else {
          resolve (1)
        }
      });
    })
  }

  ngOnChanges() {
    console.log('on change');

  }



  onPrevious() {
    if (this.show > 2 && this.isLoan360) {
      this.show = 2;
      return this.router.navigateByUrl(`/pages/dde/${this.leadId}/deviations`);
    }
    this.sharedService.getPslDataNext(false)
    this.show = 1;
    // ((this.productCatCode != 'NCV') && ((isChildLoan ==true) &&((prodCode==1078)||(prodCode==1079) || (prodCode==1080)))
    if ((this.showValuationScreen) || (this.ShowChildValuationScreen)) {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/vehicle-valuation`);
    } else if (this.productCatCode == 'NCV') {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/psl-data`);
    }
  }
  onNext() {
    if (this.show === 2 && this.isLoan360) {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/disbursement/${this.leadId}`);
      this.show = 3;
      return;
      //  this.showLoan360Components = true;
    }
    this.sharedService.getPslDataNext(true)
    this.show = 2;
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/tvr-details`);
  }

  getLocationIndex(url: string) {
    if (url.includes('lead-details')) {
      return 0;
    } else if (url.includes('applicant-list')) {
      return 1;
    } else if (url.includes('vehicle-list')) {
      return 2;
    } else if (url.includes('additional-collateral-list')) {
      return 3;
    } else if (url.includes('reference')) {
      return 4;
    } else if (url.includes('fleet-details') || url.includes('track-vehicle')) {
      return 5;
    } else if (url.includes('exposure')) {
      return 6;
    } else if (url.includes('income-details')) {
      return 7;
    } else if (url.includes('psl-data')) {
      return 8;
    } else if (url.includes('vehicle-valuation')) {
      return 9;
    } else if (url.includes('tvr-details')) {
      return 10;
    } else if (url.includes('rcu')) {
      return 11;
    } else if (url.includes('fi-list')) {
      return 12;
    } else if (url.includes('pd-list')) {
      return 13;
    } else if (url.includes('viability') || url.includes('viability-dashboard')) {
      return 14;
    } else if (url.includes('cibil-od')) {
      return 15;
    } else if (url.includes('score-card')) {
      return 16;
    } else if (url.includes('insurance-details')) {
      return 17;
    } else if (url.includes('cam')) {
      return 18;
    } else if (url.includes('deviations')) {
      return 19;
    } else if (url.includes('disbursement')) {
      return 20;
    } else if (url.includes('negotiation')) {
      return 21;
    } else if (url.includes('credit-conditions')) {
      return 22;
    } else if (url.includes('sanction-letter')) {
      return 23;
    } else if (url.includes('term-sheet')) {
      return 24;
    } else if (url.includes('welcome-letter')) {
      return 25;
    } else if (url.includes('delivery-order')) {
      return 26;
    } else if (url.includes('pdd')) {
      return 27;
    } else if (url.includes('loan-details')) {
      return -1;
    }

  }
}
