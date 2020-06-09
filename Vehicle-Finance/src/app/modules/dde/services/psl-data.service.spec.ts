import { TestBed } from '@angular/core/testing';

import { PslDataService } from './psl-data.service';

describe('PslDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PslDataService = TestBed.get(PslDataService);
    expect(service).toBeTruthy();
  });
});
