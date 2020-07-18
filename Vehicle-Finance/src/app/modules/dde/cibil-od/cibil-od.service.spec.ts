import { TestBed } from '@angular/core/testing';

import { CibilOdService } from './cibil-od.service';

describe('CibilOdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CibilOdService = TestBed.get(CibilOdService);
    expect(service).toBeTruthy();
  });
});
