import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { BankTransactionsService } from '@services/bank-transactions.service';
import { LoanViewService } from '@services/loan-view.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
@Component({
  selector: 'app-income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.css']
})
export class IncomeDetailsComponent implements OnInit {
  incomeDetailsForm: FormGroup;
  labels: any;
  acType: any = [{}]
  private leadId: number;
  applicantId: any;
  version: any;
  LOV: any;
  isDirty: boolean = false;
  pdDetail;
  userId;
  userName: any;
  roleId: any;
  roleType: any;
  roleName: string;
  roles: any;
  isccOdLimit: boolean = false;
  public errorMsg;

  // userDefineFields
  udfScreenId = 'PDS002';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'PDG001';

  applicantDetails: any = [];
  applicant: any;

  searchBankNameList: any = [];
  keyword: string = '';
  getBankBranchDetails: any = [];
  isEnableBranch: boolean = false;
  searchBranchName: any = []

  disableSaveBtn: boolean;
  operationType: any;

  constructor(private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService,
    private loginStoreService: LoginStoreService,
    private formBuilder: FormBuilder,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService,
    private bankTransaction: BankTransactionsService,
    private personalDiscussion: PersonalDiscussionService,
    private commomLovService: CommomLovService) { }

  async ngOnInit() {
    this.getLabels();
    this.initForm();
    this.leadId = (await this.getLeadId()) as number;

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.applicantDetails = leadData['applicantDetails'];

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;

    //this.udfScreenId = this.roleType === 1 ? 'PDS002' : 'PDS006';

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = value.version ? String(value.version) : null;
    });
    this.getLOV();
    this.getIncomeDetails();
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;
      this.udfScreenId = this.roleType === 1 ? udfScreenId.PD.applicantIncomePD : udfScreenId.DDE.incomePDDDE;
    })

    if (this.applicantDetails && this.applicantDetails.length > 0) {
      this.applicantDetails.filter((applicant) => {
        if (applicant.applicantId === this.applicantId) {
          this.applicant = applicant;
          if (applicant.entityTypeKey !== 'INDIVENTTYP') {
            this.incomeDetailsForm.get('grossSalary').clearValidators()
            this.incomeDetailsForm.get('grossSalary').updateValueAndValidity()
            this.incomeDetailsForm.get('netSalary').clearValidators()
            this.incomeDetailsForm.get('netSalary').updateValueAndValidity()
            this.incomeDetailsForm.get('individualIncome').clearValidators()
            this.incomeDetailsForm.get('individualIncome').updateValueAndValidity()
          }
        }
      })
    }


  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.version = value.version ? String(value.version) : null;
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

  getIncomeDetails() {
    const data = {
      pdVersion: this.version,
      applicantId: this.applicantId, /* Uncomment this after getting applicant Id from Lead */
      userId: this.userId,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (value.Error === '0' && processVariables.error.code === '0') {
        this.pdDetail = value.ProcessVariables['incomeDetails'];
        this.isEnableBranch = this.pdDetail.branch ? true : false;
        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];
        if (this.pdDetail) {
          if (value.ProcessVariables['incomeDetails'].typeOfAccount == "4BNKACCTYP") {
            this.isccOdLimit = true;
            this.addCCOd(value.ProcessVariables['incomeDetails'].typeOfAccount)
          }
          this.setFormValue(value.ProcessVariables['incomeDetails']);
        }
        this.operationType = this.toggleDdeService.getOperationType();
        if (this.operationType) {
          this.incomeDetailsForm.disable();
          this.isEnableBranch = false;
          this.disableSaveBtn = true;
        }
    
        if (this.loanViewService.checkIsLoan360()) {
          this.incomeDetailsForm.disable();
          this.isEnableBranch = false;
          this.disableSaveBtn = true;
        }
      }
    });

  }

  initForm() { // initialising the form group
    this.incomeDetailsForm = new FormGroup({
      grossIncome: new FormControl('', Validators.required),
      netIncome: new FormControl('', Validators.required),
      additionalSourceOfIncome: new FormControl('', Validators.required),
      grossSalary: new FormControl('', Validators.required),
      netSalary: new FormControl('', Validators.required),
      individualIncome: new FormControl('', Validators.required),
      typeOfAccount: new FormControl('', Validators.required),
      bankName: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      noOfChequeReturns: new FormControl('', Validators.required),
      cashBankBalance: new FormControl('', Validators.required),
      monthlyInflow: new FormControl('', Validators.required),
      monthlyOutflow: new FormControl('', Validators.required),
      ccHolderFirstName: new FormControl(''),
      ccHolderSecondName: new FormControl(''),
      ccHolderThirdName: new FormControl(''),
      ccHolderFullName: new FormControl({ value: '', disabled: true }),
      ccIssuedBy: new FormControl(''),
      ccLimit: new FormControl('')
    });
  }

  setFormValue(incomeDetails) {
    this.incomeDetailsForm.patchValue({
      grossIncome: incomeDetails.grossIncome || '',
      netIncome: incomeDetails.netIncome || '',
      additionalSourceOfIncome: incomeDetails.additionalSourceOfIncome || '',
      grossSalary: incomeDetails.grossSalary || '',
      netSalary: incomeDetails.netSalary || '',
      individualIncome: incomeDetails.individualIncome || '',
      typeOfAccount: incomeDetails.typeOfAccount || '',
      bankName: incomeDetails.bankName || '',
      branch: incomeDetails.branch || '',
      accountNumber: incomeDetails.accountNumber || '',
      ccOdLimit: incomeDetails.ccOdLimit || '',
      noOfChequeReturns: incomeDetails.noOfChequeReturns || '',
      cashBankBalance: incomeDetails.cashBankBalance || '',
      monthlyInflow: incomeDetails.monthlyInflow || '',
      monthlyOutflow: incomeDetails.monthlyOutflow || '',
      ccHolderFirstName: incomeDetails.ccHolderFirstName || '',
      ccHolderSecondName: incomeDetails.ccHolderSecondName || '',
      ccHolderThirdName: incomeDetails.ccHolderThirdName || '',
      ccHolderFullName: incomeDetails.ccHolderFullName || '',
      ccIssuedBy: incomeDetails.ccIssuedBy || '',
      ccLimit: incomeDetails.ccLimit || ''
    })
  }
  ccOd: FormGroup = this.formBuilder.group({
    ccOdLimit: ['', Validators.required]
  });

  addCCOd(data) {
    if (data == "4BNKACCTYP") {
      this.isccOdLimit = true;
      this.incomeDetailsForm.addControl('ccOdLimit', this.formBuilder.control('', [Validators.required]));
    } else {
      this.isccOdLimit = false;
      this.incomeDetailsForm.removeControl('ccOdLimit');
    }
  }

  onNavigateNext() {
    if (this.version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/reference-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/reference-details`]);
    }
  }

  onNavigateBack() {
    if (this.version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/personal-details/${this.version}`]);
    } else {
      this.router.navigateByUrl(`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/personal-details`);
    }
  }

  onFormSubmit(url: string) {

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.incomeDetailsForm.valid && isUdfField) {

      this.incomeDetailsForm.value['ccHolderFullName'] = this.incomeDetailsForm['controls']['ccHolderFirstName'].value + ' '
        + this.incomeDetailsForm['controls']['ccHolderSecondName'].value + ' ' +
        this.incomeDetailsForm['controls']['ccHolderThirdName'].value
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId, /* Uncomment this after getting applicant Id from Lead */
        userId: this.userId,
        incomeDetails: this.incomeDetailsForm.value,
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
      this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
        if (res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Record Saved Successfully', '');
        } else {
          this.toasterService.showError('invalid save', 'message');
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showWarning('please enter required details', '');
      return;
    }
  }

  onSaveuserDefinedFields(val) {
    this.userDefineForm = val;
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

      setTimeout(() => {
      if (this.searchBankNameList.length === 0) {
        this.toasterService.showInfo('Please enter valid bank name', '')
      }
    }, 1000)

    }
  }

  selectBankNameEvent(val) {
    if (val) {
      let data = {
        "bankName": val
      }

      this.bankTransaction.getBranchDetails(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.getBankBranchDetails = res.ProcessVariables.bankDetails ? res.ProcessVariables.bankDetails : [];
          this.incomeDetailsForm.get('branch').setValue('')
          this.isEnableBranch = res.ProcessVariables.bankDetails && res.ProcessVariables.bankDetails.length > 0 ? true : false
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, '')
          this.isEnableBranch = false;
        }
      })
    }
  }

  onChangeBranch(val) {
    if (val && val.trim().length > 0) {
      this.searchBranchName = this.getBankBranchDetails.filter(e => {
        val = val.toString().toLowerCase();
        const eName = e.branchName.toString().toLowerCase();
        if (eName.includes(val)) {
          this.keyword = 'branchName';
          return e;
        }
      });

      if (this.searchBranchName.length === 0) {
        this.incomeDetailsForm.get('branch').setErrors({ incorrect: true })
        this.toasterService.showInfo('Please enter valid branch', '')
      }

    }
  }

  selectBranch(val) {
    setTimeout(() => {
      this.incomeDetailsForm.get('branch').setValue(val.branchName)
      this.incomeDetailsForm.get('branch').setErrors(null)
    }, 1000)
  }

  onBankNameClear(val) {
    this.incomeDetailsForm.get('branch').setValue(null);
    this.searchBranchName = [];
    this.searchBankNameList = [];
  }

}
