import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Base64StorageService {
  private base64Obj = {};

  storeString(key: string, base64String: string) {
    this.base64Obj[key] = base64String;
  }

  getString(key) {
    return this.base64Obj[key];
  }
}
