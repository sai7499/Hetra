import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Base64StorageService {
  private base64Obj = {};

  storeString(key: string, value) {
    this.base64Obj[key] = value;
  }

  getString(key) {
    return this.base64Obj[key];
  }
}
