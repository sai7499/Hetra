import { TestBed } from '@angular/core/testing';

import { SaveUpdateApplicantService } from './save-update-applicant.service';

describe('SaveUpdateApplicantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveUpdateApplicantService = TestBed.get(SaveUpdateApplicantService);
    expect(service).toBeTruthy();
  });
});
