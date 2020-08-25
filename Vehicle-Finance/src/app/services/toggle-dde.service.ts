import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToggleDdeService {
  /*
      type: 0 means don't show toggle butteon
      type : 1 means read
      type:  2 means read/write
     */

  setOperationType(type: string, labelName?: string, currentUrl?: string) {
    localStorage.setItem('ddeType', type);
    if (type === '0') {
      localStorage.removeItem('ddePath');
      return;
    }
    labelName = 'Back To ' + labelName;
    this.setCurrentPath(labelName, currentUrl);
  }

  getOperationType() {
    return localStorage.getItem('ddeType');
  }

  clearOperationType() {
    localStorage.removeItem('ddeType');
  }

  setCurrentPath(labelName: string, currentUrl: string) {
    localStorage.setItem('ddePath', JSON.stringify({ labelName, currentUrl }));
  }
}
