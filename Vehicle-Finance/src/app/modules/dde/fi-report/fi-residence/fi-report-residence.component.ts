import { Component, OnInit } from '@angular/core';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FieldInvestigationService } from '@services/fi/field-investigation.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldInvestigation } from '@model/dde.model';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantService } from '@services/applicant.service';



@Component({
  selector: 'app-fi-report-residence',
  templateUrl: './fi-report-residence.component.html',
  styleUrls: ['./fi-report-residence.component.css']
})
export class FiReportResidenceComponent implements OnInit {

  labels: any = {};
  LOV: any = [];
  isDirty: boolean;
  leadId: number;
  userId: any;
  applicantId: number;
  fieldReportForm: FormGroup;
  fieldInvestigation: FieldInvestigation;
  fiDetails: any = [];
  fiResidenceDetails: any = {};
  leadData: {};
  applicantFullName: any;
  fiDate: Date = new Date();
  fiTime: any = String(new Date(new Date().getTime()).toLocaleTimeString()).slice(0, 5);
  pincodeResult: {
    state?: any[];
    country?: any[];
    city?: any[];
  };
  applicantPincode: {
    state?: any[],
    city?: any[];
  };
  state = [];
  city = [];
  toDayDate: Date = new Date();
  leadCreatedDateFromLead: Date;
  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fieldInvestigationService: FieldInvestigationService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService, // service for accessing the toaster
    private applicantService: ApplicantService,

  ) {
    this.leadId = Number(this.activatedRoute.snapshot.parent.params.leadId);
    // this.applicantId = Number(this.activatedRoute.parent)
    this.applicantId = Number(this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    console.log('in construc app id', this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    console.log('leadid', this.leadId);
    console.log('now  fi date', this.fiDate);

  }

  async ngOnInit() {

    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    console.log('user id ==>', this.userId);
    this.leadId = (await this.getLeadId()) as number;
    this.getLOV();
    this.getLabels();
    this.initForm();
    this.isDirty = true;
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        console.log('in get lead', value);
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.getLeadSectionData();
        }
        resolve(null);
      });
    });
  }

  getLabels() {
    this.labelService.getLabelsData().subscribe(async (value) => {
      this.labels = value;
    });
  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
      console.log('in get lov app id', this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
      this.getLeadSectionData();
      this.getFiReportDetails();
    });

    console.log(this.LOV);
    console.log('in on init', this.city);
  }
  getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    console.log('in get lead sec app id', this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSectionData Lead details', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;
    // console.log('in get lead section data', data);
    console.log('in get lead section data', data['applicantDetails']);

    const leadCreatedDate = data['leadDetails']['leadCreatedOn'];
    console.log('strind date', leadCreatedDate);
    this.leadCreatedDateFromLead = new Date(leadCreatedDate);
    // this.leadCreatedDateFromLead = String(leadCreatedDate).slice(0, 10);
    console.log('lead created Date', this.leadCreatedDateFromLead);

    // console.log('current app id', this.applicantId);

    // for (const value of data['applicantDetails']) {  // for loop to get the respective applicant details form applicant details array
    //   // console.log('in for loop app id', value['applicantId']);

    //   if (value['applicantId'] === this.applicantId) {

    //     const applicantDetailsFromLead = value;
    //     this.applicantFullName = applicantDetailsFromLead['fullName'];
    //   }
    // }
  }

  getPincode(pincode) {
    // const id = pincode.id;
    const pincodeValue = pincode.value;
    if (pincodeValue.length === 6) {
      const pincodeNumber = Number(pincodeValue);
      this.getPincodeResult(pincodeNumber);
      console.log('in get pincode', pincodeNumber);
    }
  }
  getPincodeResult(pincodeNumber: number) {
    this.city = []; // clearing the array which contains previous city list
    this.state = []; // clearing the array which contains previous state list
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      }).subscribe((value) => {
        console.log('res', value);
        const values = value['ProcessVariables'].GeoMasterView;
        const state = {
          key: values[0].stateId,
          value: values[0].stateName
        };
        this.state.push(state);
        values.map((element) => {
          const city = {
            key: element.cityId,
            value: element.cityName
          };
          this.city.push(city);
          // console.log('in geo', city);
        });
      });

  }
  getMonths() {
    const initiatedDate = new Date(this.fieldReportForm.value.cpvInitiatedDate)
      ? new Date(this.fieldReportForm.value.cpvInitiatedDate) : null;
    const submitDate = new Date(this.fieldReportForm.value.reportSubmitDate)
      ? new Date(this.fieldReportForm.value.reportSubmitDate) : null;
    if (initiatedDate && submitDate) {
      if (initiatedDate > submitDate) {
        this.toasterService.showWarning('Submit Date should be greater than Initiated Date', '');

      }

    }

  }

  initForm() {

    // fun that initilalizes the form group
    this.fieldReportForm = new FormGroup({

      externalAgencyName: new FormControl('', Validators.required),
      contactPointVerification: new FormControl('', Validators.required),
      referenceNo: new FormControl('', Validators.required),
      cpvInitiatedDate: new FormControl('', Validators.required),
      cpvInitiatedTime: new FormControl('', Validators.required),
      reportSubmitDate: new FormControl('', Validators.required),
      reportSubmitTime: new FormControl('', Validators.required),
      // applicantName: new FormControl('', Validators.required),
      applicantName: new FormControl({ value: '', disabled: true }),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl('', Validators.required),
      addressLine3: new FormControl('', Validators.required),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      personMetName: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      natureOfBusiness: new FormControl('', Validators.required),
      typeOfConcern: new FormControl('', Validators.required),
      residenceApproach: new FormControl('', Validators.required),
      residenceDetails: new FormControl('', Validators.required),
      rentAmt: new FormControl('', Validators.required),
      residenceName: new FormControl('', Validators.required),
      verifiedFrom: new FormControl('', Validators.required),
      yrsOfStayInCity: new FormControl('', Validators.required),
      yrsOfStayInResi: new FormControl('', Validators.required),
      areaInSqFeet: new FormControl('', Validators.required),
      locality: new FormControl('', Validators.required),
      visibleAssets: new FormControl('', Validators.required),
      locatingResidence: new FormControl('', Validators.required),
      otherAssetsOwned: new FormControl('', Validators.required),
      noOfFamilyMembers: new FormControl('', Validators.required),
      noOfEarningMembers: new FormControl('', Validators.required),
      vehicleDetails: new FormControl('', Validators.required),
      officeApproach: new FormControl('', Validators.required),
      officePremises: new FormControl('', Validators.required),
      officeLocation: new FormControl('', Validators.required),
      furnishings: new FormControl('', Validators.required),
      officeSize: new FormControl('', Validators.required),
      observations: new FormControl('', Validators.required),
      noOfWorkingEmployees: new FormControl('', Validators.required),
      noOfVisibleEmployees: new FormControl('', Validators.required),
      activityLevel: new FormControl('', Validators.required),
      fiComments: new FormControl('', Validators.required),
      distanceInKms: new FormControl('', Validators.required),
      cpvAgencyStatus: new FormControl('', Validators.required),
      verifiedBy: new FormControl('', Validators.required),
      fiDate: new FormControl({ value: '', disabled: true }),
      fiTime: new FormControl({ value: '', disabled: true })

    });

  }
  setFormValue() { // patching the form values and setting the form values

    const fiModel = this.fiDetails || {}; // setting the response from ger fi details into fi model
    // console.log('in set form', fiModel);
    this.fieldReportForm.patchValue({
      externalAgencyName: fiModel.externalAgencyName ? fiModel.externalAgencyName : null,
      contactPointVerification: fiModel.contactPointVerification ? fiModel.contactPointVerification : null,
      referenceNo: fiModel.referenceNo ? fiModel.referenceNo : null,
      cpvInitiatedDate: fiModel.cpvInitiatedDate ?
        new Date(this.getDateFormat(fiModel.cpvInitiatedDate)) : null,
      cpvInitiatedTime: fiModel.cpvInitiatedTime ? fiModel.cpvInitiatedTime : null,
      reportSubmitDate: fiModel.reportSubmitDate ?
        new Date(this.getDateFormat(fiModel.reportSubmitDate)) : null,
      reportSubmitTime: fiModel.reportSubmitTime ? fiModel.reportSubmitTime : null,
      applicantName: this.applicantFullName ? this.applicantFullName : null,
      addressLine1: fiModel.addressLine1 ? fiModel.addressLine1 : null,
      addressLine2: fiModel.addressLine2 ? fiModel.addressLine2 : null,
      addressLine3: fiModel.addressLine3 ? fiModel.addressLine3 : null,
      pincode: fiModel.pincode ? fiModel.pincode : null,
      city: fiModel.city ? fiModel.city : null,
      state: fiModel.state ? fiModel.state : null,
      personMetName: fiModel.personMetName ? fiModel.personMetName : null,
      designation: fiModel.designation ? fiModel.designation : null,
      natureOfBusiness: fiModel.natureOfBusiness ? fiModel.natureOfBusiness : null,
      typeOfConcern: fiModel.typeOfConcern ? fiModel.typeOfConcern : null,
      residenceApproach: fiModel.residenceApproach ? fiModel.residenceApproach : null,
      residenceDetails: fiModel.residenceDetails ? fiModel.residenceDetails : null,
      rentAmt: fiModel.rentAmt ? fiModel.rentAmt : null,
      residenceName: fiModel.residenceName ? fiModel.residenceName : null,
      verifiedFrom: fiModel.verifiedFrom ? fiModel.verifiedFrom : null,
      yrsOfStayInCity: fiModel.yrsOfStayInCity ? fiModel.yrsOfStayInCity : null,
      yrsOfStayInResi: fiModel.yrsOfStayInResi ? fiModel.yrsOfStayInResi : null,
      areaInSqFeet: fiModel.areaInSqFeet ? fiModel.areaInSqFeet : null,
      locality: fiModel.locality ? fiModel.locality : null,
      visibleAssets: fiModel.visibleAssets ? fiModel.visibleAssets : null,
      locatingResidence: fiModel.locatingResidence ? fiModel.locatingResidence : null,
      otherAssetsOwned: fiModel.otherAssetsOwned ? fiModel.otherAssetsOwned : null,
      noOfFamilyMembers: fiModel.noOfFamilyMembers ? fiModel.noOfFamilyMembers : null,
      noOfEarningMembers: fiModel.noOfEarningMembers ? fiModel.noOfEarningMembers : null,
      vehicleDetails: fiModel.vehicleDetails ? fiModel.vehicleDetails : null,
      officeApproach: fiModel.officeApproach ? fiModel.officeApproach : null,
      officePremises: fiModel.officePremises ? fiModel.officePremises : null,
      officeLocation: fiModel.officeLocation ? fiModel.officeLocation : null,
      furnishings: fiModel.furnishings ? fiModel.furnishings : null,
      officeSize: fiModel.officeSize ? fiModel.officeSize : null,
      observations: fiModel.observations ? fiModel.observations : null,
      noOfWorkingEmployees: fiModel.noOfWorkingEmployees ? fiModel.noOfWorkingEmployees : null,
      noOfVisibleEmployees: fiModel.noOfVisibleEmployees ? fiModel.noOfVisibleEmployees : null,
      activityLevel: fiModel.activityLevel ? fiModel.activityLevel : null,
      fiComments: fiModel.fiComments ? fiModel.fiComments : null,
      distanceInKms: fiModel.distanceInKms ? fiModel.distanceInKms : null,
      cpvAgencyStatus: fiModel.cpvAgencyStatus ? fiModel.cpvAgencyStatus : null,
      verifiedBy: fiModel.verifiedBy ? fiModel.verifiedBy : null,
      // fiDate: fiModel.fiDate ?
      //   new Date(this.getDateFormat(fiModel.fiDate)) : null,
      fiDate: this.fiDate ? this.fiDate : null,
      fiTime: this.fiTime ? this.fiTime : null,
      // fiTime: fiModel.fiTime ? fiModel.fiTime : null,

    });
  }


  getDateFormat(date) { // fun for converting the response date to the valid form date 

    // console.log('in getDateFormat', date);
    const datePart = date.match(/\d+/g);
    const month = datePart[1];
    const day = datePart[0];
    const year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
    // console.log('formated data', dateFormat);
    return dateFormat;
  }

  sendDate(date) { // fun for converting the form date format to respective response date format
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + '/' + month1 + '/' + year;
    return formattedDate;

  }


  getFiReportDetails() { // fun to call get fi report details api field investigation service
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1177,  // hardcoded as per backend
      userId: this.userId
    };
    console.log('in get fi report', this.applicantId);
    this.fieldInvestigationService.getFiReportDetails(data).subscribe(async (res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('get fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.applicantFullName = res.ProcessVariables.applicantName;
        console.log('in get fi applicant name', this.applicantFullName);
        this.fiDetails = res.ProcessVariables.getFIResidenceDetails;
        console.log('in get fi details', this.fiDetails);
        this.setFormValue();
        if (this.fiDetails) {
          if (this.fiDetails.pincode != null) {
            this.getPincodeResult(this.fiDetails.pincode);
          } else {
            this.toasterService.showError('', 'message');

          }
        }
      }
    });
  }


  onFormSubmit() { // fun that submits all the pd data
    const formModal = this.fieldReportForm.value;
    const fieldReportModal = { ...formModal };
    // console.log('Form Data', fieldReportForm);
    this.isDirty = true;
    // if (this.fieldReportForm.invalid) {
    //   // this.toasterService.showError('', '');
    //   return;
    // }
    this.fiResidenceDetails = {

      // applicantId: 1177, // hardcoded as per backend
      applicantId: this.applicantId,
      externalAgencyName: fieldReportModal.externalAgencyName,
      contactPointVerification: fieldReportModal.contactPointVerification,
      referenceNo: fieldReportModal.referenceNo,
      cpvInitiatedDate: this.sendDate(fieldReportModal.cpvInitiatedDate),
      cpvInitiatedTime: fieldReportModal.cpvInitiatedTime,
      reportSubmitDate: this.sendDate(fieldReportModal.reportSubmitDate),
      reportSubmitTime: fieldReportModal.reportSubmitTime,
      applicantName: this.applicantFullName,
      addressLine1: fieldReportModal.addressLine1,
      addressLine2: fieldReportModal.addressLine2,
      addressLine3: fieldReportModal.addressLine3,
      pincode: Number(fieldReportModal.pincode),
      city: Number(fieldReportModal.city),
      state: Number(fieldReportModal.state),
      personMetName: fieldReportModal.personMetName,
      designation: fieldReportModal.designation,
      natureOfBusiness: fieldReportModal.natureOfBusiness,
      typeOfConcern: fieldReportModal.typeOfConcern,
      residenceApproach: fieldReportModal.residenceApproach,
      residenceDetails: fieldReportModal.residenceDetails,
      rentAmt: Number(fieldReportModal.rentAmt),
      residenceName: fieldReportModal.residenceName,
      verifiedFrom: fieldReportModal.verifiedFrom,
      yrsOfStayInCity: Number(fieldReportModal.yrsOfStayInCity),
      yrsOfStayInResi: Number(fieldReportModal.yrsOfStayInResi),
      areaInSqFeet: Number(fieldReportModal.areaInSqFeet),
      locality: fieldReportModal.locality,
      visibleAssets: fieldReportModal.visibleAssets,
      locatingResidence: fieldReportModal.locatingResidence,
      otherAssetsOwned: fieldReportModal.otherAssetsOwned,
      noOfFamilyMembers: Number(fieldReportModal.noOfFamilyMembers),
      noOfEarningMembers: Number(fieldReportModal.noOfEarningMembers),
      vehicleDetails: fieldReportModal.vehicleDetails,
      officeApproach: fieldReportModal.officeApproach,
      officePremises: fieldReportModal.officePremises,
      officeLocation: fieldReportModal.officeLocation,
      furnishings: fieldReportModal.furnishings,
      officeSize: fieldReportModal.officeSize,
      observations: fieldReportModal.observations,
      noOfWorkingEmployees: Number(fieldReportModal.noOfWorkingEmployees),
      noOfVisibleEmployees: Number(fieldReportModal.noOfVisibleEmployees),
      activityLevel: fieldReportModal.activityLevel,
      fiComments: fieldReportModal.fiComments,
      distanceInKms: Number(fieldReportModal.distanceInKms),
      cpvAgencyStatus: fieldReportModal.cpvAgencyStatus,
      verifiedBy: fieldReportModal.verifiedBy,
      fiDate: this.sendDate(this.fiDate),
      fiTime: this.fiTime,
    };
    const data = {
      userId: this.userId,
      fiResidenceDetails: this.fiResidenceDetails
    };
    console.log('fi report details', this.fiResidenceDetails);

    this.fieldInvestigationService.saveOrUpdateFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('save or update fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');

      } else {
        this.toasterService.showError('', 'message');

      }
    });

  }


  onNavigate(action) {
    // console.log('in on navigate', action);

    if (action === 'back') {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
    } else if (action === 'next') {
      // this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      this.router.navigateByUrl(`pages/fi-list/${this.leadId}/${this.applicantId}/fi-report/fi-business`);

    }
  }

}
