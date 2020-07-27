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

@Component({
  selector: 'app-fi-report',
  templateUrl: './fi-report.component.html',
  styleUrls: ['./fi-report.component.css']
})
export class FiReportComponent implements OnInit {

  labels: any = {};
  LOV: any = [];
  isDirty: boolean;
  leadId: number;
  userId: any;
  applicantId: number;
  fieldReportForm: FormGroup;
  fieldInvestigation: FieldInvestigation;
  fiDetails: any = [];
  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fieldInvestigationService: FieldInvestigationService,
    private loginStoreService: LoginStoreService,
    private toasterService: ToasterService, // service for accessing the toaster

  ) {
    this.getLOV();
    this.isDirty = true;
    this.leadId = Number(this.activatedRoute.snapshot.params.leadId);
    this.applicantId = Number(this.activatedRoute.snapshot.params.applicantId);
    console.log(this.leadId);
    console.log(this.applicantId);
  }

  async ngOnInit() {

    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    console.log('user id ==>', this.userId);
    // this.leadId = (await this.getLeadId()) as number;
    this.getFiReportDetails();
  }

  getLeadId() {  // function to get the respective  lead id from the url
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          console.log('in get lead ', value);
        }
        resolve(null);
      });
    });
  }


  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
    });

    console.log(this.LOV);
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
      applicantName: new FormControl('', Validators.required),
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
      fiDate: new FormControl('', Validators.required),
      fiTime: new FormControl('', Validators.required)

    });

  }
  setFormValue() { // patching the form values

    const fiModel = this.fiDetails || {};
    console.log('in set form', fiModel);
    this.fieldReportForm.patchValue({
      externalAgencyName: fiModel.externalAgencyName || '',
      contactPointVerification: fiModel.contactPointVerification || '',
      referenceNo: fiModel.referenceNo || '',
      cpvInitiatedDate: fiModel.cpvInitiatedDate ?
        new Date(this.getDateFormat(fiModel.cpvInitiatedDate)) : '',
      cpvInitiatedTime: fiModel.cpvInitiatedTime || '',
      reportSubmitDate: fiModel.reportSubmitDate ?
        new Date(this.getDateFormat(fiModel.reportSubmitDate)) : '',
      reportSubmitTime: fiModel.reportSubmitTime || '',
      applicantName: fiModel.applicantName || '',
      addressLine1: fiModel.addressLine1 || '',
      addressLine2: fiModel.addressLine2 || '',
      addressLine3: fiModel.addressLine3 || '',
      pincode: fiModel.pincode || '',
      city: fiModel.city || '',
      state: fiModel.state || '',
      personMetName: fiModel.personMetName || '',
      designation: fiModel.designation || '',
      natureOfBusiness: fiModel.natureOfBusiness || '',
      typeOfConcern: fiModel.typeOfConcern || '',
      residenceApproach: fiModel.residenceApproach || '',
      residenceDetails: fiModel.residenceDetails || '',
      rentAmt: fiModel.rentAmt || '',
      residenceName: fiModel.residenceName || '',
      verifiedFrom: fiModel.verifiedFrom || '',
      yrsOfStayInCity: fiModel.yrsOfStayInCity || '',
      yrsOfStayInResi: fiModel.yrsOfStayInResi || '',
      areaInSqFeet: fiModel.areaInSqFeet || '',
      locality: fiModel.locality || '',
      visibleAssets: fiModel.visibleAssets || '',
      locatingResidence: fiModel.locatingResidence || '',
      otherAssetsOwned: fiModel.otherAssetsOwned || '',
      noOfFamilyMembers: fiModel.noOfFamilyMembers || '',
      noOfEarningMembers: fiModel.noOfEarningMembers || '',
      vehicleDetails: fiModel.vehicleDetails || '',
      officeApproach: fiModel.officeApproach || '',
      officePremises: fiModel.officePremises || '',
      officeLocation: fiModel.officeLocation || '',
      furnishings: fiModel.furnishings || '',
      officeSize: fiModel.officeSize || '',
      observations: fiModel.observations || '',
      noOfWorkingEmployees: fiModel.noOfWorkingEmployees || '',
      noOfVisibleEmployees: fiModel.noOfVisibleEmployees || '',
      activityLevel: fiModel.activityLevel || '',
      fiComments: fiModel.fiComments || '',
      distanceInKms: fiModel.distanceInKms || '',
      cpvAgencyStatus: fiModel.cpvAgencyStatus || '',
      verifiedBy: fiModel.verifiedBy || '',
      ratingbySO: fiModel.ratingbySO || '',
      fiDate: fiModel.fiDate ?
        new Date(this.getDateFormat(fiModel.fiDate)) : '',
      fiTime: fiModel.fiTime || '',

    });
  }


  getDateFormat(date) {

    // console.log('in getDateFormat', date);
    const datePart = date.match(/\d+/g);
    const month = datePart[1];
    const day = datePart[0];
    const year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
    // console.log('formated data', dateFormat);
    return dateFormat;
  }

  sendDate(date) {
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + '/' + month1 + '/' + year;
    return formattedDate;

  }


  getFiReportDetails() {
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1177,  // hardcoded as per backend
      userId: this.userId
    };
    console.log('in get fi report', this.applicantId);
    this.fieldInvestigationService.getFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('get fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.fiDetails = res.ProcessVariables.getFiReportDetails;
        console.log('in get fi details', this.fiDetails);
        if (this.fiDetails) {
          this.setFormValue();
        }

      } else {
        this.toasterService.showError('', 'message');

      }
    });

  }

  saveOrUpdateFiReportDetails() {

    const data = {
      applicantId: this.applicantId,
      // applicantId: 1177, // hardcoded as per backend
      userId: this.userId
    };
    this.fieldInvestigationService.saveOrUpdateFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('get fi report response', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {

      } else {
        this.toasterService.showError('', 'message');

      }
    });

  }

  onBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);

  }

  onSave() {

  }

  onNext() {
    this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

  }
}
