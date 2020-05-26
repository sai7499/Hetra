export interface Applicant {
  name1?: string;
  name2?: string;
  name3?: string;
  title?: string;
  loanApplicationRelation?: string;
  entityType?: string;
  customerCategory?: string;
}

export interface IndividualProspectDetails {
  dob?: string;
  mobilePhone?: string;
  isSeniorCitizen?: string;
  isMinor?: string;
  minorGuardianName?: string;
  minorGuardianUcic?: string;
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
  department?: string;
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
}
