import { TestBed } from '@angular/core/testing';

import { ApplicantImageService } from './applicant-image.service';

describe('ApplicantImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicantImageService = TestBed.get(ApplicantImageService);
    expect(service).toBeTruthy();
  });
});
