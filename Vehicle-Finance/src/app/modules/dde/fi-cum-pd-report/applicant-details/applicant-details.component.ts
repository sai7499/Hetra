import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ApplicantDetails } from '@model/dde.model';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';
import { FicumpdPdfService } from '@services/ficumpd-pdf.service';
import { PdDataService } from '../pd-data.service';
import { BankTransactionsService } from '@services/bank-transactions.service';

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
  leadDetails: any;
  applicantData: any;
  applicantFullName: any;
  mobileNo: any;
  serviceApplicantFullName: string;
  serviceMoblieNo: string;
  standardOfLiving: any;
  version: any;
  roleName: string;
  data: any;
  userId: number;
  roles: any;
  leadId: number;
  leadData: {};
  roleId: any;
  roleType: any;
  disableSaveBtn: boolean;
  operationType: boolean;
  ownerShipType: any;
  ownerNamePropertyAreaRequired: boolean;
  ownerNamePropertyAreaDisabled: boolean;
  resAddressType: any;
  addressRequired: boolean;
  dobOrDio: any;
  serviceDobOrDio: any;

  // userDefineFields
  udfScreenId = 'FPS001';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'FPG001';
  entityType: any;
  isNonInd: boolean;

  searchBankNameList: any = [];
  keyword: string;

  constructor(private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private commomLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private personaldiscussion: PersonalDiscussionService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private createLeadDataService: CreateLeadDataService,
    private toggleDdeService: ToggleDdeService,
    private bankTransaction: BankTransactionsService,
    private loanViewService: LoanViewService,
    private ficumpdPdfService: FicumpdPdfService,
    private pdDataService: PdDataService

  ) { }

  async ngOnInit() {

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    //  details from loginstore service
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    //this.udfScreenId = this.roleType === 1 ? 'FPS001' : 'FPS005';
    this.operationType = this.toggleDdeService.getOperationType();

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });

    this.initForm();
    this.leadId = (await this.getLeadId()) as number; // calling get lead id fun at line 148
    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType === 1 ? udfScreenId.FICUMPD.applicantDetailFIcumPD : udfScreenId.DDE.applicantDetailsFIcumPDDDE;

    })

  }

  getLeadId() {  // fun to get lead id from router
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.standardOfLiving = this.LOV.LOVS['fi/PdHouseStandard']
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
      this.getLeadSectionData(); // calling get lead section data function
      this.getPdDetails();
    });
  }

  // getting lead data from create lead data service

  async getLeadSectionData() { // fun to get all data related to a particular lead from create lead service
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    this.leadData = { ...leadSectionData };
    const data = this.leadData;

    for (const value of data['applicantDetails']) {  // for loop to get the respective applicant details form applicant details array
      if (value['applicantId'] === this.applicantId) {

        const applicantDetailsFromLead = value;
        this.serviceApplicantFullName = applicantDetailsFromLead['fullName'];
        if (applicantDetailsFromLead['entityTypeKey'] === "NONINDIVENTTYP") {
          this.serviceMoblieNo = applicantDetailsFromLead['companyPhoneNumber'] ? applicantDetailsFromLead['companyPhoneNumber'] : '';
          this.serviceDobOrDio = applicantDetailsFromLead['doi'] ? this.reformatDate((applicantDetailsFromLead['doi']).slice(0, 10)) : '';

        } else if (applicantDetailsFromLead['entityTypeKey'] === "INDIVENTTYP") {
          this.serviceMoblieNo = applicantDetailsFromLead['mobileNumber'] ? applicantDetailsFromLead['mobileNumber'] : '';
          this.serviceDobOrDio = applicantDetailsFromLead['dob'] ? this.reformatDate((applicantDetailsFromLead['dob']).slice(0, 10)) : '';
        }
      }
    }
  }

  reformatDate(oldDate) {
    return oldDate.toString().split('-').reverse().join('/');
  }

  houseOwnerShip(event: any) {
    this.ownerShipType = event;
    const owner = this.applicantForm.get('owner').value;
    const areaOfProperty = this.applicantForm.get('areaOfProperty').value;
    const propertyValue = this.applicantForm.get('propertyValue').value;

    if (this.ownerShipType === '1HOUOWN'|| this.ownerShipType === '7HOUOWN' || this.ownerShipType === '9HOUOWN' ||
        this.ownerShipType === '5HOUOWN') {
      this.ownerNamePropertyAreaRequired = true;
      this.ownerNamePropertyAreaDisabled = false;
      this.applicantForm.get('owner').enable();
      this.applicantForm.get('owner').updateValueAndValidity();
      this.applicantForm.get('areaOfProperty').enable();
      this.applicantForm.get('areaOfProperty').updateValueAndValidity();
      this.applicantForm.get('propertyValue').enable();
      this.applicantForm.get('propertyValue').updateValueAndValidity();
      setTimeout(() => {
        this.applicantForm.get('owner').patchValue(owner || null);
        this.applicantForm.get('areaOfProperty').patchValue(areaOfProperty || null);
        this.applicantForm.get('propertyValue').patchValue(propertyValue || null);
      });
      if (this.isNonInd) {
        return;
      }
      this.applicantForm.get('owner').setValidators(Validators.required);
      this.applicantForm.get('owner').updateValueAndValidity();

      this.applicantForm.get('areaOfProperty').setValidators(Validators.required);
      this.applicantForm.get('areaOfProperty').updateValueAndValidity();

      this.applicantForm.get('propertyValue').setValidators(Validators.required);
      this.applicantForm.get('propertyValue').updateValueAndValidity();

    } else {
      // if (this.ownerShipType !== '1HOUOWN' || this.ownerShipType !== '2HOUOWN' ||
      // this.ownerShipType !== '4HOUOWN' || this.ownerShipType !== '9HOUOWN' ||
      // this.ownerShipType !== '5HOUOWN' || this.ownerShipType !== '7HOUOWN') 
      this.ownerNamePropertyAreaRequired = false;
      this.ownerNamePropertyAreaDisabled = true;
      setTimeout(() => {
        this.applicantForm.get('owner').setValue(null);
        this.applicantForm.get('areaOfProperty').setValue(null);
        this.applicantForm.get('propertyValue').setValue(null);
      });
      this.applicantForm.get('owner').disable();
      this.applicantForm.get('areaOfProperty').disable();
      this.applicantForm.get('propertyValue').disable();
      if (this.isNonInd) {
        return;
      }
      this.applicantForm.get('owner').clearValidators();
      this.applicantForm.get('owner').updateValueAndValidity();

      this.applicantForm.get('areaOfProperty').clearValidators();
      this.applicantForm.get('areaOfProperty').updateValueAndValidity();

      this.applicantForm.get('propertyValue').clearValidators();
      this.applicantForm.get('propertyValue').updateValueAndValidity();
    }
  }

  resAddress(event: any) {
    this.resAddressType = event ? event : event;
    if (this.resAddressType === '2') {
      this.addressRequired = true;
      this.applicantForm.get('alternateAddr').enable();
      if (this.isNonInd) {
        return;
      }
      this.applicantForm.get('alternateAddr').setValidators(Validators.required);
      this.applicantForm.get('alternateAddr').updateValueAndValidity();
    } else {
      this.addressRequired = false;
      setTimeout(() => {
        this.applicantForm.get('alternateAddr').setValue(null);
      });

      this.applicantForm.get('alternateAddr').disable();
      if (this.isNonInd) {
        return;
      }
      this.applicantForm.get('alternateAddr').clearValidators();
      this.applicantForm.get('alternateAddr').updateValueAndValidity();

    }
  }
  initForm() { // initialising the form group
    this.applicantForm = new FormGroup({
      applicantName: new FormControl({ value: '', disabled: true }),
      fatherFullName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      maritalStatus: new FormControl('', Validators.required),
      dob: new FormControl({ value: '', disabled: true }),
      physicallyChallenged: new FormControl('', Validators.required),
      dependants: new FormControl('', Validators.required),
      residancePhoneNumber: new FormControl('', Validators.required),
      officePhoneNumber: new FormControl('', Validators.required),
      mobile: new FormControl({ value: '', disabled: true }),
      residenceAddressAsPerLoanApplication: new FormControl('', Validators.required),
      alternateAddr: new FormControl(''),
      bankName: new FormControl(null, Validators.required),
      accountNumber: new FormControl('', Validators.required),
      landmark: new FormControl('', Validators.required),
      addressAccessibility: new FormControl('', Validators.required),
      residentialLocality: new FormControl('', Validators.required),
      residentialType: new FormControl('', Validators.required),
      houseType: new FormControl('', Validators.required),
      sizeOfHouse: new FormControl('', Validators.required),
      standardOfLiving: new FormControl('', Validators.required),
      houseOwnership: new FormControl('', Validators.required),
      ownerProofAvail: new FormControl('', Validators.required),
      areaOfProperty: new FormControl(''),
      propertyValue: new FormControl(''),
      owner: new FormControl(''),
      ratingbySO: new FormControl('', Validators.required)
    });
  }

  setFormValue() { // patching the form values
    const applicantModal = this.applicantPdDetails || {};

    if (this.applicantDetails) {
      this.dobOrDio = this.applicantDetails.dob ? this.applicantDetails.dob : this.serviceDobOrDio;
      this.applicantFullName = this.applicantDetails.applicantName ? this.applicantDetails.applicantName : this.serviceApplicantFullName;
      this.mobileNo = this.applicantDetails.mobile ? this.applicantDetails.mobile : this.serviceMoblieNo;
    } else {
      this.dobOrDio = this.serviceDobOrDio;
      this.mobileNo = this.serviceMoblieNo;
    }

    this.applicantForm.patchValue({
      applicantName: this.serviceApplicantFullName ? this.serviceApplicantFullName : null,
      fatherFullName: applicantModal.fatherFullName ? applicantModal.fatherFullName : applicantModal.husbandFullName,
      gender: applicantModal.gender || '',
      maritalStatus: applicantModal.maritalStatus || '',
      dob: this.dobOrDio ? this.dobOrDio : null,
      physicallyChallenged: applicantModal.physicallyChallenged || '',
      dependants: applicantModal.dependants || '',
      residancePhoneNumber: applicantModal.residancePhoneNumber || '',
      officePhoneNumber: applicantModal.officePhoneNumber || '',
      mobile: this.mobileNo ? this.mobileNo : null,
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
      ownerProofAvail: applicantModal.ownerProofAvail || '',
      owner: applicantModal.owner || '',
      propertyValue: applicantModal.propertyValue || '',
      areaOfProperty: applicantModal.areaOfProperty || '',
      ratingbySO: applicantModal.ratingbySO || '',
      alternateAddr: applicantModal.alternateAddr || ''
    });

    setTimeout(() => {
      this.entityType = this.pdDataService.getFiCumPdApplicantType();
      if (this.entityType !== 'Individual') {
        this.isNonInd = true
      } else {
        // this.onBankNameSearch(applicantModal.bankName)
        this.isNonInd = false
      }
      if (this.isNonInd) {
        const grp = this.applicantForm.controls;
        for (const key in grp) {
          this.applicantForm.get(key).clearValidators();
          this.applicantForm.get(key).updateValueAndValidity();
        }
      }
    })
  }

  getPdDetails() { // function to get the pd details with respect to applicant id
    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personaldiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (value.Error === '0' && processVariables.error.code === '0') {

        this.applicantPdDetails = value.ProcessVariables.applicantPersonalDiscussionDetails;

        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];
        this.setFormValue();
        if (this.applicantPdDetails && this.applicantPdDetails.maritalStatus) {
          this.setMaritalStatusValue(this.applicantPdDetails.maritalStatus);
        }

        if (this.applicantPdDetails) {

          this.ficumpdPdfService.setApplicantPdDetails(this.applicantPdDetails);
          // this.pdDataService.setCustomerProfile(this.applicantPdDetails);
        }
        if (this.applicantForm.get('residenceAddressAsPerLoanApplication') != null) {
          this.resAddress(this.applicantForm.get('residenceAddressAsPerLoanApplication').value);
        }
        if (this.applicantForm.get('houseOwnership') != null) {
          this.houseOwnerShip(this.applicantForm.get('houseOwnership').value);
        }
        if (this.operationType) {
          this.applicantForm.disable();
          this.disableSaveBtn = true;
        }
    
        if (this.loanViewService.checkIsLoan360()) {
          this.applicantForm.disable();
          this.disableSaveBtn = true;
        }
      }
    });
  }

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
  }

  onFormSubmit(action) { // fun that submits all the pd data
    if (this.operationType) {
      this.onNavigateNext();
      return;
    }

    const formModal = this.applicantForm.getRawValue();
    const applicantFormModal = { ...formModal };

    this.applicantDetails = {
      applicantName: this.applicantFullName || applicantFormModal.applicantName,
      fatherFullName: applicantFormModal.fatherFullName ? applicantFormModal.fatherFullName : applicantFormModal.husbandFullName,
      gender: applicantFormModal.gender,
      maritalStatus: applicantFormModal.maritalStatus,
      physicallyChallenged: applicantFormModal.physicallyChallenged,
      dob: this.dobOrDio ? this.dobOrDio : null,
      dependants: applicantFormModal.dependants,
      residancePhoneNumber: applicantFormModal.residancePhoneNumber,
      officePhoneNumber: applicantFormModal.officePhoneNumber,
      mobile: this.mobileNo,
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
      owner: applicantFormModal.owner,
      propertyValue: applicantFormModal.propertyValue,
      areaOfProperty: applicantFormModal.areaOfProperty,
      ownerProofAvail: applicantFormModal.ownerProofAvail,
      ratingbySO: applicantFormModal.ratingbySO,
      alternateAddr: applicantFormModal.alternateAddr
    };

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.applicantForm.valid && isUdfField) {
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        applicantPersonalDiscussionDetails: this.applicantDetails,
        udfDetails: [
          {
            "udfGroupId": this.udfGroupId,
            // "udfScreenId": this.udfScreenId,
            "udfData": JSON.stringify(
              this.userDefineForm && this.userDefineForm.udfData ?
                this.userDefineForm.udfData.getRawValue() : {}
            )
          }
        ]
      };

      this.personaldiscussion.saveOrUpdatePdData(data).subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        const message = value.ErrorMessage ? value.ErrorMessage : processVariables.error.message;
        if (processVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.getPdDetails();
          if (action === 'next') {
            if (this.version != 'undefined') {
              this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile/${this.version}`]);
            } else {
              this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile`]);
            }
          }
        } else {
          this.toasterService.showError(message, 'message');
        }
      });
    } else {
      this.isDirty = true;
      console.log(this.applicantForm, 'Form')
      this.toasterService.showError(!this.applicantForm.get('bankName').valid ? 'please enter valid bank name' : 'please enter required details', '');
    }
  }

  onNavigateNext() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile/${this.version}`]);
    } else {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/fi-cum-pd-list/${this.applicantId}/customer-profile`]);
    }
  }

  onNavigateBack() {
    if (this.version != 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list`]);
    } else {
      this.router.navigateByUrl(`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`);
    }
  }
  setMaritalStatusValue(status) {
    const details = this.applicantForm;
    if (status === '1MRGSTS') {
      details.get('dependants').clearValidators();
      details.get('dependants').updateValueAndValidity();
      const depValue = details.value.dependants;
      details.get('dependants').setValue(depValue || null);

    } else {
      details.get('dependants').setValidators(Validators.required);
      details.get('dependants').updateValueAndValidity();

    }
  }

  onBankNameSearch(val: any) {

    if (val && val.trim().length > 0) {

      let data = {
        "bankName": val.trim()
      }

      this.bankTransaction.getBankName(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.searchBankNameList = res.ProcessVariables.bankNames ? res.ProcessVariables.bankNames : [];
          this.keyword = 'searchBankNameList';
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Bank List')
        }
      })

      this.applicantForm.get('bankName').setErrors({ incorrect: true })

      setTimeout(() => {
        if (this.searchBankNameList.length === 0) {
          this.toasterService.showInfo('Please enter valid bank name', '')
        }
      }, 1000)
    }
  }

  selectBankNameEvent(val) {
    this.applicantForm.get('bankName').setValue(val)
    this.applicantForm.get('bankName').setErrors(null)
  }

}
