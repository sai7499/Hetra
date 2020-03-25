import { Component, OnInit } from '@angular/core';
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

  applicantType: string = 'individual'

  selectApplicantType(event: any) {
    this.applicantType = event.target.value;
  }

  constructor(
    private labelsData: LabelsService, 
    private lovData: LovDataService, 
    private leadStoreService: LeadStoreService) {
    
  }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res')
      this.values = res[0].addApplicant[0];
      console.log(this.values, 'values')
      this.setFormValue();
    });
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      entity: new FormControl(''),
      first_name: new FormControl(''),
      middle_name: new FormControl(''),
      last_name: new FormControl(''),
      company_name1: new FormControl(''),
      company_name2: new FormControl(''),
      company_name3: new FormControl(''),
      mobile: new FormControl(''),
      date_of_birth: new FormControl(''),
      date_of_incorporation: new FormControl(''),
      identity_type: new FormControl(''),
      identity_number: new FormControl(''),
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
    });

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data
      },
      error => {
        console.log(error);
      })
  }

  // setFormValue() {
  //   const applicantValue = this.leadStoreService.getCoApplicantDetails() || {}
  //   this.coApplicantForm.patchValue({
  //     entity: applicantValue.entity || '',
  //     first_name: applicantValue.firstName || '',
  //     middle_name: applicantValue.middleName || '',
  //     last_name: applicantValue.lastName || '',
  //     company_name1: applicantValue.companyName1 || '',
  //     company_name2: applicantValue.companyName2 || '',
  //     company_name3: applicantValue.companyName3 || '',
  //     mobile: applicantValue.mobile || '',
  //     date_of_birth: applicantValue.dateOfBirth || '',
  //     date_of_incorporation: applicantValue.dateOfIncorporation || '',
  //     identity_type: applicantValue.identityType || '',
  //     identity_number: applicantValue.identityNumber || '',
  //     identity_copy: applicantValue.identityCopy || '',
  //     address1: applicantValue.permanentAddress.address1 || '',
  //     address2: applicantValue.permanentAddress.address2 || '',
  //     address3: applicantValue.permanentAddress.address3 || '',
  //     permanent_address_city: applicantValue.permanentAddress.city || '',
  //     permanent_address_district: applicantValue.permanentAddress.district || '',
  //     permanent_address_state: applicantValue.permanentAddress.state || '',
  //     permanent_address_country: applicantValue.permanentAddress.country || '',
  //     line1: applicantValue.currentAddress.address1 || '',
  //     line2: applicantValue.currentAddress.address2 || '',
  //     line3: applicantValue.currentAddress.address3 || '',
  //     current_address_city: applicantValue.currentAddress.city || '',
  //     current_address_district: applicantValue.currentAddress.district || '',
  //     current_address_state: applicantValue.currentAddress.state || '',
  //     current_address_country: applicantValue.currentAddress.country || '',
  //     registered_line1: applicantValue.registeredAddress.address1 || '',
  //     registered_line2: applicantValue.registeredAddress.address2 || '',
  //     registered_line3: applicantValue.registeredAddress.address3 || '',
  //     registered_address_city: applicantValue.registeredAddress.city || '',
  //     registered_address_district: applicantValue.registeredAddress.district || '',
  //     registered_address_state: applicantValue.registeredAddress.state || '',
  //     registered_address_country: applicantValue.registeredAddress.country || '',
      
  //   });
  //   console.log('applicantValue', applicantValue);
  // }

  onNext() {
    // this.leadSectionService.setCurrentPage(1);
  }

  onFormSubmit() {
    const formValue = this.coApplicantForm.value;
    const coApplicantModel = {...formValue};
    console.log('CoApplicant form', coApplicantModel);

    this.leadStoreService.setCoApplicantDetails(coApplicantModel);
    // this.router.navigate(['/pages/lead-section/product-details']);
  }

}
