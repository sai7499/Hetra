import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '@services/http.service';
import { environment } from './../../environments/environment';


import  mLabelsurl  from '../../assets/labels/labels.json';
import  mLabelDDEsurl  from '../../assets/labels/label_credit_vehicle_details.json';
import  mLabelFleetUrl  from '../../assets/labels/labelFleetDetails.json';
import  mLanguageLabelsurl  from '../../assets/labels/labels-hindi.json';

import  mLanguageLabelsurltelugu  from '../../assets/labels/labels-telugu.json';
import  mLanguageLabelsurlenglish  from '../../assets/labels/label_english.json';







@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  isMobile: any;

  // private labelsurl = '../../../../../assets/labels/labels.json';
  // private labelDDEsurl = '../../../../../assets/labels/label_credit_vehicle_details.json';
  // private labelFleetUrl = '../../../../../assets/labels/labelFleetDetails.json';
  // private languageLabelsurl = '../../../../../assets/labels/labels-hindi.json';

  constructor( private httpService: HttpService) { 
    this.isMobile = environment.isMobile;
  }

  getLabelsData(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLabelsurl);
    // }
    return this.createObservableObj(mLabelsurl);
    // return this.httpService.get(this.labelsurl);
    }

 getWelcomeDatatelugu(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLabelsurl);
    // }
    return this.createObservableObj(mLanguageLabelsurltelugu);
    // return this.httpService.get(this.labelsurl);
    }

    
  getWelcomeDataenglish(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLabelsurl);
    // }
    return this.createObservableObj(mLanguageLabelsurlenglish);
    // return this.httpService.get(this.labelsurl);
    }



  getLabelsOfDDEData(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLabelDDEsurl);
    // }
    return this.createObservableObj(mLabelDDEsurl);

    // return this.httpService.get(this.labelDDEsurl);
  }
  getLabelsFleetData(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLabelFleetUrl);
    // }
    return this.createObservableObj(mLabelFleetUrl);

    //return this.httpService.get(this.labelFleetUrl);
  }

  getLanguageLabelData(): Observable<any> {
    // if(this.isMobile) {
    //   return this.createObservableObj(mLanguageLabelsurl);
    // }
    return this.createObservableObj(mLanguageLabelsurl);
    //return this.httpService.get(this.languageLabelsurl);
  }

  createObservableObj(labelsurl:string){
    const obs = new Observable(observer => {
      observer.next(labelsurl);
      observer.complete();
    });
    return obs;
  }
}
