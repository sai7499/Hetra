import { TestBed } from '@angular/core/testing';

import { ChequeTrackingService } from './cheque-tracking.service';

describe('ChequeTrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChequeTrackingService = TestBed.get(ChequeTrackingService);
    expect(service).toBeTruthy();
  });
});
