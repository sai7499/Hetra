import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantService } from '@services/applicant.service';
import { CommomLovService } from '@services/commom-lov-service';
import { DraggableContainerService } from '@services/draggable.service';
import { LabelsService } from '@services/labels.service';
import { RcuService } from '@services/rcu.service';
import { ToasterService } from '@services/toaster.service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';
import { Constant } from '@assets/constants/constant';
import { LoginStoreService } from '@services/login-store.service';
import { formatDate } from '@angular/common';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { Base64StorageService } from '@services/base64-storage.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
@Component({
  selector: 'app-rcu',
  templateUrl: './rcu.component.html',
  styleUrls: ['./rcu.component.css'],
})
export class RcuComponent implements OnInit {
  labels: any;
  isRcuDetails: boolean = true;
  leadId: number;
  userId: string;
  // applicantResponse: any;
  applicantId: any;
  applicantDetails: Array<any>;
  rcuLov: any = [];
  rcuDetailsForm: any;
  radioItems = [];
  childgroups = [];
  applicantType: any;
  showSave: boolean = false;
  errorGenerated: boolean = false;
  isErr: boolean = false
  model = { option: 'Screened' };
  // radioSel: any;
  // radioSelectedString: string;
  // documentDetails: any;
  submitted: boolean;
  // documentArray: FormArray;
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  // documents: any;
  applicantDocuments: any;
  // fileRCUStatus: any;
  screened: string;
  sampled: string;
  response: any;
  showColletralDocuments: boolean = false;
  collateralDocuments: any;
  // selectDocument: any;
  // rcuInitiated: boolean;
  today: any = new Date();
  showModal: boolean;
  selectedDocDetails: any;
  // dmsDocumentId: any;
  // currentUrl: string;
  roleId: any;
  roleType: any;
  todayDate: any;
  isInitiateScreen: boolean;
  errorMessage: string;
  isGetapiCalled: boolean = false;
  showBack: boolean = false;
  errMsg: any;
  // fiCumPdStatusString: string;
  fiCumPdStatus: boolean;

  isLoan360: boolean;
  taskId: any;

  leadData: any;
  setCss = {
    top: '',
    left: '',
  };

  apiValue: any;
  finalValue: any;

  // userDefineFields
  udfScreenId = 'RCS002';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'RCG001';

  jsonScreenId: any;
  rcuVersions: any;
  selectedRCUVersion: any;
  isReInitiate = true;

  constructor(
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private rcuService: RcuService,
    private createLeadDataService: CreateLeadDataService,
    private applicantService: ApplicantService,
    private commonLovService: CommomLovService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private uploadService: UploadService,
    private draggableContainerService: DraggableContainerService,
    private loginStoreService: LoginStoreService,
    private loanViewService: LoanViewService,
    public router: Router,
    private sharedService: SharedService,
    private base64StorageService: Base64StorageService,
    private objectComparisonService: ObjectComparisonService,
  ) {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
    });
    this.today = formatDate(
      this.today,
      'dd-MM-yyyy hh:mm:ss a',
      'en-US',
      '+0530'
    );
  }

  ngOnInit() {
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    const fiCumPdStatusString = (localStorage.getItem('isFiCumPd'));
    if (fiCumPdStatusString == 'false') {
      this.fiCumPdStatus = false
    } else if (fiCumPdStatusString == 'true') {
      this.fiCumPdStatus = true
    }
    this.getLabels();
    this.getLeadId();
    this.getLov();

    this.userId = localStorage.getItem('userId');
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadData = leadData;
    const leadSectionData = leadData as any;
    this.applicantId = leadSectionData.applicantDetails[0]['applicantId'];

    this.rcuDetailsForm = this.formBuilder.group({
      fileRCUStatus: [''],
      applicantId: [''],
      applicantType: [''],
      loanAmount: [''],
      vehicleMake: [''],
      vehicleModel: [''],
      vehicleNo: [''],
      rcuReportStatus: ['', Validators.required],
      rcuDocumentId: [''],
      rcuReportReceivedDateTime: this.getTodayDate(null),
      remarks: [''],
      applicantDocuments: this.formBuilder.array([]),
      collateralDocuments: this.formBuilder.array([]),
    });
    this.getApplicantList();

    this.labelsData.getScreenId().subscribe((data: any) => {
      this.jsonScreenId = data.ScreenIDS;
    })

    if (this.router.url.includes('/rcu') && this.roleType == '6') {
      this.isRcuDetails = false;
      this.isErr = true
      this.showSave = true
      this.showBack = false
      //  this.rcuInitiated = true
      this.getAllRcuDetails();
      this.udfScreenId = this.jsonScreenId.RCU.rcu;
      // this.rcuDetailsForm.disable()
      const applicantDoc = this.rcuDetailsForm.get('applicantDocuments') as FormArray
      
      console.log(applicantDoc.controls.length,'applicantDoc', applicantDoc)

    } else if (this.router.url.includes('/rcu') && this.roleType == '2') {

      // this.isErr = false
      // this.isRcuDetails = true;

      this.getAllRcuDetails();
      this.udfScreenId = this.jsonScreenId.DDE.rcuDDE;
      setTimeout(() => {
        this.rcuDetailsForm.disable()
        const applicantDoc = this.rcuDetailsForm.get('applicantDocuments') as FormArray;
        console.log(applicantDoc.controls.length,'applicantDoc', applicantDoc)
        for(var i = 0; i< applicantDoc.controls.length ; i++){
          applicantDoc.controls[i].get('dmsDocumentID').enable();
        }
        const collatralDoc = this.rcuDetailsForm.get('collateralDocuments') as FormArray;
        for (var i=0; i< collatralDoc.controls.length; i++) {
          collatralDoc.controls[i].get('dmsDocumentID').enable();
        }
        this.rcuDetailsForm.get('applicantId').enable({ emitEvent: false });
      })

      this.showSave = false
      this.showBack = true

      // this.rcuInitiated = false
      // this.getAllRcuDetails( this.rcuInitiated)
    }

    // this.assignRcuTask()
  }

  getTodayDate(today) {
    if (today != null && today != '') {
      return today;
    } else {
      let todayDate = this.today;
      return todayDate;

    }
  }

  showDocuments(check) {
    const selectDocument = check;
    if (check == 'applicant') {
      this.tab = 'tab1';
      this.showColletralDocuments = false;
    } else if (check == 'colletral') {
      this.tab = 'tab2';
      this.showColletralDocuments = true;
    }
    let event = this.rcuDetailsForm.controls.fileRCUStatus.value
    this.testRadio(event)
  }

  onSwitch(check) {
    switch (check) {
      case 1:
        return 'tab1';
      case 2:
        return 'tab2';
    }
  }
  private getRcuDocumentDetails(data?: any) {

    if (data === undefined) {
      // tslint:disable-next-line: prefer-for-of

      return this.formBuilder.group({
        categoryName: [''],
        dmsDocumentID: [''],
        documentName: [''],
        documentNo: [''],
        expiryDate: [''],
        issueDate: [''],
        screened: [''],
        sampled: [''],
        rcuStatus: [''],
      });
    } else {
      return this.formBuilder.group({
        categoryName: data.categoryName,
        dmsDocumentID: data.dmsDocumentID,
        documentName: data.documentName,
        documentNo: data.documentNo,
        expiryDate: this.utilityService.getDateFromString(data.expiryDate),
        issueDate: this.utilityService.getDateFromString(data.issueDate),
        screened: data.screened,
        sampled: data.sampled,
        rcuStatus: data.rcuStatus,
      });
    }
  }

  populateApplicantDocuments(event,applicantId?) {
    let getApplicant
    if(applicantId){
    getApplicant = this.applicantDetails.find(val => val.applicantId == applicantId)}
    event = event ? event : 'screened';
    this.rcuDetailsForm.patchValue({
      fileRCUStatus: event,
      loanAmount: this.response.loanAmount,
      applicantId: getApplicant ? getApplicant.applicantId :  this.response.applicantDetails[0].applicantId,
      applicantType: getApplicant ?getApplicant.applicantType: this.response.applicantDetails[0].applicantType,
      vehicleMake: this.response.vehicleMake,
      vehicleModel: this.response.vehicleModel,
      vehicleNo: this.response.vehicleNo,
      rcuReportStatus: this.response.rcuReportStatus,
      rcuUpload: this.response.rcuUpload,
      rcuDocumentId: this.response.rcuDocumentId,
      rcuReportReceivedDateTime: this.getTodayDate(
        this.response.rcuReportReceivedDateTime
      ),

      remarks: this.response.remarks,
    });
   
    if (this.applicantDocuments != null) {
      for (let i = 0; i < this.applicantDocuments.length; i++) {
        this.rcuDetailsForm.controls.applicantDocuments.push(
          this.getRcuDocumentDetails(this.applicantDocuments[i])
        );
      }
    }
    if (this.collateralDocuments != null) {
      for (let i = 0; i < this.collateralDocuments.length; i++) {
        this.rcuDetailsForm.controls.collateralDocuments.push(
          this.getRcuDocumentDetails(this.collateralDocuments[i])
        );
      }

      if (this.isLoan360) {
        this.rcuDetailsForm.disable();
      }
       return this.testRadio(event);
    }

    this.testRadio(event);
  }

  get f() { return this.rcuDetailsForm.controls }

  // getting labels from labels.json
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (data) => {
        this.labels = data;
      },
      (error) => { }
    );
  }

  //getting leadID from Pdd Dashboard
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }

  //getting LOV's from commonLovService
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.rcuLov.rcuStatus = value.LOVS.rcuStatus;
      this.rcuLov.status = value.LOVS.cibilStatus;

    });
  }

  getSelecteditem() {
    const radioSel = this.radioItems.find(
      (value) => value === this.model.option
    );
    const radioSelectedString = JSON.stringify(radioSel);
  }
  onItemChange(item) {
    this.getSelecteditem();
  }

  getAllRcuDetails(applicantId?) {

    const data = {
      applicantId: applicantId ? Number(applicantId): this.applicantId,
      rcuVersion: this.selectedRCUVersion ? this.selectedRCUVersion : null,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };
    this.rcuService.getRcuDetails(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
     
        this.isGetapiCalled = true;
        this.response = res.ProcessVariables;
        this.rcuVersions = res.ProcessVariables.versions.split(',');
        // console.log('RCU Versions', this.rcuVersions.sort((a,b) => {return a-b}));
        
        if (this.router.url.includes('/rcu') && this.roleType == '2' && this.response.rcuInitiated == true) {

          if (this.response.stage == "NotInitiated") {
            this.errorGenerated = true;
            this.errMsg = res.ProcessVariables.error.message;
          } else if (this.response.stage == "InProgress") {

            this.errorGenerated = true;
            this.errMsg = res.ProcessVariables.error.message;

          } else if (this.response.stage == "Completed") {
            this.isRcuDetails = false;
            this.isErr = true

          }

        } else if (this.router.url.includes('/rcu') && this.roleType == '2' && this.response.rcuInitiated == false) {
          this.isRcuDetails = true;
          this.isErr = true;

        }

        this.applicantDocuments = this.response.applicantDocuments;
        this.collateralDocuments = this.response.collateralDocuments;
        this.populateApplicantDocuments(this.response.fileRCUStatus,applicantId);
        // this.isGetapiCalled = false;
        this.apiValue = this.rcuDetailsForm.getRawValue();

        this.udfDetails = res.ProcessVariables.udfDetails ? res.ProcessVariables.udfDetails : [];

      } else if (res && res.ProcessVariables.error.code == '1') {
        this.isRcuDetails = true;
        this.isErr = true

      }

      if(this.roleType == '2') {
        this.rcuDetailsForm.disable()
          const applicantDoc = this.rcuDetailsForm.get('applicantDocuments') as FormArray;
          // console.log(applicantDoc.controls.length,'applicantDoc', applicantDoc)
          for(var i = 0; i< applicantDoc.controls.length ; i++){
            applicantDoc.controls[i].get('dmsDocumentID').enable();
          }
          const collatralDoc = this.rcuDetailsForm.get('collateralDocuments') as FormArray;
          for (var i=0; i< collatralDoc.controls.length; i++) {
            collatralDoc.controls[i].get('dmsDocumentID').enable();
          }
          this.rcuDetailsForm.controls.rcuDocumentId.enable();
      }
    });
  }

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
  }

  onSave() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.rcuDetailsForm.valid && this.userDefineForm.udfData.valid) {

      this.submitted = true;
      this.rcuDetailsForm.value.applicantDocuments.forEach((ele) => {
        ele.issueDate = this.utilityService.convertDateTimeTOUTC(
          ele.issueDate,
          'DD/MM/YYYY'
        );
        ele.expiryDate = this.utilityService.convertDateTimeTOUTC(
          ele.expiryDate,
          'DD/MM/YYYY'
        );
      });

      const data = {
        userId: this.userId,
        applicantDocuments: this.rcuDetailsForm.controls.applicantDocuments
          .getRawValue(),
        collateralDocuments: this.rcuDetailsForm.controls.collateralDocuments
          .getRawValue(),
        fileRCUStatus: this.rcuDetailsForm.controls.fileRCUStatus.value,
        applicantId: Number(this.rcuDetailsForm.controls.applicantId.value),
        applicantType: this.rcuDetailsForm.controls.applicantType.value,
        loanAmount: this.rcuDetailsForm.controls.loanAmount.value,
        vehicleMake: this.rcuDetailsForm.controls.vehicleMake.value,
        vehicleModel: this.rcuDetailsForm.controls.vehicleModel.value,
        vehicleNo: this.rcuDetailsForm.controls.vehicleNo.value,
        rcuReportStatus: this.rcuDetailsForm.controls.rcuReportStatus.value,
        rcuDocumentId: this.rcuDetailsForm.controls.rcuDocumentId.value,
        rcuReportReceivedDateTime: this.rcuDetailsForm.controls
          .rcuReportReceivedDateTime.value,
        remarks: this.rcuDetailsForm.controls.remarks.value,
        udfDetails: [
          {
            "udfGroupId": this.udfGroupId,
            // "udfScreenId": this.udfScreenId,
            "udfData": JSON.stringify(this.userDefineForm.udfData.getRawValue())
          }
        ]
      };
      this.rcuService.saveUpdateRcuDetails(data).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
          let rcuFormApplicantControls = this.rcuDetailsForm.controls
            .applicantDocuments as FormArray;
          rcuFormApplicantControls.controls = [];
          // tslint:disable-next-line: prefer-const
          let rcuFormColletralControls = this.rcuDetailsForm.controls
            .collateralDocuments as FormArray;
          rcuFormColletralControls.controls = [];
          this.toasterService.showSuccess(
            'Updated Successfully',
            'RCU Details'
          );
        this.apiValue = this.rcuDetailsForm.getRawValue();
          this.getAllRcuDetails();
        }
      });
    } else {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'RCU Details'
      );
      return;

    }
  }

  onSubmit() {
    // this.onSave();
    // this.submitted = true;
    this.finalValue = this.rcuDetailsForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);

    if(this.rcuDetailsForm.invalid || this.userDefineForm.udfData.invalid) {
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }
    if(!isValueCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    const body = {
      leadId: this.leadId,
      userId: this.userId,
      taskId: this.taskId
    }
    this.rcuService.stopRcuTask(body).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == "0") {
        this.toasterService.showSuccess("RCU Lead Is Successfully Submitted ", "RCU Details");
        this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'RCU Details');
      }
    })
    // const body = {
    //   leadId: this.leadId,
    //   userId: this.userId,
    //   taskId: this.taskId
    // }
    // this.rcuService.stopRcuTask(body).subscribe((res: any) => {
    //   if (res && res.ProcessVariables.error.code == "0") {
    //     this.toasterService.showSuccess("RCU Lead Is Successfully Submitted ", "RCU Details");
    //     this.router.navigateByUrl('/pages/dashboard');
    //   } else {
    //     this.toasterService.showError(res['ProcessVariables'].error['message'], 'RCU Details');
    //   }
    // })
  }

  testRadio(event) {

    console.log(this.response.fileRCUStatus);
    const fileRCUStatus = this.response.fileRCUStatus;
    
    if (event == 'screened' && this.applicantDocuments != null && this.isGetapiCalled == true 
      && this.showColletralDocuments == false) {
      this.screened = '0';
      this.sampled = '1';
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.applicantDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.applicantDocuments
          .controls as FormArray;
          if(fileRCUStatus !== event) { 
            control[i].patchValue({
              screened: '0',
              sampled: '1',
            });
          } else {
            control[i].patchValue({
              screened: this.applicantDocuments[i].screened ? this.applicantDocuments[i].screened : '0',
              sampled: this.applicantDocuments[i].sampled ? this.applicantDocuments[i].sampled : '1',
            });
          }
        
        if (this.roleType == '6') {
          control[i].controls.screened.enable();
          control[i].controls.sampled.disable();
        }

      }
    } else if (event == 'screened' && this.collateralDocuments != null && this.isGetapiCalled == true 
      && this.showColletralDocuments == true) {
      this.screened = '0';
      this.sampled = '1';
      // tslint:disable-next-line: prefer-for-of
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.collateralDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.collateralDocuments
          .controls as FormArray;

          if(fileRCUStatus !== event) { 
            control[i].patchValue({
              screened: '0',
              sampled: '1',
            });
          } else {
            control[i].patchValue({
              screened: this.collateralDocuments[i].screened ? this.collateralDocuments[i].screened : '0',
              sampled: this.collateralDocuments[i].sampled ? this.collateralDocuments[i].sampled : '1',
            });
          }

        
        if (this.roleType == '6') {
          control[i].controls.screened.enable();
          control[i].controls.sampled.disable();
        }
      }
    } else if (event == 'sampled' && this.applicantDocuments != null && this.isGetapiCalled == true && this.showColletralDocuments == false) {
      this.screened = '1';
      this.sampled = '0';
      // tslint:disable-next-line: prefer-for-of
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.applicantDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.applicantDocuments
          .controls as FormArray;
          console.log(control);
          if(fileRCUStatus !== event) {
            control[i].patchValue({
              screened:  '1',
              sampled:  '0',
            })
          } else {
            control[i].patchValue({
              screened: this.applicantDocuments[i].screened ? this.applicantDocuments[i].screened : '1',
              sampled: this.applicantDocuments[i].sampled ? this.applicantDocuments[i].sampled : '0',
            })
          }
        
        if (this.roleType == '6') {
          control[i].controls.sampled.enable();
          control[i].controls.screened.disable();
        }
      }
    } else if (event == 'sampled' && this.collateralDocuments != null && this.isGetapiCalled == true && this.showColletralDocuments == true) {
      this.screened = '1';
      this.sampled = '0';
      // tslint:disable-next-line: prefer-for-of
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.collateralDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.collateralDocuments
          .controls as FormArray;

          if(fileRCUStatus !== event) {
            control[i].patchValue({
              screened:  '1',
              sampled:  '0',
            })
          } else {
            control[i].patchValue({
              screened: this.collateralDocuments[i].screened ? this.collateralDocuments[i].screened : '1',
              sampled: this.collateralDocuments[i].sampled ? this.collateralDocuments[i].sampled : '0',
            })
          }
        if (this.roleType == '6') {
          control[i].controls.sampled.enable();
          control[i].controls.screened.disable();
        }
      }
    } else if (event == 'screened' && this.collateralDocuments != null && this.isGetapiCalled == false && this.showColletralDocuments == true) {
      this.screened = '0';
      this.sampled = '1';
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.collateralDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.collateralDocuments
          .controls as FormArray;
        control[i].patchValue({
          screened: this.collateralDocuments[i].screened ? this.collateralDocuments[i].screened : '0',
          sampled: this.collateralDocuments[i].sampled ? this.collateralDocuments[i].sampled : '1',
        });
        if (this.roleType == '6') {
          control[i].controls.screened.enable();
          control[i].controls.sampled.disable();
        }
      }
    } else if (event == 'screened' && this.applicantDocuments != null && this.isGetapiCalled == false && this.showColletralDocuments == false) {
      this.screened = '0';
      this.sampled = '1';
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.applicantDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.applicantDocuments
          .controls as FormArray;
        control[i].patchValue({
          screened: '0',
          sampled: '1',
        });
        if (this.roleType == '6') {
          control[i].controls.screened.enable();
          control[i].controls.sampled.disable();
        }
      }
    } else if (event == 'sampled' && this.collateralDocuments != null && this.isGetapiCalled == false && this.showColletralDocuments == true) {
      this.screened = '1';
      this.sampled = '0';
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.collateralDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.collateralDocuments
          .controls as FormArray;
          if(this.roleType == '6') {
            control[i].patchValue({
              screened: '1',
              sampled: '0',
            });
          } else {
            control[i].patchValue({
              screened: this.collateralDocuments[i].screened ? this.collateralDocuments[i].screened : '1',
              sampled: this.collateralDocuments[i].sampled ? this.collateralDocuments[i].sampled : '0',
            });
          }
        
        if (this.roleType == '6') {
          control[i].controls.sampled.enable();
          control[i].controls.screened.disable();
        }
      }
    } else if (event == 'sampled' && this.applicantDocuments != null && this.isGetapiCalled == false && this.showColletralDocuments == false) {
      this.screened = '1';
      this.sampled = '0';
      for (
        let i = 0;
        i < this.rcuDetailsForm.controls.applicantDocuments.length;
        i++
      ) {
        const control = this.rcuDetailsForm.controls.applicantDocuments
          .controls as FormArray;
          if(this.roleType == '6') {
            control[i].patchValue({
              screened: '1',
              sampled: '0',
            });
          } else {
            control[i].patchValue({
              screened: this.applicantDocuments[i].screened ? this.applicantDocuments[i].screened : '1',
              sampled: this.applicantDocuments[i].sampled ? this.applicantDocuments[i].sampled : '0',
            });
          }
        
        if (this.roleType == '6') {
          control[i].controls.sampled.enable();
          control[i].controls.screened.disable();
        }
      }
    }
    console.log("testing all", this.collateralDocuments !== null, this.applicantDocuments !== null, this.isGetapiCalled, this.showColletralDocuments);
    
  }

  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantDetails = processVariables.applicantListForLead;
    });
  }

  onRcuApplicantChange(event, i?: number) {

    // tslint:disable-next-line: triple-equals
    const applicantType = this.applicantDetails.find(
      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    this.rcuDetailsForm.get('applicantType').setValue(applicantType);
    let rcuFormApplicantControls = this.rcuDetailsForm.controls
    .applicantDocuments as FormArray;
  rcuFormApplicantControls.controls = [];
  // tslint:disable-next-line: prefer-const
  let rcuFormColletralControls = this.rcuDetailsForm.controls
    .collateralDocuments as FormArray;
  rcuFormColletralControls.controls = [];
    this.getAllRcuDetails(event);
  }

  onRcuVersionChange(event) {
    console.log('event', event);
    this.selectedRCUVersion = event;
    let rcuFormApplicantControls = this.rcuDetailsForm.controls
            .applicantDocuments as FormArray;
          rcuFormApplicantControls.controls = [];
          // tslint:disable-next-line: prefer-const
          let rcuFormColletralControls = this.rcuDetailsForm.controls
            .collateralDocuments as FormArray;
          rcuFormColletralControls.controls = [];
    this.getAllRcuDetails();
    
  }
  assignRcuTask() {
    this.isInitiateScreen = false;
    this.isRcuDetails = true;

    const data = {
      leadId: this.leadId,
      userId: this.userId,
    };

    this.rcuService.assignRcuTask(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        // this.isRcuDetails = false
      } else {
        // this.isRcuDetails = true
      }
      this.getAllRcuDetails();

      // const processVariables = value.ProcessVariables;
      // this.applicantDetails = processVariables.applicantListForLead;
    });
  }

  // to View uploaded Document
  getBase64String(dmsDocumentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(dmsDocumentId)
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

  clickForLoan360(name, index?) {

    console.log('clicked');
    
    

    let docId;

    if (!index && !name) {
      docId = this.rcuDetailsForm.get('rcuDocumentId').value;
    } else if (name === 'collateralDocuments') {
      const formArray = this.rcuDetailsForm.controls.collateralDocuments.controls as FormArray;
      docId = formArray[index].get('dmsDocumentID').value;
    } else if (name === 'applicantDocuments') {
      const formArray = this.rcuDetailsForm.controls.applicantDocuments.controls as FormArray;
      docId = formArray[index].get('dmsDocumentID').value;
    }

    if (this.isLoan360) {
      this.downloadDocs(docId);
    } else {
      return;
    }
  }

  //for document
  async downloadDocs(event) {

    console.log('event', event);
    

    // let el = event.srcElement;
    // const dmsDocumentID: any = await this.getBase64String(event);

    // const showDraggableContainer = {
    //   imageUrl: dmsDocumentID.imageUrl,
    //   imageType: dmsDocumentID.imageType,
    // };
    // this.draggableContainerService.setContainerValue({
    //   image: showDraggableContainer,
    // });

    // if (dmsDocumentID.imageType.includes('xls')) {
    //   this.getDownloadXlsFile(dmsDocumentID.imageUrl, dmsDocumentID.documentName, 'application/vnd.ms-excel');
    //   return;
    // }
    // if (dmsDocumentID.imageType.includes('doc')) {
    //   this.getDownloadXlsFile(dmsDocumentID.imageUrl, dmsDocumentID.documentName, 'application/msword');
    //   return;
    // }

    this.downloadDocsCheck(event)

  }

  async downloadDocsCheck(documentId) {
    let el = documentId.srcElement;

    if (!documentId) {
      return;
    }

    let collateralId = this.leadData['vehicleCollateral'] ? this.leadData['vehicleCollateral'][0] : this.leadData['applicantDetails'][0];

    if (!collateralId) {
      return;
    }

    const bas64String = this.base64StorageService.getString(
      collateralId.collateralId + documentId
    );
    if (bas64String) {
      this.setContainerPosition(el);
      let showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    if (imageValue.imageType.includes('xls')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/vnd.ms-excel');
      return;
    }
    if (imageValue.imageType.includes('doc')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/msword');
      return;
    }
    this.setContainerPosition(el);
    let showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(collateralId.collateralId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
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

  getDownloadXlsFile(base64: string, fileName: string, type) {
    const contentType = type;
    const blob1 = this.base64ToBlob(base64, contentType);
    const blobUrl1 = URL.createObjectURL(blob1);

    setTimeout(() => {

      const a: any = document.createElement('a');
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = blobUrl1;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(blobUrl1);
    });
  }

  base64ToBlob(b64Data, contentType, sliceSize?: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  uploadDoc() {
    this.showModal = true;
    const docNm = 'ACCOUNT_OPENING_FORM';
    const docCtgryCd = 70;
    const docTp = 'LEAD';
    const docSbCtgry = 'ACCOUNT OPENING FORM';
    const docCatg = 'KYC - I';
    const docCmnts = 'Addition of document for Lead Creation';
    const docTypCd = 276;
    const docSbCtgryCd = 204;

    this.selectedDocDetails = {
      docSize: 2097152,
      docsType: Constant.OTHER_DOCUMENTS_ALLOWED_TYPES,
      docNm,
      docCtgryCd,
      docTp,
      docSbCtgry,
      docCatg,
      docCmnts,
      docTypCd,
      docSbCtgryCd,
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
  }

  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    // this.dmsDocumentId = event.dmsDocumentId,
    this.rcuDetailsForm.patchValue({
      rcuDocumentId: event.dmsDocumentId,
    });
    // for (let i = 0; i < this.rcuDetailsForm.controls.collateralDocuments.length; i++) {
    //   const control = this.rcuDetailsForm.controls.collateralDocuments.controls as FormArray
    //   control[i].patchValue({
    //     rcuDocumentID: this.dmsDocumentId,

    //   })
    // }
    // this.rcuDetailsForm.controls.collateralDocuments.controls.at[0].controls.dmsDocumentId.setValue(this.dmsDocumentId)
  }

  showInitiateTask() {
    this.isInitiateScreen = true;
    this.errorMessage = 'Are you sure you want to initiate RCU?';
  }

  errGenerated() {
    this.errorGenerated = false
    this.isErr = false
  }

  onNext() {
    if (this.fiCumPdStatus == false) {
      this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
    } else if (this.fiCumPdStatus == true) {
      this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);

    }
  }

  onReInitiate() {
    // this.assignRcuTask();
    const data = {
      leadId: this.leadId,
      userId: this.userId,
    };

    this.rcuService.reInitiateRCU(data).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess("RCU Lead Is ReInitiated Successfully ", "RCU Details");
        this.isReInitiate = false;
    this.errorGenerated = true;
        // this.router.navigateByUrl('/pages/dashboard');
      } else {
        this.toasterService.showError(res['ProcessVariables'].error['message'], 'RCU Details');
      }
    });
  }
}
