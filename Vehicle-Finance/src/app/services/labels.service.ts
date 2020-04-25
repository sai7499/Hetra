import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private labelsurl = 'assets/labels/labels.json';
  private languageLabelsurl = 'assets/labels/labels-hindi.json';

  constructor(private http: HttpClient) {}

  getLabelsData(): Observable<any> {
    return this.http.get(this.labelsurl);
  }

  getLanguageLabelData(): Observable<any> {
    return this.http.get(this.languageLabelsurl);
  }
}
