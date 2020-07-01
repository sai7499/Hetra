import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { CustomerProfile } from '@model/dde.model';
import { CommomLovService } from '@services/commom-lov-service';
import { PdDataService } from '../pd-data.service';
import { LoginStoreService } from '@services/login-store.service';

// import { MessageService } from '@progress/kendo-angular-l10n';
@Component({
  selector: 'app-customer-profile-details',
  templateUrl: './customer-profile-details.component.html',
  styleUrls: ['./customer-profile-details.component.css']
})
export class CustomerProfileDetailsComponent implements OnInit {

  customerProfileForm: FormGroup;

  public customerProfileLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;
  leadId: number;
  userId: number;
  LOV: any = [];
  custProfDetails: any = [];
  data: any;

  custProfileDetails: CustomerProfile;

  employeeSeenPattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Numbers Only Required',
  };

  maxlength10 = {
    rule: 10,
    msg: '',
  };


  mismatchAddressPattern = {
    rule: '^[0-9A-Za-z, _&*#/\\-@]{0,99}$',
    msg: 'Invalid Landmark',
  };

  maxlength40 = {
    rule: 40,
    msg: '',
  };
  isDirty: boolean;
  applicantId: number;
  version: string;
  roleName: string;
  roles: any;
  userName: any;

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private ddeStoreService: DdeStoreService,
    private toasterService: ToasterService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private activatedRoute: ActivatedRoute,
    private pdDataService: PdDataService,
    private personalDiscussion: PersonalDiscussionService) { }

  async ngOnInit() {

    // accessing lead if from route

    this.leadId = (await this.getLeadId()) as number;
    console.log("leadID =>", this.leadId)

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.roles = roleAndUserDetails.roles;
    this.roleName = this.roles[0].name;
    // this.roleName = 'Sales Officer';
    // this.roleName = 'Credit Officer';
    console.log("user name", this.userName)
    console.log("user id ==>", this.userId)

    this.initForm();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });

    this.getLOV();
    // this.commonService()
    this.getPdDetails();
    this.setFormValue();

    this.lovDataService.getLovData().subscribe((value: any) => {
      this.customerProfileLov = value ? value[0].customerProfile[0] : {};
      // console.log("lov customer", this.customerProfileLov)

    });

  }
  getLeadId() {
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
  getLOV() {
    this.commonLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      console.log('Applicant Id In Customer Profile Component', this.applicantId);
      console.log('Applicant Id In Customer Profile Component', this.version);
    });
  }

  initForm() {

    this.customerProfileForm = new FormGroup({
      offAddSameAsRecord: new FormControl('', Validators.required),
      noOfEmployeesSeen: new FormControl('', Validators.required),
      nameBoardSeen: new FormControl('', Validators.required),
      officePremises: new FormControl('', Validators.required),
      sizeofOffice: new FormControl('', Validators.required),
      customerProfileRatingSo: new FormControl('', Validators.required),
      mismatchInAddress: new FormControl('', Validators.required),
      customerHouseSelfie: new FormControl('', Validators.required),
      ownershipAvailable: new FormControl('', Validators.required),
      mandatoryCustMeeting: new FormControl('', Validators.required)
    });
  }

  commonService() {
    const customerProfileModal = this.pdDataService.getCustomerProfile();

    if (customerProfileModal) {

      console.log("common variable ", customerProfileModal)
    }
    else {
      console.log("common variable is empty calling get api")

      // this.getPdDetails();





    }
  }

  getPdDetails() {

    if (this.roleName == 'Credit Officer') {
      this.data = {

        applicantId: 6,
        // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,
        pdVersion: this.version,
      };
    }
    else if (this.roleName == 'Sales Officer') {
      this.data = {

        applicantId: 6,
        // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,
      };
    }

    this.personalDiscussion.getPdData(this.data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.custProfDetails = value.ProcessVariables.customerProfileDetails;
        console.log('calling get api ', this.custProfDetails);
        if (this.custProfDetails) {
          this.setFormValue()
          this.pdDataService.setCustomerProfile(this.custProfDetails);
        }
      }
    });

  }

  setFormValue() {

    // const customerProfileModal = this.pdDataService.getCustomerProfile() || {};
    const customerProfileModal = this.custProfDetails || {};

    console.log('in form value', customerProfileModal)

    this.customerProfileForm.patchValue({
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchInAddress: customerProfileModal.mismatchInAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      ownershipAvailable: customerProfileModal.ownershipAvailable || '',
      mandatoryCustMeeting: customerProfileModal.mandatoryCustMeeting || ''
    });
    console.log("patched form", this.customerProfileForm);
  }






  onFormSubmit() {
    const formModal = this.customerProfileForm.value;
    this.isDirty = true;
    if (this.customerProfileForm.invalid) {
      return;
    }
    const customerProfileModal = { ...formModal };
    console.log('profile form', customerProfileModal);
    this.custProfileDetails = {
      offAddSameAsRecord: customerProfileModal.offAddSameAsRecord || '',
      noOfEmployeesSeen: customerProfileModal.noOfEmployeesSeen || '',
      nameBoardSeen: customerProfileModal.nameBoardSeen || '',
      officePremises: customerProfileModal.officePremises || '',
      sizeofOffice: customerProfileModal.sizeofOffice || '',
      customerProfileRatingSo: customerProfileModal.customerProfileRatingSo || '',
      mismatchInAddress: customerProfileModal.mismatchInAddress || '',
      customerHouseSelfie: customerProfileModal.customerHouseSelfie || '',
      ownershipAvailable: customerProfileModal.ownershipAvailable || '',
      mandatoryCustMeeting: customerProfileModal.mandatoryCustMeeting || '',
    };
    const data = {
      leadId: 1,
      applicantId: 6,
      userId: this.userId,
      customerProfileDetails: this.custProfileDetails
    };

    this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('customer Profle Details saved !', '');

      } else {
        console.log('error', res.ProcessVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });
    // this.router.navigate(['/pages/fl-and-pd-report/loan-details']);
    // this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/applicant-detail/${this.applicantId}/${this.version}`]);


  }

}
