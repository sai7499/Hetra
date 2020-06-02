import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleDetailModel } from '../modules/lead-section/model/vehicle-detail-model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import RequestEntity from '../model/request.entity';
import { HttpService } from './http.service';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailService {

  private currentPage$ = new BehaviorSubject(0);

  private url = '../assets/vehicle-details-data/vehicle-details-label.json';

  public vehicleVariable: any;

  constructor(private http: HttpClient,
    private httpService: HttpService, private apiService: ApiService) { }

  getVehicleDetailLabels(): Observable<VehicleDetailModel[]> {
    return this.http.get<VehicleDetailModel[]>(this.url)
      .pipe(
        catchError(error => this.errorHandler)
      );
  }
  errorHandler(error: HttpErrorResponse) {
    // tslint:disable-next-line: deprecation
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

  getAnVehicleDetails(collateralId) {

    const processId = this.apiService.api.getAnVehicleCollateralDetails.processId;
    const workflowId = this.apiService.api.getAnVehicleCollateralDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "collateralId": collateralId
      },
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }



  // 2.method for save or update vehicle details

  saveOrUpdateVehcicleDetails(vehicleDetails, leadId, vehicleId, userId) {

    const processId = this.apiService.api.saveOrUpdateVehicleCollateralDetails.processId;
    const workflowId = this.apiService.api.saveOrUpdateVehicleCollateralDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {

        "vehicleDetails": vehicleDetails,
        "leadId": leadId,
        "vehicleId": vehicleId,
        "userId": userId
      },
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

  getVehicleMasterFromRegion(region) {

    const processId = this.apiService.api.getVehicleMasterFromRegion.processId;
    const workflowId = this.apiService.api.getVehicleMasterFromRegion.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {

        "region": 'TN'

      },
      workflowId: workflowId,
      projectId: projectId
    };
    
    console.log(JSON.stringify(body), 'body')
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }




}
