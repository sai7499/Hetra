import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private labelsurl = 'assets/labels/labels.json';
  private labelDDEsurl  = 'assets/labels/dde/vehicle-details/label_basic_vehicle_details.json';
  private languageLabelsurl = 'assets/labels/labels-hindi.json';

  constructor(private http: HttpClient) {}

  getLabelsData(): Observable<any> {
    return this.http.get(this.labelsurl);
  }

  getLabelsOfDDEData(): Observable<any> {
    return this.http.get(this.labelDDEsurl);
  }

  getLanguageLabelData(): Observable<any> {
    return this.http.get(this.languageLabelsurl)
  }
}
