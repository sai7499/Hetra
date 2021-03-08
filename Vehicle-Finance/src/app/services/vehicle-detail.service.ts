import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import RequestEntity from '../model/request.entity';
import { HttpService } from './http.service';
import { ApiService } from '@services/api.service';
import { IndivVehicleInfoDetails } from '@model/lead.model';

import mUrl from '../../assets/vehicle-details-data/vehicle-details-label.json';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailService {
  private currentPage$ = new BehaviorSubject(0);

  public vehicleVariable: any;

  constructor(private httpService: HttpService, private apiService: ApiService) { }

  getVehicleDetailLabels(): Observable<IndivVehicleInfoDetails[]> {
    return this.createObservableObj(mUrl).pipe(
      catchError(error => this.errorHandler)
    );
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'SERVER Error');
  }

  setCurrentPage(pageNumber: number) {
    this.currentPage$.next(pageNumber);
  }

  getCurrentPage() {
    return this.currentPage$;
  }

  setVehicle(varvehicle) {
    this.vehicleVariable = varvehicle;
    return this.vehicleVariable;
  }

  getVehicle() {
    return this.vehicleVariable;
  }

  // methods for getting vehicle collaterals data from api

  // 1.method for getting vehicle details

  getAnVehicleDetails(data) {

    const processId = this.apiService.api.getAnVehicleCollateralDetails.processId;
    const workflowId = this.apiService.api.getAnVehicleCollateralDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 2.method for save or update vehicle details

  saveOrUpdateVehcicleDetails(data) {

    const processId = this.apiService.api.saveOrUpdateVehicleCollateralDetails.processId;
    const workflowId = this.apiService.api.saveOrUpdateVehicleCollateralDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 3.method to get all vehicle collateral details

  getAllVehicleCollateralDetails(leadId) {

    const processId = this.apiService.api.getAllVehicleCollateralDetails.processId;
    const workflowId = this.apiService.api.getAllVehicleCollateralDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "leadId": leadId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 4. method for getting vehicleMasterDetails from region

  getVehicleMasterFromRegion(data) {

    const processId = this.apiService.api.getVehicleMasterFromRegion.processId;
    const workflowId = this.apiService.api.getVehicleMasterFromRegion.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 5. method for getting vehicleMasterDetails from asset make

  getVehicleMasterFromAssetMake(data) {

    const processId = this.apiService.api.getVehicleMasterFromAssetMake.processId;
    const workflowId = this.apiService.api.getVehicleMasterFromAssetMake.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 6. method for getting vehicleMasterDetails from vehicle type

  getVehicleMasterFromVehicleType(data) {

    const processId = this.apiService.api.getVehicleMasterFromVehicleType.processId;
    const workflowId = this.apiService.api.getVehicleMasterFromVehicleType.workflowId;
    const projectId = this.apiService.api.getVehicleMasterFromVehicleType.projectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 7. method for getting vehicleMasterDetails from delete

  getDeleteVehicleDetails(id, userId) {

    const processId = this.apiService.api.getDeleteVehicleDetails.processId;
    const workflowId = this.apiService.api.getDeleteVehicleDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "id": id,
        "userId": userId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  // 8. method for getting vehicleMasterDetails from vehicle grid

  getVehicleGridValue(data) {
    const processId = this.apiService.api.getVehicleGridValue.processId;
    const workflowId = this.apiService.api.getVehicleGridValue.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 9. method for getting scheme data

  getScheme(data) {
    const processId = this.apiService.api.getScheme.processId;
    const workflowId = this.apiService.api.getScheme.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 10. Insurance Lov

  getInsuranceLov(data) {
    const processId = this.apiService.api.InsuranceLov.processId;
    const workflowId = this.apiService.api.InsuranceLov.workflowId;
    const projectId = this.apiService.api.InsuranceLov.projectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  createObservableObj(labelsurl: IndivVehicleInfoDetails[]) {
    const obs = new Observable<IndivVehicleInfoDetails[]>(observer => {
      observer.next(labelsurl);
      observer.complete();
    });
    return obs;
  }

}
