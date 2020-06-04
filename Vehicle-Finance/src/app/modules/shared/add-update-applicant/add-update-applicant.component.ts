import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LeadStoreService } from '@services/lead-store.service';
import { SaveUpdateApplicantService } from '@services/add-update-applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ApplicantService } from '@services/applicant.service';
import { UtilityService } from '@services/utility.service';
import { formatDate, Location } from '@angular/common';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import {
  Applicant,
  ApplicantDetails,
  AddressDetails,
  IndivIdentityInfoDetails,
  IndivProspectProfileDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-add-update-applicant',
  templateUrl: './add-update-applicant.component.html',
  styleUrls: ['./add-update-applicant.component.css'],
})
export class AddOrUpdateApplicantComponent implements OnInit {
  values: any = [];
  labels: any = {};
  LOV: any = [];
  coApplicantForm: FormGroup;
  isCurrAddSameAsPermAdd: any = 0;
  applicantId: number;
  applicant: Applicant;
  selectedApplicant: number;

  applicantType = 'INDIVENTTYP';

  panValue = '1PANTYPE';
  leadId: number;
  applicantDetails: ApplicantDetails;

  aboutIndivProspectDetails: IndividualProspectDetails;

  indivIdentityInfoDetails: IndivIdentityInfoDetails;

  indivProspectProfileDetails: IndivProspectProfileDetails;

  corporateProspectDetails: CorporateProspectDetails;

  addressDetails: AddressDetails[];
  isPanDisabled: boolean;

  selectApplicantType(event: any) {
    console.log(this.applicantType);
    this.applicantType = event.target.value;
  }

  getPanValue(event: any) {
    this.panValue = event.target.value;
    console.log('PanValue', this.panValue);
    this.isPanDisabled = this.panValue === '1PANTYPE' ? false : true;
    console.log('ispandisabled', this.isPanDisabled);
    if (this.isPanDisabled) {
      this.coApplicantForm.controls['pan'].disable();
    } else {
      this.coApplicantForm.controls['pan'].enable();
    }
  }

  constructor(
    private labelsData: LabelsService,
    private lovData: LovDataService,
    private CommomLovService: CommomLovService,
    private leadStoreService: LeadStoreService,
    private activatedRoute: ActivatedRoute,
    // private saveUpdateApplicant: SaveUpdateApplicantService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private utilityService: UtilityService,
    private router: Router,
    private createLeadDataService: CreateLeadDataService,
    private location: Location
  ) {}

  onBack() {
    this.location.back();
  }

  getLeadId() {
    //   const currentUrl = this.location.path().split('/');
    //   let id;
    //   currentUrl.find((value) => {

    //     if(Number(value)) {
    //         id =  Number(value);
    //     }
    // });
    const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    console.log('Id inside getLead ID');
    return leadSectioData.leadId;
  }
  ngOnInit() {
    this.leadId = this.getLeadId();
    this.initForm();
    this.coApplicantForm.patchValue({ entity : 'Non-individual'})
    this.getLOV();
    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res');
      this.values = res[0].addApplicant[0];
      console.log(this.values, 'values');
      // this.values.entity= res[0].addApplicant[0].entity
      // this.setFormValue();
    });
    this.activatedRoute.params.subscribe((value) => {
      console.log('params value', value);
      // const applicantId = value ? value.id : null;
      // if (applicantId !== null && applicantId !== undefined) {
      //   this.selectedApplicant = Number(applicantId);
      //   const selectedApplicant: Applicant = this.leadStoreService.getSelectedApplicant(
      //     Number(applicantId)
      //   );
      //   this.setFormValue(selectedApplicant);
      //   console.log('selectedApplicant', selectedApplicant);
      // }
      if (!value || !value.id) {
        return;
      }
      this.applicantId = Number(value.id);
      console.log('selectedApplicant', this.applicantId);
      this.getApplicantDetails();
    });
  }

  createAddressObject(address: AddressDetails) {
    if (!address) {
      return;
    }
    return {
      addressLineOne: address.addressLineOne,
      addressLineTwo: address.addressLineTwo,
      addressLineThree: address.addressLineThree,
      pincode: address.pincode,
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
      landlineNumber: address.landlineNumber,
    }
  }
  getApplicantDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const applicant: Applicant = {
        ...processVariables,
      };
      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();
      console.log('applicantDetailsfromService--', this.applicant);
      this.applicantType = this.applicant.applicantDetails.entityTypeKey;
      console.log('Entity TYPE IN APPLICANT DETAILS CALL', this.applicantType);
      //this.setBasicData();
      setTimeout(() => {
        this.setFormValue(this.applicant);
      });
    });
  }
  getLOV() {
    this.CommomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('ADD/UPDATE APPLICANT ---', this.LOV);
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      // entity: new FormControl(''),
      loanApplicationRelation: new FormControl(''),
      // firstName: new FormControl(''),
      // middleName: new FormControl(''),
      // lastName: new FormControl(''),
      entityType: new FormControl(''),
      name1: new FormControl(''),
      name2: new FormControl(''),
      name3: new FormControl(''),
      company_name1: new FormControl(''),
      company_name2: new FormControl(''),
      company_name3: new FormControl(''),
      mobilePhone: new FormControl(''),
      dob: new FormControl(''),
      dateOfIncorporation: new FormControl(''),
      voterIdNumber: new FormControl(''),
      identity_type: new FormControl(''),
      aadhar: new FormControl(''),
      form60: new FormControl(''),
      panType: new FormControl(''),
      pan: new FormControl(''),
      // drivinglicense: new FormControl(''),
      passportNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      identity_copy: new FormControl(''),
      permentAddress: new FormGroup({
        addressLineOne: new FormControl(''),
        addressLineTwo: new FormControl(''),
        addressLineThree: new FormControl(''),
        pincode: new FormControl(''),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(''),
      }),
      communicationAddress: new FormGroup({
        addressLineOne: new FormControl(''),
        addressLineTwo: new FormControl(''),
        addressLineThree: new FormControl(''),
        pincode: new FormControl(''),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(''),
      }),
      registeredAddress: new FormGroup({
        addressLineOne: new FormControl(''),
        addressLineTwo: new FormControl(''),
        addressLineThree: new FormControl(''),
        pincode: new FormControl(''),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(''),
      }),
      // line1: new FormControl(''),
      // line2: new FormControl(''),
      // line3: new FormControl(''),
      // current_pincode: new FormControl(''),
      // current_address_city: new FormControl(''),
      // current_address_district: new FormControl(''),
      // current_address_state: new FormControl(''),
      // current_address_country: new FormControl(''),
      // current_landline: new FormControl(''),
      // registered_line1: new FormControl(''),
      // registered_line2: new FormControl(''),
      // registered_line3: new FormControl(''),
      // registered_pincode: new FormControl(''),
      // registered_address_city: new FormControl(''),
      // registered_address_district: new FormControl(''),
      // registered_address_state: new FormControl(''),
      // registered_address_country: new FormControl(''),
      // reg_mobile: new FormControl(''),
      drivingLicenseNumber: new FormControl(''),
      drivingLicenseIssueDate: new FormControl(''),
      drivingLicenseExpiryDate: new FormControl(''),
      passportIssueDate: new FormControl(''),
      passportExpiryDate: new FormControl(''),
    });

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('-');
    return date;
  }
  getDetails() {
    // let pan,aadhar,mobile,dob,dateOfIncorporation;
    const details: any = {};
    if (this.applicantType === 'INDIVENTTYP') {
      console.log(
        'Entity TYPE IN APPLICANT Get DETAILS CALL',
        this.applicantType
      );
      const indivIdentityInfoDetails = this.applicant.indivIdentityInfoDetails
        ? this.applicant.indivIdentityInfoDetails
        : {};
      const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
        ? this.applicant.aboutIndivProspectDetails
        : {};
      details.pan = indivIdentityInfoDetails.pan;
      details.aadhar = indivIdentityInfoDetails.aadhar;
      details.mobile = aboutIndivProspectDetails.mobilePhone;
      details.panType = indivIdentityInfoDetails.panType;
      details.voterIdNumber = indivIdentityInfoDetails.voterIdNumber;
      // const DOB = this.applicant.aboutIndivProspectDetails.dob;
      details.dob = this.getFormateDate(aboutIndivProspectDetails.dob);
      console.log('PantYPE Format While patching pancard', details.panType);
      //details.dob = this.applicant.aboutIndivProspectDetails.dob;
      details.passportNumber = indivIdentityInfoDetails.passportNumber;
      details.passportIssueDate = this.getFormateDate(
        indivIdentityInfoDetails.passportIssueDate
      );
      details.passportExpiryDate = this.getFormateDate(
        indivIdentityInfoDetails.passportExpiryDate
      );
      details.drivingLicenseNumber =
        indivIdentityInfoDetails.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.getFormateDate(
        indivIdentityInfoDetails.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.getFormateDate(
        indivIdentityInfoDetails.drivingLicenseExpiryDate
      );
    } else {
      const corporateProspectDetails = this.applicant.corporateProspectDetails
        ? this.applicant.corporateProspectDetails
        : {};
      details.pan = corporateProspectDetails.panNumber;
      details.aadhar = corporateProspectDetails.aadhar;
      details.mobile = corporateProspectDetails.companyPhoneNumber;
      details.panType = corporateProspectDetails.panType;
      details.dateOfIncorporation = this.getFormateDate(
        corporateProspectDetails.dateOfIncorporation
      );
      details.passportNumber = corporateProspectDetails.passportNumber;
      details.passportIssueDate = this.getFormateDate(
        corporateProspectDetails.passportIssueDate
      );
      details.passportExpiryDate = this.getFormateDate(
        corporateProspectDetails.passportExpiryDate
      );
      details.drivingLicenseNumber =
        corporateProspectDetails.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.getFormateDate(
        corporateProspectDetails.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.getFormateDate(
        corporateProspectDetails.drivingLicenseExpiryDate
      );
      details.voterIdNumber = corporateProspectDetails.voterIdNumber;
    }
    return details;
  }

  setFormValue(applicantValue) {
    console.log('applicant value', applicantValue);
    if (!applicantValue) {
      console.log('applicant value -1', applicantValue);
      return;
    } else {
      console.log('applicant 2', applicantValue);
      const details = this.getDetails();
      this.coApplicantForm.patchValue({
        entityType: applicantValue.applicantDetails.entityTypeKey || '',
        loanApplicationRelation:
          applicantValue.applicantDetails.applicantTypeKey || '',
        name1: applicantValue.applicantDetails.name1 || '',
        name2: applicantValue.applicantDetails.name2 || '',
        name3: applicantValue.applicantDetails.name3 || '',
        // company_name1: applicantValue.company_name1 || '',
        // company_name2: applicantValue.company_name2 || '',
        // company_name3: applicantValue.company_name3 || '',
        mobilePhone: details.mobile || '',
        dob: details.dob || '',
        dateOfIncorporation: details.dateOfIncorporation || '',
        identity_type: applicantValue.identity_type || '',
        panType: details.panType,
        aadhar: details.aadhar || '',
        voterIdNumber: details.voterIdNumber,
        //panform: details.form60 || '',
        pan: details.pan || '',
        // drivinglicense: applicantValue.drivinglicense || '',
        drivingLicenseNumber: details.drivingLicenseNumber || '',
        drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
        drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
        passportNumber: details.passportNumber || '',
        passportIssueDate: details.passportIssueDate || '',
        passportExpiryDate: details.passportExpiryDate || '',
        identity_number: applicantValue.identity_number || '',
        identity_copy: applicantValue.identity_copy || '',
        address1: applicantValue.address1 || '',
        address2: applicantValue.address2 || '',
        address3: applicantValue.address3 || '',
        permanent_address_city: applicantValue.permanent_address_city || '',
        permanent_address_district:
          applicantValue.permanent_address_district || '',
        permanent_address_state: applicantValue.permanent_address_state || '',
        permanent_address_country:
          applicantValue.permanent_address_country || '',
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
        registered_address_district:
          applicantValue.registered_address_district || '',
        registered_address_state: applicantValue.registered_address_state || '',
        registered_address_country:
          applicantValue.registered_address_country || '',
      });

      if(this.applicant.applicantDetails.entityTypeKey=='INDIVENTTYP'){
        const permentAddress = this.coApplicantForm.get('permentAddress');
        const cummunicationAddress = this.coApplicantForm.get(
        'communicationAddress'
      );
      
      // const result = format(new Date(details.passportIssueDate), 'yyyy-MM-dd');
        console.log('Permsnt Address in', permentAddress);
      //const addressObj = this.getAddressObj();
      // console.log('addressObj', addressObj)
     // const address = this.applicant.addressDetails;
      // const addressType = this.applicant.addressDetails[0].addressType;
      // console.log('Address Type is', addressType);
      // const permenantAddressObj = address ? address[0] : {};
      // const cummunicationAddressObj = address ? address[1] : {};
        const addressObj = this.getAddressObj();
        console.log('Address Obj', addressObj);
        const permenantAddressObj = addressObj['PERMADDADDTYP'];
     
        permentAddress.patchValue(this.createAddressObject(permenantAddressObj));
       
        const cummunicationAddressObj = addressObj['COMMADDADDTYP'];
       
        cummunicationAddress.patchValue(this.createAddressObject(cummunicationAddressObj));
      

      } else {
        const addressObj = this.getAddressObj();
        const registeredAddress = this.coApplicantForm.get('registeredAddress');
        const registeredAddressObj = addressObj['REGADDADDTYP'];
        registeredAddress.patchValue(this.createAddressObject(registeredAddressObj));
      }
      

     
    }
    console.log('this.coApplicantForm', this.coApplicantForm.value);
  }
  getAddressObj() {
    const address = this.applicant.addressDetails;
    const addressObj = {};
    if (address) {
      address.forEach((value) => {
        if (value.addressType === 'PERMADDADDTYP') {
          addressObj['PERMADDADDTYP'] = value;
        } else if (value.addressType === 'COMMADDADDTYP') {
          addressObj['COMMADDADDTYP'] = value;
        } else if (value.addressType === 'REGADDADDTYP') {
          addressObj['REGADDADDTYP'] = value;
        }
      });
    }
    return addressObj;
  }

  onNext() {
    // this.leadSectionService.setCurrentPage(1);
  }

  getEntityObject(key: string) {
    console.log(this.values.entity, 'entity', key);
    return this.values.entity.find((value) => value.key === Number(key));
  }

  formatGivenDate(date) {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-us') : '';
  }
  storeIndividualValueInService(coApplicantModel) {
    this.aboutIndivProspectDetails = {
      dob: this.formatGivenDate(coApplicantModel.dob),
      mobilePhone: coApplicantModel.mobilePhone,
      // isSeniorCitizen: '1',
      // isMinor: '1',
      // minorGuardianName: 'Kumar',
      // minorGuardianUcic: 600700,
      // spouseName: 'Rani',
      // fatherName: 'Raja',
      // motherMaidenName: 'Kumari',
      // nationality: 'INDNATIONALITY',
      // occupation: 'DOCPTION',
      // emailId: 'test@test.com',
      // alternateEmailId: 'test1@test.com',
      // preferredLanguage: 'ENGPRFLAN',
      // designation: 'PRODMNGDESIGNATION',
      // currentEmpYears: '10 Years',
      // employeeCode: 100200,
      // department: 'department'
    };

    this.indivIdentityInfoDetails = {
      form60: coApplicantModel.form60,
      panType: coApplicantModel.panType,
      pan: coApplicantModel.pan,
      aadhar: coApplicantModel.aadhar,
      passportNumber: coApplicantModel.passportNumber,
      passportIssueDate: this.formatGivenDate(
        coApplicantModel.passportIssueDate
      ),
      passportExpiryDate: this.formatGivenDate(
        coApplicantModel.passportExpiryDate
      ),
      drivingLicenseNumber: coApplicantModel.drivingLicenseNumber,
      drivingLicenseIssueDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseExpiryDate
      ),
      voterIdNumber: coApplicantModel.voterIdNumber,
      // voterIdIssueDate: '21-Mar-2020',
      // voterIdExpiryDate: '21-Mar-2021'
    };

    this.addressDetails = [
      {
        addressType: 'PERMADDADDTYP',
        addressLineOne: coApplicantModel.permentAddress.addressLineOne,
        addressLineTwo: coApplicantModel.permentAddress.addressLineTwo,
        addressLineThree: coApplicantModel.permentAddress.addressLineThree,
        pincode: Number(coApplicantModel.permentAddress.pincode),
        city: Number(coApplicantModel.permentAddress.city),
        district: Number(coApplicantModel.permentAddress.district),
        state: Number(coApplicantModel.permentAddress.state),
        country: 'IN',
        landlineNumber: coApplicantModel.permentAddress.landlineNumber,
        // mobileNumber: '9988776655',
        // accommodationType: '1ADDACCTYP',
        // periodOfCurrentStay: 10,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      },
      {
        addressType: 'COMMADDADDTYP',
        addressLineOne: coApplicantModel.communicationAddress.addressLineOne,
        addressLineTwo: coApplicantModel.communicationAddress.addressLineTwo,
        addressLineThree:
          coApplicantModel.communicationAddress.addressLineThree,
        pincode: Number(coApplicantModel.communicationAddress.pincode),
        city: Number(coApplicantModel.communicationAddress.city),
        district: Number(coApplicantModel.communicationAddress.district),
        state: Number(coApplicantModel.communicationAddress.state),
        country: 'IN',
        landlineNumber: coApplicantModel.communicationAddress.landlineNumber,
        // mobileNumber: '9988776655',
        // accommodationType: '1ADDACCTYP',
        // periodOfCurrentStay: 10,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      },
    ];
  }

  storeNonIndividualValueInService(coApplicantModel) {
    this.corporateProspectDetails = {
      dateOfIncorporation: this.formatGivenDate(
        coApplicantModel.dateOfIncorporation
      ),
      // countryOfCorporation: 'IND',
      // companyEmailId: 'appiyo@appiyo.com',
      // alternateEmailId: 'inswit@appiyo.com',
      // preferredLanguageCommunication: 'ENGPRFLAN',
      // numberOfDirectors: 10,
      // directorName: 'test',
      // directorIdentificationNumber: '123456',
      // contactPerson: 'test',
      // contactPersonDesignation: 'Manager',
      // contactPersonMobile: '9988776655',
      // ratingIssuerName: 'test',
      // externalRatingAssigned: 'test',
      // externalRatingIssueDate: '22-Mar-2020',
      // externalRatingExpiryDate: '31-Mar-2020',
      // foreignCurrencyDealing: 'test',
      // exposureBankingSystem: 'test',
      // creditRiskScore: 'test',
      // tinNumber: 'tin1234',
      // corporateIdentificationNumber: '44455566',
      // gstNumber: 'GST123',
      panNumber: coApplicantModel.pan,
      // aadhar: '123456786666',
      passportNumber: coApplicantModel.passportNumber,
      passportIssueDate: this.formatGivenDate(
        coApplicantModel.passportIssueDate
      ),
      passportExpiryDate: this.formatGivenDate(
        coApplicantModel.passportExpiryDate
      ),
      drivingLicenseNumber: coApplicantModel.drivingLicenseNumber,
      drivingLicenseIssueDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseExpiryDate
      ),
      voterIdNumber: coApplicantModel.voterIdNumber,
      // voterIdIssueDate: '21-Mar-2020',
      // voterIdExpiryDate: '21-Mar-2021',
      companyPhoneNumber: coApplicantModel.mobilePhone,
      panType: coApplicantModel.panType,
    };

    this.addressDetails = [
      {
        addressType: 'REGADDADDTYP',
        addressLineOne: coApplicantModel.registeredAddress.addressLineOne,
        addressLineTwo: coApplicantModel.registeredAddress.addressLineTwo,
        addressLineThree: coApplicantModel.registeredAddress.addressLineThree,
        pincode: Number(coApplicantModel.registeredAddress.pincode),
        city: Number(coApplicantModel.registeredAddress.city),
        district: Number(coApplicantModel.registeredAddress.district),
        state: Number(coApplicantModel.registeredAddress.state),
        country: 'IN',
        landlineNumber: coApplicantModel.registeredAddress.landlineNumber,
        // mobileNumber: '9988776655',
        // accommodationType: '1ADDACCTYP',
        // periodOfCurrentStay: 10,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      },
    ];
  }
  onFormSubmit() {
    const formValue = this.coApplicantForm.value;
    console.log('formModel', formValue);
    const coApplicantModel = {
      ...formValue,
      entity: this.getEntityObject(formValue.entity),
    };
    const rawValue = this.coApplicantForm.getRawValue();
    if (this.applicantType === 'INDIVENTTYP') {
      this.storeIndividualValueInService(coApplicantModel);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      this.storeNonIndividualValueInService(coApplicantModel);
      this.applicantDataService.setIndividualProspectDetails(null);
      this.applicantDataService.setIndivIdentityInfoDetails(null);
    }

    console.log('CoApplicant form', coApplicantModel);

    if (this.selectedApplicant !== undefined) {
      this.leadStoreService.updateApplicant(
        this.selectedApplicant,
        coApplicantModel
      );
      return;
    }

    this.leadStoreService.setCoApplicantDetails(coApplicantModel);
    // this.router.navigate(['/pages/lead-section/product-details']);
    this.applicantDetails = {
      entityType: coApplicantModel.entityType,
      name1: coApplicantModel.name1,
      name2: coApplicantModel.name2,
      name3: coApplicantModel.name3,
      loanApplicationRelation: coApplicantModel.loanApplicationRelation,
      customerCategory: 'SALCUSTCAT',
      title: 'MRSALUTATION',
    };

    // this.applicantDetails = {
    //   entityType: 'INDIVENTTYP',
    //   name1: 'Kalpesh',
    //   name2: 'Madhukar',
    //   name3: 'Mahajan',
    //   loanApplicationRelation: 'APPAPPREL',
    //   title: 'MRSALUTATION',
    //   customerCategory: 'SALCUSTCAT'
    // };
    const DOB = this.utilityService.getDateFormat(coApplicantModel.dob);
    console.log('Formatted DOB', DOB);

    this.indivProspectProfileDetails = {
      employerType: 'test',
      employerName: 'Appiyo Technologies',
      workplaceAddress: 'test',
    };

    console.log(
      'Drving Licanse Issue Date',
      coApplicantModel.dateOfIncorporation
    );
    

    // this.addressDetails = [{
    //   addressType: 'PERMADDADDTYP',
    //   addressLineOne: 'test',
    //   addressLineTwo: 'test',
    //   addressLineThree: 'test',
    //   pincode: 123456,
    //   city: 1,
    //   district: 1,
    //   state: 1,
    //   country: 'IN',
    //   landlineNumber: '044202020',
    //   mobileNumber: '9988776655',
    //   accommodationType: '1ADDACCTYP',
    //   periodOfCurrentStay: 10,
    //   isCurrAddSameAsPermAdd: '1'
    // }];

    console.log('adress Details', this.addressDetails);
    const data = {
      applicantDetails: this.applicantDetails,
      aboutIndivProspectDetails: this.aboutIndivProspectDetails,
      indivIdentityInfoDetails: this.indivIdentityInfoDetails,
      indivProspectProfileDetails: this.indivProspectProfileDetails,
      corporateProspectDetails: this.corporateProspectDetails,
      addressDetails: this.addressDetails,
      applicantId: this.applicantId,
    };
    console.log(this.applicantDetails);

    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      const response = res;
      if (response.Error == 0) {
        const message = response.ProcessVariables.error.message;
        console.log('Success Message', message);
      }
      this.router.navigateByUrl(
        `pages/lead-section/${this.leadId}/exact-match`
      );
    });
  }

  onAddress(event) {
    console.log('Checkbox ' + event.target.checked);
    const eventclicked = event.target.checked;
    const formValue = this.coApplicantForm.value.permentAddress;
    console.log('Permant Address', formValue);
    this.isCurrAddSameAsPermAdd = eventclicked === true ? 1 : 0;
    console.log('isCurrAddSameAsPermAdd', this.isCurrAddSameAsPermAdd);

    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    communicationAddress.patchValue({
      addressLineOne: formValue.addressLineOne,
      addressLineTwo: formValue.addressLineTwo,
      addressLineThree: formValue.addressLineThree,
      pincode: formValue.pincode,
      city: formValue.city,
      district: formValue.district,
      state: formValue.state,
      country: formValue.country,
      landlineNumber: formValue.landlineNumber,
    });
  }
}
