import { ApplicantService } from '@services/applicant.service';
import { DraggableContainerService } from '@services/draggable.service';
import { Base64StorageService } from '@services/base64-storage.service';
import { UploadService } from './../../../../services/upload.service';
import { GpsService } from './../../../../services/gps.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { StringifyOptions } from 'querystring';


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
  showModal:boolean;
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
              private draggableContainerService: DraggableContainerService,
              private applicantService: ApplicantService

          ) {
              this.sharedSercive.taskId$.subscribe((value) => {
                this.taskId = value;
              });
              this.isMobile = environment.isMobile;
              this.isMobile = true;
          }

   async ngOnInit() {
    this.initForm();
    this.getLabels();
    this.leadId = (await this.getLeadId()) as number;
    this.getLOV();
    // this.getPdDetails();
    this.getLeadSectiondata();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleType = this.roles[0].roleType;

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

    this.getRouteMap();
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
          console.log('APPLICANT_ID::', this.applicantId)
          console.log('VERSION::', this.version)
          // if (this.version !== 'undefined') {
          //   this.showSubmit = false;
          // }
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
        console.log("LEAD_ID::", value.leadId);
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
    });
  }

  // GET PD-DETAILS FOR APPLICANT_ID
  getPdDetails() {
    const data = {
      applicantId: this.applicantId,
      userId: localStorage.getItem('userId'),
      pdVersion: this.version,
    };
    console.log('REQUEST DATA VERSION::', this.version);
    this.personalDiscussionService.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.showReinitiate = value.ProcessVariables.showReinitiate;
        console.log('in other details show renitiate', this.showReinitiate);
        this.otherDetails = value.ProcessVariables.otherDetails;
        console.log('GET_OTHER_DETAILS:: ', this.otherDetails);
      }
        if(this.otherDetails) {
          this.setFormValue(); //SET_FORM_VALUES_ON_INITIALISATION
          this.pdDataService.setCustomerProfile(this.otherDetails);
        } 
    });
  }

  //PATCH_FORM_VALUES
  setFormValue() {
    // const otherDetailsFormModal = this.otherDetails || {};
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
    });
  }

  //SAVE_OR_UPDATE_OTHER-DETAILS
  saveOrUpdateOtherDetails() {
    this.formValues = this.otherDetailsForm.getRawValue();
    console.log("FORMVALUES::", this.formValues);
    this.formValues.date = this.formValues.date ? this.utilityService.convertDateTimeTOUTC(this.formValues.date, 'DD/MM/YYYY') : null;
    if (this.otherDetailsForm.valid === true) {
    const data = {
      leadId: this.leadId,
      applicantId: this.applicantId,
      userId: this.userId,
      otherDetails: this.formValues
    }
      this.personalDiscussionService.saveOrUpdatePdData(data).subscribe((res: any) => {
          const response = res.ProcessVariables;
          // console.log("RESPONSE_SAVEUPDATE_API::", response)
          if (res['ProcessVariables'] && res['ProcessVariables'].error['code'] == "0") {
            this.toasterService.showSuccess("Record Saved Successfully", "Other Details");
            }
        });
    } else {
      this.toasterService.showError("Please fill all mandatory fields.", "Other Details");
    }

  }
  
  // SUBMIT FORM
  onFormSubmit() {
    this.isDirty = true;
    this.saveOrUpdateOtherDetails();
  }

  submitToCredit() {
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
          this.router.navigate([`/pages/dashboard`]);
        } else {
          this.toasterService.showError(processVariables.error.message, '');
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showError('please enter required details', '');
      this.utilityService.validateAllFormFields(this.otherDetailsForm)
    }
  }

  reinitiatePd() {  // fun calling reinitiate fi report  api for reinitiating the respective fi report
    const data = {
      applicantId: this.applicantId,
      // applicantId: 1,
      userId: this.userId
    };
    this.personalDiscussionService.reinitiatePd(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      console.log('response reinitiate pd', processVariables);
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



  getLatLong() {
     /* Get latitude and longitude from mobile */
     if (this.isMobile) {
      this.gpsService.initLatLong().subscribe((res) => {
        if (res) {
          this.gpsService.getLatLong().subscribe((position) => {
          });
        } else {
          console.log(res);
        }
      });
    } else {
      this.gpsService.getBrowserLatLong().subscribe((position) => {
      });
    }
    this.getRouteMap();
  }

  getRouteMap() {
    var that = this;
    this.loginService.getPolyLine(function (result) {
      that.base64Image = result;
      // console.log("getPolyLine", that.base64Image);
    }, null, null);
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
      this.showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: this.showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    // this.setContainerPosition(el);
    this.showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: this.showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(this.applicantId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    });
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

  setContainerPosition(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    this.setCss = {
      top: offsetTop + 'px',
      left: offsetLeft + 'px',
    };
  }


  onUploadSuccess(event: DocumentDetails) {
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

    // const formArray = this.uploadForm.get(
    //   `${this.FORM_ARRAY_NAME}_${event.subCategoryCode}`
    // ) as FormArray;
    // formArray.at(this.selectedIndex).get('file').setValue(event.dmsDocumentId);
    let index = 0;
    if (this.documentArr.length === 0) {
      this.documentArr.push(event);
      index = 0;
    } 
    console.log('documentArr', this.documentArr);
   // this.individualImageUpload(event, index);
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
        this.documentArr[index].documentId = documentId;
        const subCategoryCode = this.documentArr[index].subCategoryCode;
        // const formArray = this.uploadForm.get(
        //   `${this.FORM_ARRAY_NAME}_${subCategoryCode}`
        // ) as FormArray;
        // formArray
        //   .at(this.documentArr[index].formArrayIndex)
        //   .get('documentId')
        //   .setValue(documentId);
        // console.log('this.documentArr', this.documentArr);
        // documentIds.forEach((id, index) => {
        //   this.documentArr[index].documentId = id;
        // });
        // this.documentArr.forEach((docs, index) => {
        //   const formArrayIndex = docs.formArrayIndex;
        //   if (formArrayIndex !== undefined) {
        //     const formArray = this.uploadForm.get(
        //       `${this.FORM_ARRAY_NAME}_${docs.subCategoryCode}`
        //     ) as FormArray;
        //     formArray
        //       .at(formArrayIndex)
        //       .get('documentId')
        //       .setValue(documentIds[index]);
        //   }
        // });
      });
  }

  

}
