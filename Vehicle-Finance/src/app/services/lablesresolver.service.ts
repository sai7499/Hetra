import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from '../services/http.service';
import { CommomLovService } from '../services/commom-lov-service';
import { ApiService } from './api.service';
import { LabelsService } from './labels.service';
import  mLabelsurl  from '../../assets/labels/labels.json';

@Injectable()
export class LabelsResolverService implements Resolve<any> {
    lablesData: any;
    isMobile: any;
    constructor(
        private httpService: HttpService,
        private labbleService: LabelsService,
        private apiService: ApiService) { 
            this.isMobile = environment.isMobile;
        }
        private labelsurl = './assets/labels/labels.json';
    resolve(route?: ActivatedRouteSnapshot): Observable<any> {
        
        if(this.isMobile) {
            const obs = new Observable(observer => {
                observer.next(mLabelsurl);
                observer.complete();
            });
            return obs;    
        }
                   
        return this.httpService.get(this.labelsurl);
     
    }
}


