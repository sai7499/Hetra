import { TestBed } from '@angular/core/testing';

import { VehicleValuationService } from './vehicle-valuation.service';

describe('VehicleValuationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleValuationService = TestBed.get(VehicleValuationService);
    expect(service).toBeTruthy();
  });
});
