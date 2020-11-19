import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CpcRolesService } from '@services/cpc-roles.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { ToasterService } from '@services/toaster.service';
import { promise } from 'protractor';


@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {

  remarksForm: FormGroup;
  leadId: any;
  apiValue: any;
  formvalue: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cpcService: CpcRolesService,
    private toasterService: ToasterService,
    private objectComparisonService: ObjectComparisonService

  ) { }

  async ngOnInit() {
    this.initForm();
    this.leadId = (await this.getLeadId()) as number;
    console.log('lead id', this.leadId)
    this.getRemarks();

  }

  initForm() {
    this.remarksForm = new FormGroup({
      remarks: new FormControl('', Validators.required)
    })
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId))
        }
        resolve(null)
      })
    })
  }

  getRemarks() {
    const data = {
      leadId: this.leadId
    }

    this.cpcService.getAssetRemarks(data).subscribe((res: any) => {
      const response = res
      const processVaribles = response.ProcessVariables;
      if (response.Error == '0' && processVaribles.error.code == '0') {
        this.setRemarks(processVaribles)
      } else {
        this.toasterService.showError(response.error.message, '')
      }
    })
  }

  setRemarks(values) {
    const formControl = this.remarksForm;
    formControl.patchValue({
      remarks: values.remarks
    })

    this.apiValue = this.remarksForm.getRawValue();

  }

  onBack() {
    this.router.navigateByUrl(`pages/cpc-maker/${this.leadId}/check-list`)
  }

  onsave() {
    const formvalue = this.remarksForm.getRawValue();
    const remarks = formvalue.remarks;
    const data = {
      leadId: this.leadId,
      remarks: remarks,
      userId: localStorage.getItem('userId'),
    }

    this.cpcService.saveAssetRemarks(data).subscribe((res: any) => {
      const responce = res;
      const processVaribles = responce.ProcessVariables;
      if (responce.Error == '0' && processVaribles.error.code == '0') {
        this.toasterService.showSuccess('Record Saved Successfully', '');
        this.apiValue = this.remarksForm.getRawValue();
      } else {
        this.toasterService.showError(processVaribles.error.message, '')
      }
    })
  }

  onApproval() {
    this.formvalue = this.remarksForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.formvalue)
    // console.log('isValueCheck', isValueCheck)
    // console.log(this.apiValue,'values', this.formvalue)
    if (this.remarksForm.invalid) {
      this.toasterService.showError('Save before Submitting', '')
      return
    }
    if (!isValueCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }

    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: false,
      isSubmitCAD: true
    }
    this.cpcService.assignCPCMaker(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Approved Successfully', '');
        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

  onSendToCredit(){
    this.formvalue = this.remarksForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.formvalue)
    if(this.remarksForm.invalid){
      this.toasterService.showError('Save before Submitting', '')
      return;
    }
    if (!isValueCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }

    const body={
      leadId : this.leadId,
      userId : localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true,
    }
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Submitted Successfully', '');
        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

}
