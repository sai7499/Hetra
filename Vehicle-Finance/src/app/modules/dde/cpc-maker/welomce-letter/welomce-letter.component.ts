import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { WelcomeService } from "../welomce-letter/welcome.service";
import { ToasterService } from "@services/toaster.service"
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Location } from '@angular/common';
import { LoanViewService } from '@services/loan-view.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-welomce-letter',
  templateUrl: './welomce-letter.component.html',
  styleUrls: ['./welomce-letter.component.css']
  // providers: [DatePipe]
})
export class WelomceLetterComponent implements OnInit {
  agreementNo: any;
  isError: boolean = false;
  leadId;
  labels: any = {};
  isWelcomeDetails: boolean;
  welcomeDetailsObject: any = {};
  applicantList: any = [];
  coApplicantList: any = [];
  guarantorList: any = [];
  vehicleDetailsArray: any = [];
  loanApprovedDetails: any = [];
  generalTermsAndConditions: string;
  div1Data: any;

  date: Date = new Date();
  todayDate;
  roleId: any;
  roleType: any;
  addressLine2: any;
  addressLine3: any;
  district: any;
  country: any;
  pincode: any;
  mobileNo: any;
  name: any;
  addressLine1: any
  div2Data: any;
  div3Data: any;
  emiSheduleQuery: any;
  collateralId: any;
  documentationCharges: any;
  emiAmt: any;
  emiCovPremiumAmt: any;
  emiDueDt: any;
  emiStartDt: any;
  fieldVisitChargesApplicable: any;
  insPremium: any;
  interestRate: any;
  loanAmt: any;
  loanTenor: any;
  modeOfPayment: any;
  noOfAdvEmi: any;
  npdcCharges: any;
  penalInterest: any;
  personalAccidentCover: any;
  repay: any;
  rollOverPdc: any;
  valueAddedServices: any;
  prefLanQuery: any;
  preferredLan: any;
  repaymentDetails: any;
  chassisNo: any;
  engineNo: any;
  manufacMonthYr: any;
  vehMake: any;
  vehRegNo: any;
  emiEndDt: any;
  advEmiAmt: any;
  allIncIRR: any;
  creditShield: any;
  assetCost: any;
  showWelcomeLetter: boolean = false;
  imageUrl: any;
  cibilImage: any;
  productCatCode;
  doc: any;
  dummy: string;
  isLoanBooking: boolean;
  showModal: boolean;
  chequeModeMsg: string;
  isLoan360: boolean;

  trancheName = [
    {
      key : '1',
      value : 'Tranche_2'
    },
    {
      key : '2',
      value : 'Tranche_3'
    },
    {
      key : '3',
      value : 'Tranche_4'
    },
  ]

  constructor(private activatedRoute: ActivatedRoute,
              private labelsData: LabelsService, 
              private loginStoreService: LoginStoreService, 
              private WelcomeService: WelcomeService, 
              private toasterService: ToasterService,
              private createLeadDataService: CreateLeadDataService,
              private sharedService: SharedService,
              private domSanitizer: DomSanitizer,
              private location: Location,
              private router: Router,
              private loanViewService: LoanViewService) { }

  ngOnInit() {

    this.isLoan360 = this.loanViewService.checkIsLoan360();

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
    });

    const path = this.location.path();
    console.log(typeof
      (this.roleType), 'path', path);

    if (path.includes('loanbooking')) {
        this.isLoanBooking = true;
    } else {
        this.isLoanBooking = false;
    }

    //this.getLabels();
    this.getLeadId();
    console.log(this.getLeadId())
   // this.getWelcomeLetterDetails();
    // this.onChangeLanguage(ENGPRFLAN);
    //this.viweWelcomeLetter();
    this.sharedService.productCatCode$.subscribe((value) => {
      this.productCatCode = value;
    });
  }

  onModalClick() {
    this.showModal = false;
  }


  getWelcomeLetterDetails() {
    const data = this.leadId;
    this.WelcomeService.getwelcomeLetterDetails(data, this.isLoanBooking).subscribe((res: any) => {
      // console.log(res)
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        const processVariables = res.ProcessVariables;
        if (processVariables.isChequeMode) {
          this.showModal = true;
          this.chequeModeMsg = processVariables.chequeModeMsg;
          return;
        }
        this.isWelcomeDetails = res['ProcessVariables'];
        // console.log("welcome leter details", this.isWelcomeDetails);
        this.onChangeLanguage(res["ProcessVariables"].preferredLan);
        this.applicantList = this.isWelcomeDetails["applicantDetails"]
        this.coApplicantList = this.isWelcomeDetails["coAppDetails"];
        this.guarantorList = this.isWelcomeDetails["guarantorDetails"];
        this.loanApprovedDetails = this.isWelcomeDetails["loanApprovedDetails"];
        this.div1Data = this.isWelcomeDetails["div1Data"];
        this.div1Data = decodeURI(this.div1Data);
        // this.div1Data =this.domSanitizer.bypassSecurityTrustHtml(this.div1Data); 
        //bypassSecurityTrustHtml(this.div1Data); 
        //  const doc = document.getElementById("divone")
        // doc.innerHTML = window.atob(this.div1Data);  
        //this.div1Data.innerHTML = window.atob(this.div1Data); 
        // let text =' <p>hii helo bye</p>'
        // this.dummy = btoa(text);
        // this.dummy = atob(text);
        for(var i = 0; i <this.loanApprovedDetails.length; i++){
          this.loanApprovedDetails[i]['loanAmt'] = Number(this.loanApprovedDetails[i]['loanAmt']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['assetCost'] = Number(this.loanApprovedDetails[i]['assetCost']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['advEmiAmt'] = Number(this.loanApprovedDetails[i]['advEmiAmt']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['creditShield'] = Number(this.loanApprovedDetails[i]['creditShield']).toLocaleString('en-IN')

          this.loanApprovedDetails[i]['rollOverPdc'] = Number(this.loanApprovedDetails[i]['rollOverPdc']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['insPremium'] = Number(this.loanApprovedDetails[i]['insPremium']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['emiAmt'] = Number(this.loanApprovedDetails[i]['emiAmt']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['fieldVisitChargesApplicable'] = Number(this.loanApprovedDetails[i]['fieldVisitChargesApplicable']).toLocaleString('en-IN')
          this.loanApprovedDetails[i]['processingCharges'] = Number(this.loanApprovedDetails[i]['processingCharges']).toLocaleString('en-IN')
        }
        

        this.div2Data = this.isWelcomeDetails["div2Data"];
        this.div2Data = decodeURI(this.div2Data);
       
        this.div3Data = this.isWelcomeDetails["div3Data"];
        this.div3Data = decodeURI(this.div3Data);
        //console.log("reshma"+this.div1Data);
        //console.log(this.div2Data);
        //console.log(this.div3Data);

        // if(this.preferredLan!== "ENGPRFLAN" ){
        //   this.div1Data = decodeURI(this.div1Data);
        //   this.div2Data = decodeURI(this.div2Data);
        //   this.div3Data = decodeURI(this.div3Data);
        // } 

        // if(this.preferredLan!== "ENGPRFLAN" ){
          // this.div1Data = decodeURI(this.div1Data);
          // this.div2Data = decodeURI(this.div2Data);
          // this.div3Data = decodeURI(this.div3Data);
        // } 
        this.vehicleDetailsArray = this.isWelcomeDetails["vehicleDetails"];
        
        this.repaymentDetails = res['ProcessVariables'].repaymentDetails;
        for(var i =0 ; i<this.repaymentDetails.length; i++){
          this.repaymentDetails[i]['instalmentAmt'] = Number(this.repaymentDetails[i]['instalmentAmt']).toLocaleString('en-IN')
          this.repaymentDetails[i]['motorIns'] = Number(this.repaymentDetails[i]['motorIns']).toLocaleString('en-IN')
          this.repaymentDetails[i]['principleAmt'] = Number(this.repaymentDetails[i]['principleAmt']).toLocaleString('en-IN')
          this.repaymentDetails[i]['interestAmt'] = Number(this.repaymentDetails[i]['interestAmt']).toLocaleString('en-IN')
          this.repaymentDetails[i]['pricipleOutstanding'] = Number(this.repaymentDetails[i]['pricipleOutstanding']).toLocaleString('en-IN')
        }       
        this.showWelcomeLetter= true;
      } else {
        this.toasterService.showError(res['ProcessVariables'].error["message"], '')
      }

      // this.div1Data = atob(this.div1Data);
      // this.isWelcomeDetails["div1Data"]= this.domSanitizer.bypassSecurityTrustHtml(this.div1Data); 
      // this.div2Data = atob(this.div2Data);
      // this.isWelcomeDetails["div2Data"]= this.domSanitizer.bypassSecurityTrustHtml(this.div2Data); 
      // this.div3Data = atob(this.div3Data);
      // this.isWelcomeDetails["div3Data"]= this.domSanitizer.bypassSecurityTrustHtml(this.div3Data); 

      // if (res.ProcessVariables.error.code == '0') {
      //   const imageUrl = res.ProcessVariables.response;
      //   this.imageUrl = imageUrl;
      //   this.imageUrl = atob(this.imageUrl); // decoding base64 string to get xml file
      //   this.imageUrl = this.domSanitizer.bypassSecurityTrustHtml(this.imageUrl); // sanitizing xml doc for rendering with proper css
      //   this.cibilImage = this.imageUrl;
      // } else {
      //   this.imageUrl = res.ProcessVariables.error.message;
      //   this.cibilImage = res.ProcessVariables.error.message;
      // }
    });
    // this.getLeadSectiondata()
      
  }

  getLeadId() {
    this.activatedRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log('LEADID::', this.leadId);
  }

  downloadpdf() {
    var options = {
      margin:[0.5, 0.5, 0.5, 0.5],
      //margin: 0.5,
      filename: `WelcomeLetter_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'b4', orientation: 'p' },
      html2canvas: {scale:1.5, logging:true}
      //pagebreak: { mode: 'css', after:'.break-page'},
    }
    html2pdf().from(document.getElementById("ContentToConvert")).set(options).save();
    // this.getWelcomeLetterDetails();
  }

  getLabels() {

    if (this.labels === 'TELPRFLAN') {
      this.labelsData.getWelcomeDatatelugu().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('marati labels', this.labels);
        },
      );
    } else if (this.labels === 'MARPRFLAN') {
      this.labelsData.getWelcomeDatamarati().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('telugu labels', this.labels);
        },
      );
    } else if (this.labels === 'KANPRFLAN') {
      this.labelsData.getWelcomeDatakanada().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('kanada labels', this.labels);
        },
      );
    } 
    else if (this.labels === 'HINPRFLAN') {
      this.labelsData.getWelcomeDatahindi().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('hindi labels', this.labels);
        },
      );
    }
    else if (this.labels === 'TAMPRFLAN') {
      this.labelsData.getWelcomeDatatamil().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('tamil labels', this.labels);
        },
      );
    }
    else if (this.labels === 'GUJPRFLAN') {
      this.labelsData.getWelcomeDatagujarati().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('gujarati labels', this.labels);
        },
      );
    }
    else {
      this.labelsData.getWelcomeDataenglish().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('english labels', this.labels);
        },
      );
    }

  }

  onNext() {
    if (this.productCatCode === 'NCV') {
        this.router.navigateByUrl(`/pages/loanbooking/${this.leadId}/delivery-order`);
    } else {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/pdd`);
    }

    
  }

  onChangeLanguage(labels: string) {
    this.preferredLan = labels;
    if (labels == 'TELPRFLAN') {
    this.labelsData.getWelcomeDatatelugu().subscribe((data) => {
      this.labels = data[0];
    });
    } else if(labels == 'MARPRFLAN'){
      this.labelsData.getWelcomeDatamarati().subscribe((data) => {
        this.labels = data[0];
      });
    } 
    else if(labels == 'KANPRFLAN'){
      this.labelsData.getWelcomeDatakanada().subscribe((data) => {
        this.labels = data[0];
      });
    } 
    else if(labels == 'HINPRFLAN'){
      this.labelsData.getWelcomeDatahindi().subscribe((data) => {
        this.labels = data[0];
      });
    } 
    else if(labels == 'TAMPRFLAN'){
      this.labelsData.getWelcomeDatatamil().subscribe((data) => {
        this.labels = data[0];
      });
    } 
    else if(labels == 'GUJPRFLAN'){
      this.labelsData.getWelcomeDatagujarati().subscribe((data) => {
        this.labels = data[0];
      });
    } 
    else {
    //if(labels === 'TAMPRELAN'){
      this.labelsData.getWelcomeDataenglish().subscribe((data) => {
        this.labels = data[0];
      });
    }
  }
  viweWelcomeLetter(){
    this.getWelcomeLetterDetails();
  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE:", this.productCatCode);
  }

  onBack() {
    const path = this.location.path();
    if (this.isLoan360) {
      return this.router.navigateByUrl(`pages/dde/${this.leadId}/term-sheet`);
    }
    if (path.includes('cheque-tracking')) {
      return this.router.navigateByUrl(`/pages/cheque-tracking/${this.leadId}`);
    } else if (path.includes('loanbooking')) {
      return this.router.navigateByUrl(`/pages/loanbooking/${this.leadId}/loan-booking-status`)

    }
  }
}
