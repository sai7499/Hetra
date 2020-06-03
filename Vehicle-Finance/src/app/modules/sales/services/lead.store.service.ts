import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeadStoreService {
  private leadId: number;

  setLeadId(id: number) {
    this.leadId = id;
  }

  getLeadId() {
    return this.leadId;
  }
}
