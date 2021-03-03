import { Component, OnInit } from '@angular/core';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldInvestigationService } from '@services/fi/field-investigation.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldInvestigation } from '@model/dde.model';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantService } from '@services/applicant.service';
import { UtilityService } from '@services/utility.service';
import { LoanViewService } from '@services/loan-view.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
@Component({
  selector: 'app-fi-residence',
  templateUrl: './fi-residence.component.html',
  styleUrls: ['./fi-residence.component.css']
})
export class FiResidenceComponent implements OnInit {

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
  stringTime = String(new Date(new Date().getTime()).toLocaleTimeString()).split(':', 2);
  fiTime: any;
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
  leadCreatedDateFromLead: any;
  cpVerificaton: string;
  initiatedDate: any;
  version: any;
  isRentDisabled: boolean;
  resedenceType: string;
  rentRequired: boolean;
  invalidPincode = false;
  yearsOfStayInCity: any;
  yearsOfStayInResi: any;

  monthValidation: {
    rule?: any;
    msg?: string;
  }[];

  yearValidation: {
    rule?: any;
    msg?: string;
  }[];
  ownerShipType: any;
  ownerNamePropertyAreaRequired: boolean;
  ownerNamePropertyAreaDisabled: boolean;
  initDate: boolean;
  toDayDate: Date = new Date();
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId: any;
  udfGroupId: any;
  roleType: any;

  operationType: any;
  disableSaveBtn: boolean;

  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService,
    private fieldInvestigationService: FieldInvestigationService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService, // service for accessing the toaster
    private applicantService: ApplicantService,
    private utilityService: UtilityService) {
    this.leadId = Number(this.activatedRoute.snapshot.parent.params.leadId);
    this.applicantId = Number(this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    this.version = String(this.activatedRoute.snapshot.parent.firstChild.params.version);
    this.fiTime = this.stringTime[0] + ':' + this.stringTime[1];
  }

  async ngOnInit() {

    // this.toDayDate = this.utilityService.getDateFromString(this.utilityService.getDateFormat(this.toDayDate));
    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roleType = roleAndUserDetails.roles[0].roleType
    if (this.roleType === 1) { // For FI dashboard
      this.udfGroupId = 'FIG001'
      //this.udfScreenId = 'FIS001'
    } else if (this.roleType === 2) { // For DDE FI
      this.udfGroupId = 'FIG001'
      //this.udfScreenId = 'FIS003'
    }
    this.operationType = this.toggleDdeService.getOperationType();

    this.leadId = (await this.getLeadId()) as number;
    this.getLOV();
    this.getLabels();
    this.initForm();
    this.isDirty = true;
    this.labelService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 2 ? udfScreenId.DDE.residenceFIDDE : udfScreenId.FI.residenceFI ;

    })
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
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
      if (this.LOV) {
        this.cpVerificaton = this.LOV.LOVS['contactPointVerification'];
      }
      this.getLeadSectionData();
      this.getFiReportDetails();
    });
    this.monthValidation = this.monthValiationCheck();
    this.yearValidation = this.yearValiationCheck();
  }

  monthValiationCheck() {
    const monthData = [
      {
        rule: (month) => {
          return month < 0;
        },
        msg: 'Month should be greater than or equal to 0',
      },
      {
        rule: (month) => {
          return month > 11;
        },
        msg: 'Month should be less than or equal to 11',
      },
    ];
    return monthData;
  }

  yearValiationCheck() {
    const yearData = [
      {
        rule: (year) => {
          return year < 0;
        },
        msg: 'Year should be greater than 0',
      },
      {
        rule: (year) => {
          return year > 99;
        },
        msg: 'Month should be less than or equal to 99',
      },
    ];
    return yearData;
  }

  getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadData = { ...leadSectionData };
    const data = this.leadData;

    const leadCreatedDate = data['leadDetails']['leadCreatedOn'];
    let LeadDate = new Date(leadCreatedDate.split(' ')[0]);
    var day = LeadDate.getDate();
    var month =LeadDate.getMonth();
    var year = LeadDate.getFullYear();
    this.leadCreatedDateFromLead = new Date(year, month, day, 0, 0);
    // this.leadCreatedDateFromLead = new Date(leadCreatedDate.split(' ')[0]);
  }

  // fun for conditional entry for rent amount
  houseOwnerShipType(event: any) {
    this.resedenceType = event ? event : event;
    if (this.resedenceType === '2HOUOWN') {
      this.isRentDisabled = false;
      this.rentRequired = true;
      this.fieldReportForm.get('rentAmt').enable();
      this.fieldReportForm.get('rentAmt').setValidators(Validators.required);
      this.fieldReportForm.get('rentAmt').updateValueAndValidity();

    } else if (this.resedenceType !== '2HOUOWN') {
      this.fieldReportForm.get('rentAmt').disable();
      this.isRentDisabled = true;
      this.rentRequired = false;
      setTimeout(() => {
        this.fieldReportForm.get('rentAmt').patchValue(null);
      });
      this.fieldReportForm.get('rentAmt').clearValidators();
      this.fieldReportForm.get('rentAmt').updateValueAndValidity();
    }
  }

  // fun for conditional entry for area of property and value of property

  houseOwnerShip(event: any) {
    this.ownerShipType = event ? event : event;
    console.log(event);
    
    const rentAmt = this.fieldReportForm.get('rentAmt').value;
    const areaOfProperty = this.fieldReportForm.get('areaOfProperty').value;
    const propertyValue = this.fieldReportForm.get('propertyValue').value;
    if (this.ownerShipType === '1HOUOWN' || this.ownerShipType === '2HOUOWN' ||
      this.ownerShipType === '4HOUOWN' || this.ownerShipType === '9HOUOWN' ||
      this.ownerShipType === '5HOUOWN') {

      //  checking whether resi is rented or not
      if (this.ownerShipType === '2HOUOWN') {
        this.isRentDisabled = false;
        this.rentRequired = true;
        this.fieldReportForm.get('rentAmt').enable();
        this.fieldReportForm.get('rentAmt').setValidators(Validators.required);
        this.fieldReportForm.get('rentAmt').updateValueAndValidity();
        setTimeout(() => {
          this.fieldReportForm.get('rentAmt').patchValue(rentAmt || null);
        });

      } else if (this.resedenceType !== '2HOUOWN') { //  checking the condition if resi is not rented
        this.fieldReportForm.get('rentAmt').disable();
        this.isRentDisabled = true;
        this.rentRequired = false;
        setTimeout(() => {
          this.fieldReportForm.get('rentAmt').patchValue(null);
        });
        this.fieldReportForm.get('rentAmt').clearValidators();
        this.fieldReportForm.get('rentAmt').updateValueAndValidity();
      }
      this.ownerNamePropertyAreaRequired = true;
      this.ownerNamePropertyAreaDisabled = false;
      this.fieldReportForm.get('areaOfProperty').enable();
      this.fieldReportForm.get('areaOfProperty').setValidators(Validators.required);
      this.fieldReportForm.get('propertyValue').enable();
      this.fieldReportForm.get('propertyValue').setValidators(Validators.required);
      setTimeout(() => {
        this.fieldReportForm.get('areaOfProperty').setValue(areaOfProperty || null);
        this.fieldReportForm.get('propertyValue').setValue(propertyValue || null);
      });

    } else if (this.ownerShipType !== '1HOUOWN' || this.ownerShipType !== '2HOUOWN' ||
      this.ownerShipType !== '4HOUOWN' || this.ownerShipType !== '9HOUOWN' ||
      this.ownerShipType !== '5HOUOWN') {

      if (this.resedenceType !== '2HOUOWN') { //  checking the condition if resi is not rented
        this.fieldReportForm.get('rentAmt').disable();
        this.isRentDisabled = true;
        this.rentRequired = false;
        setTimeout(() => {
          this.fieldReportForm.get('rentAmt').patchValue(null);

        });
        this.fieldReportForm.get('rentAmt').clearValidators();
        this.fieldReportForm.get('rentAmt').updateValueAndValidity();

      } else if (this.ownerShipType === '2HOUOWN') {
        this.isRentDisabled = false;
        this.rentRequired = true;
        this.fieldReportForm.get('rentAmt').enable();
        this.fieldReportForm.get('rentAmt').setValidators(Validators.required);
        this.fieldReportForm.get('rentAmt').updateValueAndValidity();

      }
      this.ownerNamePropertyAreaRequired = false;
      this.ownerNamePropertyAreaDisabled = true;

      setTimeout(() => {
        this.fieldReportForm.get('areaOfProperty').setValue(null);
        this.fieldReportForm.get('propertyValue').setValue(null);
      });
      this.fieldReportForm.get('areaOfProperty').disable();
      this.fieldReportForm.get('areaOfProperty').clearValidators();
      this.fieldReportForm.get('areaOfProperty').updateValueAndValidity();
      this.fieldReportForm.get('propertyValue').disable();
      this.fieldReportForm.get('propertyValue').clearValidators();
      this.fieldReportForm.get('propertyValue').updateValueAndValidity();
    }
  }


  getPincode(pincode) {
    const pincodeValue = pincode.value;
    if (pincodeValue.length === 6) {
      const pincodeNumber = Number(pincodeValue);
      this.getPincodeResult(pincodeNumber);
    } else {
      this.invalidPincode = false;
    }
  }

  getPincodeResult(pincodeNumber: number) {
    this.invalidPincode = false;
    this.city = []; // clearing the array which contains previous city list
    this.state = []; // clearing the array which contains previous state list
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      }).subscribe((value: any) => {
        // tslint:disable-next-line: no-string-literal
        if (value['ProcessVariables'].error.code === '0') {
          // tslint:disable-next-line: no-string-literal
          this.invalidPincode = false;
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
          });
          this.fieldReportForm.patchValue({
            state: this.state[0].key,
            // city: this.city[0].key
          })
          console.log(this.state, 'state');
          
          // tslint:disable-next-line: no-string-literal
        } else if (value['ProcessVariables'].error.code === '1') {
          if (value['ProcessVariables'].error.message && value['ProcessVariables'].error.message != null) {
            const message = value.ProcessVariables.error.message;
            this.toasterService.showWarning('', message);
            this.invalidPincode = true;
          } else {
            this.invalidPincode = true;

          }
        }
      });

  }
  validateSubmitDate() {
    // const initiatedDate = new Date(this.fieldReportForm.value.cpvInitiatedDate)
    //   ? new Date(this.fieldReportForm.value.cpvInitiatedDate) : null;
    // const submitDate = new Date(this.fieldReportForm.value.reportSubmitDate)
    //   ? new Date(this.fieldReportForm.value.reportSubmitDate) : null;
    // if (initiatedDate !== null && submitDate !== null) {
    //   if (submitDate < initiatedDate) {
    //     this.initDate = true;
    //     this.toasterService.showWarning('Submit Date should be greater than Initiated Date', '');
    //   } else {
    //     this.initDate = false;
    //   }
    // }
  }

  initForm() {

    // fun that initilalizes the form group
    this.fieldReportForm = new FormGroup({
      externalAgencyName: new FormControl({ value: '', disabled: true }),
      // contactPointVerification: new FormControl('', Validators.required),
      referenceNo: new FormControl('', Validators.required),
      cpvInitiatedDate: new FormControl({value: '', disabled: true}),
      // cpvInitiatedTime: new FormControl('', Validators.required),
      // reportSubmitDate: new FormControl('', Validators.required),
      // reportSubmitTime: new FormControl('', Validators.required),
      applicantName: new FormControl({ value: '', disabled: true }),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      landmark: new FormControl(''),
      residenceApproach: new FormControl('', Validators.required),
      residenceDetails: new FormControl('', Validators.required),
      rentAmt: new FormControl(''),
      residenceName: new FormControl('', Validators.required),
      verifiedFrom: new FormControl('', Validators.required),
      personMetName: new FormControl('', Validators.required),
      noOfYearsCity: new FormControl('', Validators.required),
      noOfMonthsCity: new FormControl('', Validators.required),
      yrsOfStayInCity: new FormControl(''),
      noOfYearsResi: new FormControl('', Validators.required),
      noOfMonthsResi: new FormControl('', Validators.required),
      yrsOfStayInResi: new FormControl(''),
      locality: new FormControl('', Validators.required),
      visibleAssets: new FormControl('', Validators.required),
      locatingResidence: new FormControl('', Validators.required),
      otherAssetsOwned: new FormControl('', Validators.required),
      noOfFamilyMembers: new FormControl('', Validators.required),
      noOfEarningMembers: new FormControl('', Validators.required),
      vehicleDetails: new FormControl('', Validators.required),
      fiComments: new FormControl('', Validators.required),
      distanceInKms: new FormControl('', Validators.required),
      cpvAgencyStatus: new FormControl('', Validators.required),
      verifiedBy: new FormControl('', Validators.required),
      fiDate: new FormControl({ value: '', disabled: true }),
      fiTime: new FormControl({ value: '', disabled: true }),
      areaOfProperty: new FormControl(''),
      propertyValue: new FormControl(''),
    });
  }

  setFormValue() { // patching the form values and setting the form values

    const fiModel = this.fiDetails || {}; // setting the response from ger fi details into fi model
    let noofmonthsCity = '';
    let noofyearsCity = '';

    let noofmonthsResi = '';
    let noofyearsResi = '';

    if (this.fiDetails) {

      noofmonthsCity = this.fiDetails.yrsOfStayInCity ? String(Number(this.fiDetails.yrsOfStayInCity) % 12) : '';
      noofyearsCity = this.fiDetails.yrsOfStayInCity ? String(Math.floor(Number(this.fiDetails.yrsOfStayInCity) / 12)) : '';
    }
    if (this.fiDetails) {

      noofmonthsResi = this.fiDetails.yrsOfStayInResi ? String(Number(this.fiDetails.yrsOfStayInResi) % 12) : '';
      noofyearsResi = this.fiDetails.yrsOfStayInResi ? String(Math.floor(Number(this.fiDetails.yrsOfStayInResi) / 12)) : '';
    }

    this.fieldReportForm.patchValue({
      externalAgencyName: fiModel.externalAgencyName ? fiModel.externalAgencyName : null,
      // contactPointVerification: fiModel.contactPointVerification ? fiModel.contactPointVerification : null,
      referenceNo: fiModel.referenceNo ? fiModel.referenceNo : null,
      cpvInitiatedDate: fiModel.cpvInitiatedDate ?
        fiModel.cpvInitiatedDate : null,
      // cpvInitiatedTime: fiModel.cpvInitiatedTime ? fiModel.cpvInitiatedTime : null,
      // reportSubmitDate: fiModel.reportSubmitDate ?
      //   new Date(this.getDateFormat(fiModel.reportSubmitDate)) : null,
      // reportSubmitTime: fiModel.reportSubmitTime ? fiModel.reportSubmitTime : null,
      applicantName: this.applicantFullName ? this.applicantFullName : null,
      addressLine1: fiModel.addressLine1 ? fiModel.addressLine1 : null,
      addressLine2: fiModel.addressLine2 ? fiModel.addressLine2 : null,
      addressLine3: fiModel.addressLine3 ? fiModel.addressLine3 : null,
      pincode: fiModel.pincode ? fiModel.pincode : null,
      city: fiModel.city ? fiModel.city : null,
      state: fiModel.state ? fiModel.state : null,
      landmark: fiModel.landmark ? fiModel.landmark : null,
      residenceApproach: fiModel.residenceApproach ? fiModel.residenceApproach : null,
      residenceDetails: fiModel.residenceDetails ? fiModel.residenceDetails : null,
      rentAmt: fiModel.rentAmt ? fiModel.rentAmt : null,
      residenceName: fiModel.residenceName ? fiModel.residenceName : null,
      verifiedFrom: fiModel.verifiedFrom ? fiModel.verifiedFrom : null,
      personMetName: fiModel.personMetName ? fiModel.personMetName : null,
      yrsOfStayInCity: fiModel.yrsOfStayInCity ? fiModel.yrsOfStayInCity : null,
      yrsOfStayInResi: fiModel.yrsOfStayInResi ? fiModel.yrsOfStayInResi : null,
      locality: fiModel.locality ? fiModel.locality : null,
      visibleAssets: fiModel.visibleAssets ? fiModel.visibleAssets : null,
      locatingResidence: fiModel.locatingResidence ? fiModel.locatingResidence : null,
      otherAssetsOwned: fiModel.otherAssetsOwned ? fiModel.otherAssetsOwned : null,
      noOfFamilyMembers: fiModel.noOfFamilyMembers ? fiModel.noOfFamilyMembers : null,
      noOfEarningMembers: fiModel.noOfEarningMembers ? fiModel.noOfEarningMembers : null,
      vehicleDetails: fiModel.vehicleDetails ? fiModel.vehicleDetails : null,
      activityLevel: fiModel.activityLevel ? fiModel.activityLevel : null,
      fiComments: fiModel.fiComments ? fiModel.fiComments : null,
      distanceInKms: fiModel.distanceInKms ? fiModel.distanceInKms : null,
      cpvAgencyStatus: fiModel.cpvAgencyStatus ? fiModel.cpvAgencyStatus : null,
      verifiedBy: fiModel.verifiedBy ? fiModel.verifiedBy : null,
      fiDate: fiModel.fiDate ? this.utilityService.getDateFromString(fiModel.fiDate) : this.fiDate,
      fiTime: fiModel.fiTime ? fiModel.fiTime : this.fiTime,
      noOfMonthsCity: noofmonthsCity,
      noOfYearsCity: noofyearsCity,
      noOfMonthsResi: noofmonthsResi,
      noOfYearsResi: noofyearsResi,
      areaOfProperty: fiModel.areaOfProperty,
      propertyValue: fiModel.propertyValue,

    });
  }

  getDateFormat(date) { // fun for converting the response date to the valid form date 
    const datePart = date.match(/\d+/g);
    const month = datePart[1];
    const day = datePart[0];
    const year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);
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
      userId: this.userId,
      fiVersion: this.version,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
        }
      ]
    };

    this.fieldInvestigationService.getFiReportDetails(data).subscribe(async (res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.applicantFullName = res.ProcessVariables.applicantName;
        this.fiDetails = res.ProcessVariables.getFIResidenceDetails;
        this.udfDetails= res.ProcessVariables.udfDetails;
        this.setFormValue();
        if (this.fiDetails) {
          if (this.fiDetails.pincode != null) {
            this.getPincodeResult(Number(this.fiDetails.pincode));
            // this.initiatedDate = new Date(this.getDateFormat(this.fiDetails.cpvInitiatedDate));
          }
        }
      }
      if (this.operationType) {
        this.fieldReportForm.disable();
        this.disableSaveBtn = true;
      }
  
      if (this.loanViewService.checkIsLoan360()) {
        this.fieldReportForm.disable();
        this.disableSaveBtn = true;
      }
    });
  }

  onFormSubmit() { // fun that submits all the pd data
    this.validateSubmitDate();
    const formValue = this.fieldReportForm.getRawValue();
    this.yearsOfStayInCity = String((Number(formValue.noOfYearsCity) * 12) + Number(formValue.noOfMonthsCity)) || '';
    this.yearsOfStayInResi = String((Number(formValue.noOfYearsResi) * 12) + Number(formValue.noOfMonthsResi)) || '';
    const formModal = this.fieldReportForm.value;
    const fieldReportModal = { ...formModal };
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    this.isDirty = true;
    console.log('businessForm',this.fieldReportForm )
    if (this.fieldReportForm.invalid || isUDFInvalid) {
      this.toasterService.showError('please enter required details', '');
      return;
    } else if (this.initDate) {
      this.toasterService.showWarning('Submit Date should be greater than Initiated Date', '');
      return;
    }
    this.fiResidenceDetails = {
      externalAgencyName: fieldReportModal.externalAgencyName,
      // contactPointVerification: fieldReportModal.contactPointVerification,
      referenceNo: fieldReportModal.referenceNo,
      cpvInitiatedDate: fieldReportModal.cpvInitiatedDate,
      // cpvInitiatedTime: fieldReportModal.cpvInitiatedTime,
      // reportSubmitDate: this.sendDate(fieldReportModal.reportSubmitDate),
      // reportSubmitTime: fieldReportModal.reportSubmitTime,
      applicantName: this.applicantFullName,
      addressLine1: fieldReportModal.addressLine1,
      addressLine2: fieldReportModal.addressLine2,
      addressLine3: fieldReportModal.addressLine3,
      pincode: fieldReportModal.pincode,
      city: fieldReportModal.city,
      state: fieldReportModal.state,
      landmark: fieldReportModal.landmark,
      residenceApproach: fieldReportModal.residenceApproach,
      residenceDetails: fieldReportModal.residenceDetails,
      rentAmt: fieldReportModal.rentAmt,
      residenceName: fieldReportModal.residenceName,
      verifiedFrom: fieldReportModal.verifiedFrom,
      personMetName: fieldReportModal.personMetName,
      yrsOfStayInCity: this.yearsOfStayInCity,
      yrsOfStayInResi: this.yearsOfStayInResi,
      locality: fieldReportModal.locality,
      visibleAssets: fieldReportModal.visibleAssets,
      locatingResidence: fieldReportModal.locatingResidence,
      otherAssetsOwned: fieldReportModal.otherAssetsOwned,
      noOfFamilyMembers: fieldReportModal.noOfFamilyMembers,
      noOfEarningMembers: fieldReportModal.noOfEarningMembers,
      vehicleDetails: fieldReportModal.vehicleDetails,
      fiComments: fieldReportModal.fiComments,
      distanceInKms: fieldReportModal.distanceInKms,
      cpvAgencyStatus: fieldReportModal.cpvAgencyStatus,
      verifiedBy: fieldReportModal.verifiedBy,
      fiDate: this.sendDate(this.fiDate),
      fiTime: this.fiTime,
      propertyValue: fieldReportModal.propertyValue || '',
      areaOfProperty: fieldReportModal.areaOfProperty || '',
    };
    const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      userId: this.userId,
      applicantId: this.applicantId,
      fiResidenceDetails: this.fiResidenceDetails,
      udfDetails : [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }]
    };

    this.fieldInvestigationService.saveOrUpdateFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
      } else {
        this.toasterService.showError('', 'message');
      }
    });
  }

  onNavigate(action) {
    if (action === 'back') {
      if (this.router.url.includes('/fi-dashboard')) {
        this.router.navigateByUrl(`/pages/fi-dashboard/${this.leadId}/fi-list`);
      } else if (this.router.url.includes('/dde')) {
        this.router.navigate([`/pages/dde/${this.leadId}/fi-list`]);
      }
    } else if (action === 'next') {
      if (this.version != 'undefined') {
        this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${this.applicantId}/fi-business/${this.version}`]);
      } else {
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${this.applicantId}/fi-business`]);
      }
    }
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value)
  }

}
