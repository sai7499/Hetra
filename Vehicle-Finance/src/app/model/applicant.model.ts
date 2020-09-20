import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';

export interface Applicant {
  otpVerified?: boolean;
  ucic? : number ;
  applicantDetails?: ApplicantDetails;
  aboutIndivProspectDetails?: IndividualProspectDetails;
  indivIdentityInfoDetails?: IndivIdentityInfoDetails;
  indivProspectProfileDetails?: IndivProspectProfileDetails;
  corporateProspectDetails?: CorporateProspectDetails;
  addressDetails?: AddressDetails[];
  directorDetails?: DirectorDetails[];
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
  custSegment?: string;
  applicantTypeKey?: string;
  entityTypeKey?: string;
  bussinessEntityType?: string;
  monthlyIncomeAmount?: string;
  annualIncomeAmount?: string;
  ownHouseProofAvail?: string;
  houseOwnerProperty?: string;
  ownHouseAppRelationship?: string;
  averageBankBalance?: string;
  rtrType?: string;
  prevLoanAmount?: string;
  loanTenorServiced?: number;
  currentEMILoan?: string;
  agriNoOfAcres?: number;
  agriOwnerProperty?: string;
  agriAppRelationship?: string;
  grossReceipt?: string;
  isAddrSameAsApplicant? : string;
  modifyCurrentAddress ? : string;
  srNumber? : string;
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
  gender?: string;
  minorGuardianRelation?: string;
  alternateMobileNumber?: string;
  politicallyExposedPerson?: string;
  
  businessType? : string;
  businessName? : string;
  businessStartDate? : string;
  currentBusinessYears? : string;
  turnOver? : string;

  relationWithApplicant?: string;
  recommendations?: string;
  yearsInCurrentResidence?: string;
  religion?: string;
  community?: string;
  isMinority ?: string;
  residentStatus?: string;
  maritalStatus?: string;
  weddingAnniversaryDate?: string;
  eduQualification?: string;
  noOfAdultsDependant?: string;
  noOfChildrenDependant?: string;
  marginMoney?: string;
  emiAffordability?: string;
  addressDetails?: string;
  pobox?: string;

  isEquitasEmployee? : string;
  isEquitasEmployeeRelative? : string;
  equitasEmployeeNumber? : string;

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
  nearestLandmark?: string;
  pobox? : string;
}

export interface CorporateProspectDetails {
  dateOfIncorporation?: string;
  countryOfCorporation?: string;
  businessType? : string;
  industry? : string;
  alternateContactNumber? : string;
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
  tanNumber? : string;
  cstVatNumber?: string;
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

export interface DirectorDetails{
  directorName?: string;
  din?: string;
}
