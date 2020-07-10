import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private labelsurl = 'assets/labels/labels.json';
  private labelDDEsurl = 'assets/labels/label_credit_vehicle_details.json';
  private labelFleetUrl = 'assets/labels/labelFleetDetails.json';
  private languageLabelsurl = 'assets/labels/labels-hindi.json';

  constructor( private httpService: HttpService) { }

  getLabelsData(): Observable<any> {
    return this.httpService.get(this.labelsurl);
    }

  getLabelsOfDDEData(): Observable<any> {
    return this.httpService.get(this.labelDDEsurl);
  }
  getLabelsFleetData(): Observable<any> {
    return this.httpService.get(this.labelFleetUrl);
  }

  getLanguageLabelData(): Observable<any> {
    return this.httpService.get(this.languageLabelsurl);
  }
}
