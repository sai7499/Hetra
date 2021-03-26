import { ApplicantService } from '@services/applicant.service';
import { DraggableContainerService } from '@services/draggable.service';
import { Base64StorageService } from '@services/base64-storage.service';
import { UploadService } from './../../../../services/upload.service';
import { GpsService } from './../../../../services/gps.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { CommomLovService } from "@services/commom-lov-service";
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { Constant } from '../../../../../assets/constants/constant';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { DocRequest, DocumentDetails } from '@model/upload-model';
import { environment } from 'src/environments/environment';
import { LoginService } from '@modules/login/login/login.service';
import { LoanViewService } from '@services/loan-view.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {

  otherDetailsForm: FormGroup;
  fundingProgram: any;
  leadId;
  applicantId: any;
  version: any;
  labels: any = {};
  LOV: any = {};
  formValues: any = {};
  otherDetails: any;
  equitasBranchName: any;
  product: any;
  sourcingChannel: any;
  applicationNo: any;
  isDirty: boolean;
  showSubmit: boolean = true;
  userId: any;
  taskId: number;
  showReinitiate: boolean;
  roles: any;
  roleType: any;
  selectedDocDetails: DocRequest;
  showModal: boolean;
  isMobile: any;
  base64Image: any;

  PROFILE_TYPE = Constant.PROFILE_ALLOWED_TYPES;
  OTHER_DOCUMENTS_SIZE = Constant.OTHER_DOCUMENTS_SIZE;
  OTHER_DOCS_TYPE = Constant.OTHER_DOCUMENTS_ALLOWED_TYPES;

  SELFIE_IMAGE: string;

  setCss = {
    top: '',
    left: '',
  };

  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
  };

  documentArr: DocumentDetails[] = [];

  latitude: string = null;
  longitude: string = null;
  branchLatitude: string;
  branchLongitude: string;
  capturedAddress: string = null;
  custProfileDetails: {};
  showRouteMap: boolean;
  pdList: [];
  pdStatusValue: any;
  distanceFromBranch: any;

  // User defined fields
  udfScreenId: string = 'PDS004';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'PDG001';
  entityType: any;
  isNonInd: boolean;
  collateralId: any;

  disableSaveBtn: boolean;
  operationType: any;
  myModalCredit : boolean;
  modalDetails: any;
  modalButtons: any;

  constructor(
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private loginStoreService: LoginStoreService,
    private router: Router,
    private createLeadDataService: CreateLeadDataService,
    private aRoute: ActivatedRoute,
    private commomLovService: CommomLovService,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private personalDiscussionService: PersonalDiscussionService,
    private pdDataService: PdDataService,
    private sharedSercive: SharedService,
    private gpsService: GpsService,
    private loginService: LoginService,
    private uploadService: UploadService,
    private base64StorageService: Base64StorageService,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService,
    private applicantService: ApplicantService
  ) {
    this.sharedSercive.taskId$.subscribe((value) => {
      this.taskId = value;
    });
    this.isMobile = environment.isMobile;
  }

  async ngOnInit() {

    if (this.isMobile) {
      this.checkGpsEnabled();
    }

    this.initForm();
    this.getLabels();
    this.leadId = (await this.getLeadId()) as number;
    this.getLOV();
    this.getLeadSectiondata();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleType = this.roles[0].roleType;

    //this.udfScreenId = this.roleType === 1 ? 'PDS004' : 'PDS008';

    const docNm = 'PD REPORT';
    const docCtgryCd = 102;
    const docTp = 'Lead';
    const docSbCtgry = 'VF GENERATED DOCS';
    const docCatg = 'VF LOAN DOCS';
    const docCmnts = 'Addition of document for Applicant Creation';
    const docTypCd = 478;
    const docSbCtgryCd = 42;

    this.selectedDocDetails = {
      docSize: this.OTHER_DOCUMENTS_SIZE,
      docsType: this.PROFILE_TYPE,
      docNm,
      docCtgryCd,
      docTp,
      docSbCtgry,
      docCatg,
      bsPyld: "Base64 data of the image",
      docCmnts,
      docTypCd,
      flLoc: "",
      docSbCtgryCd,
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

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 1 ? udfScreenId.PD.otherPD : udfScreenId.DDE.otherPDDDE ;

    })

    this.labelsData.getModalDetails().subscribe((data)=>{
      const details = data.extPd.submitToCredit;
      this.modalDetails = details.modalDetails,
      this.modalButtons = details.modalButtons

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

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.aRoute.params.subscribe((value) => {    //GETTING APPLICANT_ID FROM ROUTES
          if (!value && !value.applicantId) {
            return;
          }
          this.applicantId = Number(value.applicantId);
          this.version = String(value.version);
          if (this.version !== 'undefined') {
            this.showSubmit = false;
          }
          this.getPdDetails();    // for getting the data for pd details on initializing the page
        });
      }, error => {
        console.log('ERROR::', error)
      }
    );
  }

  // GET LEADID FROM URL ROUTES
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.aRoute.parent.params.subscribe((value) => {
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
    this.fundingProgram = leadData['leadDetails'].fundingProgramDesc;
    this.sourcingChannel = leadData['leadDetails'].sourcingChannelDesc;
    this.equitasBranchName = leadData['leadDetails'].branchName;
    this.applicationNo = String(this.leadId);
    this.product = leadData['leadDetails'].productCatName;
    this.collateralId = leadData['vehicleCollateral'] ? leadData['vehicleCollateral'][0]['collateralId'] : 0;

    if (this.fundingProgram === 'CAT D') {
      this.otherDetailsForm.get('agricultureProof').enable(); //SET_VALIDATIONS
    } else {
      this.otherDetailsForm.get('agricultureProof').disable(); //DISABLE_FORMCONTROL_&&_VALIDATION
    }
  }

  //GET ALL LOVS
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  //FORMGROUP
  initForm() {
    this.otherDetailsForm = this.formBuilder.group({
      agricultureProof: ["", Validators.required],
      income: ["", Validators.required],
      securedLoans: ["", Validators.required],
      unsecuredLoans: ["", Validators.required],
      creditors: ["", Validators.required],
      debtors: ["", Validators.required],
      fixedAssets: ["", Validators.required],
      applicationNo: [{ value: '', disabled: true }],
      area: ["", Validators.required],
      place: ["", Validators.required],
      geoTagInfo: [""],
      routeMap: [""],
      equitasBranchName: [{ value: '', disabled: true }],
      distanceFromEquitas: [{ value: '', disabled: true }],
      pdOfficerName: ["", Validators.required],
      empCode: ["", Validators.required],
      date: ["", Validators.required],
      product: [{ value: '', disabled: true }],
      sourcingChannel: [{ value: '', disabled: true }],
      timeOfVerification: ["", Validators.required],
      loanAmount: ["", Validators.required],
      marginMoney: ["", Validators.required],
      emiAffordability: ["", Validators.required],
      sourceOfMarginMoney: [{ value: '', disabled: true }],
      bLatitude: [{ value: '', disabled: true }],
      bLongitude: [{ value: '', disabled: true }],
      latitude: [{ value: '', disabled: true }],
      longitude: [{ value: '', disabled: true }],
      capturedAddress: [{ value: '', disabled: true }]
    });
  }

  // GET PD-DETAILS FOR APPLICANT_ID
  getPdDetails() {
    const data = {
      applicantId: this.applicantId,
      userId: localStorage.getItem('userId'),
      pdVersion: this.version,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personalDiscussionService.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.showReinitiate = value.ProcessVariables.showReinitiate;
        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];
        this.otherDetails = value.ProcessVariables.otherDetails;
        this.branchLongitude = value.ProcessVariables.customerProfileDetails.branchLongitude
        this.branchLatitude = value.ProcessVariables.customerProfileDetails.branchLatitude;
        this.latitude = value.ProcessVariables.customerProfileDetails.latitude;
        this.longitude = value.ProcessVariables.customerProfileDetails.longitude;
        this.capturedAddress = value.ProcessVariables.customerProfileDetails.capturedAddress;
        this.SELFIE_IMAGE = value.ProcessVariables.profilePhoto;
      }
      if (this.otherDetails) {
        this.setFormValue(); //SsaveOrUpdateOtherDetailsET_FORM_VALUES_ON_INITIALISATION
        this.pdDataService.setCustomerProfile(this.otherDetails);
      }
      if (this.latitude) {
        this.getRouteMap();
      }
      this.operationType = this.toggleDdeService.getOperationType();
      if (this.operationType) {
        this.otherDetailsForm.disable();
        this.disableSaveBtn = true;
      }
  
      if (this.loanViewService.checkIsLoan360()) {
        this.otherDetailsForm.disable();
        this.disableSaveBtn = true;
      }
    });
  }

  //PATCH_FORM_VALUES
  setFormValue() {

    this.otherDetailsForm.patchValue({
      agricultureProof: this.otherDetails.agricultureProof || '',
      income: this.otherDetails.income || '',
      securedLoans: this.otherDetails.securedLoans || '',
      unsecuredLoans: this.otherDetails.unsecuredLoans || '',
      creditors: this.otherDetails.creditors || '',
      debtors: this.otherDetails.debtors || '',
      fixedAssets: this.otherDetails.fixedAssets || '',
      applicationNo: this.otherDetails.applicationNo || '',
      area: this.otherDetails.area || '',
      place: this.otherDetails.place || '',
      geoTagInfo: this.otherDetails.geoTagInfo || '',
      routeMap: this.otherDetails.routeMap || '',
      equitasBranchName: this.otherDetails.equitasBranchName || '',
      distanceFromEquitas: this.otherDetails.distanceFromEquitas || '',
      pdOfficerName: this.otherDetails.pdOfficerName || '',
      empCode: this.otherDetails.empCode || '',
      date: this.otherDetails.date ? this.utilityService.getDateFromString(this.otherDetails.date) : '',
      product: this.otherDetails.product || '',
      sourcingChannel: this.otherDetails.sourcingChannel || '',
      timeOfVerification: this.otherDetails.timeOfVerification || '',
      loanAmount: this.otherDetails.loanAmount || '',
      marginMoney: this.otherDetails.marginMoney || '',
      emiAffordability: this.otherDetails.emiAffordability || '',
      sourceOfMarginMoney: this.otherDetails.sourceOfMarginMoney || '',
      latitude: this.latitude || "",
      longitude: this.longitude || "",
      bLatitude: this.branchLatitude || "",
      bLongitude: this.branchLongitude || "",
      capturedAddress: this.capturedAddress || ""
    });
  }

  //SAVE_OR_UPDATE_OTHER-DETAILS
  async saveOrUpdateOtherDetails() {

    this.formValues = this.otherDetailsForm.getRawValue();
    this.formValues.date = this.formValues.date ? this.utilityService.convertDateTimeTOUTC(this.formValues.date, 'DD/MM/YYYY') : null;

    this.custProfileDetails = {
      latitude: this.latitude || '',
      longitude: this.longitude || '',
      capturedAddress: this.capturedAddress
    }

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.otherDetailsForm.valid && isUdfField) {
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        otherDetails: this.formValues,
        customerProfileDetails: this.custProfileDetails,
        profilePhoto: this.SELFIE_IMAGE,
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
      }
      this.personalDiscussionService.saveOrUpdatePdData(data).subscribe((res: any) => {
        const response = res.ProcessVariables;
        if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
          this.toasterService.showSuccess("Record Saved Successfully", "Other Details");
        } else {
          this.toasterService.showError(response['ProcessVariables'].error['message'], "Other Details");
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showError("Please fill all mandatory fields.", "Other Details");
      this.utilityService.validateAllFormFields(this.otherDetailsForm);
    }

  }

  // SUBMIT FORM
  onFormSubmit() {
    this.saveOrUpdateOtherDetails();
  }

  submitToCredit() {
    this.myModalCredit = false;
    if (this.otherDetailsForm.valid) {
      const data = {
        taskName: Constant.PDTASKNAME,
        leadId: this.leadId,
        userId: this.userId,
        taskId: this.taskId,
        applicantId: this.applicantId
      };
      this.personalDiscussionService.submitPdReport(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        if (processVariables.error.code === '0') {
          this.toasterService.showSuccess('submitted to credit successfully', '');
          // this.getPdList();
          if (processVariables.goToDashboard) {
            this.router.navigate([`/pages/dashboard`]);
          } else {
            this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
          }
          // this.router.navigate([`/pages/dashboard`]);
        } else {
          this.toasterService.showError(processVariables.error.message, '');
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showError('please enter required details', '');
      this.utilityService.validateAllFormFields(this.otherDetailsForm);
    }
  }
  getPdList() { // function to get all the pd report list respect to particular lead
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      leadId: this.leadId,
      userId: this.userId
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
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
      }
      if (n === arrayLength) {
        this.router.navigate([`/pages/dashboard`]);
      } else {
        this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
      }
    });
  }

  reinitiatePd() {  // fun calling reinitiate fi report  api for reinitiating the respective fi report
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1,
      userId: this.userId
    };
    this.personalDiscussionService.reinitiatePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('Report Reinitiated Successfully', '');
        this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
      } else {
        this.toasterService.showError('', 'message');

      }
    });
  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${this.applicantId}/reference-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/reference-details`]);
    }
  }

  onNext() {
    this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
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

  getRouteMap() {
    var that = this;
    let branchPos = {
      latitude: this.branchLatitude,
      longitude: this.branchLongitude
    };
    let currentPos = {
      latitude: this.latitude,
      longitude: this.longitude
    }

    this.loginService.getPolyLine(function (result, distance) {
      that.base64Image = result;
      that.showRouteMap = true;
      that.distanceFromBranch = distance;

      if (that.distanceFromBranch) {
        that.otherDetailsForm.get('distanceFromEquitas').setValue(that.distanceFromBranch);
        that.otherDetailsForm.get('distanceFromEquitas').updateValueAndValidity;
      } else {
        that.otherDetailsForm.get('distanceFromEquitas').setValue(null);
        that.otherDetailsForm.get('distanceFromEquitas').updateValueAndValidity;
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

  async onUploadSuccess(event: DocumentDetails) {
    this.showModal = false;
    this.SELFIE_IMAGE = 'data:image/jpeg;base64,' + event.imageUrl;
    const data = {
      inputValue: event.imageUrl,
      isPhoto: true,
      applicantId: this.applicantId,
    };

    event.imageUrl = '';
    event.associatedId = this.collateralId;
    event.associatedWith = "1";

    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    }
    this.individualImageUpload(event, index);

    let position = await this.getLatLong();
    if (position["latitude"]) {
      this.latitude = position["latitude"].toString();
      this.longitude = position["longitude"].toString();
      this.getRouteMap();
      this.otherDetailsForm.get("latitude").patchValue(this.latitude);
      this.otherDetailsForm.get("longitude").patchValue(this.longitude);

      var lat: number = +this.latitude;
      var lng: number = +this.longitude;
      this.loginService.geocode(new google.maps.LatLng(lat, lng)).subscribe((position) => {
        console.log("Position"+position[0].formatted_address);
        this.capturedAddress = position[0].formatted_address.toString();
        this.otherDetailsForm.get("capturedAddress").patchValue(this.capturedAddress);
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

  onSaveuserDefinedFields(val) {
    this.userDefineForm = val;
  }

}
