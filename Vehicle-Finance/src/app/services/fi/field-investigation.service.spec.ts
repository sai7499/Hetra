import { TestBed } from '@angular/core/testing';

import { FieldInvestigationService } from './field-investigation.service';

describe('FieldInvestigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FieldInvestigationService = TestBed.get(FieldInvestigationService);
    expect(service).toBeTruthy();
  });
});
