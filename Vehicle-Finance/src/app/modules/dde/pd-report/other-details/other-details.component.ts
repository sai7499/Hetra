import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { CommomLovService } from "@services/commom-lov-service";
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';
import { Constant } from '../../../../../assets/constants/constant';
import { UtilityService } from '@services/utility.service';
import { LoginStoreService } from '@services/login-store.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {
  otherDetailsForm: FormGroup;
  fundingProgram: any;
  leadId: number;
  applicantId: any;
  version: any;

  labels: any = {};
  LOV: any = {};
  applicantPdDetails: any;
  isDirty: boolean;
  showSubmit: boolean = true;

  userId: any;
  taskId: number;
  showReinitiate: boolean;
  roles: any;
  roleType: any;

  constructor(private labelsData: LabelsService,
    private formBuilder: FormBuilder, private loginStoreService: LoginStoreService,
    private router: Router, private createLeadDataService: CreateLeadDataService,
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

  ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleType = this.roles[0].roleType;

    this.getLabels();
    this.getLeadId();
    this.getApplicantId();
    this.getLOV();
    this.getPdDetails();
    this.initForm();
    this.getLeadSectiondata();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.aRoute.params.subscribe((value) => {// calling get lead section data function in line 174
          if (!value && !value.applicantId) {
            return;
          }
          this.applicantId = Number(value.applicantId);
          this.version = String(value.version);
          console.log('xv', this.version)
          if (this.version !== 'undefined') {
            this.showSubmit = false;
          }
          this.getPdDetails();    // for getting the data for pd details on initializing the page
        });
      }, err => {
        console.log('err', err)
      }
    );
  }

  // GET LEADID FROM URL
  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.fundingProgram = leadData['leadDetails'].fundingProgramDesc;

    if (this.fundingProgram === 'CAT D') {
      this.otherDetailsForm.removeControl('agricultureProof');
      this.otherDetailsForm.addControl('agricultureProof', new FormControl('', [Validators.required]));
    } else {
      this.otherDetailsForm.removeControl('agricultureProof');
      this.otherDetailsForm.addControl('agricultureProof', new FormControl({ value: '', disabled: true }));
    }

  }

  //GET APPLICANTID
  getApplicantId() {
    this.aRoute.params.subscribe((value: any) => {
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
    });
  }

  //GET ALL LOVS
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  //FORMGROUP
  initForm() {
    this.otherDetailsForm = this.formBuilder.group({
      agricultureProof: [""],
      income: ["", Validators.required],
      securedLoans: ["", Validators.required],
      unSecuredLoans: ["", Validators.required],
      creditors: ["", Validators.required],
      debtors: ["", Validators.required],
      fixedAssets: ["", Validators.required],
      applicationNo: [{ value: '', disabled: true }],
      area: ["", Validators.required],
      place: ["", Validators.required],
      geotagInformation: ["", Validators.required],
      routeMap: ["", Validators.required],
      equitasBranchName: [{ value: '', disabled: true }],
      distanceEquitasAssetBranch: [{ value: '', disabled: true }],
      pdOfficerName: ["", Validators.required],
      employeeCode: ["", Validators.required],
      date: ["", Validators.required],
      product: [{ value: '', disabled: true }],
      sourcingChannel: [{ value: '', disabled: true }],
      tomeOfVerification: ["", Validators.required],
      loanAmount: ["", Validators.required],
      marginMoney: ["", Validators.required],
      emiAffordability: ["", Validators.required],
      sourceOfMarginMoney: ["", Validators.required],
    });
  }

  // GET PD-DETAILS FOR APPLICANT_ID
  getPdDetails() {
    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version,
    };
    this.personalDiscussionService.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.showReinitiate = value.ProcessVariables.showReinitiate;
        console.log('in other details show renitiate', this.showReinitiate);
        this.applicantPdDetails = value.ProcessVariables.applicantPersonalDiscussionDetails;
        // console.log('Applicant Details in calling get api ', this.applicantPdDetails);
        if (this.applicantPdDetails) {
          // this.setFormValue();
          this.pdDataService.setCustomerProfile(this.applicantPdDetails);
        }
      }
    });
  }

  // SUBMIT FORM
  onFormSubmit() {
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
