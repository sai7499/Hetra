import { TestBed } from '@angular/core/testing';

import { CustomerAcceptanceServiceService } from './customer-acceptance-service.service';

describe('CustomerAcceptanceServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerAcceptanceServiceService = TestBed.get(CustomerAcceptanceServiceService);
    expect(service).toBeTruthy();
  });
});
