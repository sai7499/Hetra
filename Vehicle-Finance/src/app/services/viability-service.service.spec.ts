import { TestBed } from '@angular/core/testing';

import { ViabilityServiceService } from './viability-service.service';

describe('ViabilityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViabilityServiceService = TestBed.get(ViabilityServiceService);
    expect(service).toBeTruthy();
  });
});
