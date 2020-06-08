import { TestBed } from '@angular/core/testing';

import { ExposureService } from './exposure.service';

describe('ExposureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExposureService = TestBed.get(ExposureService);
    expect(service).toBeTruthy();
  });
});
