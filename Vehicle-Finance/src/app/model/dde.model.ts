import { ReferenceCheckComponent } from '@modules/dde/fi-cum-pd-report/reference-check/reference-check.component';

export interface Dde {
    vehicleValuation?: VehicleValuation;
    pslData?: PslData;
    applicantDetails?: ApplicantDetails;
    customerProfile?: CustomerProfile;
    loanDetails?: LoanDetails;
    fleetDetails?: FleetDetails;
    trackVehicle?: TrackVehicle;
    referenceCheck?: ReferenceCheck;
    fieldInvestigation?: FieldInvestigation;
}

export interface VehicleValuation {
    valuatorType?: string;
    valuatorCode?: string;
    valuatorName?: string;
    valuationAmount?: number;
    valuationDate?: string;
    idv?: string;
    idvValidityDate?: string;
    vhAvailInGrid?: string;
    gridAmount?: string;
    assetManufacturer?: string;
    assetModel?: string;
    newUsedAsset?: string;
    vechicleNoPrefix?: string;
    vechicleNumber?: string;
    chassisNumber?: string;
    engineNumber?: string;
    yearRegOfAsset?: string;
    monthRegOfAsset?: string;
    ageOfAsset?: string;
    sellerShortDescr?: string;
    secondAsset?: string;
    secondVechicleNoPrefix?: string;
    secondVechicleNo?: string;
    secondChassisNumber?: string;
    agricultureProof?: string;
    fcExpiryDate?: string;
    vehicleRegDate?: string;
    gvw?: string;
    reRegisteredVechicle?: string;
    interStateVehicle?: string;
    duplicateRC?: string;
    cubicCapacity?: string;
    seatingCapacity?: string;
    existingVechicleOwned?: string;
    noOfVehicles?: string;
    existingSelfCostAsset?: string;
    total?: string;
    make?: string;
    model?: string;
    year?: string;
    registeredOwner?: string;
    registeredOwnerName?: string;
    vhNoPrefix?: string;
    vhNumber?: string;
    costOfVehicle?: string;
}

export interface PslData {
    activity?: string;
    propertyType?: string;
    detailActivity?: string;
    goodsManufactured?: string;
    typeOfService?: string;
    purposeOfLoanAg?: string;
    purposeOfLoanMsme?: string;
    businessActivity?: string;
    landHolding?: string;
    landOwner?: string;
    relWithLandowner?: string;
    farmerType?: string;
    landAreaInAcres?: string;
    landProof?: string;
    landProofUpload?: string;
    loanAmount?: string;
    proofOfInvest?: string;
    investProofUpload?: string;
    nameOfCa?: string;
    nameOfCaFirm?: string;
    caRegisterNo?: string;
    udinNo?: string;
    caCertifiedAmount?: string;
    otherInvestmentCost?: string;
    totalInvestmentCost?: string;
    investInEquipment?: string;
    investPlantMachinery?: string;
    cityTier?: string;
    investmentSocialInfra?: string;
    investmentOtherBank?: string;
    totalInvestment?: string;
    propertyLocatedCity?: string;
    propertyLocation?: string;
    propertyPincode?: string;
    landAmount?: string;
    landCost?: string;
    constructionCost?: string;
    totalPropertyCost?: string;
    registrationCost?: string;
    pslConsiderCost?: string;
    pslCategoryAg?: string;
    pslCategoryMsme?: string;
    pslCategoryHos?: string;
    pslSubCategoryAg?: string;
    pslSubCategoryMsme?: string;
    pslCertificateAg?: string;
    pslCertificateMsme?: string;
    pslCertificateHos?: string;
    weakerSectionAg?: string;
    weakerSectionMsme?: string;
}

export interface ApplicantDetails {
    applicantName?: string;
    fatherFullName?: string;
    gender?: string;
    maritalStatus?: string;
    dob?: string;
    physicallyChallenged?: string;
    dependants?: string;
    residancePhoneNumber?: string;
    officePhoneNumber?: string;
    mobile?: string;
    residenceAddressAsPerLoanApplication?: string;
    bankName?: string;
    accountNumber?: string;
    landmark?: string;
    addressAccessibility?: string;
    residentialLocality?: string;
    residentialType?: string;
    houseType?: string;
    sizeOfHouse?: string;
    standardOfLiving?: string;
    houseOwnership?: string;
    ownershipAvailable?: string;
    ownerProofAvail?: string;
    dependents?: string;
    owner?: string;
    areaOfProperty?: string;
    ratingbySO?: string;
    alternateAddr?: string;

}

export interface CustomerProfile {
    offAddSameAsRecord?: string;
    noOfEmployeesSeen?: string;
    nameBoardSeen?: string;
    officePremises?: string;
    sizeofOffice?: string;
    customerProfileRatingSo?: string;
    mismatchInAddress?: string;
    customerHouseSelfie?: string;
    ownershipAvailable?: string;
    mandatoryCustMeeting?: string;
    locality?: string;
}

export interface LoanDetails {

    // applicable for new vehicle
    vehicleCost?: string;
    newvehicleCost?: string;
    newVehModel?: string;
    newVehicletype?: string;
    newVehiclereqLoanAmount?: string;
    newVehiclemarginMoney?: string;

    // applicable for used vehicle

    usedVehicleCost?: number;
    usedVehModel?: string;
    usedVehicleType?: string;
    usedVehicleMarginMoney?: string;
    usedVehicleLoanAmountReq?: string;
    sourceOfVehiclePurchase?: string;
    marginMoneySource?: string;
    financierName?: string;
    coAapplicantAwareMarginMoney?: string;
    channelSourceName?: string;
    vehicleSeller?: string;
    proposedVehicle?: string;
    investmentAmount?: string;
    marginMoneyBorrowed?: string;
    marketValueProposedVehicle?: string;
    purchasePrice?: string;
    vehicleCondition?: string;
    fundsUsage?: string;
    earlierVehicleApplication?: string;
    othersRemarks?: string;
    drivingVehicleEarlier?: string;
    vehicleAttachedPlying?: string;
    awareDueDateEmiAmount?: string;
    vehicleContract?: string;

    // applicable for assetDetails used Vehicle

    vehicleMake?: string;
    modelInYear?: string;
    regNo?: string;
    regCopVfd?: string;
    vehicleHpaNbfc?: string;
    engineNumber?: string;
    chasisNumber?: string;
    permitValidity?: string;
    fitnessValidity?: string;
    taxValidity?: string;
    insuranceCopyVerified?: string;
    insuranceValidity?: string;
    vehiclePhsicallyVerified?: string;
    conditionOfVehicle?: string;
    vehicleRoute?: string;
    noOfTrips?: string;
    amtPerTrip?: string;
    selfDrivenOrDriver?: string;
    remarks?: string;
    isPrevExpMatched?: string;
}

export interface FleetDetails {

    regdNo?: string;
    regdOwner?: string;
    relation?: string;
    make?: string;
    yom?: string;
    financier?: string;
    loanNo?: string;
    purchaseDate?: string;
    tenure?: string;
    paid?: string;
    seasioning?: string;
    ad?: string;
    pd?: string;
    gridValue?: string;
}
export interface TrackVehicle {
    nameOfTheClient?: string;
    nameOfTheFinancier?: string;
    assetsFinanced?: string;
    repaymentMode?: string;
    financeAmount?: string;
    financeCharges?: string;
    contractValue?: string;
    contNo?: string;
    vehicleNo?: string;
    typesOfFinance?: string;
    accpuntStatus?: string;
    loanStatus?: string;
    loanMaturityDate?: string;
    countOn30?: string;
    cpuntOn90?: string;
    totalNoOfEmis?: string;
    noOfEmisPaid?: string;
    balanceTenor?: string;
    totalDelay?: string;
    peakDelay?: string;
    avgDelay?: string;
    trackStatus?: string;
    totalAmtPaid?: string;
    installmentAmt?: string;
    dueDate?: string;
    rcptNp?: string;
    recdDate?: string;
    rcptAmount?: string;
    delayDays?: string;
    paymentsExcess?: string;
}

export interface ReferenceCheck {
    addressOfReference?: string;
    nameOfReference?: string;
    overallFiReport?: string;
    pdRemarks?: string;
    referenceMobile?: string;
    area?: string;
    place?: string;
    routeMap?: any;
    equitasBranchName?: string;
    distanceFromBranch?: number;
    soName?: string;
    employeeCode?: string;
    date?: string;
    time?: string;
    product?: string;
    souringChannel?: string;
    longitude?: number;
    latitude?: number;
    negativeProfile?: string;

    // routeMap?:i

    // referenceType?: string,
    // routeMapId?: string,
    // stage?: string
}
export interface FieldInvestigation {
    externalAgencyName?: string;
    contactPointVerification?: string;
    cpvInitiatedDate?: string;
    cpvInitiatedTime?: string;
    reportSubmitDate?: string;
    reportSubmitTime?: string;
    applicantName?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    state?: string;
    personMetName?: string;
    designation?: string;
    natureOfBusiness?: string;
    typeOfConcern?: string;
    residenceApproach?: string;
    residenceDetails?: string;
    rentAmt?: string;
    residenceName?: string;
    verifiedFrom?: string;
    yrsOfStayInCity?: string;
    yrsOfStayInResi?: string;
    areaInSqFeet?: string;
    locality?: string;
    visibleAssets?: string;
    locatingResidence?: string;
    otherAssetsOwned?: string;
    noOfFamilyMembers?: string;
    noOfEarningMembers?: string;
    vehicleDetails?: string;
    officeApproach?: string;
    officePremises?: string;
    officeLocation?: string;
    furnishings?: string;
    officeSize?: string;
    observations?: string;
    noOfWorkingEmployees?: string;
    noOfVisibleEmployees?: string;
    activityLevel?: string;
    fiComments?: string;
    distanceInKms?: string;
    fiDate?: string;
    fiTime?: string;

}

