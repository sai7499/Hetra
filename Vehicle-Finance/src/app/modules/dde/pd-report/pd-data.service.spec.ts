import { TestBed } from '@angular/core/testing';

import { PdDataService } from './pd-data.service';

describe('PdDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdDataService = TestBed.get(PdDataService);
    expect(service).toBeTruthy();
  });
});
