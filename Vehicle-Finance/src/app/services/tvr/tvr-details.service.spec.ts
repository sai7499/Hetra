import { TestBed } from '@angular/core/testing';

import { TvrDetailsService } from './tvr-details.service';

describe('TvrDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TvrDetailsService = TestBed.get(TvrDetailsService);
    expect(service).toBeTruthy();
  });
});
