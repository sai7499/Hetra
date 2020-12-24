import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CommomLovService } from '@services/commom-lov-service';
import { ChecklistService } from '@services/checklist.service';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { TermSheetService } from '@modules/dde/services/terms-sheet.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
})
export class CheckListComponent implements OnInit {
  checklistForm: any;
  checkListMaster: any;
  checklistObject: any;
  checkListArray = [];
  formControlArray = [];
  checkListFormArray = [];
  applicantId: number;
  leadId: number;
  roleId: any;
  roleType: any;
  coAnswerFlag = true;
  cpcMakerFlag = true;
  salesResponse: any;
  isPreDone: any;
  taskId: any;

  // User defined
  udfScreenId: any;
  udfGroupId: any = "CLG001";
  udfDetails: any = [];
  userDefineForm: any;
  isDirty;

  constructor(
    private commonLovService: CommomLovService,
    private checkListService: ChecklistService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private loginStoreService: LoginStoreService,
    private cpcService: CpcRolesService,
    private router: Router,
    private termSheetService: TermSheetService,
    private sharedService: SharedService
  ) {
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      $('.collapse')
        .on('shown.bs.collapse', function(event) {
          event.stopPropagation();
          console.log('open');
          $(this)
            .parent()
            .find('.fa-chevron-right')
            .removeClass('fa-chevron-right')
            .addClass('fa-chevron-down')
            .find('.btn_bar')
            .removeClass('btn_bar')
            .addClass('btn_bar_pink');
        })
        .on('hidden.bs.collapse', function(event) {
          console.log('closed');
          event.stopPropagation();
          $(this)
            .parent()
            .find('.fa-chevron-down')
            .removeClass('fa-chevron-down')
            .addClass('fa-chevron-right')
            .find('.btn_bar_pink')
            .removeClass('btn_bar_pink')
            .addClass('btn_bar');
        });
    });
  }

  async ngOnInit() {
    
    this.salesResponse = localStorage.getItem('salesResponse');
    this.isPreDone = localStorage.getItem('is_pred_done');
    this.commonLovService.getLovData().subscribe((res: any) => {
      console.log(res, 'cmn lov service');
      this.checklistObject = res.LOVS.checklistans;
      // this.checkListMaster = res.LOVS.checklistMstView.sort((a, b) => Number(a.key) - Number(b.key));
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });

    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    if(this.roleType == '7' || this.roleType == '2') {
      this.udfScreenId = "CLS001";
    } else if(this.roleType == '4') {
      this.udfScreenId = "CLS002";
    } else if(this.roleType == '5') {
      this.udfScreenId = "CLS003";
    }

    // tslint:disable-next-line: prefer-const
    // let childgroups = [];
    // // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < this.checkListMaster.length; i++) {
    //   childgroups.push(this.creategroup(this.checkListMaster[i]));
    // }
    // // childgroups.sort()
    this.checklistForm = this.formBuilder.group({
      checklistArray: this.formBuilder.array([])
    });
    // console.log(this.checklistForm, typeof(this.checklistForm.controls));
    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
    this.checklistForm = this.formBuilder.group({
      checklistArray: this.formBuilder.array([])
    });
    this.getCheckList();
    // this.getCheckList();
    
    

    // tslint:disable-next-line: triple-equals
  }
  initForm(event) {
    let childgroups = [];
    this.checkListMaster = event;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.checkListMaster.length; i++) {
      childgroups.push(this.creategroup(this.checkListMaster[i]));
    }
    // childgroups.sort()
    this.checklistForm = this.formBuilder.group({
      checklistArray: this.formBuilder.array(childgroups)
    });
    for (let i = 0; i < this.checklistForm.controls.checklistArray.length; i++) {
      // tslint:disable-next-line: triple-equals
      if (this.roleType == '4' || this.roleType == '7' ) {
       this.checklistForm.controls.checklistArray.controls[i].controls.coAnswer.disable();
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
       this.checklistForm.controls.checklistArray.controls[i].controls.coAnswer.disable();
       this.checklistForm.controls.checklistArray.controls[i].controls.cpcMaker.disable();
      }
    }
    this.addValidatorsCO();
  }
  getCheckList() {
    const body = {
      leadId: this.leadId,
      udfDetails: [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ],
    };
    this.checkListService.getCheckListDetails(body).subscribe((res: any) => {
      console.log(res, ' checklist get response');
      this.udfDetails = res.ProcessVariables.udfDetails;
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0' && res.ProcessVariables.checkList ) {
        this.initForm(res.ProcessVariables.checkList);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < res.ProcessVariables.checkList.length; i++) {
          this.patchChecklist(res.ProcessVariables.checkList[i]);
          // tslint:disable-next-line: no-shadowed-variable

        }
      }
    });
  }
  getApplicantId() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe((value) => {
        const applicantId = value.applicantId;
        if (applicantId) {
          resolve(Number(applicantId));
          
        }
        resolve(null);
      });
      
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.getCheckList();
        }
        resolve(null);
      });
    });
  }
  creategroup(list: any) {
    return this.formBuilder.group({
      checkListId: [Number(list.checkListId)],
      checklistName: [list.checkListName],
      coAnswer: [null ],
      cpcChecker: [null ],
      cpcMaker: [null ]
    });
  }

  get f() { return this.checklistForm.controls; }  /// total formcontrols
  get t() { return this.f.checklistArray as FormArray; } // controls of coAwnser array.error

  onSave(btnType) {
  console.log(this.checklistForm.status, 'status before add validators');
  this.addValidatorsCO();

  this.checkListFormArray = [];
    // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.checklistForm.controls.checklistArray.length; i++) {
      const data = this.checklistForm.controls.checklistArray.value[i];
      // tslint:disable-next-line: triple-equals
      if (this.roleType == '2') {
        const body = {
          checkListId: data.checkListId,
          checklistName: data.checklistName,
          coAnswer: data.coAnswer
        };

        this.checkListFormArray.push(body);
        this.checkListFormArray = this.checkListFormArray.filter((res) => res.coAnswer !== null );
        console.log(this.checkListFormArray);
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        const body = {
          checkListId: data.checkListId,
          checklistName: data.checklistName,
          cpcMaker: data.cpcMaker
        };
        this.checkListFormArray.push(body);
        this.checkListFormArray = this.checkListFormArray.filter((res) => res.cpcMaker !== null );
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
        const body = {
          checkListId: data.checkListId,
          checklistName: data.checklistName,
          cpcChecker: data.cpcChecker
        };
        this.checkListFormArray.push(body);
        this.checkListFormArray = this.checkListFormArray.filter((res) => res.cpcChecker !== null );

      }
    }
  const bodyReq = {
      userId: localStorage.getItem('userId'),
      leadId: this.leadId,
      checkList: this.checkListFormArray,
      udfDetails :  [{
        "udfGroupId": this.udfGroupId,
        // "udfScreenId": this.udfScreenId,
        "udfData": JSON.stringify(this.userDefineForm.udfData.getRawValue())
      }],
    };
  if ( this.checklistForm.invalid || this.userDefineForm.udfData.invalid) {
          console.log(this.checklistForm);
          this.toasterService.showError('Select Mandatory Fields', ' ');
          return ;
        }
  console.log(bodyReq);
  this.checkListService.saveCheckListDetails(bodyReq).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
       this.toasterService.showSuccess('Record Saved Successfully', ' ');

       // tslint:disable-next-line: triple-equals
       if (btnType == 'submitTocpc') {
        this.submitTocpc('submitTocpc');
       // tslint:disable-next-line: triple-equals
       } else if (btnType == 'bcm') {
       this.submitTocpc('bcm');
       } else {
        this.getCheckList();
       }
     } else {
       this.toasterService.showError(res.ProcessVariables.error.message, '');
     }
    });
  }
  patchChecklist(data?: any) {
    const array = this.t as FormArray;
    array.controls.forEach((element: any) => {
      if (element.value.checkListId === data.checkListId) {
         element.patchValue({
          coAnswer : data.coAnswer ? data.coAnswer : null,
          cpcChecker: data.cpcChecker ? data.cpcChecker : null,
          cpcMaker: data.cpcMaker ? data.cpcMaker : null
         });
      }
    });
  }
  addValidatorsCO() {
    const group: any = this.checklistForm.controls.checklistArray as FormGroup;
    // const groupLength: any = group.controls.length;
    for (let i = 0; i < this.checklistForm.controls.checklistArray.length ; i ++) {
      // tslint:disable-next-line: triple-equals
      if (this.roleType == '2') {
        group.at(i).controls.coAnswer.setValidators(Validators.required);
        group.at(i).controls.coAnswer.updateValueAndValidity();
      // tslint:disable-next-line: triple-equals
      } else if (this.roleType == '4') {
        group.at(i).controls.cpcMaker.setValidators(Validators.required);
        group.at(i).controls.cpcMaker.updateValueAndValidity();
      // tslint:disable-next-line: triple-equals
      } else if ( this.roleType == '5') {
        group.at(i).controls.cpcChecker.setValidators(Validators.required);
        group.at(i).controls.cpcChecker.updateValueAndValidity();
      }

    }


  }

  submitTocpc(data: string) {
    const verifyString = data;
    if ( this.checklistForm.invalid) {
      console.log(this.checklistForm);
      this.toasterService.showError('Select Mandatory Fields', 'Save Checklist ');
      return ;
    }
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '2' && verifyString == 'bcm') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: true,
        isCPCChecker: false,
        sendBackToCredit: false,
        taskId: this.taskId
        };
      this.termSheetService.assignTaskToTSAndCPC(body).subscribe((res: any) => {
         // tslint:disable-next-line: triple-equals
         if (res.ProcessVariables.error.code == '0') {
       this.toasterService.showSuccess('Record Saved Successfully', ' ');
       this.router.navigate([`pages/dashboard`]);
     } else {
       this.toasterService.showError(res.ProcessVariables.error.message, '');
     }
        });
    // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '2' && verifyString == 'submitTocpc') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: true,
        isCPCChecker: false,
        sendBackToCredit: false,
        taskId: this.taskId,
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }

        });
    // tslint:disable-next-line: triple-equals
    }  else if (this.roleType == '4') {
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
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }

        });
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: false,
        sendBackToCredit: false,
        taskId: this.taskId,
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res) => {
        this.router.navigate([`pages/dashboard`]);
        });
    }

  }
onNext()  {
  // this.onSave();
  // tslint:disable-next-line: triple-equals
  if (this.checklistForm.valid) {
    // tslint:disable-next-line: triple-equals
    if (this.roleType == '2') {
    this.router.navigate([`pages/dashboard`]);
    // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/pdc-details`]);
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/disbursement`]);
    }
    else if ( this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/remarks`]);
      }
  } else {
    this.toasterService.showError('Select Mandatory Fields', ' ');
  }
}

onBack() {
  // tslint:disable-next-line: triple-equals
  if (this.roleType == '2' ) {
    this.router.navigate([`pages/credit-decisions/${this.leadId}/sanction-details`]);
    // tslint:disable-next-line: triple-equals
    } else if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/negotiation`]);
    } else if ( this.roleType == '7') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/disbursement`]);
      }

}

// tslint:disable-next-line: adjacent-overload-signatures
sendBackToMaker() {
  const body = {
    leadId: this.leadId,
    userId: localStorage.getItem('userId'),
    isCPCMaker: true,
    isCPCChecker: false,
    sendBackToCredit: false,
    taskId: this.taskId,
  };
  this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
    // tslint:disable-next-line: triple-equals
    if (res.ProcessVariables.error.code == '0') {
      this.toasterService.showSuccess('Submitted Suucessfully', '');
      this.router.navigate([`pages/dashboard`]);
    } else {
      this.toasterService.showError(res.Processvariables.error.message, '');
    }
  });
}

onSaveuserDefinedFields(value) {
  this.userDefineForm = value;
  console.log('identify', value)
}

}
