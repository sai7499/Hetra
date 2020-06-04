export default interface Qde {
  lead?: Lead;
}

export interface Lead {
  loanLeadDetails?: LoanLeadDetails;
  applicantDetails?: Array<ApplicantDetails>;
  sourcingDetails?: SourcingDetails;
  productDetails?: ProductDetails;
  loanDetails?: LoanDetails;
  vehicleDetails?: Array<VehicleDetails>;
}

export interface LoanLeadDetails {
  bizDivision?: string;
  productCategory?: number;
  priority?: string;
  fundingProgram?: string;
  sourcingChannel?: string;
  sourcingType?: string;
  sourcingCode?: string;
  spokeCodeLocation?: number;
  loanBranch?: number;
  leadHandeledBy?: number;
}

export interface ApplicantDetails {
  entity?: string;
  nameOne?: string;
  nameTwo?: string;
  nameThree?: string;
  mobile?: string;
  dobOrDoc?: string;
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
  DealerSubventionPartIRR?: string;
  ageOfAsset?: string;
  assetBodyType?: string;
  assetCost?: string;
  assetCostCarTrade?: string;
  assetCostIBB?: string;
  assetCostLeast?: string;
  assetCostRef?: string;
  category?: string;
  chasisNumber?: number;
  collateralId?: number
  collateralType?: string;
  cubicCapacity?: string;
  dealerSubventionAmount?: number;
  dealerSubventionPartFinCharge?: string;
  dealerSuventionApproval?: string;
  depositAccountNumber?: number;
  discount?: string;
  duplicateRc?: string;
  emiProtect?: string;
  emiProtectAmount?: number;
  engineNumber?: number;
  exShowRoomCost?: string;
  fastTag?: string;
  fastTagAmount?: number;
  finalAssetCost?: string;
  fitnessDate?: string;
  fsrdFundingReq?: string;
  fsrdPremiumAmount?: number;
  gorssVehicleWeight?: string;
  idv?: string;
  insurance?: string;
  insuranceValidity?: string;
  interStateVehicle?: string;
  inusrancePolicyNumber?: number;
  invoiceAmount?: number;
  invoiceDate?: string;
  invoiceNumber?: number;
  isOrpFunding?: string;
  leadId?: number;
  lmsCollateralId?: number;
  manuFacMonthYear?: string;
  manuFactureSubventionPartIRR?: string;
  manuFatureSubventionPartIRR?: string;
  manufacSubventionApplicable?: string;
  manufactureSubventionAmount?: number;
  noOfUnits?: string;
  oneTimeTax?: string;
  orpValue?: string;
  others?: string;
  pac?: string;
  pacAmount?: number;
  permitExpiryDate?: string;
  processtionType?: string;
  productCatCode?: string;
  rcOwnerName?: string;
  reRegVehicle?: string;
  regMonthYear?: string;
  region?: string;
  registrationNo?: number;
  seatingCapacity?: string;
  subventionType?: string;
  tonnage?: string;
  typeOfPermit?: string;
  typeOfPermitOthers?: string;
  usage?: string;
  vas?: string;
  vasAmount?: number;
  vehicleId?: number
  vehicleMfrCode?: number;
  vehicleModel?: string;
  vehicleModelCode?: string;
  vehicleOwnerShipNumber?: number;
  vehiclePurchasedCost?: string;
  vehicleRegDate?: string;
  vehicleRegNo?: number;
  vehicleSegmentCode?: string;
  vehicleTypeCode?: string;
  vehicleUsage?: string;
}

export interface IndivVehicleInfoDetails {
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
  insuranceCopy?: string;
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

export interface VehicleList {
  make?: string;
  model?: string;
  modelCode?: string;
  regNo?: string;
  segmentCode?: string;
  collateralId?: number;
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

export interface BasicVehicleDetails {
  asset_make?: string,
  asset_model?: string,
  asset_variant?: string,
  asset_sub_variant?: string,
  asset_other?: string,
  asset_body_type?: string,
  vehicle_type?: string,
  ex_showroom_cost?: string,
  final_asset_cost?: string,
  dealer_subvention_applicable?: string,
  dealer_subvention_amount?: string,
  dealer_subvention_irr?: string,
  dealer_subvention_finance?: string,
  manufacturer_subvention_applicable?: string,
  manufacturer_subvention_amount?: string,
  manufacturer_subvention_irr?: string,
  manufacturer_subvention_finance?: string,
  proforma_invoice_no?: string,
  proforma_invoice_date?: string,
  proforma_invoice_amount?: string,
  orp_funding?: string,
  insurance?: string,
  one_time_tax?: string,
  pac?: string,
  vas?: string,
  emi_protect?: string,
  fast_tag?: string,
  others?: string,
  discount?: string,
}
