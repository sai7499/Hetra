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
import { CommomLovService } from '@services/commom-lov-service';
import { LoanViewService } from '@services/loan-view.service';
import { FicumpdPdfService } from '@services/ficumpd-pdf.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { PdDataService } from '../pd-data.service';

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
  capturedAddress: string = null;
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
  indexFromHtml: number;
  isLoan360: boolean;

  // userDefineFields
  udfScreenId = 'FPS004';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'FPG001';
  initUDFValues: any;
  editedUDFValues: any;
  entityType: any;
  isNonInd: boolean;

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
    private loanViewService: LoanViewService,
    private ficumpdPdfService: FicumpdPdfService,
    private objectComparisonService: ObjectComparisonService,
    private pdDataService : PdDataService

  ) {
    this.listArray = this.fb.array([]);
    this.sharedSercive.taskId$.subscribe((value) => {
      this.taskId = value;
    });
    this.isMobile = environment.isMobile;
  }

  async ngOnInit() {

    this.isLoan360 = this.loanViewService.checkIsLoan360();

    this.checkGpsEnabled();

    if (this.router.url.includes('/pd-dashboard')) {
      this.show = false;
    }
    this.sysTimeOfVerification = this.stringTime[0] + ':' + this.stringTime[1];

    // accessing lead id from route

    this.leadId = (await this.getLeadId()) as number;

    // calling login store service to retrieve the user data

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.userDetails = roleAndUserDetails.userDetails;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    this.userName = this.userDetails.firstName;

    //this.udfScreenId = this.roleType === 1 ? 'FPS004' : 'FPS008';

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
        });
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

      if (this.loanViewService.checkIsLoan360()) {
        this.referenceCheckForm.disable();
        this.disableSaveBtn = true;
      }
    });

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 1 ? udfScreenId.FICUMPD.applicantReferenceFIcumPD : udfScreenId.DDE.referenceCheckFIcumPDDDE ;

    })

    this.entityType = this.pdDataService.getFiCumPdApplicantType();
      if(this.entityType !== 'Individual'){
        this.isNonInd = true
      }else{
        this.isNonInd = false
      }
  }

  async checkGpsEnabled() {
    this.gpsService.getLatLong().subscribe((position) => {
      this.gpsService.initLatLong().subscribe((res) => {
        if (res) {
          this.gpsService.getLatLong().subscribe((position) => {
          });
        }
      });
    });
  }

  getLeadId() { // function to access respective lead id from the routing
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  // GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.serviceSourcingChannel = leadData['leadDetails'].sourcingChannelDesc;
    this.serviceEquitasBranchName = leadData['leadDetails'].branchName;
    this.serviceProductCat = leadData['leadDetails'].productCatName;
    this.serviceAppNo = leadData['leadDetails'].applicationNo;
    const leadDetailsFromLead = leadData['leadDetails'];
    this.productCatCode = leadDetailsFromLead.productCatCode;

    for (const value of leadData['applicantDetails']) {
      if (value['applicantId'] === this.applicantId) {
        const applicantDetailsFromLead = value;
        this.applicantType = applicantDetailsFromLead['applicantTypeKey']
      }
    }
  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  getApplicantId() { // function to access respective applicant id from the routing
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
    });
  }

  initForm() {  // function that intializes the form group

    this.referenceCheckForm = this.fb.group({
      nameOfReference: new FormControl('', Validators.required),
      addressOfReference: new FormControl('', Validators.required),
      referenceMobile: new FormControl(''),
      overallFiReport: new FormControl('', Validators.required),
      negativeProfile: new FormControl('', Validators.required),
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
      area: new FormControl(''),
      date: new FormControl({ value: '', disabled: true }),
      place: new FormControl({ value: '', disabled: true }),
      timeOfVerification: new FormControl({ value: '', disabled: true }),
      latitude: new FormControl({ value: '', disabled: true }),
      longitude: new FormControl({ value: '', disabled: true }),
      bLatitude: new FormControl({ value: '', disabled: true }),
      bLongitude: new FormControl({ value: '', disabled: true }),
      capturedAddress: new FormControl({ value: '', disabled: true }),
      marketFinRefData: this.listArray
    });
  }

  removeReferenceControls() {
    const controls = this.referenceCheckForm as FormGroup;
    if ((this.productCatCode !== 'NCV') || (this.productCatCode === 'NCV' && this.applicantType !== 'APPAPPRELLEAD')) {
      controls.removeControl('marketFinRefData');
    }
  }

  public populateRowData(rowData) {
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
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.refCheckDetails = value.ProcessVariables.referenceCheck;
        this.otherDetails = value.ProcessVariables.otherDetails;
        this.showReinitiate = value.ProcessVariables.showReinitiate;

        this.branchLongitude = value.ProcessVariables.customerProfileDetails.branchLongitude;
        this.branchLatitude = value.ProcessVariables.customerProfileDetails.branchLatitude;
        this.latitude = value.ProcessVariables.customerProfileDetails.latitude;
        this.longitude = value.ProcessVariables.customerProfileDetails.longitude;
        this.capturedAddress = value.ProcessVariables.customerProfileDetails.capturedAddress;
        this.SELFIE_IMAGE = value.ProcessVariables.profilePhoto;
        const referenceDetails = processVariables.marketFinRefData;
        this.ficumpdPdfService.setReferenceCheckDetails(value.ProcessVariables);

        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];

        if (referenceDetails != null && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
          this.populateData(value);
        } else if (referenceDetails == null && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
          const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
          control.push(this.initRows(null));
        }
        this.setFormValue();
        if (this.latitude) {
          this.getRouteMap();
        }
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
    const control = this.referenceCheckForm.controls.marketFinRefData as FormArray;
    // tslint:disable-next-line: prefer-const
    let referenceId = references[index].id;
    let i = 0;
    let j = 0;
    references.forEach(element => {
      if (element.typeReference === 'FINREFREFERNS') {
        i = i + 1;
      } else if (element.typeReference === 'MKTREFREFERNS') {
        j = j + 1;
      }
    });
    if (references.length > 2) {
      const data = {
        id: referenceId
      };
      if ((referenceId !== 0 && i > 1 && j === 1) && (references[index].typeReference === 'MKTREFREFERNS')) {
        this.toasterService.showError(' atleast one market reference is required', '');

      } else if ((referenceId !== 0 && i === 1 && j > 1) && (references[index].typeReference === 'FINREFREFERNS')) {
        this.toasterService.showError(' atleast one finance reference is required', '');
      } else if ((referenceId !== 0) && (i > 1 || j > 1)) {
        this.personalDiscussion.deleteMarFinReference(data).subscribe((res: any) => {
          const processVariables = res.ProcessVariables;
          const message = processVariables.error.message;
          if (processVariables.error.code === '0') {
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
    } else if (referenceId !== 0 && (i === 1 && j === 1)) {
      this.toasterService.showError('atleast one market and finance reference required', '');
    }
  }

  delete(index: number) {
    this.indexFromHtml = index;
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
    } else {
      this.applicationNo = this.serviceAppNo;
      this.productCat = this.serviceProductCat;
      this.sourcingChannel = this.serviceSourcingChannel;
      this.equitasBranchName = this.serviceEquitasBranchName;
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
      soName: this.soName ? this.soName : null,
      employeeCode: this.employeeCode ? this.employeeCode : null,
      product: this.productCat ? this.productCat : null,
      sourcingChannel: this.sourcingChannel ? this.sourcingChannel : null,
      routeMap: otherDetailsModel.routeMap ? otherDetailsModel.routeMap : null,
      equitasBranchName: this.equitasBranchName ? this.equitasBranchName : null,
      distanceFromEquitas: otherDetailsModel.distanceFromEquitas ? otherDetailsModel.distanceFromEquitas : null,
      date: this.date ? this.date : null,
      area: otherDetailsModel.area ? otherDetailsModel.area : null,
      place: otherDetailsModel.place ? otherDetailsModel.place : null,
      timeOfVerification: this.time ? this.time : null,
      latitude: this.latitude || "",
      longitude: this.longitude || "",
      bLatitude: this.branchLatitude || "",
      bLongitude: this.branchLongitude || "",
      capturedAddress: this.capturedAddress || ""
    });
  }

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
    if(event.event === 'init'){
      this.initUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    }
  }

  onFormSubmit(references: any) { // function that calls sumbit pd report api to save the respective pd report
    if (this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
      const referenceArray = (this.referenceCheckForm.value.marketFinRefData as FormArray);

      for (let i = 0; i < referenceArray.length; i++) {
        referenceArray[i]['typeReference'] = referenceArray[i]['typeReference'];
        referenceArray[i]['companyName'] = referenceArray[i]['companyName'];
        referenceArray[i]['officerName'] = referenceArray[i]['officerName'];
        referenceArray[i]['designation'] = referenceArray[i]['designation'];
        referenceArray[i]['teleNo'] = referenceArray[i]['teleNo'];
        referenceArray[i]['comments'] = referenceArray[i]['comments'];
      }
      this.referenceCheckForm.value.marketFinRefData = referenceArray;

      let i = 0;
      let j = 0;
      references.forEach(element => {
        if (element.typeReference === 'FINREFREFERNS') {
          i = i + 1;
        } else if (element.typeReference === 'MKTREFREFERNS') {
          j = j + 1;
        }
      });
      if (i >= 1 && j >= 1) {
        this.allowSave = true;
      }
      this.marketAndFinReferenceDetails = referenceArray;
    }

    this.custProfileDetails = {
      latitude: this.latitude || '',
      longitude: this.longitude || '',
      capturedAddress: this.capturedAddress
    };
    const formModel = this.referenceCheckForm.value;

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.referenceCheckForm.valid && isUdfField) {

      if (this.allowSave !== true && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
        this.toasterService.showWarning('atleast one market and finance reference required', '');
        return;
      }

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

      this.otherDetails = {

        applicationNo: this.applicationNo ? this.applicationNo : null,
        product: this.productCat ? this.productCat : null,
        sourcingChannel: this.sourcingChannel ? this.sourcingChannel : null,
        routeMap: referenceCheckModel.routeMap ? referenceCheckModel.routeMap : null,
        equitasBranchName: this.equitasBranchName ? this.equitasBranchName : null,
        distanceFromEquitas: this.distanceFromBranch ? this.distanceFromBranch : null,
        date: this.date ? this.utilityService.getDateFormat(this.date) : null,
        area: referenceCheckModel.area ? referenceCheckModel.area : null,
        place: referenceCheckModel.place ? referenceCheckModel.place : null,
        timeOfVerification: this.time ? this.time : null,
        pdOfficerName: this.soName ? this.soName : null
      };

      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        referenceCheck: this.refCheckDetails,
        otherDetails: this.otherDetails,
        customerProfileDetails: this.custProfileDetails,
        profilePhoto: this.SELFIE_IMAGE,
        marketFinRefData: this.marketAndFinReferenceDetails,
        udfDetails: [
          {
            "udfGroupId": this.udfGroupId,
            // "udfScreenId": this.udfScreenId,
            "udfData": JSON.stringify(
              this.userDefineForm && this.userDefineForm.udfData ?
                this.userDefineForm.udfData.getRawValue() : {}
            )
          }
        ]
      };

      this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.listArray.controls = [];
          this.initUDFValues = this.userDefineForm.udfData.getRawValue();
          this.getPdDetails();
        } else {
          this.toasterService.showError('ivalid save', 'message');
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showWarning('please enter required details', '');
    }
  }

  approvePd() { // function that calls approve pd report api for approving pd report
    const data = {
      applicantId: this.applicantId,
      userId: this.userId
    };
    this.personalDiscussion.approvePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
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
      userId: this.userId
    };
    this.personalDiscussion.reinitiatePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('pd report reinitiated successfully', '');
        this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
      } else {
        this.toasterService.showError('', 'message');
      }
    });
  }

  submitToCredit() { // fun calling submit to credit api for submitting pd report
    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    this.isDirty = true;
    if (this.referenceCheckForm.invalid || isUDFInvalid) {
      this.toasterService.showWarning('please enter required details', '');
      return;
    }
    if (!isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }

    const data = {
      taskName: Constant.PDTASKNAME,
      leadId: this.leadId,

      userId: this.userId,
      taskId: this.taskId,
      applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */
    };

    this.personalDiscussion.submitPdReport(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('submitted to credit successfully', '');
        this.totalApplicantCount = processVariables.applicantCount;
        this.submittedApplicantCount = processVariables.notSubmittedApplicantId;
        if (processVariables.goToDashboard) {
          this.router.navigate([`/pages/dashboard`]);
        } else {
          this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
        }
      } else {
        this.toasterService.showError(processVariables.error.message, '');
      }
    });
  }

  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      leadId: this.leadId,
      userId: this.userId
    };

    this.personalDiscussion.getPdList(data).subscribe((value: any) => {
      const processvariables = value.ProcessVariables;
      this.pdList = processvariables.finalPDList;
      const arrayLength = this.pdList.length;
      let n = 0;
      for (var i in this.pdList) {
        this.pdStatusValue = this.pdList[i]['pdStatusValue']
        if (this.pdList[i]['pdStatusValue'] == "Submitted") {
          n = n + 1;
        }
      }
      if (n === arrayLength) {
        this.router.navigate([`/pages/dashboard`]);
      } else {
        this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
      }
    });
  }

  onNavigateToPdSummary() { // fun to navigate to pd summary
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
    } else {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
    }
  }

  onNavigateBack() { // fun to navigate to back page
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details`]);
    }
  }

  async onUploadSuccess(event: DocumentDetails) {
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    const data = {
      inputValue: event.imageUrl,
      isPhoto: true,
      applicantId: this.applicantId,
    };

    event.imageUrl = '';

    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    }
    this.individualImageUpload(event, index);

    const position = await this.getLatLong();
    if (position["latitude"]) {
      this.latitude = position["latitude"].toString();
      this.longitude = position["longitude"].toString();
      this.getRouteMap();
      this.referenceCheckForm.get("latitude").patchValue(this.latitude);
      this.referenceCheckForm.get("longitude").patchValue(this.longitude);
      var lat: number = +this.latitude;
      var lng: number = +this.longitude;
      this.loginService.geocode(new google.maps.LatLng(lat, lng)).subscribe((position) => {
        console.log("Position"+position[0].formatted_address);
        this.capturedAddress = position[0].formatted_address.toString();
        this.referenceCheckForm.get("capturedAddress").patchValue(this.capturedAddress);
      });
  

    } else {
      this.latitude = "";
      this.longitude = "";
      this.showRouteMap = false;
      this.toasterService.showError(position["message"], "GPS Alert");
    }

  }

  uploadPhotoOrSignature(data) {
    this.applicantService.uploadPhotoOrSignature(data).subscribe((value) => {
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
        const processVariables = value.ProcessVariables;
        const documentId = processVariables.documentIds[0];
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
      if (that.distanceFromBranch) {
        that.referenceCheckForm.get('distanceFromEquitas').setValue(that.distanceFromBranch);
        that.referenceCheckForm.get('distanceFromEquitas').updateValueAndValidity;
      } else {
        that.referenceCheckForm.get('distanceFromEquitas').setValue(null);
        that.referenceCheckForm.get('distanceFromEquitas').updateValueAndValidity;
      }
    }, currentPos, branchPos);
  }

  async downloadDocs(documentId: string) {

    if (!documentId) {
      return;
    }
    const bas64String = this.base64StorageService.getString(
      this.applicantId + documentId
    );
    if (bas64String) {
      this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + bas64String.imageUrl;
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
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
        });
    });
  }

  async getLatLong() {
    /* Get latitude and longitude from mobile */
    return new Promise((resolve, reject) => {

      if (this.isMobile) {
        this.gpsService.getLatLong().subscribe((position) => {
          resolve(position);
        });

      } else {
        this.gpsService.getBrowserLatLong().subscribe((position) => {
          if (position["code"]) {
            this.toasterService.showError(position["message"], "GPS Alert");
          }
          resolve(position);
        });
      }
    });
  }

}