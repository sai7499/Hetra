import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { WelcomeService } from "../welomce-letter/welcome.service";
import { ToasterService } from "@services/toaster.service"
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementSchemaRegistry } from '@angular/compiler';

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

  constructor(private activatedRoute: ActivatedRoute,
              private labelsData: LabelsService, 
              private commonLovService: CommomLovService, 
              private WelcomeService: WelcomeService, 
              private toasterService: ToasterService,
              private createLeadDataService: CreateLeadDataService,
              private sharedService: SharedService,
              private domSanitizer: DomSanitizer,) { }

  ngOnInit() {

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


  getWelcomeLetterDetails() {
    const data = this.leadId;
    this.WelcomeService.getwelcomeLetterDetails(data).subscribe((res: any) => {
      // console.log(res)
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
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
    } else {
      this.labelsData.getWelcomeDataenglish().subscribe(
        (data) => {
          this.labels = data[0];
          console.log('english labels', this.labels);
        },
      );
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
    } else {
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
}
