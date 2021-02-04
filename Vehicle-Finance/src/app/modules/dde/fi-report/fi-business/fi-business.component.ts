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
import { ObjectComparisonService } from '@services/obj-compare.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
@Component({
  selector: 'app-fi-business',
  templateUrl: './fi-business.component.html',
  styleUrls: ['./fi-business.component.css']
})
export class FiBusinessComponent implements OnInit {
  labels: any = {};
  LOV: any = [];
  isDirty: boolean;
  leadId: number;
  userId: any;
  applicantId: number;
  fieldReportForm: FormGroup;
  fieldInvestigation: FieldInvestigation;
  fiDetails: any = [];
  fIBusinessDetails: any = {};
  leadData: {};
  applicantFullName: any;
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
  fiDate: Date = new Date();
  stringTime = String(new Date(new Date().getTime()).toLocaleTimeString()).split(':', 2);
  fiTime: any;
  leadCreatedDateFromLead: any;
  typeOfConcernValue: string;
  version: any;
  showReinitiate: boolean;
  roleType: any;
  roles: any;
  invalidPincode: boolean;
  custSegment: any;
  concernLov: any;
  showTypeOfConcern: boolean;
  showSubmit = true;
  fiList: Array<any>;
  fiStatusValue: any;
  initDate: boolean;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId: any;
  udfGroupId: any;
  initUDFValues: any;
  editedUDFValues: any;
  isApplicantInd: boolean;

  constructor(
    private labelService: LabelsService,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fieldInvestigationService: FieldInvestigationService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService, // service for accessing the toaster
    private applicantService: ApplicantService,
    private utilityService: UtilityService,
    private objectComparisonService: ObjectComparisonService,
    private pdDataService: PdDataService) {
    this.leadId = Number(this.activatedRoute.snapshot.parent.params.leadId);
    this.applicantId = Number(this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    this.version = String(this.activatedRoute.snapshot.parent.firstChild.params.version);
    this.fiTime = this.stringTime[0] + ':' + this.stringTime[1];
  }

  async ngOnInit() {
    this.toDayDate = this.utilityService.getDateFromString(this.utilityService.getDateFormat(this.toDayDate));

    if (this.router.url.includes('/fi-dashboard')) {
      this.showReinitiate = false;
    } else if (this.router.url.includes('/dde')) {
      this.showReinitiate = true;
    }

    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleType = this.roles[0].roleType;
    if (this.roleType === 1) { // For FI dashboard
      this.udfGroupId = 'FIG001'
      //this.udfScreenId = 'FIS002'
    } else if (this.roleType === 2) { // For DDE FI
      this.udfGroupId = 'FIG001'
      //this.udfScreenId = 'FIS004'
    }
    this.leadId = (await this.getLeadId()) as number;
    this.getLOV();
    this.getLabels();
    this.initForm();
    this.isDirty = true;
    this.showTypeOfConcern = true;
    this.labelService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 2 ? udfScreenId.DDE.businessFIDDE : udfScreenId.FI.businessFI ;

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
  getConcernType() {
    if (this.custSegment == "SALCUSTSEG" && this.custSegment != null) {
      this.concernLov = this.LOV.LOVS['concernType-Salaried'];
      this.concernType(this.custSegment);
    } else if (this.custSegment == "SEMCUSTSEG" && this.custSegment != null) {
      this.concernLov = this.LOV.LOVS['concernType-SelfEmployed'];
      this.concernType(this.custSegment);
    } else {
      this.showTypeOfConcern = false;
      this.removeTypeOfConcerValidators();
    }
  }

  concernType(event) {
    this.addTypeOfConcernValidators();
    this.typeOfConcernValue = event ? event : event;
    if (this.typeOfConcernValue === 'SALCUSTSEG') {
      this.removeAddressValidators();
    } else if (this.typeOfConcernValue === 'SEMCUSTSEG') {
      this.addAddressValidators();
    }
  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((value) => {
      this.LOV = value;
      if (this.version !== 'undefined') {
        this.showSubmit = false;
      }
      this.getLeadSectionData();
      this.getFiReportDetails();
    });
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
    this.city = []; // clearing the array which contains previous city list
    this.state = []; // clearing the array which contains previous state list
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      }).subscribe((value: any) => {

        if (value['ProcessVariables'].error.code === '0') {
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
          })

        } else if (value['ProcessVariables'].error.code === '1') {
          if (value['ProcessVariables'].error.message && value['ProcessVariables'].error.message != null) {
            const message = value.ProcessVariables.error.message;
            this.toasterService.showWarning('', message);
            this.invalidPincode = true
          } else {
            this.invalidPincode = true

          }
        }
      });
  }

  getMonths() {
    // const initiatedDate = new Date(this.fieldReportForm.value.cpvInitiatedDate)
    //   ? new Date(this.fieldReportForm.value.cpvInitiatedDate) : null;
    const submitDate = new Date(this.fieldReportForm.value.reportSubmitDate)
      ? new Date(this.fieldReportForm.value.reportSubmitDate) : null;
    // if (initiatedDate && submitDate) {
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
      addressLine2: new FormControl('', Validators.required),
      addressLine3: new FormControl('', Validators.required),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      personMetName: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      natureOfBusiness: new FormControl('', Validators.required),
      typeOfConcern: new FormControl('', Validators.required),
      officeApproach: new FormControl(''),
      officePremises: new FormControl(''),
      officeLocation: new FormControl(''),
      furnishings: new FormControl(''),
      officeSize: new FormControl(''),
      observations: new FormControl(''),
      noOfWorkingEmployees: new FormControl(''),
      noOfVisibleEmployees: new FormControl(''),
      activityLevel: new FormControl(''),
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
    this.fieldReportForm.patchValue({
      externalAgencyName: fiModel.externalAgencyName ? fiModel.externalAgencyName : null,
      // contactPointVerification: fiModel.contactPointVerification ? fiModel.contactPointVerification : null,
      referenceNo: fiModel.referenceNo ? fiModel.referenceNo : null,
      cpvInitiatedDate: fiModel.cpvInitiatedDate ? fiModel.cpvInitiatedDate : null,
      // cpvInitiatedTime: fiModel.cpvInitiatedTime ? fiModel.cpvInitiatedTime : null,
      // reportSubmitDate: fiModel.reportSubmitDate ?
      //   new Date(this.getDateFormat(fiModel.reportSubmitDate)) : null,
      // reportSubmitTime: fiModel.reportSubmitTime ? fiModel.reportSubmitTime : null,
      applicantName: this.applicantFullName || this.applicantFullName || null,
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
      // fiDate: this.fiDate ? this.fiDate : null,
      // fiTime: this.fiTime ? this.fiTime : null
      fiDate: fiModel.fiDate ? this.utilityService.getDateFromString(fiModel.fiDate) : this.fiDate,
      fiTime: fiModel.fiTime ? fiModel.fiTime : this.fiTime,
    });
  }

  removeTypeOfConcerValidators() {
    this.fieldReportForm.get('typeOfConcern').clearValidators();
    this.fieldReportForm.get('typeOfConcern').updateValueAndValidity();
  }

  addTypeOfConcernValidators() {
    this.fieldReportForm.get('typeOfConcern').setValidators(Validators.required);
  }

  removeAddressValidators() {
    this.fieldReportForm.get('officeApproach').clearValidators();
    this.fieldReportForm.get('officeApproach').updateValueAndValidity();
    this.fieldReportForm.get('officePremises').clearValidators();
    this.fieldReportForm.get('officePremises').updateValueAndValidity();
    this.fieldReportForm.get('officeLocation').clearValidators();
    this.fieldReportForm.get('officeLocation').updateValueAndValidity();
    this.fieldReportForm.get('furnishings').clearValidators();
    this.fieldReportForm.get('furnishings').updateValueAndValidity();
    this.fieldReportForm.get('officeSize').clearValidators();
    this.fieldReportForm.get('officeSize').updateValueAndValidity();
    this.fieldReportForm.get('observations').clearValidators();
    this.fieldReportForm.get('observations').updateValueAndValidity();
    this.fieldReportForm.get('noOfWorkingEmployees').clearValidators();
    this.fieldReportForm.get('noOfWorkingEmployees').updateValueAndValidity();
    this.fieldReportForm.get('noOfVisibleEmployees').clearValidators();
    this.fieldReportForm.get('noOfVisibleEmployees').updateValueAndValidity();
    this.fieldReportForm.get('activityLevel').clearValidators();
    this.fieldReportForm.get('activityLevel').updateValueAndValidity();
  }

  addAddressValidators() {
    this.fieldReportForm.get('officeApproach').setValidators(Validators.required);
    this.fieldReportForm.get('officePremises').setValidators(Validators.required);
    this.fieldReportForm.get('officeLocation').setValidators(Validators.required);
    this.fieldReportForm.get('furnishings').setValidators(Validators.required);
    this.fieldReportForm.get('officeSize').setValidators(Validators.required);
    this.fieldReportForm.get('observations').setValidators(Validators.required);
    this.fieldReportForm.get('noOfWorkingEmployees').setValidators(Validators.required);
    this.fieldReportForm.get('noOfVisibleEmployees').setValidators(Validators.required);
    this.fieldReportForm.get('activityLevel').setValidators(Validators.required);
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
        this.udfDetails= res.ProcessVariables.udfDetails;
        if (processVariables.getFIBusinessDetails) {
          this.custSegment = processVariables.getFIBusinessDetails.custSegment;
        } else {
          this.custSegment == null;
        }
        this.applicantFullName = res.ProcessVariables.applicantName;
        this.fiDetails = res.ProcessVariables.getFIBusinessDetails;
        this.setFormValue();
        this.getConcernType();
        if (this.fiDetails) {
          if (this.fiDetails.pincode != null) {
            this.getPincodeResult(Number(this.fiDetails.pincode));
          }
        }
      }
    });
  }

  submitFiReportDetails() {
    this.isDirty = true;
    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    if (this.fieldReportForm.invalid || isUDFInvalid) {
      this.toasterService.showWarning('please enter required details', '');
      return;
    }
    if (!isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    const data = {
      applicantId: this.applicantId,
      leadId: this.leadId,
      userId: this.userId
    };

    this.fieldInvestigationService.SumbitFiReportDetails(data).subscribe((res: any) => {
      const processvariables = res.ProcessVariables;
      const message = processvariables.error.message;
      if (processvariables.error.code === '0') {
        this.toasterService.showSuccess('Report Submitted Successfully', '');
        this.getFiList();
      } else {
        this.toasterService.showError('', message);
      }
    });
  }

  getFiList() {

    const data = {
      applicantId: this.applicantId, // uncomment when we get proper applicant ID
      userId: this.userId,
    };

    this.fieldInvestigationService.getFiList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      this.fiList = processvariables.finalFIList;
      const arrayLength = this.fiList.length;
      let n = 0;
      for (var i in this.fiList) {
        this.fiStatusValue = this.fiList[i]['fiStatus']
        if (this.fiList[i]['fiStatusValue'] == "Submitted") {
          n = n + 1;
        }
      }
      if (n === arrayLength) {
        this.router.navigate([`/pages/dashboard`]);
      } else {
        this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-list`]);
      }
    });
  }

  onFormSubmit() { // fun that submits all the pd data
    const formModal = this.fieldReportForm.value;
    const fieldReportModal = { ...formModal };
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    this.isDirty = true;
    if (this.fieldReportForm.invalid || isUDFInvalid) {
      this.toasterService.showWarning('please enter required details', '');
      return;
    } else if (this.initDate) {
      this.toasterService.showWarning('Submit Date should be greater than Initiated Date', '');
      return;
    }

    this.fIBusinessDetails = {
      externalAgencyName: fieldReportModal.externalAgencyName,
      // contactPointVerification: fieldReportModal.contactPointVerification,
      referenceNo: fieldReportModal.referenceNo,
      // cpvInitiatedDate: this.sendDate(fieldReportModal.cpvInitiatedDate),
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
      personMetName: fieldReportModal.personMetName,
      designation: fieldReportModal.designation,
      natureOfBusiness: fieldReportModal.natureOfBusiness,
      typeOfConcern: fieldReportModal.typeOfConcern,
      officeApproach: fieldReportModal.officeApproach,
      officePremises: fieldReportModal.officePremises,
      officeLocation: fieldReportModal.officeLocation,
      furnishings: fieldReportModal.furnishings,
      officeSize: fieldReportModal.officeSize,
      observations: fieldReportModal.observations,
      noOfWorkingEmployees: fieldReportModal.noOfWorkingEmployees,
      noOfVisibleEmployees: fieldReportModal.noOfVisibleEmployees,
      activityLevel: fieldReportModal.activityLevel,
      fiComments: fieldReportModal.fiComments,
      distanceInKms: fieldReportModal.distanceInKms,
      cpvAgencyStatus: fieldReportModal.cpvAgencyStatus,
      verifiedBy: fieldReportModal.verifiedBy,
      fiDate: this.sendDate(this.fiDate),
      fiTime: this.fiTime,
    };
    const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      userId: this.userId,
      applicantId: this.applicantId,
      fIBusinessDetails: this.fIBusinessDetails,
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
        this.initUDFValues = this.userDefineForm.udfData.getRawValue();
        this.getFiReportDetails();
      } else {
        this.toasterService.showError('', message);
      }
    });
  }

  // method for re-initating fi report
  reinitiateFi() {  // fun calling reinitiate fi report  api for reinitiating the respective fi report
    const data = {
      applicantId: this.applicantId,
      userId: this.userId
    };

    this.fieldInvestigationService.reinitiateFiReportDetails(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('Report Reinitiated Successfully', '');
        this.router.navigate([`/pages/dde/${this.leadId}/fi-list`]);
      } else {
        this.toasterService.showError('', 'message');
      }
    });
  }

  onNavigateBack() {
    const applicantType = this.pdDataService.getApplicantType();
     if(applicantType == 'Non-Individual') {
      if (this.router.url.includes('/fi-dashboard')) {
        this.router.navigateByUrl(`/pages/fi-dashboard/${this.leadId}/fi-list`);
      } else if (this.router.url.includes('/dde')) {
        this.router.navigate([`/pages/dde/${this.leadId}/fi-list`]);
      }
      return;
     }
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/fi-report/${this.applicantId}/fi-residence/${this.version}`]);
    } else {
      this.router.navigate([`/pages/fi-dashboard/${this.leadId}/fi-report/${this.applicantId}/fi-residence`]);
    }
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value);
    if(value.event === 'init'){
      this.initUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    }
  }

}
