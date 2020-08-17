import { Component, OnInit } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs';

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
  maxDate = new Date();

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
               private fb: FormBuilder) {
                this.pdcArray = this.fb.array([this.initRows()]);
                this.spdcArray = this.fb.array([this.initRows()]);
               }

  async ngOnInit() {
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.pdcForm = this.fb.group({
      pdc: this.pdcArray,
      spdc: this.spdcArray
    });
    this.leadId = (await this.getLeadId()) as number;
    // this.pdcForm = this.fb.group({
    //   pdc: this.pdcArray,
    //   spdc: this.spdcArray
    // });
    this.labelsService.getLabelsData().subscribe((res: any) => {
      this.labels = res;
    });
    if (this.pdcForm.controls.pdc.controls.length === 0) {
      this.showPdc = true;
    } else if (this.pdcForm.controls.spdc.controls.length === 0) {
      this.showSpdc = true;
    }
    this.getData();
  }
  private initRows() {
    return this.fb.group({
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
    const control = this.pdcForm.controls.pdc as FormArray;
    control.push(this.initRows());
  }
  addSPdcUnit(data?: any) {
    const control = this.pdcForm.controls.spdc as FormArray;
    control.push(this.initRows());
  }
 deleteRows(table: string, i: number) {
  const array = this.pdcForm.get(table) as FormArray;
  array.removeAt(i);
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
 localStorage.setItem('pdcData', JSON.stringify(this.pdcForm.value));
 this.router.navigate([`pages/dashboard`]);
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
getData() {
const data = JSON.parse(localStorage.getItem('pdcData'));
if (data) {
  const spdcControl = this.pdcForm.controls.spdc as FormArray;
  const PdcControl = this.pdcForm.controls.pdc as FormArray;
  console.log(data.pdc.length);
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < data.pdc.length; i++ ) {
  PdcControl.at(i).patchValue({
  instrType: data.pdc.instrType,
      emiAmount: data.pdc.emiAmount,
      instrNo: data.pdc.instrNo,
      instrDate: data.pdc.instrDate ,
      instrBankName: data.pdc.instrBankName,
      instrBranchName: data.pdc.instrBranchName,
      instrBranchAccountNumber: data.pdc.instrBranchAccountNumber,
      instrAmount: data.pdc.instrAmount
});
  // tslint:disable-next-line: prefer-for-of
  for (let j = 0; j < data.spdc.length; j++ ) {
  spdcControl.at(i).patchValue({
  instrType: data.pdc.instrType,
      emiAmount: data.pdc.emiAmount,
      instrNo: data.pdc.instrNo,
      instrDate: data.pdc.instrDate ,
      instrBankName: data.pdc.instrBankName,
      instrBranchName: data.pdc.instrBranchName,
      instrBranchAccountNumber: data.pdc.instrBranchAccountNumber,
      instrAmount: data.pdc.instrAmount
});
  }
}
}
}



}
