import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { FicumpdPdfService } from '@services/ficumpd-pdf.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionComponent } from '@modules/dashboard/personal-discussion/personal-discussion.component';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ActivatedRoute } from '@angular/router';
import { FieldInvestigationService } from '@services/fi/field-investigation.service';

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
  applicantType: any;
  isFiCumPd: boolean;
  isPd: boolean;
  isFi: boolean;
  isccOdLimit: boolean;
  applicantId: number;
  version: string;

  applicantPdDetails: any;
  custProfDetails: any;
  loanDetails: any;
  newCvDetails: any;
  custCategory: any;
  usedVehicleDetails: any;
  assetDetailsUsedVehicle: any;
  referenceCheckDetails: any;
  refCheckDetails: any;
  genericDetails: any;
  customerProfileDetails: any;
  profilePhoto: any;
  SELFIE_IMAGE: any;

  userId: string;
  applicantDetailsFromLead: any;

  pdPersonalFirstName: string;
  pdPersonalMiddleName: string;
  pdPersonalLastName: string;
  pdPersonalFullName: string;

  pdPersonalNoofmonths: string;
  pdPersonalNoofyears: string;
  pdIncomeDetails: any;
  marketAndFinacier = [];

  fiApplicantFullName: string;
  fiResidenceDetails: any;
  fiBusinessDetails: any;
  custSegment: any;

  fiNoofmonthsCity: string;
  fiNofyearsCity: string;
  fiNoofmonthsResi: string;
  fiNoofyearsResi: string;

  showTypeOfConcern: boolean;

  constructor(
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService,
    private ficumpdPdfService: FicumpdPdfService,
    private loginStoreService: LoginStoreService,
    private personalDiscussion: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute,
    private fieldInvestigationService: FieldInvestigationService,
  ) {
    this.isFiCumPd = false;
    this.isPd = false;
    this.isFi = true;
  }

  ngOnInit() {
    this.getLabelData();
    this.showTypeOfConcern = true;
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

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      // if (this.version !== 'undefined') {
      //   this.showSubmit = false;
      // }
    });
  }

  getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    const data = { ...leadSectionData };
    const leadDetailsFromLead = data['leadDetails'];

    this.applicantDetailsFromLead = data['applicantDetails'];
    this.applicantDetailsFromLead.filter((val: any) => {
      const splitName = val.fullName.split(' ');
      let firstName, middleName, lastName = '';
      firstName = splitName[0] ? splitName[0] : '';
      this.pdPersonalFirstName = firstName;

      if (splitName && splitName.length >= 3) {
        middleName = splitName[1] ? splitName[1] : '';
        lastName = splitName[2] ? splitName[2] : '';
        this.pdPersonalMiddleName = middleName;
        this.pdPersonalLastName = lastName;

      } else if (splitName && splitName.length === 2) {
        middleName = '';
        lastName = splitName[1] ? splitName[1] : '';
        this.pdPersonalMiddleName = middleName;
        this.pdPersonalLastName = lastName;
      }

      if (val.applicantId === this.applicantId) {
        this.pdPersonalFullName = val.fullName ? val.fullName : '';
      }

    });
    this.reqLoanAmount = leadDetailsFromLead.reqLoanAmt;
    this.productCatCode = leadDetailsFromLead.productCatCode;
    // this.applicantType = leadDetailsFromLead.applicantTypeKey;
    this.applicantType = 'APPAPPRELLEAD';


    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.getFiCumPdAndPdData();
    this.getFiReportDetails();
  }

  getFiCumPdAndPdData() {
    const data = {
      // applicantId: this.applicantId,
      // pdVersion: this.version,
      applicantId: 1511,
      pdVersion: 'undefined'
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const response = value.ProcessVariables;
      if (response.error.code === '0') {
        this.applicantPdDetails = response.applicantPersonalDiscussionDetails;
        this.custProfDetails = response.customerProfileDetails;
        this.newCvDetails = response.loanDetailsForNewCv;
        this.custCategory = response.applicantPersonalDiscussionDetails.custCategory;
        this.usedVehicleDetails = response.applicableForUsedVehicle;
        this.assetDetailsUsedVehicle = response.applicableForAssetDetailsUsedVehicle;

        this.refCheckDetails = response.referenceCheck;
        this.genericDetails = response.otherDetails;
        this.customerProfileDetails = response.customerProfileDetails;
        this.SELFIE_IMAGE = response.profilePhoto;

        if (this.applicantPdDetails.noOfYearsResidingInCurrResidence) {
          this.pdPersonalNoofmonths = String(Number(this.applicantPdDetails.noOfYearsResidingInCurrResidence) % 12) || '';
          this.pdPersonalNoofyears = String(Math.floor(Number(this.applicantPdDetails.noOfYearsResidingInCurrResidence) / 12)) || '';
        }

        this.pdIncomeDetails = response.incomeDetails;
        if (this.pdIncomeDetails.typeOfAccount === "4BNKACCTYP") {
          this.isccOdLimit = true;
        } else {
          this.isccOdLimit = false;
        }

        this.marketAndFinacier = response.marketFinRefData;
      }
    });
  }

  getFiReportDetails() {
    const data = {
      // applicantId: this.applicantId,
      // userId: this.userId,
      // fiVersion: this.version
      applicantId: 4022,
      userId: this.userId,
      fiVersion: 'undefined'
    };
    console.log('in get fi report', this.applicantId);
    this.fieldInvestigationService.getFiReportDetails(data).subscribe(async (res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('get fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.fiApplicantFullName = res.ProcessVariables.applicantName;
        console.log('in get fi applicant name', this.fiApplicantFullName);
        this.fiResidenceDetails = res.ProcessVariables.getFIResidenceDetails;
        console.log('in get fi details', this.fiResidenceDetails);

        if (this.fiResidenceDetails) {
          this.fiNoofmonthsCity = String(Number(this.fiResidenceDetails.yrsOfStayInCity) % 12) || '';
          this.fiNofyearsCity = String(Math.floor(Number(this.fiResidenceDetails.yrsOfStayInCity) / 12)) || '';
        }
        if (this.fiResidenceDetails) {
          this.fiNoofmonthsResi = String(Number(this.fiResidenceDetails.yrsOfStayInResi) % 12) || '';
          this.fiNoofyearsResi = String(Math.floor(Number(this.fiResidenceDetails.yrsOfStayInResi) / 12)) || '';
        }

        this.fiBusinessDetails = res.ProcessVariables.getFIBusinessDetails;
        this.custSegment = this.fiBusinessDetails.custSegment;
        this.getConcernType();
      }
    });
  }

  getConcernType() {
    if (this.custSegment == "SALCUSTSEG" && this.custSegment != null) {
      this.showTypeOfConcern = true;
    } else if (this.custSegment == "SEMCUSTSEG" && this.custSegment != null) {
      this.showTypeOfConcern = true;
    } else {
      this.showTypeOfConcern = false;
    }
  }

  patchValue() {
    this.applicantPdDetails = this.ficumpdPdfService.getApplicantPdDetails();
    console.log('this.applicantPdDetails', this.applicantPdDetails);

    this.custProfDetails = this.ficumpdPdfService.getcustomerProfileDetails();
    console.log('this.custProfDetails', this.custProfDetails);

    this.loanDetails = this.ficumpdPdfService.getLoanDetails();
    console.log('this.loanDetails', this.loanDetails);
    this.newCvDetails = this.loanDetails.loanDetailsForNewCv;
    this.custCategory = this.loanDetails.applicantPersonalDiscussionDetails.custCategory;
    this.usedVehicleDetails = this.loanDetails.applicableForUsedVehicle;
    this.assetDetailsUsedVehicle = this.loanDetails.applicableForAssetDetailsUsedVehicle;

    this.referenceCheckDetails = this.ficumpdPdfService.getReferenceCheckDetails();
    console.log('this.referenceCheckDetails', this.referenceCheckDetails);
    this.refCheckDetails = this.referenceCheckDetails.referenceCheck;
    this.genericDetails = this.referenceCheckDetails.otherDetails;
    this.customerProfileDetails = this.referenceCheckDetails.customerProfileDetails;
    this.SELFIE_IMAGE = this.referenceCheckDetails.profilePhoto;
  }

}
