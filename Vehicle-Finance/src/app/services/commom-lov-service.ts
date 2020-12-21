import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Categories } from '@model/upload-model';
import { LabelsService } from './labels.service';

Injectable({
  providedIn: 'root',
});
export class CommomLovService {
  lovData: any;
  documentCategories: Categories[];
  searchLoanData: any;

  setLovData(LOVsData) {
    this.lovData = LOVsData;
  }

  getLovData(): Observable<any> {
    return of(this.lovData);
  }

  setDocumentCategories(value) {
    this.documentCategories = value.categories || [];
  }

  getDocumentCategories() {
    return this.documentCategories;
  }

  setSearchLoan(value) {
    this.searchLoanData = value;
  }

  getSearchLoan() {
    return this.searchLoanData;
  }

}
