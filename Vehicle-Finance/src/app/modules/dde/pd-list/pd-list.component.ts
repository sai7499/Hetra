import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';

import { LabelsService } from '@services/labels.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { async } from '@angular/core/testing';
import { CommomLovService } from '@services/commom-lov-service';
import { LovDataService } from '@services/lov-data.service';
@Component({
  selector: 'app-pd-list',
  templateUrl: './pd-list.component.html',
  styleUrls: ['./pd-list.component.css']
})
export class PdListComponent implements OnInit {

  public labels: any = {};
  public errorMsg;
  public getLabels;
  pdList: [];
  leadId: number;
  userId: any;
  roles: any;
  roleName: string;
  roleId: any;
  roleType: any;
  pdStatus: { [id: string]: any; } = {};
  show: boolean;
  showStatus: boolean;
  pdStatusValue: any;
  isFiCumPD: boolean;
  fiCumPdStatusString: string;
  fiCumPdStatus: boolean;
  productCatCode: string;

  applicantDetailsFromLead: any;

  pdPersonalFirstName: string;
  pdPersonalMiddleName: string;
  pdPersonalLastName: string;
  pdPersonalFullName: string;

  pdPersonalNoofmonths: string;
  pdPersonalNoofyears: string;
  pdIncomeDetails: any;
  marketAndFinacier = [];

  applicantId: number;
  reqLoanAmount: any;
  applicantType: any;

  husFathFirstName: string;
  husFathSecondName: string;
  husFathThirdName: string;

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
  isccOdLimit: boolean;
  selectedApplicantId: any;
  LOV: any;
  pdApplicantLov: any;
  customerProfileLov: any;
  loanDetailsLov: any;

  pdGender: string;
  pdMaritalStatus: string;
  pdReligion: string;
  pdEducationalQualification: string;
  pdVehicleApplication: string;
  pdOccupation: string;
  pdBusinessType: string;
  pdCommunity: string;
  pdCustomerProfile: string;
  pdPriorExperience: string;
  pdResidentStatus: string;
  pdAccomodationType: string;
  pdResidentialLocality: string;
  pdNatureOfBussiness: string;
  PdHouseOwnership: string;
  pdBankAccountType: string;
  pdrelationship: string;
  pdReferrerAssetName: string;
  pdReferenceRelationship: string;
  pdPdStatus: string;

  pdResidentialType: string;
  pdHouseStandard: string;
  pdHouseSize: string;
  pdStandardOfLiving: string;
  pdRatingbySO: string;
  pdOfficePremisesType: string;
  pdOfficeSize: string;
  pdCustomerHouseSelfie: string;
  pdCustomerProfileRatingSo: string;
  pdNewVehModel: string;
  pdNewVehicleType: string;
  pdUsedVehModel: string;
  pdUsedVehicleType: string;
  pdNameOfFinancer: string;
  pdNameOfChannel: string;
  pdKnowAbtVehicle: string;
  pdEarlierVehicleApp: string;
  pdApplicantEarlierVehicle: string;
  pdVehicleContract: string;

  pdVehicleMake: string;
  pdConditionOfVehicle: string;
  pdSelfDriven: string;
  pdPrevExpMatched: string;
  fileName: string;
  isFiCumPdModal: boolean;
  udfScreenId: any;

  constructor(private labelsData: LabelsService,
    private router: Router,
    public sharedService: SharedService,
    private loginStoreService: LoginStoreService,
    private personalDiscussionService: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private personalDiscussion: PersonalDiscussionService,
    private commomLovService: CommomLovService,
    private lovDataService: LovDataService

  ) { }

  async ngOnInit() {
    this.fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    if (this.fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false;
      this.fileName = 'PD';
    } else if (this.fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true
      this.fileName = 'FIcumPD';
    }

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    this.leadId = (await this.getLeadId()) as number;
    this.getLabels = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.labels = data;
        this.getLOV();
        this.getPdLOV();
      },
        error => {
          this.errorMsg = error;
        });

    if (this.router.url.includes('/fi-cum-pd-dashboard')) {   // showing/hiding the nav bar based on url
      this.show = true;
    } else if (this.router.url.includes('/dde')) {
      this.showStatus = true;
    } else {
      this.show = false;
    }
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.router.url.includes('/dde') ? udfScreenId.DDE.fiCumPdListDDE : udfScreenId.FICUMPD.fiCumPdList ;

    })
  }

  getPdLOV() {
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.pdApplicantLov = value ? value[0].applicantDetails[0] : {};
      console.log('pd value', value);
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
      console.log('ficumpd value', value);
      this.loanDetailsLov = value ? value[0].loanDetail[0] : {};
      console.log('ficumpd loanDetailsLov', value);
    });
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.pdStandardOfLiving = this.LOV.LOVS['fi/PdHouseStandard'].filter(data => data.value !== 'Very Good');
    console.log('PDlov', this.LOV);
    this.getPdList();
    this.getLeadSectiondata();
  }

  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      this.isFiCumPD = processvariables.isFiCumPD;
      this.pdList = processvariables.finalPDList;

      for (var i in this.pdList) {

        console.log('pd status value', this.pdList[i]['pdStatusValue']);
        this.pdStatusValue = this.pdList[i]['pdStatusValue']
        if (this.pdList[i]['pdStatusValue'] == "Submitted") {
          this.pdStatus[this.pdList[i]['applicantId']] = this.pdList[i]['pdStatusValue']
          this.sharedService.getPdStatus(this.pdStatus)
        }

      }
    });
  }
  onNavigateToPdSummary() { // func to route to the pd dashboard

    // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

    this.router.navigate([`/pages/dashboard`]);

  }

  navigatePage(applicantId: string, cibilScore?: any, version?: any) {

    console.log('in navigate page', cibilScore);

    if (this.isFiCumPD === true) { // for routing to fi cum pd screens

      if (this.router.url.includes('fi-cum-pd-dashboard')) {
        // this.show = true;
        if (version) {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details/${version}`]);
        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details`]);
        }

      } else if (this.router.url.includes('/dde')) {
        // this.showStatus = true;
        if (version) {
          this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details/${version}`]);
        } else if (version === undefined || version === null) {

          this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${applicantId}/applicant-details`]);
        }

      }
    } else if (this.isFiCumPD === false) { // for routing to pd screens only

      if (this.router.url.includes('/fi-cum-pd-dashboard')) {

        // this.show = true;
        if (version !== null && version !== undefined) {
          // this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`, { score: cibilScore }]);
          // right now version not available so

        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details`, { score: cibilScore }]);
        }

      } else if (this.router.url.includes('/dde')) {
        // this.showStatus = true;
        if (version) {
          // this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
          // right now version not available so
        } else if (version === undefined || version === null) {
          this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${applicantId}/personal-details`]);
        }

      }

    }
  }
  navigateNewPdPage(applicantId: string, version: any) {
    if (version !== null && version !== undefined) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details/${version}`]);
    } else if (version === undefined || version === null) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${applicantId}/personal-details`]);
    }
  }
  getLeadId() {  // function to get the respective  lead id from the url
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  //GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);

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
      this.getFiCumPdAndPdData();
    });
    this.reqLoanAmount = leadDetailsFromLead.reqLoanAmt;
    this.productCatCode = leadDetailsFromLead.productCatCode;
    // this.applicantType = leadDetailsFromLead.applicantTypeKey;
    this.applicantType = 'APPAPPRELLEAD';


    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
  }

  onNavigateBack() {
    if (this.fiCumPdStatus == false) {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);

    } else if (this.productCatCode == 'UC' && this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);

    } else if (this.productCatCode != 'UC' && this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/tvr-details']);
    }

  }
  onNavigateNext() {

    this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);

  }

  getFiCumPdAndPdData() {
    const data = {
      // applicantId: this.applicantId,
      // pdVersion: this.version,
      applicantId: this.selectedApplicantId,
      pdVersion: 'undefined'
    };

    this.personalDiscussion.getPdData(data).subscribe(async (value: any) => {
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

        if (this.applicantPdDetails.fatherFullName || this.applicantPdDetails.husbandFullName) {
          const fullName = this.applicantPdDetails.fatherFullName ? this.applicantPdDetails.fatherFullName : this.applicantPdDetails.husbandFullName;
          const nameOfSplit = fullName.split(' ');
          this.husFathFirstName = nameOfSplit[0];
          this.husFathSecondName = nameOfSplit[1] ? nameOfSplit[1] : '';
          this.husFathThirdName = nameOfSplit[2] ? nameOfSplit[2] : '';
        }

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


        this.pdGender = this.LOV.LOVS.gender.find((value) => value.key == this.applicantPdDetails.gender);
        this.pdMaritalStatus = this.LOV.LOVS.maritalStatus.find((value) => value.key == this.applicantPdDetails.maritalStatus);
        this.pdReligion = this.LOV.LOVS.religion.find((value) => value.key == this.applicantPdDetails.religion);
        this.pdEducationalQualification = this.LOV.LOVS.educationalQualification.find((value) => value.key == this.applicantPdDetails.educationalBackgroundType);
        this.pdVehicleApplication = this.LOV.LOVS.vehicleApplication.find((value) => value.key == this.applicantPdDetails.vehicleApplication);
        this.pdOccupation = this.LOV.LOVS.occupation.find((value) => value.key == this.applicantPdDetails.occupationType);
        this.pdBusinessType = this.LOV.LOVS.businessType.find((value) => value.key == this.applicantPdDetails.businessType);
        this.pdCommunity = this.LOV.LOVS.community.find((value) => value.key == this.applicantPdDetails.community);
        this.pdResidentialLocality = this.LOV.LOVS['fi/PdResidentialLocality'].find((value) => value.key == this.applicantPdDetails.residentialLocality);
        this.PdHouseOwnership = this.LOV.LOVS['fi/PdHouseOwnership'].find((value) => value.key == this.applicantPdDetails.houseOwnership);
        this.pdBankAccountType = this.LOV.LOVS.bankAccountType.find((value) => value.key == this.pdIncomeDetails.typeOfAccount);
        this.pdrelationship = this.LOV.LOVS.relationship.find((value) => value.key == this.refCheckDetails.refererRelationship);
        this.pdReferenceRelationship = this.LOV.LOVS.relationship.find((value) => value.key == this.refCheckDetails.referenceRelationship);
        this.pdNatureOfBussiness = this.LOV.LOVS.natureOfBussiness.find((value) => value.key == this.refCheckDetails.natureOfBusiness);

        this.pdCustomerProfile = this.pdApplicantLov.customerProfilePersonal.find((value) => value.key == this.applicantPdDetails.customerProfile);
        this.pdPriorExperience = this.pdApplicantLov.priorExperience.find((value) => value.key == this.applicantPdDetails.customerProfile);
        this.pdResidentStatus = this.pdApplicantLov.residentStatus.find((value) => value.key == this.applicantPdDetails.residentStatus);
        this.pdAccomodationType = this.pdApplicantLov.accomodationType.find((value) => value.key == this.applicantPdDetails.accomodationType);
        this.pdReferrerAssetName = this.pdApplicantLov.referrerAssetName.find((value) => value.key == this.refCheckDetails.refererAssetName);
        this.pdPdStatus = this.pdApplicantLov.pdStatus.find((value) => value.key == this.refCheckDetails.pdStatus);


        this.pdResidentialType = this.LOV.LOVS['fi/PdResidentialType'].find((value) => value.key == this.applicantPdDetails.residentialType);
        this.pdHouseStandard = this.LOV.LOVS['fi/PdHouseStandard'].find((value) => value.key == this.applicantPdDetails.houseType);
        this.pdHouseSize = this.LOV.LOVS['fi/PdHouseSize'].find((value) => value.key == this.applicantPdDetails.sizeOfHouse);
        this.pdStandardOfLiving = this.LOV.LOVS['fi/PdHouseStandard'].find((value) => value.key == this.applicantPdDetails.standardOfLiving);
        this.pdRatingbySO = this.LOV.LOVS['fi/PdRating'].find((value) => value.key == this.applicantPdDetails.ratingbySO);

        this.pdOfficePremisesType = this.LOV.LOVS['fi/PdOfficePremisesType'].find((value) => value.key == this.custProfDetails.officePremises);
        this.pdOfficeSize = this.LOV.LOVS['fi/PdOfficeSize'].find((value) => value.key == this.custProfDetails.sizeofOffice);
        this.pdCustomerHouseSelfie = this.customerProfileLov.commonLov.find((value) => value.key == this.custProfDetails.customerHouseSelfie);
        this.pdCustomerProfileRatingSo = this.LOV.LOVS['fi/PdRating'].find((value) => value.key == this.custProfDetails.customerProfileRatingSo);

        this.pdNewVehModel = this.LOV.LOVS.vehicleManufacturer.find((value) => value.key == this.newCvDetails.model);
        this.pdNewVehicleType = this.LOV.LOVS.vehicleType.find((value) => value.key == this.newCvDetails.type);
        this.pdUsedVehModel = this.LOV.LOVS.vehicleManufacturer.find((value) => value.key == this.usedVehicleDetails.model);
        this.pdUsedVehicleType = this.LOV.LOVS.vehicleType.find((value) => value.key == this.usedVehicleDetails.type);
        this.pdNameOfFinancer = this.LOV.LOVS.vehicleFinanciers.find((value) => value.key == this.usedVehicleDetails.financierName);

        this.pdNameOfChannel = this.loanDetailsLov.nameOfChannel.find((value) => value.key == this.usedVehicleDetails.channelSourceName);
        this.pdKnowAbtVehicle = this.LOV.LOVS['howDoYouKnowAboutProposedVehicle'].find((value) => value.key == this.usedVehicleDetails.proposedVehicle);
        this.pdEarlierVehicleApp = this.LOV.LOVS['fi/PdEarlierVehicleApplication'].find((value) => value.key == this.usedVehicleDetails.earlierVehicleApplication);
        this.pdApplicantEarlierVehicle = this.LOV.LOVS['fi/PdApplicantEarlierVehicle'].find((value) => value.key == this.usedVehicleDetails.drivingVehicleEarlier);
        this.pdVehicleContract = this.LOV.LOVS['vehicleContract'].find((value) => value.key == this.usedVehicleDetails.vehicleContractKey);

        this.pdVehicleMake = this.LOV.LOVS['vehicleManufacturer'].find((value) => value.key == this.assetDetailsUsedVehicle.vehicleMake);
        this.pdConditionOfVehicle = this.loanDetailsLov.physicalCondition.find((value) => value.key == this.assetDetailsUsedVehicle.conditionOfVehicle);
        this.pdSelfDriven = this.LOV.LOVS['fi/PdSelfDrivenOrDriver'].find((value) => value.key == this.assetDetailsUsedVehicle.selfDrivenOrDriver);
        this.pdPrevExpMatched = this.loanDetailsLov.commonLov.find((value) => value.key == this.assetDetailsUsedVehicle.isPrevExpMatched);



        console.log('this.pdGender', this.pdGender)
        setTimeout(() => {
          this.downloadpdf();
        });
      }
    });
  }


  getPdf(event?) {
    this.selectedApplicantId = event;
    this.getFiCumPdAndPdData();
    this.isFiCumPdModal = true;
  }

  downloadpdf() {
    var options = {
      margin: [0.5, 0.3, 0.5, 0.3],
      filename: `${this.fileName}_${this.leadId}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 3, logging: true },
      pagebreak: { before: "#page-break" },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    }
    html2pdf().from(document.getElementById('pdf')).set(options).save();
    this.isFiCumPdModal = false;
  }

}
