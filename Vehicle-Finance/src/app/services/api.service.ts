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
      projectId: environment.projectIds.salesProjectId,
    },
    createLead: {
      workflowId: 'f000e040845a11eabdc2f2fa9bec3d63',
      processId: 'f0269e8e845a11eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getLOVs: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: '674941a2904e11eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getAssetProductCategory: {
      workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
      processId: 'b0c8aa96939d11eabdc6f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getSourcingChannel: {
      workflowId: '99e9c24294e711eabdcdf2fa9bec3d63',
      processId: '4e4033dc96a211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getLeadById: {
      workflowId: '8b7c681c95c411eabdcff2fa9bec3d63',
      processId: '8b9b2a2295c411eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getMyLeads: {
      workflowId: 'a8cc3836959a11eabdcff2fa9bec3d63',
      processId: 'a8f86a64959a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getAnVehicleCollateralDetails: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: '5ded0268971711eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    saveOrUpdateVehicleCollateralDetails: {
      workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
      processId: '387d901e957e11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getAllVehicleCollateralDetails: {
      workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
      processId: 'cd9ac3ba979a11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getVehicleMasterFromRegion: {
      workflowId: '385f090a957e11eabdcff2fa9bec3d63',
      processId: '3bed6af898f311eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getDeleteVehicleDetails: {
      workflowId: '385f090a957e11eabdcff2fa9bec3d63',
      processId: '69029740a71a11eabfb4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId
    },
    saveUpdateFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: '0620e32c998511eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: 'd6f39fda99b211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    deleteFleetDetails: {
      workflowId: '05f4baea998511eabdcff2fa9bec3d63',
      processId: '8a5ad9369b3811eabdd3f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    saveUpdateFleetRtr: {
      processId: 'be7ff35699c911eabdcff2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getFleetRtr: {
      processId: '7e26a5b29aae11eabdd1f2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    deleteFleetRtr: {
      processId: '4f83a45c9b3111eabdd3f2fa9bec3d63',
      workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },

    getBankTransaction: {
      workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
      processId: '18e0f1d28f8f11eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getBankAccountList: {
      workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
      processId: '6ee060e68f8911eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    bankTransaction: {
      workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
      processId: 'bbc390e48f5811eabdc4f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
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
      projectId: environment.projectIds.salesProjectId,
    },
    saveAndUpdateLead: {
      processId: '7e66e3fe9cc811eabdddf2fa9bec3d63',
      workflowId: 'b4e6e94c6db611eabdc2f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getAllIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: 'eabfa04c96ae11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    setAllIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: '658c979e967811eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    softDeleteIncomeDetails: {
      workflowId: '6569c7e6967811eabdcff2fa9bec3d63',
      processId: '0e6aecde972e11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getAllAplicantDetails: {
      workflowId: '37a82fe4973d11eabdcff2fa9bec3d63',
      processId: '37c6c08a973d11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    pslLOVsDropdown: {
      workflowId: 'ba3c5529a7211eabdcff2fa9bec3d63',
      processId: 'ba6290a49a7211eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    saveUpadtePslData: {
      workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
      processId: '2fe93e9e98ee11eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    getPslData: {
      workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
      processId: '23d5a6ea98f011eabdcff2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
    geoMasterService: {
      processId: '676c8318a56311eabed3f2fa9bec3d63',
      workflowId: '66d15a96a56311eabed3f2fa9bec3d63',
      projectId: environment.projectIds.salesProjectId,
    },
  };

  // api = {
  //     getUserDetails: {
  //         workflowId: '7fde429c82ea11eabdc2f2fa9bec3d63',
  //         processId: '8000bb2e82ea11eabdc2f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //     createLead: {
  //         workflowId: 'f000e040845a11eabdc2f2fa9bec3d63',
  //         processId: 'f0269e8e845a11eabdc2f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //     getLOVs: {
  //         workflowId: 'bd15880c904911eabdc4f2fa9bec3d63',
  //         processId: '674941a2904e11eabdc4f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //     getAssetProductCategory: {
  //         workflowId: 'b0a9ef02939d11eabdc6f2fa9bec3d63',
  //         processId: 'b0c8aa96939d11eabdc6f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //     getSourcingChannel: {
  //         workflowId: '99e9c24294e711eabdcdf2fa9bec3d63',
  //         processId: '4e4033dc96a211eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //     getLeadById: {
  //         workflowId: '8b7c681c95c411eabdcff2fa9bec3d63',
  //         processId: '8b9b2a2295c411eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //       getMyLeads: {
  //         workflowId: 'a8cc3836959a11eabdcff2fa9bec3d63',
  //         processId: 'a8f86a64959a11eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //       saveUpdateFleetRtr: {
  //         processId : 'be7ff35699c911eabdcff2fa9bec3d63',
  //         workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //     },
  //       getFleetRtr : {
  //         processId : '7e26a5b29aae11eabdd1f2fa9bec3d63',
  //         workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       deleteFleetRtr : {
  //         processId : '4f83a45c9b3111eabdd3f2fa9bec3d63',
  //         workflowId: 'be4f9c6099c911eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       getBankTransaction: {
  //         workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
  //         processId: '18e0f1d28f8f11eabdc4f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       getBankAccountList: {
  //         workflowId: '6ec1aaf28f8911eabdc4f2fa9bec3d63',
  //         processId: '6ee060e68f8911eabdc4f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       bankTransaction: {
  //         workflowId: 'bba4f1028f5811eabdc4f2fa9bec3d63',
  //         processId: 'bbc390e48f5811eabdc4f2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       pslLOVsDropdown: {
  //         workflowId: 'ba3c5529a7211eabdcff2fa9bec3d63',
  //         processId: 'ba6290a49a7211eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       saveUpadtePslData: {
  //         workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
  //         processId: '2fe93e9e98ee11eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       },
  //       getPslData: {
  //         workflowId: '2f9ef7f898ee11eabdcff2fa9bec3d63',
  //         processId: '23d5a6ea98f011eabdcff2fa9bec3d63',
  //         projectId: environment.projectIds.salesProjectId
  //       }
  // };
}
