import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private labelsurl = 'assets/labels/labels.json';

  constructor(private http: HttpClient) {
    // console.log("iam in service label")
   }

  getLabelsData(): Observable<any> {

    // console.log(this.http.get(this.labelsurl))

    return this.http.get(this.labelsurl);

  }
}
