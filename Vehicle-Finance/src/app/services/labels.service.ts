import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@services/http.service';
import { environment } from './../../environments/environment';


import  mLabelsurl  from '../../assets/labels/labels.json';
import  mLabelDDEsurl  from '../../assets/labels/label_credit_vehicle_details.json';
import  mLabelFleetUrl  from '../../assets/labels/labelFleetDetails.json';
import  mLanguageLabelsurl  from '../../assets/labels/labels-hindi.json';

import  mLanguageLabelsurltelugu  from '../../assets/labels/labels-telugu.json';
import  mLanguageLabelsurlenglish  from '../../assets/labels/label_english.json';
import  mLanguageLabelsurlkanada  from '../../assets/labels/labels_kanada.json';
import  mLanguageLabelsurlmarati  from '../../assets/labels/labels_marathi.json';
import  mLanguageLabelsurlgujarati from '../../assets/labels/label_gujarati.json';
import  mLanguageLabelsurlhindi from '../../assets/labels/label_hindi.json';
import  mLanguageLabelsurltamil from '../../assets/labels/label_tamil.json';
import mChildLoanLabels from '../../assets/jsonData/child-loan.json';

import commonLables from '../../assets/jsonData/common-fields.json';


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

    getWelcomeDatakanada(): Observable<any> {
      // if(this.isMobile) {
      //   return this.createObservableObj(mLabelsurl);
      // }
      return this.createObservableObj(mLanguageLabelsurlkanada);
      // return this.httpService.get(this.labelsurl);
      }

      getWelcomeDatamarati(): Observable<any> {
        // if(this.isMobile) {
        //   return this.createObservableObj(mLabelsurl);
        // }
        return this.createObservableObj(mLanguageLabelsurlmarati);
        // return this.httpService.get(this.labelsurl);
        }
    getWelcomeDatahindi(): Observable<any> {
        // if(this.isMobile) {
        //   return this.createObservableObj(mLabelsurl);
        // }
        return this.createObservableObj(mLanguageLabelsurlhindi);
        // return this.httpService.get(this.labelsurl);
         }
    getWelcomeDatatamil(): Observable<any> {
        // if(this.isMobile) {
        //   return this.createObservableObj(mLabelsurl);
        // }
        return this.createObservableObj(mLanguageLabelsurltamil);
        // return this.httpService.get(this.labelsurl);
         }    
      getWelcomeDatagujarati(): Observable<any> {
        // if(this.isMobile) {
        //   return this.createObservableObj(mLabelsurl);
        // }
        return this.createObservableObj(mLanguageLabelsurlgujarati);
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

  getChildLoanConditionData(): Observable<any> {
    return this.createObservableObj(mChildLoanLabels);
  }

  getCommonFieldData(): Observable<any> {
    try {
      return this.createObservableObj(commonLables);
    } catch (error) {
      
    }
  }

  createObservableObj(labelsurl:string){
    const obs = new Observable(observer => {
      observer.next(labelsurl);
      observer.complete();
    });
    return obs;
  }
}
