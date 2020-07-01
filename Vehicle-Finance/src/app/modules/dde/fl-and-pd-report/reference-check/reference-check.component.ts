import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PdDataService } from '../pd-data.service';
import { ToasterService } from '@services/toaster.service';

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
  refCheckDetails: any = {}
  isDirty: boolean;
  isSoNameEnable: true;
  userDetails: any;

  constructor(
    private labelsData: LabelsService,
    private personalDiscussion: PersonalDiscussionService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pdDataService: PdDataService,
    private toasterService: ToasterService,

  ) { }

  ngOnInit() {

    // calling login store service to retrieve the user data 

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userDetails = roleAndUserDetails.userDetails
    this.userId = roleAndUserDetails.userDetails.userId;
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.roles = roleAndUserDetails.roles;
    this.roleName = this.roles[0].name;
    // this.roleName = 'Sales Officer';
    // this.roleName = 'Credit Officer';
    console.log("user details ==> ", this.userDetails)
    console.log("user id ==>", this.userId)
    console.log("user name", this.userName)

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();              // for initializing the form
    this.getPdDetails();          //for getting the data for pd details on initializing the page
    this.setFormValue();          // for setting the values what we get when the component gets initialized
  }
  // getLeadId() {
  //   // console.log("in getleadID")
  //   return new Promise((resolve, reject) => {
  //     this.activatedRoute.parent.params.subscribe((value) => {
  //       if (value && value.leadId) {
  //         // console.log("in if", value.leadId)
  //         resolve(Number(value.leadId));
  //         // console.log("after resolve", value.leadId)
  //       }
  //       resolve(null);
  //     });
  //   });
  // }
  getApplicantId() {

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log('Applicant Id In reference check Component', this.applicantId);
    });
  }

  initForm() {
    this.referenceCheckForm = new FormGroup({
      nameOfReference: new FormControl('', Validators.required),
      addressOfReference: new FormControl('', Validators.required),
      referenceMobile: new FormControl('', Validators.required),
      soName: new FormControl('', Validators.required),
      employeeCode: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      place: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      pdRemarks: new FormControl('', Validators.required),
      overallFiReport: new FormControl('', Validators.required)

    })
  }

  getPdDetails() {

    const data = {

      applicantId: 6,
      // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,

    }

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.refCheckDetails = value.ProcessVariables.referenceCheck;
        console.log('calling get api ', this.refCheckDetails);
        if (this.refCheckDetails) {
          this.setFormValue()
          this.pdDataService.setCustomerProfile(this.refCheckDetails);
        }
      }
    });

  }
  setFormValue() {

    // const customerProfileModal = this.pdDataService.getCustomerProfile() || {};
    const refCheckModal = this.refCheckDetails || {};

    console.log('in form value', refCheckModal)

    this.referenceCheckForm.patchValue({
      nameOfReference: refCheckModal.nameOfReference || '',
      addressOfReference: refCheckModal.addressOfReference || '',
      referenceMobile: refCheckModal.referenceMobile || '',
      // soName: refCheckModal.soName || '',
      soName: this.userName,
      employeeCode: refCheckModal.employeeCode || '',
      date: refCheckModal.date || '',
      place: refCheckModal.place || '',
      time: refCheckModal.time || '',
      pdRemarks: refCheckModal.pdRemarks || '',
      overallFiReport: refCheckModal.overallFiReport || ''
    });
    console.log("patched form", this.referenceCheckForm);
  }

  onFormSubmit() {
    console.log("in save api")
    const formModal = this.referenceCheckForm.value;
    // this.isDirty = true;
    // if (this.referenceCheckForm.invalid) {
    //   return;
    // }
    const refCheckModal = { ...formModal };
    console.log('profile form', refCheckModal);
    this.refCheckDetails = {
      nameOfReference: refCheckModal.nameOfReference || '',
      addressOfReference: refCheckModal.addressOfReference || '',
      referenceMobile: refCheckModal.referenceMobile || '',
      soName: this.userName || '',
      employeeCode: refCheckModal.employeeCode || '',
      date: refCheckModal.date || '',
      place: refCheckModal.place || '',
      time: refCheckModal.time || '',
      pdRemarks: refCheckModal.pdRemarks || '',
      overallFiReport: refCheckModal.overallFiReport || '',
    };
    const data = {
      leadId: 1,
      applicantId: 6,
      userId: this.userId,
      referenceCheck: this.refCheckDetails
    };

    this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('reference check Details saved  sucessfully !', '');

      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });
    // this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
    // this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${this.applicantId}/${this.version}`]);


  }



}


