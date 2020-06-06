import { TestBed } from '@angular/core/testing';

import { IncomeDetailsService } from './income-details.service';

describe('IncomeDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomeDetailsService = TestBed.get(IncomeDetailsService);
    expect(service).toBeTruthy();
  });
});
