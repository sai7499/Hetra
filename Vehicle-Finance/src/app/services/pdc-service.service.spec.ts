import { TestBed } from '@angular/core/testing';

import { PdcServiceService } from './pdc-service.service';

describe('PdcServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdcServiceService = TestBed.get(PdcServiceService);
    expect(service).toBeTruthy();
  });
});
