import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
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
        }
    }
}