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
    this.getWelcomeLetterDetails();
    // this.onChangeLanguage(ENGPRFLAN);

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
        // const validData = res['ProcessVariables'];
        // this.agreementNo = res['ProcessVariables'].agreementNo;
        // this.name = res['ProcessVariables'].applicantDetails.name,
        // this.addressLine1 = res['ProcessVariables'].applicantDetails.addressLine1,
        // this.addressLine2 = res['ProcessVariables'].addressLine2,
        // this.addressLine3 = res['ProcessVariables'].applicantDetails.addressLine3,
        // this.district = res['ProcessVariables'].applicantDetails.district,
        // this.country = res['ProcessVariables'].applicantDetails.country,
        // this.pincode = res['ProcessVariables'].applicantDetails.pincode,
        // this.mobileNo = res['ProcessVariables'].applicantDetails.mobileNo,
        // this.div1Data = res['ProcessVariables'].div1Data,
        // this.div2Data = res['ProcessVariables'].div2Data,
        // this.div3Data = res['ProcessVariables'].div3Data,
        // this.emiSheduleQuery = res['ProcessVariables'].emiSheduleQuery,
        // this.collateralId = res['ProcessVariables'].applicantDetails.advEmiAmt,
        // this.documentationCharges = res['ProcessVariables'].applicantDetails.allIncIRR,
        // this.advEmiAmt = res['ProcessVariables'].loanApprovedDetails.advEmiAmt,
        // this.allIncIRR = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.assetCost = res['ProcessVariables'].loanApprovedDetails.assetCost,
        // this.collateralId = res['ProcessVariables'].loanApprovedDetails.collateralId,
        // this.creditShield = res['ProcessVariables'].loanApprovedDetails.creditShield,
        // this.documentationCharges = res['ProcessVariables'].loanApprovedDetails.documentationCharges,
        // this.emiAmt = res['ProcessVariables'].loanApprovedDetails.emiAmt,
        // this.emiDueDt = res['ProcessVariables'].loanApprovedDetails.emiDueDt,
        // this.emiCovPremiumAmt = res['ProcessVariables'].loanApprovedDetails.emiCovPremiumAmt,
        // this.emiEndDt = res['ProcessVariables'].loanApprovedDetails.emiEndDt,
        // this.emiStartDt = res['ProcessVariables'].loanApprovedDetails.emiStartDt,
        // this.fieldVisitChargesApplicable = res['ProcessVariables'].loanApprovedDetails.fieldVisitChargesApplicable,
        // this.emiStartDt = res['ProcessVariables'].loanApprovedDetails.emiStartDt,
        // this.emiStartDt = res['ProcessVariables'].loanApprovedDetails.emiStartDt,
        // this.insPremium = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.interestRate = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.loanAmt = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.loanTenor = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.modeOfPayment = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.noOfAdvEmi = res['ProcessVariables'].loanApprovedDetails.emiSheduleQuery,
        // this.npdcCharges = res['ProcessVariables'].loanApprovedDetails.npdcCharges,
        // this.penalInterest = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.personalAccidentCover = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.repay = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.rollOverPdc = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.valueAddedServices = res['ProcessVariables'].loanApprovedDetails.allIncIRR,
        // this.prefLanQuery = res['ProcessVariables'].prefLanQuery,
        // this.preferredLan = res['ProcessVariables'].preferredLan,
        this.repaymentDetails = res['ProcessVariables'].repaymentDetails
        // this.chassisNo = res['ProcessVariables'].vehicleDetails.chassisNo,
        // this.collateralId = res['ProcessVariables'].vehicleDetails.collateralId,
        // this.engineNo = res['ProcessVariables'].vehicleDetails.engineNo,
        // this.manufacMonthYr = res['ProcessVariables'].vehicleDetails.manufacMonthYr,
        // this.vehMake = res['ProcessVariables'].vehicleDetails.vehMake,
        // this.vehRegNo = res['ProcessVariables'].vehicleDetails.vehRegNo
        this.onChangeLanguage(res["ProcessVariables"].preferredLan)


      } else {
        this.toasterService.showError(res['ProcessVariables'].error["mesage"], '')
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
      this.labelsData.getWelcomeDatatelugu().subscribe(
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
}
