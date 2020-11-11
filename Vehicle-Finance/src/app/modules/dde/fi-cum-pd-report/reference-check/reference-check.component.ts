import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { SharedModule } from '@modules/shared/shared.module';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { Constant } from '../../../../../assets/constants/constant';
import { UtilityService } from '@services/utility.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { Base64StorageService } from '@services/base64-storage.service';
import { UploadService } from './../../../../services/upload.service';
import { LoginService } from '@modules/login/login/login.service';
import { ApplicantService } from '@services/applicant.service';
import { GpsService } from './../../../../services/gps.service';
import { environment } from 'src/environments/environment';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { element } from 'protractor';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-reference-check',
  templateUrl: './reference-check.component.html',
  styleUrls: ['./reference-check.component.css']
})
export class ReferenceCheckComponent implements OnInit {

  referenceCheckForm: FormGroup;
  userId: any;
  userName: any;
  roles: any;
  roleName: string;
  getLabels: any;
  labels: any = {};
  errorMsg: any;
  applicantId: number;
  refCheckDetails: any = {};
  otherDetails: any = {};
  isDirty: boolean;
  isSoNameEnable: true;
  userDetails: any;
  leadId: number;
  disableSaveBtn: boolean;

  selectedDocDetails: DocRequest;

  base64Image: any;
  showModal: boolean;
  isMobile: any;

  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;

  SELFIE_IMAGE: string;

  documentArr: DocumentDetails[] = [];

  latitude: string = null;
  longitude: string = null;
  branchLatitude: string;
  branchLongitude: string;
  custProfileDetails: {};
  showRouteMap: boolean;
  version: string;
  show = true;
  taskId: any;
  roleId: any;
  roleType: any;
  showReinitiate: boolean;
  showSubmit = true;
  productCat: any;
  serviceProductCat: any;
  sourcingChannel: any;
  serviceSourcingChannel: any;
  equitasBranchName: any;
  distanceFromEquitas: any;
  serviceEquitasBranchName: any;
  soName: any;
  employeeCode: any;
  // serviceEmployeeCode: any;
  sysDate: Date = new Date();
  date: any;
  stringTime: any = String(new Date(new Date().getTime()).toLocaleTimeString()).split(':', 2);
  time: any;
  sysTimeOfVerification: any;
  totalApplicantCount: number;
  submittedApplicantCount: number;
  pdList: [];
  pdStatusValue: any;
  serviceAppNo: any;
  applicationNo: any;
  distanceFromBranch: any;
  productCatCode: any;
  listArray: FormArray;
  referenceDetails: any;
  marketAndFinReferenceDetails: any;
  LOV: any;
  applicantType: any;
  allowSave: boolean;
  constructor(
    private labelsData: LabelsService, // service to access labels
    private personalDiscussion: PersonalDiscussionService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sharedSercive: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private uploadService: UploadService,
    private base64StorageService: Base64StorageService,
    private loginService: LoginService,
    private applicantService: ApplicantService,
    private gpsService: GpsService,
    private utilityService: UtilityService,
    private toasterService: ToasterService, // service for accessing the toaster
    private toggleDdeService: ToggleDdeService,
    private commonLovService: CommomLovService,

  ) {
    this.listArray = this.fb.array([]);
    this.sharedSercive.taskId$.subscribe((value) => {
      this.taskId = value;
      console.log('in ref check task id', this.taskId);
    });
    this.isMobile = environment.isMobile;
    // console.log('systime default', this.sysDate);
  }

  async ngOnInit() {

    this.checkGpsEnabled();

    if (this.router.url.includes('/pd-dashboard')) {

      console.log(' pd-dashboard ');
      this.show = false;
    }
    this.sysTimeOfVerification = this.stringTime[0] + ':' + this.stringTime[1];

    // accessing lead id from route

    this.leadId = (await this.getLeadId()) as number;
    // console.log("leadID =>", this.leadId)


    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.userDetails = roleAndUserDetails.userDetails;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    this.userName = this.userDetails.firstName;
    console.log('user details ==> ', roleAndUserDetails);
    console.log('user id ==>', this.userId);
    console.log('user name', this.userName);

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        this.activatedRoute.params.subscribe((value) => {// calling get lead section data function in line 174
          if (!value && !value.applicantId) {
            return;
          }
          this.applicantId = Number(value.applicantId);
          this.version = String(value.version);
          if (this.version !== 'undefined') {
            this.showSubmit = false;
          }
          this.getLOV();
          this.getLeadSectiondata();
          this.getPdDetails();   // for getting the data for pd details on initializing the page
          // this.removeReferenceControls();
          console.log('Applicant Id In reference Details Component', this.applicantId);

        });
        // console.log("this labels data", this.labels)
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();             // for initializing the form
    this.removeReferenceControls();
    this.selectedDocDetails = {
      docsType: this.PROFILE_TYPE,
      docSize: this.OTHER_DOCUMENTS_SIZE,
      docTp: "LEAD",
      docSbCtgry: "ACCOUNT OPENING FORM",
      docNm: "ACCOUNT_OPENING_FORM20206216328474448.pdf",
      docCtgryCd: 70,
      docCatg: "KYC - I",
      docTypCd: 276,
      flLoc: "",
      docCmnts: "Addition of document for Lead Creation",
      bsPyld: "Base64 data of the image",
      docSbCtgryCd: 204,
      docsTypeForString: "selfie",
      docRefId: [
        {
          idTp: 'LEDID',
          id: this.leadId,
        },
        {
          idTp: 'BRNCH',
          id: Number(localStorage.getItem('branchId')),
        },
      ],
    };

    setTimeout(() => {
      const operationType = this.toggleDdeService.getOperationType();
      if (operationType) {
        this.referenceCheckForm.disable();
        this.disableSaveBtn = true;
      }
    });
  }

  async checkGpsEnabled() {
    this.gpsService.getLatLong().subscribe((position) => {
      console.log("getLatLong", position);
      this.gpsService.initLatLong().subscribe((res) => {
        console.log("gpsService", res);
        if (res) {
          this.gpsService.getLatLong().subscribe((position) => {
            console.log("getLatLong", position);
          });
        } else {
          console.log("error initLatLong", res);
        }
      });
    });
  }

  getLeadId() { // function to access respective lead id from the routing
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }

  // GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    console.log('lead data', leadData);
    this.serviceSourcingChannel = leadData['leadDetails'].sourcingChannelDesc;
    this.serviceEquitasBranchName = leadData['leadDetails'].branchName;
    this.serviceProductCat = leadData['leadDetails'].productCatName;
    this.serviceAppNo = leadData['leadDetails'].applicationNo;
    const leadDetailsFromLead = leadData['leadDetails'];
    this.productCatCode = leadDetailsFromLead.productCatCode;
    console.log('prod cat code', this.productCatCode);

    for (const value of leadData['applicantDetails']) {
      if (value['applicantId'] === this.applicantId) {
        const applicantDetailsFromLead = value;
        this.applicantType = applicantDetailsFromLead['applicantTypeKey']
      }
    }
    console.log('applicant type', this.applicantType);
  }
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
    // this.getLeadSectionData();
    //   if (!value && !value.applicantId) {
    //     return;
    //   }
    //   this.applicantId = Number(value.applicantId);
    //   this.version = String(value.version);
    //   console.log('Applicant Id In Loan Details Component', this.applicantId);
    // });
  }
  getApplicantId() { // function to access respective applicant id from the routing

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log('Applicant Id In reference check Component', this.applicantId);
    });
  }

  initForm() {  // function that intializes the form group

    this.referenceCheckForm = this.fb.group({
      nameOfReference: new FormControl('', Validators.required),
      addressOfReference: new FormControl('', Validators.required),
      referenceMobile: new FormControl('', Validators.required),
      overallFiReport: new FormControl('', Validators.required),
      negativeProfile: new FormControl('', Validators.required),
      // pdRemarks: new FormControl('', Validators.required),
      pdRemarks: new FormControl('', Validators.compose
        ([Validators.maxLength(200), Validators.pattern(/^[a-zA-Z .:,]*$/), Validators.required])),
      applicationNo: new FormControl({ value: '', disabled: true }),
      product: new FormControl({ value: '', disabled: true }),
      sourcingChannel: new FormControl({ value: '', disabled: true }),
      routeMap: new FormControl(''),
      equitasBranchName: new FormControl({ value: '', disabled: true }),
      distanceFromEquitas: new FormControl({ value: '', disabled: true }),
      soName: new FormControl({ value: '', disabled: true }),
      employeeCode: new FormControl({ value: '', disabled: true }),
      area: new FormControl('', Validators.required),
      date: new FormControl({ value: '', disabled: true }),
      place: new FormControl({ value: '', disabled: true }),
      timeOfVerification: new FormControl({ value: '', disabled: true }),
      latitude: new FormControl({ value: '', disabled: true }),
      longitude: new FormControl({ value: '', disabled: true }),
      bLatitude: new FormControl({ value: '', disabled: true }),
      bLongitude: new FormControl({ value: '', disabled: true }),
      marketFinRefData: this.listArray
    });
  }
  removeReferenceControls() {
    const controls = this.referenceCheckForm as FormGroup;
    console.log('in remove controls', controls);
    console.log('in remove controls', this.productCatCode);
    if (this.productCatCode !== 'NCV') {
      controls.removeControl('marketFinRefData');
    }
  }
  public populateRowData(rowData) {

    console.log('in initRows RowData');
    return this.fb.group({
      typeReference: rowData.typeReference ? rowData.typeReference : null,
      companyName: rowData.companyName ? rowData.companyName : null,
      officerName: rowData.officerName ? rowData.officerName : null,
      designation: rowData.designation ? rowData.designation : null,
      teleNo: rowData.teleNo ? rowData.teleNo : null,
      comments: rowData.comments ? rowData.comments : null,
      id: rowData.id ? rowData.id : null,
      applicantId: rowData.applicantId ? rowData.applicantId : this.applicantId

    });
  }
  public initRows(index: number) {
    console.log('in initRows no RowData');
    return this.fb.group({

      typeReference: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      officerName: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      teleNo: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.required]),
      id: 0,
      applicantId: this.applicantId,

    });
  }


  getPdDetails() { // function calling get pd report api to get respective pd details

    const data = {

      applicantId: this.applicantId,
      pdVersion: this.version,

    };
    console.log('applicant id in get detaisl', this.applicantId);
    console.log('version in get pd', this.version);

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.refCheckDetails = value.ProcessVariables.referenceCheck;
        this.otherDetails = value.ProcessVariables.otherDetails;
        this.showReinitiate = value.ProcessVariables.showReinitiate;
        // console.log('in ref check show renitiate', this.showReinitiate);
        // console.log('calling get api ', this.refCheckDetails);
        this.branchLongitude = value.ProcessVariables.customerProfileDetails.branchLongitude;
        this.branchLatitude = value.ProcessVariables.customerProfileDetails.branchLatitude;
        this.latitude = value.ProcessVariables.customerProfileDetails.latitude;
        this.longitude = value.ProcessVariables.customerProfileDetails.longitude;
        this.SELFIE_IMAGE = value.ProcessVariables.profilePhoto;
        const referenceDetails = processVariables.marketFinRefData;
        if (referenceDetails != null && this.productCatCode === 'NCV') {
          this.populateData(value);

        } else if (referenceDetails == null && this.productCatCode === 'NCV') {
          const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
          control.push(this.initRows(null));

        }
        this.setFormValue();
        if (this.latitude) {
          this.getRouteMap();
        }
      } else {
        console.log('error', processVariables.error.message);

      }
    });

  }
  public populateData(data?: any) {
    const referenceDetailsList = data.ProcessVariables.marketFinRefData;
    for (let i = 0; i < referenceDetailsList.length; i++) {
      this.addProposedUnit(referenceDetailsList[i]);
    }
  }
  addProposedUnit(data?: any) {
    const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
    control.push(this.populateRowData(data));
  }

  addNewRow(rowData) {
    const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
    control.push(this.initRows(rowData));
  }

  deleteRow(index: number, references: any) {
    console.log('in delete row fn ', references, index);
    const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
    // tslint:disable-next-line: prefer-const
    let referenceId = references[index].id;
    let i = 0;
    let j = 0;
    references.forEach(element => {
      console.log('element', element);
      if (element.typeReference === '1REFTYPE' || element.typeReference === '2REFTYPE') {
        i = i + 1;
      } else if (element.typeReference === '3REFTYPE' || element.typeReference === '4REFTYPE') {
        j = j + 1;
      }
    });
    console.log('i j values', i, j);
    if (references.length > 2) {
      const data = {
        id: referenceId
      };
      if ((referenceId !== 0 && i > 1 && j === 1) && (references[index].typeReference === '3REFTYPE' ||
        references[index].typeReference === '4REFTYPE')) {
        this.toasterService.showError(' atleast one market reference is required', '');

      } else if ((referenceId !== 0 && i === 1 && j > 1) && (references[index].typeReference === '1REFTYPE' ||
        references[index].typeReference === '2REFTYPE')) {
        this.toasterService.showError(' atleast one finance reference is required', '');
      } else if ((referenceId !== 0) && (i > 1 || j > 1)) {
        this.personalDiscussion.deleteMarFinReference(data).subscribe((res: any) => {
          const processVariables = res.ProcessVariables;
          const message = processVariables.error.message;
          if (processVariables.error.code === '0') {
            // references.splice(index, 1);
            this.toasterService.showSuccess(message, '');
            this.listArray.controls = [];
            this.getPdDetails();
          } else {
            this.toasterService.showSuccess(message, '');
          }
        });
      } else if (referenceId === 0) {
        control.removeAt(index);
        this.toasterService.showSuccess('Reference details deleted successfully', '');
      }
      // console.log('reference array', control.value);

    } else if (referenceId !== 0 && (i === 1 && j === 1)) {
      this.toasterService.showError('atleast one market and finance reference required', '');
    }
  }
  setFormValue() {

    const refCheckModel = this.refCheckDetails || {};
    const otherDetailsModel = this.otherDetails || {};
    if (this.refCheckDetails) {
      this.soName = this.refCheckDetails.soName ? this.refCheckDetails.soName : this.userName;
      this.employeeCode = this.refCheckDetails.employeeCode ? this.refCheckDetails.employeeCode : this.userId;
    } else {
      this.soName = this.userName;
      this.employeeCode = this.userId;
    }
    if (this.otherDetails) {
      this.applicationNo = this.otherDetails.applicationNo ? this.otherDetails.applicationNo : this.serviceAppNo;
      this.productCat = this.otherDetails.product ? this.otherDetails.product : this.serviceProductCat;
      this.sourcingChannel = this.otherDetails.sourcingChannel ? this.otherDetails.sourcingChannel : this.serviceSourcingChannel;
      this.equitasBranchName = this.otherDetails.equitasBranchName ? this.otherDetails.equitasBranchName : this.serviceEquitasBranchName;
      this.date = this.otherDetails.date ? this.utilityService.getDateFromString(this.otherDetails.date) : this.sysDate;
      this.time = this.otherDetails.timeOfVerification ? this.otherDetails.timeOfVerification : this.sysTimeOfVerification;
      // this.distanceFromEquitas = this.otherDetails.distanceFromEquitas ? this.otherDetails.distanceFromEquitas : this.distanceFromBranch;
    } else {
      this.applicationNo = this.serviceAppNo;
      this.productCat = this.serviceProductCat;
      this.sourcingChannel = this.serviceSourcingChannel;
      this.equitasBranchName = this.serviceEquitasBranchName;
      // this.distanceFromEquitas = this.distanceFromBranch;
      this.date = this.sysDate;
      this.time = this.sysTimeOfVerification;

    }


    this.referenceCheckForm.patchValue({
      nameOfReference: refCheckModel.nameOfReference ? refCheckModel.nameOfReference : null,
      addressOfReference: refCheckModel.addressOfReference ? refCheckModel.addressOfReference : null,
      referenceMobile: refCheckModel.referenceMobile ? refCheckModel.referenceMobile : null,
      negativeProfile: refCheckModel.negativeProfile ? refCheckModel.negativeProfile : null,
      overallFiReport: refCheckModel.overallFiReport ? refCheckModel.overallFiReport : null,
      pdRemarks: refCheckModel.pdRemarks ? refCheckModel.pdRemarks : null,
      // soName: this.userName ? this.userName : null,
      soName: this.soName ? this.soName : null,
      employeeCode: this.employeeCode ? this.employeeCode : null,
      // patching other details object data from backend
      product: this.productCat ? this.productCat : null,
      sourcingChannel: this.sourcingChannel ? this.sourcingChannel : null,
      routeMap: otherDetailsModel.routeMap ? otherDetailsModel.routeMap : null,
      equitasBranchName: this.equitasBranchName ? this.equitasBranchName : null,
      distanceFromEquitas: otherDetailsModel.distanceFromEquitas ? otherDetailsModel.distanceFromEquitas : null,
      date: this.date ? this.date : null,
      // date: this.otherDetails.date ? this.utilityService.getDateFromString(this.otherDetails.date) : '',
      area: otherDetailsModel.area ? otherDetailsModel.area : null,
      place: otherDetailsModel.place ? otherDetailsModel.place : null,
      timeOfVerification: this.time ? this.time : null,
      latitude: this.latitude || "",
      longitude: this.longitude || "",
      bLatitude: this.branchLatitude || "",
      bLongitude: this.branchLongitude || ""
      // time: new Date(refCheckModal.time ? this.getDateFormat(refCheckModal.time) : ""),
    });
    console.log('patched form', this.referenceCheckForm);
  }


  onFormSubmit(references: any) { // function that calls sumbit pd report api to save the respective pd report
    console.log('latitude::', this.latitude);
    console.log('longitude::', this.longitude);
    if (this.productCatCode === 'NCV') {
      const referenceArray = (this.referenceCheckForm.value.marketFinRefData as FormArray);
      console.log('reference data', referenceArray);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < referenceArray.length; i++) {
        referenceArray[i]['typeReference'] = referenceArray[i]['typeReference'];
        referenceArray[i]['companyName'] = referenceArray[i]['companyName'];
        referenceArray[i]['officerName'] = referenceArray[i]['officerName'];
        referenceArray[i]['designation'] = referenceArray[i]['designation'];
        referenceArray[i]['teleNo'] = referenceArray[i]['teleNo'];
        referenceArray[i]['comments'] = referenceArray[i]['comments'];
      }
      this.referenceCheckForm.value.marketFinRefData = referenceArray;
      console.log(this.referenceCheckForm.value.marketFinRefData);

      let i = 0;
      let j = 0;
      references.forEach(element => {
        console.log('element', element);
        if (element.typeReference === '1REFTYPE' || element.typeReference === '2REFTYPE') {
          i = i + 1;
        } else if (element.typeReference === '3REFTYPE' || element.typeReference === '4REFTYPE') {
          j = j + 1;
        }
      });
      console.log('i j values', i, j);
      if (i >= 1 && j >= 1) {
        this.allowSave = true;
      }
      this.marketAndFinReferenceDetails = referenceArray;
    }

    this.custProfileDetails = {
      latitude: this.latitude || '',
      longitude: this.longitude || '',
    };
    const formModel = this.referenceCheckForm.value;
    console.log('form model', formModel);
    this.isDirty = true;
    if (this.referenceCheckForm.invalid) {
      console.log('in invalid ref checkform', this.referenceCheckForm);
      this.toasterService.showWarning('please enter required details', '');
      return;

    } else if (this.allowSave !== true && this.productCatCode === 'NCV') {
      this.toasterService.showWarning('atleast one market and finance reference required', '');
      return;
    }
    console.log('this product', this.productCat);
    console.log("this soucing", this.sourcingChannel);
    const referenceCheckModel = { ...formModel };
    this.refCheckDetails = {
      nameOfReference: referenceCheckModel.nameOfReference ? referenceCheckModel.nameOfReference : null,
      addressOfReference: referenceCheckModel.addressOfReference ? referenceCheckModel.addressOfReference : null,
      referenceMobile: referenceCheckModel.referenceMobile ? referenceCheckModel.referenceMobile : null,
      negativeProfile: referenceCheckModel.negativeProfile ? referenceCheckModel.negativeProfile : null,
      overallFiReport: referenceCheckModel.overallFiReport ? referenceCheckModel.overallFiReport : null,
      pdRemarks: referenceCheckModel.pdRemarks ? referenceCheckModel.pdRemarks : null,
      soName: this.userName ? this.userName : null,
      employeeCode: this.userId ? this.userId : null,
    };
    console.log('systime', this.sysTimeOfVerification);

    this.otherDetails = {

      applicationNo: this.applicationNo ? this.applicationNo : null,
      product: this.productCat ? this.productCat : null,
      sourcingChannel: this.sourcingChannel ? this.sourcingChannel : null,
      routeMap: referenceCheckModel.routeMap ? referenceCheckModel.routeMap : null,
      equitasBranchName: this.equitasBranchName ? this.equitasBranchName : null,
      distanceFromEquitas: this.distanceFromBranch ? this.distanceFromBranch : null,
      // this.formValues.date = this.formValues.date ? this.utilityService.convertDateTimeTOUTC(this.formValues.date, 'DD/MM/YYYY') : null;
      date: this.date ? this.utilityService.getDateFormat(this.date) : null,
      area: referenceCheckModel.area ? referenceCheckModel.area : null,
      place: referenceCheckModel.place ? referenceCheckModel.place : null,
      timeOfVerification: this.time ? this.time : null,
      pdOfficerName: this.soName ? this.soName : null,


    };

    const data = {
      leadId: this.leadId,
      applicantId: this.applicantId,
      userId: this.userId,
      referenceCheck: this.refCheckDetails,
      otherDetails: this.otherDetails,
      customerProfileDetails: this.custProfileDetails,
      profilePhoto: this.SELFIE_IMAGE,
      marketFinRefData: this.marketAndFinReferenceDetails

    };

    this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
      // console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
        this.listArray.controls = [];
        this.getPdDetails();

      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });



  }

  approvePd() { // function that calls approve pd report api for approving pd report
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1,
      userId: this.userId
    };
    this.personalDiscussion.approvePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      // console.log('response approve pd', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {

        this.toasterService.showSuccess('pd report approved successfully', '');
        this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
      } else {
        this.toasterService.showError('', 'message');

      }
    });

  }

  // method for re-initating pd report

  reinitiatePd() {  // fun calling reinitiate pd report  api for reinitiating the respective pd report
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1,
      userId: this.userId
    };
    this.personalDiscussion.reinitiatePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      // console.log('response reinitiate pd', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {

        this.toasterService.showSuccess('pd report reinitiated successfully', '');
        // this.router.navigate([`/pages/dashboard`]);
        this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
      } else {
        this.toasterService.showError('', 'message');

      }
    });



  }

  submitToCredit() { // fun calling submit to credit api for submitting pd report

    this.isDirty = true;
    if (this.referenceCheckForm.invalid) {
      this.toasterService.showWarning('please enter required details', '');
      return;
    }

    const data = {
      taskName: Constant.PDTASKNAME,
      leadId: this.leadId,

      userId: this.userId,
      // applicantId: 1,
      taskId: this.taskId,

      applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */

    };

    this.personalDiscussion.submitPdReport(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        // console.log('message', processVariables.error.message);
        this.toasterService.showSuccess('submitted to credit successfully', '');
        this.totalApplicantCount = processVariables.applicantCount;
        this.submittedApplicantCount = processVariables.notSubmittedApplicantId;
        // this.getPdList();
        if (processVariables.goToDashboard) {
          this.router.navigate([`/pages/dashboard`]);
        } else {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
        }

        // if (this.totalApplicantCount && this.submittedApplicantCount) {
        //   console.log('no of applicants', this.totalApplicantCount);
        //   console.log('no of applicants submitted', this.submittedApplicantCount);
        //   if (this.totalApplicantCount === this.submittedApplicantCount) {
        //     this.router.navigate([`/pages/dashboard`]);

        //   } else {
        //     this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
        //   }
        // }


      } else {
        this.toasterService.showError(processVariables.error.message, '');
        // console.log('error', processVariables.error.message);

      }
    });

  }
  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      leadId: this.leadId,
      userId: this.userId
    };
    this.personalDiscussion.getPdList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      // this.isFiCumPD = processvariables.isFiCumPD;
      this.pdList = processvariables.finalPDList;
      const arrayLength = this.pdList.length;
      let n = 0;
      for (var i in this.pdList) {
        this.pdStatusValue = this.pdList[i]['pdStatusValue']
        if (this.pdList[i]['pdStatusValue'] == "Submitted") {
          n = n + 1;
        }
        console.log('number n ', n);
        console.log('length', arrayLength);

      }
      if (n === arrayLength) {
        this.router.navigate([`/pages/dashboard`]);
      } else {
        this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
      }
    });
  }



  onNavigateToPdSummary() { // fun to navigate to pd summary
    // this.getPdList();
    if (this.version != 'undefined') {
      // console.log('in routing defined version condition', this.version);
      // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

      this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);

    } else {
      // console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);

    }
  }

  onNavigateBack() { // fun to navigate to back page
    if (this.version != 'undefined') {
      // console.log('in routing defined version condition', this.version);
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details/${this.version}`]);

    } else {
      // console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details`]);
      // this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/loan-details/${this.applicantId}/${this.version}`]);

    }
  }

  async onUploadSuccess(event: DocumentDetails) {
    // this.toasterService.showSuccess('Document uploaded successfully', '');
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    const data = {
      inputValue: event.imageUrl,
      isPhoto: true,
      applicantId: this.applicantId,
    };
    // this.uploadPhotoOrSignature(data);

    event.imageUrl = '';

    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    }
    console.log('documentArr', this.documentArr);
    this.individualImageUpload(event, index);

    const position = await this.getLatLong();
    if (position["latitude"]) {
      this.latitude = position["latitude"].toString();
      this.longitude = position["longitude"].toString();
      this.getRouteMap();
      this.referenceCheckForm.get("latitude").patchValue(this.latitude);
      this.referenceCheckForm.get("longitude").patchValue(this.longitude);

    } else {
      this.latitude = "";
      this.longitude = "";
      this.showRouteMap = false;
      this.toasterService.showError(position["message"], "GPS Alert");
    }

  }

  uploadPhotoOrSignature(data) {
    this.applicantService.uploadPhotoOrSignature(data).subscribe((value) => {
      console.log('uploadPhotoOrSignature', value, 'data', data);
    });
  }


  individualImageUpload(request: DocumentDetails, index: number) {
    this.uploadService
      .saveOrUpdateDocument([request])
      .subscribe((value: any) => {
        if (value.Error !== '0') {
          return;
        }
        this.toasterService.showSuccess('Document uploaded successfully', '');
        console.log('saveOrUpdateDocument', value);
        const processVariables = value.ProcessVariables;
        const documentId = processVariables.documentIds[0];
        console.log("documentId******", documentId);
        this.documentArr[index].documentId = documentId;
        const subCategoryCode = this.documentArr[index].subCategoryCode;
      });
  }

  getRouteMap() {
    var that = this;
    const branchPos = {
      latitude: this.branchLatitude,
      longitude: this.branchLongitude
    };
    const currentPos = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.loginService.getPolyLine(function (result, distance) {
      that.base64Image = result;
      that.distanceFromBranch = distance;
      that.showRouteMap = true;
      console.log('distance from bank', that.distanceFromBranch);
      if (that.distanceFromBranch) {
        that.referenceCheckForm.get('distanceFromEquitas').setValue(that.distanceFromBranch);
        that.referenceCheckForm.get('distanceFromEquitas').updateValueAndValidity;
      } else {
        that.referenceCheckForm.get('distanceFromEquitas').setValue(null);
        that.referenceCheckForm.get('distanceFromEquitas').updateValueAndValidity;
      }
      // console.log("getPolyLine", that.base64Image);
    }, currentPos, branchPos);
  }

  async downloadDocs(documentId: string) {
    console.log(event);

    // let el = event.srcElement;
    // const formArray = this.uploadForm.get(formArrayName) as FormArray;
    // const documentId = formArray.at(index).get('file').value;
    if (!documentId) {
      return;
    }
    const bas64String = this.base64StorageService.getString(
      this.applicantId + documentId
    );
    if (bas64String) {
      // this.setContainerPosition(el);
      // this.showDraggableContainer = {
      //   imageUrl: bas64String.imageUrl,
      //   imageType: bas64String.imageType,
      // };
      // this.draggableContainerService.setContainerValue({
      //   image: this.showDraggableContainer,
      //   css: this.setCss,
      // });
      this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + bas64String.imageUrl;
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    // this.setContainerPosition(el);
    // this.showDraggableContainer = {
    //   imageUrl: imageValue.imageUrl,
    //   imageType: imageValue.imageType,
    // };
    // this.draggableContainerService.setContainerValue({
    //   image: this.showDraggableContainer,
    //   css: this.setCss,
    // });
    // this.base64StorageService.storeString(this.applicantId + documentId, {
    //   imageUrl: imageValue.imageUrl,
    //   imageType: imageValue.imageType,
    // });
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + imageValue.imageUrl;

  }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
          });
          console.log('downloadDocs', value);
        });
    });
  }

  async getLatLong() {
    /* Get latitude and longitude from mobile */

    return new Promise((resolve, reject) => {

      if (this.isMobile) {

        this.gpsService.getLatLong().subscribe((position) => {
          console.log("Mobile position", position);
          resolve(position);
        });

      } else {
        this.gpsService.getBrowserLatLong().subscribe((position) => {
          console.log("Browser position", position);
          if (position["code"]) {
            this.toasterService.showError(position["message"], "GPS Alert");
          }
          resolve(position);
        });
      }
    });
  }




}


