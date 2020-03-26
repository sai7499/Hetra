export interface Lead {
    businessDivision?: number;
    productCategory?: number;
    childLoan?: number;
    schemePromotion?: number;
    subventionApplied?: number;
    subvention?: number;
    sourcingChannel?: number;
    sourcingType?: number;
    sourcingCode?: number;
    spokeCodeLocation?: number;
    loanAccountBranch?: number;
    leadHandledBy?: number;
    entity?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    companyName1?: string;
    companyName2?: string;
    companyName3?: string;
    mobile?: string;
    dateOfBirth?: string;
    dateOfIncorporation?: string;
    sourcingDetails?: SourcingDetails;
    productDetails?: ProductDetails;
    loanDetails?: LoanDetails;
    vehicleDetails?: VehicleDetails;
  }

export interface SourcingDetails {
    leadNumber?: string;
    leadCreatedDate?: string;
    leadCreatedBy?: string;
    leadHandledBy?: string;
    sourcingChannel?: string;
    sourcingType?: string;
    sourcingCode?: string;
    spokeCodeLocation?: string;
    loanAccountBranch?: string;
  }

export interface ProductDetails {
    businessDivision?: string;
    product?: string;
    schemePromotion?: string;
    subventionApplied?: string;
    subventionIncentive?: string;
  }

export interface VehicleDetails {
  vehicleType?: number;
  region?: number;
  registrationNumber?: string;
  assetMake?: number;
  assetModel?: number;
  assetBodyType?: number;
  assetVariant?: number;
  assetSubVariant?: number;
  monthManufacturing?: string;
  yrManufacturing?: string;
  ageOfAsset?: string;
  vechicalUsage?: number;
  vehicleCategory?: number;
  orpFunding?: boolean;
  oneTimeTax?: string;
  pac?: boolean;
  vas?: boolean;
  emiProtect?: boolean;
  fastTag?: boolean;
  others?: string;
  discount?: string;
  finalAssetCost?: string;
  idv?: string;
  insuranceValidity?: string;
  insuranceCopy?: string,
  permitType?: string;
  expiryDate?: string;
  permitCopy?: string;
  permitOthers?: string;
  frsdRequired?: string;
  frsdAmount?: string;
  fitnessDate?: string;
  fitnessCopy?: string;
  noOfVehicle?: string;
  }

export interface LoanDetails {
      loanType?: string;
      amount?: number;
      tenor?: number;
  }

export interface CoApplicant {
  entity?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  mobile?: string;
  dateOfBirth?: string;
  identityType?: number;
  identityNumber?: string;
  permanentAddress?: Address;
  currentAddress?: Address;
}

export interface Address {
  address1?: string;
  address2?: string;
  address3?: string;
  pincode?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  phone?: string;
}
