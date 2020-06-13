import { TestBed } from '@angular/core/testing';

import { TermAcceptanceService } from './term-acceptance.service';

describe('TermAcceptanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TermAcceptanceService = TestBed.get(TermAcceptanceService);
    expect(service).toBeTruthy();
  });
});
