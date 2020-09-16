import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from 'src/app/services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { WelcomeService } from "../welomce-letter/welcome.service";
import { ToasterService } from "@services/toaster.service"

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
  div1Data: string;

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

  constructor(private activatedRoute: ActivatedRoute, private labelsData: LabelsService, private commonLovService: CommomLovService, private WelcomeService: WelcomeService
    , private toasterService: ToasterService,) { }

  ngOnInit() {

    //this.getLabels();
    this.getLeadId();
    console.log(this.getLeadId())
   // this.getWelcomeLetterDetails();
    // this.onChangeLanguage(ENGPRFLAN);
    //this.viweWelcomeLetter();
  }


  getWelcomeLetterDetails() {
    const data = this.leadId;
    this.WelcomeService.getwelcomeLetterDetails(data).subscribe((res: any) => {
      console.log(res)
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        this.isWelcomeDetails = res['ProcessVariables'];
        console.log("welcome leter details", this.isWelcomeDetails)
        this.applicantList = this.isWelcomeDetails["applicantDetails"]
        this.coApplicantList = this.isWelcomeDetails["coAppDetails"];
        this.guarantorList = this.isWelcomeDetails["guarantorDetails"];
        this.loanApprovedDetails = this.isWelcomeDetails["loanApprovedDetails"];
        this.div1Data = this.isWelcomeDetails["div1Data"];
        this.div2Data = this.isWelcomeDetails["div2Data"];
        this.div3Data = this.isWelcomeDetails["div3Data"];
        this.vehicleDetailsArray = this.isWelcomeDetails["vehicleDetails"];
        
        this.repaymentDetails = res['ProcessVariables'].repaymentDetails;         
        this.showWelcomeLetter= true;
        
        this.onChangeLanguage(res["ProcessVariables"].preferredLan)


      } else {
        this.toasterService.showError(res['ProcessVariables'].error["message"], '')
      }
    });
  }

  getLeadId() {
    this.activatedRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log('LEADID::', this.leadId);
  }

  downloadpdf() {
    var options = {
      margin: .25,
      filename: `WelcomeLetter_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'b4', orientation: 'p' }
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
}
