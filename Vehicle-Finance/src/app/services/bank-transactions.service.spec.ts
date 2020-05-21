import { TestBed } from '@angular/core/testing';

import { BankTransactionsService } from './bank-transactions.service';

describe('BankTransactionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankTransactionsService = TestBed.get(BankTransactionsService);
    expect(service).toBeTruthy();
  });
});
