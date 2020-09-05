import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CreateLeadDataService } from '../modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '../modules/sales/services/lead.store.service';
@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  applicantList: {
    processId?: string;
    workflowId?: string;
  };
  applicantDetail: {
    processId?: string;
    workflowId?: string;
  };
  saveUpdateApplicant: {
    processId?: string;
    workflowId?: string;
  };
  private softDeleteDetail: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private geoMasterService: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private applicantDedupe: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private applicantUcic: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private countryList: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private addressDetails : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  private panValidation : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  private biometriceKYC : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  private retrieveAadharData : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  private validateSRNumber : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService
  ) {
    this.applicantList = this.apiService.api.getApplicantList;
    this.applicantDetail = this.apiService.api.getApplicantDetail;
    this.saveUpdateApplicant = this.apiService.api.saveUpdateApplicant;
    this.softDeleteDetail = this.apiService.api.softDeleteApplicant;
    this.geoMasterService = this.apiService.api.geoMasterService;
    this.applicantDedupe = this.apiService.api.salesApplicantDedupe;
    this.applicantUcic = this.apiService.api.salesApplicantUcic;
    this.countryList = this.apiService.api.getCountryList;
    this.addressDetails = this.apiService.api.getAddressDetails; 
    this.panValidation = this.apiService.api.wrapperPanValidation;
    this.biometriceKYC= this.apiService.api.wrapperBiometriceKYC;
    this.retrieveAadharData= this.apiService.api.retrieveAadharData;
    this.validateSRNumber = this.apiService.api.validateSRNumber
  }

  getApplicantList(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.applicantList.processId;
    const workflowId = this.applicantList.workflowId;
    const userId = localStorage.getItem('userId');
    const leadDetails: any = this.createLeadDataService.getLeadSectionData();
    // const leadId = leadDetails.leadId;
    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data,
        userId,
        // leadId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getApplicantDetail(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.applicantDetail.processId;
    const workflowId = this.applicantDetail.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  saveApplicant(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.saveUpdateApplicant.processId;
    const workflowId = this.saveUpdateApplicant.workflowId;

    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId,
        ...data,
      },
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  softDeleteApplicant(data) {
    const projectId = this.softDeleteDetail.projectId;
    const processId = this.softDeleteDetail.processId;
    const workflowId = this.softDeleteDetail.workflowId;

    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId,
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getGeoMasterValue(data) {
    const projectId = this.geoMasterService.projectId;
    const processId = this.geoMasterService.processId;
    const workflowId = this.geoMasterService.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  checkSalesApplicantDedupe(data) {
    const projectId = this.applicantDedupe.projectId;
    const processId = this.applicantDedupe.processId;
    const workflowId = this.applicantDedupe.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  checkSalesApplicantUcic(data) {
    const projectId = this.applicantUcic.projectId;
    const processId = this.applicantUcic.processId;
    const workflowId = this.applicantUcic.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getCountryList() {
    const projectId = this.countryList.projectId;
    const processId = this.countryList.processId;
    const workflowId = this.countryList.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {},
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  applicantNLUpdatingRemarks(data) {
    const remarks = this.apiService.api.nlUpdatingRemarks;
    const projectId = remarks.projectId;
    const processId = remarks.processId;
    const workflowId = remarks.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  applicantNegativeListWrapper(data) {
    const negativeListWrapper = this.apiService.api.negativeListWrapper;
    const projectId = negativeListWrapper.projectId;
    const processId = negativeListWrapper.processId;
    const workflowId = negativeListWrapper.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getAddressDetails(data){
    const projectId = this.addressDetails.projectId;
    const processId = this.addressDetails.processId;
    const workflowId = this.addressDetails.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  wrapperPanValidaion(data){
    const projectId = this.panValidation.projectId;
    const processId = this.panValidation.processId;
    const workflowId = this.panValidation.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }
  
  getDocumentCategory(data) {
    const negativeListWrapper = this.apiService.api.getDocumentCategory;
    const projectId = negativeListWrapper.projectId;
    const processId = negativeListWrapper.processId;
    const workflowId = negativeListWrapper.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  uploadPhotoOrSignature(data) {
    const uploadPhotoOrSignature = this.apiService.api.uploadPhotoOrSignature;
    const projectId = uploadPhotoOrSignature.projectId;
    const processId = uploadPhotoOrSignature.processId;
    const workflowId = uploadPhotoOrSignature.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  wrapperBiometriceKYC(data, applicantId){
    const projectId = this.biometriceKYC.projectId;
    const processId = this.biometriceKYC.processId;
    const workflowId = this.biometriceKYC.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        applicantId: applicantId,
        ...data,
        userId
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  retreiveAdhar(data){
    const projectId = this.retrieveAadharData.projectId;
    const processId = this.retrieveAadharData.processId;
    const workflowId = this.retrieveAadharData.workflowId;
    
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        referenceNo: data
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  validateSRNumberModification(data){
    const projectId = this.validateSRNumber.projectId;
    const processId = this.validateSRNumber.processId;
    const workflowId = this.validateSRNumber.workflowId;

    const body={
      processId,
      projectId,
      ProcessVariables: {
       ... data
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
