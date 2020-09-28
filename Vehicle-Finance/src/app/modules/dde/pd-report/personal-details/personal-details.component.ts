import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {

  public personalDetailsForm: FormGroup;
  public errorMsg: string = '';
  public labels: any = {};
  private leadId: number = 0;
  public maxDate: any = new Date();
  public personalPDDetais: any = {};

  public applicantLov: any = {};
  public getLabels;
  isDirty: boolean;
  LOV: any = [];
  applicantDetails: any = [];
  applicantId: any;
  standardOfLiving: any;
  version: any;
  userId: any;

  monthValidation: {
    rule?: any;
    msg?: string;
  }[];

  yearValidation: {
    rule?: any;
    msg?: string;
  }[];

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router, private createLeadDataService: CreateLeadDataService,
    private commomLovService: CommomLovService,
    private _fb: FormBuilder, private pdDataService: PdDataService,
    private personaldiscussion: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute,
    private loginStoreService: LoginStoreService,
    private toasterService: ToasterService,
    private utilityService: UtilityService) { }
  async ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();

    this.activatedRoute.params.subscribe((value) => {
      let score = value ? value.score : 0;
      this.personalDetailsForm.patchValue({
        cibilScore: score
      })
    })

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    this.userId = roleAndUserDetails.userDetails.userId;

    const leadData = this.createLeadDataService.getLeadSectionData();

    this.applicantDetails = leadData['applicantDetails']

    this.leadId = (await this.getLeadId()) as number;

    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });

    this.monthValidation = this.monthValiationCheck();
    console.log('Test', this.personalDetailsForm)
  }

  monthValiationCheck() {
    const monthData = [
      {
        rule: (month) => {
          return month < 0;
        },
        msg: 'Month should be greater than or equal to 0',
      },
      {
        rule: (month) => {
          return month > 11;
        },
        msg: 'Month should be less than or equal to 11',
      },
    ];
    return monthData;
  }

  yearValiationCheck() {
    const yearData = [
      {
        rule: (year) => {
          return year < 0;
        },
        msg: 'Year should be greater than or equal to 0',
      },
      {
        rule: (year) => {
          return year > 99;
        },
        msg: 'Month should be less than or equal to 99',
      },
    ];
    return yearData;
  }

  initForm() {

    this.personalDetailsForm = this._fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      applicantName: [{ value: '', disabled: true }, Validators.required],
      fatherFirstName: ['', Validators.required],
      fatherMiddleName: [''],
      fatherLastName: ['', Validators.required],
      fatherFullName: [{ value: '', disabled: true }, Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      weddingAnniversaryDate: [{ value: '', disabled: true }],
      religion: ['', Validators.required],
      category: [''],
      physicallyChallenged: ['', Validators.required],
      customerProfile: ['', Validators.required],
      priorInfo: ['', Validators.required],
      businessKey: ['', Validators.required],
      occupationType: ['', Validators.required],
      businessType: ['', Validators.required],
      natureOfBusiness: [''],
      educationalBackground: [''],
      isMinority: ['', Validators.required],
      community: ['', Validators.required],
      srto: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      contactNo: ['', Validators.required],
      alternateContactNo: [''],
      email: ['', Validators.required],
      residentStatus: ['', Validators.required],
      accomodationType: ['', Validators.required],
      noOfYears: ['', Validators.required],
      noOfMonths: ['', Validators.required],
      noOfYearsResidingInCurrResidence: [''],
      noOfAdultDependant: ['', Validators.compose([Validators.maxLength(2), Validators.required])],
      noOfChildrenDependant: ['', Validators.compose([Validators.maxLength(2), Validators.required])],
      bankAccHolderName: ['', Validators.required],
      cibilScore: ['', Validators.required]
    })
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.standardOfLiving = this.LOV.LOVS['fi/PdHouseStandard'].filter(data => data.value !== 'Very Good');
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = value.version ? String(value.version) : null;
      this.getPdDetails();
    });
  }

  getPdDetails() { // function to get the pd details with respect to applicant id
    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version ? this.version : 'undefined',
    };

    this.personaldiscussion.getPdData(data).subscribe((value: any) => {
      if (value.Error === '0' && value.ProcessVariables.error.code === '0') {
        this.personalPDDetais = value.ProcessVariables.applicantPersonalDiscussionDetails ? value.ProcessVariables.applicantPersonalDiscussionDetails : {};
        if (this.personalPDDetais) {
          this.setFormValue(this.personalPDDetais);
          this.pdDataService.setCustomerProfile(this.personalPDDetais);
        } else {
          this.applicantDetails.filter((val: any) => {
            const splitName = val.fullName.split(' ')
            if (val.applicantId === this.applicantId) {
              this.personalDetailsForm.patchValue({
                firstName: splitName ? splitName[0] : '',
                middleName: '',
                lastName: splitName && splitName.length > 1 ? splitName[1] : '',
                fullName: val.fullName || '',
                contactNo: val.mobileNumber || ''
              })
            }
            return val
          })
        }
      } else {
        this.toasterService.showError(value.ErrorMessage, 'Personal Details')
      }
    });
  }

  setFormValue(personalPDDetais) {

    let first = '';
    let second = '';
    let third = '';

    let nameOfSplit = personalPDDetais.fatherFullName ? personalPDDetais.fatherFullName.split(' ') : [];
    if (nameOfSplit && nameOfSplit.length > 0) {
      first = nameOfSplit[0];
      second = nameOfSplit[1] ? nameOfSplit[1] : '';
      third = nameOfSplit[2] ? nameOfSplit[2] : '';
    }

    let noofmonths = '';
    let noofyears = ''
    if (personalPDDetais.noOfYearsResidingInCurrResidence) {

      noofmonths = String(Number(personalPDDetais.noOfYearsResidingInCurrResidence) % 12) || '';
      noofyears = String(Math.floor(Number(personalPDDetais.noOfYearsResidingInCurrResidence) / 12)) || '';
    }

    this.personalDetailsForm.patchValue({
      accomodationType: personalPDDetais.accomodationType || '',
      applicantName: personalPDDetais.applicantName || '',
      bankAccHolderName: personalPDDetais.bankAccHolderName || '',
      category: personalPDDetais.category || '',
      community: personalPDDetais.community || '',
      cibilScore: personalPDDetais.cibilScore || '',
      dob: personalPDDetais.dob ? this.utilityService.getDateFromString(personalPDDetais.dob) : '',
      email: personalPDDetais.email || '',
      fatherFullName: personalPDDetais.fatherFullName || '',
      fatherFirstName: nameOfSplit ? first : '',
      fatherMiddleName: nameOfSplit ? second : '',
      fatherLastName: nameOfSplit ? third : '',
      firstName: personalPDDetais.firstName || '',
      fullName: personalPDDetais.fullName || '',
      gender: personalPDDetais.gender || '',
      husbandFullName: personalPDDetais.husbandFullName || '',
      isMinority: personalPDDetais.isMinority === 'No' ? '2' : '1' || '',
      lastName: personalPDDetais.lastName || '',
      maritalStatus: personalPDDetais.maritalStatus || '',
      middleName: personalPDDetais.middleName || '',
      contactNo: personalPDDetais.mobile || '',
      noOfAdultDependant: personalPDDetais.noOfAdultDependant || '',
      noOfChildrenDependant: personalPDDetais.noOfChildrenDependant || '',
      noOfYearsResidingInCurrResidence: personalPDDetais.noOfYearsResidingInCurrResidence || '',
      alternateContactNo: personalPDDetais.alternateContactNo || '',
      physicallyChallenged: personalPDDetais.physicallyChallenged || '',
      physicallyChallengedValue: personalPDDetais.physicallyChallengedValue || '',
      residentStatus: personalPDDetais.residentStatus || '',
      residentialLocality: personalPDDetais.residentialLocality || '',
      residentialType: personalPDDetais.sizeOfHouse || '',
      sizeOfHouse: personalPDDetais.residentialType || '',
      srto: personalPDDetais.srto || '',
      standardOfLiving: personalPDDetais.standardOfLiving || '',
      religion: personalPDDetais.religion || '',
      customerProfile: personalPDDetais.customerProfile || '',
      priorInfo: personalPDDetais.priorInfo ? personalPDDetais.priorInfo : '',
      businessKey: personalPDDetais.businessKey || '',
      occupationType: personalPDDetais.occupationType || '',
      businessType: personalPDDetais.businessType || '',
      natureOfBusiness: personalPDDetais.natureOfBusiness || '',
      educationalBackground: personalPDDetais.educationalBackground || '',
      weddingAnniversaryDate: personalPDDetais.weddingAnniversaryDate ? this.utilityService.getDateFromString(personalPDDetais.weddingAnniversaryDate) : '',
      noOfYears: noofyears,
      noOfMonths: noofmonths
    })
    console.log(personalPDDetais, 'this.personalDetailsForm', this.personalDetailsForm)
  }

  onValidateWeddingDate(event) {
    if (event.target.value === "2MRGSTS") {
      this.personalDetailsForm.removeControl('weddingAnniversaryDate');
      this.personalDetailsForm.addControl('weddingAnniversaryDate', new FormControl('', [Validators.required]));
    } else {
      this.personalDetailsForm.removeControl('weddingAnniversaryDate')
      this.personalDetailsForm.addControl('weddingAnniversaryDate', new FormControl({ value: '', disabled: true }));
    }
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

  onNavigateNext() {
    if (this.version) {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${this.applicantId}/income-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details`]);
    }
  }

  onNavigateBack() {
    if (this.router.url.includes('/personal-details')) {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
    } else if (this.router.url.includes('/dde')) {
      {
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/pd-list`);
      }
    }
  }

  onFormSubmit(url: string) {

    let formValue = this.personalDetailsForm.getRawValue();

    formValue.applicantFullName = formValue.firstName + ' ' + formValue.middleName + ' ' + formValue.lastName;
    formValue.fatherFullName = formValue.fatherFirstName + ' ' + formValue.fatherMiddleName + ' ' + formValue.fatherLastName;
    formValue.dob = formValue.dob ? this.utilityService.convertDateTimeTOUTC(formValue.dob, 'DD/MM/YYYY') : null;
    formValue.weddingAnniversaryDate = formValue.weddingAnniversaryDate ? this.utilityService.convertDateTimeTOUTC(formValue.weddingAnniversaryDate, 'DD/MM/YYYY') : null;

    if (Number(formValue.noOfYears) == 0 && Number(formValue.noOfMonths) == 0) {
      this.toasterService.showError('Please fill any one of the no of years or months', 'No of years residing at present residence')
      return;
    }

    formValue.noOfYearsResidingInCurrResidence = String((Number(formValue.noOfYears) * 12) + Number(formValue.noOfMonths)) || '';

    if (this.personalDetailsForm.valid) {

      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        applicantPersonalDiscussionDetails: formValue
      };
      this.personaldiscussion.saveOrUpdatePdData(data).subscribe((value: any) => {
        if (value.Error === '0' && value.ProcessVariables.error.code === '0') {
          this.personalPDDetais = value.ProcessVariables.applicantPersonalDiscussionDetails ? value.ProcessVariables.applicantPersonalDiscussionDetails : {};
          this.getLOV();
          this.toasterService.showSuccess('Successfully Save Personal Details', 'Save/Update Personal Details');
        } else {
          this.toasterService.showSuccess(value.ErrorMessage, 'Error Personal Details');
        }
      })

    } else {
      this.isDirty = true;
      this.toasterService.showError('Please enter valid details', 'Personal Details');
      this.utilityService.validateAllFormFields(this.personalDetailsForm);
    }

  }

}
