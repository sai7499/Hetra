import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs';
import { PdcServiceService } from '@services/pdc-service.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-pdc-details',
  templateUrl: './pdc-details.component.html',
  styleUrls: ['./pdc-details.component.css']
})
export class PdcDetailsComponent implements OnInit {
  roleId: any;
  roleType: any;
  leadId: any;
  pdcArray: any;
  spdcArray: any;
  pdcForm: any;
  labels: any;
  isDirty: false;
  toDayDate = new Date();

  json: any;
  showPdc = false;
  showSpdc = false;


  constructor( private loginStoreService: LoginStoreService,
               private cpcService: CpcRolesService,
               private route: ActivatedRoute,
               private router: Router,
               private toasterService: ToasterService,
               private labelsService: LabelsService,
               private http: HttpService,
               private fb: FormBuilder,
               private pdcService: PdcServiceService,
               private utilityService: UtilityService) {
                this.pdcArray = this.fb.array([]);
                this.spdcArray = this.fb.array([]);
               }

  async ngOnInit() {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.pdcForm = this.fb.group({
      pdcList: this.pdcArray,
      spdcList: this.spdcArray
    });
    this.leadId = (await this.getLeadId()) as number;
    // this.pdcForm = this.fb.group({
    //   pdc: this.pdcArray,
    //   spdc: this.spdcArray
    // });
    this.labelsService.getLabelsData().subscribe((res: any) => {
      this.labels = res;
    });
    // if (this.pdcForm.controls.pdcList.controls.length === 0) {
    //   this.showPdc = true;
    // } else if (this.pdcForm.controls.spdcList.controls.length === 0) {
    //   this.showSpdc = true;
    // }
    this.getPdcDetails();
  }
  private initRows() {
    return this.fb.group({
      pdcId: [null],
      instrType: [null],
      emiAmount: [null],
      instrNo: [null],
      instrDate: [null],
      instrBankName: [null],
      instrBranchName: [null],
      instrBranchAccountNumber: [null],
      instrAmount: [null]
    });
  }
  addPdcUnit(data?: any) {
    const control = this.pdcForm.controls.pdcList as FormArray;
    control.push(this.initRows());
  }
  addSPdcUnit(data?: any) {
    const control = this.pdcForm.controls.spdcList as FormArray;
    control.push(this.initRows());
  }
 deleteRows(table: string, id: any, i: number) {
   console.log(table + id + i);
   const array = this.pdcForm.get(table) as FormArray;
  //  array.removeAt(i);
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

    // tslint:disable-next-line: triple-equals
     if (this.roleType == '4') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: true,
        sendBackToCredit: false
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
        });
    // tslint:disable-next-line: triple-equals
    } else if ( this.roleType == '5') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: false,
        sendBackToCredit: false
        };
      this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
          // tslint:disable-next-line: triple-equals
          if (res.ProcessVariables.error.code == '0') {
            this.router.navigate([`pages/dashboard`]);
          } else {
            this.toasterService.showError(res.Processvariables.error.message, '');
          }
        });
    }

  }
  sendBackToCredit() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true
      };
    // tslint:disable-next-line: deprecation
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
  });
}
onSave() {
//  localStorage.setItem('pdcData', JSON.stringify(this.pdcForm.value));
// tslint:disable-next-line: prefer-for-of
for (let i = 0; i < this.pdcForm.controls.pdcList.length; i++) {
  // tslint:disable-next-line: prefer-const
  let value = this.pdcForm.value.pdcList[i].instrDate;
  this.pdcForm.value.pdcList[i].instrDate = value ? this.utilityService.getDateFormat(value) : null;
}
// tslint:disable-next-line: prefer-for-of
for (let i = 0; i < this.pdcForm.controls.spdcList.controls.length; i++) {
  // tslint:disable-next-line: max-line-length
  this.pdcForm.value.spdcList[i].instrDate = this.pdcForm.value.spdcList[i].instrDate ? this.utilityService.getDateFormat(this.pdcForm.value.spdcList[i].instrDate) : null;
}
console.log(this.pdcForm.value, 'pdc Form');
const body = {
  leadId: this.leadId,
  userId: localStorage.getItem('userId'),
  ...this.pdcForm.value
};
this.pdcService.savePdcDetails(body).subscribe((res: any) => {
  console.log(res);
  // tslint:disable-next-line: triple-equals
  if (res.ProcessVariables.error.code == '0') {
    // this.getData(res.ProcessVariables);
    this.toasterService.showSuccess('Record Saved Successfully', '');
  } else {

  }

});
//  this.router.navigate([`pages/dashboard`]);
}
onBack() {
  // tslint:disable-next-line: triple-equals
  if (this.roleType == '4') {
    this.router.navigate([`pages/cpc-maker/${this.leadId}/sanction-details`]);
  // tslint:disable-next-line: triple-equals
  } else if ( this.roleType == '5') {
    this.router.navigate([`pages/cpc-checker/${this.leadId}/sanction-details`]);
  }

}
getData(data: any) {
// const data = JSON.parse(localStorage.getItem('pdcData'));
if (data) {
  const spdcControl = this.pdcForm.controls.spdcList as FormArray;
  const PdcControl = this.pdcForm.controls.pdcList as FormArray;

  if (data.pdcList) {
    for (let i = 0; i < data.pdcList.length; i++ ) {
      this.addPdcUnit();
      PdcControl.at(i).patchValue({
        pdcId : data.pdcList[i].pdcId,
      instrType: data.pdcList[i].instrType,
          emiAmount: data.pdcList[i].emiAmount,
          instrNo: data.pdcList[i].instrNo,
          instrDate: this.utilityService.getDateFromString(data.pdcList[i].instrDate) ,
          instrBankName: data.pdcList[i].instrBankName,
          instrBranchName: data.pdcList[i].instrBranchName,
          instrBranchAccountNumber: data.pdcList[i].instrBranchAccountNumber,
          instrAmount: data.pdcList[i].instrAmount
    });
  }
  // tslint:disable-next-line: prefer-for-of
    if (data.spdcList) {
 // tslint:disable-next-line: prefer-for-of
   for (let j = 0; j < data.spdcList.length; j++ ) {
     this.addSPdcUnit();
     spdcControl.at(j).patchValue({
      pdcId: data.spdcList[j].pdcId,
      instrType: data.spdcList[j].instrType,
      emiAmount: data.spdcList[j].emiAmount,
      instrNo: data.spdcList[j].instrNo,
      instrDate: this.utilityService.getDateFromString(data.spdcList[j].instrDate) ,
      instrBankName: data.spdcList[j].instrBankName,
      instrBranchName: data.spdcList[j].instrBranchName,
      instrBranchAccountNumber: data.spdcList[j].instrBranchAccountNumber,
      instrAmount: data.spdcList[j].instrAmount
    });
  }
  }

}
}
}

getPdcDetails() {
  const body = {
    leadId: this.leadId,
    // userId: localStorage.getItem('userId'),
    // ...this.pdcForm.value
  };
  this.pdcService.getPdcDetails(body).subscribe(( res: any) => {
    console.log(res);
    // tslint:disable-next-line: triple-equals
    if (res.ProcessVariables.error.code == '0') {
      this.getData(res.ProcessVariables);
    } else {
      this.addPdcUnit();
      this.addSPdcUnit();
    }

  });

}


}
