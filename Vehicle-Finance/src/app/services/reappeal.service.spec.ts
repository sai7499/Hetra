import { TestBed } from '@angular/core/testing';

import { ReappealService } from './reappeal.service';

describe('ReappealService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReappealService = TestBed.get(ReappealService);
    expect(service).toBeTruthy();
  });
});
