import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, FormArrayName } from '@angular/forms';
import { Router } from '@angular/router';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';


@Component({
  selector: 'app-applicantdocument',
  templateUrl: './applicantdocument.component.html',
  styleUrls: ['./applicantdocument.component.css']
})
export class ApplicantdocumentComponent implements OnInit {

  values: any = [];
  public labels: any = {};
  public applicantForm: FormGroup

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private labelsData: LabelsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initform();
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      });
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].applicantDocument[0];
    })

  }
  initform() {
    this.applicantForm = this.fb.group({
      identityProof: this.fb.array([this.initControls()]),
      addressProof: this.fb.array([this.initControls()]),
      incomeProof: this.fb.array([this.initControls()]),
      additionalProof: this.fb.array([this.initControls()])
    })
  }

  initControls() {
    return this.fb.group({
      documentName: '',
      documentNumber: '',
      issueDate: '',
      documentExpiryDate: '',
      mandatoryStage: '',
      deferralDate: '',
      status: '',
      uploadDocument: '',
    })
  }

  get identityControls() {
    return this.applicantForm.get('identityProof') as FormArray
  }
  get addressControls() {
    return this.applicantForm.get('addressProof') as FormArray
  }
  get incomeControls() {
    return this.applicantForm.get('incomeProof') as FormArray
  }
  get additionalControls() {
    return this.applicantForm.get('additionalProof') as FormArray
  }

  addIdentity() {
    this.identityControls.push(this.initControls())
  }
  removeIdentity(index) {
    if (index >= 1) {
      this.identityControls.removeAt(index)
    }
  }

  addIncome() {
    this.incomeControls.push(this.initControls())
  }
  removeIncome(index) {
    if (index >= 1) {
      this.incomeControls.removeAt(index)
    }
  }

  addAdditional() {
    this.additionalControls.push(this.initControls())
  }
  removeAdditional(index) {
    if (index >= 1) {
      this.additionalControls.removeAt(index)
    }
  }

  addAddress() {
    this.addressControls.push(this.initControls())
  }
  removeAddress(index) {
    if (index >= 1) {
      this.addressControls.removeAt(index)
    }
  }

  onSubmitForm() {
    this.router.navigate(['/pages/document-viewupload/collateral-documents']);
  }
}
