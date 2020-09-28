import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  constructor(private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private loginStoreService: LoginStoreService,
    private formBuilder: FormBuilder,
    private personalDiscussion: PersonalDiscussionService,
    private commomLovService: CommomLovService) { }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data.default;
        // console.log('in labels data', this.labels);
      },
      error => {
        this.errorMsg = error;
      });
  }


  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    //  this.standardOfLiving = this.LOV.LOVS['fi/PdHouseStandard'].filter(data => data.value !== 'Very Good');
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log(value.version);
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
      // leadId: this.leadId,
      pdVersion: this.version,
      applicantId: this.applicantId, /* Uncomment this after getting applicant Id from Lead */
      userId: this.userId,
    };

    this.personalDiscussion.getPdData(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      if (processVariables.error.code === '0') {
        this.pdDetail = value.ProcessVariables['incomeDetails'];
        console.log('PD Details', this.pdDetail);
        if (value.ProcessVariables['incomeDetails'].typeOfAccount == "4BNKACCTYP") {
          this.isccOdLimit = true;
          this.addCCOd(value.ProcessVariables['incomeDetails'].typeOfAccount)
        }
        this.setFormValue(value.ProcessVariables['incomeDetails']);
      }
    });

  }

  initForm() { // initialising the form group
    this.incomeDetailsForm = new FormGroup({
      // applicantName: new FormControl({ value: this.applicantFullName, disabled: true }),
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
      //  ccOdLimit: new FormControl('', Validators.required),
      // ifCcOdLimit: new FormControl('', Validators.required),
      noOfChequeReturns: new FormControl('', Validators.required),
      cashBankBalance: new FormControl('', Validators.required),
      monthlyInflow: new FormControl('', Validators.required),
      monthlyOutflow: new FormControl('', Validators.required),
      ccHolderFirstName: new FormControl('', Validators.required),
      ccHolderSecondName: new FormControl(''),
      ccHolderThirdName: new FormControl('', Validators.required),
      ccHolderFullName: new FormControl({ value: '', disabled: true }),
      ccIssuedBy: new FormControl('', Validators.required),
      ccLimit: new FormControl('', Validators.required)
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
      // ifCcOdLimit: incomeDetails,
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
    if (this.incomeDetailsForm.invalid) {
      this.isDirty = true;
      console.log('in invalid ref checkform', this.incomeDetailsForm);
      this.toasterService.showWarning('please enter required details', '');
      return;
    }
    this.incomeDetailsForm.value['ccHolderFullName'] = this.incomeDetailsForm['controls']['ccHolderFirstName'].value + ' '
      + this.incomeDetailsForm['controls']['ccHolderSecondName'].value + ' ' +
      this.incomeDetailsForm['controls']['ccHolderThirdName'].value
    const data = {
      leadId: this.leadId,
      // applicantId: 6,
      applicantId: this.applicantId, /* Uncomment this after getting applicant Id from Lead */
      userId: this.userId,
      incomeDetails: this.incomeDetailsForm.value
    };
    this.personalDiscussion.saveOrUpdatePdData(data).subscribe((res: any) => {
      console.log('save or update PD Response', res);
      if (res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
      } else {
        this.toasterService.showError('ivalid save', 'message');
      }
    });
  }


  async ngOnInit() {
    this.getLabels();
    this.initForm();
    this.leadId = (await this.getLeadId()) as number;

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);
    console.log('user id ==>', this.userId)

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log(value.version)
      this.version = value.version ? String(value.version) : null;
    });
    this.getLOV();
    this.getIncomeDetails();
  }

}
