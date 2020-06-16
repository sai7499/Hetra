import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalesDedupeService {
  private dedupeDetails;
  private dedupeParameter;

  setDedupeParameter(parameter) {
    this.dedupeParameter = parameter;
  }

  getDedupeParameter() {
    return this.dedupeParameter;
  }

  setDedupeDetails(details) {
    this.dedupeDetails = details;
  }

  getDedupeDetails() {
    return this.dedupeDetails;
  }
}
