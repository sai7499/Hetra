import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api = {
    getUserDetails: {
      workflowId: '7fde429c82ea11eabdc2f2fa9bec3d63',
      processId: '8000bb2e82ea11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    createLead: {
      workflowId: 'f000e040845a11eabdc2f2fa9bec3d63',
      processId: 'f0269e8e845a11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getLOVs: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: '674941a2904e11eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAssetProductCategory: {
      workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
      processId: 'b0c8aa96939d11eabdc6f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getSourcingChannel: {
      workflowId: '99e9c24294e711eabdcdf2fa9bec3d63',
      processId: '4e4033dc96a211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getLeadById: {
      workflowId: '8b7c681c95c411eabdcff2fa9bec3d63',
      processId: '8b9b2a2295c411eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getLoan360: {
      workflowId: '8b7c681c95c411eabdcff2fa9bec3d63',
      processId: '8b9b2a2295c411eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getMyLeads: {
      workflowId: 'a8cc3836959a11eabdcff2fa9bec3d63',
      processId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAnVehicleCollateralDetails: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: '5ded0268971711eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveOrUpdateVehicleCollateralDetails: {
      workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
      processId: '387d901e957e11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAllVehicleCollateralDetails: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: 'cd9ac3ba979a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getVehicleMasterFromRegion: {
      workflowId: '3bcee0ba98f311eabdcff2fa9bec3d63',
      processId: 'c986cec6ca9a11ea8b4900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getVehicleMasterFromAssetMake: {
      workflowId: '3bcee0ba98f311eabdcff2fa9bec3d63',
      processId: '57b0eaf8ca9e11eab08000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getVehicleMasterFromVehicleType: {
      workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
      processId: '3bed6af898f311eabdcff2fa9bec3d63',
      projectId: environment.projectIds.camProjectId
    },
    getDeleteVehicleDetails: {
      workflowId: '385f090a957e11eabdcff2fa9bec3d63',
      processId: '69029740a71a11eabfb4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getVehicleGridValue: {
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      processId: 'c7df01d6ac8811ea83def2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getScheme: {
      workflowId: 'b6f764c637b111eb932a00505695f93b',
      processId: 'b764556837b111eb9fd100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getAdditionalCollateralsDetails: {
      workflowId: 'cc1368caeead11ea8ecc00505695f93b',
      processId: '95c08818ef4b11eaafa600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveOrUpdateAdditionalCollaterals: {
      workflowId: 'cc1368caeead11ea8ecc00505695f93b',
      processId: 'cc61a9cceead11eaac8b00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getDeleteAdditionalCollaterals: {
      workflowId: 'cc1368caeead11ea8ecc00505695f93b',
      processId: '824fe97eeeae11ea9d1000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveUpdateFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: '0620e32c998511eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    creditBureau: {
      processId: 'a8b03e88ab2f11ea82f3f2fa9bec3d63',
      workflowId: 'fdcdedacaa2611ea825df2fa9bec3d63',
      projectId: environment.projectIds.externalApi
    },
    validateOtp: {
      processId: '3e2e4f5caad811ea82aef2fa9bec3d63',
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.externalApi
    },
    sendOtp: {
      processId: '3dec693eaad811ea82aef2fa9bec3d63',
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.externalApi
    },
    getFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: 'd6f39fda99b211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    deleteFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: '8a5ad9369b3811eabdd3f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    validateFleetDetails: {
      workflowId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
      processId: 'ae136e081a7511eb951300505695f93b',
      projectId: environment.projectIds.salesProjectId,
    },
    saveValidRecords: {
      workflowId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
      processId: 'abba4d121db711eb86ca00505695f93b',
      projectId: environment.projectIds.salesProjectId,
    },
    saveUpdateFleetRtr: {
      processId: 'be7ff35699c911eabdcff2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    validateLeadDetails: {
      workflowId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
      processId: 'e64e888231f611ebac6300505695f93b',
      projectId: environment.projectIds.camProjectId,
    },
    saveValidLeadRecords: {
      workflowId: 'e630a07e31f611eb9bb600505695f93b',
      processId: '8910dbe6338311eba9ba00505695f93b',
      projectId: environment.projectIds.camProjectId,
    },
    getFleetRtr: {
      processId: '7e26a5b29aae11eabdd1f2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    deleteFleetRtr: {
      processId: '4f83a45c9b3111eabdd3f2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getBankTransaction: {
      workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
      processId: '18e0f1d28f8f11eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getBankAccountList: {
      workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
      processId: '6ee060e68f8911eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    bankTransaction: {
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      processId: 'bbc390e48f5811eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getApplicantList: {
      workflowId: '9832e748935811eabdc6f2fa9bec3d63',
      processId: '985198b4935811eabdc6f2fa9bec3d63',
    },
    getApplicantDetail: {
      workflowId: 'b741eb7c7d5311eabdc2f2fa9bec3d63',
      processId: 'b7e97e8c7d5311eabdc2f2fa9bec3d63',
    },
    saveUpdateApplicant: {
      workflowId: '5566af426db211eabdc2f2fa9bec3d63',
      processId: '55855e7e6db211eabdc2f2fa9bec3d63',
    },
    softDeleteApplicant: {
      workflowId: '9832e748935811eabdc6f2fa9bec3d63',
      processId: '1fdbb4da9b1111eabdd2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveAndUpdateLead: {
      processId: '7e66e3fe9cc811eabdddf2fa9bec3d63',
      workflowId: 'b4e6e94c6db611eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAllIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: 'eabfa04c96ae11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    setAllIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: '658c979e967811eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    softDeleteIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: '0e6aecde972e11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAllAplicantDetails: {
      workflowId: '37a82fe4973d11eabdcff2fa9bec3d63',
      processId: '37c6c08a973d11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    pslLOVsDropdown: {
      workflowId: 'ba3c5529a7211eabdcff2fa9bec3d63',
      processId: 'ba6290a49a7211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveUpadtePslData: {
      workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
      processId: '2fe93e9e98ee11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getPslData: {
      workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
      processId: '23d5a6ea98f011eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveExposure: {
      workflowId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      processId: 'b007bcd8968511eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getExposure: {
      workflowId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      processId: '520bd7a6975511eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    deleteExposure: {
      workflowId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      processId: 'e9ceec0e975511eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    geoMasterService: {
      processId: '676c8318a56311eabed3f2fa9bec3d63',
      workflowId: '66d15a96a56311eabed3f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    salesApplicantDedupe: {
      processId: 'c39b5872a5b711eabf11f2fa9bec3d63',
      workflowId: 'b527cab2945211eabdcaf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    salesApplicantUcic: {
      processId: '02d4332495d711eabdcff2fa9bec3d63',
      workflowId: '02c225f895d711eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    deleteBankList: {
      processId: '6a957184a9ab11ea824ff2fa9bec3d63',
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveTvrDetails: {
      processId: '04e204a89a8611eabdcff2fa9bec3d63',
      workflowId: '04ae6c069a8611eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getTvrDetails: {
      processId: 'fe6319ac9b5011eabdd3f2fa9bec3d63',
      workflowId: '04ae6c069a8611eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    sourcingCode: {
      processId: 'f02ef8fca6e411eabf7ff2fa9bec3d63',
      workflowId: 'efd8c3c4a6e411eabf7ff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getTvrList: {
      processId: 'e0b687beaa2711ea825df2fa9bec3d63',
      workflowId: '04ae6c069a8611eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    creditDashboard: {
      processId: '70fd392aaa1011ea825bf2fa9bec3d63',
      workflowId: '70838c9caa1011ea825bf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    submitToCredit: {
      processId: 'a0289928b78111ea8af8f2fa9bec3d63',
      workflowId: 'a00ac092b78111ea8af8f2fa9bec3d63',
      projectId: environment.projectIds.submitToCredit
    },
    termsAcceptance: {
      processId: 'cde7ca74abc811ea832af2fa9bec3d63',
      workflowId: 'cda49f10abc811ea832af2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    fundingProgram: {
      processId: 'b6856476ab3811ea82f6f2fa9bec3d63',
      workflowId: 'b64abaa6ab3811ea82f6f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    dealerCode: {
      processId: '2faf3348ab4011ea82f7f2fa9bec3d63',
      workflowId: '2f8408d0ab4011ea82f7f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    requestKYC: {
      processId: 'ba45976eac9811ea83eaf2fa9bec3d63',
      workflowId: 'ba27322eac9811ea83eaf2fa9bec3d63',
      projectId: 'd627fff49e5011eabde0f2fa9bec3d63'
    },
    rejectLead: {
      processId: '94b7bcfeff1611eaa2fe00505695f93b',
      workflowId: '94987e52ff1611eab52100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getPdData: {
      processId: 'e0b40b20a23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    SavePdData: {
      processId: 'e0a4d60aa23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    saveOrUpdatePdData: {
      processId: 'e0a4d60aa23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    pdList: {
      processId: 'e1405c1ab61511ea8a0af2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    deleteMarFinReference: {
      processId: 'b22a16c8235711ebbb7a00505695f93b',
      workflowId: '606e8154200811ebbd8a00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitPdReport: {
      processId: 'e1479e8ab61511ea8a0af2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    approvePd: {
      processId: 'c98b53f4b6b511ea8a46f2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId
    },
    reinitiatePd: {
      processId: 'cc6c19f6b78b11ea8af8f2fa9bec3d63',
      workflowId: 'cc40c30ab78b11ea8af8f2fa9bec3d63',
      projectId: environment.projectIds.reinitiatePdApi
    },
    taskDashboard: {
      processId: '28b56774b48711ea88e7f2fa9bec3d63',
      workflowId: '2875dddeb48711ea88e7f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getFactoringValue: {
      processId: 'f2dadd44b22611ea8796f2fa9bec3d63',
      workflowId: 'f2bc4564b22611ea8796f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getCollateralDetailsForVehicleValuation: {
      processId: '2db56d129c2911eabddcf2fa9bec3d63',
      workflowId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    setViability: {
      processId: '9d20feb0a17811eabe2ef2fa9bec3d63',
      workflowId: '9d148ea0a17811eabe2ef2fa9bec3d63',
      projectId: '0d888054a7e811ea800bf2fa9bec3d63'
    },
    getViability: {
      processId: '9d3e6176a17811eabe2ef2fa9bec3d63',
      workflowId: '9d148ea0a17811eabe2ef2fa9bec3d63',
      projectId: '0d888054a7e811ea800bf2fa9bec3d63'
    },
    getViabilityList: {
      processId: '745eed2cb79c11ea8b00f2fa9bec3d63',
      workflowId: '0d888054a7e811ea800bf2fa9bec3d63',
      projectId: environment.projectIds.viabilityApi
    },
    getVendorCode: {
      processId: '5c532d10b21011ea874ef2fa9bec3d63',
      workflowId: '2d8a14fa9c2911eabddcf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    initiateVehicleValuation: {
      processId: 'f46ad0f8a36011eabe55f2fa9bec3d63',
      workflowId: 'f439df02a36011eabe55f2fa9bec3d63',
      projectId: environment.projectIds.externalApi
    },
    getVehicleValuation: {
      processId: 'e47087929ccb11eabdddf2fa9bec3d63',
      workflowId: '2d8a14fa9c2911eabddcf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveUpdateVehicleValuation: {
      processId: '29f089d09c2b11eabddcf2fa9bec3d63',
      workflowId: '2d8a14fa9c2911eabddcf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getCamDetails: {
      processId: 'd65f9efeb84611ea8b34f2fa9bec3d63',
      workflowId: 'd641350eb84611ea8b34f2fa9bec3d63',
      projectId: environment.projectIds.camProjectId
    },
    getDeviations: {
      processId: '24527ea6b14e11ea86caf2fa9bec3d63',
      workflowId: '22b36ea2b14e11ea86caf2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getDeviationsMaster: {
      processId: '772922e8b22e11ea87a8f2fa9bec3d63',
      workflowId: '76f72586b22e11ea87a8f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    autoDeviation: {
      processId: '2ddfa32cd8b311ea8ba800505695f93b',
      workflowId: '6a6dec02d7a711eabfa200505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getTriggerWaiverNorms: {
      processId: '2c38d6b0f20311ea8e0700505695f93b',
      workflowId: '2c1225cef20311eaa59400505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveorUpdateDeviation: {
      processId: '0e3ffa76b13f11ea86b8f2fa9bec3d63',
      workflowId: '0e10bb58b13f11ea86b8f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    deleteDeviation: {
      processId: 'a1220d70b45f11ea88a8f2fa9bec3d63',
      workflowId: 'a0f5f5b4b45f11ea88a8f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getReferDeviation: {
      processId: '238d9050ba0e11eab53500505695f93b',
      workflowId: '2360e01eba0e11ea9d6b00505695f93b',
      projectId: '403a8a12b79511ea8afff2fa9bec3d63'
    },
    approveDecline: {
      processId: 'a6e7db78ba2111ea964000505695f93b',
      workflowId: 'a6c0829eba2111ea988900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    approveDeviation: {
      processId: '624b5f50ba8811ea9bd500505695f93b',
      workflowId: '2360e01eba0e11ea9d6b00505695f93b',
      projectId: '403a8a12b79511ea8afff2fa9bec3d63'
    },
    sendBacktoCredit: {
      processId: '0d8c700abf5e11eab87700505695f93b',
      workflowId: '2360e01eba0e11ea9d6b00505695f93b',
      projectId: '403a8a12b79511ea8afff2fa9bec3d63'
    },
    reInitiateCreditScore: {
      processId: '7f21b928ba6d11eaaccf00505695f93b',
      workflowId: 'ff0aa956b9e611ea88c300505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCreditConditions: {
      processId: '738484b0b9c311ea8a3f00505695f93b',
      workflowId: '587a62d4b9c311ea8dd900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    deleteCreditConditions: {
      processId: '6531185cba2611eaab9500505695f93b',
      workflowId: '587a62d4b9c311ea8dd900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveAndUpdateCreditConditions: {
      processId: 'ca7ccc2ab9f811ea96fe00505695f93b',
      workflowId: '587a62d4b9c311ea8dd900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveOrUpdateDocument: {
      processId: '5f947022c67611eabcd500505695f93b',
      workflowId: '5f5f525cc67611eaaf9400505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitReferDeclineCreditConditions: {
      processId: '0e709facc67311ea954700505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    approveCreditConditions: {
      processId: '8f288e04d95e11ea819000505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    assignCDTaskFromSales: {
      processId: '90408c36cc9f11ea83c800505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    rejectCreditCondition: {
      processId: '94c162c0f38d11eabae500505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    getLeadRejectReason: {
      processId: '94b7bcfeff1611eaa2fe00505695f93b',
      workflowId: '94987e52ff1611eab52100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCountryList: {
      processId: '6c3f2eb0c1d611ea80d600505695f93b',
      workflowId: '6c1d6dd4c1d611eaa89700505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitViabilityTask: {
      processId: '740f2e4ec1d911ea930600505695f93b',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.viabilityApi
    },
    saveParentOdDetails: {
      processId: '6b6158b6c05e11eaa7f600505695f93b',
      workflowId: '6b42973cc05e11eaba4500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getParentOdDetails: {
      processId: '4685cc72c1b511ea9c2a00505695f93b',
      workflowId: '6b42973cc05e11eaba4500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getOdDetails: {
      processId: '3886d4dcc12311ea8cf300505695f93b',
      workflowId: '385b249ac12311eab5a500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getOdApplicantList: {
      processId: '959c5a74c5b611ea830200505695f93b',
      workflowId: '04ae6c069a8611eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    softDeleteBureauEnquiry: {
      processId: 'ef18b8f6c04b11eabd0f00505695f93b',
      workflowId: '47596532bf9911eaa6de00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    softDeleteOdDetails: {
      processId: '7111c1acc04e11eab9eb00505695f93b',
      workflowId: '033c3050bf8011eab85000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCamUsedCvDetails: {
      processId: 'b09ba4dcbf4a11ea8cf300505695f93b',
      workflowId: 'b06ab746bf4a11eab26100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCamUsedCarDetails: {
      processId: '5f9adf12c4cc11eab54f00505695f93b',
      workflowId: '5f726640c4cc11ea958b00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCamNewCvDetails: {
      processId: '95d6f6f8c5ab11eab03700505695f93b',
      workflowId: '95d6f6f8c5ab11eab03700505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveCamRemarks: {
      processId: 'b099b6aac71e11ea8c4800505695f93b',
      workflowId: 'b0689796c71e11ea8df900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getSanctionDetails: {
      processId: '04bd034ac6c011ea886e00505695f93b',
      workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    submitToSanctionLeads: {
      processId: '0e709facc67311ea954700505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    getFiList: {
      processId: '4339b99accc611ea881800505695f93b',
      workflowId: 'ebb849eecb5c11ea91c600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getFiReportDetails: {
      processId: 'f10ff346cbda11ea83b800505695f93b',
      workflowId: 'ebb849eecb5c11ea91c600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveOrUpdateFiReportDetails: {
      processId: 'ebf549c0cb5c11eaa53e00505695f93b',
      workflowId: 'ebb849eecb5c11ea91c600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitFiReportDetais: {
      processId: '10d63ed4d6e311ea996900505695f93b',
      workflowId: '10b16f78d6e311eaad8d00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    reinitiateFiDetails: {
      processId: '5189333ed98911eabbdf00505695f93b',
      workflowId: '10b16f78d6e311eaad8d00505695f93b',
      projectId: environment.projectIds.reinititateFiApi
    },
    nlUpdatingRemarks: {
      processId: 'c68a7f8acd5411eab88900505695f93b',
      workflowId: 'c6616082cd5411eab5b200505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    negativeListWrapper: {
      processId: 'e6e974d4ccb411eab67600505695f93b',
      workflowId: '051db99495c711eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getAddressDetails: {
      processId: 'b95e7cfad0b311ea9f0400505695f93b',
      workflowId: 'b93fc6e8d0b311eab67600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    wrapperPanValidation: {
      processId: '9bdd1c8eca8911eabb8100505695f93b',
      workflowId: '9bb46abeca8911ea8b0000505695f93b',
      projectId: environment.projectIds.wrapperPanValidation
    },
    getDocumentCategory: {
      processId: 'cf9334f4cfdf11ea8a4900505695f93b',
      workflowId: 'cf499204cfdf11eaad5000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    dashboardFilter: {
      processId: '3d804624d26911eaa78100505695f93b',
      workflowId: '3d804624d26911eaa78100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    uploadPhotoOrSignature: {
      processId: '9cdb8a7ed30011ea8bba00505695f93b',
      workflowId: '9cb93d8ed30011eaaed400505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    wrapperBiometriceKYC: {
      processId: 'b918564cd3b211ea93de00505695f93b',
      workflowId: ' b90074dcd3b211eabfae00505695f93b',
      projectId: environment.projectIds.wrapperBiometriceKYC
    },
    getApplicantDataImage: {
      processId: 'af1e3b4ed0b411ea9da200505695f93b',
      workflowId: 'aeed7234d0b411ea99c400505695f93b',
      projectId: environment.projectIds.externalApi
    },
    getTermSheet: {
      processId: 'aa0bd7accd8e11eaa47f00505695f93b',
      workflowId: 'a9e25f4ecd8e11eab88900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    assignTaskToTSAndCPC: {
      processId: '87a68dacd95911ea9e8400505695f93b',
      workflowId: '877db1ded95911eaaa8300505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    saveCheckList: {
      processId: '2f5e323ad59911ea9d5d00505695f93b',
      workflowId: '2f32c4bad59911eabaa900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    assignCPCRules: {
      processId: '8a5609aad32e11eaacee00505695f93b',
      workflowId: '8a1d1abed32e11eaa96700505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    getCheckList: {
      processId: 'd895c8a4d5a811ea9d5d00505695f93b',
      workflowId: 'd86551d8d5a811ea933000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    customerAcceptance: {
      projectId: environment.projectIds.submitToCredit,
      processId: '90408c36cc9f11ea83c800505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b'
    },
    // supervisorRelated starts
    supervisor: {
      processId: 'c16cfe62c5be11eaa04300505695f93b',
      workflowId: 'c14dda82c5be11eaa09f00505695f93b',
      projectId: environment.projectIds.supervisorProId
    },
    // supervisorRelated ends
    getmotorInsuranceLOV: {
      workflowId: '7ab11904cca811eaaa1200505695f93b',
      processId: 'cdeef696cda111ea89bf00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getInsuranceLOV: {
      workflowId: '7ab11904cca811eaaa1200505695f93b',
      processId: '7aca596ecca811eaa4ed00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    getAssetDetails: {
      workflowId: 'f98fcb80cb0e11ea961200505695f93b',
      processId: 'f9ae9f6acb0e11ea814c00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    // submitNegotiation: {
    //   workflowId: 'f98fcb80cb0e11ea961200505695f93b',
    //   processId: '5f84550ecfcf11ea99aa00505695f93b',
    //   projectId: environment.projectIds.camProjectId
    // },
    // getNegotiationData:{
    //   workflowId: 'f98fcb80cb0e11ea961200505695f93b',
    //   processId: '19120c14d4c611eabe8800505695f93b',
    //   projectId: environment.projectIds.camProjectId
    // },
    submitNegotiation: {
      workflowId: '2ebdbf38dd7511eaad1a00505695f93b',
      processId: '5ebaf41add7c11ea908100505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    getNegotiationData: {
      workflowId: '2ebdbf38dd7511eaad1a00505695f93b',
      processId: '2ed6d234dd7511eaba4a00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    // disbursementRelated starts
    disbursementLOV: {
      processId: '08a96b3ed7b811eaac0400505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    fetchCoAppDetails: {
      processId: 'ece8a13cd7f111eaa86100505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    fetchDealerDetails: {
      processId: '7a69a5b8d7cc11eab3fc00505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    fetchApplicantDetails: {
      processId: 'b9964ac2d7d911ea827c00505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    saveUpdateDisburseDetails: {
      processId: '70075eb0d7d811eaa97a00505695f93b',
      workflowId: '6fe659fed7d811eaa44500505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    fetchDisburseDetails: {
      processId: 'a5b63fc6d97811eab99f00505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    fetchLoanDetails: {
      processId: 'd250da02da3e11ea9e8400505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    getPddDetails: {
      processId: 'a8c2c304dd6c11eaafb500505695f93b',
      workflowId: 'a897ad40dd6c11eab53900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    updatePddDetails: {
      processId: '67441434dd9711ea944100505695f93b',
      workflowId: '671dd0b2dd9711ea909f00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitPDD: {
      processId: '01ace50a122c11ebbbdd00505695f93b',
      workflowId: '017caffc122c11ebb4b900505695f93b',
      projectId: environment.projectIds.taskProjectId
    },
    fetchPreimumAmount: {
      processId: '3c99e428d71811eabcf800505695f93b',
      workflowId: '3c71c4d4d71811eaabba00505695f93b',
      projectId: environment.projectIds.externalApi
    },
    getChequeTracking: {
      processId: '85449f66e0ae11eabfc800505695f93b',
      workflowId: '852bb118e0ae11ea86c900505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveUpdateChequeTracking: {
      processId: 'ac0026eee0b711eab03500505695f93b',
      workflowId: 'abe6f5a2e0b711eaa73200505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    savePdcDetails: {
      workflowId: 'cf14db1cdd4111eaba8c00505695f93b',
      processId: '2ccd2806dd4511ea9d5000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getPdcDetails: {
      processId: 'cf39d584dd4111eab90000505695f93b',
      workflowId: 'cf14db1cdd4111eaba8c00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    deletePdcDetails: {
      processId: '870e7208dd4411eaa66700505695f93b',
      workflowId: 'cf14db1cdd4111eaba8c00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    loanCreationWrapper: {
      processId: 'bafeada0e13911eabda900505695f93b',
      workflowId: 'd53d6b40d92b11eaaf9700505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getProcessLogs: {
      processId: '12d07096e09411eaaeaa00505695f93b',
      workflowId: '12aa87f0e09411ea900500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    retrieveAadharData: {
      processId: '81383e76c8c311ea851600505695f93b',
      workflowId: '8110ed6cc8c311ea873200505695f93b',
      projectId: environment.projectIds.retrieveAadharData
    },
    validateSRNumber: {
      processId: '84fdc0f4edac11eaa7e400505695f93b',
      workflowId: '84d0b640edac11ea8d3d00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitToCC: {
      processId: '47d4c4a8f19d11eaa89a00505695f93b',
      workflowId: '4794bf2af19d11ea880700505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    welcomeLetter: {
      processId: 'd358b542f28911ea82f100505695f93b',
      workflowId: 'd33a101af28911ea9cda00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveTaskLogs: {
      processId: '34408268f75811eab4f500505695f93b',
      workflowId: '340d11b2f75811eab78c00505695f93b',
      projectId: '403a8a12b79511ea8afff2fa9bec3d63'
    },
    disbBankName: {
      processId: 'f9fcc4a6f3ef11eaaeda00505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    disbBankDetails: {
      processId: '049cafbef3f211ea894a00505695f93b',
      workflowId: '08905702d7b811eab3fc00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    deliveryLetter: {
      processId: '8b8d05e0f2bd11eab9aa00505695f93b',
      workflowId: '8b6e5f64f2bd11ea8ac000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    eKYCDetails: {
      //  workflowId:'7fde429c82ea11eabdc2f2fa9bec3d63',
      processId: '0e9b3564095d11ebbdfe00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    loanBookingDedupe: {
      workflowId: '666fe8320e9111ebb3ca00505695f93b',
      processId: '66a05c880e9111ebb0b300505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    loanDedupeUpdate: {
      workflowId: '666fe8320e9111ebb3ca00505695f93b',
      processId: '051213a00eb211eb825000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getFoirAsPerPolicy: {
      processId: 'ccdee5ee09f211ebb00500505695f93b',
      workflowId: 'b06ab746bf4a11eab26100505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    applicantReference: {
      processId: '632710f2129b11eb847f00505695f93b',
      workflowId: '79f7d05c120311ebb36200505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    getApplicantReference: {
      processId: '968db6ae121311eb9d2a00505695f93b',
      workflowId: '79f7d05c120311ebb36200505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    reInitiateViability: {
      processId: '050da46e0ae811eb98c300505695f93b',
      workflowId: '04ebd41a0ae811eb8b7100505695f93b',
      projectId: environment.projectIds.reinitiatePdApi
    },
    sendBackToSales: {
      processId: '7a0640be1a7911eb9ca100505695f93b',
      workflowId: '79d8aae61a7911eb9fe400505695f93b',
      projectId: environment.projectIds.submitToCredit,
    },
    getRcuDetails: {
      processId: '55754d6e1e7311eb857100505695f93b',
      workflowId: 'cb68bc321e5e11ebb8f300505695f93b',
      projectId: environment.projectIds.camProjectId,
    },
    assignRcuTask: {
      processId: 'a55088661f5011eb842c00505695f93b',
      workflowId: '403a8a12b79511ea8afff2fa9bec3d63',
      projectId: environment.projectIds.taskProjectId,
    },
    saveUpdateRcuDetails: {
      processId: 'cba377141e5e11eb8fb700505695f93b',
      workflowId: 'cb68bc321e5e11ebb8f300505695f93b',
      projectId: environment.projectIds.camProjectId,
    },
    getQueries: {
      processId: 'bc794b1c18df11eb917900505695f93b',
      workflowId: 'a41a11d218df11eb8ba600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveorUpdateQueries: {
      processId: 'f95f5ade18e511eb8f6e00505695f93b',
      workflowId: 'a41a11d218df11eb8ba600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getLeads: {
      processId: '840d014c193411eb957900505695f93b',
      workflowId: '83d58122193411eb853500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getUsers: {
      processId: '292d36be18fa11eb9e0800505695f93b',
      workflowId: '28ff0e6a18fa11eb8f6e00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    updateStatus: {
      processId: 'e5530f5e32df11eb996500505695f93b',
      workflowId: 'a41a11d218df11eb8ba600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getCount: {
      processId: 'daefda501b3411eba4e100505695f93b',
      workflowId: '83d58122193411eb853500505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitTvrDetails: {
      processId: '4628de009c2f11eabddcf2fa9bec3d63',
      workflowId: '04ae6c069a8611eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    leadHistory: {
      processId: 'f0f395d824eb11eb91b100505695f93b',
      workflowId: 'b50e63f4235b11eb937600505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    supervisorReporters: {
      processId: 'b1e4ab40234a11eba48800505695f93b',
      workflowId: '7fde429c82ea11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    supervisorGetUsers: {
      processId: '6b03a16628e211ebbefa00505695f93b',
      workflowId: '7fde429c82ea11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    supervisorReAssign: {
      // processId: '416121c228eb11eb9fb000505695f93b',
      processId: 'f9c62e182d7f11eb8aae00505695f93b',
      workflowId: '414373fc28eb11eba11700505695f93b',
      projectId: environment.projectIds.taskProjectId
    },
    stopRcuTask: {
      processId: '9383864228a111ebbf3f00505695f93b',
      workflowId: 'a513d5ce1f5011eba48800505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    saveInsuranceService: {
      processId: 'fd023ccc281411eb857200505695f93b',
      workflowId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
      projectId: environment.projectIds.camProjectId
    },
    getAssetRemarks: {
      processId: 'b9de5b3828fa11eb97ad00505695f93b',
      workflowId: 'b995a56e28fa11eb8ead00505695f93b',
      projectId: environment.projectIds.remarksProjectId
    },
    saveAssetRemarks: {
      processId: '124ed4e228b411eb979100505695f93b',
      workflowId: '11ffd41428b411eb85f300505695f93b',
      projectId: environment.projectIds.remarksProjectId
    },
    assignCPCMaker: {
      processId: '8a5609aad32e11eaacee00505695f93b',
      workflowId: '8a1d1abed32e11eaa96700505695f93b',
      projectId: environment.projectIds.assignCPCMaker
    },
    getInsuranceDetails: {
      processId: 'e7bb8364281411eb9f0f00505695f93b',
      workflowId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
      projectId: environment.projectIds.camProjectId
    },
    childLoanSearch: {
      processId: '920538fa2a2811eba1e500505695f93b',
      workflowId: '91ce6f782a2811eb87b300505695f93b',
      projectId: environment.projectIds.externalApi
    },
    getTDDetails: {
      processId: '93351a66f71911ea989d00505695f93b',
      workflowId: '2a7931d8f68d11eab3fb00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    getTDDetailsByTask: {
      processId: 'b5585406032f11ebbce000505695f93b',
      workflowId: 'b5390c54032f11eb99e500505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    viewTDDetails: {
      processId: '97b6dadef72811ea857c00505695f93b',
      workflowId: '2a7931d8f68d11eab3fb00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    submitTDToCKR: {
      processId: '47d4c4a8f19d11eaa89a00505695f93b',
      workflowId: '2a7931d8f68d11eab3fb00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    requestTrancheDisburse: {
      processId: '2a985d4cf68d11eab5a800505695f93b',
      workflowId: '2a7931d8f68d11eab3fb00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    requestTaskTrancheDisburse: {
      processId: '63d4c01a022111eb91e600505695f93b',
      workflowId: '63b3926e022111eb9f3b00505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    submitTDToMaker: {
      processId: '0a97611efe3a11eab06200505695f93b',
      workflowId: '0a78b9d0fe3a11eaaac100505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    reverseTDToMaker: {
      processId: '9c6fae38030e11ebad1a00505695f93b',
      workflowId: '9c567ef4030e11ebabf700505695f93b',
      projectId: environment.projectIds.camProjectId
    },
    tdApprove: {
      processId: 'f007931203cc11eba91300505695f93b',
      workflowId: '767be23a08a611eb827600505695f93b',
      projectId: environment.projectIds.trancheProId
    },
    externalSourcingChannel: {
      processId: 'a7f68c98316e11eb9adf00505695f93b',
      workflowId: 'efd8c3c4a6e411eabf7ff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    createExternalLead: {
      processId: 'f0269e8e845a11eabdc2f2fa9bec3d63',
      workflowId: 'f000e040845a11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    externalApprove: {
      processId: '18fe3a1a317b11eb984800505695f93b',
      workflowId: '18c61b58317b11eb9b3d00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    externalUser: {
      processId: '05eb8f2a316e11eb934a00505695f93b',
      workflowId: '05bf0c20316e11eb863800505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    reAppeal: {
      processId: '0e709facc67311ea954700505695f93b',
      workflowId: '3ea13662c66611eaa13a00505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    externalUserDashboard: {
      processId: 'f00675c033da11eb990700505695f93b',
      workflowId: 'efdd189233da11eb9e3600505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    saveDeclientRemards: {
      processId: 'bc5cb0782fec11eba83800505695f93b',
      workflowId: 'bbf4e6f02fec11eb934a00505695f93b',
      projectId: environment.projectIds.remarksProjectId
    },
    getDeclientRemards: {
      processId: 'dbf7187e2fec11eb9d9b00505695f93b',
      workflowId: 'bbf4e6f02fec11eb934a00505695f93b',
      projectId: environment.projectIds.remarksProjectId
    },
    insuranceVehicleMaster: {
      processId: '62afd09c32ca11eb9d0800505695f93b',
      workflowId: '627e454a32ca11eb9f4000505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    motorInsuranceProvider: {
      processId: '36b6bc2c32fb11ebbb2400505695f93b',
      workflowId: '3691c28c32fb11eb957300505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    insuranceRTOMaster: {
      processId: 'c71ef06c32cf11ebba8e00505695f93b',
      workflowId: 'c6ef01c232cf11eb8a3c00505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    submitValuationTask: {
      processId: '02e6fa7e35ee11eb80a600505695f93b',
      workflowId: '02b88fb835ee11eb9cc400505695f93b',
      projectId: environment.projectIds.submitToCredit
    },
    session: {
      processId: '980912ec434d11eb8d0600505695f93b',
      workflowId: '97d8ee3c434d11eb87cc00505695f93b',
      projectId: environment.projectIds.salesProjectId
    }
  };
}
