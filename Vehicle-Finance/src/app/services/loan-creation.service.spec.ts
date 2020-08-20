import { TestBed } from '@angular/core/testing';

import { LoanCreationService } from './loan-creation.service';

describe('LoanCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanCreationService = TestBed.get(LoanCreationService);
    expect(service).toBeTruthy();
  });
});
