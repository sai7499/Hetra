import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { HttpService } from '@services/http.service';
import { PdcServiceService } from '@services/pdc-service.service';
import { UtilityService } from '@services/utility.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LoanCreationService } from '@services/loan-creation.service';
import { LeadStoreService } from '@modules/sales/services/lead.store.service';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

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
  isDirty: boolean= false;
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

  constructor(
    private loginStoreService: LoginStoreService,
    private cpcService: CpcRolesService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private labelsService: LabelsService,
    private http: HttpService,
    private fb: FormBuilder,
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
    // if(this.roleType == '4') {
    //   this.udfScreenId = 'PCS001';
    // } else if(this.roleType == '5') {
    //   this.udfScreenId = 'PCS002';
    // }
    this.getPdcDetails();
    // if (this.pdcForm.controls.pdcList.controls.length === 0) {
    //   this.showPdc = true;
    // } else if (this.pdcForm.controls.spdcList.controls.length === 0) {
    //   this.showSpdc = true;
    // }
    this.lovService.getLovData().subscribe((res: any) => {
      this.lovData = res.LOVS;
    });

    this.labelsService.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = this.roleType == '5' ? udfScreenId.CPCChecker.pdcDetailsCPCChecker : udfScreenId.CPCMaker.pdcDetailsCPCMaker ;

    })
  }
  get f() {
    return this.pdcForm.controls;
  }
  private initRows() {
    return this.fb.group({
      pdcId: [null],
      // instrType: [null, Validators.required],
      // emiAmount: [{value: this.negotiatedEmi, disabled: true}, Validators.required ],
      emiAmount:  new FormControl(this.negotiatedEmi,[ Validators.required ]),
      instrNo: [null, Validators.required],
      instrDate: [null, Validators.required],
      instrBankName: [null, Validators.required],
      instrBranchName: [null, Validators.required],
      instrBranchAccountNumber: [null, Validators.required],
      instrAmount: [null, Validators.required],
    });
  }
  private initSpdcRows() {
    return this.fb.group({
      pdcId: [null],
      // instrType: [null, Validators.required],
      emiAmount:  new FormControl(this.negotiatedEmi,[ Validators.required ]),
      instrNo: [null, Validators.required],
      instrDate: [null],
      instrBankName: [null, Validators.required],
      instrBranchName: [null, Validators.required],
      instrBranchAccountNumber: [null, Validators.required],
      instrAmount: [null, Validators.required],
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
    //this.submitted = true;
    //  localStorage.setItem('pdcData', JSON.stringify(this.pdcForm.value));
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.pdcForm.controls.pdcList.length; i++) {
      // tslint:disable-next-line: prefer-const
      let value = this.pdcForm.value.pdcList[i].instrDate;
      this.pdcForm.value.pdcList[i].instrDate = value
        ? this.utilityService.getDateFormat(value)
        : null;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.pdcForm.controls.spdcList.controls.length; i++) {
      // tslint:disable-next-line: max-line-length
      this.pdcForm.value.spdcList[i].instrDate = this.pdcForm.value.spdcList[i]
        .instrDate
        ? this.utilityService.getDateFormat(
            this.pdcForm.value.spdcList[i].instrDate
          )
        : null;
    }
    console.log(this.pdcForm, 'pdc Form');
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      ...this.pdcForm.value,
      udfDetails:  [{
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

    //return alert('SAVED')
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
    //  this.router.navigate([`pages/dashboard`]);
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
        }
        if (data.pdcList != null) {
          for (let i = 0; i < pdcCount; i++) {
            PdcControl.at(i).patchValue({
              pdcId: data.pdcList[i].pdcId ? data.pdcList[i].pdcId : null,
              instrType: data.pdcList[i].instrType
                ? data.pdcList[i].instrType
                : null,
              emiAmount: data.pdcList[i].emiAmount
                ? data.pdcList[i].emiAmount
                : this.negotiatedEmi,
              instrNo: data.pdcList[i].instrNo ? data.pdcList[i].instrNo : null,
              instrDate: data.pdcList[i].instrDate
                ? this.utilityService.getDateFromString(
                    data.pdcList[i].instrDate
                  )
                : null,
              instrBankName: data.pdcList[i].instrBankName
                ? data.pdcList[i].instrBankName
                : null,
              instrBranchName: data.pdcList[i].instrBranchName
                ? data.pdcList[i].instrBranchName
                : null,
              instrBranchAccountNumber: data.pdcList[i].instrBranchAccountNumber
                ? data.pdcList[i].instrBranchAccountNumber
                : null,
              instrAmount: data.pdcList[i].instrAmount
                ? data.pdcList[i].instrAmount
                : null,
            });
          }
        }
        // tslint:disable-next-line: triple-equals
      } else if (pdcCount == '' && data.pdcList) {
        this.showPdcButton = true;
        for (let i = 0; i < data.pdcList.length; i++) {
          this.addPdcUnit();
          PdcControl.at(i).patchValue({
            pdcId: data.pdcList[i].pdcId ? data.pdcList[i].pdcId : null,
            instrType: data.pdcList[i].instrType
              ? data.pdcList[i].instrType
              : null,
            emiAmount: data.pdcList[i].emiAmount
              ? data.pdcList[i].emiAmount
              : this.negotiatedEmi,
            instrNo: data.pdcList[i].instrNo ? data.pdcList[i].instrNo : null,
            instrDate: data.pdcList[i].instrDate
              ? this.utilityService.getDateFromString(data.pdcList[i].instrDate)
              : null,
            instrBankName: data.pdcList[i].instrBankName
              ? data.pdcList[i].instrBankName
              : null,
            instrBranchName: data.pdcList[i].instrBranchName
              ? data.pdcList[i].instrBranchName
              : null,
            instrBranchAccountNumber: data.pdcList[i].instrBranchAccountNumber
              ? data.pdcList[i].instrBranchAccountNumber
              : null,
            instrAmount: data.pdcList[i].instrAmount
              ? data.pdcList[i].instrAmount
              : null,
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
              pdcId: data.spdcList[j].pdcId ? data.spdcList[j].pdcId : null,
              instrType: data.spdcList[j].instrType
                ? data.spdcList[j].instrType
                : null,
              emiAmount: data.spdcList[j].emiAmount
                ? data.spdcList[j].emiAmount
                : this.negotiatedEmi,
              instrNo: data.spdcList[j].instrNo
                ? data.spdcList[j].instrNo
                : null,
              instrDate: data.spdcList[j].instrDate
                ? this.utilityService.getDateFromString(
                    data.spdcList[j].instrDate
                  )
                : null,
              instrBankName: data.spdcList[j].instrBankName
                ? data.spdcList[j].instrBankName
                : null,
              instrBranchName: data.spdcList[j].instrBranchName
                ? data.spdcList[j].instrBranchName
                : null,
              instrBranchAccountNumber: data.spdcList[j]
                .instrBranchAccountNumber
                ? data.spdcList[j].instrBranchAccountNumber
                : null,
              instrAmount: data.spdcList[j].instrAmount
                ? data.spdcList[j].instrAmount
                : null,
            });
          }
        }

        // tslint:disable-next-line: triple-equals
      } else if (data.spdcList && spdcCount == '') {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < data.spdcList.length; j++) {
          this.addSPdcUnit();
          spdcControl.at(j).patchValue({
            pdcId: data.spdcList[j].pdcId ? data.spdcList[j].pdcId : null,
            instrType: data.spdcList[j].instrType
              ? data.spdcList[j].instrType
              : null,
            emiAmount: data.spdcList[j].emiAmount
              ? data.spdcList[j].emiAmount
              : this.negotiatedEmi,
            instrNo: data.spdcList[j].instrNo ? data.spdcList[j].instrNo : null,
            instrDate: data.spdcList[j].instrDate
              ? this.utilityService.getDateFromString(
                  data.spdcList[j].instrDate
                )
              : null,
            instrBankName: data.spdcList[j].instrBankName
              ? data.spdcList[j].instrBankName
              : null,
            instrBranchName: data.spdcList[j].instrBranchName
              ? data.spdcList[j].instrBranchName
              : null,
            instrBranchAccountNumber: data.spdcList[j].instrBranchAccountNumber
              ? data.spdcList[j].instrBranchAccountNumber
              : null,
            instrAmount: data.spdcList[j].instrAmount
              ? data.spdcList[j].instrAmount
              : null,
          });
        }
      } else {
        this.showspdcButton = true;
        this.addSPdcUnit();
      }
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
      console.log(res);
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
        const pdcList = this.pdcSpdcData.pdcList;
        const spdcList = this.pdcSpdcData.spdcList;
                 
        
        // console.log('repaymentMode', this.repaymentMode);
        
        console.log(this.pdcCount, this.spdcCount, 'pdc and spdc count');
        if (res.ProcessVariables) {
          this.getData(res.ProcessVariables, this.pdcCount, this.spdcCount);
        }
        // else if (res.ProcessVariables.pdcList && res.ProcessVariables.spdcList != null) {
        //   this.addPdcUnit();
        //   this.getData(res.ProcessVariables);
        // } else if (res.ProcessVariables.pdcList != null && res.ProcessVariables.spdcList == null) {
        //   this.addSPdcUnit();
        //   this.getData(res.ProcessVariables);
        // } else {
        //   this.addPdcUnit();
        //   this.addSPdcUnit();
        //   this.getData(res.ProcessVariables);
        // }
    if( pdcList == null && spdcList == null) {
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
        if(this.repaymentMode && this.repaymentMode == '4LOSREPAY') {
          for(let i = 0; i<spdcArray.length; i++) {
            spdcArray[i].patchValue({
            instrBankName : bankType.key
            })
          }
          for(let i = 0; i<pdcArray.length; i++) {
            pdcArray[i].patchValue({
            instrBankName : bankType.key
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
        this.toasterService.showSuccess(res.ProcessVariables.error.message, '');
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
    console.log('identify', value)
  }

}
