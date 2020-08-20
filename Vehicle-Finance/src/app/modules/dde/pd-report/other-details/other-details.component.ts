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
import { DocRequest } from '@model/upload-model';

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
              private sharedSercive: SharedService
          ) {
              this.sharedSercive.taskId$.subscribe((value) => {
                this.taskId = value;
              });
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

}
