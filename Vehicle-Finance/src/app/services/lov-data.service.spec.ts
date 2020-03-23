import { TestBed } from '@angular/core/testing';

import { LovDataService } from './lov-data.service';

describe('LovDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LovDataService = TestBed.get(LovDataService);
    expect(service).toBeTruthy();
  });
});
