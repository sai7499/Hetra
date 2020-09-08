import { TestBed } from '@angular/core/testing';

import { CollateralService } from './collateral.service';

describe('CollateralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollateralService = TestBed.get(CollateralService);
    expect(service).toBeTruthy();
  });
});
