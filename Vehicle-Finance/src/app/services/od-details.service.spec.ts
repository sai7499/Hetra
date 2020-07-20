import { TestBed } from '@angular/core/testing';

import { OdDetailsService } from './od-details.service';

describe('OdDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OdDetailsService = TestBed.get(OdDetailsService);
    expect(service).toBeTruthy();
  });
});
