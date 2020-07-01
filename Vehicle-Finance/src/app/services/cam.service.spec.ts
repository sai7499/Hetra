import { TestBed } from '@angular/core/testing';

import { CamService } from './cam.service';

describe('CamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CamService = TestBed.get(CamService);
    expect(service).toBeTruthy();
  });
});
