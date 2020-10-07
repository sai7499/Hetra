import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import html2pdf from 'html2pdf.js';
import { WelcomeService } from '../welomce-letter/welcome.service';

@Component({
  selector: 'app-delivery-order',
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.css']
})
export class DeliveryOrderComponent implements OnInit {
  showDeliveryOrder:boolean = false;
  private leadId;
  private productCatCode;
  private applicantDetails;
  private toDayDate = new Date();
  private dealerDetails;
  private vehicleDetails;
  private loanAmount;
  private loanAmountText;
  constructor(private activatedRoute: ActivatedRoute,
              private createLeadDataService: CreateLeadDataService,
              private welcomeService: WelcomeService,
              private toasterService: ToasterService,
              private utilityService: UtilityService) { }

  ngOnInit() {
    this.getLeadId();
  }

  viweWelcomeLetter(){
    this.showDeliveryOrder = true;
    this.getDeliveryLetter();
  }
  getLeadId() {
    this.activatedRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log('LEADID::', this.leadId);
  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);
  }

  getDeliveryLetter(){
  const data = this.leadId;
  this.welcomeService.getDeliveryLetterDetails(data).subscribe((res: any) => {
    if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
      console.log("response of deliver letter",res);
      let getData = res['ProcessVariables'];
      this.applicantDetails = getData.applicantDetails;
      this.dealerDetails = getData.dealerDetails;
      this.vehicleDetails = getData.vehicleDetails;
      this.loanAmount =  Number(getData.loanAmount).toLocaleString('en-IN');
      this.loanAmountText = this.utilityService.numberToText(getData.loanAmount)
    }else {
      this.toasterService.showError(res['ProcessVariables'].error["message"], '')
    }
   });
  }
  downloadpdf() {
    var options = {
      margin: .50,
      filename: `DeliveryOrder_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      jsPDF: { unit: 'in', format: 'b4', orientation: 'p' }
    }
    html2pdf().from(document.getElementById("ContentToConvert")).set(options).save();
    // this.getWelcomeLetterDetails();
  }
}
