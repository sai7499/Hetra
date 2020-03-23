import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LovDataService {
  private dataUrl = 'assets/vehicle-details-data/vehicleDataLov.json';

  constructor( private http: HttpClient) { }
 getLovData(): Observable<any> {
  return this.http.get(this.dataUrl);
}
}
