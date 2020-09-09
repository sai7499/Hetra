import { TestBed } from '@angular/core/testing';

import { NegotiationService } from './negotiation.service';

describe('NegotiationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NegotiationService = TestBed.get(NegotiationService);
    expect(service).toBeTruthy();
  });
});
