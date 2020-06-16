import { TestBed } from '@angular/core/testing';

import { OtpServiceService } from './otp-service.service';

describe('OtpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtpServiceService = TestBed.get(OtpServiceService);
    expect(service).toBeTruthy();
  });
});
