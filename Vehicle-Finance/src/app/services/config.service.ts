import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
  })

  export class ConfigService {
    configurationData;
      constructor(private http: HttpClient) {
        
      }

      getConfig() {
        return this.http.get('assets/config.json');
      }

      setConfig(data) {
        return this.configurationData = data;
      }
  }
