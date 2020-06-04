import { TestBed } from '@angular/core/testing';

import { FleetDetailsService } from './fleet-details.service';

describe('FleetDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetDetailsService = TestBed.get(FleetDetailsService);
    expect(service).toBeTruthy();
  });
});
