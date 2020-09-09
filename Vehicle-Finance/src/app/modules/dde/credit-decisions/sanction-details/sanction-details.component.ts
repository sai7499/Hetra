import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SanctionDetailsService } from '@services/sanction-details.service';
import { UtilityService } from '@services/utility.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
declare var $;
@Component({
  selector: 'app-sanction-details',
  templateUrl: './sanction-details.component.html',
  styleUrls: ['./sanction-details.component.css']
})
export class SanctionDetailsComponent implements OnInit {

leadId;
labels: any = {};
sanctionDetailsObject: any = {};
applicantList: any = [];
coApplicantList: any = [];
guarantorList: any = [];
vehicleDetailsArray: any = [];
loanApprovedDetails: any = {};
generalTermsAndConditions: string;
date: Date = new Date();
todayDate;
roleId: any;
roleType: any;
isSanctionDetails: boolean;
salesResponse: any;

  constructor(
        private labelsData: LabelsService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private sanctionDetailsService: SanctionDetailsService,
        private utilityService: UtilityService,
        private loginStoreService: LoginStoreService,
        private toasterService: ToasterService,
       ) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    // this.getSanctionDetails();
    this.salesResponse = localStorage.getItem('salesResponse');
    this.todayDate = this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY');
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    if (this.roleType == 1){
      this.getSanctionDetails();
    }
    this.getSanctionDetails();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      // (error) => console.log("Sanction-Details Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log('LEADID::', this.leadId);
  }
  // FUNCTION FOR GET API of SANCTION-DETAILS
  getSanctionDetails() {
    const data = this.leadId;
    this.sanctionDetailsService.getSanctionDetails(data).subscribe((res: any) => {
      if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
        this.isSanctionDetails = res['ProcessVariables'].isGenerated;
        const response = res;
        this.sanctionDetailsObject = response.ProcessVariables;
        
        // Filter Out Applicant, Co-Applicant And Guarantor List If ApplicantList_Object Exist
        if (this.sanctionDetailsObject.applicantList) {
          const getApplicantList: Array<any> = this.sanctionDetailsObject.applicantList
          this.applicantList = [];
          this.coApplicantList = [];
          this.guarantorList = [];
          // this.sanctionDetailsObject.applicantList.filter((element) => {
            getApplicantList.forEach((element) => {
            if (element.applicantType === 'Applicant') {
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.applicantList.push(data);
            } else if (element.applicantType === 'Co-Applicant') {
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.coApplicantList.push(data);
            } else if (element.applicantType === 'Guarantor') {
              const data = {
                applicantType: element.applicantType,
                name: element.name,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                addressLine3: element.addressLine3,
                district: element.district,
                country: element.country,
                pincode: element.pincode,
                mobileNo: element.mobileNo,
              };
              this.guarantorList.push(data);
            }
          });
        }
        this.vehicleDetailsArray = this.sanctionDetailsObject.vehicleDetails;
        this.loanApprovedDetails = this.sanctionDetailsObject.loanApprovedDetails;
        this.generalTermsAndConditions = this.sanctionDetailsObject.generalTermsAndConditions;
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  //TO SHOW CONTENT OF SANCTION-DETAILS
  generateSanctionLetter() {
    this.getSanctionDetails();
  }

  //TO SEND BACK SANCTION_DETAILS TO SALES
  onSubmitToSales() {
    const data = { 
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      onSubmit: true,
    };
    this.sanctionDetailsService.submitToSanctionLeads(data).subscribe((res: any) => {
      const response = res;
      // console.log("RESPONSE_SUBMIT_TO_SALES::", response);
      if (response["Error"] == 0) {
        this.toasterService.showSuccess("Sanctioned Leads Submitted Successfully", "Sanction Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'Sanction Details');
      }
    });
  }

  onNext() {
    
    if ( this.roleType == '1' ) { 
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/customer-feedback`]);
    } else if (this.roleType == '2') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/pdc-details`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/pdc-details`]);
      }
  }

  onBack() {
    if(this.roleType == '1') {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/disbursement`]);
    } else if (this.roleType == '2' ) {
      this.router.navigate([`/pages/credit-decisions/${this.leadId}/term-sheet`]);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/disbursement`]);
      }
  }
//   downloadpdf(){
//     const htmlWidth = $("#contentToConvert").width();
//     const htmlHeight = $("#contentToConvert").height();
    
//     const pdfWidth = htmlWidth;
//     const pdfHeight = 1500;
//       // tslint:disable-next-line: variable-name
//     const canvasImageWidth = htmlWidth;
//       // tslint:disable-next-line: variable-name
//     const canvas_image_height = htmlHeight;

//     const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;

//     html2canvas($("#contentToConvert")[0], {
//       allowTaint: false,
//       useCORS: true
//     }).then(canvas => {
//       canvas.getContext("2d");

//       const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
//       const pdf = new jspdf.jsPDF("p", "pt", [pdfWidth, pdfHeight]);
//       pdf.addImage(imgData,"JPEG",10,10,canvasImageWidth,canvas_image_height)
//       // pdf.addImage(
//       //   imgData,
//       //   "png",
//       //   topLeftMargin,
//       //   topLeftMargin,
//       //   canvasImageWidth,
//       //   canvas_image_height,
//       //   bottomMargin
//       // );
      
// for (let i = 1; i <= totalPDFPages; i++) {
//         pdf.addPage("a4");
//         pdf.addImage(
//           imgData,
//           "png",
//           canvasImageWidth,
//           -(pdfHeight * i) +canvas_image_height  * 4,
//           canvasImageWidth,
//           canvas_image_height
//         );
//       }

//       pdf.save( "termsheet.pdf");
//     });

//   }
downloadpdf()
        { 
          var options = {
            margin:.25,
            filename: "file.pdf",
            image: { type: 'jpeg', quality: 1 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
        }
        html2pdf().from(document.getElementById("vf_sheet_print_starts")).set(options).save();
    
            // var pdf = new jsPDF('p', 'pt', 'a4')

            // // source can be HTML-formatted string, or a reference
            // // to an actual DOM element from which the text will be scraped.
            // , source = $('#contentToConvert')[0]

            // // we support special element handlers. Register them with jQuery-style
            // // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
            // // There is no support for any other type of selectors
            // // (class, of compound) at this time.
            // , specialElementHandlers = {
            //      // element with id of "bypass" - jQuery style selector
            //     '#bypassme': function(element, renderer)
            //     {
            //         // true = "handled elsewhere, bypass text extraction"
            //         return true
            //     }
            // }

            // const margins = {
            //     top: 40,
            //     bottom: 40,
            //     left: 30,
            //     right: 30,
            //     width: 522
            // };
            // // all coords and widths are in jsPDF instance's declared units
            // // 'inches' in this case
            // pdf.fromHTML
            // (
            //     source // HTML string or DOM elem ref.
            //   , margins.left // x coord
            //   , margins.top // y coord
            //   , {'width': margins.width // max width of content on PDF
            //      , 'elementHandlers': specialElementHandlers
            //     }
            //   , function (dispose) 

            //     {
            //        // dispose: object with X, Y of the last line add to the PDF
            //        // this allow the insertion of new lines after html
            //        pdf.save('Mypdf.pdf');
            //     }
            //   , margins
            // )
                 }

}
