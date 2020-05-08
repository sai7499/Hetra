import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-co-applicant',
  templateUrl: './co-applicant.component.html',
  styleUrls: ['./co-applicant.component.css']
})
export class CoApplicantComponent implements OnInit {
  values: any = [];
  labels: any = {};
  coApplicantForm: FormGroup;

  selectedApplicant: number;
  isDisabled : boolean= true
  public isAlert : boolean = true;

  applicantType = '1';

  selectApplicantType(event: any) {
    console.log(this.applicantType)
    this.applicantType = event.target.value;
  }

  constructor(
    private labelsData: LabelsService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private activatedRoute: ActivatedRoute
    ) {

  }

  ngOnInit() {

    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res');
      this.values = res[0].addApplicant[0];
      console.log(this.values, 'values');
      // this.setFormValue();
    });
    this.activatedRoute.params.subscribe((value) => {
      console.log('params value', value);
      const applicantId = value ? value.id : null;
      if (applicantId !== null && applicantId !== undefined) {
        this.selectedApplicant = Number(applicantId);
        const selectedApplicant: Temp = this.leadStoreService.getSelectedApplicant(Number(applicantId));
        this.setFormValue(selectedApplicant);
        console.log('selectedApplicant', selectedApplicant);
      }
    });
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      entity: new FormControl(''),
      relationshipwithloanapplicant: new FormControl(''),
      first_name: new FormControl(''),
      middle_name: new FormControl(''),
      last_name: new FormControl(''),
      company_name1: new FormControl(''),
      company_name2: new FormControl(''),
      company_name3: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl(''),
      date_of_incorporation: new FormControl(''),
      identity_type: new FormControl(''),
      aadharnumber:new FormControl(''),
      panform: new FormControl(''),
      pannumber:new FormControl(''),
      // drivinglicense: new FormControl(''),
      passportnumber:new FormControl(''),
      identityNumber: new FormControl(''),
      identity_copy: new FormControl(''),
      address1: new FormControl(''),
      address2: new FormControl(''),
      address3: new FormControl(''),
      pincode: new FormControl(''),
      permanent_address_city: new FormControl(''),
      permanent_address_district: new FormControl(''),
      permanent_address_state: new FormControl(''),
      permanent_address_country: new FormControl(''),
      landline: new FormControl(''),
      line1: new FormControl(''),
      line2: new FormControl(''),
      line3: new FormControl(''),
      current_pincode: new FormControl(''),
      current_address_city: new FormControl(''),
      current_address_district: new FormControl(''),
      current_address_state: new FormControl(''),
      current_address_country: new FormControl(''),
      current_landline: new FormControl(''),
      registered_line1: new FormControl(''),
      registered_line2: new FormControl(''),
      registered_line3: new FormControl(''),
      registered_pincode: new FormControl(''),
      registered_address_city: new FormControl(''),
      registered_address_district: new FormControl(''),
      registered_address_state: new FormControl(''),
      registered_address_country: new FormControl(''),
      reg_mobile: new FormControl(''),
      drivingLicenseNumber : new FormControl(''),
      drivingLicenceIssueDate : new FormControl(''),
      drivingLicenceExpiryDate :new FormControl(''),
      passportIssueDate:new FormControl(''),
      passportExpiryDate:new FormControl('')
    });

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log('labels',this.labels)
      },
      error => {
        console.log(error);
      });
  }

  setFormValue(applicantValue: Temp) {
    console.log('applicant value', applicantValue)
    if (!applicantValue) {
      console.log('applicant value -1', applicantValue)
      return;
    }
    else{
      console.log('applicant 2', applicantValue)
    this.coApplicantForm.patchValue({
      entity: applicantValue.entity || '',
      relationshipwithloanapplicant: applicantValue.relationshipwithloanapplicant || '',
      first_name: applicantValue.first_name || '',
      middle_name: applicantValue.middle_name || '',
      last_name: applicantValue.last_name || '',
      company_name1: applicantValue.company_name1 || '',
      company_name2: applicantValue.company_name2 || '',
      company_name3: applicantValue.company_name3 || '',
      mobile: applicantValue.mobile || '',
      dateOfBirth: applicantValue.date_of_birth || '',
      date_of_incorporation: applicantValue.date_of_incorporation || '',
      identity_type: applicantValue.identity_type || '',
      aadharnumber:applicantValue.aadharnumber || '',
      panform:applicantValue.panform ||'',
      pannumber:applicantValue.pannumber || '',
      drivinglicense:applicantValue.drivinglicense ||'',
      passportnumber:applicantValue.passportnumber ||'',
      identity_number: applicantValue.identity_number || '',
      identity_copy: applicantValue.identity_copy || '',
      address1: applicantValue.address1 || '',
      address2: applicantValue.address2 || '',
      address3: applicantValue.address3 || '',
      permanent_address_city: applicantValue.permanent_address_city || '',
      permanent_address_district: applicantValue.permanent_address_district || '',
      permanent_address_state: applicantValue.permanent_address_state || '',
      permanent_address_country: applicantValue.permanent_address_country || '',
      line1: applicantValue.line1 || '',
      line2: applicantValue.line2 || '',
      line3: applicantValue.line3 || '',
      current_address_city: applicantValue.current_address_city || '',
      current_address_district: applicantValue.current_address_district || '',
      current_address_state: applicantValue.current_address_state || '',
      current_address_country: applicantValue.current_address_country || '',
      registered_line1: applicantValue.registered_line1 || '',
      registered_line2: applicantValue.registered_line2 || '',
      registered_line3: applicantValue.registered_line3 || '',
      registered_address_city: applicantValue.registered_address_city || '',
      registered_address_district: applicantValue.registered_address_district || '',
      registered_address_state: applicantValue.registered_address_state || '',
      registered_address_country: applicantValue.registered_address_country || '',
    });
  }
  }

  onNext() {
    // this.leadSectionService.setCurrentPage(1);
  }

  onFormSubmit() {
    const formValue = this.coApplicantForm.value;
    const coApplicantModel = {...formValue};
    console.log('CoApplicant form', coApplicantModel);

    if (this.selectedApplicant !== undefined) {
      this.leadStoreService.updateApplicant(this.selectedApplicant, coApplicantModel);
      return;
    }

    this.leadStoreService.setCoApplicantDetails(coApplicantModel);
    this.isAlert= false
    setTimeout(() => {
      this.isAlert = true
    },1000);
    // this.router.navigate(['/pages/lead-section/product-details']);
  }

  onAddress(event){
    console.log("Checkbox "+event.target.checked)

    if(event.target.checked){
      this.coApplicantForm.controls["line1"].setValue(this.coApplicantForm.controls.address1.value)
      this.coApplicantForm.controls["line2"].setValue(this.coApplicantForm.controls.address2.value)
      this.coApplicantForm.controls["line3"].setValue(this.coApplicantForm.controls.address3.value)
      this.coApplicantForm.controls["current_pincode"].setValue(this.coApplicantForm.controls.pincode.value)
      this.coApplicantForm.controls["current_address_city"].setValue(this.coApplicantForm.controls.permanent_address_city.value)
      this.coApplicantForm.controls["current_address_district"].setValue(this.coApplicantForm.controls.permanent_address_district.value)
      this.coApplicantForm.controls["current_address_state"].setValue(this.coApplicantForm.controls.permanent_address_state.value)
      this.coApplicantForm.controls["current_address_country"].setValue(this.coApplicantForm.controls.permanent_address_country.value)
      this.coApplicantForm.controls["current_landline"].setValue(this.coApplicantForm.controls.landline.value)



      this.coApplicantForm.controls["line1"].disable()
      this.coApplicantForm.controls["line2"].disable()
      this.coApplicantForm.controls["line3"].disable()
      this.coApplicantForm.controls["current_pincode"].disable()
      this.coApplicantForm.controls["current_address_city"].disable()
      this.coApplicantForm.controls["current_address_district"].disable()
      this.coApplicantForm.controls["current_address_state"].disable()
      this.coApplicantForm.controls["current_address_country"].disable()
      this.coApplicantForm.controls["current_landline"].disable()   
    }
    else{
      this.coApplicantForm.controls["line1"].enable()
      this.coApplicantForm.controls["line2"].enable()
      this.coApplicantForm.controls["line3"].enable()
      this.coApplicantForm.controls["current_pincode"].enable()
      this.coApplicantForm.controls["current_address_city"].enable()
      this.coApplicantForm.controls["current_address_district"].enable()
      this.coApplicantForm.controls["current_address_state"].enable()
      this.coApplicantForm.controls["current_address_country"].enable()
      this.coApplicantForm.controls["current_landline"].enable()
      }
  }

}

export interface Temp {
  entity?: string;
  relationshipwithloanapplicant?:string
first_name?: string;
middle_name?: string;
last_name?: string;
company_name1?: string;
company_name2?: string;
company_name3?: string;
mobile?: string;
date_of_birth?: string;
date_of_incorporation?: string;
identity_type?: string;
aadharnumber?:string;
panform?:string;
pannumber?:string;
drivinglicense?:string;
passportnumber?:string;
identity_number?: string;
identity_copy?: string;
address1?: string;
address2?: string;
address3?: string;
pincode?: string;
permanent_address_city?: string;
permanent_address_district?: string;
permanent_address_state?: string;
permanent_address_country?: string;
landline?: string;
line1?: string;
line2?: string;
line3?: string;
current_pincode?: string;
current_address_city?: string;
current_address_district?: string;
current_address_state?: string;
current_address_country?: string;
current_landline?: string;
registered_line1?: string;
registered_line2?: string;
registered_line3?: string;
registered_pincode?: string;
registered_address_city?: string;
registered_address_district?: string;
registered_address_state?: string;
registered_address_country?: string;
reg_mobile?: string;
}
