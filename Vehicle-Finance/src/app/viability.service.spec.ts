import { TestBed } from '@angular/core/testing';

import { ViabilityService } from './viability.service';

describe('ViabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViabilityService = TestBed.get(ViabilityService);
    expect(service).toBeTruthy();
  });
});
