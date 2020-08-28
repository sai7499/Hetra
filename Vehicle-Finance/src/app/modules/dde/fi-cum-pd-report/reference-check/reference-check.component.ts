import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  // <-- route map sample url start
  // routeMapUrl = "https://maps.googleapis.com/maps/api/staticmap?sensor=false
  // &size=800x400&markers=color:blue%7Clabel:S%7C12.96186,80.20078&&markers=color:red%
  // 7Clabel:C%7C12.98714,80.17511&&center=12.9982906,80.2009504|12.9618433,80.1750283&zoom=13
  // &path=color:blue|weight:6|enc:orbnAqfohNiBKQ?ED@zBYnDE%60@MjCGL%7B@B@FI~@k@zCa@lBEHmApBMPK
  // ?%7BBIAd@QfBKx@Bf@@%5EQ%60Ac@tCG%60BBz@KbAi@lDw@zFgAnJgCw@k@IgBk@mDeAuCkAaCw@cBm@USu@SuAg@%7
  // DBu@wFkBcEkAwFyAu@UcAa@%7BBmAg@SUKoAs@m@Sy@OaBKeC_@eA%5DsAy@m@e@SYyBiAs@%5BuD%7BAkCqAqAc@YO%
  // 5BKe@R%7B@TaBTwAHk@?qC?%7B@DyCf@cARkEt@%7DA@mB@iBEsDGa@Hq@b@e@%60@s@dAmClEWZWLYHeBJgAD%7DA?s
  // KDwFFA@ABEBEBMAGCoAz@mA%60AoB~AHH%60CfDbB%60CfApAxAzAtAjBv@%7CAdAfCx@lB%7C@%60C%60DbI%60DdH%7
  // CAxC~AdCnErGrCxDrBjCj@~@ID%5BV%7D@v@zEbGlAxANHJLh@v@PTZD%60@ZVTLFLTd@%7C@c@XH%5CJb@&key=AIzaSy
  // DJ9TZyUZNB2uY_267eIUQCV72YiYmArIw"
  //  route map sample url ends -->

  namePattern = {
    rule: '^[A-Za-z ]{0,99}$',
    msg: 'Invalid Name',
  };
  mobileNumberPattern = {
    rule: '^[6-9][0-9]*$',
    msg: 'Invalid Mobile Number',
  };
  maxlength10 = {
    rule: 10,
    msg: 'Max Required Length 10',
  };

  addressPattern = {
    rule: '^[A-Za-z ]{0,99}$',
    msg: 'Invalid Address',
  };
  version: string;
  show = true;
  taskId: any;
  roleId: any;
  roleType: any;
  productCat: any;
  sourcingChannel: any;
  showReinitiate: boolean;
  equitasBranchName: any;
  employeeCode: any;
  showSubmit = true;
  date: Date = new Date();
  timeOfVerification: any = String(new Date(new Date().getTime()).toLocaleTimeString()).slice(0, 5);
  constructor(
    private labelsData: LabelsService, // service to access labels
    private personalDiscussion: PersonalDiscussionService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedSercive: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private utilityService: UtilityService,
    private toasterService: ToasterService, // service for accessing the toaster

  ) {
    this.sharedSercive.taskId$.subscribe((value) => {
      this.taskId = value;
      console.log('in ref check task id', this.taskId);
    });
  }

  async ngOnInit() {


    if (this.router.url.includes('/pd-dashboard')) {

      console.log(' pd-dashboard ');
      this.show = false;
    }


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
          this.getLeadSectiondata();
          this.getPdDetails();    // for getting the data for pd details on initializing the page
          console.log('Applicant Id In reference Details Component', this.applicantId);

        });
        // console.log("this labels data", this.labels)
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();              // for initializing the form

    this.setFormValue();          // for setting the values what we get when the component gets initialized
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
  //GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.sourcingChannel = leadData['leadDetails'].sourcingChannelDesc;
    this.equitasBranchName = leadData['leadDetails'].branchName;
    this.productCat = leadData['leadDetails'].productCatName;
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

    this.referenceCheckForm = new FormGroup({
      nameOfReference: new FormControl('', Validators.required),
      addressOfReference: new FormControl('', Validators.required),
      referenceMobile: new FormControl('', Validators.required),
      overallFiReport: new FormControl('', Validators.required),
      negativeProfile: new FormControl('', Validators.required),
      // pdRemarks: new FormControl('', Validators.required),
      pdRemarks: new FormControl('', Validators.compose
        ([Validators.maxLength(200), Validators.pattern(/^[a-zA-Z .:,]*$/), Validators.required])),
      product: new FormControl({ value: '', disabled: true }),
      sourcingChannel: new FormControl({ value: '', disabled: true }),
      routeMap: new FormControl(''),
      equitasBranchName: new FormControl({ value: '', disabled: true }),
      distanceFromEquitas: new FormControl({ value: '', disabled: true }),
      // soName: new FormControl('', Validators.required),
      soName: new FormControl({ value: '', disabled: true }),
      // employeeCode: new FormControl('', Validators.required),
      employeeCode: new FormControl({ value: '', disabled: true }),
      area: new FormControl('', Validators.required),
      // date: new FormControl('', Validators.required),
      date: new FormControl({ value: '', disabled: true }),
      // place: new FormControl('', Validators.required),
      place: new FormControl({ value: '', disabled: true }),
      // time: new FormControl('', Validators.required),
      timeOfVerification: new FormControl({ value: '', disabled: true }),
      // latitude: new FormControl({ value: '', disabled: true }),
      // longitude: new FormControl({ value: '', disabled: true }),
    });
  }

  getPdDetails() { // function calling get pd report api to get respective pd details

    const data = {

      applicantId: this.applicantId,
      pdVersion: this.version,

    };
    console.log('applicant id in get detaisl', this.applicantId);

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.refCheckDetails = value.ProcessVariables.referenceCheck;
        this.otherDetails = value.ProcessVariables.otherDetails;
        this.showReinitiate = value.ProcessVariables.showReinitiate;
        // console.log('in ref check show renitiate', this.showReinitiate);
        // console.log('calling get api ', this.refCheckDetails);
        if (this.refCheckDetails && this.otherDetails) {
          this.setFormValue();
        }
      } else {
        console.log('error', processVariables.error.message);

      }
    });

  }
  setFormValue() {

    // const customerProfileModal = this.pdDataService.getCustomerProfile() || {};
    const refCheckModel = this.refCheckDetails || {};
    const otherDetailsModel = this.otherDetails || {};

    console.log('in form value', refCheckModel);
    console.log('in form value other details', otherDetailsModel);

    this.referenceCheckForm.patchValue({
      nameOfReference: refCheckModel.nameOfReference ? refCheckModel.nameOfReference : null,
      addressOfReference: refCheckModel.addressOfReference ? refCheckModel.addressOfReference : null,
      referenceMobile: refCheckModel.referenceMobile ? refCheckModel.referenceMobile : null,
      negativeProfile: refCheckModel.negativeProfile ? refCheckModel.negativeProfile : null,
      overallFiReport: refCheckModel.overallFiReport ? refCheckModel.overallFiReport : null,
      pdRemarks: refCheckModel.pdRemarks ? refCheckModel.pdRemarks : null,
      // soName: this.userName ? this.userName : null,
      soName: refCheckModel.soName ? refCheckModel.soName : null,
      employeeCode: refCheckModel.employeeCode ? refCheckModel.employeeCode : null,
      // patching other details object data from backend
      product: otherDetailsModel.product ? otherDetailsModel.product : null,
      sourcingChannel: otherDetailsModel.sourcingChannel ? otherDetailsModel.sourcingChannel : null,
      routeMap: otherDetailsModel.routeMap ? otherDetailsModel.routeMap : null,
      equitasBranchName: otherDetailsModel.equitasBranchName ? otherDetailsModel.equitasBranchName : null,
      distanceFromEquitas: otherDetailsModel.distanceFromEquitas ? otherDetailsModel.distanceFromEquitas : null,
      date: otherDetailsModel.date ? this.utilityService.getDateFromString(otherDetailsModel.date) : null,
      // date: this.otherDetails.date ? this.utilityService.getDateFromString(this.otherDetails.date) : '',
      area: otherDetailsModel.area ? otherDetailsModel.area : null,
      place: otherDetailsModel.place ? otherDetailsModel.place : null,
      timeOfVerification: otherDetailsModel.timeOfVerification ? otherDetailsModel.timeOfVerification : null,

      // time: new Date(refCheckModal.time ? this.getDateFormat(refCheckModal.time) : ""),
      // latitude: refCheckModal.latitude || '',
      // longitude: refCheckModal.longitude || '',
    });
    console.log('patched form', this.referenceCheckForm);
  }


  onFormSubmit() { // function that calls sumbit pd report api to save the respective pd report
    console.log('in save api');
    const formModel = this.referenceCheckForm.value;
    this.isDirty = true;
    if (this.referenceCheckForm.invalid) {
      console.log('in invalid ref checkform', this.referenceCheckForm);
      this.toasterService.showWarning('please enter required details', '');
      return;
    }
    console.log("this product", this.productCat);
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

    this.otherDetails = {
      product: this.productCat ? this.productCat : null,
      sourcingChannel: this.sourcingChannel ? this.sourcingChannel : null,
      // routeMap: referenceCheckModel.routeMap ? referenceCheckModel.routeMap : null,
      routeMap: referenceCheckModel.routeMap,
      equitasBranchName: this.equitasBranchName ? this.equitasBranchName : null,
      distanceFromEquitas: referenceCheckModel.distanceFromEquitas ? referenceCheckModel.distanceFromEquitas : null,
      // this.formValues.date = this.formValues.date ? this.utilityService.convertDateTimeTOUTC(this.formValues.date, 'DD/MM/YYYY') : null;
      date: this.date ? this.utilityService.convertDateTimeTOUTC(this.date, 'DD/MM/YYYY') : null,
      area: referenceCheckModel.area ? referenceCheckModel.area : null,
      place: referenceCheckModel.place ? referenceCheckModel.place : null,
      timeOfVerification: this.timeOfVerification ? this.timeOfVerification : null,
      pdOfficerName: this.userName ? this.userName : null,


    };
    const data = {
      leadId: this.leadId,
      applicantId: this.applicantId,
      userId: this.userId,
      referenceCheck: this.refCheckDetails,
      otherDetails: this.otherDetails

    };

    this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
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
      console.log('response approve pd', processVariables);
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
      console.log('response reinitiate pd', processVariables);
      const message = processVariables.error.message;
      if (processVariables.error.code === '0') {

        this.toasterService.showSuccess('pd report reinitiated successfully', '');
        // this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
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
        console.log('message', processVariables.error.message);
        this.toasterService.showSuccess('submitted to credit successfully', '');
        // this.router.navigate([`/pages/dde/${this.leadId}/pd-report`]);
        this.router.navigate([`/pages/dashboard`]);
      } else {
        this.toasterService.showError(processVariables.error.message, '');
        console.log('error', processVariables.error.message);

      }
    });

  }


  onNavigateToPdSummary() { // fun to navigate to pd summary

    if (this.version != 'undefined') {
      console.log('in routing defined version condition', this.version);
      // http://localhost:4200/#/pages/dashboard/personal-discussion/my-pd-tasks

      this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);

    } else {
      console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);

    }
  }

  onNavigateBack() { // fun to navigate to back page
    if (this.version != 'undefined') {
      console.log('in routing defined version condition', this.version);
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details/${this.version}`]);

    } else {
      console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/loan-details`]);
      // this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/loan-details/${this.applicantId}/${this.version}`]);

    }
  }



}


