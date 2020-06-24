import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ApplicantDetails} from '@model/dde.model';
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

  namePattern = {
    rule: '^[A-Z]*[a-z]*$',
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

  constructor(private labelsData: LabelsService,
              private lovDataService: LovDataService,
              private router: Router,
              private ddeStoreService: DdeStoreService,
              private commomLovService: CommomLovService,
              private personaldiscussion: PersonalDiscussionService) { }

  ngOnInit() {
    this.initForm();

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
      //this.setFormValue();
    });

  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOVs', this.LOV);
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
    const applicantModal = this.ddeStoreService.getApplicantDetails() || {};
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

  onFormSubmit() {
    const formModal = this.applicantForm.value;
    const applicantFormModal = { ...formModal };
    console.log('Form Data', applicantFormModal);
    console.log('Status', this.applicantForm.get('physicallyChallenged').invalid);
    //this.router.navigate(['/pages/fl-and-pd-report/customer-profile']);
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
  physicallyChallenged: Number(applicantFormModal.physicallyChallenged),
  residancePhoneNumber: applicantFormModal.residancePhoneNumber,
  officePhoneNumber: applicantFormModal.officePhoneNumber,
  mobile: applicantFormModal.mobile,
  residenceAddressAsPerLoanApplication: Number(applicantFormModal.residenceAddressAsPerLoanApplication),
  bankName: applicantFormModal.bankName,
  accountNumber: applicantFormModal.accountNumber,
  landmark: applicantFormModal.landmark,
  addressAccessibility: Number(applicantFormModal.addressAccessibility),
  residentialLocality: applicantFormModal.residentialLocality,
  residentialType: applicantFormModal.residentialType,
  houseType: applicantFormModal.houseType,
  sizeOfHouse: applicantFormModal.sizeOfHouse,
  standardOfLiving: applicantFormModal.standardOfLiving,
  houseOwnership: applicantFormModal.houseOwnership,
  ratingbySO: applicantFormModal.ratingbySO,
};
    const data = {
      applicantPersonalDiscussionDetails: this.applicantDetails,
      // customerProfileDetails: null,
      // loanDetailsForNewCv: null,
      // applicableForUsedVehicle: null,
      // applicableForAssetDetailsUsedVehicle: null,

  };

    this.personaldiscussion.savePdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
      const message = processVariables.error.message;
      console.log('PD Status', message);
  }
  });
  }

}
