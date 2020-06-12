import { TestBed } from '@angular/core/testing';

import { CreditScoreService } from './credit-score.service';

describe('CreditScoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditScoreService = TestBed.get(CreditScoreService);
    expect(service).toBeTruthy();
  });
});
