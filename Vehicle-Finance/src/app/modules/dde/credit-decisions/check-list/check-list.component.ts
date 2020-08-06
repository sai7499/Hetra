import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CommomLovService } from '@services/commom-lov-service';
import { ChecklistService } from '@services/checklist.service';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';

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
  constructor(
    private commonLovService: CommomLovService,
    private checkListService: ChecklistService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private loginStoreService: LoginStoreService,
    private cpcService: CpcRolesService
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
    this.commonLovService.getLovData().subscribe((res: any) => {
      console.log(res, 'cmn lov service');
      this.checklistObject = res.LOVS.checklistans;
      this.checkListMaster = res.LOVS.checklistMstView;
      // this.checkListMaster.push(res.LOVS.);
      console.log(this.checkListMaster, typeof(this.checkListMaster), 'array of checklist');
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });

    // tslint:disable-next-line: prefer-const
    let childgroups = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.checkListMaster.length; i++) {
      childgroups.push(this.creategroup(this.checkListMaster[i]));
    }
    this.checklistForm = this.formBuilder.group({
      checklistArray: this.formBuilder.array(childgroups)
    });
    console.log(this.checklistForm, typeof(this.checklistForm.controls));
    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
    this.getCheckList();
  }
  getCheckList() {
    const body = {
      leadId: this.leadId,
    };
    this.checkListService.getCheckListDetails(body).subscribe((res: any) => {
      console.log(res, ' checklist get response');
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < res.ProcessVariables.checkList.length; i++) {
          this.patchChecklist(res.ProcessVariables.checkList[i]);
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
        }
        resolve(null);
      });
    });
  }
  creategroup(list: any) {
    return this.formBuilder.group({
      checkListId: [Number(list.key)],
      checklistName: [list.value],
      coAnswer: [null , Validators.required],
      cpcChecker: [],
      cpcMaker: []
    });
  }

  get f() { return this.checklistForm.controls; }  /// total formcontrols
  get t() { return this.f.checklistArray as FormArray; } // controls of coAwnser array.error


  // totalCOAnswerControls() {
  //   // tslint:disable-next-line: prefer-for-of
  //   for (let i = 0; i < this.checkListMaster.length; i++) {
  //     this.checklistForm.controls.coAnswer.push(this.addCOAnswer());
  //   }
  // }
  mapToValue(key, data, i) {
    console.log(key, data, i, 'select');
    // this.checkListArray.push(this.addCOAnswer());
    // this.checkListArray[i].value.coAnswer = data;
    console.log(this.checklistForm.value, this.checkListArray, 'checklist form ');
    console.log(this.t, 't Array controls');
  }
  onSave() {
    this.checkListFormArray = [];
    for (let i = 0; i < this.checklistForm.controls.checklistArray.length; i++) {
      this.checkListFormArray.push(this.checklistForm.controls.checklistArray.value[i]);
    }
    const body = {
      userId: localStorage.getItem('userId'),
      leadId: this.leadId,
      checkList: this.checkListFormArray
    };
    console.log(body);
    this.checkListService.saveCheckListDetails(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
       this.toasterService.showSuccess('Record Saved Successfully', ' ');
       this.getCheckList();
     } else {
       this.toasterService.showError(res.ProcessVariables.code.message, '');
     }
    });
  }
  patchChecklist(data?, i?) {
    const array = this.t as FormArray;
    array.controls.forEach((element: any) => {
      if (element.value.checkListId === data.checkListId) {
         element.patchValue({
          coAnswer : data.coAnswer,
          cpcChecker: data.cpcChecker,
          cpcMarker: data.cpcMarker
         });
      }
    });
  }

  submitTocpc() {
    const body = {
    leadId: 1604,
    userId: localStorage.getItem('userId'),
    isCPCMaker: true,
    isCPCChecker: false,
    sendBackToCredit: false
    };
    this.cpcService.getCPCRolesDetails(body).subscribe((res) => {
      console.log(res);
    });
  }

}
