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
      workflowId: '385f090a957e11eabdcff2fa9bec3d63',
      processId: '3bed6af898f311eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
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
      projectId: 'db2732f4ab4811ea82f8f2fa9bec3d63',
    },
    sendOtp: {
      processId: '3dec693eaad811ea82aef2fa9bec3d63',
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      projectId: 'db2732f4ab4811ea82f8f2fa9bec3d63',
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
    saveUpdateFleetRtr: {
      processId: 'be7ff35699c911eabdcff2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
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
      projectId: 'd627fff49e5011eabde0f2fa9bec3d63',
    },
    rejectLead: {
      processId: '41f8884eb08e11ea8668f2fa9bec3d63',
      workflowId: '41d97b66b08e11ea8668f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    getPdData: {
      processId: 'e0b40b20a23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,
    },
    SavePdData: {
      processId: 'e0a4d60aa23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,
    },
    saveOrUpdatePdData: {
      processId: 'e0a4d60aa23d11eabe47f2fa9bec3d63',
      workflowId: 'e063568aa23d11eabe47f2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,
    },
    pdList: {
      processId: 'e1405c1ab61511ea8a0af2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,
    },
    submitPdReport: {
      processId: 'e1479e8ab61511ea8a0af2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,

    },
    approvePd: {
      processId: 'c98b53f4b6b511ea8a46f2fa9bec3d63',
      workflowId: 'e1174c3ab61511ea8a0af2fa9bec3d63',
      projectId: environment.projectIds.creditProjectId,
    },

    reinitiatePd: {
      processId: 'cc6c19f6b78b11ea8af8f2fa9bec3d63',
      workflowId: 'cc40c30ab78b11ea8af8f2fa9bec3d63',
      projectId: environment.projectIds.reinitiatePdApi,
    },

    taskDashboard: {
      processId: '28b56774b48711ea88e7f2fa9bec3d63',
      workflowId: '2875dddeb48711ea88e7f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },

    getFactoringValue: {
      processId: 'f2dadd44b22611ea8796f2fa9bec3d63',
      workflowId: 'f2bc4564b22611ea8796f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getCollateralDetailsForVehicleValuation: {
      processId: '2db56d129c2911eabddcf2fa9bec3d63',
      workflowId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    setViability: {
      // processId: '0d888054a7e811ea800bf2fa9bec3d63',
      processId: '9d20feb0a17811eabe2ef2fa9bec3d63',
      workflowId: '9d148ea0a17811eabe2ef2fa9bec3d63',
      // projectId: environment.projectIds.salesProjectId,
      projectId: '0d888054a7e811ea800bf2fa9bec3d63'
    },
    getViability: {
      processId: '9d3e6176a17811eabe2ef2fa9bec3d63',
      workflowId: '9d148ea0a17811eabe2ef2fa9bec3d63',
      // projectId: environment.projectIds.salesProjectId,
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
      projectId: environment.projectIds.salesProjectId,
    },
    getCamDetails: {
      processId: 'd65f9efeb84611ea8b34f2fa9bec3d63',
      workflowId: 'd641350eb84611ea8b34f2fa9bec3d63',
      projectId: environment.projectIds.camProjectId,
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
    reInitiateCreditScore: {
      processId: '7f21b928ba6d11eaaccf00505695f93b',
      workflowId: 'ff0aa956b9e611ea88c300505695f93b',
      projectId: environment.projectIds.salesProjectId
    },
    getReferDeviation: {
      processId: "238d9050ba0e11eab53500505695f93b",
      workflowId: '2360e01eba0e11ea9d6b00505695f93b',
      projectId: "403a8a12b79511ea8afff2fa9bec3d63"
    },
    approveDecline: {
      processId: "a6e7db78ba2111ea964000505695f93b",
      workflowId: 'a6c0829eba2111ea988900505695f93b',
      projectId: environment.projectIds.salesProjectId
    }
  }
}
