import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { PdcServiceService } from '@services/pdc-service.service';
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanCreationService } from '@services/loan-creation.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { BankTransactionsService } from '@services/bank-transactions.service';

@Component({
  selector: 'app-pdc-details',
  templateUrl: './pdc-details.component.html',
  styleUrls: ['./pdc-details.component.css'],
})
export class PdcDetailsComponent implements OnInit {
  roleId: any;
  roleType: any;
  leadId: any;
  pdcArray: any;
  spdcArray: any;
  pdcForm: any;
  labels: any;
  isDirty: boolean = false;
  toDayDate = new Date();

  json: any;
  showPdc = false;
  showSpdc = false;
  lovData: any;
  rowIndex: number;
  leadData: any;
  acceptanceDate: any;
  submitted = false;
  pdcCount: any;
  spdcCount: any;
  showPdcButton = false;
  showspdcButton: boolean;
  negotiatedEmi: any;
  taskId: any;

  // User defined
  udfScreenId: any;
  udfGroupId: any = 'PCG001';
  udfDetails: any = [];
  userDefineForm: any;
  repaymentMode: any;
  pdcSpdcData: any;

  // 
  searchBankNameList: any = [];
  getBankBranchDetails: any = [];
  searchBranchName: any = [];
  keyword: string = '';

  constructor(
    private loginStoreService: LoginStoreService,
    private cpcService: CpcRolesService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private labelsService: LabelsService,
    private fb: FormBuilder, private bankTransaction: BankTransactionsService,
    private pdcService: PdcServiceService,
    private utilityService: UtilityService,
    private lovService: CommomLovService,
    private loanCreationService: LoanCreationService,
    private leadDataService: CreateLeadDataService,
    private sharedService: SharedService
  ) {
    this.pdcArray = this.fb.array([]);
    this.spdcArray = this.fb.array([]);
  }

  async ngOnInit() {
    this.leadData = this.leadDataService.getLeadSectionData();
    this.acceptanceDate = this.leadData.leadDetails.custAcceptedDate;
    if (!this.acceptanceDate) {
      this.toDayDate = this.utilityService.getDateFromString(
        this.leadData.leadDetails.leadCreatedOn
      );
    } else {
      this.toDayDate = this.utilityService.getDateFromString(
        this.utilityService.getDateFormat(this.toDayDate)
      );
    }
    console.log(this.toDayDate, ' lead Data onit');

    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.pdcForm = this.fb.group({
      pdcList: this.pdcArray,
      spdcList: this.spdcArray,
    });
    this.leadId = (await this.getLeadId()) as number;
    this.labelsService.getLabelsData().subscribe((res: any) => {
      this.labels = res;
    });

    this.getPdcDetails();

    this.lovService.getLovData().subscribe((res: any) => {
      this.lovData = res.LOVS;
    });

    this.labelsService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType == '5' ? udfScreenId.CPCChecker.pdcDetailsCPCChecker : udfScreenId.CPCMaker.pdcDetailsCPCMaker;

    })
    console.log(this.pdcForm, 'pdcData')
  }
  get f() {
    return this.pdcForm.controls;
  }
  private initRows() {
    return this.fb.group({
      pdcId: [null],
      emiAmount: new FormControl(this.negotiatedEmi, [Validators.required]),
      instrNo: [null, Validators.required],
      instrDate: [null, Validators.required],
      instrBankName: [null, Validators.required],
      instrBranchName: [null, Validators.required],
      instrBranchAccountNumber: [null, Validators.required],
      instrAmount: [null, Validators.required],
      isEnableBranch: false
    });
  }
  private initSpdcRows() {
    return this.fb.group({
      pdcId: [null],
      emiAmount: new FormControl(this.negotiatedEmi, [Validators.required]),
      instrNo: [null, Validators.required],
      instrDate: [null],
      instrBankName: [null, Validators.required],
      instrBranchName: [null, Validators.required],
      instrBranchAccountNumber: [null, Validators.required],
      instrAmount: [null, Validators.required],
      isEnableBranch: false
    });
  }
  addPdcUnit(data?: any) {
    const control = this.pdcForm.controls.pdcList as FormArray;
    control.push(this.initRows());
    this.onRepaymentSI();
  }
  addSPdcUnit(data?: any) {
    const control = this.pdcForm.controls.spdcList as FormArray;
    control.push(this.initSpdcRows());
    this.onRepaymentSI();
  }
  deleteRows(table: string) {
    // tslint:disable-next-line: prefer-const
    let i = this.rowIndex;
    console.log(table, i);
    const stringValue1 = this.pdcForm.value[table];
    // tslint:disable-next-line: prefer-const
    let getId = stringValue1[i].pdcId ? stringValue1[i].pdcId : null;
    const body = {
      pdcId: getId,
    };

    //  array.removeAt(i);
    if (table && getId) {
      this.pdcService.deletePdcDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Record Deleted Succesfully', '');
          this.getPdcDetails();
        } else {
          this.toasterService.showSuccess(
            res.ProcessVariables.error.message,
            ''
          );
        }
      });
      // tslint:disable-next-line: triple-equals
    } else if ((getId === null || getId === undefined) && table == 'pdcList') {
      const array = this.pdcForm.get('pdcList') as FormArray;
      array.removeAt(i);
      // tslint:disable-next-line: triple-equals
    } else if ((getId === null || getId === undefined) && table == 'spdcList') {
      const array = this.pdcForm.get('spdcList') as FormArray;
      array.removeAt(i);
    }
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  submitTocpc() {
    if (this.pdcForm.invalid) {
      this.toasterService.showError('Save before Submitting', '');
      return;
    }
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '4') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: true,
        sendBackToCredit: false,
        taskId: this.taskId,
      };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Submitted Sucessfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
      });
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: false,
        sendBackToCredit: false,
        taskId: this.taskId,
      };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Submitted Sucessfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
      });
    }
  }
  sendBackToCredit() {
    // if (this.pdcForm.invalid) {
    //   this.toasterService.showError('Save before Submitting', '');
    //   return;
    // }
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true,
      taskId: this.taskId,
    };
    // tslint:disable-next-line: deprecation
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Submitted Sucessfully', '');
        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

  onSave(dataString: string) {
    for (let i = 0; i < this.pdcForm.controls.pdcList.length; i++) {

      // tslint:disable-next-line: prefer-const
      let value = this.pdcForm.controls.pdcList.controls[i]['controls']['instrDate'].value;
      this.pdcForm.controls.pdcList.controls[i].value.instrDate = value
        ? this.utilityService.getDateFormat(value)
        : null;
    }
    for (let i = 0; i < this.pdcForm.controls.spdcList.length; i++) {
      let datevalue = this.pdcForm.controls.spdcList.controls[i]['controls']['instrDate'].value;

      this.pdcForm.controls.spdcList.controls[i].value.instrDate = datevalue
        ? this.utilityService.getDateFormat(datevalue)
        : null;
    }

    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      ...this.pdcForm.value,
      udfDetails: [{
        "udfGroupId": this.udfGroupId,
        // "udfScreenId": this.udfScreenId,
        "udfData": JSON.stringify(this.userDefineForm.udfData.getRawValue())
      }]
    };
    if (this.pdcForm.invalid || this.userDefineForm.udfData.invalid) {
      this.isDirty = true;
      this.toasterService.showWarning('Mandatory Fields Missing', '');
      return;
    }
    this.pdcService.savePdcDetails(body).subscribe((res: any) => {
      console.log(res);
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        // this.getData(res.ProcessVariables);
        this.toasterService.showSuccess('Record Saved Successfully', '');
        // tslint:disable-next-line: triple-equals
        if (dataString == 'save') {
          this.getPdcDetails();
          // tslint:disable-next-line: triple-equals
        } else if (dataString == 'cpc') {
          this.submitTocpc();
        }
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }

  onBack() {
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([
        `pages/cpc-checker/${this.leadId}/sanction-details`,
      ]);
    }
  }
  onNext() {
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '4') {
      // this.router.navigate([`pages/cpc-maker/${this.leadId}/check-list`]);
      // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '5') {
      this.router.navigate([`pages/cpc-checker/${this.leadId}/negotiation`]);
    }
  }
  getData(data: any, pdcCount: any, spdcCount: any) {
    // const data = JSON.parse(localStorage.getItem('pdcData'));
    // this.pdcForm.controls.pdcList.controls = [];
    // this.pdcForm.controls.spdcList.controls = [];
    pdcCount = pdcCount;
    spdcCount = spdcCount;
    if (data) {
      const spdcControl = this.pdcForm.controls.spdcList as FormArray;
      const PdcControl = this.pdcForm.controls.pdcList as FormArray;

      // tslint:disable-next-line: triple-equals
      if (pdcCount != '' && pdcCount != null) {
        for (let i = 0; i < pdcCount; i++) {
          this.addPdcUnit();
          //this.removeInstAmtValidator()
        }
        if (data.pdcList != null) {
          for (let i = 0; i < pdcCount; i++) {
            PdcControl.at(i).patchValue({
              pdcId: data.pdcList[i].pdcId ? data.pdcList[i].pdcId : '',
              instrType: data.pdcList[i].instrType
                ? data.pdcList[i].instrType
                : '',
              emiAmount: data.pdcList[i].emiAmount
                ? data.pdcList[i].emiAmount
                : this.negotiatedEmi,
              instrNo: data.pdcList[i].instrNo ? data.pdcList[i].instrNo : '',
              instrDate: data.pdcList[i].instrDate
                ? this.utilityService.getDateFromString(
                  data.pdcList[i].instrDate
                )
                : '',
              instrBankName: data.pdcList[i].instrBankName
                ? data.pdcList[i].instrBankName
                : '',
              instrBranchName: data.pdcList[i].instrBranchName
                ? data.pdcList[i].instrBranchName
                : '',
              instrBranchAccountNumber: data.pdcList[i].instrBranchAccountNumber
                ? data.pdcList[i].instrBranchAccountNumber
                : '',
              instrAmount: data.pdcList[i].instrAmount
                ? data.pdcList[i].instrAmount
                : '',
            });
          }
        }
        // tslint:disable-next-line: triple-equals
      } else if (pdcCount == '' && data.pdcList) {
        this.showPdcButton = true;
        for (let i = 0; i < data.pdcList.length; i++) {
          this.addPdcUnit();
          PdcControl.at(i).patchValue({
            pdcId: data.pdcList[i].pdcId ? data.pdcList[i].pdcId : '',
            instrType: data.pdcList[i].instrType
              ? data.pdcList[i].instrType
              : '',
            emiAmount: data.pdcList[i].emiAmount
              ? data.pdcList[i].emiAmount
              : this.negotiatedEmi,
            instrNo: data.pdcList[i].instrNo ? data.pdcList[i].instrNo : '',
            instrDate: data.pdcList[i].instrDate
              ? this.utilityService.getDateFromString(data.pdcList[i].instrDate)
              : '',
            instrBankName: data.pdcList[i].instrBankName
              ? data.pdcList[i].instrBankName
              : '',
            instrBranchName: data.pdcList[i].instrBranchName
              ? data.pdcList[i].instrBranchName
              : '',
            instrBranchAccountNumber: data.pdcList[i].instrBranchAccountNumber
              ? data.pdcList[i].instrBranchAccountNumber
              : '',
            instrAmount: data.pdcList[i].instrAmount
              ? data.pdcList[i].instrAmount
              : '',
          });
        }
      } else {
        this.addPdcUnit();
        this.showPdcButton = true;
      }
      
      // tslint:disable-next-line: triple-equals
      if (spdcCount != '' && spdcCount != null) {
        for (let i = 0; i < spdcCount; i++) {
          this.addSPdcUnit();
        }
        if (data.spdcList) {
          for (let j = 0; j < data.spdcList.length; j++) {
            spdcControl.at(j).patchValue({
              pdcId: data.spdcList[j].pdcId ? data.spdcList[j].pdcId : '',
              instrType: data.spdcList[j].instrType
                ? data.spdcList[j].instrType
                : '',
              emiAmount: data.spdcList[j].emiAmount
                ? data.spdcList[j].emiAmount
                : this.negotiatedEmi,
              instrNo: data.spdcList[j].instrNo
                ? data.spdcList[j].instrNo
                : '',
              instrDate: data.spdcList[j].instrDate
                ? this.utilityService.getDateFromString(
                  data.spdcList[j].instrDate
                )
                : '',
              instrBankName: data.spdcList[j].instrBankName
                ? data.spdcList[j].instrBankName
                : '',
              instrBranchName: data.spdcList[j].instrBranchName
                ? data.spdcList[j].instrBranchName
                : '',
              instrBranchAccountNumber: data.spdcList[j]
                .instrBranchAccountNumber
                ? data.spdcList[j].instrBranchAccountNumber
                : '',
              instrAmount: data.spdcList[j].instrAmount
                ? data.spdcList[j].instrAmount
                : '',
            });
          }
        }

        // tslint:disable-next-line: triple-equals
      } else if (data.spdcList && spdcCount == '') {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < data.spdcList.length; j++) {
          this.addSPdcUnit();
          spdcControl.at(j).patchValue({
            pdcId: data.spdcList[j].pdcId ? data.spdcList[j].pdcId : '',
            instrType: data.spdcList[j].instrType
              ? data.spdcList[j].instrType
              : '',
            emiAmount: data.spdcList[j].emiAmount
              ? data.spdcList[j].emiAmount
              : this.negotiatedEmi,
            instrNo: data.spdcList[j].instrNo ? data.spdcList[j].instrNo : '',
            instrDate: data.spdcList[j].instrDate
              ? this.utilityService.getDateFromString(
                data.spdcList[j].instrDate
              )
              : '',
            instrBankName: data.spdcList[j].instrBankName
              ? data.spdcList[j].instrBankName
              : '',
            instrBranchName: data.spdcList[j].instrBranchName
              ? data.spdcList[j].instrBranchName
              : '',
            instrBranchAccountNumber: data.spdcList[j].instrBranchAccountNumber
              ? data.spdcList[j].instrBranchAccountNumber
              : '',
            instrAmount: data.spdcList[j].instrAmount
              ? data.spdcList[j].instrAmount
              : '',
          });
        }
      } else {
        this.showspdcButton = true;
        this.addSPdcUnit();
      }
    }

    // if (this.pdcForm.get('pdcList').value.length >= 1) {
    //   for (let i = 1; i < this.pdcForm.get('pdcList').length; i++) {
    //     this.pdcForm.get('pdcList').controls[i].disable()
    //   }
    // }

    // if (this.pdcForm.get('spdcList').value.length >= 1) {
    //   for (let j = 1; j < this.pdcForm.get('spdcList').length; j++) {
    //     this.pdcForm.get('spdcList').controls[j].disable();

    //   }
    // }
    setTimeout(()=>{
      this.removeInstAmtValidator()
    })

  }

  removeInstAmtValidator(){
    const PdcControl = this.pdcForm.controls.pdcList as FormArray;
    if(PdcControl.controls.length >= 1){
      PdcControl.controls[0]['controls']['instrAmount'].clearValidators();
      PdcControl.controls[0]['controls']['instrAmount'].updateValueAndValidity();
    }
    


  }

  getPdcDetails() {
    const body = {
      leadId: this.leadId,
      // userId: localStorage.getItem('userId'),
      // ...this.pdcForm.value
      udfDetails: [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ],
    };
    this.pdcService.getPdcDetails(body).subscribe((res: any) => {
      console.log(res, 'after pdcData');
      this.udfDetails = res.ProcessVariables.udfDetails;
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.pdcSpdcData = res.ProcessVariables;
        this.pdcForm.controls.pdcList.controls = [];
        this.pdcForm.controls.spdcList.controls = [];
        this.pdcCount = res.ProcessVariables.pdcCount;
        this.spdcCount = res.ProcessVariables.spdcCount;
        this.negotiatedEmi = res.ProcessVariables.negotiatedEmi;
        this.repaymentMode = res.ProcessVariables.repaymentMode;
        let pdcList = this.pdcSpdcData.pdcList;
        let spdcList = this.pdcSpdcData.spdcList;

        if (res.ProcessVariables) {
          this.getData(res.ProcessVariables, this.pdcCount, this.spdcCount);
        }

        if (pdcList == null && spdcList == null) {
          this.onRepaymentSI();
        }
      } else {
        this.addPdcUnit();
        this.addSPdcUnit();
      }
    });

  }

  onRepaymentSI() {
    const bankType = this.lovData.bankMaster.find((ele) => ele.key == '991BANKMST');

    const pdcArray = this.pdcArray.controls as FormArray;
    const spdcArray = this.spdcArray.controls as FormArray;

    setTimeout(() => {
      if (this.repaymentMode && this.repaymentMode == '4LOSREPAY') {
        for (let i = 0; i < spdcArray.length; i++) {
          spdcArray[i].patchValue({
            instrBankName: bankType.value
          })
        }
        for (let i = 0; i < pdcArray.length; i++) {
          pdcArray[i].patchValue({
            instrBankName: bankType.value
          })
        }
      }
    });
  }

  findUnique(value: any, i: number, string1: any, string2: any) {
    setTimeout(() => {
      if (value) {
        const stringValue1 = this.pdcForm.value[string1];
        const stringValue2 = this.pdcForm.value[string2];
        console.log(stringValue1, 'pdc value data');
        // tslint:disable-next-line: triple-equals
        // tslint:disable-next-line: prefer-const
        let foundValue = value
          ? stringValue1.filter((x) => x.instrNo === value)
          : 'not found';
        if (foundValue.length > 1) {
          // alert(foundValue.length);
          const control = this.pdcForm.controls[string1].controls as FormArray;
          console.log(control);
          // tslint:disable-next-line: no-unused-expression
          this.toasterService.showWarning('Duplicate InstrNo Found', '');
          control[i].controls.instrNo.reset();
        }
        if (value) {
          // tslint:disable-next-line: prefer-const
          let spdcCheck = value
            ? stringValue2.filter((x) => x.instrNo === value)
            : 'not found';
          console.log(spdcCheck);
          if (spdcCheck.length >= 1) {
            // alert(foundValue.length);
            const control = this.pdcForm.controls[string1]
              .controls as FormArray;
            console.log(control);
            // tslint:disable-next-line: no-unused-expression
            this.toasterService.showWarning('Duplicate InstrNo Found', '');
            control[i].controls.instrNo.reset();
          }
        }
      }
    }, 2000);
  }
  sendLoanCreationWrapper() {
    if (this.pdcForm.invalid) {
      this.toasterService.showError('Save details before booking loan', '');
    }
    const body = {
      leadId: this.leadId,
    };
    this.loanCreationService.setLoanCreation(body).subscribe((res: any) => {
      console.log(res);
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Lead submitted For Loan Creation', '');
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }
  findUniqueDate(value: any, i: number, string1: any, string2: any) {
    value = this.utilityService.getDateFormat(value);
    setTimeout(() => {
      if (value) {
        const stringValue1 = this.pdcForm.value[string1];
        const stringValue2 = this.pdcForm.value[string2];
        console.log(stringValue1, 'pdc value data');
        // tslint:disable-next-line: triple-equals
        // tslint:disable-next-line: prefer-const
        let foundValue = value
          ? stringValue1.filter(
            (x) => this.utilityService.getDateFormat(x.instrDate) === value
          )
          : 'not found';
        console.log(foundValue);
        if (foundValue.length > 1) {
          // alert(foundValue.length);
          const control = this.pdcForm.controls[string1].controls as FormArray;
          console.log(control);
          // tslint:disable-next-line: no-unused-expression
          this.toasterService.showWarning('Duplicate InstrDate Found', '');
          control[i].controls.instrDate.reset();
        }
        if (value) {
          // tslint:disable-next-line: prefer-const
          let spdcCheck = value
            ? stringValue2.filter(
              (x) => this.utilityService.getDateFormat(x.instrDate) === value
            )
            : 'not found';
          console.log(spdcCheck);
          if (spdcCheck.length >= 1) {
            // alert(foundValue.length);
            const control = this.pdcForm.controls[string1]
              .controls as FormArray;
            console.log(control);
            // tslint:disable-next-line: no-unused-expression
            this.toasterService.showWarning('Duplicate InstrDate Found', '');
            control[i].controls.instrDate.reset();
          }
        }
      }
    }, 2000);
  }

  getIndex(i: number) {
    this.rowIndex = null;
    this.rowIndex = i;
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
  }

  changePdcList(obj, i, controlName) {
    let pdcArray = this.pdcForm.get('pdcList') as FormArray;
    if (i === 0) {

      for (let j = 1; j < this.pdcForm.get('pdcList').length; j++) {

        pdcArray.controls[j].patchValue({
          emiAmount: obj.get('emiAmount').value,
          instrAmount: obj.get('instrAmount').value,
          instrBankName: obj.get('instrBankName').value,
          instrBranchAccountNumber: obj.get('instrBranchAccountNumber').value,
          instrBranchName: obj.get('instrBranchName').value,
          instrDate: obj.get('instrDate').value,
          //instrNo: obj.get('instrNo').value,
          pdcId: obj.get('pdcId').value
        })
      }

      // this.pdcForm.get('pdcList').controls[j].disable()

    }

  }

  changeSpdcList(obj, i, controlName, formarray) {


    let spdcArray = this.pdcForm.get(formarray) as FormArray;
    if (i === 0) {
      if (controlName === 'instrBranchAccountNumber') {
        for (let j = 1; j < this.pdcForm.get(formarray).length; j++) {
          spdcArray.controls[j].patchValue({
            instrBranchAccountNumber: obj.get(controlName).value || null,
          })
        }
      }else if(controlName === 'instrAmount'){
        for (let j = 1; j < this.pdcForm.get(formarray).length; j++) {
          
          spdcArray.controls[j].patchValue({
            instrAmount: obj.get(controlName).value || null,
          })
        }
      }
      else if(controlName === 'instrBranchName'){
        for (let j = 1; j < this.pdcForm.get(formarray).length; j++) {
          spdcArray.controls[j].patchValue({
            instrBranchName: obj.get(controlName).value || null,
          })
        }
      }
      else if(controlName === 'instrBankName'){
        for (let j = 1; j < this.pdcForm.get(formarray).length; j++) {
          spdcArray.controls[j].patchValue({
            instrBankName: obj.get(controlName).value || null,
          })
        }
      }
      else if(controlName === 'instrDate'){
        let getInstrDate = obj.get(controlName).value;
        for (let j = 1; j < this.pdcForm.get(formarray).length; j++) {
          const formatDate = this.addMonth(getInstrDate, j)
          spdcArray.controls[j].patchValue({
            instrDate: formatDate,
          })
        }

      }
      

    }

  }

  addMonth(date, n) {
    const dateFormat: Date = new Date(date);
    let year = Number(dateFormat.getFullYear());
    let month = Number(dateFormat.getMonth()) + 1;
    let fullmonth = month + n;
    if (Math.floor(fullmonth / 12) >= 1 && fullmonth % 12 != 0) {
      year = year + Math.floor(fullmonth / 12);
    }
    if (fullmonth <= 12) {
      month = fullmonth;
    } else if (fullmonth > 12 && fullmonth % 12 != 1 && fullmonth % 12 != 0) {
      month = 0 + (fullmonth % 12);
    } else if (fullmonth >= 12 && fullmonth % 12 == 1) {
      month = 1;
    }
    if (fullmonth >= 12 && fullmonth % 12 == 0) {
      month = 12;
    }
    if (month == 12) {
      year = (year + Math.floor(fullmonth / 12)) - 1;
    }
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = new Date(year + '/' + month1 + '/' + day);
    return formattedDate;
  }

  


  onBankNameSearch(val) {
    if (val && val.trim().length > 0) {

      let data = {
        "bankName": val.trim()
      }

      this.bankTransaction.getBankName(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.searchBankNameList = res.ProcessVariables.bankNames ? res.ProcessVariables.bankNames : [];
          this.keyword = '';
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Bank List')
        }
      })

      setTimeout(() => {
        if (this.searchBankNameList.length === 0) {
          this.toasterService.showInfo('Please enter valid bank name', '')
        }
      }, 30000)

    }
  }

  selectBankNameEvent(val, obj, rowIndex?, controlName?, formarray?) {
    if (val) {
      let data = {
        "bankName": val
      }

      this.bankTransaction.getBranchDetails(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.getBankBranchDetails = res.ProcessVariables.bankDetails ? res.ProcessVariables.bankDetails : [];
          this.searchBranchName = [];
          let isEnableBranch = res.ProcessVariables.bankDetails && res.ProcessVariables.bankDetails.length > 0 ? true : false;
          if(rowIndex){
            obj.patchValue({
              instrBranchName: '',
              isEnableBranch: isEnableBranch
            })
          }
         
          // if (isString === 'isPdc') {
          //   this.changePdcList(obj, rowIndex, controlName)
          // } else if (isString === 'isSpdc') {
            if(controlName && formarray){
              this.changeSpdcList(obj, rowIndex, controlName,formarray)
            }
            
          // }
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, '')
        }
      })
    }
  }

  onChangeBranch(val, obj) {
    if (val && val.trim().length > 0) {
      val = val.toString().toLowerCase();
      if(this.getBankBranchDetails.length > 0 && val.length >= 3){
        let searchBranchName = this.getBankBranchDetails.filter(e => {
          const eName = e.branchName.toString().toLowerCase();
          if (eName.includes(val)) {
            this.keyword = 'branchName';
            this.searchBranchName.push(e.branchName)
            return e.branchName;
          }
        });
  
        setTimeout(() => {
          if (this.searchBranchName.length === 0) {
            obj.get('instrBranchName').setErrors({ incorrect: true })
            this.toasterService.showInfo('Please enter valid branch', '')
          }
        }, 30000)
      }else if(val.length >= 2){
        const bankName = obj.get('instrBankName').value;
        this.selectBankNameEvent(bankName,obj)

      }
      

    }
  }

  selectIFSCCode(val, obj, isString, rowIndex, controlName, formarray) {
    obj.get('instrBranchName').setValue(val)
    // if (isString === 'isPdc') {
    //   this.changePdcList(obj, rowIndex, controlName)
    // } else if (isString === 'isSpdc') {
      this.changeSpdcList(obj, rowIndex, controlName,formarray)
    // }
  }

  onBankNameClear(val, obj) {
    obj.patchValue({
      instrBankName: '',
      instrBranchName: ''
    })
  }

}
