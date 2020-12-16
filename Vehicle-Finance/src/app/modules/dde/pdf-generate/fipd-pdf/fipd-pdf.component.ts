import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-fipd-pdf',
  templateUrl: './fipd-pdf.component.html',
  styleUrls: ['./fipd-pdf.component.css']
})
export class FipdPdfComponent implements OnInit {

  labels: any = {};
  errorMsg: string;
  reqLoanAmount: any;
  productCatCode: any;
  isFiCumPd: boolean;
  isPd: boolean;
  isFi: boolean;

  constructor(
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService
  ) {
    this.isFiCumPd = true;
    this.isPd = true;
    this.isFi = true;
  }

  ngOnInit() {
    this.getLabelData();
  }

  getLabelData() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        this.getLeadSectionData();
      },
      error => {
        this.errorMsg = error;
      });
  }

  getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    const data = { ...leadSectionData };
    const leadDetailsFromLead = data['leadDetails'];
    this.reqLoanAmount = leadDetailsFromLead.reqLoanAmt;
    this.productCatCode = leadDetailsFromLead.productCatCode;
  }



}
