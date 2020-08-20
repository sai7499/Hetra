import { TestBed } from '@angular/core/testing';

import { PddDetailsService } from './pdd-details.service';

describe('PddDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PddDetailsService = TestBed.get(PddDetailsService);
    expect(service).toBeTruthy();
  });
});
