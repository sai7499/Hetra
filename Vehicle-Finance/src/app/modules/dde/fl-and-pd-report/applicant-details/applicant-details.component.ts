import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ApplicantDetails } from '@model/dde.model';
import { PdDataService } from '../pd-data.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
@Component({
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailComponent implements OnInit {

  applicantForm: FormGroup;

  public applicantLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;
  isDirty: boolean;
  LOV: any = [];
  applicantDetails: ApplicantDetails;
  applicantId: any;
  applicantPdDetails: any;


  namePattern = {
    rule: '^[A-Za-z ]{0,99}$',
    msg: 'Invalid Name',
  };

  maxlength30 = {
    rule: 30,
    msg: '',
  };

  landlinePattern = {
    rule: '^[0-9]{6,15}',
    msg: 'Invalid Landline Number',
  };

  maxlength15 = {
    rule: 15,
    msg: '',
  };

  mobileNumberPattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Numbers Only Required',
  };

  maxlength10 = {
    rule: 10,
    msg: 'Max Required Length 10',
  };

  bankAccountNumber = {
    rule: '^[0-9]{9,18}$',
    msg: 'Invalid Account No',
  };

  maxlength18 = {
    rule: 18,
    msg: '',
  };

  landmarkPattern = {
    rule: '^[0-9A-Za-z, _&*#/\\-@]{0,99}$',
    msg: 'Invalid Landmark',
  };

  maxlength40 = {
    rule: 40,
    msg: '',
  };
  version: any;
  // data: {
  //   applicantId: number;
  //   // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,
  //   pdVersion: any;
  // };
  roleName: string;
  data: any;
  userId: number;
  roles: any;
  leadId: number;

  constructor(private labelsData: LabelsService,
              private lovDataService: LovDataService,
              private router: Router,
              private ddeStoreService: DdeStoreService,
              private commomLovService: CommomLovService,
              private loginStoreService: LoginStoreService,
              private personaldiscussion: PersonalDiscussionService,
              private activatedRoute: ActivatedRoute,
              private pdDataService: PdDataService,
              private toasterService: ToasterService) { }

    async ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    console.log("roles", this.roles)
    this.roleName = this.roles[0].name;
    // this.roleName = 'Sales Officer';
    // this.roleName = 'Credit Officer';

    console.log("user id ==>", this.userId)
    this.initForm();
    this.leadId = (await this.getLeadId()) as number;
    console.log('Lead ID in Aplicant Details', this.leadId);
    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
      //  this.setFormValue();
    });

  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      this.getPdDetails();
      console.log('Applicant Id In applicant Details Component', this.applicantId);
      console.log('Version In applicant Details Component', this.version);

    });
  }
  initForm() {
    this.applicantForm = new FormGroup({
      applicantName: new FormControl(''),
      fatherName: new FormControl(''),
      gender: (new FormControl('')),
      maritalStatus: new FormControl(''),
      physicallyChallenged: new FormControl(''),
      residancePhoneNumber: new FormControl(''),
      officePhoneNumber: new FormControl(''),
      mobile: new FormControl(''),
      residenceAddressAsPerLoanApplication: new FormControl(''),
      bankName: new FormControl(''),
      accountNumber: new FormControl(''),
      landmark: new FormControl(''),
      addressAccessibility: new FormControl(''),
      residentialLocality: new FormControl(''),
      residentialType: new FormControl(''),
      houseType: new FormControl(''),
      sizeOfHouse: new FormControl(''),
      standardOfLiving: new FormControl(''),
      houseOwnership: new FormControl(''),
      ratingbySO: new FormControl('')
    });
  }

  setFormValue() {
    // const applicantModal = this.ddeStoreService.getApplicantDetails() || {};
    const applicantModal = this.applicantPdDetails || {};
    this.applicantForm.patchValue({
      applicantName: applicantModal.applicantName || '',
      fatherName: applicantModal.fatherName || '',
      gender: applicantModal.gender || '',
      maritalStatus: applicantModal.maritalStatus || '',
      physicallyChallenged: applicantModal.physicallyChallenged || '',
      residancePhoneNumber: applicantModal.residancePhoneNumber || '',
      officePhoneNumber: applicantModal.officePhoneNumber || '',
      mobile: applicantModal.mobile || '',
      residenceAddressAsPerLoanApplication: applicantModal.residenceAddressAsPerLoanApplication || '',
      bankName: applicantModal.bankName || '',
      accountNumber: applicantModal.accountNumber || '',
      landmark: applicantModal.landmark || '',
      addressAccessibility: applicantModal.addressAccessibility || '',
      residentialLocality: applicantModal.residentialLocality || '',
      residentialType: applicantModal.residentialType || '',
      houseType: applicantModal.houseType || '',
      sizeOfHouse: applicantModal.sizeOfHouse || '',
      standardOfLiving: applicantModal.standardOfLiving || '',
      houseOwnership: applicantModal.houseOwnership || '',
      ratingbySO: applicantModal.ratingbySO || ''
    });
  }
  onNavigateNext() {
    if (this.roleName === 'Sales Officer') {
      this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/customer-profile/${this.applicantId}`]);
    } else if (this.roleName === 'Credit Officer') {
      this.router.navigate([`/pages/fl-and-pd-report/${this.leadId}/customer-profile/${this.applicantId}/${this.version}`]);

    }
  }

  onNavigateBack() {
    if (this.roleName === 'Sales Officer') {
      this.router.navigate([`/../../../customer-profile/${this.applicantId}`]);
    } else if (this.roleName === 'Credit Officer') {
      this.router.navigate([`../../../customer-profile/${this.applicantId}/${this.version}`]);

    }
  }

  getPdDetails() {
    // const data = {
    //   applicantId: 6,
    //   //applicantId: this.applicantId
    //   pdVersion: this.version,

    // };
    if (this.roleName === 'Credit Officer') {
      this.data = {

        applicantId: 6,
        // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,
        pdVersion: this.version,
      };
    } else if (this.roleName === 'Sales Officer') {
      this.data = {

        applicantId: 6,
        // applicantId: this.applicantId  /* Uncomment this after getting applicant Id from Lead */,
      };
    }

    this.personaldiscussion.getPdData(this.data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {

        this.applicantPdDetails = value.ProcessVariables.applicantPersonalDiscussionDetails;
        console.log('Applicant Details in calling get api ', this.applicantPdDetails);
        if (this.applicantPdDetails) {
          this.setFormValue();
          this.pdDataService.setCustomerProfile(this.applicantPdDetails);
        }
      }
    });

  }

  onFormSubmit() {
    const formModal = this.applicantForm.value;
    const applicantFormModal = { ...formModal };
    console.log('Form Data', applicantFormModal);
    console.log('Status', this.applicantForm.get('physicallyChallenged').invalid);
    //  this.router.navigate(['/pages/fl-and-pd-report/customer-profile']);
    // if (
    //   this.applicantForm.get('physicallyChallenged').invalid ||
    //   this.applicantForm.get('maritalStatus').invalid ||
    //   this.applicantForm.get('gender').invalid
    // ) {
    //   this.isDirty = true;
    //   return;
    // }

    this.applicantDetails = {
      applicantName: applicantFormModal.applicantName,
      fatherName: applicantFormModal.fatherName,
      gender: applicantFormModal.gender,
      maritalStatus: applicantFormModal.maritalStatus,
      physicallyChallenged: applicantFormModal.physicallyChallenged,
      residancePhoneNumber: applicantFormModal.residancePhoneNumber,
      officePhoneNumber: applicantFormModal.officePhoneNumber,
      mobile: applicantFormModal.mobile,
      residenceAddressAsPerLoanApplication: applicantFormModal.residenceAddressAsPerLoanApplication,
      bankName: applicantFormModal.bankName,
      accountNumber: applicantFormModal.accountNumber,
      landmark: applicantFormModal.landmark,
      addressAccessibility: applicantFormModal.addressAccessibility,
      residentialLocality: applicantFormModal.residentialLocality,
      residentialType: applicantFormModal.residentialType,
      houseType: applicantFormModal.houseType,
      sizeOfHouse: applicantFormModal.sizeOfHouse,
      standardOfLiving: applicantFormModal.standardOfLiving,
      houseOwnership: applicantFormModal.houseOwnership,
      ratingbySO: applicantFormModal.ratingbySO,
    };
    const data = {
      leadId: 1,
      applicantId: 6,
      userId: this.userId,
      applicantPersonalDiscussionDetails: this.applicantDetails,
      // customerProfileDetails: null,
      // loanDetailsForNewCv: null,
      // applicableForUsedVehicle: null,
      // applicableForAssetDetailsUsedVehicle: null,

    };

    this.personaldiscussion.saveOrUpdatePdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.toasterService.showSuccess('Applicant Details saved !', '');
      } else {
        console.log('error', processVariables.error.message);
        this.toasterService.showError('ivalid save', 'message');

      }
    });
  }

}
