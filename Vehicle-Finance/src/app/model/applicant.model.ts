import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';

export interface Applicant {
  applicantDetails?: ApplicantDetails;
  aboutIndivProspectDetails?: IndividualProspectDetails;
  indivIdentityInfoDetails?: IndivIdentityInfoDetails;
  indivProspectProfileDetails?: IndivProspectProfileDetails;
  corporateProspectDetails?: CorporateProspectDetails;
  addressDetails?: AddressDetails[];
}

export interface ApplicantList {
  applicantId?: number;
  applicantType?: string;
  applicantTypeKey?: string;
  companyPhoneNumber?: string;
  dob?: string;
  doi?: string;
  entity?: string;
  entityTypeKey?: string;
  fullName?: string;
  mobileNumber?: string;
  ucic?: string;
}

export interface ApplicantDetails {
  name1?: string;
  name2?: string;
  name3?: string;
  title?: string;
  titleValue?: string;
  loanApplicationRelation?: string;
  entityType?: string;
  entity?: string;
  customerCategory?: string;
  custSegment? : string;
  applicantTypeKey?: string;
  entityTypeKey?: string;
}

export interface ApplicantList {
  applicantId?: number;
  applicantType?: string;
  applicantTypeKey?: string;
  companyPhoneNumber?: string;
  dob?: string;
  doi?: string;
  entity?: string;
  entityTypeKey?: string;
  fullName?: string;
  mobileNumber?: string;
  ucic?: string;
}

export interface IndividualProspectDetails {
  dob?: string;
  mobilePhone?: string;
  isSeniorCitizen?: string;
  isMinor?: string;
  minorGuardianName?: string;
  minorGuardianUcic?: number;
  spouseName?: string;
  fatherName?: string;
  motherMaidenName?: string;
  nationality?: string;
  occupation?: string;
  emailId?: string;
  alternateEmailId?: string;
  preferredLanguage?: string;
  designation?: string;
  currentEmpYears?: string;
  employeeCode?: number;
  employerType?: string;
  employerName?: string;
  department?: string;

  age?: number;
  gender? : string;
  minorGuardianRelation? : string;
  alternateMobileNumber? : string;
  politicallyExposedPerson? : string;
}

export interface AddressDetails {
  addressType?: string;
  addressLineOne?: string;
  addressLineTwo?: string;
  addressLineThree?: string;
  pincode?: number;
  city?: number;
  district?: number;
  state?: number;
  country?: string;
  landlineNumber?: string;
  mobileNumber?: string;
  accommodationType?: string;
  periodOfCurrentStay?: number;
  isCurrAddSameAsPermAdd?: string;
  entityTypeKey?: string;
}

export interface CorporateProspectDetails {
  dateOfIncorporation?: string;
  countryOfCorporation?: string;
  companyEmailId?: string;
  alternateEmailId?: string;
  preferredLanguageCommunication?: string;
  numberOfDirectors?: number;
  directorName?: string;
  directorIdentificationNumber?: string;
  contactPerson?: string;
  contactPersonDesignation?: string;
  contactPersonMobile?: string;
  ratingIssuerName?: string;
  externalRatingAssigned?: string;
  externalRatingIssueDate?: string;
  externalRatingExpiryDate?: string;
  foreignCurrencyDealing?: string;
  exposureBankingSystem?: string;
  creditRiskScore?: string;
  tinNumber?: string;
  corporateIdentificationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  panType?: string;
  aadhar?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  drivingLicenseNumber?: string;
  drivingLicenseIssueDate?: string;
  drivingLicenseExpiryDate?: string;
  voterIdNumber?: string;
  voterIdIssueDate?: string;
  voterIdExpiryDate?: string;
  companyPhoneNumber?: string;
  occupation?: string;
}

export interface IndivIdentityInfoDetails {
  form60?: string;
  pan?: string;
  panType?: string;
  aadhar?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  drivingLicenseNumber?: string;
  drivingLicenseIssueDate?: string;
  drivingLicenseExpiryDate?: string;
  voterIdNumber?: string;
  voterIdIssueDate?: string;
  voterIdExpiryDate?: string;
}

export interface IndivProspectProfileDetails {
  employerType?: string;
  employerName?: string;
  workplaceAddress?: string;
}

export interface ApplicantDedupe {
  IDProof?: string;
  aadhar?: string;
  dob?: string;
  documentCkycNumber?: string;
  documentDrivingLicense?: string;
  documentForeignerPassport?: string;
  documentIDProof?: string;
  documentPassport?: string;
  documentVoterID?: string;
  foreignerPassport?: string;
  fullName?: string;
  isExactMatch?: boolean;
  isProbableMatch?: true;
  matchedCriteria?: string;
  mobile?: string;
  pan?: string;
  passport: null;
  prospectCkycNumber?: string;
  prospectDrivingLicense?: string;
  prospectPassport?: string;
  prospectVoterID?: string;
  ucic?: string;
  voterID?: string;
}
