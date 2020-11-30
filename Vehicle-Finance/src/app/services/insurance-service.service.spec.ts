import { TestBed } from '@angular/core/testing';

import { InsuranceServiceService } from './insurance-service.service';

describe('InsuranceServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsuranceServiceService = TestBed.get(InsuranceServiceService);
    expect(service).toBeTruthy();
  });
});
