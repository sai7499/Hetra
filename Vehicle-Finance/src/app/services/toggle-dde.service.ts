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

  setIsDDEClicked() {
    localStorage.setItem('isDdeClicked', '1');
  }

  getDdeClickedValue() {
    return localStorage.getItem('isDdeClicked') === '1';
  }

  getOperationType() {
    return localStorage.getItem('ddeType');
  }

  clearOperationType() {
    localStorage.removeItem('ddeType');
  }

  clearToggleData() {
    localStorage.removeItem('ddeType');
    localStorage.removeItem('ddePath');
    localStorage.removeItem('isDdeClicked');
  }

  setCurrentPath(labelName: string, currentUrl: string) {
    localStorage.setItem('ddePath', JSON.stringify({ labelName, currentUrl }));
  }
}
